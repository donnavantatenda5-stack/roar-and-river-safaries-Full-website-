import { NextResponse } from "next/server";
import {
  SAVE_LEAD_DECLARATION,
  buildSystemPrompt,
  buildToursContext,
  buildWeatherContext,
  parseChatMessages,
  saveLead,
  takeRateLimit,
  waitForNaturalPause,
  type GeminiContent,
  type GeminiPart,
} from "@/lib/assistant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const SUPPORTS_THINKING_LEVEL = MODEL.toLowerCase().startsWith("gemini-3");

type GeminiResponse = {
  candidates?: {
    content?: { role?: string; parts?: GeminiPart[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
};

type FunctionCallPart = GeminiPart & {
  functionCall: { name: string; args?: Record<string, unknown> };
};

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

function textFromParts(parts: GeminiPart[] | undefined): string {
  return (parts ?? [])
    .filter((part) => typeof part.text === "string" && !part.thought)
    .map((part) => part.text as string)
    .join("\n")
    .trim();
}

function isFunctionCallPart(part: GeminiPart): part is FunctionCallPart {
  return Boolean(part.functionCall && typeof part.functionCall.name === "string");
}

async function callGemini(
  apiKey: string,
  system: string,
  contents: GeminiContent[]
): Promise<GeminiResponse> {
  const response = await fetch(
    `${API_BASE}/${encodeURIComponent(MODEL)}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents,
        tools: [{ functionDeclarations: [SAVE_LEAD_DECLARATION] }],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          ...(SUPPORTS_THINKING_LEVEL
            ? { thinkingConfig: { thinkingLevel: "MINIMAL" } }
            : {}),
        },
      }),
      signal: AbortSignal.timeout(30000),
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Gemini API ${response.status}: ${detail.slice(0, 300)}`);
  }

  const data = (await response.json()) as GeminiResponse;
  if (data.error?.message) throw new Error(data.error.message);

  return data;
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "The assistant is not configured yet. Please use the booking form at /book or message us on WhatsApp.",
      },
      { status: 503 }
    );
  }

  const limit = takeRateLimit(getClientIp(request));
  if (!limit.allowed) {
    return NextResponse.json(
      {
        error:
          "You've sent quite a few messages. Please wait a few minutes and try again, or use the booking form at /book.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = (body as { messages?: unknown } | null)?.messages;
  const parsed = parseChatMessages(messages);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [toursContext, weatherContext] = await Promise.all([
      buildToursContext(),
      buildWeatherContext(),
    ]);

    const contents: GeminiContent[] = parsed.messages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    }));

    // Gemini expects the conversation to start with the visitor.
    while (contents.length > 0 && contents[0].role === "model") {
      contents.shift();
    }

    let reply = "";
    let leadSaved = false;

    // At most three model turns: one reply, then optionally a tool result turn.
    for (let turn = 0; turn < 3; turn += 1) {
      const response = await callGemini(
        apiKey,
        buildSystemPrompt(toursContext, weatherContext),
        contents
      );

      if (response.promptFeedback?.blockReason) {
        reply =
          "Sorry, I can't help with that. Ask me about our tours, activities, prices or planning your Victoria Falls trip.";
        break;
      }

      const candidate = response.candidates?.[0];
      const parts = candidate?.content?.parts ?? [];
      const text = textFromParts(parts);
      const functionCalls = parts.filter(isFunctionCallPart);

      if (functionCalls.length === 0) {
        reply = text;
        break;
      }

      if (text) reply = text;

      contents.push({
        role: "model",
        parts: parts.length > 0 ? parts : functionCalls,
      });

      const functionResponses: GeminiPart[] = [];

      for (const part of functionCalls) {
        const { name, args } = part.functionCall;

        if (name === SAVE_LEAD_DECLARATION.name) {
          const result = await saveLead(args);
          if (result.saved) leadSaved = true;

          functionResponses.push({
            functionResponse: {
              name,
              response: { saved: result.saved, message: result.message },
            },
          });
        } else {
          functionResponses.push({
            functionResponse: {
              name,
              response: { saved: false, message: "Unknown tool." },
            },
          });
        }
      }

      contents.push({ role: "user", parts: functionResponses });
    }

    if (!reply) {
      reply = leadSaved
        ? "Thanks, I've passed your details to our local team. They'll be in touch within 24 hours. Want me to help with anything else?"
        : "Sorry, I couldn't put a reply together just now. Please try again, or use the booking form at /book.";
    }

    // Never answer instantly: wait out the remaining part of the five-second minimum.
    await waitForNaturalPause(startedAt);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(
      "Assistant request failed:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      {
        error:
          "Sorry, the assistant is unavailable right now. Please try again or use the booking form at /book.",
      },
      { status: 502 }
    );
  }
}

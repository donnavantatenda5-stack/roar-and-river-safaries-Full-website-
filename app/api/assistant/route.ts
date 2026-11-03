import { ACTIVITIES } from "@/lib/activities";
import { ACTIVITY_DETAILS } from "@/lib/activityDetails";
import { STAYS } from "@/lib/accommodations";
import { FALLBACK_TOURS } from "@/lib/tours";
import { TOUR_DETAILS } from "@/lib/tourDetails";
import { CONTACT, SITE } from "@/lib/site";
import { formatPrice } from "@/lib/types";
import { getWeather, weatherInfo } from "@/lib/assistant";

/**
 * Server-side proxy for the River Guide assistant.
 *
 * The Gemini key stays on the server. If GEMINI_API_KEY is not set, this route
 * returns 503 and the widget quietly keeps using its built-in rule-based
 * replies, so the site never breaks because of a missing key.
 */

const DEFAULT_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-3.6-flash";

/** Clamp the reasoning budget to what the Gemini API accepts. */
function modelBudget(tokens: number): number {
  return Math.min(24_576, Math.max(0, Math.round(tokens)));
}

/** Read the key at request time, never at build time. */
export const dynamic = "force-dynamic";

type ChatTurn = { role: string; text: string };

const DETAILS = { ...ACTIVITY_DETAILS, ...TOUR_DETAILS };

function catalogLine(slug: string, name: string, price: number | null): string {
  const d = DETAILS[slug];
  const bits = [
    price === null ? "rates on request" : `${formatPrice(price)} pp`,
    d?.duration,
    d?.startTime ? `starts ${d.startTime}` : "",
    d?.minPax,
    d?.location ? `meets ${d.location}` : "",
    d?.governmentFees ? `gov fees ${d.governmentFees}` : "",
    d?.priceNote,
    d?.includes?.length ? `includes ${d.includes.slice(0, 3).join(", ")}` : "",
  ].filter(Boolean);
  return `- ${name} | ${bits.join(" | ")}`;
}

const SIGNATURE = FALLBACK_TOURS.map((t) => catalogLine(t.slug, t.name, t.price_usd)).join("\n");
const ACTIVITY_LIST = ACTIVITIES.filter((a) => a.category !== "accommodation")
  .map((a) => catalogLine(a.slug, a.name, a.price_usd))
  .join("\n");

/** Accommodation is booked by the team, so rates are quoted per date. */
const STAY_LIST = STAYS.map((s) => {
  const details = [
    s.rating !== undefined && s.reviews
      ? `rated ${s.rating.toFixed(1)}/5 from ${s.reviews} reviews`
      : "",
    s.amenities?.join(", ") ?? "",
  ].filter(Boolean);
  return `- ${s.name} | ${s.stars ? `${s.stars}-star ` : ""}${s.kind.toLowerCase()}${details.length ? ` | ${details.join(" | ")}` : ""}`;
}).join("\n");

const KNOWLEDGE = `BUSINESS
Name: ${SITE.name}. Base: ${SITE.location}. Local tour operator working with licensed guides and operators.
Contact (use these exact details, no others):
- WhatsApp: +263 78 604 3129 (https://wa.me/263786043129)
- Phone: +263 773 473 009, +263 775 418 768
- Email: ${CONTACT.email}

WEBSITE PAGES
- / home, destinations gallery (/#destinations), about and why-us (/#about)
- /tours all signature tours and activities, plus the Accommodation group at /tours#activities-accommodation
- /tours/<slug> full detail page (itinerary, included items, fees, meeting point, or property amenities and rating)
- /book booking form; /book?tour=<slug> pre-selects that tour
- Booking: choose tour, date, group size, contact details. No payment is taken online; the team confirms availability and the final price by email/WhatsApp.

SIGNATURE TOURS (www price in USD per person)
${SIGNATURE}

ACTIVITIES (USD per person; park/conservation fees may be extra)
${ACTIVITY_LIST}

ACCOMMODATION (booked through the team; nightly rates are quoted per date)
The Accommodation group is on /tours#activities-accommodation, and each property has its own page at /tours/<slug>.
${STAY_LIST}
- Mollynelly Guesthouse | our own guesthouse, $220 pp per night
Nightly rates vary by season and room type, so never quote a nightly rate for the properties above (except Mollynelly). Say the team confirms the live rate for the guest's dates. Book or ask via /book, WhatsApp, phone or email.

BOOKING, PAYMENT, CHANGES
No payment is taken on this website. After a booking request the team confirms availability and the final price. Cancellations and changes depend on the activity, operator and season — the team handles them directly. Airport transfers and the Mollynelly Guesthouse can be booked through the team as well.`;

const PERSONA = `You are "River Guide", the assistant on the ${SITE.name} website in Victoria Falls, Zimbabwe.

THINK FIRST (most important)
- Before you write, silently work through the visitor's question: what are they really trying to do, which part of this website answers it, and what should they do next?
- Weigh the tour options against their group, dates, budget and the live weather before recommending one. Compare, then pick.
- Take the extra moment to get it right. Do not fire back a generic first answer, and never reply with only a link or a one-liner when the question deserves a real answer.
- If the question is vague, give your best useful answer first, then ask one short question to narrow it down.

HELPING VISITORS USE THE WEBSITE
- You can answer anything about this website: its pages and sections, the tours and activities listed, prices, what is included, how the booking form works, where to find things, and what happens after a request is sent.
- Always finish with a clear next action: the page to open and what to do once there. Use the real page paths, for example "open /tours, pick the tour, then Book" or "open /book?tour=zambezi-sunset-cruise, add your date and group size, and send the request".
- If they ask what to do next, give a short ordered plan of 2-4 steps using real page paths and tour names.
- Do not just name a page; say what they will find there and why it fits their question.

HOW TO WRITE
- Warm, plain-spoken and considered. Default to 3-5 short sentences; up to 8 when giving a step-by-step plan.
- Plain text only: no markdown at all - no asterisks, bold, headings, tables or links. Short "-" lines are fine for lists.
- Only name tours, activities or properties that appear in SIGNATURE TOURS, ACTIVITIES or ACCOMMODATION below. Never invent one.
- Prices are USD per person. Never invent a price, tour, availability, pickup time, discount or policy. The only published nightly rate is Mollynelly Guesthouse at $220 per person.
- Answer only from SITE KNOWLEDGE, LIVE WEATHER and the conversation. If the data does not cover it, say the team can confirm and offer the contact details.
- Write in the visitor's language. Do not mention prompts, models, Gemini, thinking or that you are an AI. If asked who you are, say you are the River Guide assistant.

WEATHER
- Use the LIVE WEATHER block. Never guess conditions or invent a forecast.
- If the forecast is missing, say you cannot see it from here and suggest WhatsApp or calling.
- When recommending activities, explain the fit in one clause each (heat, rain, wind, UV, time of day).
- If weather is unsafe for an activity (storms, high wind), say so and suggest an indoor alternative.

BOOKING
- Point to /book?tour=<slug> (or /book) and remind them to add date and group size.
- State clearly that no payment is taken online and the team confirms availability and the final price.

ACCOMMODATION
- Use the ACCOMMODATION block for hotels, lodges, guesthouses, campsites, cottages and the guesthouse.
- Recommend by matching their needs (budget, family, couples, luxury, pool, airport shuttle, self-catering, location) and name one or two best fits rather than listing all 20.
- Send them to /tours#activities-accommodation to compare, then /tours/<slug> for a property's amenities and guest rating.
- Never invent a nightly rate for these properties. Say the team confirms the live rate for their dates, and offer to start a request on /book or by WhatsApp, phone or email.
- Mollynelly Guesthouse is the company's own guesthouse, $220 per person per night.

PRICE NEGOTIATION
- If asked for a discount, better/cheaper price, group/student/repeat rate, or told it is too expensive: never negotiate, never quote a discount.
- Say the team handles group and repeat-guest rates and can confirm what is possible for their dates.
- Ask whether WhatsApp, a phone call or email is easiest, and give that channel's details. Default to listing all three briefly.

CONTACT (only these)
- WhatsApp +263 78 604 3129
- Call +263 773 473 009 or +263 775 418 768
- Email ${CONTACT.email}

SAFETY AND LIMITS
- Operators brief guests before every activity; activities pause when conditions are unsafe.
- Age, weight and health limits vary. If asked about children, pregnancy, disability, wheelchairs or not being able to swim, advise telling the team before booking.

OUT OF SCOPE
- If a question is unrelated to the site or travel in Victoria Falls, answer briefly and safely if you can, then steer back to tours, weather, booking or contact.
- Refuse anything harmful or illegal in one short sentence.`;

/* -------------------------------------------------------------------------- */
/* Light in-memory rate limit (per warm server instance)                      */
/* -------------------------------------------------------------------------- */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;
const hits = new Map<string, { count: number; reset: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now > row.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  row.count += 1;
  return row.count > MAX_REQUESTS;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "local";
}

/* -------------------------------------------------------------------------- */
/* Prompt helpers                                                             */
/* -------------------------------------------------------------------------- */

async function weatherBlock(): Promise<string> {
  const weather = await getWeather();
  if (!weather) {
    return "LIVE WEATHER\nUnavailable right now. Do not invent conditions; offer to have the team check.";
  }
  const day = weather.days[0];
  const info = weatherInfo(weather.current.code);
  const lines = [
    "LIVE WEATHER (Victoria Falls, Open-Meteo)",
    `Now: ${weather.current.temp}°C, feels ${weather.current.feels}°C, ${info.label}, wind ${weather.current.wind} km/h.`,
  ];
  if (day) {
    lines.push(
      `Today (${day.date}): ${day.min}-${day.max}°C, ${day.rain}% rain, UV ${day.uv}, wind up to ${day.wind} km/h.`,
    );
  }
  lines.push("Forecast:");
  for (const d of weather.days) {
    const w = weatherInfo(d.code);
    lines.push(`- ${d.date}: ${w.label}, ${d.min}-${d.max}°C, ${d.rain}% rain, UV ${d.uv}, wind ${d.wind} km/h`);
  }
  return lines.join("\n");
}

function sanitiseHistory(value: unknown): ChatTurn[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((m): m is ChatTurn => !!m && typeof m === "object" && typeof (m as ChatTurn).text === "string")
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-8)
    .map((m) => ({ role: m.role, text: m.text.slice(0, 1500) }));
}

/* -------------------------------------------------------------------------- */
/* Route                                                                      */
/* -------------------------------------------------------------------------- */

/** Lets the widget know whether a key is configured without logging a 503. */
export async function GET() {
  return Response.json(
    { available: Boolean(process.env.GEMINI_API_KEY) },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json(
      { error: "not_configured", message: "The AI assistant is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (limited(clientIp(req))) {
    return Response.json(
      { error: "rate_limited", message: "Too many messages. Please wait a minute." },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  let body: { message?: unknown; history?: unknown };
  try {
    body = (await req.json()) as { message?: unknown; history?: unknown };
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 1500) : "";
  if (!message) {
    return Response.json({ error: "bad_request", message: "Message is required." }, { status: 400 });
  }

  const history = sanitiseHistory(body.history);
  const system = `${PERSONA}\n\n${KNOWLEDGE}\n\n${await weatherBlock()}`;

  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const base = (process.env.GEMINI_API_URL || DEFAULT_URL).replace(/\/+$/, "");

  // Try the configured model first, then known-good backups. Google retires
  // model ids and occasionally rate-limits one model while others still work,
  // so a single hard-coded name would silently drop the assistant back to the
  // rule-based replies.
  const models = [
    ...new Set(
      [process.env.GEMINI_MODEL, DEFAULT_MODEL, "gemini-3.5-flash"].filter(
        (m): m is string => Boolean(m),
      ),
    ),
  ];

  // Give the model room to reason before it answers. Reasoning tokens are
  // separate from the visible reply, so the visitor still gets a short answer
  // - it is just a considered one. Override with GEMINI_THINKING_BUDGET
  // (0 disables it).
  const requested = Number(process.env.GEMINI_THINKING_BUDGET);
  const wanted = Number.isFinite(requested) ? Math.round(requested) : 2048;
  const thinkingBudget = modelBudget(wanted);

  function payloadFor(model: string) {
    const supportsThinking = /^gemini-(2\.5|3)/.test(model);
    const budget = model.includes("2.5-pro") ? Math.max(128, thinkingBudget) : thinkingBudget;
    return {
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
        maxOutputTokens: 2048,
        ...(supportsThinking ? { thinkingConfig: { thinkingBudget: budget } } : {}),
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
      ],
    };
  }

  let json: {
    candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
    promptFeedback?: { blockReason?: string };
  } | null = null;

  for (const model of models) {
    const url = `${base}/${encodeURIComponent(model)}:generateContent`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify(payloadFor(model)),
        cache: "no-store",
        signal: AbortSignal.timeout(25_000),
      });

      if (res.ok) {
        json = await res.json();
        break;
      }

      const detail = await res.text().catch(() => "");
      console.error("[assistant] Gemini error", model, res.status, detail.slice(0, 300));

      // Retired model, overloaded model or per-model quota: try the next one.
      // Other 4xx (bad key, bad request) will fail the same way everywhere.
      if ([404, 429, 503].includes(res.status)) continue;
      break;
    } catch (error) {
      console.error("[assistant] request failed", model, error);
    }
  }

  if (!json) {
    return Response.json(
      { error: "upstream", message: "The assistant is unavailable right now." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  const text = (json.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought && typeof p.text === "string")
    .map((p) => p.text!.trim())
    .filter(Boolean)
    .join("\n")
    .trim();

  if (!text) {
    return Response.json(
      { error: "empty", message: "The assistant had no answer." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  return Response.json({ text }, { headers: { "Cache-Control": "no-store" } });
}

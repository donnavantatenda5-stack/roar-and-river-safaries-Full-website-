import { z } from "zod";
import { getTours } from "@/lib/tours";
import { formatPrice, type Tour } from "@/lib/types";
import { ACTIVITIES, ACTIVITY_CATEGORIES, type Activity } from "@/lib/activities";
import { TOUR_DETAILS, tourDetail } from "@/lib/tourDetails";

/** Chat history we forward to Gemini. Older messages are dropped. */
export const MAX_HISTORY_MESSAGES = 12;
export const MAX_MESSAGE_CHARS = 1500;
export const MAX_REQUEST_CHARS = 16000;
export const MAX_INPUT_MESSAGES = 40;

/**
 * The assistant should feel like a person replying, not a machine gun.
 * Every reply waits at least five seconds; a little jitter keeps it natural.
 */
export const MIN_RESPONSE_DELAY_MS = 5000;
const DELAY_JITTER_MS = 1200;

/** Simple in-memory limit: 20 messages per IP every 10 minutes. */
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const RATE_LIMIT_MAX_REQUESTS = 20;

export type ChatRole = "user" | "assistant";
export type ChatMessage = { role: ChatRole; content: string };

export type ParseResult =
  | { ok: true; messages: ChatMessage[] }
  | { ok: false; error: string };

export function parseChatMessages(input: unknown): ParseResult {
  if (!Array.isArray(input)) {
    return { ok: false, error: "messages must be an array." };
  }
  if (input.length === 0) {
    return { ok: false, error: "Please send a message." };
  }
  if (input.length > MAX_INPUT_MESSAGES) {
    return { ok: false, error: "Too many messages. Please start a new chat." };
  }

  const messages: ChatMessage[] = [];
  let totalChars = 0;

  for (const raw of input) {
    if (!raw || typeof raw !== "object") {
      return { ok: false, error: "Invalid message." };
    }

    const role = (raw as { role?: unknown }).role;
    const content = (raw as { content?: unknown }).content;

    if (role !== "user" && role !== "assistant") {
      return { ok: false, error: "Invalid message role." };
    }
    if (typeof content !== "string") {
      return { ok: false, error: "Invalid message content." };
    }

    const text = content.trim();
    if (!text) {
      return { ok: false, error: "Messages cannot be empty." };
    }
    if (text.length > MAX_MESSAGE_CHARS) {
      return {
        ok: false,
        error: `Please keep each message under ${MAX_MESSAGE_CHARS} characters.`,
      };
    }

    totalChars += text.length;
    if (totalChars > MAX_REQUEST_CHARS) {
      return { ok: false, error: "This chat has grown too long. Please start a new chat." };
    }

    messages.push({ role, content: text });
  }

  const recent = messages.slice(-MAX_HISTORY_MESSAGES);
  if (recent[recent.length - 1]?.role !== "user") {
    return { ok: false, error: "The last message must be from the visitor." };
  }

  return { ok: true, messages: recent };
}

const MAX_DESCRIPTION_CHARS = 170;

function trimDescription(text?: string | null): string {
  const clean = text?.replace(/\s+/g, " ").trim();
  if (!clean) return "";
  return clean.length > MAX_DESCRIPTION_CHARS
    ? `${clean.slice(0, MAX_DESCRIPTION_CHARS - 3)}...`
    : clean;
}

function describeTour(tour: Tour): string {
  const detail = TOUR_DETAILS[tour.slug];
  const details = [formatPrice(tour.price_usd, tour.price_label)];

  const duration = detail?.duration ?? tour.duration;
  if (duration) details.push(duration);
  if (tour.category) details.push(tour.category);
  if (detail?.startTime) details.push(`starts ${detail.startTime}`);
  if (detail?.minPax) details.push(detail.minPax);
  if (detail?.governmentFees) details.push(`plus ${detail.governmentFees}`);
  if (detail?.priceNote) details.push(detail.priceNote);
  if (detail?.variants?.length) {
    details.push(detail.variants.map((v) => `${v.label} $${v.priceUsd}`).join(", "));
  }

  const description = trimDescription(tour.description ?? detail?.summary);
  if (description) details.push(description);

  return `- ${tour.name}: ${details.join(" | ")}`;
}

function describeActivity(activity: Activity): string {
  const detail = tourDetail(activity.slug);
  const details = [formatPrice(activity.price_usd, activity.price_label)];

  const duration = detail?.duration ?? activity.duration;
  if (duration) details.push(duration);
  if (detail?.startTime) details.push(`starts ${detail.startTime}`);
  if (detail?.minPax) details.push(detail.minPax);
  if (detail?.governmentFees) details.push(`plus ${detail.governmentFees}`);
  if (detail?.priceNote) details.push(detail.priceNote);

  const description = trimDescription(activity.description ?? detail?.summary);
  if (description) details.push(description);

  return `- ${activity.name}: ${details.join(" | ")}`;
}

/**
 * Everything the assistant is allowed to talk about: the live signature tours,
 * the full activity catalog and the accommodation list, grouped by category.
 */
export async function buildToursContext(): Promise<string> {
  try {
    const sections: string[] = [];

    const tours = await getTours();
    if (tours.length > 0) {
      sections.push(
        `SIGNATURE TOURS (live website prices):\n${tours.map(describeTour).join("\n")}`
      );
    } else {
      sections.push("No signature tours are listed right now.");
    }

    const activitySections = ACTIVITY_CATEGORIES.map((category) => {
      const items = ACTIVITIES.filter((activity) => activity.category === category.id);
      if (items.length === 0) return "";
      return `${category.label.toUpperCase()}:\n${items.map(describeActivity).join("\n")}`;
    }).filter(Boolean);

    if (activitySections.length > 0) {
      sections.push(`ACTIVITIES AND ACCOMMODATION:\n${activitySections.join("\n\n")}`);
    }

    return sections.join("\n\n");
  } catch {
    return "Tour data is temporarily unavailable. Direct visitors to the booking form at /book or WhatsApp.";
  }
}

const VICTORIA_FALLS = { latitude: -17.9243, longitude: 25.8572 };

const WEATHER_CODES: Record<number, string> = {
  0: "clear sky",
  1: "mainly clear",
  2: "partly cloudy",
  3: "overcast",
  45: "fog",
  48: "freezing fog",
  51: "light drizzle",
  53: "drizzle",
  55: "heavy drizzle",
  61: "light rain",
  63: "rain",
  65: "heavy rain",
  80: "light rain showers",
  81: "rain showers",
  82: "heavy rain showers",
  95: "thunderstorms",
  96: "thunderstorms with hail",
  99: "severe thunderstorms with hail",
};

function weatherLabel(code: number | undefined): string {
  if (code === undefined) return "mixed conditions";
  return WEATHER_CODES[code] ?? "mixed conditions";
}

const SEASONAL_GUIDE = `Seasonal weather and activity fit for Victoria Falls:
- Cool, dry season (roughly May to August): cold mornings and evenings, often 5-12°C, with mild sunny days. Best for game drives, walking safaris, the guided Falls tour, cultural tours, helicopter and microlight flights, and the bridge adrenaline activities. Pack a warm layer for sunrise drives and sunset cruises; the river is cold for rafting, canoeing and swimming.
- Hot, dry season (roughly September to November): hot and dry, often 30-40°C, with low water. Best for Devil's Pool (usually open), white water rafting (best low-water rapids), early-morning game drives and sunset cruises. Avoid strenuous midday activities and drink plenty of water.
- Hot, wet season (roughly December to March): hot and humid with afternoon thunderstorms. Best for the Falls tour (full spray), sunset cruises, cultural activities and indoor options. Rafting, bungee, zipline, gorge swing and flights can be cancelled or delayed by rain.
- High-water season (roughly February to May): the Falls are at their fullest with heavy spray. Devil's Pool is usually closed; rafting and bridge activities can be limited by high water and rain. Waterproofs and dry bags are useful.`;

function buildLiveWeather(data: {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    wind_speed_10m?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
  };
}): string[] {
  const lines: string[] = [];
  const current = data.current;

  if (current && typeof current.temperature_2m === "number") {
    const feels =
      typeof current.apparent_temperature === "number"
        ? ` (feels like ${Math.round(current.apparent_temperature)}°C)`
        : "";
    const wind =
      typeof current.wind_speed_10m === "number"
        ? `, wind ${Math.round(current.wind_speed_10m)} km/h`
        : "";

    lines.push(
      `Current weather at Victoria Falls: ${Math.round(current.temperature_2m)}°C${feels}, ${weatherLabel(current.weather_code)}${wind}.`
    );

    const feelsLike = current.apparent_temperature ?? current.temperature_2m;
    if (feelsLike < 18) {
      lines.push(
        "It is cool right now. Advise a warm layer, especially for mornings, evenings and time on the water."
      );
    } else if (feelsLike > 30) {
      lines.push(
        "It is hot right now. Advise sun protection, plenty of water and avoiding strenuous midday activity."
      );
    } else {
      lines.push("Temperatures are mild right now.");
    }
  }

  const daily = data.daily;
  if (daily?.time?.length) {
    const days = daily.time.slice(0, 3).map((date, index) => {
      const max = daily.temperature_2m_max?.[index];
      const min = daily.temperature_2m_min?.[index];
      const rain = daily.precipitation_probability_max?.[index];
      const bits: string[] = [];

      if (typeof max === "number" && typeof min === "number") {
        bits.push(`${Math.round(min)}-${Math.round(max)}°C`);
      }
      bits.push(weatherLabel(daily.weather_code?.[index]));
      if (typeof rain === "number") bits.push(`${rain}% rain`);

      return `${date}: ${bits.join(", ")}`;
    });

    lines.push(`3-day outlook: ${days.join("; ")}.`);
  }

  return lines;
}

/** Live conditions plus a seasonal guide, so the assistant can talk about weather sensibly. */
export async function buildWeatherContext(): Promise<string> {
  const fallback = `Live weather is unavailable right now, so describe typical conditions only.\n${SEASONAL_GUIDE}`;

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(VICTORIA_FALLS.latitude));
    url.searchParams.set("longitude", String(VICTORIA_FALLS.longitude));
    url.searchParams.set(
      "current",
      "temperature_2m,apparent_temperature,weather_code,wind_speed_10m"
    );
    url.searchParams.set(
      "daily",
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
    );
    url.searchParams.set("timezone", "Africa/Harare");
    url.searchParams.set("forecast_days", "3");

    const response = await fetch(url, {
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 1800 },
    });

    if (!response.ok) return fallback;

    const data = (await response.json()) as Parameters<typeof buildLiveWeather>[0];
    const lines = buildLiveWeather(data);

    if (lines.length === 0) return fallback;

    return `${lines.join("\n")}\n${SEASONAL_GUIDE}`;
  } catch {
    return fallback;
  }
}

export function buildSystemPrompt(catalogContext: string, weatherContext: string): string {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || "263786043129";
  const contact = `WhatsApp: https://wa.me/${whatsapp}
Email: donnavantatenda5@gmail.com
Phone: +263 773 473 009 or +263 775 418 768
Social pages: use the Contact button on the website`;

  const today = new Date().toISOString().slice(0, 10);

  return `You are the warm, knowledgeable local guide for Roar and River Safaris, a small, locally owned tour company in Victoria Falls, Zimbabwe. Tagline: "Local guides, fair prices, unforgettable memories." Today is ${today}.

TOURS, ACTIVITIES, ACCOMMODATION AND PRICES (this list is the only source of truth):
${catalogContext}

WEATHER AND SEASONS:
${weatherContext}

HOW TO HELP
- Answer questions about any tour, activity or place to stay above: prices, duration, start times, meeting points, what is included, minimum group sizes, government fees and suitability.
- Recommend options that fit the visitor's interests, time and budget, and plan simple day-by-day itineraries.
- Weather: when a visitor asks whether it is cool, hot, rainy or what the weather suits, use the current conditions and 3-day outlook above. If live weather is unavailable, say so and give the seasonal guide instead. Never pretend to know a forecast you were not given. Always match the weather to the activity, for example: cool mornings and evenings in May to August suit game drives, walking safaris, the Falls tour and bridge adrenaline, but need warm layers; low water in September to December suits Devil's Pool and rafting; rain can cancel rafting, bungee, zipline, gorge swing and flights.
- Give practical Victoria Falls tips: what to pack, sun and malaria precautions, border crossings for Chobe, and how far in advance to plan.
- ${contact}
- Booking form: /book

PRICES AND NEGOTIATION
- Prices are fixed as listed. If a visitor asks for a discount or tries to negotiate, do not negotiate, do not promise a deal and never invent a lower price. Say the prices are already fair and fixed, then invite them to contact us directly on WhatsApp or use the Contact button on the website to discuss their trip.
- Airport transfers are listed in the catalog; quote only the listed rates. For anything not listed, send them to WhatsApp or the booking form.

HARD RULES
- Use only the tours, activities, accommodation and prices listed above. Never invent prices, availability, discounts, inclusions, transfer fees, or policies.
- If you cannot confirm something (live availability, custom quotes, special requests beyond the catalog), say so plainly and send the visitor to the booking form at /book or WhatsApp.
- Never promise a specific guide, room, pickup time, or confirmed booking.
- Keep every reply under 120 words. Use plain text only: no markdown, no bullet symbols, no headings. Be friendly and concise, and end with one clear next step such as "Want me to help you book this?"
- Politely decline only questions that are clearly unrelated to travel, Victoria Falls or our services (for example coding, homework or medical advice), then steer back to the trip. Answer every genuine question about our business as fully as the catalog allows.

LEAD CAPTURE
When a visitor shows genuine booking interest, collect these details conversationally, one or two short questions at a time:
1. Their name
2. Their email address
3. Their travel dates
4. Their group size
5. Which tour interests them (if they have one)

Once you have the name, email, travel dates and group size, call the save_lead tool. Do not call it before you have all four. Do not claim their details are saved until the tool result says saved: true. If saving fails, apologise briefly and direct them to /book or WhatsApp instead. Never ask for passport numbers, payment card details, or other sensitive information.`;
}

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z
    .string()
    .trim()
    .min(5)
    .max(254)
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"),
  travel_dates: z.string().trim().min(1).max(120),
  group_size: z.coerce.number().int().min(1).max(50),
  interested_tour: z.string().trim().max(120).nullish(),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** A Gemini content part. Extra fields (such as thought signatures) are preserved. */
export type GeminiPart = {
  text?: string;
  thought?: boolean;
  functionCall?: { name: string; args?: Record<string, unknown> };
  functionResponse?: { name: string; response?: Record<string, unknown> };
  [key: string]: unknown;
};

export type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

type GeminiFunctionDeclaration = {
  name: string;
  description: string;
  parameters: {
    type: "OBJECT";
    properties: Record<string, { type: string; description?: string }>;
    required: string[];
  };
};

export const SAVE_LEAD_DECLARATION: GeminiFunctionDeclaration = {
  name: "save_lead",
  description:
    "Save a visitor's booking enquiry to the Roar and River Safaris leads list. Only call this after you have collected their name, email, travel dates and group size.",
  parameters: {
    type: "OBJECT",
    properties: {
      name: { type: "STRING", description: "The visitor's full name." },
      email: { type: "STRING", description: "The visitor's email address." },
      travel_dates: {
        type: "STRING",
        description: "When they plan to travel, e.g. '12-16 August 2026'.",
      },
      group_size: {
        type: "INTEGER",
        description: "Number of travellers in the group, between 1 and 50.",
      },
      interested_tour: {
        type: "STRING",
        description: "The tour they are most interested in, if they mentioned one.",
      },
    },
    required: ["name", "email", "travel_dates", "group_size"],
  },
};

export type LeadResult = { saved: boolean; message: string };

export async function saveLead(input: unknown): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return {
      saved: false,
      message:
        "The booking details were incomplete or invalid. Ask the visitor for the missing information, then try again.",
    };
  }

  const lead = parsed.data;

  try {
    const { supabase } = await import("@/lib/supabase");
    const { error } = await supabase.from("leads").insert({
      name: lead.name,
      email: lead.email,
      dates: lead.travel_dates,
      group_size: lead.group_size,
      interested_tour: lead.interested_tour ?? null,
    });

    if (error) {
      console.error("Lead insert failed:", error.message);
      return {
        saved: false,
        message:
          "The lead could not be saved. Apologise briefly and direct the visitor to the booking form at /book or WhatsApp.",
      };
    }

    return {
      saved: true,
      message:
        "Lead saved. Confirm their details are with the local team, tell them someone will reply within 24 hours, and remind them this is an enquiry rather than a confirmed booking.",
    };
  } catch {
    return {
      saved: false,
      message:
        "The lead could not be saved. Apologise briefly and direct the visitor to the booking form at /book or WhatsApp.",
    };
  }
}

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Returns whether this IP may send another message, plus a Retry-After value. */
export function takeRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  if (buckets.size > 2000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(bucketKey);
    }
  }

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Hold the response until at least five seconds have passed since the request started. */
export async function waitForNaturalPause(startedAt: number): Promise<void> {
  const configured = Number(process.env.ASSISTANT_MIN_DELAY_MS);
  const base =
    Number.isFinite(configured) && configured > 0
      ? Math.max(MIN_RESPONSE_DELAY_MS, configured)
      : MIN_RESPONSE_DELAY_MS;

  const target = base + Math.floor(Math.random() * DELAY_JITTER_MS);
  const remaining = target - (Date.now() - startedAt);

  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
}

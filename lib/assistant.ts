import { ACTIVITIES } from "@/lib/activities";
import { ACTIVITY_DETAILS } from "@/lib/activityDetails";
import { STAYS } from "@/lib/accommodations";
import { FALLBACK_TOURS, SHORT_NAMES } from "@/lib/tours";
import { TOUR_DETAILS, type TourDetail } from "@/lib/tourDetails";
import { formatPrice, type Tour } from "@/lib/types";
import { CONTACT, GOOGLE_MAPS_DIRECTIONS_URL, LOCATION, SITE } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                  */
/* -------------------------------------------------------------------------- */

const CATALOG: Tour[] = [...FALLBACK_TOURS, ...ACTIVITIES.map((a) => ({ ...a }))];

const BY_SLUG = new Map(CATALOG.map((t) => [t.slug, t]));

/** Accommodation lives in its own list because it is not priced per person. */
type Stay = (typeof STAYS)[number];
const STAY_BY_SLUG = new Map(STAYS.map((s) => [s.slug, s]));

const DETAILS: Record<string, TourDetail> = { ...ACTIVITY_DETAILS, ...TOUR_DETAILS };

function nameOf(slug: string): string {
  return SHORT_NAMES[slug] ?? BY_SLUG.get(slug)?.name ?? slug;
}

function detailOf(slug: string): TourDetail | undefined {
  return DETAILS[slug];
}

/* -------------------------------------------------------------------------- */
/* Weather (Open-Meteo, no API key)                                           */
/* -------------------------------------------------------------------------- */

/** Victoria Falls town centre. */
const LAT = -17.9243;
const LON = 25.8572;

export type WeatherDay = {
  date: string;
  code: number;
  max: number;
  min: number;
  rain: number;
  uv: number;
  wind: number;
};

export type WeatherReport = {
  current: { temp: number; feels: number; code: number; wind: number; rain: number };
  days: WeatherDay[];
  fetchedAt: number;
};

type OpenMeteo = {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    weather_code?: number;
    wind_speed_10m?: number;
    precipitation?: number;
  };
  daily?: {
    time?: string[];
    weather_code?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_probability_max?: number[];
    uv_index_max?: number[];
    wind_speed_10m_max?: number[];
  };
};

let cache: { at: number; data: WeatherReport } | null = null;

/** Live forecast for Victoria Falls. Cached for 10 minutes; null if offline. */
export async function getWeather(force = false): Promise<WeatherReport | null> {
  if (!force && cache && Date.now() - cache.at < 10 * 60 * 1000) return cache.data;
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
    "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,precipitation" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,wind_speed_10m_max" +
    "&timezone=Africa%2FHarare&forecast_days=5";
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as OpenMeteo;
    const d = json.daily;
    if (!d?.time?.length || !json.current) return null;
    const days: WeatherDay[] = d.time.map((date, i) => ({
      date,
      code: d.weather_code?.[i] ?? 0,
      max: Math.round(d.temperature_2m_max?.[i] ?? 0),
      min: Math.round(d.temperature_2m_min?.[i] ?? 0),
      rain: Math.round(d.precipitation_probability_max?.[i] ?? 0),
      uv: Math.round(d.uv_index_max?.[i] ?? 0),
      wind: Math.round(d.wind_speed_10m_max?.[i] ?? 0),
    }));
    const data: WeatherReport = {
      current: {
        temp: Math.round(json.current.temperature_2m ?? 0),
        feels: Math.round(json.current.apparent_temperature ?? 0),
        code: json.current.weather_code ?? 0,
        wind: Math.round(json.current.wind_speed_10m ?? 0),
        rain: Math.round(json.current.precipitation ?? 0),
      },
      days,
      fetchedAt: Date.now(),
    };
    cache = { at: Date.now(), data };
    return data;
  } catch {
    return null;
  }
}

/** Short label + emoji for a WMO weather code. */
export function weatherInfo(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: "clear sky", emoji: "☀️" };
  if (code === 1) return { label: "mostly clear", emoji: "🌤️" };
  if (code === 2) return { label: "partly cloudy", emoji: "⛅" };
  if (code === 3) return { label: "overcast", emoji: "☁️" };
  if (code === 45 || code === 48) return { label: "fog", emoji: "🌫️" };
  if (code >= 51 && code <= 57) return { label: "light drizzle", emoji: "🌦️" };
  if (code >= 61 && code <= 65) return { label: "rain", emoji: "🌧️" };
  if (code === 66 || code === 67) return { label: "freezing rain", emoji: "🌧️" };
  if (code >= 71 && code <= 77) return { label: "snow", emoji: "🌨️" };
  if (code >= 80 && code <= 82) return { label: "showers", emoji: "🌧️" };
  if (code >= 95) return { label: "thunderstorms", emoji: "⛈️" };
  return { label: "mixed weather", emoji: "🌤️" };
}

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function weekdayOf(date: string): string {
  return WEEKDAYS[new Date(`${date}T12:00:00`).getDay()] ?? "";
}

function prettyDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

function victoriaHour(now: Date): number {
  try {
    return Number(
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Harare",
        hour: "numeric",
        hour12: false,
      }).format(now),
    );
  } catch {
    return now.getHours();
  }
}

type TimeOfDay = "morning" | "afternoon" | "evening";

function timeOfDay(text: string, now: Date): TimeOfDay {
  if (/(evening|sunset|night|dinner)/.test(text)) return "evening";
  if (/(morning|sunrise|early)/.test(text)) return "morning";
  if (/(afternoon|midday|lunch)/.test(text)) return "afternoon";
  const h = victoriaHour(now);
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function pickDay(text: string, weather: WeatherReport): WeatherDay | undefined {
  if (/day after tomorrow/.test(text)) return weather.days[2] ?? weather.days[0];
  for (const day of weather.days) {
    if (text.includes(weekdayOf(day.date))) return day;
  }
  if (/tomorrow/.test(text)) return weather.days[1] ?? weather.days[0];
  return weather.days[0];
}

/* -------------------------------------------------------------------------- */
/* Activity suitability                                                       */
/* -------------------------------------------------------------------------- */

const WATER = [
  "zambezi-sunset-cruise",
  "sunset-dinner-cruise",
  "zambezi-explorer-cruise",
  "ra-ikane-cruise",
  "river-safari",
  "adventure-jet-boat",
  "white-water-rafting",
  "upper-zambezi-canoeing",
  "zambezi-fishing",
  "livingstone-island-tour",
];

const WILDLIFE = [
  "zambezi-national-park-game-drive",
  "chobe-day-trip-botswana",
  "walking-safari",
  "horseback-safari",
  "rhino-game-drive-dinner",
  "elephant-encounter",
  "lion-encounter",
  "siduli-hide",
];

const CULTURE = [
  "boma-dinner",
  "simunye-theatre",
  "victoria-falls-tram",
  "steam-train-trip",
  "traditional-village-tour",
  "crocodile-farm",
  "city-tour",
  "shopping-tour",
];

const AIR = ["helicopter-flight", "microlight-flight"];
const FALLS = ["victoria-falls-guided-tour", "devils-pool-angels-pool"];
const THRILL = ["bungee-jumping", "gorge-swing", "bridge-zipline", "flying-fox", "canopy-tour", "quad-bikes", "river-boarding"];

function isStormy(day: WeatherDay): boolean {
  return day.code >= 95 || (day.code >= 65 && day.code <= 67) || day.code === 82;
}

function isWet(day: WeatherDay): boolean {
  return day.rain >= 50 || (day.code >= 61 && day.code <= 67) || (day.code >= 80 && day.code <= 82) || isStormy(day);
}

/** Passing drizzle or a light shower: worth a layer, not worth cancelling plans. */
function isDamp(day: WeatherDay): boolean {
  return !isWet(day) && ((day.code >= 51 && day.code <= 57) || day.code === 80 || day.rain >= 30);
}

type Pick = { slug: string; reason: string };

function recommendations(day: WeatherDay, when: TimeOfDay): Pick[] {
  const hot = day.max >= 32;
  const cool = day.max < 20;
  const windy = day.wind >= 30;
  const wet = isWet(day);
  const storm = isStormy(day);

  const picks: Pick[] = [];
  const add = (slug: string, reason: string) => {
    if (!picks.some((p) => p.slug === slug) && BY_SLUG.has(slug)) picks.push({ slug, reason });
  };

  if (storm) {
    add("boma-dinner", "under cover, warm and dry — ideal when storms roll in");
    add("simunye-theatre", "an indoor cultural show, unaffected by the weather");
    add("victoria-falls-tram", "a short covered ride, good between showers");
  } else if (wet) {
    add("zambezi-sunset-cruise", "boats still run in light rain, and the Falls are dramatic");
    add("boma-dinner", "a safe indoor pick if the afternoon turns wet");
    add("victoria-falls-tram", "easy to fit in around showers");
  } else if (hot) {
    add("zambezi-sunset-cruise", "cool river breeze and drinks at golden hour");
    add("upper-zambezi-canoeing", "you can cool off on the water");
    add("adventure-jet-boat", "fast, wet and refreshing in the heat");
  } else if (cool) {
    add("zambezi-national-park-game-drive", "cooler hours are when the wildlife is most active");
    add("victoria-falls-guided-tour", "comfortable walking weather in the rainforest");
    add("boma-dinner", "a cosy cultural evening to finish the day");
  } else {
    add("victoria-falls-guided-tour", "the classic first-timer pick in comfortable weather");
    add("zambezi-national-park-game-drive", "great conditions for game viewing");
    add("zambezi-sunset-cruise", "the best way to end a clear day");
  }

  if (when === "evening") {
    add("zambezi-sunset-cruise", "timed for sunset on the river");
    add("sunset-dinner-cruise", "dinner and drinks on the water");
    add("boma-dinner", "drumming, food and culture after dark");
  } else if (when === "morning") {
    add("victoria-falls-guided-tour", "fresh morning light and fewer crowds");
    add("white-water-rafting", "full-day trips start early");
    add("walking-safari", "animal tracks are easiest to read in the morning");
  }

  if (windy) {
    for (let i = picks.length - 1; i >= 0; i--) {
      if (AIR.includes(picks[i].slug) || picks[i].slug === "microlight-flight") picks.splice(i, 1);
    }
    add("historic-bridge-tour", "a grounded option on a windy day");
  }

  return picks.slice(0, 3);
}

function suitability(slug: string, day: WeatherDay): { verdict: string; note: string } {
  const storm = isStormy(day);
  const wet = isWet(day);
  const hot = day.max >= 32;
  const cool = day.max < 20;
  const windy = day.wind >= 30;

  if (storm) {
    if (AIR.includes(slug) || THRILL.includes(slug) || slug === "river-boarding") {
      return {
        verdict: "Not ideal",
        note: "Thunderstorms can ground flights and pause adventure activities for safety. The operator may reschedule you.",
      };
    }
    if (CULTURE.includes(slug)) {
      return { verdict: "A good pick", note: "You are under cover, so storms will not spoil it." };
    }
    return {
      verdict: "Possible, but come prepared",
      note: "Storms are likely. Bring rain gear and keep a flexible plan — some operators may postpone.",
    };
  }

  if (AIR.includes(slug)) {
    if (wet || windy) {
      return {
        verdict: "Weather-dependent",
        note: "Flights need clear skies and calm air. Book a flexible slot and check with the team on the day.",
      };
    }
    return { verdict: "Great conditions for a flight", note: "Clear, calm weather makes for the best views." };
  }

  if (WATER.includes(slug)) {
    if (cool) {
      return { verdict: "Good, but dress warm", note: "It is cooler on the water — bring a light jacket for the breeze." };
    }
    if (hot) return { verdict: "One of the best picks", note: "The river is the coolest place to be in this heat." };
    if (wet) return { verdict: "Still runs in light rain", note: "You may get wet anyway — rain gear is sensible." };
    return { verdict: "A good pick", note: "Comfortable conditions on the river." };
  }

  if (WILDLIFE.includes(slug) || FALLS.includes(slug)) {
    if (hot) {
      return {
        verdict: "Go early",
        note: "Midday heat makes animals (and people) sluggish. An early-morning start is much better.",
      };
    }
    if (wet) return { verdict: "Possible, but wet", note: "Bring a rain jacket and sturdy shoes; the rainforest gets muddy." };
    return { verdict: "A good pick", note: "Comfortable conditions for being outdoors." };
  }

  if (THRILL.includes(slug)) {
    if (wet || windy) {
      return {
        verdict: "Weather-dependent",
        note: "Adventure activities may pause in rain or strong wind. Confirm with the team before heading out.",
      };
    }
    return { verdict: "Good to go", note: "Conditions look fine for adrenaline activities." };
  }

  if (CULTURE.includes(slug)) {
    return { verdict: "A reliable pick", note: "Cultural activities work in almost any weather." };
  }

  return { verdict: "Looks workable", note: "Check with the team for anything weather-sensitive." };
}

/* -------------------------------------------------------------------------- */
/* Intent helpers                                                             */
/* -------------------------------------------------------------------------- */

export type AssistantAction = {
  label: string;
  href?: string;
  /** Send this text as the next chat message instead of opening a link. */
  send?: string;
  external?: boolean;
};

export type AssistantReply = {
  text: string;
  actions?: AssistantAction[];
  weather?: WeatherReport;
};

export type AssistantMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
  actions?: AssistantAction[];
  weather?: WeatherReport;
};

export const ASSISTANT_SUGGESTIONS = [
  "Where can we stay?",
  "What suits today's weather?",
  "How much is the sunset cruise?",
  "Help me book",
  "Can I get a better price?",
];

export const isWeatherQuestion = (raw: string): boolean => {
  const t = normalise(raw);
  return hasWords(t, [
    "weather",
    "forecast",
    "rain",
    "raining",
    "rainy",
    "temperature",
    "climate",
    "season",
    "storm",
    "wind",
    "humid",
    "sunny",
    "cloud",
    "today",
    "tomorrow",
    "tonight",
    "weekend",
  ]);
};

function normalise(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9$%. ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasWords(text: string, words: string[]): boolean {
  return words.some((w) => {
    const safe = w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|\\s)${safe}(s|es)?(\\s|$)`).test(text);
  });
}

/* Competitor names for "which tour" questions, longest first. */
const ALIASES: [string, string][] = [
  ["victoria falls guided tour", "victoria-falls-guided-tour"],
  ["tour of the falls", "victoria-falls-guided-tour"],
  ["falls tour", "victoria-falls-guided-tour"],
  ["guided tour", "victoria-falls-guided-tour"],
  ["rainforest tour", "victoria-falls-guided-tour"],
  ["mosi oa tunya", "victoria-falls-guided-tour"],
  ["zambezi sunset cruise", "zambezi-sunset-cruise"],
  ["sunset cruise", "zambezi-sunset-cruise"],
  ["sunset boat", "zambezi-sunset-cruise"],
  ["chobe day trip", "chobe-day-trip-botswana"],
  ["chobe", "chobe-day-trip-botswana"],
  ["devil s pool", "devils-pool-angels-pool"],
  ["devils pool", "devils-pool-angels-pool"],
  ["angel s pool", "devils-pool-angels-pool"],
  ["angels pool", "devils-pool-angels-pool"],
  ["devil", "devils-pool-angels-pool"],
  ["game drive", "zambezi-national-park-game-drive"],
  ["zambezi national park", "zambezi-national-park-game-drive"],
  ["bungee jump", "bungee-jumping"],
  ["bungee", "bungee-jumping"],
  ["gorge swing", "gorge-swing"],
  ["bridge swing", "gorge-swing"],
  ["bridge zipline", "bridge-zipline"],
  ["zip line", "bridge-zipline"],
  ["zipline", "bridge-zipline"],
  ["white water rafting", "white-water-rafting"],
  ["rafting", "white-water-rafting"],
  ["raft", "white-water-rafting"],
  ["jet boat", "adventure-jet-boat"],
  ["river boarding", "river-boarding"],
  ["river board", "river-boarding"],
  ["flying fox", "flying-fox"],
  ["canopy tour", "canopy-tour"],
  ["canopy", "canopy-tour"],
  ["overnight canoe", "overnight-canoe-safari"],
  ["canoe", "upper-zambezi-canoeing"],
  ["siduli hide", "siduli-hide"],
  ["siduli", "siduli-hide"],
  ["rhino game drive", "rhino-game-drive-dinner"],
  ["rhino", "rhino-game-drive-dinner"],
  ["elephant encounter", "elephant-encounter"],
  ["elephant", "elephant-encounter"],
  ["zambezi fishing", "zambezi-fishing"],
  ["fishing", "zambezi-fishing"],
  ["horse back safari", "horseback-safari"],
  ["horseback", "horseback-safari"],
  ["horse", "horseback-safari"],
  ["walking safari", "walking-safari"],
  ["lion encounter", "lion-encounter"],
  ["lion", "lion-encounter"],
  ["helicopter", "helicopter-flight"],
  ["chopper", "helicopter-flight"],
  ["microlight", "microlight-flight"],
  ["microlite", "microlight-flight"],
  ["river safari", "river-safari"],
  ["sunset dinner cruise", "sunset-dinner-cruise"],
  ["dinner cruise", "sunset-dinner-cruise"],
  ["zambezi explorer", "zambezi-explorer-cruise"],
  ["explorer cruise", "zambezi-explorer-cruise"],
  ["ra ikane", "ra-ikane-cruise"],
  ["historic bridge", "historic-bridge-tour"],
  ["historical bridge", "historic-bridge-tour"],
  ["bridge tour", "historic-bridge-tour"],
  ["steam train", "steam-train-trip"],
  ["steam", "steam-train-trip"],
  ["victoria falls tram", "victoria-falls-tram"],
  ["bamba tram", "victoria-falls-tram"],
  ["tram", "victoria-falls-tram"],
  ["livingstone island", "livingstone-island-tour"],
  ["crocodile farm", "crocodile-farm"],
  ["crocodile", "crocodile-farm"],
  ["lunar rainbow", "lunar-rainbow-tour"],
  ["moonbow", "lunar-rainbow-tour"],
  ["full moon", "lunar-rainbow-tour"],
  ["bike tour", "bike-tour"],
  ["cycling", "bike-tour"],
  ["boma dinner", "boma-dinner"],
  ["boma", "boma-dinner"],
  ["dusty road", "dusty-road-experience"],
  ["traditional village", "traditional-village-tour"],
  ["village tour", "traditional-village-tour"],
  ["simunye", "simunye-theatre"],
  ["theatre", "simunye-theatre"],
  ["theater", "simunye-theatre"],
  ["city tour", "city-tour"],
  ["shopping", "shopping-tour"],
  ["mollynelly", "mollynelly-guesthouse"],
  ["airport transfer", "airport-transfer"],
  ["quad bike", "quad-bikes"],
  ["quad", "quad-bikes"],
  ["big tree", "big-tree-visit"],
] as [string, string][];

/**
 * Property names, plus the short forms guests actually type ("Batonka",
 * "Rainbow Hotel", "The Pods"). Built from STAYS so a new property needs no
 * edit here.
 */
const GENERIC_STAY_WORDS = new Set([
  "hotel",
  "hotels",
  "lodge",
  "lodges",
  "guesthouse",
  "guest",
  "house",
  "villa",
  "cottage",
  "camp",
  "campsite",
  "suites",
  "club",
  "safari",
  "family",
  "private",
  "victoria",
  "zambezi",
  "falls",
  "spacious",
  "the",
  "and",
  "in",
]);

const STAY_ALIASES: [string, string][] = STAYS.flatMap((stay) => {
  const full = normalise(stay.name);
  const withoutThe = full.replace(/^the /, "");
  const short = withoutThe
    .replace(/ (in )?victoria falls$/, "")
    .replace(/^victoria falls /, "");

  const variants = new Set<string>([full, withoutThe]);
  const add = (value: string) => {
    const clean = value.trim();
    if (clean.length < 4) return;
    if (clean.split(" ").length === 1 && GENERIC_STAY_WORDS.has(clean)) return;
    variants.add(clean);
  };

  add(short);
  const first = short.split(" ")[0] ?? "";
  if (first.length >= 4 && !GENERIC_STAY_WORDS.has(first)) add(first);

  return [...variants].map((v) => [v, stay.slug] as [string, string]);
});

const ALL_ALIASES: [string, string][] = [...ALIASES, ...STAY_ALIASES];

function findTour(raw: string): Tour | undefined {
  const t = normalise(raw);
  const sorted = [...ALL_ALIASES].sort((a, b) => b[0].length - a[0].length);
  for (const [alias, slug] of sorted) {
    if (hasWords(t, [alias])) {
      const tour = BY_SLUG.get(slug);
      if (tour) return tour;
    }
  }
  return undefined;
}

/* -------------------------------------------------------------------------- */
/* Reply content                                                              */
/* -------------------------------------------------------------------------- */

function tourActions(tour: Tour): AssistantAction[] {
  return [
    { label: `Book ${nameOf(tour.slug)}`, href: `/book?tour=${tour.slug}` },
    { label: "Full details", href: `/tours/${tour.slug}` },
  ];
}

function contactActions(): AssistantAction[] {
  return [
    { label: "WhatsApp", send: "WhatsApp" },
    { label: "Call", send: "Call" },
    { label: "Email", send: "Email" },
  ];
}

function whatsappLink(message = "Hi! I'd like to ask about a tour with Roar and River Safaris."): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}

function priceList(): string {
  return FALLBACK_TOURS.map((t) => `• ${nameOf(t.slug)} — ${formatPrice(t.price_usd)}`).join("\n");
}

function tourSummary(tour: Tour): AssistantReply {
  const detail = detailOf(tour.slug);
  const priceLine =
    tour.price_usd === null
      ? `${tour.name} — rates on request`
      : `${tour.name} — ${formatPrice(tour.price_usd)} per person`;
  const lines: string[] = [priceLine];
  if (detail?.summary || tour.description) lines.push(detail?.summary ?? tour.description ?? "");
  if (detail) {
    const facts = [
      detail.startTime ? `Starts: ${detail.startTime}` : "",
      detail.duration ? `Duration: ${detail.duration}` : "",
      detail.minPax ? detail.minPax : "",
    ].filter(Boolean);
    if (facts.length) lines.push(`• ${facts.join(" · ")}`);
    if (detail.location) lines.push(`• Meets: ${detail.location}`);
    if (detail.governmentFees) lines.push(`• Government fees: ${detail.governmentFees} (extra)`);
    if (detail.priceNote) lines.push(`• ${detail.priceNote}`);
    if (detail.includes?.length) lines.push(`Included: ${detail.includes.slice(0, 4).join("; ")}.`);
  }
  lines.push("I can also tell you if the weather suits it, or help you book.");
  return { text: lines.filter(Boolean).join("\n"), actions: tourActions(tour) };
}

/* -------- Accommodation replies ------------------------------------------ */

function staySummary(stay: Stay): AssistantReply {
  const grade = stay.stars ? `${stay.stars}-star ` : "";
  const lines = [
    `${stay.name} — ${grade}${stay.kind.toLowerCase()} in Victoria Falls.`,
    stay.highlight ?? "Contact our team for property details, availability and current rates.",
  ];
  if (stay.rating !== undefined && stay.reviews) {
    lines.push(`• Guest rating: ${stay.rating.toFixed(1)}/5 from ${stay.reviews} reviews`);
  }
  if (stay.amenities?.length) {
    lines.push(`• On site: ${stay.amenities.join(", ")}`);
  }
  lines.push("Nightly rates move with season and room type, so the team confirms the live rate for your dates. No payment is taken online.");

  return {
    text: lines.join("\n"),
    actions: [
      { label: "See the property", href: `/tours/${stay.slug}` },
      { label: "Ask about your dates", send: "WhatsApp" },
      { label: "See all accommodation", href: "/tours#activities-accommodation" },
    ],
  };
}

function stayBookingReply(stay: Stay, title = stay.name): AssistantReply {
  return {
    text:
      `Rates for ${title} are quoted by our team for your exact dates, so nothing is charged online. ` +
      "Send your dates, number of guests and room preference on the booking form, and the team will confirm availability and the rate. " +
      "If you would rather ask first, WhatsApp is usually quickest.",
    actions: [
      { label: `Request ${nameOf(stay.slug)}`, href: `/book?tour=${stay.slug}` },
      { label: "Ask on WhatsApp", href: whatsappLink(`Hi! I'd like to ask about ${title} in Victoria Falls.`), external: true },
      { label: "See all accommodation", href: "/tours#activities-accommodation" },
    ],
  };
}

/** A recommendation when the guest asks about stays without naming one. */
function stayRecommendation(raw: string): AssistantReply {
  const t = normalise(raw);
  const wantsBudget = /(budget|cheap|afford|backpack|hostel|inexpensive|value)/.test(t);
  const wantsLuxury = /(luxury|luxurious|five star|5 star|high end|premium|spoil|honeymoon)/.test(t);
  const wantsFamily = /(kid|child|children|family|toddler|group|self cater|selfcater|kitchen|cottage)/.test(t);
  const wantsCouple = /(couple|romantic|two of us|honeymoon)/.test(t);

  let picks: AssistantAction[];
  let intro: string;

  if (wantsBudget) {
    intro =
      "For a good-value base, Victoria Falls Backpackers Lodge has a pool, shared kitchen and airport shuttle, while N1 Hotel & Campsite and Cresta Sprayview sit in the mid-range with pools and restaurants. Shearwater Explorers Village is a relaxed option with self-catering rooms.";
    picks = [
      { label: "Victoria Falls Backpackers Lodge", href: "/tours/victoria-falls-backpackers-lodge" },
      { label: "N1 Hotel & Campsite", href: "/tours/n1-hotel-campsite-victoria-falls" },
      { label: "See all accommodation", href: "/tours#activities-accommodation" },
    ];
  } else if (wantsLuxury) {
    intro =
      "For a luxury stay, The Victoria Falls Hotel is the historic five-star address, while Victoria Falls Safari Club and Ilala Lodge Hotel add a spa, pool and quieter setting. Nkosi Guest Lodge is a small five-star alternative if you prefer personal service.";
    picks = [
      { label: "The Victoria Falls Hotel", href: "/tours/the-victoria-falls-hotel" },
      { label: "Victoria Falls Safari Club", href: "/tours/victoria-falls-safari-club" },
      { label: "See all accommodation", href: "/tours#activities-accommodation" },
    ];
  } else if (wantsFamily) {
    intro =
      "For families, Zambezi Family Lodge and Lokuthula Lodges both have pools and space for children, and the Private Spacious Cottage sleeps five with two bedrooms and a kitchen setup. Ilala Lodge Hotel is also an easy walk from the Falls.";
    picks = [
      { label: "Zambezi Family Lodge", href: "/tours/zambezi-family-lodge" },
      { label: "Lokuthula Lodges", href: "/tours/lokuthula-lodges" },
      { label: "See all accommodation", href: "/tours#activities-accommodation" },
    ];
  } else if (wantsCouple) {
    intro =
      "For two, The Pods Victoria Falls is a compact self-catering stay with a shared pool, and Zambezi Boutique Guesthouse is a small, well-rated option with a pool and restaurant.";
    picks = [
      { label: "The Pods Victoria Falls", href: "/tours/the-pods-victoria-falls" },
      { label: "Zambezi Boutique Guesthouse", href: "/tours/zambezi-boutique-guesthouse" },
      { label: "See all accommodation", href: "/tours#activities-accommodation" },
    ];
  } else {
    intro =
      "We list 20 places to stay, from campsites and backpackers to five-star hotels and self-catering cottages. Popular picks are Cresta Sprayview for a central mid-range stay, Ilala Lodge Hotel for walking distance to the Falls, and Batonka Guest Lodge for a quiet four-star base.";
    picks = [
      { label: "Compare all 20 stays", href: "/tours#activities-accommodation" },
      { label: "Cresta Sprayview", href: "/tours/cresta-sprayview" },
      { label: "Ilala Lodge Hotel", href: "/tours/ilala-lodge-hotel" },
    ];
  }

  return {
    text:
      `${intro}\n` +
      "Nightly rates are not published because they change with season and room type — send your dates and group size and the team will confirm the live rate. " +
      "Mollynelly Guesthouse is our own guesthouse if you would like to stay with us directly.",
    actions: picks,
  };
}

function weatherText(day: WeatherDay, when: TimeOfDay, prefix: string, weather: WeatherReport): AssistantReply {
  const info = weatherInfo(day.code);
  const picks = recommendations(day, when);
  const lines = [
    `${prefix}: ${info.emoji} ${info.label}, ${day.min}–${day.max}°C, ${day.rain}% chance of rain, UV ${day.uv}.`,
  ];
  if (isStormy(day)) lines.push("Storms are possible — keep indoor plans handy and expect some activities to pause.");
  else if (isWet(day)) lines.push("Showers are likely — pack a rain jacket, and the Falls will be dramatic.");
  else if (isDamp(day)) lines.push("A few passing showers are possible — a light rain layer is worth packing.");
  else if (day.max >= 32) lines.push("It will be hot — plan the active part of the day for early morning.");
  else lines.push("Comfortable conditions for being outside.");

  if (picks.length) {
    lines.push("", "What suits best:");
    for (const p of picks) lines.push(`• ${nameOf(p.slug)} — ${p.reason}.`);
  }
  const actions: AssistantAction[] = picks.slice(0, 3).map((p) => ({
    label: `Book ${nameOf(p.slug)}`,
    href: `/book?tour=${p.slug}`,
  }));
  actions.push({ label: "See all tours", href: "/tours" });
  return { text: lines.join("\n"), actions, weather };
}

function suitabilityReply(tour: Tour, day: WeatherDay): AssistantReply {
  const s = suitability(tour.slug, day);
  const info = weatherInfo(day.code);
  return {
    text:
      `${tour.name} — ${s.verdict}.\n` +
      `${info.emoji} ${prettyDate(day.date)}: ${info.label}, ${day.min}–${day.max}°C, ${day.rain}% rain, UV ${day.uv}.\n` +
      s.note,
    actions: tourActions(tour),
  };
}

function weatherReply(raw: string, weather: WeatherReport, now: Date): AssistantReply {
  const day = pickDay(raw, weather) ?? weather.days[0];
  const when = timeOfDay(raw, now);
  if (!day) {
    return {
      text: "I could not read the forecast just now. Message the team and they will check the conditions for your dates.",
      actions: contactActions(),
    };
  }
  const isToday = day.date === weather.days[0]?.date;
  const prefix = isToday ? "In Victoria Falls today" : `In Victoria Falls on ${prettyDate(day.date)}`;
  return weatherText(day, when, prefix, weather);
}

function recommendationReply(raw: string, weather: WeatherReport | null, now: Date): AssistantReply {
  if (weather) {
    const day = pickDay(raw, weather) ?? weather.days[0];
    const when = timeOfDay(raw, now);
    if (day) {
      const isToday = day.date === weather.days[0]?.date;
      const prefix = isToday ? "Based on today's Victoria Falls forecast" : `Based on the forecast for ${prettyDate(day.date)}`;
      return weatherText(day, when, prefix, weather);
    }
  }

  return {
    text: "I can’t make a weather-based recommendation without a live Victoria Falls forecast, and I don’t want to guess. Please try the live forecast again shortly.",
    actions: [
      { label: "Check today's weather", send: "What suits today's weather?" },
      { label: "See all tours", href: "/tours" },
    ],
  };
}

/* -------------------------------------------------------------------------- */
/* Main router                                                                */
/* -------------------------------------------------------------------------- */

export function answer(raw: string, weather: WeatherReport | null, now = new Date()): AssistantReply {
  const t = normalise(raw);
  const tour = findTour(t);
  const when = timeOfDay(t, now);

  if (!t) return { text: "Ask me anything about our tours, prices, the weather or booking." };

  const negotiate = /(discount|negotiat|cheaper|lower price|better price|best price|too expensive|expensive|budget|deal|student|group rate|concession|knock|reduce|afford)/.test(t);
  const asksWeather = isWeatherQuestion(t);
  const asksRecommend = /(recommend|suggest|suit|best|which (tour|activity|one)|what should|what can i do|what to do|things to do|help me choose|not sure)/.test(t);
  const asksBooking = /(book|booking|reserve|reservation|availability|available|form|confirm)/.test(t);
  const asksContact = /(contact|phone|call|email|mail|whatsapp|number|reach|talk to|human|person|agent|office|touch)/.test(t);
  const asksPrice = /(price|cost|how much|rate|fee|usd|\$|dollar)/.test(t);
  const asksPayment = /(pay|payment|deposit|card|cash|online)/.test(t);
  const asksCancel = /(cancel|refund|reschedule|change my booking|policy)/.test(t);
  const asksIncludes = /(include|included|whats included|what is included|cover)/.test(t);
  const asksDuration = /(how long|duration|hours|start|pick ?up|meeting|depart|time)/.test(t);
  const asksVisa = /(visa|passport|border|kazangula|immigration)/.test(t);
  const asksFamily = /(kid|child|children|family|age|toddler|infant)/.test(t);
  const asksFood = /(food|meal|lunch|dinner|vegetarian|vegan|diet|drink|alcohol)/.test(t);
  const asksSafety = /(safe|safety|pregnan|disab|wheelchair|health|swim|weight)/.test(t);
  const asksAbout = /(about|who are you|local company|guide|why book|why choose|trust|experience)/.test(t);
  const asksList = /(list|all tours|what tours|tours do you|activities do you|options|packages|things you offer)/.test(t);
  const asksGallery = /(gallery|photos|pictures|images|see the site|website)/.test(t);
  const asksHelp = /(what can you do|how can you help|who are you|what do you know|help)/.test(t);
  const asksDirections =
    /(directions?|google maps|map|address|your location|where (are|is) (you|your office)|where can i find you|where are you (based|located)|how (do|can) i get (to (you|your office|your location)|there)|how to find you|find (you|your office))/.test(
      t,
    );
  const asksStay =
    /(hotel|lodge|guest ?house|guesthouse|accommodation|accommodate|where (can|should|do) (i|we) (stay|sleep)|places? to stay|where to stay|to stay|stay near|stay in|staying|room|campsite|camping|backpackers|cottage|villa|self cater|self-cater|book a stay)/.test(
      t,
    );

  if (asksDirections) {
    return {
      text:
        `We are at ${LOCATION.address}. Use Get Directions to open the fixed location in Google Maps, or view the map in the Find us section at the bottom of this page.`,
      actions: [
        { label: "Get Directions", href: GOOGLE_MAPS_DIRECTIONS_URL, external: true },
        { label: "View map on this page", href: "/#location-heading" },
      ],
    };
  }

  // 1. Negotiation always goes to a human, with channel choice.
  if (negotiate) {
    return {
      text:
        (tour ? `For ${tour.name}, ` : "") +
        "Group rates, repeat-guest rates or a better price are best handled directly by our team — they can confirm what is possible for your dates. Which is easiest for you?",
      actions: contactActions(),
    };
  }

  // 2. Direct contact requests.
  if (hasWords(t, ["whatsapp"])) {
    return {
      text: `The quickest way to reach us is WhatsApp on +263 78 604 3129. Tap below and a message will be ready to send. You can also call +263 773 473 009 or +263 775 418 768.`,
      actions: [
        { label: "Open WhatsApp", href: whatsappLink(tour ? `Hi! I'd like to ask about ${tour.name}.` : undefined), external: true },
        { label: "Call instead", send: "Call" },
        { label: "Email instead", send: "Email" },
      ],
    };
  }
  if (hasWords(t, ["call", "phone", "telephone", "number", "ring"])) {
    return {
      text: "Call or WhatsApp our Victoria Falls team:\n• +263 773 473 009\n• +263 775 418 768",
      actions: [
        { label: "Call +263 773 473 009", href: "tel:+263773473009" },
        { label: "Call +263 775 418 768", href: "tel:+263775418768" },
        { label: "Email instead", send: "Email" },
      ],
    };
  }
  if (hasWords(t, ["email", "mail"])) {
    return {
      text: "Email us at donnavantatenda5@gmail.com — include your tour, dates and group size and the team will reply with availability and the final price.",
      actions: [
        {
          label: "Open email",
          href: `mailto:${CONTACT.email}?subject=${encodeURIComponent("Tour enquiry — Roar and River Safaris")}`,
        },
        { label: "WhatsApp instead", send: "WhatsApp" },
      ],
    };
  }
  if (asksContact) {
    return {
      text: "You can reach the Roar and River Safaris team on WhatsApp, by phone or by email. Which do you prefer?",
      actions: contactActions(),
    };
  }

  // 3. Accommodation. Rates are quoted per booking, not per person, so stays
  // get their own summary and booking wording.
  const stay = tour ? STAY_BY_SLUG.get(tour.slug) : undefined;
  if (stay) {
    if (asksBooking || asksPayment || asksCancel || asksPrice) return stayBookingReply(stay);
    return staySummary(stay);
  }
  if (!tour && asksStay) return stayRecommendation(t);

  // 4. A specific tour or activity. Booking and explicit price questions win
  // over the words "today"/"tomorrow" so they are not answered as weather.
  if (tour) {
    if (asksBooking) {
      const priceLine =
        tour.price_usd === null
          ? `${tour.name} is priced on request`
          : `${tour.name} is ${formatPrice(tour.price_usd)} per person`;
      return {
        text:
          `${priceLine}. Pick your date and group size on the booking form ` +
          "and the team will confirm availability and the final price. No payment is taken online.",
        actions: [
          { label: `Book ${nameOf(tour.slug)}`, href: `/book?tour=${tour.slug}` },
          { label: "Ask on WhatsApp", href: whatsappLink(`Hi! I'd like to book ${tour.name}.`), external: true },
        ],
      };
    }
    if (asksPayment || asksCancel) {
      return {
        text:
          "No payment is taken on this website. Send a booking request and the team confirms availability and the final price first. " +
          "For changes or cancellations, message us with your dates and we will do our best — terms depend on the activity and season.",
        actions: [
          { label: "Open booking form", href: `/book?tour=${tour.slug}` },
          ...contactActions(),
        ],
      };
    }
    if (asksPrice) return tourSummary(tour);
    if (asksWeather) {
      if (weather) {
        const day = pickDay(t, weather) ?? weather.days[0];
        if (day) return suitabilityReply(tour, day);
      }
      return {
        text: `I can check the forecast for ${tour.name} — one moment while I pull the latest Victoria Falls weather.`,
        actions: [{ label: "Check today's weather", send: "What suits today's weather?" }],
      };
    }
    if (asksRecommend && weather) {
      const day = pickDay(t, weather) ?? weather.days[0];
      if (day) return suitabilityReply(tour, day);
    }
    return tourSummary(tour);
  }

  // 5. Weather and recommendations. Booking/price questions win over the word
  // "today"/"tomorrow" so they are not mistaken for weather questions.
  const transactional = asksBooking || asksPrice || asksPayment || asksCancel;
  if (!transactional) {
    if (asksWeather && weather) return weatherReply(t, weather, now);
    if (asksWeather && !weather) {
      return {
        text: "I couldn’t retrieve a live Victoria Falls forecast just now, so I can’t confirm the current conditions. Please try again shortly.",
        actions: [
          { label: "Try the forecast again", send: "What suits today's weather?" },
          { label: "See all tours", href: "/tours" },
        ],
      };
    }
    if (asksRecommend) {
      if (weather) {
        const day = pickDay(t, weather) ?? weather.days[0];
        if (day) return weatherText(day, when, "Based on the Victoria Falls forecast", weather);
      }
      return recommendationReply(t, weather, now);
    }
  }

  // 6. Booking, prices and the rest of the site.
  if (asksBooking) {
    return {
      text:
        "Booking takes about two minutes:\n" +
        "1. Open the booking form and choose your tour.\n" +
        "2. Add your date, group size and contact details.\n" +
        "3. Send it — the team confirms availability and the final price. No payment is taken online.",
      actions: [
        { label: "Open booking form", href: "/book" },
        { label: "Book on WhatsApp", href: whatsappLink(), external: true },
        { label: "Browse tours", href: "/tours" },
      ],
    };
  }

  if (asksPrice || asksList) {
    return {
      text:
        "Prices are in USD per person. Signature tours:\n" +
        priceList() +
        "\n\nWe also run 40+ activities, from $17 to $286. Park and conservation fees are shown on each tour page and are payable separately. " +
        "We list 20 places to stay too, from campsites to five-star hotels — nightly rates are quoted by the team for your dates.",
      actions: [
        { label: "See all tours & activities", href: "/tours" },
        { label: "Where to stay", href: "/tours#activities-accommodation" },
        { label: "Help me choose", send: "What suits today's weather?" },
      ],
    };
  }

  if (asksPayment || asksCancel) {
    return {
      text:
        "No payment is taken on this website. Send a booking request and the team confirms availability and the final price first. " +
        "For changes or cancellations, message us with your dates and we will do our best — terms depend on the activity and season.",
      actions: contactActions(),
    };
  }

  if (asksVisa) {
    return {
      text:
        "For the Chobe Day Trip you cross into Botswana, so bring your passport. Depending on your nationality a visa may be required. " +
        "At the Zimbabwe border you can ask for a KAZA UniVisa or a double-entry visa. The team can talk you through your specific passport.",
      actions: [
        { label: "Chobe Day Trip", href: "/tours/chobe-day-trip-botswana" },
        { label: "Ask the team", send: "WhatsApp" },
      ],
    };
  }

  if (asksFamily) {
    return {
      text:
        "Families are welcome. Many activities suit children, but age and weight limits vary: for example, rafting and some adventure activities have minimum ages, and flights have weight limits. " +
        "Tell us the ages and we will recommend the best options.",
      actions: [
        { label: "Family-friendly ideas", href: "/tours" },
        { label: "Ask the team", send: "WhatsApp" },
      ],
    };
  }

  if (asksSafety) {
    return {
      text:
        "Safety is handled by the licensed operators who run each activity. Guides brief you before every trip, and activities pause when conditions are unsafe. " +
        "If you are pregnant, have a health condition, cannot swim, or need wheelchair access, tell us before booking so we can recommend something suitable.",
      actions: contactActions(),
    };
  }

  if (asksFood) {
    return {
      text:
        "Food and drinks are included on several experiences — the sunset and dinner cruises serve canapes and drinks, and the Boma Dinner is a full cultural meal. " +
        "Vegetarian and dietary requirements can usually be arranged if you mention them when booking.",
      actions: [
        { label: "Dinner cruise", href: "/tours/sunset-dinner-cruise" },
        { label: "Boma Dinner", href: "/tours/boma-dinner" },
      ],
    };
  }

  if (asksIncludes && tour) return tourSummary(tour);

  if (asksDuration) {
    return {
      text:
        "Each tour page lists the start time meeting point and duration. For example, the Victoria Falls Guided Tour takes 2–2.5 hours, the Sunset Cruise 2.5 hours, and the Chobe Day Trip about 11 hours. " +
        "Tell me which tour you are considering and I will give you the details.",
      actions: [
        { label: "Victoria Falls Guided Tour", href: "/tours/victoria-falls-guided-tour" },
        { label: "Sunset Cruise", href: "/tours/zambezi-sunset-cruise" },
        { label: "Chobe Day Trip", href: "/tours/chobe-day-trip-botswana" },
      ],
    };
  }

  if (asksGallery) {
    return {
      text:
        "You can see destinations and photos on the home page gallery, and every tour has its own photo and full details on the tours page.",
      actions: [
        { label: "Open gallery", href: "/#destinations" },
        { label: "All tours", href: "/tours" },
      ],
    };
  }

  if (asksAbout) {
    return {
      text:
        "Roar and River Safaris is a local tour company based in the heart of Victoria Falls, Zimbabwe. We work with local guides and licensed operators, publish honest prices up front, and run trips from the Falls and the Zambezi into Botswana.",
      actions: [
        { label: "About & why us", href: "/#about" },
        { label: "See all tours", href: "/tours" },
      ],
    };
  }

  if (asksHelp) {
    return {
      text:
        "I can help with:\n" +
        "• Tours and activities, prices and what is included\n" +
        "• Places to stay, from campsites to five-star hotels\n" +
        "• The live Victoria Falls forecast and which activity suits it\n" +
        "• Booking, payment and pickup questions\n" +
        "• Putting you in touch with the team about a better price",
      actions: [
        { label: "What suits today?", send: "What suits today's weather?" },
        { label: "Where to stay", href: "/tours#activities-accommodation" },
      ],
    };
  }

  // 7. Greetings and thanks.
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|howzit|hola)\b/.test(t)) {
    return {
      text:
        `Hi! I'm the ${SITE.name} assistant. Ask me about any tour, today's weather and what suits it, prices or booking — or I can connect you to the team.`,
      actions: [
        { label: "What suits today's weather?", send: "What suits today's weather?" },
        { label: "Browse tours", href: "/tours" },
      ],
    };
  }
  if (/(thank|thanks|cheers)/.test(t)) {
    return {
      text: "You're welcome! If you need anything else — tours, weather, booking or a price chat — just ask.",
      actions: [{ label: "Plan my day", send: "What suits today's weather?" }],
    };
  }

  // 8. Nothing matched: answer helpfully and offer a human.
  return {
    text:
      "I'm not sure I caught that. I can help with our tours and prices, the live Victoria Falls weather and which activity suits it, booking, pickup and payments. " +
      "For anything else, our team is one message away.",
    actions: [
      { label: "What suits today?", send: "What suits today's weather?" },
      { label: "See all tours", href: "/tours" },
      ...contactActions(),
    ],
  };
}

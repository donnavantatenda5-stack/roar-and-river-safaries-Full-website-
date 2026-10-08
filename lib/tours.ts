import type { Tour } from "@/lib/types";
import { ACTIVITIES, getActivity } from "@/lib/activities";

/** Shown if Supabase isn't configured yet or can't be reached. */
export const FALLBACK_TOURS: Tour[] = [
{ slug: "victoria-falls-guided-tour", name: "Victoria Falls Guided Tour", price_usd: 90 },
  { slug: "zambezi-sunset-cruise", name: "Zambezi Sunset Cruise", price_usd: 75 },
  { slug: "chobe-day-trip-botswana", name: "Chobe Day Trip (Botswana)", price_usd: 200 },
  { slug: "devils-pool-angels-pool", name: "Devil's Pool / Angel's Pool", price_usd: 120 },
  { slug: "zambezi-national-park-game-drive", name: "Zambezi National Park Game Drive", price_usd: 135 },
  { slug: "bungee-jumping", name: "Victoria Falls Bungee Jump", price_usd: 194 },
  { slug: "gorge-swing", name: "Victoria Falls Bridge Swing", price_usd: 135 },
  { slug: "bridge-zipline", name: "Victoria Falls Bridge Zipline", price_usd: 110 },
].map((t, i) => ({
  id: t.slug,
  description: null,
  image_url: null,
  sort_order: i + 1,
  is_active: true,
  ...t,
}));

/** Short names for the footer. */
export const SHORT_NAMES: Record<string, string> = {
  "victoria-falls-guided-tour": "Victoria Falls Guided Tour",
  "zambezi-sunset-cruise": "Zambezi Sunset Cruise",
  "chobe-day-trip-botswana": "Chobe Day Trip",
  "devils-pool-angels-pool": "Devil's / Angel's Pool",
  "zambezi-national-park-game-drive": "Game Drive",
  "bungee-jumping": "Bungee Jumping",
  "gorge-swing": "Bridge Swing",
  "bridge-zipline": "Bridge Zipline",
};

/** Image for a tour: the database value if set, otherwise /public/images/tours/<slug>.jpg */
export function tourImage(t: Tour): string {
  return t.image_url ?? `/images/tours/${t.slug}.jpg`;
}

/** A single tour by slug, checking tours first so activities can never shadow one. */
export async function getTour(slug: string): Promise<Tour | undefined> {
  const tours = await getTours();
  const tour = tours.find((t) => t.slug === slug);
  if (tour) return tour;
  return getActivity(slug);
}

/** The eight signature tours. Kept separate from the wider activity catalog. */
export async function getTours(): Promise<Tour[]> {
  try {
    // Imported lazily so a missing .env.local falls back instead of crashing the page.
    const { supabase } = await import("@/lib/supabase");
    const { data, error } = await supabase
      .from("tours")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error || !data || data.length === 0) return normalizeTours(FALLBACK_TOURS);
    return normalizeTours(data as Tour[]);
  } catch {
    return normalizeTours(FALLBACK_TOURS);
  }
}

/** Stale rows that must never appear on the list (e.g. a combined bungee + gorge tour). */
const HIDDEN_SLUGS = new Set(["bungee-jumping-gorge-swing"]);

/** Signature tours that must appear on the list even before their row exists in the DB. */
const REQUIRED_SLUGS = ["bungee-jumping", "gorge-swing"];

/**
 * Clean a list from the database so cards always show a real price:
 * drops stale rows, fills null prices from the catalogue, and adds any
 * required signature tours that are missing from the DB.
 */
function normalizeTours(rows: Tour[]): Tour[] {
  const filtered = rows.filter((t) => !HIDDEN_SLUGS.has(t.slug));
  const filled = filtered.map((t) => {
    if (t.price_usd === null) {
      const price = FALLBACK_TOURS.find((f) => f.slug === t.slug)?.price_usd ?? null;
      if (price !== null) return { ...t, price_usd: price };
    }
    return t;
  });

  const slugs = new Set(filled.map((t) => t.slug));
  const missing = FALLBACK_TOURS.filter((f) => REQUIRED_SLUGS.includes(f.slug) && !slugs.has(f.slug));

  return [...filled, ...missing].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

/** The wider activity catalog, shown in its own section below the tours. */
export async function getActivities() {
  return ACTIVITIES;
}

/** Tours and activities together, used where a full count or list is needed. */
export async function getAllTours(): Promise<Tour[]> {
  const tours = await getTours();
  return [...tours, ...ACTIVITIES];
}
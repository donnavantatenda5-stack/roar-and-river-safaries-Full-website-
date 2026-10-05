import type { Tour } from "@/lib/types";
import { ACTIVITIES, getActivity } from "@/lib/activities";

/** Shown if Supabase isn't configured yet or can't be reached. */
export const FALLBACK_TOURS: Tour[] = [
  { slug: "victoria-falls-guided-tour", name: "Victoria Falls Guided Tour", price_usd: 35 },
  { slug: "zambezi-sunset-cruise", name: "Zambezi Sunset Cruise", price_usd: 55 },
  { slug: "chobe-day-trip-botswana", name: "Chobe Day Trip (Botswana)", price_usd: 229 },
  { slug: "devils-pool-angels-pool", name: "Devil's Pool / Angel's Pool", price_usd: 120 },
  { slug: "zambezi-national-park-game-drive", name: "Zambezi National Park Game Drive", price_usd: 80 },
  { slug: "bungee-jumping", name: "Victoria Falls Bungee Jump", price_usd: 194 },
  { slug: "gorge-swing", name: "Victoria Falls Bridge Swing", price_usd: 137 },
  { slug: "bridge-zipline", name: "Victoria Falls Bridge Zipline", price_usd: 58 },
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
    if (error || !data || data.length === 0) return FALLBACK_TOURS;
    return data as Tour[];
  } catch {
    return FALLBACK_TOURS;
  }
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
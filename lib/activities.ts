import type { Tour } from "@/lib/types";

/** The four groupings shown in the Activities section. */
export type ActivityCategory = "adrenaline" | "wildlife" | "scenic" | "cultural";

export const ACTIVITY_CATEGORIES: { id: ActivityCategory; label: string }[] = [
  { id: "adrenaline", label: "Adrenaline & Adventure" },
  { id: "wildlife", label: "Wildlife and Safari" },
  { id: "scenic", label: "Scenic Tours" },
  { id: "cultural", label: "Cultural" },
];

export type Activity = Tour & { category: ActivityCategory };

/** Reused category images so no card renders a broken image. */
const IMAGE: Record<ActivityCategory, string> = {
  adrenaline: "/images/tours/bungee-jumping.jpg",
  wildlife: "/images/places/zambezi-national-park.jpg",
  scenic: "/images/places/zambezi-river.jpg",
  cultural: "/images/places/victoria-falls.jpg",
};

/**
 * The wider activity catalog.
 *
 * These are deliberately kept separate from the eight core tours in
 * lib/tours.ts so nothing is listed twice. Anything already covered by a core
 * tour is excluded here: bridge swing, gorge swing, bridge slide / zip line,
 * bungee jump, Devil's Pool, Chobe day trip, ZNP game drive, guided Falls tour
 * and sunset cruise are all already on the tours list.
 *
 * Prices are published 2026 rate-card figures. National park and conservation
 * levies are listed separately on each detail page under `governmentFees`.
 */
const RAW: {
  slug: string;
  name: string;
  price: number;
  category: ActivityCategory;
}[] = [
  // Adrenaline & Adventure
  { slug: "white-water-rafting", name: "White Water Rafting", price: 173, category: "adrenaline" },
  { slug: "adventure-jet-boat", name: "Adventure Jet Boat", price: 141, category: "adrenaline" },
  { slug: "river-boarding", name: "River Boarding", price: 190, category: "adrenaline" },
  { slug: "flying-fox", name: "Flying Fox", price: 69, category: "adrenaline" },
  { slug: "canopy-tour", name: "Canopy Tour", price: 81, category: "adrenaline" },

  // Wildlife and Safari
  { slug: "upper-zambezi-canoeing", name: "Upper Zambezi Canoeing", price: 170, category: "wildlife" },
  { slug: "overnight-canoe-safari", name: "Overnight Canoe Safari", price: 286, category: "wildlife" },
  { slug: "siduli-hide", name: "Siduli Hide", price: 58, category: "wildlife" },
  { slug: "rhino-game-drive-dinner", name: "Rhino Search Game Drive & Dinner", price: 288, category: "wildlife" },
  { slug: "elephant-encounter", name: "Elephant Encounter", price: 169, category: "wildlife" },
  { slug: "zambezi-fishing", name: "Zambezi Fishing", price: 150, category: "wildlife" },
  { slug: "horseback-safari", name: "Horse Back Safari", price: 148, category: "wildlife" },
  { slug: "walking-safari", name: "Walking Safari", price: 112, category: "wildlife" },
  { slug: "lion-encounter", name: "Lion Encounter", price: 115, category: "wildlife" },

  // Scenic Tours
  { slug: "helicopter-flight", name: "Helicopter Flight", price: 173, category: "scenic" },
  { slug: "microlight-flight", name: "Microlite Flight", price: 190, category: "scenic" },
  { slug: "river-safari", name: "River Safari", price: 81, category: "scenic" },
  { slug: "sunset-dinner-cruise", name: "Sunset and Dinner Cruise", price: 110, category: "scenic" },
  { slug: "zambezi-explorer-cruise", name: "Zambezi Explorer Sunset Cruise", price: 110, category: "scenic" },
  { slug: "ra-ikane-cruise", name: "Ra Ikane Cruise", price: 110, category: "scenic" },
  { slug: "historic-bridge-tour", name: "Historical Bridge Tour", price: 64, category: "scenic" },
  { slug: "steam-train-trip", name: "Steam Train Trip", price: 220, category: "scenic" },
  { slug: "victoria-falls-tram", name: "Victoria Falls Tram", price: 75, category: "scenic" },
  { slug: "livingstone-island-tour", name: "Livingstone Island Tour", price: 159, category: "scenic" },
  { slug: "crocodile-farm", name: "Crocodile Farm", price: 15, category: "scenic" },
  { slug: "lunar-rainbow-tour", name: "Lunar Rainbow Tour", price: 31, category: "scenic" },
  { slug: "bike-tour", name: "Bike Tour", price: 60, category: "scenic" },

  // Cultural
  { slug: "boma-dinner", name: "Boma Dinner", price: 60, category: "cultural" },
  { slug: "dusty-road-experience", name: "Dusty Road Experience", price: 100, category: "cultural" },
  { slug: "traditional-village-tour", name: "Traditional Village Tour", price: 74, category: "cultural" },
  { slug: "simunye-theatre", name: "Victoria Falls Theatre: Simunye", price: 58, category: "cultural" },
];

export const ACTIVITIES: Activity[] = RAW.map((a, i) => ({
  id: a.slug,
  slug: a.slug,
  name: a.name,
  price_usd: a.price,
  category: a.category,
  description: null,
  image_url: IMAGE[a.category],
  sort_order: i + 1,
  is_active: true,
}));

/** A single activity by slug, or undefined. */
export function getActivity(slug: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.slug === slug);
}
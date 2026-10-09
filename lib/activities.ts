import type { Tour } from "@/lib/types";

/** The four groupings shown in the Activities section. */
export type ActivityCategory = "adrenaline" | "wildlife" | "scenic" | "cultural" | "accommodation";

export const ACTIVITY_CATEGORIES: { id: ActivityCategory; label: string }[] = [
  { id: "adrenaline", label: "Adrenaline & Adventure" },
  { id: "wildlife", label: "Wildlife and Safari" },
  { id: "scenic", label: "Scenic Tours" },
  { id: "cultural", label: "Cultural" },
  { id: "accommodation", label: "Accommodation" },
];

export type Activity = Tour & { category: ActivityCategory };

/** Reused category images so no card renders a broken image. */
const IMAGE: Record<ActivityCategory, string> = {
  adrenaline: "/images/tours/bungee-jumping.jpg",
  wildlife: "/images/places/zambezi-national-park.jpg",
  scenic: "/images/places/zambezi-river.jpg",
  cultural: "/images/places/victoria-falls.jpg",
  accommodation: "/images/places/victoria-falls.jpg",
};

/**
 * Per-activity photos in /public/images/activities/<slug>.jpg.
 * Activities without one fall back to their category image above.
 */
const ACTIVITY_IMAGE: Record<string, string> = {
  "white-water-rafting": "/images/activities/white-water-rafting.jpg",
  "adventure-jet-boat": "/images/activities/adventure-jet-boat.jpg",
  "river-boarding": "/images/activities/river-boarding.jpg",
  "flying-fox": "/images/activities/flying-fox.jpg",
  "canopy-tour": "/images/activities/canopy-tour.jpg",
  "upper-zambezi-canoeing": "/images/activities/upper-zambezi-canoeing.jpg",
  "overnight-canoe-safari": "/images/activities/overnight-canoe-safari.jpg",
  "siduli-hide": "/images/activities/siduli-hide.jpg",
  "rhino-game-drive-dinner": "/images/activities/rhino-game-drive-dinner.jpg",
  "elephant-encounter": "/images/activities/elephant-encounter.jpg",
  "zambezi-fishing": "/images/activities/zambezi-fishing.jpg",
  "horseback-safari": "/images/activities/horseback-safari.jpg",
  "walking-safari": "/images/activities/walking-safari.jpg",
  "lion-encounter": "/images/activities/lion-encounter.jpg",
  "helicopter-flight": "/images/activities/helicopter-flight.jpg",
  "microlight-flight": "/images/activities/microlight-flight.jpg",
  "river-safari": "/images/activities/river-safari.jpg",
  "sunset-dinner-cruise": "/images/activities/sunset-dinner-cruise.jpg",
  "zambezi-explorer-cruise": "/images/activities/zambezi-explorer-cruise.jpg",
  "ra-ikane-cruise": "/images/activities/ra-ikane-cruise.jpg",
  "historic-bridge-tour": "/images/activities/historic-bridge-tour.jpg",
  "steam-train-trip": "/images/activities/steam-train-trip.webp",
  "victoria-falls-tram": "/images/activities/victoria-falls-tram.jpg",
  "livingstone-island-tour": "/images/activities/livingstone-island-tour.jpg",
  "crocodile-farm": "/images/activities/crocodile-farm.jpg",
  "lunar-rainbow-tour": "/images/activities/lunar-rainbow-tour.jpg",
  "bike-tour": "/images/activities/bike-tour.jpg",
  "boma-dinner": "/images/activities/boma-dinner.jpg",
  "dusty-road-experience": "/images/activities/dusty-road-experience.jpg",
  "traditional-village-tour": "/images/activities/traditional-village-tour.jpg",
  "simunye-theatre": "/images/activities/simunye-theatre.jpg",
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
  { slug: "flying-fox", name: "Flying Fox", price: 70, category: "adrenaline" },
  { slug: "canopy-tour", name: "Canopy Tour", price: 81, category: "adrenaline" },

  // Wildlife and Safari
  { slug: "upper-zambezi-canoeing", name: "Upper Zambezi Canoeing", price: 196, category: "wildlife" },
  { slug: "overnight-canoe-safari", name: "Overnight Canoe Safari", price: 286, category: "wildlife" },
  { slug: "siduli-hide", name: "Siduli Hide", price: 58, category: "wildlife" },
  { slug: "rhino-game-drive-dinner", name: "Rhino Search Game Drive & Dinner", price: 207, category: "wildlife" },
  { slug: "elephant-encounter", name: "Elephant Encounter", price: 179, category: "wildlife" },
  { slug: "zambezi-fishing", name: "Zambezi Fishing", price: 165, category: "wildlife" },
  { slug: "horseback-safari", name: "Horse Back Safari", price: 160, category: "wildlife" },
  { slug: "walking-safari", name: "Walking Safari", price: 140, category: "wildlife" },
  { slug: "lion-encounter", name: "Lion Encounter", price: 173, category: "wildlife" },
  { slug: "bird-watching", name: "Bird Watching", price: 190, category: "wildlife" },

  // Scenic Tours
  { slug: "helicopter-flight", name: "Helicopter Flight", price: 202, category: "scenic" },
  { slug: "microlight-flight", name: "Microlite Flight", price: 220, category: "scenic" },
  { slug: "river-safari", name: "River Safari", price: 81, category: "scenic" },
  { slug: "sunset-dinner-cruise", name: "Sunset and Dinner Cruise", price: 122, category: "scenic" },
  { slug: "zambezi-explorer-cruise", name: "Zambezi Explorer Sunset Cruise", price: 92, category: "scenic" },
  { slug: "sunrise-cruise", name: "Sunrise Cruise", price: 92, category: "scenic" },
  { slug: "lunch-cruise", name: "Lunch Cruise", price: 105, category: "scenic" },
  { slug: "ra-ikane-cruise", name: "Ra Ikane Cruise", price: 110, category: "scenic" },
  { slug: "historic-bridge-tour", name: "Historical Bridge Tour", price: 96, category: "scenic" },
  { slug: "steam-train-trip", name: "Steam Train Trip", price: 250, category: "scenic" },
  { slug: "victoria-falls-tram", name: "Victoria Falls Bamba Tram", price: 65, category: "scenic" },
  { slug: "livingstone-island-tour", name: "Livingstone Island Tour", price: 159, category: "scenic" },
  { slug: "crocodile-farm", name: "Crocodile Farm", price: 55, category: "scenic" },
  { slug: "lunar-rainbow-tour", name: "Lunar Rainbow Tour", price: 31, category: "scenic" },
  { slug: "bike-tour", name: "Bike Tour", price: 60, category: "scenic" },
  { slug: "falls-tour-zam", name: "Falls Tour (Zambia)", price: 75, category: "scenic" },
  { slug: "big-tree-visit", name: "Big Tree Visit", price: 40, category: "scenic" },
  { slug: "quad-bikes", name: "Quad Bikes", price: 72, category: "scenic" },
  { slug: "airport-transfer", name: "Airport Transfer", price: 17, category: "scenic" },
  { slug: "airport-transfer-livingstone", name: "Airport Transfer (Livingstone Airport)", price: 30, category: "scenic" },

  // Cultural
  { slug: "boma-dinner", name: "Boma Dinner", price: 85, category: "cultural" },
  { slug: "dusty-road-experience", name: "Dusty Road Experience", price: 70, category: "cultural" },
  { slug: "traditional-village-tour", name: "Traditional Village Tour", price: 75, category: "cultural" },
  { slug: "simunye-theatre", name: "Victoria Falls Theatre: Simunye", price: 68, category: "cultural" },
  { slug: "city-tour", name: "City Tour", price: 65, category: "cultural" },
  { slug: "shopping-tour", name: "Shopping", price: 30, category: "cultural" },
  { slug: "livingstone-city-tour-museum", name: "Livingstone City Tour & Museum", price: 190, category: "cultural" },

  // Accommodation
  { slug: "mollynelly-guesthouse", name: "Mollynelly Guesthouse", price: 220, category: "accommodation" },
];

export const ACTIVITIES: Activity[] = RAW.map((a, i) => ({
  id: a.slug,
  slug: a.slug,
  name: a.name,
  price_usd: a.price,
  category: a.category,
  description: null,
  image_url: ACTIVITY_IMAGE[a.slug] ?? IMAGE[a.category],
  sort_order: i + 1,
  is_active: true,
}));

/** A single activity by slug, or undefined. */
export function getActivity(slug: string): Activity | undefined {
  return ACTIVITIES.find((a) => a.slug === slug);
}
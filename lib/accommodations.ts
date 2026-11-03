/**
 * Accommodation we can book for guests in Victoria Falls.
 *
 * These are shown in the Accommodation group on /tours and each one gets its
 * own detail page at /tours/<slug>. Nightly rates are not published because
 * they move with season and room type, so `price_usd` stays null and the team
 * confirms the live rate for the guest's dates.
 *
 * Property details come from the public Google Hotels listings (ratings and
 * amenities) supplied by the business. Keep them in sync when they change.
 */

export type StayKind =
  | "Hotel"
  | "Guest lodge"
  | "Guest house"
  | "Lodge"
  | "Accommodation"
  | "Campsite"
  | "Backpackers"
  | "Holiday rental";

export type Stay = {
  slug: string;
  name: string;
  image?: string;
  kind: StayKind;
  /** Official star grading where the property has one. */
  stars?: 2 | 3 | 4 | 5;
  /** Guest score out of 5. */
  rating?: number;
  /** Review count exactly as shown publicly, e.g. "1.2k". */
  reviews?: string;
  amenities?: string[];
  /** One-line description used on the cards and detail page. */
  highlight?: string;
  /** Extra tags shown in the detail page notes (child-friendly, accessible...). */
  tags?: string[];
};

export const STAYS: Stay[] = [
  {
    slug: "n1-hotel-campsite-victoria-falls",
    name: "N1 Hotel & Campsite Victoria Falls",
    kind: "Hotel",
    stars: 3,
    rating: 4.3,
    reviews: "948",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Restaurant",
      "Airport shuttle",
    ],
    highlight:
      "A reliable, child-friendly base with a pool, restaurant and airport shuttle, plus campsite pitches for overlanders.",
    tags: ["Child-friendly"],
  },
  {
    slug: "dzimbahwe-guest-lodge",
    name: "Dzimbahwe Guest Lodge",
    kind: "Guest lodge",
    stars: 3,
    rating: 4.2,
    reviews: "330",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Restaurant",
      "Airport shuttle",
    ],
    highlight:
      "A quiet three-star guest lodge with a pool, restaurant and accessible rooms, a short drive from town.",
    tags: ["Accessible"],
  },
  {
    slug: "cresta-sprayview",
    name: "Cresta Sprayview",
    kind: "Hotel",
    stars: 3,
    rating: 4.2,
    reviews: "937",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Bar",
      "Restaurant",
      "Room service",
    ],
    highlight:
      "A central hotel with a pool, bar and restaurant, handy for both the town centre and the Falls.",
  },
  {
    slug: "shearwater-explorers-village",
    name: "Shearwater Explorers Village",
    kind: "Lodge",
    stars: 3,
    rating: 4.4,
    reviews: "1.1k",
    amenities: [
      "Breakfast available (paid)",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Bar",
      "Restaurant",
      "Kitchen in rooms",
    ],
    highlight:
      "Relaxed lodge-style rooms and self-catering units with a pool, bar and restaurant in a garden setting.",
  },
  {
    slug: "victoria-falls-rainbow-hotel",
    name: "Victoria Falls Rainbow Hotel",
    image: "/images/accommodations/victoria-falls-rainbow-hotel.webp",
    kind: "Hotel",
    stars: 3,
    rating: 4.1,
    reviews: "782",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Restaurant",
      "Room service",
      "Airport shuttle",
    ],
    highlight:
      "A larger three-star hotel with a pool, restaurant, room service and an airport shuttle.",
  },
  {
    slug: "ilala-lodge-hotel",
    name: "Ilala Lodge Hotel",
    image: "/images/accommodations/ilala-lodge-hotel.webp",
    kind: "Hotel",
    stars: 4,
    rating: 4.6,
    reviews: "1.0k",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Bar",
      "Restaurant",
      "Room service",
    ],
    highlight:
      "An eco-certified four-star hotel within easy walking distance of the Falls, with a pool, bar and restaurant.",
    tags: ["Eco-certified"],
  },
  {
    slug: "victoria-falls-safari-club",
    name: "Victoria Falls Safari Club",
    image: "/images/accommodations/victoria-falls-safari-club.jpg",
    kind: "Hotel",
    stars: 5,
    rating: 4.6,
    reviews: "736",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Pool",
      "Air conditioning",
      "Fitness centre",
      "Spa",
      "Bar",
    ],
    highlight:
      "A five-star club-style stay with a pool, fitness centre, spa and bar, aimed at a quieter luxury break.",
  },
  {
    slug: "bayete-guest-lodge",
    name: "Bayete Guest Lodge",
    image: "/images/accommodations/bayete-guest-lodge.jpg",
    kind: "Guest lodge",
    stars: 4,
    rating: 4.5,
    reviews: "439",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Bar",
      "Restaurant",
      "Airport shuttle",
    ],
    highlight:
      "A relaxed four-star guest lodge with a pool, bar, restaurant and airport shuttle.",
  },
  {
    slug: "shongwe-lookout",
    name: "Shongwe Lookout",
    image: "/images/accommodations/shongwe-lookout.webp",
    kind: "Lodge",
    stars: 4,
    rating: 4.6,
    reviews: "379",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Bar",
      "Restaurant",
      "Airport shuttle",
    ],
    highlight:
      "A four-star lodge with a pool, bar and restaurant, well placed for the Falls and the town restaurants.",
  },
  {
    slug: "victoria-falls-deluxe-suites",
    name: "The Victoria Falls Deluxe Suites",
    kind: "Hotel",
    stars: 5,
    rating: 4.1,
    reviews: "66",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Pool",
      "Air conditioning",
      "Restaurant",
      "Airport shuttle",
    ],
    highlight:
      "Spacious five-star suites with a pool, restaurant and airport shuttle, and pet-friendly rooms on request.",
    tags: ["Pet-friendly"],
  },
  {
    slug: "nkosi-guest-lodge",
    name: "Nkosi Guest Lodge",
    image: "/images/accommodations/nkosi-guest-lodge.jpg",
    kind: "Guest lodge",
    stars: 5,
    rating: 4.6,
    reviews: "172",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Pool",
      "Air conditioning",
      "Restaurant",
      "Airport shuttle",
    ],
    highlight:
      "A small five-star guest lodge with a pool, restaurant and airport shuttle — personal and quiet.",
  },
  {
    slug: "zambezi-family-lodge",
    name: "Zambezi Family Lodge",
    image: "/images/accommodations/zambezi-family-lodge.jpg",
    kind: "Lodge",
    rating: 4.9,
    reviews: "344",
    amenities: [
      "Breakfast available (paid)",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Restaurant",
      "Kitchen in some rooms",
    ],
    highlight:
      "A family-focused lodge with a pool and restaurant, plus rooms with kitchen facilities for longer stays.",
    tags: ["Family-friendly"],
  },
  {
    slug: "the-victoria-falls-hotel",
    name: "The Victoria Falls Hotel",
    kind: "Hotel",
    stars: 5,
    rating: 4.6,
    reviews: "2.2k",
    amenities: [
      "Breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Fitness centre",
      "Spa",
      "Bar",
    ],
    highlight:
      "The historic five-star address in Victoria Falls, with a pool, spa, fitness centre and famous terrace bar.",
  },
  {
    slug: "zambezi-boutique-guesthouse",
    name: "Zambezi Boutique Guesthouse",
    image: "/images/accommodations/zambezi-boutique-guesthouse.jpg",
    kind: "Guest house",
    rating: 4.8,
    reviews: "102",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Fitness centre",
      "Bar",
      "Restaurant",
      "Room service",
    ],
    highlight:
      "A boutique guesthouse with a pool, fitness centre, bar and restaurant, plus room service.",
  },
  {
    slug: "victoria-falls-backpackers-lodge",
    name: "Victoria Falls Backpackers Lodge",
    image: "/images/accommodations/victoria-falls-backpackers-lodge.jpg",
    kind: "Backpackers",
    stars: 2,
    rating: 4.2,
    reviews: "391",
    amenities: [
      "Breakfast available (paid)",
      "Free Wi-Fi",
      "Free parking",
      "Pool",
      "Spa",
      "Restaurant",
      "Kitchen in some rooms",
      "Airport shuttle",
    ],
    highlight:
      "A sociable budget base with a pool, restaurant, shared kitchen and airport shuttle.",
  },
  {
    slug: "batonka-guest-lodge",
    name: "Batonka Guest Lodge",
    image: "/images/accommodations/batonka-guest-lodge.jpg",
    kind: "Guest lodge",
    stars: 4,
    rating: 4.7,
    reviews: "388",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Bar",
      "Restaurant",
      "Airport shuttle",
    ],
    highlight:
      "A four-star guest lodge with a pool, bar, restaurant and airport shuttle in a quiet part of town.",
  },
  {
    slug: "lokuthula-lodges",
    name: "Lokuthula Lodges",
    image: "/images/accommodations/lokuthula-lodges.webp",
    kind: "Lodge",
    stars: 3,
    rating: 4.6,
    reviews: "573",
    amenities: [
      "Free breakfast",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Spa",
      "Bar",
      "Restaurant",
    ],
    highlight:
      "Self-contained three-star lodges with a pool, spa, bar and restaurant in a peaceful setting.",
    tags: ["Family-friendly"],
  },
  {
    slug: "victoria-falls-oasis-hotel",
    name: "Victoria Falls Oasis Hotel",
    image: "/images/accommodations/victoria-falls-oasis-hotel.jpg",
    kind: "Hotel",
    rating: 4.5,
    reviews: "42",
    amenities: [
      "Breakfast available (paid)",
      "Free Wi-Fi",
      "Free parking",
      "Outdoor pool",
      "Air conditioning",
      "Bar",
      "Restaurant",
      "Airport shuttle",
      "Golf nearby",
    ],
    highlight:
      "A small, well-rated hotel with a pool, bar and restaurant, with golf nearby.",
  },
  {
    slug: "private-spacious-cottage-victoria-falls",
    name: "Private Spacious Cottage in Victoria Falls",
    kind: "Holiday rental",
    rating: 4.6,
    reviews: "43",
    amenities: [
      "Sleeps 5",
      "2 bedrooms",
      "2 bathrooms",
      "3 beds",
      "506 sq m",
      "Air conditioning",
      "Airport shuttle",
      "Ironing board",
    ],
    highlight:
      "A private three-bedroom cottage sleeping five, with air conditioning and airport transfers — good for families or a small group.",
    tags: ["Whole home", "Family-friendly"],
  },
  {
    slug: "the-pods-victoria-falls",
    name: "The Pods Victoria Falls",
    image: "/images/accommodations/the-pods-victoria-falls.jpg",
    kind: "Holiday rental",
    rating: 5,
    reviews: "25",
    amenities: [
      "Sleeps 2",
      "1 bedroom",
      "1 bathroom",
      "1 bed",
      "Kitchen",
      "Microwave",
      "Oven stove",
      "Outdoor pool",
      "Ironing board",
    ],
    highlight:
      "Compact pod-style stays for two with a kitchen and access to a shared outdoor pool.",
    tags: ["Whole home", "Couples"],
  },
  {
    slug: "drift-inn",
    name: "Drift Inn",
    image: "/images/accommodations/drift-inn.jpg",
    kind: "Accommodation",
    highlight: "Contact our team for property details, availability and current rates.",
  },
  {
    slug: "living-stone-lodge",
    name: "Living Stone Lodge",
    image: "/images/accommodations/living-stone-lodge.jpg",
    kind: "Accommodation",
    highlight: "Contact our team for property details, availability and current rates.",
  },
  {
    slug: "mbano-manor-hotel-victoria-falls",
    name: "Mbano Manor Hotel Victoria Falls",
    image: "/images/accommodations/mbano-manor-hotel-victoria-falls.jpg",
    kind: "Accommodation",
    highlight: "Contact our team for property details, availability and current rates.",
  },
  {
    slug: "mopani-lodge-victoria-falls",
    name: "Mopani Lodge Victoria Falls",
    image: "/images/accommodations/mopani-lodge-victoria-falls.jpg",
    kind: "Accommodation",
    highlight: "Contact our team for property details, availability and current rates.",
  },
  {
    slug: "phezulu-guest-lodge",
    name: "PheZulu Guest Lodge",
    image: "/images/accommodations/phezulu-guest-lodge.jpg",
    kind: "Accommodation",
    highlight: "Contact our team for property details, availability and current rates.",
  },
  {
    slug: "pioneers-lodge",
    name: "Pioneers Lodge",
    image: "/images/accommodations/pioneers-lodge.jpg",
    kind: "Accommodation",
    highlight: "Contact our team for property details, availability and current rates.",
  },
  {
    slug: "shongwe-oasis",
    name: "Shongwe Oasis",
    image: "/images/accommodations/shongwe-oasis.jpg",
    kind: "Accommodation",
    highlight: "Contact our team for property details, availability and current rates.",
  },
];

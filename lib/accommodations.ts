export type Accommodation = {
  slug: string;
  name: string;
  rating?: string;
  type: string;
  priceLabel: string;
  description: string;
  image?: string;
};

export const ACCOMMODATION_GROUPS: { title: string; stays: Accommodation[] }[] = [
  {
    title: "Mid-range & standard hotels",
    stays: [
      { slug: "dzimbahwe-guest-lodge", name: "Dzimbahwe Guest Lodge", rating: "4.2 (329 reviews)", type: "3-star hotel", priceLabel: "Around $100 per night", description: "Casual lodge with an outdoor pool.", image: "/images/accommodations/dzimbahwe-guest-lodge.jpg" },
      { slug: "zambezi-family-lodge", name: "Zambezi Family Lodge", rating: "4.9 (344 reviews)", type: "Lodge", priceLabel: "$100–$118 per night", description: "Well-rated family accommodation.", image: "/images/accommodations/zambezi-family-lodge.jpg" },
      { slug: "victoria-falls-rainbow-hotel", name: "Victoria Falls Rainbow Hotel", rating: "4.1 (782 reviews)", type: "3-star hotel", priceLabel: "$120–$200 per night", description: "Central hotel with balconies and a swim-up bar.", image: "/images/accommodations/victoria-falls-rainbow-hotel.jpg" },
      { slug: "cresta-sprayview", name: "Cresta Sprayview", rating: "4.2 (934 reviews)", type: "3-star hotel", priceLabel: "Around $130+ per night", description: "Laid-back hotel with a pool and free breakfast.", image: "/images/accommodations/cresta-sprayview.jpg" },
      { slug: "azambezi-river-lodge", name: "A'Zambezi River Lodge", rating: "4.4 (2.0K reviews)", type: "4-star hotel", priceLabel: "$158–$250 per night", description: "Set on the banks of the Zambezi River.", image: "/images/accommodations/azambezi-river-lodge.jpg" },
    ],
  },
  {
    title: "Upper-mid & 4-star lodges",
    stays: [
      { slug: "elephant-hills-resort", name: "Elephant Hills Resort", rating: "4.4 (2.8K reviews)", type: "4-star hotel", priceLabel: "$190–$398 per night", description: "Large resort-style property with a golf course.", image: "/images/accommodations/elephant-hills-resort.jpg" },
      { slug: "ilala-lodge", name: "Ilala Lodge", rating: "4.6 (1.0K reviews)", type: "4-star hotel", priceLabel: "$258–$487 per night", description: "The closest hotel to the Victoria Falls entrance.", image: "/images/accommodations/ilala-lodge.jpg" },
      { slug: "victoria-falls-safari-lodge", name: "Victoria Falls Safari Lodge", rating: "4.6 (735 reviews)", type: "5-star hotel", priceLabel: "$288–$433 per night", description: "Iconic multi-level thatch-and-timber lodge overlooking a wildlife waterhole.", image: "/images/accommodations/victoria-falls-safari-lodge.jpg" },
      { slug: "batonka-guest-lodge", name: "Batonka Guest Lodge", type: "Boutique guest lodge", priceLabel: "$150–$273+ per night", description: "A popular boutique guest-lodge option; rates vary by property.", image: "/images/accommodations/batonka-guest-lodge.jpg" },
      { slug: "bayete-guest-lodge", name: "Bayete Guest Lodge", type: "Boutique guest lodge", priceLabel: "$150–$273+ per night", description: "A popular boutique guest-lodge option; rates vary by property.", image: "/images/accommodations/bayete-guest-lodge.jpg" },
      { slug: "shongwe-lookout", name: "Shongwe Lookout", type: "Boutique guest lodge", priceLabel: "$150–$273+ per night", description: "A popular boutique guest-lodge option; rates vary by property.", image: "/images/accommodations/shongwe-lookout.jpeg" },
    ],
  },
  {
    title: "Luxury & 5-star properties",
    stays: [
      { slug: "victoria-falls-hotel", name: "The Victoria Falls Hotel", rating: "4.6 (2.2K reviews)", type: "5-star hotel", priceLabel: "$332–$684 per night", description: "Historic Edwardian-style luxury hotel.", image: "/images/accommodations/victoria-falls-hotel.jpg" },
      { slug: "palm-river-hotel", name: "Palm River Hotel", rating: "4.7 (383 reviews)", type: "5-star hotel", priceLabel: "$354–$634 per night", description: "Luxury riverfront property.", image: "/images/accommodations/palm-river-hotel.jpg" },
      { slug: "victoria-falls-safari-club", name: "Victoria Falls Safari Club", rating: "4.6 (735 reviews)", type: "5-star hotel", priceLabel: "$408–$552 per night", description: "High-end boutique club lodging.", image: "/images/accommodations/victoria-falls-safari-club.jpg" },
      { slug: "mbano-manor-hotel", name: "Mbano Manor Hotel", rating: "4.6 (179 reviews)", type: "5-star hotel", priceLabel: "$515–$600 per night", description: "Luxury boutique hotel set in the forest.", image: "/images/accommodations/mbano-manor-hotel.jpg" },
      { slug: "victoria-falls-safari-suites", name: "Victoria Falls Safari Suites", rating: "4.6 (735 reviews)", type: "5-star hotel", priceLabel: "$945–$1,405 per night", description: "Spacious family suites.", image: "/images/accommodations/victoria-falls-safari-suites.jpg" },
    ],
  },
  {
    title: "Out-of-town & private-island safari lodges",
    stays: [
      { slug: "chundu-island", name: "Chundu Island", type: "Private-island river lodge", priceLabel: "Around $495+ per person sharing", description: "Fully inclusive private-island stay on the Zambezi; rate supplied via Victoria Falls Guide.", image: "/images/accommodations/chundu-island.jpg" },
      { slug: "old-drift-lodge", name: "Old Drift Lodge", type: "Wilderness safari lodge", priceLabel: "$445–$1,975 per night", description: "Exclusive wilderness safari lodge with all-inclusive options; rates vary by lodge.", image: "/images/accommodations/old-drift-lodge.jpg" },
      { slug: "the-elephant-camp", name: "The Elephant Camp", type: "Wilderness safari lodge", priceLabel: "$445–$1,975 per night", description: "Exclusive wilderness safari lodge with all-inclusive options; rates vary by lodge.", image: "/images/accommodations/the-elephant-camp.jpg" },
      { slug: "the-hide", name: "The Hide", type: "Wilderness safari lodge", priceLabel: "$445–$1,975 per night", description: "Exclusive wilderness safari lodge with all-inclusive options; rates vary by lodge.", image: "/images/accommodations/the-hide.jpg" },
    ],
  },
];

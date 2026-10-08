import type { Tour } from "@/lib/types";
import { ACTIVITY_DETAILS } from "@/lib/activityDetails";

/**
 * Long-form detail content for the tour pages.
 *
 * This lives in code rather than Supabase so the pages always render, even
 * before the database is connected. `description` on a tour row still wins
 * for the intro paragraph, so you can override any of this from the
 * Supabase Table Editor when you are ready.
 */
export type TourDetail = {
  /** One line shown under the tour name on the card and detail page. */
  summary: string;
  /** "07:00 daily", "Afternoon", etc. */
  startTime: string;
  /** "11 hours", "3 hours", etc. */
  duration: string;
  /** "Min pax: 2". Empty string when there's no minimum. */
  minPax: string;
  /** Where the tour meets or departs from. */
  location: string;
  /** Full description, one entry per paragraph. */
  body: string[];
  /** Bullet list of what the price covers. */
  includes?: string[];
  /** Highlighted warning box, e.g. passport and visa requirements. */
  important?: string;
  /** Fees payable on top of the listed price, e.g. "$12.00 per person". */
  governmentFees?: string;
  /** Extra pricing options, e.g. tandem rates. Shown under the price. */
  priceNote?: string;
  /** Pricing options shown when you open the page, e.g. short and long flights. */
  variants?: { label: string; priceUsd: number }[];
  /** How guests get to the start of the tour. */
  pickup?: string;
  /** Where the tour finishes. Defaults to "back at the meeting point". */
  endPoint?: string;
  /** Practical notes: accessibility, capacity, confirmation. */
  notes?: string[];
};

export const TOUR_DETAILS: Record<string, TourDetail> = {
  "chobe-day-trip-botswana": {
    summary: "A full day in Botswana: a river cruise and a game drive in Chobe National Park.",
    startTime: "07:00 daily",
    duration: "11 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "A Chobe Day Trip is a full day safari experience that includes a cruise on the Chobe River and a game drive in the world famous Chobe National Park.",
      "A Chobe day trip is a unique opportunity to experience some of the best game viewing in Africa. A Chobe day trip is designed for visitors staying in Victoria Falls (Zimbabwe), that would like to visit the Chobe National Park in Botswana for the day. If you are visiting Victoria Falls and do not have the time for a few nights in the Chobe, a Chobe day trip comes highly recommended.",
      "The Chobe National Park in only an hour\u2019s drive from Victoria Falls, and is home to one of the largest wildlife concentrations in Africa. Bordered by the banks of the breath-taking Chobe River, it is famous for its rich elephant and lion population.",
      "The Chobe day trip departs daily from Victoria Falls and begins with a road transfer to the Botswana (Kazangula) border. Once you have gone through immigration and have met your Botswana guide, you will travel to the Chobe River to embark on a morning game cruise. This water safari gives you the unique opportunity to view the abundant wildlife of the Chobe National Park on the banks of the Chobe River.",
      "Lunch is then served at the beautiful Chobe Safari Lodge. Refreshments will be provided throughout the Chobe Day Trip.",
      "After lunch you will venture into the Chobe National Park in an open game drive vehicle. The afternoon\u2019s land-based safari heads deeper into the Park to spot the elusive big cats and massive elephant and big game species that make Chobe their home. After a full day in the Chobe you will make your way to the border post and start you journey back to Victoria Falls.",
      "The order of the activities might change depending on the previous day\u2019s wildlife sightings (i.e. start with a game drive and end the day with a cruise or vice versa).",
    ],
    includes: [
      "Road transfer to the Kazangula border and back",
      "Morning game cruise on the Chobe River",
      "Lunch at Chobe Safari Lodge",
      "Afternoon game drive in an open vehicle",
      "Refreshments throughout the day",
    ],
    important:
      "Please remember to bring your passport. Visas to enter Botswana may be required for certain Nationalities. You are responsible for any visa fees and requirements associated with entering or exiting Zimbabwe and Botswana. On entering Zimbabwe you may ask for a KAZA UniVisa or a double entry visa which will allow you to enter Zimbabwe twice without purchasing two visas.",
  },

  "victoria-falls-guided-tour": {
    summary:
      "English-speaking guided tour of the Falls with pickup from your accommodation, through the rainforest to the Zimbabwean-side viewpoints.",
    startTime: "8:00, 9:00, 11:00, 14:00 or 15:00",
    duration: "2 - 2.5 hours",
    minPax: "",
    location: "Pickup from your accommodation, or our office in Victoria Falls",
    body: [
      "Roar and River Safaris offers English-speaking guided tours of Victoria Falls, led by our own local guides based in the heart of the Falls.",
      "Guests will be picked up from their accommodation at various times (8:00 a.m., 9:00 a.m., 11:00 a.m., 2:00 p.m. or 3:00 p.m.) or by individual arrangement and taken to the Victoria Falls Visitor Center at Victoria Falls National Park. Alternatively, visitors to Victoria Falls can also wait for the guide at our office, a short walk from the national park entrance.",
      "The guided Victoria Falls tour then leads through the rainforest of the small national park to various viewpoints on the Zimbabwean side. Our tour guides ensure that the best photo opportunities are taken and also provide lots of information about the geology, flora and fauna of Victoria Falls. The guided tour takes around 2 - 2.5 hours.",
    ],
    includes: [
      "English-speaking local guide",
      "Pickup from your accommodation in Victoria Falls",
      "Entry to Victoria Falls National Park viewpoints",
    ],
    important:
      "If you would rather meet the guide directly, come to our office near the national park entrance. Times other than the scheduled pickups can be arranged \u2014 just mention it when you book.",
  },

  "zambezi-sunset-cruise": {
    summary: "Sunset cruise on the Zambezi: canapes, drinks and African wildlife as the sun goes down.",
    startTime: "3:30 pm",
    duration: "2.5 hours",
    minPax: "",
    location: "A'zambezi River Lodge, 308 Parkway Drive, Victoria Falls",
    governmentFees: "$12.00 per person",
    pickup:
      "We pick up from any hotel or lodge in Victoria Falls, Zimbabwe. You can also head directly to the meeting point and wait for the boat.",
    endPoint: "Go to the Batoka jetty. This activity ends back at the meeting point.",
    body: [
      "There is no better way to end the day in Victoria Falls than on the Zambezi. This evening cruise takes you out onto the river from the Batoka jetty as the light changes over the Falls, with canapes and drinks served on deck.",
      "Look out for hippos, crocodiles and a rich variety of bird species along the banks, and elephant herds that regularly come down to the water at dusk to drink.",
      "Photographers get the classic shot of the golden reflections on the water, the lush riverine landscape and the silhouettes of trees against the setting sun.",
    ],
    includes: [
      "Sunset cruise on the Zambezi River",
      "Selection of canapes",
      "Wines, local beers, spirits and soft drinks",
      "Hotel or lodge pickup and drop off in Victoria Falls",
    ],
    notes: [
      "Confirmation is received at the time of booking",
      "Not wheelchair accessible",
      "Service animals allowed",
      "Near public transportation",
      "Infants must sit on laps",
      "Most travellers can participate",
      "Maximum of 90 travellers",
    ],
    important:
      "Government fees of $12.00 per person are payable separately and are not included in the listed price.",
  },

  "devils-pool-angels-pool": {
    summary: "The famous rock ledge at the top of the Falls, reached by a guided 45-minute hike.",
    startTime: "08:00 daily",
    duration: "3 hours",
    minPax: "",
    location: "Victoria Falls entrance",
    body: [
      "Devil\u2019s Pool is a natural rock ledge that sits directly beneath the lip of the Falls, so you can swim in water that is spilling over the edge of the world\u2019s largest sheet of falling water. It is one of the most photographed places in Zimbabwe.",
      "Getting there is part of the experience. A local guide leads you along a rocky path and through a scramble to reach the pool. You swim in, sit in the water and let the spray wash over you while the Falls roar a few centimetres from your face.",
      "Angel\u2019s Pool, just along the path, is the quieter alternative \u2014 calmer water, still inside the curtain of falling water.",
      "The pool depends on river levels, so it is confirmed each morning. If the water is too high or too low, we swap to Angel\u2019s Pool or a gorge viewpoint instead.",
    ],
    includes: [
      "Guided hike to the rock ledge",
      "Swimming gear and towel",
      "Bottled water and light refreshments",
    ],
    important:
      "This tour requires a moderate fitness level and involves climbing and scrambling on wet rock. It is not suitable for anyone with a fear of heights or limited mobility.",
  },

  "zambezi-national-park-game-drive": {
    summary: "Open-vehicle game drive in the park that borders the Falls.",
    startTime: "06:00 and 15:30 daily",
    duration: "4 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "Zambezi National Park shares a border with Victoria Falls National Park, so you can go from the Falls to a game drive without leaving the area. The landscape is riverine woodland and open floodplain, and it is very different from the bush further south.",
      "Your guide will take you looking for elephant and buffalo herds along the Zambezi, with good chances of spotting lion, leopard and wild dog, and the parks are especially productive in the dry season.",
      "The drive ends back at the Falls in time for lunch or an afternoon activity, so it pairs easily with a cruise or the guided Falls tour.",
    ],
    includes: [
      "Open game drive vehicle",
      "Local English-speaking guide",
      "Bottled water",
    ],
    important:
      "Safaris run early morning and late afternoon to avoid the midday heat. Please carry a hat, sunscreen and closed shoes.",
  },

  "bungee-jumping": {
    summary: "A 111-metre bungee jump from the Victoria Falls Bridge into the Batoka Gorge.",
    startTime: "9:00 am to 5:00 pm daily",
    duration: "15-20 minutes",
    minPax: "Pax: 1 max",
    location: "Victoria Falls Bridge (15-min walk from town)",
    pickup:
      "Participants must first pass through the Zimbabwe border post before accessing the Victoria Falls Bridge. Check-in and registration take place at our bungee registration office near the bridge, with the jump platform on the bridge itself between Zimbabwe and Zambia. Transfers are available for $12 per person.",
    body: [
      "The bungee jump is priced at $194 per person for a solo jump.",
      "Get ready to experience one of the most thrilling adventures on the planet \u2014 a bungee jump from the iconic Victoria Falls Bridge. Standing 111 metres above the powerful Zambezi River, with the thunderous Victoria Falls as your backdrop, this is not just a jump, it\u2019s a leap into the heart of one of the world\u2019s greatest natural wonders.",
      "Feel the rush of adrenaline as you dive headfirst towards the Batoka Gorge, plummeting in freefall before the cord catches and launches you into a series of exhilarating bounces. Whether you\u2019re an experienced thrill-seeker or a first-time jumper, the unmatched combination of adrenaline and awe-inspiring scenery makes this an unforgettable, once-in-a-lifetime experience.",
      "Our expert team ensures a safe and seamless adventure, guiding you through every step. With Victoria Falls roaring beside you, it\u2019s more than a bungee jump \u2014 it\u2019s a leap into the wild beauty of Africa.",
    ],
    includes: [
      "111-metre bungee jump off the Victoria Falls Bridge, about 4 seconds of freefall",
      "US$194 per adult for a solo jump",
      "Expert safety crew and full briefing",
      "All safety equipment",
      "Certificate of completion",
      "Free cancellation up to 24 hours before your adventure",
      "Price match guarantee",
    ],
    notes: [
      "Operating hours: 9:00 am to 5:00 pm daily, subject to weather conditions",
      "Duration: around 15 to 20 minutes in total",
      "Check-in: pass through the Zimbabwe border post, then register at our office near the bridge",
      "Jump platform: on the Victoria Falls Bridge between Zimbabwe and Zambia",
      "Minimum age: 14",
      "Weight: between 40 kg and 120\u2013140 kg",
      "Fitness: not suitable for heart, back or high blood pressure issues",
      "Bring: passport, comfy clothes, closed shoes and a credit card",
      "Photos and video available for purchase after the jump",
      "Transfers available at extra cost of $12 per person",
      "Age 14+",
      "Maximum 1 traveller",
      "Free cancellation 24hrs prior to your adventure",
    ],
    important:
      "A valid passport is required to access the bridge. No visa is needed if you are only walking onto the bridge for the jump. We stop jumping during rain to protect the cords, and operating hours are subject to weather conditions.",
  },

  "bridge-zipline": {
    summary: "A high-speed zipline across the Victoria Falls Bridge, from Zambia to Zimbabwe in one glide.",
    startTime: "08:00 to 16:00 daily",
    duration: "15-20 minutes",
    minPax: "Pax: 2 max",
    location: "Victoria Falls Bridge (15-min walk from town)",
    variants: [
      { label: "Zipline", priceUsd: 110 },
      { label: "Tandem gorge", priceUsd: 193 },
      { label: "Tandem zipline", priceUsd: 160 },
      { label: "Flying fox", priceUsd: 70 },
    ],
    pickup:
      "Participants must first pass through the Zimbabwe border post before accessing the Victoria Falls Bridge. Check-in and registration take place at our activity registration office near the bridge, with the platform on the Victoria Falls Bridge itself between Zimbabwe and Zambia. Transfers are available for $12 per person.",
    body: [
      "Experience the thrill of flying across international borders with the Victoria Falls zipline, a high-speed ride that takes you from Zambia to Zimbabwe in one smooth glide. Suspended 111 metres above the rushing waters of the Zambezi River, you\u2019ll zip across the iconic Victoria Falls Bridge, with the breathtaking waterfall and dramatic Batoka Gorge as your backdrop.",
      "Feel the exhilaration as you slide from one country to another, solo or in tandem, surrounded by the raw beauty of one of the world\u2019s most famous natural wonders. Whether you\u2019re looking for a heart-pounding adventure or a new perspective on Victoria Falls, this cross-border slide offers an unforgettable way to enjoy the view and the thrill of flight.",
      "With no experience required, this activity is perfect for families, groups, or solo travellers. Our trained staff will ensure your safety and comfort, allowing you to focus on the excitement of soaring through the air and taking in the stunning landscape below. For a unique and thrilling way to experience the Victoria Falls Bridge, the Bridge Slide offers an unforgettable ride across two countries in one go.",
    ],
    includes: [
      "High-speed zipline across the gorge, up to 106 km/h",
      "Expert safety crew and full briefing",
      "All safety equipment",
      "Transfers within Victoria Falls at extra cost of $12 per person",
      "Free cancellation up to 24 hours before your adventure",
      "Price match guarantee",
    ],
    notes: [
      "Check-in: pass through the Zimbabwe border post, then register at our office near the bridge",
      "Platform: on the Victoria Falls Bridge between Zimbabwe and Zambia",
      "Minimum age: 6",
      "Weight: 40\u2013140 kg solo; up to 140 kg tandem",
      "Fitness: not suitable for heart, back or high blood pressure issues",
      "Bring: passport, comfy clothes, closed shoes and a credit card",
      "No experience required",
      "Photos and video available for purchase after the slide",
      "Transfers available at extra cost of $12 per person",
      "Age 6+",
      "Maximum 2 travellers",
      "Free cancellation 24hrs prior to your adventure",
    ],
    important:
      "We stop jumping during rain to protect the cords. Bring your passport, and wear closed shoes.",
  },

"gorge-swing": {
    summary: "A free-fall leap into a giant pendulum swing across the Batoka Gorge from the Victoria Falls Bridge.",
    startTime: "08:00 to 16:00 daily",
    duration: "1 hour",
    minPax: "Pax: 2 max",
    location: "Victoria Falls Bridge (15-min walk from town)",
    priceNote: "$201 per person for a tandem swing",
    pickup:
      "Participants must first pass through the Zimbabwe border post before accessing the Victoria Falls Bridge. Check-in and registration take place at our bungee registration office near the bridge, with the jump platform on the bridge itself between Zimbabwe and Zambia. Transfers are available for $12 per person.",
    body: [
      "The gorge swing is priced at $135 per person for a solo swing.",
      "For an adrenaline-pumping experience like no other, take on the epic Victoria Falls Bridge Swing. This thrilling adventure begins with a heart-racing leap from the iconic Victoria Falls Bridge, 111 metres above the roaring Zambezi River. But instead of freefalling like a bungee jump, you\u2019ll swoop in a massive arc across the stunning Batoka Gorge, swinging out over the rushing waters below.",
      "Feel the surge of excitement as gravity takes over, propelling you on an exhilarating pendulum swing that gives you a whole new perspective of the magnificent Victoria Falls. The thrill intensifies as you soar through the gorge, with the sound of the thundering waterfall echoing around you and the spectacular scenery rushing by.",
      "Perfect for solo adventurers or tandem pairs, the bridge swing is an unforgettable experience for anyone looking to combine adrenaline with the natural beauty of one of the world\u2019s most awe-inspiring locations. Our expert guides ensure your safety at every step, so all you need to do is embrace the thrill of the swing and enjoy the ride!",
    ],
    includes: [
      "Free-fall jump into a giant swing over the Batoka Gorge",
      "Expert safety crew and full briefing",
      "All safety equipment",
      "Certificate of completion",
      "Free cancellation up to 24 hours before your adventure",
    ],
    notes: [
      "Check-in: pass through the Zimbabwe border post, then register at our office near the bridge",
      "Jump platform: on the Victoria Falls Bridge between Zimbabwe and Zambia",
      "Minimum age: 14",
      "Weight: 40\u2013180 kg solo; up to 180 kg tandem",
      "Fitness: not suitable for heart, back or high blood pressure issues",
      "Bring: passport, comfy clothes, closed shoes and a credit card",
      "Photos and video available for purchase after the swing",
      "Transfers available at extra cost of $12 per person",
      "Age 14+",
      "Maximum 2 travellers",
      "Free cancellation 24hrs prior to your adventure",
    ],
    important:
      "We stop swinging during rain to protect the cords. Bring your passport, and wear closed shoes.",
  },
};

/** Detail content for a tour or activity, if we have any written for it. */
export function tourDetail(slug: string): TourDetail | undefined {
  // Activities live in a separate file so the core tour content above stays as it is.
  return TOUR_DETAILS[slug] ?? ACTIVITY_DETAILS[slug];
}

/** Intro paragraph: the database description if set, otherwise the summary. */
export function tourIntro(tour: Tour, detail?: TourDetail): string {
  return tour.description?.trim() || detail?.summary || "";
}
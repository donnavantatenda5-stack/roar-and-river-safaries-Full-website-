import type { TourDetail } from "@/lib/tourDetails";

/**
 * Detail content for the activities in lib/activities.ts.
 *
 * Separate from lib/tourDetails.ts so the core tour pages stay as they were.
 * Prices are published 2026 rate-card figures; park and conservation levies sit
 * under `governmentFees` rather than being folded into the headline price.
 */
export const ACTIVITY_DETAILS: Record<string, TourDetail> = {
  "white-water-rafting": {
    summary: "A full day on the Upper Zambezi, Grade 5 rapids with a calm float downstream.",
    startTime: "07:30",
    duration: "Full day",
    minPax: "Min pax: 2",
    location: "Upper Zambezi, near Victoria Falls",
    body: [
      "The Upper Zambezi is one of the few remaining stretches of river where you can float through Grade 5 rapids in an open inflatable raft, with nothing but rock, spray and a guide holding the rope.",
      "The day starts on the Zambezi, then the raft runs the Batoka Gorge below the Falls. Your guide will keep you rafting or in the water at every rapid, so there is no limit to how wet you get.",
      "The action floats into the calm stretch below the gorge, which is where the day eases off. There is time to swim and drift past hippo pods and elephant herds along the riverbanks.",
    ],
    includes: [
      "Return transfers from Victoria Falls accommodation",
      "All rafting equipment and life jackets",
      "Experienced river guides",
      "Drinks and light snacks on the river",
    ],
    governmentFees: "$12.00 per person (Zambezi National Park levy)",
    priceNote: "$161 per person during high water season",
    important:
      "Bring a change of clothes, quick-dry towel, sunscreen and secure glasses or contact lenses. Rafting is cancelled in unsafe flow conditions.",
  },

  "adventure-jet-boat": {
    summary: "High-speed jet boat up the Zambezi to the Falls, with a full loop of the rapids.",
    startTime: "09:00 and 15:00",
    duration: "1 hour",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "The fastest way to feel the scale of the Zambezi. A high-speed jet boat takes you upriver toward the Falls and into the boiling water below the spray.",
      "Expect to be turned through the rapids, spun on the bow, and soaked. It is the most direct way to feel the power of the Falls from below.",
    ],
    includes: [
      "Return transfers from Victoria Falls accommodation",
      "Life jackets and safety briefing",
      "Refreshments on the boat",
    ],
    governmentFees: "$12.00 per person (Zambezi National Park levy)",
    notes: [
      "Minimum age 6, children with an adult",
      "Passengers must be able to swim",
      "Rides are weather dependent",
    ],
  },

  "river-boarding": {
    summary: "Surf the Zambezi standing on a board as the current carries you through the rapids.",
    startTime: "Morning",
    duration: "Half day",
    minPax: "Min pax: 4",
    location: "Upper Zambezi, near Victoria Falls",
    body: [
      "River boarding is river rafting with the raft swapped for a board. The current does the work, and your guide steers from behind on a jet ski, holding you upright as you ride wave after wave.",
      "Sessions run in calmer water where possible, so it suits most guests with no kayaking or surfing experience.",
    ],
    includes: [
      "Return transfers from Victoria Falls accommodation",
      "Board, helmet and buoyancy aid",
      "Jetski guide safety support",
      "Refreshments on the river",
    ],
    governmentFees: "$10.00 per person (Zambezi National Park levy)",
    notes: [
      "Minimum 4 guests to run",
      "Seasonal, low water season only",
      "Bring a change of clothes and quick-dry towel",
    ],
    important:
      "River boarding depends on water levels and may not run in high or low flow. Guest weights are confirmed with the operator before booking.",
  },

  "flying-fox": {
    summary: "A cable slide and zip line across the Batoka Gorge.",
    startTime: "08:00 to 17:00",
    duration: "2 hours",
    minPax: "Min pax: 2",
    location: "Batoka Gorge, Victoria Falls",
    body: [
      "The Flying Fox takes you over the Batoka Gorge in two stages. You ride a cable slide down from the rim, then zip across the gorge suspended between the two cliff faces.",
      "It is one of the best short adrenaline experiences at the Falls, and the gorge views alone are worth the trip.",
    ],
    includes: [
      "Cable slide and zip line",
      "Full harness and safety briefing",
      "Certificate of completion",
    ],
    governmentFees: "$6.00 per person (gorge access levy)",
    notes: ["Minimum age 6", "Weight limits apply per stage", "Closed in high wind"],
  },

  "canopy-tour": {
    summary: "Walk elevated walkways suspended above the Victoria Falls rainforest.",
    startTime: "08:00 to 17:00",
    duration: "1.5 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls rainforest",
    body: [
      "The canopy tour is a guided walk along steel walkways built above the rainforest floor, with the river and spray close enough to hear.",
      "Keep an eye out for the birds and small mammals that live in the canopy itself, and the fig trees that hang right over the walkways.",
    ],
    includes: [
      "Guided canopy walkway tour",
      "Full safety briefing and harness",
      "Rainforest conservation levy",
    ],
    governmentFees: "Included in the listed price",
    notes: [
      "Suitable for most ages with supervision",
      "Not recommended for anyone with a fear of heights",
      "Closed in high wind",
    ],
  },

  "upper-zambezi-canoeing": {
    summary: "Paddle a two-person canoe through the calm upper Zambezi past elephant and hippo.",
    startTime: "07:00 daily",
    duration: "5 hours",
    minPax: "Min pax: 2",
    location: "Upper Zambezi, near Victoria Falls",
    body: [
      "Above the Falls the Zambezi widens and slows, and this is the ideal stretch to paddle. You drift past elephant herds coming down to drink, hippo pods mid-channel, and thick stands of riverine forest.",
      "A guide steers from the stern, so the pace is unhurried and the wildlife photography is excellent. Breakfast and lunch are served on dry land partway through.",
    ],
    includes: [
      "Two-person canoe, paddles and safety kit",
      "Qualified canoe guide",
      "Breakfast and lunch",
      "Drinks throughout",
    ],
    governmentFees: "$10.00 per person (Zambezi National Park levy)",
    notes: [
      "Minimum 2 guests",
      "Duration can stretch with wildlife sightings",
      "Not suitable for guests with limited upper body mobility",
    ],
  },

  "overnight-canoe-safari": {
    summary: "Spend the night in a star bed in the Zambezi bush, canoe by day and eat by firelight.",
    startTime: "Day 1: 08:00",
    duration: "Overnight",
    minPax: "Min pax: 4",
    location: "Zambezi National Park, upstream of the Falls",
    body: [
      "A longer and quieter version of upper Zambezi canoeing. You spend the afternoon paddling through river channels and backwater swamps, then tie up on a private island for the night.",
      "The night is spent in an elevated star bed or a canvas tent, with dinner cooked over an open fire. Dawn brings a canoe run as the light comes up over the river.",
    ],
    includes: [
      "Two-person canoe, paddles and safety kit",
      "Guides and camp staff",
      "All meals from lunch on day 1 to breakfast on day 2",
      "Private island camp with star bed or tent",
      "Drinks and guided night walk",
    ],
    governmentFees: "$35.00 per person (national park and camping levies)",
    priceNote: "2 days / 1 night $462, 2 days / 2 nights $550 (plus levies)",
    notes: [
      "Minimum 4 guests to run",
      "Bucket showers and bush toilets",
      "Carries are limited to a small day bag",
    ],
    important:
      "This is a wilderness camp with no electricity and no walls around you. Bring insect repellent, a warm layer for the night and a headtorch.",
  },

  "siduli-hide": {
    summary: "A hide overlooking a waterhole where elephant and buffalo come down to drink.",
    startTime: "Sunrise and sunset",
    duration: "3 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls Private Game Reserve",
    body: [
      "Siduli is a walk-in hide built into a waterhole in the Victoria Falls Private Game Reserve. You sit at water level behind a hide and watch as animals come to the water unaware of you.",
      "Sitting quietly like this gets you close to elephant, buffalo, wild dog and zebra in a way no vehicle ever can. Drinks and snacks are served at the hide.",
    ],
    includes: [
      "Three-hour hide session",
      "Guided walk to and from the hide",
      "Drinks and snacks",
      "National park and reserve fees",
    ],
    governmentFees: "Included in the listed price",
    notes: [
      "Maximum 8 guests per session",
      "Quiet is enforced in the hide",
      "Sunrise and sunset departures only",
    ],
  },

  "rhino-game-drive-dinner": {
    summary: "An afternoon drive, a night drive looking for rhino, then dinner under the stars.",
    startTime: "15:30",
    duration: "Evening",
    minPax: "Min pax: 2",
    location: "Victoria Falls Private Game Reserve",
    body: [
      "The afternoon drive covers the reserve's waterholes and open grassland, and by late afternoon you are out on a spotlight drive searching for rhino in the brush.",
      "Dinner is served around a fire at an open-air boma, with the sounds of the bush around you, before the drive back to town.",
    ],
    includes: [
      "Afternoon game drive",
      "Spotlight rhino search drive",
      "Bush dinner around a fire",
      "Guides, drinks and light snacks",
      "National park and reserve fees",
    ],
    governmentFees: "$8.00 per person (conservation levy)",
    notes: [
      "Minimum 2, maximum 6 guests",
      "Premium wines extra",
      "Not suitable for children under 12",
    ],
    important:
      "Rhino are wild animals and cannot be guaranteed on any drive. The reserve raises black and white rhino for conservation and this activity supports that work.",
  },

  "elephant-encounter": {
    summary: "Walk alongside the elephants of the Victoria Falls sanctuary with their keeper.",
    startTime: "Morning",
    duration: "2 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "Rather than viewing elephants from a vehicle, you walk into the sanctuary and spend time among them alongside the keeper who cares for them.",
      "The elephants roam free in a large area during the walk, and you will see the social behaviour up close, including calves interacting with the herd.",
    ],
    includes: [
      "Guided walk with an elephant keeper",
      "All required permits and insurance",
      "Sanctuary conservation fee",
      "Refreshments",
    ],
    governmentFees: "$24.00 per person (national park and sanctuary levies)",
    notes: [
      "Minimum 2, maximum 8 guests",
      "Minimum age 12",
      "Not suitable for guests with mobility limitations",
    ],
  },

  "zambezi-fishing": {
    summary: "Catch and release fishing for tigerfish and bream from a guided boat on the Zambezi.",
    startTime: "Early morning",
    duration: "3, 5 hours or full day",
    minPax: "Min pax: 2",
    location: "Zambezi River, Victoria Falls",
    body: [
      "The Zambezi is one of Africa's great tigerfish rivers. You fish from a stable aluminium boat with a guide who knows the banks where the big fish lie.",
      "Catches include tigerfish, bream, barbel and vundu. This is catch and release, with no fish taken off the river.",
    ],
    includes: [
      "Guided boat on the Zambezi",
      "Fishing tackle and bait",
      "Catch and release handling",
      "Drinks",
    ],
    governmentFees: "$24.00 per person (national park levy)",
    priceNote: "3 hours $150, 5 hours $200, full day $300 (plus levy)",
    notes: [
      "Minimum 2 guests",
      "Strict catch-and-release river",
      "Fishing is suspended during spawning periods",
    ],
  },

  "horseback-safari": {
    summary: "Ride across the Victoria Falls plateau with the Batoka Gorge as your horizon.",
    startTime: "Morning",
    duration: "2.5 to 3 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "Horses have been part of the Victoria Falls story since the days of Livingstone and the elephant caravans that worked on the railway. You ride on the same plateau trail system those routes used.",
      "The standard ride is open to both novice and experienced riders, with open plateau views toward the gorge and frequent eland and zebra sightings.",
    ],
    includes: [
      "Guided trail ride",
      "Helmet and riding boots",
      "Riding refreshments",
      "Tracker-led nature commentary",
    ],
    governmentFees: "$20.00 per person (national park and conservation levies)",
    priceNote: "Long ride, experienced riders only, $224 per person",
    notes: [
      "Minimum 2, maximum 8 riders",
      "Weight limit 100 kg",
      "Minimum age 6; under 12 with an adult",
      "Closed in severe weather",
    ],
  },

  "walking-safari": {
    summary: "A few hours on foot in Zambezi National Park with a professional guide and tracker.",
    startTime: "06:00 and 15:00",
    duration: "Half day",
    minPax: "Min pax: 2",
    location: "Zambezi National Park",
    body: [
      "A walking safari is the way to read the bush properly. On foot you notice elephant tracks, kill sites, spoor and the small things a vehicle rolls straight past.",
      "You are accompanied by both a licensed guide and a tracker, and the route is chosen around whatever the guides have picked up overnight.",
    ],
    includes: [
      "Professional guide and armed tracker",
      "Snacks, tea and water en route",
      "Park entry",
    ],
    governmentFees: "$18.00 per person (Zambezi National Park levy)",
    notes: [
      "Minimum 2 guests",
      "Can be combined with a morning game drive",
      "Guests must be able to walk 5 km",
      "Minimum age 12",
    ],
    important:
      "This is on foot in open bush with large animals present. Follow the guide's instructions exactly and do not stray from the group.",
  },

  "lion-encounter": {
    summary: "Meet rescued wild lion at the sanctuary conservation programme near the Falls.",
    startTime: "Morning and afternoon",
    duration: "1.5 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "Lion breeding and rehabilitation programmes rescue cubs that would not survive in the wild, and the encounters exist to fund that care.",
      "You are taken into the enclosure by a keeper for a close look at the lion and the surrounding breeding work.",
    ],
    includes: ["Keeper-led encounter", "Sanctuary conservation fee", "Refreshments"],
    governmentFees: "$10.00 per person (national park levy)",
    notes: [
      "Minimum age 12 for the close encounter",
      "Minimum 2, maximum 6 guests",
      "Photographs permitted, no flash",
    ],
  },

  "helicopter-flight": {
    summary: "12 to 15 minutes over the Falls, including a possible Devil's Pool landing.",
    startTime: "08:00 to 16:00",
    duration: "12 to 15 minutes",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "The Flight of Angels is the short helicopter flight, and the one most guests pick. You lift off from the airstrip on the Falls road, bank out over the Batoka Gorge and hold over the smoke.",
      "On a clear day the pilot can set the helicopter down at Devil's Pool, the slip of rock at the lip of the falls, for photographs above 100 metres of falling water. That landing is at the pilot's discretion and is never guaranteed.",
    ],
    includes: [
      "12 to 15 minute helicopter flight",
      "Return transfers from Victoria Falls accommodation",
      "Experienced pilot with commentary",
      "Photo and video on board",
    ],
    governmentFees: "$37.00 per person (government and fuel levy)",
    important:
      "Bring your passport for security clearance. Flights can be delayed or rerouted by weather, and Devil's Pool landings are at the pilot's discretion.",
    notes: [
      "Combined passenger weight of 220 kg for 3 passengers of average build",
      "Accurate weights are given at check-in",
      "Loose items secured before flight",
    ],
  },

  "microlight-flight": {
    summary: "Fly a microlight over the Falls and Batoka Gorge with a fox sitting behind you.",
    startTime: "Morning",
    duration: "15 or 30 minutes",
    minPax: "Min pax: 2",
    location: "Livingstone, Zambia",
    body: [
      "A microlight gives you the same view as the helicopter at a fraction of the noise and, for many guests, more of the experience, because you fly it yourself.",
      "You take off in the air and then take the controls over the Batoka Gorge, with a fox sitting in the tail section behind you.",
    ],
    includes: [
      "15 or 30 minute microlight flight",
      "Full safety briefing and dual controls",
      "Aviation fee and insurance",
      "Passport",
    ],
    governmentFees: "$6.00 per person (Zambian Aviation Authority levy)",
    priceNote: "30 minute flight $380 (plus levy)",
    notes: [
      "Flights depart from the Zambia side; a visa for Zambia is required",
      "Weight range 45 to 95 kg",
      "Minimum age 16",
      "Transfers across the border are not included",
    ],
    important:
      "This flight launches from Livingstone in Zambia, not Zimbabwe. Allow time for a day visa and the border crossing.",
  },

  "river-safari": {
    summary: "A cruise on the Zambezi past hippo pods, elephant and crocodile country.",
    startTime: "09:00 and 15:00",
    duration: "2 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "The classic river safari is the easiest way to meet the wildlife of the Zambezi, because the animals come to the water to drink and you are already on it.",
      "You pass crocodile banks on the islands, hippo grazing in the shallows, and elephant herds along the channel.",
    ],
    includes: [
      "Guided boat cruise with drinks and snacks",
      "Transfer from Victoria Falls town",
      "National park levy",
    ],
    governmentFees: "$12.00 per person (Zambezi National Park levy)",
    notes: ["Minimum 2 guests", "Boats leave rain or shine", "Life jackets provided"],
  },

  "sunset-dinner-cruise": {
    summary: "An evening on the Zambezi, with dinner served as the light goes.",
    startTime: "17:00",
    duration: "3.5 hours",
    minPax: "Min pax: 1",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "This is the sunset cruise taken further, into the evening. You board in the late afternoon and spend the next few hours on the river as the light drops, with dinner served on board.",
      "The run goes out into the Zambezi channels past the islands, returning after dark.",
    ],
    includes: [
      "Sunset and dinner cruise, 17:00 to 20:30",
      "Dinner served on board",
      "Beer, wine and soft drinks",
    ],
    governmentFees: "$12.00 per person (Zambezi National Park levy)",
    notes: ["Minimum 1 guest", "Life jackets provided", "Operates rain or shine"],
  },

  "zambezi-explorer-cruise": {
    summary: "The larger Zambezi Explorer boat, with upper deck seating and a full bar.",
    startTime: "Sunset",
    duration: "2.5 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "The Zambezi Explorer is one of the larger vessels on the river, which means more deck space and steadier motion in chop.",
      "The Signature upper deck gives the better view of the Falls spray on the skyline, while the lower Luxury deck is easier to walk on and closer to the wildlife.",
    ],
    includes: [
      "Guided cruise with drinks and canapes",
      "Full bar service",
      "National park levy",
    ],
    governmentFees: "$12.00 per person (Zambezi National Park levy)",
    priceNote: "Luxury lower deck $81 per person",
    notes: ["Minimum 2 guests", "Life jackets provided", "No alcohol served to children"],
  },

  "ra-ikane-cruise": {
    summary: "Cruise the Zambezi aboard the Ra:Ikane, built in a classic riverrine style.",
    startTime: "Sunset",
    duration: "2 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "The Ra:Ikane is styled on the old riverrine boats that worked the Zambezi through the mid-century. It is the most traditional-looking boat on the river, and the covered stern deck is where you want to be.",
      "Cruises run into the sunset and a little past it, with dinner available on request.",
    ],
    includes: [
      "Sunset cruise on the Ra:Ikane",
      "Guides, drinks and canapes",
      "National park and river fees",
    ],
    governmentFees: "Included in the listed price",
    priceNote: "Private charter available on request",
    notes: ["Minimum 2 guests", "Life jackets provided", "Operates rain or shine"],
  },

  "historic-bridge-tour": {
    summary: "Walk across the 1905 steel arch bridge and out onto the Knife-Edge.",
    startTime: "Scheduled departures",
    duration: "1.5 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls Bridge",
    body: [
      "The Victoria Falls Bridge is a 198-metre steel arch built to carry a railway over the gorge in 1905, by the same company that later built Sydney Harbour Bridge. It was the first bridge across the Falls.",
      "The tour crosses the bridge on foot and out onto the Knife-Edge Bridge, with the gorge below you and the Falls in full view on one side.",
    ],
    includes: [
      "Guided walk across the bridge and Knife-Edge",
      "Historical commentary",
      "Return transfers from Victoria Falls town",
    ],
    governmentFees: "$50.00 per person (national park and bridge access levies)",
    notes: [
      "Minimum age 8",
      "Handrails at chest height on the Knife-Edge section",
      "Closed in high wind for safety",
    ],
    important:
      "Bring your passport for the Zambian border crossing onto the bridge. The Knife-Edge section is exposed; do not climb the handrails.",
  },

  "steam-train-trip": {
    summary: "A heritage steam train run between Livingstone and the Falls, with dinner service.",
    startTime: "Evening return",
    duration: "Afternoon to evening",
    minPax: "Min pax: 2",
    location: "Livingstone to Victoria Falls Bridge",
    body: [
      "The Bushtracks steam train runs the old Zambia Railway line between Livingstone and the Victoria Falls Bridge, steam locomotive behind and heritage carriages in front.",
      "Evening departures include dinner served on board, arriving back at the bridge as it is lit up after dark.",
    ],
    includes: [
      "Return heritage steam train ticket",
      "Dinner service on evening runs",
      "Cross-border transfers",
      "Zambian border procedures handled on board",
    ],
    governmentFees: "Border and visa requirements for crossing into Zambia apply",
    notes: [
      "Passports are required and taken for Zambia immigration",
      "Timetable follows a published seasonal schedule",
      "Seats are not reserved and fill quickly",
    ],
    important:
      "This journey crosses into Zambia. Guests need a valid Zimbabwe visa and either a Zambian day visa or a KAZA UniVisa.",
  },

  "victoria-falls-tram": {
    summary: "A short heritage tram ride from the hotel district into the Falls rainforest.",
    startTime: "Scheduled departures",
    duration: "30 minutes",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "The Bamba tram is a small open-sided railcar that runs a short line from the hotel area into the rainforest near the Falls.",
      "It is a cheap and relaxed way to get close to the spray and the forest without committing to a full tour.",
    ],
    includes: ["Return tram ticket", "Tram driver commentary"],
    governmentFees: "$10.00 per person (national park levy)",
    priceNote: "Children $40",
    notes: ["Minimum age 2", "Runs on a published schedule, weather permitting"],
  },

  "livingstone-island-tour": {
    summary: "Boat to Mosi-oa-Tunya island at the foot of the Falls, for lunch or high tea.",
    startTime: "Scheduled departures",
    duration: "3 to 4 hours",
    minPax: "Min pax: 2",
    location: "Mosi-oa-Tunya island, Zambezi, Victoria Falls",
    body: [
      "Mosi-oa-Tunya is the island at the foot of the Falls, only reachable by boat. Standing on it puts you directly under the falling water.",
      "Green Safaris runs a Breezer departure for a short island walk, a Lunch departure for the full afternoon, and a High Tea departure for the sundowner. The island's daily rate is the park entry fee.",
    ],
    includes: [
      "Return boat transfer to Mosi-oa-Tunya island",
      "Island guide",
      "Lunch or high tea depending on departure",
      "Island rate, which includes the daily park fee",
    ],
    governmentFees: "Island rate, which includes the national park fee",
    priceNote: "High Tea $189 off-peak / $199 peak. Island daily rate $50 per person",
    notes: [
      "Minimum 2 guests",
      "Green and low water seasons priced differently",
      "Day visitors are limited to a 4km strip of the island",
    ],
  },

  "crocodile-farm": {
    summary: "A guided visit to a working crocodile farm on the Victoria Falls outskirts.",
    startTime: "Scheduled departures",
    duration: "1 hour",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "Crocodile farming in Zimbabwe grew out of conservation programmes, and this farm breeds Nile and other species for conservation and commercial purposes.",
      "Guided crawls, feeding demonstrations and the grow-out pens make this a straightforward family stop on the way in or out of town.",
    ],
    includes: ["Guided farm tour", "Crocodile feeding demonstration", "Photographs"],
    governmentFees: "Included in the listed price",
    priceNote: "Children $7",
    notes: ["Minimum age 3", "Hand washing encouraged after the visit"],
  },

  "lunar-rainbow-tour": {
    summary: "A moonlit walk to the Knife-Edge for the lunar rainbow above the Falls.",
    startTime: "Full moon nights",
    duration: "2 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "A lunar rainbow appears under a full moon at the same angle as a daytime rainbow, but fainter, whiter and far less crowded.",
      "The tour is timed to the full moon and walks out to the Knife-Edge Bridge, where the spray is best positioned against the moon.",
    ],
    includes: ["Guided lunar rainbow walk", "Champagne", "National park and entry fees"],
    governmentFees: "$116.00 per person (national park entry and levies)",
    notes: [
      "Runs on full moon nights only",
      "Minimum 8 guests to run",
      "Maximum 12 guests",
      "Not suitable for guests with mobility limitations",
    ],
  },

  "bike-tour": {
    summary: "Cycle on quiet paths from town out to the Falls rainforest edge.",
    startTime: "Morning",
    duration: "2 to 3 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "Victoria Falls town is flat and traffic-light, which makes it an easy place to hire bikes and ride. The best route runs out toward the Falls and the Mukuvisi woodlands.",
      "Most operators include the bike, helmet, a guide and a water stop, so it suits guests who want to cover ground at their own pace.",
    ],
    includes: [
      "Bicycle and helmet",
      "Guided route",
      "Water and refreshments",
      "Transfers from Victoria Falls accommodation",
    ],
    governmentFees: "Included in the listed price",
    notes: ["Minimum 2 guests", "Minimum age 12", "Riders should be comfortable on a bicycle"],
  },

  "boma-dinner": {
    summary: "A traditional dinner with drums and dance around a fire in the bush.",
    startTime: "19:00",
    duration: "3 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls, Zimbabwe",
    body: [
      "The boma is the traditional way of eating together in Zimbabwe: a fire, a roasted spread of meats, sadza on the side, and the drummers who get the whole thing moving.",
      "Between courses there is traditional dance and storytelling. It is a long, generous evening rather than a formal meal.",
    ],
    includes: [
      "Welcome drink and traditional drumming on arrival",
      "Full dinner buffet with meats and vegetarian options",
      "Traditional performances throughout the evening",
    ],
    governmentFees: "$10.00 per person (national park levy)",
    priceNote: "$78 including transfers from Victoria Falls accommodation",
    notes: [
      "Minimum 2 guests",
      "Vegetarian options available",
      "Not suitable for children under 6",
    ],
  },

  "dusty-road-experience": {
    summary: "Off-road in a 4x4 to a small village on the edge of town, with dinner there.",
    startTime: "Afternoon",
    duration: "Half day",
    minPax: "Min pax: 4",
    location: "Victoria Falls outskirts",
    body: [
      "The Dusty Road is a short but genuine bush experience: a 4x4 out to a small rural community, time spent there rather than just passing through, and a traditional dinner to finish.",
      "The drive along the dusty road out of town is the part guests remember, and the community visit is what makes it worth doing.",
    ],
    includes: ["Return 4x4 transfer", "Guided community visit", "Traditional dinner", "Drinks"],
    governmentFees: "Included in the listed price",
    notes: ["Minimum 4 guests", "Transfers included", "Limited upper body mobility"],
  },

  "traditional-village-tour": {
    summary: "A guided visit to a working village, with stops for crafts and agriculture.",
    startTime: "Scheduled departures",
    duration: "2.5 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls area",
    body: [
      "Meet The People village tours take guests into the community rather than to a staged attraction. You walk through the village with a guide from the area.",
      "Stops typically include a school visit, craft demonstrations, and the small plots where most Zimbabwean village families grow their maize.",
    ],
    includes: [
      "Guided village walk",
      "School visit where classes permit",
      "Craft demonstrations",
      "National park levy",
    ],
    governmentFees: "Included in the listed price",
    priceNote: "Children $37",
    notes: [
      "Minimum 2 guests",
      "Minimum age 6",
      "School visits subject to the school calendar",
    ],
  },

  "simunye-theatre": {
    summary: "A dinner show telling the story of African myth and history, with live drums and dance.",
    startTime: "19:00",
    duration: "3 hours",
    minPax: "Min pax: 2",
    location: "Victoria Falls town",
    body: [
      "Simunye, The Spirit of Africa, is a theatrical production staged in the round at a venue just outside town. It runs through the creation myths, the colonial scramble and modern political history through song and dance.",
      "Dinner is served first, then the performance. It is the most substantial evening show in Victoria Falls and easily the most ambitious.",
    ],
    includes: [
      "Dinner served on arrival",
      "Live performance of Simunye, The Spirit of Africa",
      "Drumming and dance",
    ],
    governmentFees: "$12.00 per person (national park levy)",
    priceNote: "Children $29, or $69 including transfers",
    notes: ["Minimum 2 guests", "Dinner choice is set", "Non-alcoholic options throughout"],
  },
};
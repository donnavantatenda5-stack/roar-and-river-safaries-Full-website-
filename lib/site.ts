export const SITE = {
  name: "Roar and River Safaris",
  location: "Victoria Falls, Zimbabwe",
  // Digits only, with country code, e.g. 263781234567. Set in .env.local
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

export const LOCATION = {
  address: "649 Reynard Road, Victoria Falls, Zimbabwe",
  latitude: "-17.9268248",
  longitude: "25.8271366",
} as const;

export const GOOGLE_MAPS_DIRECTIONS_URL =
  `https://www.google.com/maps/dir/?api=1&destination=${LOCATION.latitude}%2C${LOCATION.longitude}`;

/** Shown in the nav contact panel and used by the booking assistant. */
export const CONTACT = {
  email: "donnavantatenda5@gmail.com",
  whatsapp: "263786043129",
  phones: [
    { display: "+263 773 473 009", tel: "+263773473009", wa: "263773473009" },
    { display: "+263 775 418 768", tel: "+263775418768", wa: "263775418768" },
  ],
} as const;


/** WhatsApp link if a number is configured, otherwise the on-site booking form. */
export function whatsappHref(message = "Hi! I'd like to book a tour with Roar and River Safaris."): string {
  const digits = SITE.whatsapp.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : "/book";
}

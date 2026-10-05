export const SITE = {
  name: "Roar and River Safaris",
  location: "Victoria Falls, Zimbabwe",
  // Digits only, with country code, e.g. 263781234567. Set in .env.local
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
};

/** WhatsApp link if a number is configured, otherwise the on-site booking form. */
export function whatsappHref(message = "Hi! I'd like to book a tour with Roar and River Safaris."): string {
  const digits = SITE.whatsapp.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : "/book";
}

import type { Tour } from "@/lib/types";
import { formatPrice } from "@/lib/types";
import { whatsappHref } from "@/lib/site";

/** Sticky sidebar on a tour detail page: price and the ways to book. */
export default function TourBookingCard({ tour, title }: { tour: Tour; title: string }) {
  const wa = whatsappHref(`Hi! I'd like to book the ${title} with Roar and River Safaris.`);

  return (
    <div className="rounded-[22px] bg-forest p-8 text-white shadow-[0_20px_50px_rgba(18,40,26,0.28)]">
      <p className="text-[12px] font-bold uppercase tracking-[0.28em] text-sand">Price</p>
      <p className="mt-3 flex items-baseline gap-2">
        <span className="font-serif text-[3.2rem] font-bold leading-none text-white">
          {formatPrice(tour.price_usd)}
        </span>
        {tour.price_usd !== null && (
          <span className="text-[17px] text-[#bed0bd]">per person</span>
        )}
      </p>

      <a
        href={`/book?tour=${tour.slug}`}
        className="mt-7 flex h-[58px] items-center justify-center rounded-full bg-white px-8 text-[17px] font-bold text-forest transition-colors hover:bg-ivory"
      >
        Book this tour
      </a>

      <a
        href={wa}
        target={wa.startsWith("http") ? "_blank" : undefined}
        rel={wa.startsWith("http") ? "noopener noreferrer" : undefined}
        className="mt-3 flex h-[54px] items-center justify-center rounded-full border-2 border-sand px-8 text-[16px] font-bold text-sand transition-colors hover:bg-sand/10"
      >
        Ask on WhatsApp
      </a>

      <p className="mt-7 border-t border-[#32483a] pt-6 text-[15px] leading-relaxed text-[#b2c4b4]">
        No payment is taken online. Send us the form or a WhatsApp message with your date and group
        size, and we&apos;ll confirm availability and the final price.
      </p>
    </div>
  );
}
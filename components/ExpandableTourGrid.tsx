"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Tilt3D from "@/components/ui/Tilt3D";
import { STAYS } from "@/lib/accommodations";
import { formatPrice, type Tour } from "@/lib/types";

type Props = {
  tours: Tour[];
  initial?: number;
};

const STAYS_BY_SLUG = new Map(STAYS.map((stay) => [stay.slug, stay]));

/**
 * A tour grid that shows a slice of the list and expands the rest on request.
 *
 * Kept as a client component so the expand state needs no round trip. The
 * server renders `initial` items, so the collapsed list is what search engines
 * and no-JS visitors see.
 */
export default function ExpandableTourGrid({ tours, initial = 6 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hidden = tours.length - initial;

  if (hidden <= 0) {
    return <Grid tours={tours} />;
  }

  return (
    <>
      <Grid tours={expanded ? tours : tours.slice(0, initial)} />

      <div className="mt-12 flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="inline-flex h-14 items-center gap-3 rounded-full border-2 border-forest bg-forest px-9 text-[17px] font-bold text-white transition-colors hover:bg-forest-soft hover:border-forest-soft"
        >
          {expanded ? (
            <>
              <Minus className="h-5 w-5" strokeWidth={2.6} />
              Show fewer
            </>
          ) : (
            <>
              See more ({hidden} more)
              <Plus className="h-5 w-5" strokeWidth={2.6} />
            </>
          )}
        </button>
      </div>
    </>
  );
}

function Grid({ tours }: { tours: Tour[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tours.map((t) => {
        const stay = STAYS_BY_SLUG.get(t.slug);
        const amenities = stay?.amenities?.slice(0, 4);
        const checkInOut = [
          stay?.checkIn && `Check-in ${stay.checkIn}`,
          stay?.checkOut && `Check-out ${stay.checkOut}`,
        ].filter(Boolean);

        return (
          <li key={t.slug} className="min-w-0">
            <Tilt3D className="min-w-0">
              <Link
                href={`/tours/${t.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_14px_36px_rgba(30,40,30,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(30,40,30,0.16)]"
              >
                <div className="relative aspect-408/218 overflow-hidden">
                  <Image
                    src={stay?.image ?? t.image_url ?? `/images/tours/${t.slug}.jpg`}
                    alt={t.name}
                    fill
                    sizes="(min-width:1024px) 380px, (min-width:768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-b from-forest/10 to-forest/35" />
                </div>
                <div className="flex flex-1 flex-col p-5 sm:p-7">
                  <h3 className="font-serif text-[1.5rem] font-bold leading-snug text-forest">
                    {t.name}
                  </h3>
                  {stay?.highlight && (
                    <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted">
                      {stay.highlight}
                    </p>
                  )}
                  {stay && (
                    <div className="mt-3 mb-3 space-y-1.5 text-[13px] leading-relaxed text-muted">
                      {checkInOut.length > 0 && <p>{checkInOut.join(" · ")}</p>}
                      {stay.priceDescription && (
                        <p className="line-clamp-3">{stay.priceDescription}</p>
                      )}
                      {(stay.stars || stay.rating !== undefined) && (
                        <p>
                          {stay.stars && `${stay.stars}-star`}
                          {stay.stars && stay.rating !== undefined && " · "}
                          {stay.rating !== undefined &&
                            `${stay.rating.toFixed(1)}/5${stay.reviews ? ` (${stay.reviews})` : ""}`}
                        </p>
                      )}
                      {amenities && amenities.length > 0 && (
                        <p className="line-clamp-2">{amenities.join(" · ")}</p>
                      )}
                      {stay.driveToFallsMinutes !== undefined && (
                        <p>{stay.driveToFallsMinutes} min drive to Victoria Falls</p>
                      )}
                    </div>
                  )}
                  <span className="mt-auto pt-6 font-serif text-[2rem] font-bold leading-none text-gold-dark">
                    {stay && stay.displayPriceUsd !== undefined
                      ? `$${stay.displayPriceUsd}`
                      : formatPrice(t.price_usd)}
                  </span>
                </div>
              </Link>
            </Tilt3D>
          </li>
        );
      })}
    </ul>
  );
}
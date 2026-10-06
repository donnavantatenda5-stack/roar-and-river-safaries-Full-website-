import Image from "next/image";
import Link from "next/link";
import { Check, Info } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/Reveal";
import TourFacts from "@/components/TourFacts";
import BookingForm from "@/components/BookingForm";
import { tourDetail, tourIntro } from "@/lib/tourDetails";
import { getAllTours, tourImage } from "@/lib/tours";
import { formatPrice } from "@/lib/types";

export const metadata = {
  title: "Book a Tour | Roar and River Safaris",
  description: "Book your Victoria Falls tour or safari with Roar and River Safaris.",
};

// Always fetch fresh tours so price changes in Supabase show up immediately.
export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  const { tour: tourSlug } = await searchParams;

  // getAllTours falls back to the built-in list when Supabase isn't reachable,
  // so the form and the tour summary still work before the DB is wired up.
  // Includes activities so any card on /tours can be booked from here.
  const tours = await getAllTours();
  const selected = tourSlug ? tours.find((t) => t.slug === tourSlug) : undefined;
  const defaultTourId = selected?.id;
  const detail = selected ? tourDetail(selected.slug) : undefined;
  const intro = selected ? tourIntro(selected, detail) : "";

  return (
    <main className="min-h-screen bg-ivory pb-20 pt-36">
      <Container>
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-[#B08D4F]">
          Simple booking
        </p>
        <h1 className="mt-3 text-center font-serif text-4xl font-bold text-[#12281A] sm:text-5xl">
          Book your adventure
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[#5c625f] sm:text-lg">
          Tell us your tour, date and group size and we&apos;ll get back to you.
        </p>

        {tours.length === 0 ? (
          <p className="mx-auto mt-10 max-w-3xl rounded-xl bg-white p-6 text-center text-[#5c625f]">
            Tours are unavailable right now. Please message us directly to book.
          </p>
        ) : (
          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:items-start lg:gap-12">
            {/* What's being booked - read this before you fill the form in. */}
            <div>
              {selected ? (
                <>
                  <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_14px_36px_rgba(30,40,30,0.08)]">
                    <div className="relative aspect-[408/200] overflow-hidden">
                      <Image
                        src={tourImage(selected)}
                        alt={selected.name}
                        fill
                        priority
                        sizes="(min-width:1024px) 640px, 100vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-forest/10 to-forest/60" />
                      <div className="absolute inset-x-0 bottom-0 p-7">
                        <p className="text-[12px] font-bold uppercase tracking-[0.26em] text-sand">
                          You&apos;re booking
                        </p>
                        <h2 className="mt-2 font-serif text-[1.9rem] font-bold leading-tight text-white sm:text-[2.2rem]">
                          {selected.name}
                        </h2>
                      </div>
                    </div>

                    <div className="px-7 pb-8 pt-7">
                      <div className="flex flex-wrap items-baseline gap-3 border-b border-line pb-6">
                        <span className="font-serif text-[2.6rem] font-bold leading-none text-gold-dark">
                          {formatPrice(selected.price_usd)}
                        </span>
                        {selected.price_usd !== null && (
                          <span className="text-[17px] text-muted">per person</span>
                        )}
                        <Link
                          href={`/tours/${selected.slug}`}
                          className="ml-auto text-[15px] font-bold text-forest underline-offset-4 hover:underline"
                        >
                          Full tour details
                        </Link>
                      </div>

                      {intro && (
                        <p className="mt-6 text-[17px] leading-[1.7] text-muted">{intro}</p>
                      )}

                      {detail && (
                        <>
                          <div className="mt-8">
                            <TourFacts
                              columns={2}
                              startTime={detail.startTime}
                              duration={detail.duration}
                              minPax={detail.minPax}
                              location={detail.location}
                            />
                          </div>

                          {detail.body.length > 0 && (
                            <div className="mt-8 space-y-5">
                              {detail.body.slice(0, 3).map((p, i) => (
                                <p key={i} className="text-[16px] leading-[1.75] text-muted">
                                  {p}
                                </p>
                              ))}
                            </div>
                          )}

                          {detail.priceNote && (
                            <p className="mt-4 text-[15px] leading-snug text-muted">{detail.priceNote}</p>
                          )}

                          {detail.governmentFees && (
                            <p className="mt-7 rounded-[14px] border-l-4 border-gold bg-cream px-5 py-4 text-[15px] leading-snug text-muted">
                              <span className="font-bold text-forest">Government fees</span>{" "}
                              {detail.governmentFees}, payable separately.
                            </p>
                          )}

                          {detail.includes && detail.includes.length > 0 && (
                            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                              {detail.includes.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[16px] text-muted">
                                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream">
                                    <Check className="h-3.5 w-3.5 text-gold" strokeWidth={3} />
                                  </span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          )}

                          {detail.important && (
                            <div className="mt-8 rounded-[16px] border-l-4 border-gold bg-cream px-6 py-5">
                              <p className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.24em] text-forest">
                                <Info className="h-4 w-4 text-gold" strokeWidth={2.4} />
                                Important
                              </p>
                              <p className="mt-3 text-[15px] leading-[1.7] text-muted">
                                {detail.important}
                              </p>
                            </div>
                          )}

                          {detail.body.length > 3 && (
                            <Link
                              href={`/tours/${selected.slug}`}
                              className="mt-7 inline-block text-[16px] font-bold text-forest underline-offset-4 hover:underline"
                            >
                              Read the full itinerary
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <p className="mt-4 text-center text-[15px] text-muted lg:text-left">
                    Booking a different tour? Change it in the form below.
                  </p>
                </>
              ) : (
                <div className="rounded-[22px] border border-line bg-white px-8 py-10 text-center shadow-[0_14px_36px_rgba(30,40,30,0.08)]">
                  <h2 className="font-serif text-[1.9rem] font-bold text-forest">Choose your tour</h2>
                  <p className="mx-auto mt-4 max-w-md text-[17px] leading-relaxed text-muted">
                    Pick a tour in the form below, or browse the full details for each one first.
                  </p>
                  <Link
                    href="/tours"
                    className="mt-7 inline-flex h-[54px] items-center justify-center rounded-full bg-forest px-8 text-[17px] font-bold text-white transition-colors hover:bg-forest-soft"
                  >
                    Browse all tours
                  </Link>
                </div>
              )}
            </div>

            <Reveal className="lg:sticky lg:top-32">
              <BookingForm tours={tours} defaultTourId={defaultTourId} />
            </Reveal>
          </div>
        )}
      </Container>
    </main>
  );
}
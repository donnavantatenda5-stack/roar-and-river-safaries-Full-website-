import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Flag, Info, MapPin } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import TourFacts from "@/components/TourFacts";
import TourBookingCard from "@/components/TourBookingCard";
import ButtonLink from "@/components/ui/ButtonLink";
import { getTour, getAllTours, tourImage, SHORT_NAMES } from "@/lib/tours";
import { tourDetail, tourIntro } from "@/lib/tourDetails";
import { formatPrice } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return { title: "Tour not found | Roar and River Safaris" };
  return {
    title: `${tour.name} | Roar and River Safaris`,
    description: tourIntro(tour, tourDetail(tour.slug)),
  };
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) notFound();

  const detail = tourDetail(tour.slug);
  const all = await getAllTours();
  const others = all.filter((t) => t.slug !== tour.slug).slice(0, 3);
  const name = SHORT_NAMES[tour.slug] ?? tour.name;

  return (
    <main className="pt-28">
      {/* Hero */}
      <section className="relative isolate flex min-h-[62svh] items-end overflow-hidden">
        <Image
          src={tourImage(tour)}
          alt={tour.name}
          fill
          priority
          quality={85}
          sizes="100vw"
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/55 via-forest/45 to-forest/90" />

        <Container className="pb-16">
          <Link
            href="/#tours"
            className="inline-flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.22em] text-white/85 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.4} /> All tours
          </Link>

          <p className="mt-8 text-[13px] font-bold uppercase tracking-[0.32em] text-sand">
            {detail?.location ?? "Victoria Falls, Zimbabwe"}
          </p>
          <h1 className="mt-3 max-w-[16ch] font-serif text-[clamp(2.25rem,5.4vw,4.5rem)] font-bold leading-[1.06] text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.45)]">
            {tour.name}
          </h1>
          {tourIntro(tour, detail) && (
            <p className="mt-6 max-w-[760px] text-[clamp(1rem,1.4vw,1.3rem)] leading-relaxed text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
              {tourIntro(tour, detail)}
            </p>
          )}
        </Container>
      </section>

      {/* At a glance */}
      {detail && (
        <section className="border-b border-line py-14">
          <Container>
            <Reveal>
              <TourFacts
                startTime={detail.startTime}
                duration={detail.duration}
                minPax={detail.minPax}
                location={detail.location}
              />
            </Reveal>
          </Container>
        </section>
      )}

      {/* Body */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
            <div>
              {detail ? (
                <>
                  <Reveal>
                    <h2 className="font-serif text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold leading-tight text-forest">
                      About this tour
                    </h2>
                  </Reveal>
                  <div className="mt-8 space-y-6">
                    {detail.body.map((p, i) => (
                      <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
                        <p className="text-[17px] leading-[1.75] text-muted sm:text-[18px]">{p}</p>
                      </Reveal>
                    ))}
                  </div>

                  {detail.includes && detail.includes.length > 0 && (
                    <Reveal className="mt-14">
                      <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-bold text-forest">
                        What&apos;s included
                      </h2>
                      <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                        {detail.includes.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-[17px] text-muted">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream">
                              <Check className="h-3.5 w-3.5 text-gold" strokeWidth={3} />
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  )}

                  {(detail.pickup || detail.endPoint) && (
                    <Reveal className="mt-14">
                      <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-bold text-forest">
                        Meeting and pickup
                      </h2>
                      <div className="mt-7 grid gap-4 sm:grid-cols-2">
                        {detail.pickup && (
                          <div className="rounded-[16px] border border-line bg-white px-6 py-5">
                            <p className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.22em] text-gold-dark">
                              <MapPin className="h-4 w-4" strokeWidth={2.4} />
                              Pickup details
                            </p>
                            <p className="mt-3 text-[16px] leading-[1.7] text-muted">{detail.pickup}</p>
                          </div>
                        )}
                        {detail.endPoint && (
                          <div className="rounded-[16px] border border-line bg-white px-6 py-5">
                            <p className="flex items-center gap-2.5 text-[12px] font-bold uppercase tracking-[0.22em] text-gold-dark">
                              <Flag className="h-4 w-4" strokeWidth={2.4} />
                              End point
                            </p>
                            <p className="mt-3 text-[16px] leading-[1.7] text-muted">{detail.endPoint}</p>
                          </div>
                        )}
                      </div>
                    </Reveal>
                  )}

                  {detail.notes && detail.notes.length > 0 && (
                    <Reveal className="mt-14">
                      <h2 className="font-serif text-[clamp(1.5rem,2.6vw,2rem)] font-bold text-forest">
                        Additional info
                      </h2>
                      <ul className="mt-7 space-y-3">
                        {detail.notes.map((n) => (
                          <li key={n} className="flex items-start gap-3 text-[16px] leading-relaxed text-muted sm:text-[17px]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" aria-hidden="true" />
                            {n}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  )}

                  {detail.important && (
                    <Reveal className="mt-14">
                      <div className="rounded-[18px] border-l-4 border-gold bg-cream px-7 py-6">
                        <p className="flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.24em] text-forest">
                          <Info className="h-[18px] w-[18px] text-gold" strokeWidth={2.4} />
                          Important
                        </p>
                        <p className="mt-4 text-[16px] leading-[1.7] text-muted sm:text-[17px]">
                          {detail.important}
                        </p>
                      </div>
                    </Reveal>
                  )}
                </>
              ) : (
                <Reveal>
                  <div className="rounded-[18px] border border-line bg-white p-9">
                    <h2 className="font-serif text-[1.9rem] font-bold text-forest">About this tour</h2>
                    <p className="mt-5 text-[17px] leading-[1.75] text-muted">
                      Full details for this tour are on the way. Message us and we&apos;ll send you the
                      itinerary, timings and what&apos;s included, or book straight away and we&apos;ll
                      confirm the details with you.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <ButtonLink href={`/book?tour=${tour.slug}`}>Book this tour</ButtonLink>
                      <ButtonLink href="/#contact" variant="outline" className="!border-forest !text-forest hover:!bg-forest/5">
                        Contact us
                      </ButtonLink>
                    </div>
                  </div>
                </Reveal>
              )}
            </div>

            <div className="lg:sticky lg:top-32 lg:self-start">
              <TourBookingCard
              tour={tour}
              title={name}
              governmentFees={detail?.governmentFees}
              priceNote={detail?.priceNote}
            />
            </div>
          </div>
        </Container>
      </section>

      {/* Other tours */}
      {others.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading eyebrow="Keep exploring" title="Other tours" underline />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {others.map((t, i) => (
                <Reveal key={t.slug} delay={i * 0.08}>
                  <Link
                    href={`/tours/${t.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_14px_36px_rgba(30,40,30,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(30,40,30,0.17)]"
                  >
                    <div className="relative aspect-[408/218] overflow-hidden">
                      <Image
                        src={tourImage(t)}
                        alt={t.name}
                        fill
                        sizes="(min-width:768px) 33vw, 100vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-forest/10 to-forest/35" />
                    </div>
                    <div className="flex flex-1 flex-col px-7 pb-6 pt-6">
                      <h3 className="font-serif text-[1.45rem] font-bold leading-snug text-forest">
                        {t.name}
                      </h3>
                      <p className="mt-auto pt-5 font-serif text-[1.8rem] font-bold leading-none text-gold-dark">
                        {formatPrice(t.price_usd)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>

<Reveal className="mt-14 flex justify-center">
            <ButtonLink href="/#tours" variant="outline" className="!border-forest !text-forest hover:!bg-forest/5">
              See all {all.length} tours and activities
            </ButtonLink>
          </Reveal>
          </Container>
        </section>
      )}
    </main>
  );
}
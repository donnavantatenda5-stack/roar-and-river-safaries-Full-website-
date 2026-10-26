import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Tilt3D from "@/components/ui/Tilt3D";
import { ACCOMMODATION_GROUPS } from "@/lib/accommodations";

export default function AccommodationSection() {
  return (
    <section className="mt-24" aria-label="Accommodation">
      <Container>
        <SectionHeading
          eyebrow="Where to stay"
          title="Accommodation"
          subtitle="A selection of hotels and safari lodges in and around Victoria Falls, across a range of budgets."
        />

        <p className="mx-auto mt-5 max-w-3xl text-center text-sm leading-relaxed text-muted">
          Indicative rates and review details are provided as a guide and can change
          with season, availability, occupancy and room type. Confirm current prices
          and inclusions directly with each property before booking.
        </p>

        <div className="mt-12 space-y-14">
          {ACCOMMODATION_GROUPS.map((group) => (
            <section key={group.title} aria-label={group.title}>
              <h3 className="mb-6 font-serif text-2xl font-bold text-forest sm:text-3xl">
                {group.title}
              </h3>
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {group.stays.map((stay) => (
                  <li key={stay.slug} className="h-full">
                    <Tilt3D>
                      <Link
                        href={`/tours/${stay.slug}`}
                        aria-label={`View ${stay.name} details and enquire`}
                        className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_14px_36px_rgba(30,40,30,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(30,40,30,0.16)]"
                      >
                        <div className="relative aspect-[408/218] overflow-hidden">
                          <Image
                            src={stay.image ?? "/images/places/victoria-falls.jpg"}
                            alt={stay.name}
                            fill
                            sizes="(min-width:1024px) 380px, (min-width:768px) 50vw, 100vw"
                            className="object-cover transition duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-forest/10 to-forest/35" />
                        </div>
                        <div className="flex flex-1 flex-col p-7">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h4 className="font-serif text-[1.5rem] font-bold leading-snug text-forest">
                              {stay.name}
                            </h4>
                            {stay.rating && (
                              <span className="shrink-0 rounded-full bg-cream px-3 py-1 text-xs font-semibold text-gold-dark">
                                ★ {stay.rating}
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm font-medium text-muted">{stay.type}</p>
                          <p className="mt-3 text-sm leading-relaxed text-muted">{stay.description}</p>
                          <span className="mt-auto pt-6 font-serif text-xl font-bold leading-snug text-gold-dark">
                            {stay.priceLabel}
                          </span>
                          <span className="mt-4 text-sm font-bold text-forest underline decoration-gold underline-offset-4">
                            View details &amp; enquire
                          </span>
                        </div>
                      </Link>
                    </Tilt3D>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </Container>
    </section>
  );
}

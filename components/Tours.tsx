import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import Tilt3D from "@/components/ui/Tilt3D";
import { tourImage } from "@/lib/tours";
import { tourDetail, tourIntro } from "@/lib/tourDetails";
import { formatPrice, type Tour } from "@/lib/types";

export default function Tours({ tours }: { tours: Tour[] }) {
  return (
    <section id="tours" className="py-20 sm:py-[82px]">
      <Container>
        <SectionHeading eyebrow="Tours & experiences" title="Our Tours" underline />

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((t, i) => (
            <Reveal key={t.slug} delay={(i % 3) * 0.08}>
              <Tilt3D>
                <article className="group flex h-full flex-col overflow-hidden rounded-[18px] border border-line bg-white shadow-[0_14px_36px_rgba(30,40,30,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(30,40,30,0.17)]">
                  <div className="relative aspect-[408/218] overflow-hidden">
                    <Image
                      src={tourImage(t)}
                      alt={t.name}
                      fill
                      sizes="(min-width:1024px) 408px, (min-width:768px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-forest/10 to-forest/35" />
                    <Link href={`/tours/${t.slug}`} className="absolute inset-0" aria-label={`Read more about ${t.name}`} />
                  </div>

                  <div className="flex flex-1 flex-col px-7 pb-6 pt-7">
                    <h3 className="min-h-[4.5rem] font-serif text-[1.65rem] font-bold leading-[1.25] text-forest sm:text-[1.8rem]">
                      {/* Whole image + title is the link to the detail page. */}
                      <Link href={`/tours/${t.slug}`} className="transition-colors hover:text-forest-soft">
                        {t.name}
                      </Link>
                    </h3>

                    {tourIntro(t, tourDetail(t.slug)) && (
                      <p className="mt-3 line-clamp-3 text-[16px] leading-relaxed text-muted">
                        {tourIntro(t, tourDetail(t.slug))}
                      </p>
                    )}

                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
                      {t.price_usd === null ? (
                        <span className="text-[1.35rem] font-bold text-gold-dark">{formatPrice(t.price_usd)}</span>
                      ) : (
                        <span className="font-serif text-[2.6rem] font-bold leading-none text-gold-dark">
                          {formatPrice(t.price_usd)}
                        </span>
                      )}
                      <span className="flex items-center gap-5">
                        <Link
                          href={`/tours/${t.slug}`}
                          className="text-[15px] font-bold text-muted underline-offset-4 transition-colors hover:text-forest hover:underline"
                        >
                          Details
                        </Link>
                        <Link
                          href={`/book?tour=${t.slug}`}
                          className="inline-flex h-12 items-center gap-2.5 rounded-full bg-forest px-7 text-[17px] font-bold text-white transition-colors hover:bg-forest-soft"
                        >
                          Book
                        </Link>
                      </span>
                    </div>
                  </div>
                </article>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

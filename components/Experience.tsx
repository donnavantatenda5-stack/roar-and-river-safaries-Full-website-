import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import { formatPrice, type Tour } from "@/lib/types";

const experiences = [
  { title: "The mighty roar of Mosi-oa-Tunya", slug: "victoria-falls-guided-tour" },
  { title: "Sunset cruises on the Zambezi River", slug: "zambezi-sunset-cruise" },
  { title: "Thrilling safaris where lions roar", slug: "zambezi-national-park-game-drive" },
];

export default function Experience({ tours }: { tours: Tour[] }) {
  return (
    <section className="bg-forest py-20 sm:py-[80px]">
      <Container>
        <SectionHeading
          light
          eyebrow="What you'll experience"
          title="Experience the true spirit of Victoria Falls"
        />

        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-[60px]">
          {experiences.map((e, i) => {
            const tour = tours.find((t) => t.slug === e.slug);
            return (
              <Reveal key={e.slug} delay={i * 0.1}>
                <div className="flex items-center gap-5">
                  <span className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border border-gold font-serif text-[28px] font-bold text-sand">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="hidden h-px flex-1 bg-[#3c5442] md:block" aria-hidden="true" />
                </div>
                <h3 className="mt-8 font-serif text-[1.9rem] font-bold leading-[1.3] text-white sm:text-[2.1rem]">
                  {e.title}
                </h3>
                {tour && (
                  <p className="mt-7 text-[19px] text-[#bed0bd]">
                    {tour.name} &nbsp;-&nbsp; {formatPrice(tour.price_usd)}
                  </p>
                )}
                <Link
                  href={`/book?tour=${e.slug}`}
                  className="mt-5 inline-flex items-center gap-2.5 text-[18px] font-bold text-sand transition-colors hover:text-white"
                >
                  Book this tour <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

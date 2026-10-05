import Image from "next/image";
import Reveal from "@/components/Reveal";
import ButtonLink from "@/components/ui/ButtonLink";

export default function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden py-24 text-center sm:py-[110px]">
      <Image
        src="/images/hero.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 object-cover object-[50%_45%]"
      />
      <div className="absolute inset-0 -z-10 bg-forest/60" />
      <Reveal className="mx-auto max-w-6xl px-6">
        <h2 className="font-serif text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.1] text-white [text-shadow:0_3px_20px_rgba(0,0,0,0.4)]">
          Book your Victoria Falls adventure
        </h2>
        <p className="mt-5 text-lg text-[#ecefe6] sm:text-2xl">Local guides, fair prices, unforgettable memories.</p>
        <div className="mt-9 flex justify-center">
          <ButtonLink href="/book" variant="light">
            Book a Safari
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}

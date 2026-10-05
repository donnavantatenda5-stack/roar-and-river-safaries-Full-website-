import Image from "next/image";
import { ArrowDown } from "lucide-react";
import Reveal from "@/components/Reveal";
import ButtonLink from "@/components/ui/ButtonLink";

export default function Hero() {
  return (
    <section id="home" className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden">
      <Image
        src="/images/hero.jpg"
        alt="Aerial view of Victoria Falls with a rainbow over the Zambezi River"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="-z-20 object-cover object-[50%_30%]"
      />
      {/* Dark green scrim so the white text stays readable */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/30 via-forest/55 to-forest/60" />

      <div className="mx-auto flex max-w-[1160px] flex-col items-center px-6 pb-28 pt-36 text-center">
        <Reveal>
          <span className="inline-block rounded-full bg-white/85 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.32em] text-forest sm:text-sm">
            Victoria Falls, Zimbabwe
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <h1 className="mt-7 font-serif text-[clamp(2.5rem,6vw,5.25rem)] font-bold leading-[1.05] text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.45)]">
            Roar and River Safaris
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-7 max-w-[900px] text-[clamp(1rem,1.55vw,1.375rem)] leading-[1.65] text-white/95 [text-shadow:0_2px_12px_rgba(0,0,0,0.5)]">
            Experience the true spirit of Victoria Falls with Roar and River Safaris. We are a local tour company
            based in the heart of Victoria Falls, Zimbabwe, offering unforgettable adventures - from the mighty roar
            of Mosi-oa-Tunya, to sunset cruises on the Zambezi River, to thrilling safaris where lions roar. Local
            guides, fair prices, unforgettable memories.
          </p>
        </Reveal>

        <Reveal delay={0.3} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <ButtonLink href="/book" variant="light">
            Book a Safari
          </ButtonLink>
          <ButtonLink href="/#tours" variant="outline" arrow={false}>
            View Tours
          </ButtonLink>
        </Reveal>
      </div>

      <a
        href="#destinations"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-[#0c1812]/50 px-5 py-2 text-[13px] font-bold uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm transition hover:bg-[#0c1812]/70 sm:flex"
      >
        Scroll <ArrowDown className="h-4 w-4" />
      </a>
    </section>
  );
}

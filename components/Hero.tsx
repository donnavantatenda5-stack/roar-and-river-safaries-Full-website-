import Image from "next/image";
import Reveal from "@/components/Reveal";
import ButtonLink from "@/components/ui/ButtonLink";
import HeroVideoBackground from "@/components/HeroVideoBackground";

export default function Hero() {
  return (
    <section id="home" className="relative isolate flex h-[100svh] min-h-[640px] items-center justify-center overflow-hidden">
      {/* Poster behind the video, and the fallback if the player can't load. */}
      <Image
        src="/images/hero.jpg"
        alt="Aerial view of Victoria Falls with a rainbow over the Zambezi River"
        fill
        priority
        quality={85}
        sizes="100vw"
        className="-z-30 object-cover object-[50%_30%]"
      />
      <HeroVideoBackground />
      {/* Dark green scrim so the white text stays readable over moving footage */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forest/40 via-forest/60 to-forest/65" />

      <div className="mx-auto flex max-w-[1160px] flex-col items-center px-6 pb-24 pt-44 text-center sm:pb-20 sm:pt-64">
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
          <ButtonLink href="/#tours" variant="outline">
            View Tours
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

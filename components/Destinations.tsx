import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";
import Tilt3D from "@/components/ui/Tilt3D";

const places = [
  {
    name: "Victoria Falls",
    country: "Zimbabwe",
    tours: "Guided Tour / Devil's & Angel's Pool / Bungee & Gorge Swing",
    image: "/images/places/victoria-falls.jpg",
  },
  { name: "Zambezi River", country: "Zimbabwe", tours: "Sunset Cruise", image: "/images/places/zambezi-river.jpg" },
  {
    name: "Zambezi National Park",
    country: "Zimbabwe",
    tours: "Game Drive",
    image: "/images/places/zambezi-national-park.jpg",
  },
  { name: "Chobe", country: "Botswana", tours: "Day Trip", image: "/images/places/chobe.jpg" },
];

export default function Destinations() {
  return (
    <section id="destinations" className="py-20 sm:py-[78px]">
      <Container>
        <SectionHeading
          eyebrow="Where we operate"
          title="Based in the heart of Victoria Falls"
          subtitle="Adventures across the falls, the Zambezi River and into Botswana."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {places.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <Tilt3D>
                <article className="group relative h-[372px] overflow-hidden rounded-[18px] shadow-[0_16px_40px_rgba(30,40,30,0.18)]">
                  <Image
                    src={p.image}
                    alt={`${p.name}, ${p.country}`}
                    fill
                    sizes="(min-width:1024px) 300px, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-forest/10 via-transparent to-forest/85" />
                  <div className="absolute inset-x-0 bottom-0 p-[26px]">
                    <p className="text-[13px] font-bold uppercase tracking-[0.27em] text-sand">{p.country}</p>
                    <h3 className="mt-1.5 font-serif text-[1.7rem] font-bold leading-tight text-white">{p.name}</h3>
                    <p className="mt-2 text-base leading-snug text-white/85">{p.tours}</p>
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

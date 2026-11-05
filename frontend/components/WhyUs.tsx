import { CircleDollarSign, MapPin, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/Reveal";

const reasons = [
  { title: "Local guides", text: "Based in the heart of Victoria Falls, Zimbabwe.", Icon: MapPin },
  { title: "Fair prices", text: "Honest prices, listed up front.", Icon: CircleDollarSign },
  { title: "Unforgettable memories", text: "From the roar of the falls to lions roaring on safari.", Icon: Star },
];

export default function WhyUs() {
  return (
    <section id="about" className="py-20 sm:py-[100px]">
      <Container>
        <SectionHeading title="Why Roar and River Safaris" underline />
        <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-[60px]">
          {reasons.map(({ title, text, Icon }, i) => (
            <Reveal key={title} delay={i * 0.1} className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-cream">
                <Icon className="h-10 w-10 text-gold" strokeWidth={Icon === Star ? 0 : 2} fill={Icon === Star ? "currentColor" : "none"} />
              </div>
              <h3 className="mt-8 font-serif text-[1.6rem] font-bold text-forest lg:text-[1.8rem]">{title}</h3>
              <p className="mx-auto mt-3 max-w-[300px] text-[19px] leading-snug text-muted sm:text-[20px]">{text}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

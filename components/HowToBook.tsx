import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";
import Reveal from "@/components/Reveal";
import { whatsappHref } from "@/lib/site";

const steps = [
  { title: "Choose your tour", text: "Pick from our six tours." },
  { title: "Send us a message", text: "Tell us your date and group size." },
  { title: "Enjoy the adventure", text: "Meet your local guide and go." },
];

export default function HowToBook() {
  const href = whatsappHref();
  return (
    <section id="how-to-book" className="py-20 sm:py-[84px]">
      <Container>
        <SectionHeading eyebrow="Simple booking" title="How to book" underline />

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-[60px]">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="text-center">
              <h3 className="font-serif text-[1.75rem] font-bold text-forest sm:text-[1.95rem]">{s.title}</h3>
              <p className="mt-3 text-[19px] text-muted sm:text-[20px]">{s.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 flex justify-center">
          <ButtonLink href={href} external={href.startsWith("http")}>
            Book on WhatsApp
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}

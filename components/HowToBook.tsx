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
    <section id="how-to-book" className="bg-white/[0.92] py-20 sm:py-[84px]">
      <Container>
        <SectionHeading eyebrow="Simple booking" title="How to book" underline />

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-[60px]">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.1} className="relative text-center">
              {i < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[calc(50%+56px)] top-[42px] hidden h-px w-[calc(100%+60px-112px)] bg-[#decfae] md:block"
                />
              )}
              <span className="relative mx-auto flex h-[84px] w-[84px] items-center justify-center rounded-full bg-forest font-serif text-[38px] font-bold text-white">
                {i + 1}
              </span>
              <h3 className="mt-7 font-serif text-[1.75rem] font-bold text-forest sm:text-[1.95rem]">{s.title}</h3>
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

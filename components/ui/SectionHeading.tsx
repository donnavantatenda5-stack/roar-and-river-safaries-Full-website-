import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  light = false,
  underline = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
  underline?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={cn("text-center", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-4 text-[13px] font-bold uppercase tracking-[0.32em] sm:text-[15px]",
            light ? "text-sand" : "text-gold"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-serif text-[clamp(2rem,4.4vw,3.5rem)] font-bold leading-[1.1]",
          light ? "text-white" : "text-forest"
        )}
      >
        {title}
      </h2>
      {underline && <div className="mx-auto mt-5 h-[3px] w-[60px] bg-gold" />}
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted sm:text-[22px]">{subtitle}</p>
      )}
    </Reveal>
  );
}

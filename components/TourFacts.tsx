import { Clock, MapPin, Users } from "lucide-react";

/** The "at a glance" facts shown on a tour detail page. */
export default function TourFacts({
  startTime,
  duration,
  minPax,
  location,
}: {
  startTime?: string;
  duration?: string;
  minPax?: string;
  location?: string;
}) {
  const facts = [
    { label: "Starts", value: startTime, Icon: Clock },
    { label: "Duration", value: duration, Icon: Clock },
    { label: "Group size", value: minPax, Icon: Users },
    { label: "Meeting point", value: location, Icon: MapPin },
  ].filter((f) => Boolean(f.value));

  if (facts.length === 0) return null;

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map(({ label, value, Icon }) => (
        <div
          key={label}
          className="flex items-start gap-4 rounded-[18px] border border-line bg-white px-6 py-5"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream">
            <Icon className="h-5 w-5 text-gold" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <dt className="text-[12px] font-bold uppercase tracking-[0.2em] text-muted">{label}</dt>
            <dd className="mt-1 font-serif text-[1.15rem] font-bold leading-snug text-forest">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
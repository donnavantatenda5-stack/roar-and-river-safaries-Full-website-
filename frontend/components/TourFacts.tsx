import { CalendarClock, Hourglass, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

/** The "at a glance" facts (starts, duration, group size, meeting point). */
export default function TourFacts({
  startTime,
  duration,
  minPax,
  location,
  columns = 4,
}: {
  startTime?: string;
  duration?: string;
  minPax?: string;
  location?: string;
  /** 4 for the wide tour page, 2 for narrow columns like the booking sidebar. */
  columns?: 2 | 4;
}) {
  const facts = [
    { label: "Starts", value: startTime, Icon: CalendarClock },
    { label: "Duration", value: duration, Icon: Hourglass },
    { label: "Group size", value: minPax, Icon: Users },
    { label: "Meeting point", value: location, Icon: MapPin },
  ].filter((f) => Boolean(f.value));

  if (facts.length === 0) return null;

  return (
    <dl
      className={cn(
        "grid gap-4",
        columns === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2"
      )}
    >
      {facts.map(({ label, value, Icon }) => (
        <div
          key={label}
          className="flex h-full items-start gap-3.5 rounded-[18px] border border-line bg-white px-5 py-5 sm:gap-4 sm:px-6"
        >
          <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream">
            <Icon className="h-5 w-5 text-gold" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <dt className="text-[11px] font-bold uppercase leading-tight tracking-[0.18em] text-muted">
              {label}
            </dt>
            <dd className="mt-1.5 break-words font-serif text-[1.1rem] font-bold leading-snug text-forest">
              {value}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

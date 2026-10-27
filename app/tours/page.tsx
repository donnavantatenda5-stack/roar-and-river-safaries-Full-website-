import Container from "@/components/ui/Container";
import ButtonLink from "@/components/ui/ButtonLink";
import ExpandableTourGrid from "@/components/ExpandableTourGrid";
import Footer from "@/components/Footer";
import { getActivities, getTours } from "@/lib/tours";
import { ACTIVITY_CATEGORIES } from "@/lib/activities";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tours & Activities | Roar and River Safaris",
  description:
    "All of our Victoria Falls tours and activities: guided Falls tours, Zambezi cruises, Chobe day trips, game drives, gorge activities, canoeing, helicopter flights and cultural evenings.",
};

const TOUR_VISIBLE = 6;
const ACTIVITY_VISIBLE = 3;

export default async function ToursIndexPage() {
  const tours = await getTours();
  const activities = await getActivities();

  // Group activities, dropping any category that ends up empty.
  const groups = ACTIVITY_CATEGORIES.map((c) => ({
    ...c,
    items: activities.filter((a) => a.category === c.id),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      <main className="min-h-screen pb-24 pt-40">
      <Container>
        <div className="text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.32em] text-gold">Tours &amp; experiences</p>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] text-forest">
            All tours
          </h1>
          <div className="mx-auto mt-5 h-[3px] w-[60px] bg-gold" />
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-muted sm:text-[20px]">
            Ways to see the Falls and the Zambezi, run by local guides from Victoria Falls, Zimbabwe.
            Open any tour for times, what&apos;s included and the full itinerary.
          </p>
        </div>

        {/* Signature tours */}
        <section className="mt-16">
          <ExpandableTourGrid tours={tours} initial={TOUR_VISIBLE} />
        </section>

        {/* Everything else, grouped by category */}
        {groups.map((group) => (
          <section key={group.id} className="mt-24">
            <div className="text-center">
              <p className="text-[13px] font-bold uppercase tracking-[0.32em] text-gold">
                Activities
              </p>
              <h2 className="mt-4 font-serif text-[clamp(1.9rem,4vw,2.75rem)] font-bold leading-[1.1] text-forest">
                {group.label}
              </h2>
              <div className="mx-auto mt-5 h-[3px] w-[60px] bg-gold" />
              <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-muted">
                {group.items.length} {group.items.length === 1 ? "activity" : "activities"} in this
                group. Park and conservation levies are shown on each page.
              </p>
            </div>

            <ExpandableTourGrid tours={group.items} initial={ACTIVITY_VISIBLE} />
          </section>
        ))}

        <div className="mt-24 flex justify-center">
          <ButtonLink href="/book">Start a booking</ButtonLink>
        </div>
      </Container>
      </main>
      <Footer tours={tours} />
    </>
  );
}
import Link from "next/link";
import Container from "@/components/ui/Container";
import ButtonLink from "@/components/ui/ButtonLink";
import { getTours } from "@/lib/tours";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tours | Roar and River Safaris",
  description:
    "All of our Victoria Falls tours: guided Falls tours, Zambezi sunset cruises, Chobe day trips, game drives and gorge activities.",
};

export default async function ToursIndexPage() {
  const tours = await getTours();

  return (
    <main className="min-h-screen bg-ivory pb-24 pt-40">
      <Container>
        <div className="text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.32em] text-gold">Tours &amp; experiences</p>
          <h1 className="mt-4 font-serif text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] text-forest">
            All tours
          </h1>
          <div className="mx-auto mt-5 h-[3px] w-[60px] bg-gold" />
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-muted sm:text-[20px]">
            Six ways to see the Falls and the Zambezi, run by local guides from Victoria Falls,
            Zimbabwe. Open any tour for times, what&apos;s included and the full itinerary.
          </p>
        </div>

        <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tours/${t.slug}`}
                className="flex h-full flex-col rounded-[18px] border border-line bg-white p-7 shadow-[0_14px_36px_rgba(30,40,30,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(30,40,30,0.16)]"
              >
                <h2 className="font-serif text-[1.6rem] font-bold leading-snug text-forest">{t.name}</h2>
                <span className="mt-auto pt-6 font-serif text-[2rem] font-bold leading-none text-gold-dark">
                  {t.price_usd === null ? "Book with us" : `$${Number(t.price_usd)}`}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-16 flex justify-center">
          <ButtonLink href="/book">Start a booking</ButtonLink>
        </div>
      </Container>
    </main>
  );
}
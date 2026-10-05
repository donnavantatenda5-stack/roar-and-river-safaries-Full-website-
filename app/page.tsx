import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import Destinations from "@/components/Destinations";
import Tours from "@/components/Tours";
import Experience from "@/components/Experience";
import WhyUs from "@/components/WhyUs";
import HowToBook from "@/components/HowToBook";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import { getTours } from "@/lib/tours";

// Re-fetch tours from Supabase at most once a minute, so price edits show up quickly.
export const revalidate = 60;

export default async function Home() {
  const tours = await getTours();

  return (
    <>
      <main>
        <Hero />
        <TrustStrip />
        <Destinations />
        <Tours tours={tours} />
        <Experience tours={tours} />
        <WhyUs />
        <HowToBook />
        <CtaBand />
      </main>
      <Footer tours={tours} />
    </>
  );
}

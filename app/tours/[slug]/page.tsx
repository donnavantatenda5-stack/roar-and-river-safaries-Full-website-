import TourPage, { generateTourMetadata } from "@/frontend/pages/TourPage";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return generateTourMetadata({ params });
}

export default TourPage;

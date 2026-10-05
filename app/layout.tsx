import type { Metadata } from "next";
import { Lato, Lora } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

/*
 * Fonts. Lato + Lora match the design mockup most closely.
 * To use the brand fonts instead, swap the two imports/blocks below for:
 *   import { Jost, Cormorant_Garamond } from "next/font/google";
 *   const body    = Jost({ subsets: ["latin"], variable: "--font-body", display: "swap" });
 *   const heading = Cormorant_Garamond({ subsets: ["latin"], weight: ["500","600","700"], variable: "--font-heading", display: "swap" });
 * (Cormorant is lighter and smaller - bump heading sizes up a little.)
 */
const body = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-body",
  display: "swap",
});
const heading = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roar and River Safaris - #1 Authentic Victoria Falls Tours & Safaris",
  description:
    "Local tour company in the heart of Victoria Falls, Zimbabwe. Falls tours, Zambezi sunset cruises, Chobe day trips, game drives and more. Local guides, fair prices, unforgettable memories.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable}`}>
      <body className="font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}

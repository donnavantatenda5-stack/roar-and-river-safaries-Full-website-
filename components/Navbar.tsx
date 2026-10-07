"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/#destinations" },
];

const CONTACT_EMAIL = "donnavantatenda5@gmail.com";
const CONTACT_NUMBERS = [
  { display: "+263 773 473 009", tel: "+263773473009", wa: "263773473009" },
  { display: "+263 775418768", tel: "+263775418768", wa: "263775418768" },
];
const waMain = "263786043129";

const itemBtn =
  "border-0 text-[#5c625f] transition-colors hover:text-forest";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  // Docked = the bar is pinned flush to the top instead of floating over the hero.
  const [docked, setDocked] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [hug, setHug] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Clicking anywhere outside the bar, or pressing Escape, closes the contact panel.
  useEffect(() => {
    if (!contactOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setContactOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContactOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [contactOpen]);

  // Measure the pill's natural content width while floating, so docking can
  // animate from that exact pixel width to full width (and back). Measured with
  // `max-content` + flex-shrink off so a shrinking flex parent can't clamp it.
  useEffect(() => {
    const el = shellRef.current;
    if (!el || docked) return;
    const measure = () => {
      const prevWidth = el.style.width;
      const prevShrink = el.style.flexShrink;
      el.style.width = "max-content";
      el.style.flexShrink = "0";
      const w = el.offsetWidth;
      el.style.width = prevWidth;
      el.style.flexShrink = prevShrink;
      setHug((cur) => (cur === w ? cur : w));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [docked]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 z-50 flex justify-center motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
        docked ? "top-0 px-0" : "top-4 px-4 md:top-7"
      )}
    >
      {/*
        max-w stays constant in both states: flipping max-width between
        fit-content and none can't interpolate, which clamps the width instantly
        on the way back up and kills the animation. fit-content is only used
        before the first measurement, so the pill doesn't flash full width.
      */}
      <div
        ref={shellRef}
        className={cn(
          "relative w-full max-w-full motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
          hug === null && !docked && "max-w-fit"
        )}
        style={{ width: docked ? "100%" : hug === null ? undefined : `${hug}px` }}
      >
        <nav
          aria-label="Main"
          className={cn(
            "flex items-center justify-between gap-4 paper-surface py-2.5 pl-6 pr-3 md:gap-0 md:pl-10 md:pr-3.5 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
            docked
              ? "rounded-none shadow-[0_8px_28px_rgba(12,24,18,0.12)]"
              : "rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
          )}
        >
          <Link href="/" aria-label="Roar and River Safaris - home" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Roar and River Safaris logo"
              width={703}
              height={606}
              priority
              className="h-[48px] w-auto md:h-[54px]"
            />
          </Link>

          <span className="mx-11 hidden h-11 w-px bg-[#ded2b8] md:block" aria-hidden="true" />

          <ul className="hidden items-center gap-8 text-[17px] md:flex lg:gap-[42px]">
            {links.map((l, i) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className={
                    i === 0
                      ? "border-0 font-bold text-forest"
                      : "border-0 text-[#5c625f] transition-colors hover:text-forest"
                  }
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => setContactOpen((v) => !v)}
                aria-expanded={contactOpen}
                className={cn(itemBtn, "flex items-center gap-1")}
              >
                Contact
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", contactOpen && "rotate-180")}
                />
              </button>
            </li>
          </ul>

          <div className={cn("flex shrink-0 items-center gap-2", docked ? "ml-auto" : "md:ml-[46px]")}>
            <Link
              href="/book"
              className={cn(
                "shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-forest px-6 py-3 text-[16px] font-bold text-white transition-colors hover:bg-forest-soft md:inline-flex md:px-8 md:text-[17px]",
                docked ? "inline-flex" : "hidden"
              )}
            >
              Book Now
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-forest md:hidden"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {open && (
          <div
            className={cn(
              "absolute inset-x-0 top-full paper-surface p-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] md:hidden",
              docked ? "rounded-b-3xl" : "mt-3 rounded-3xl"
            )}
          >
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-lg font-bold text-forest hover:bg-ivory"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setContactOpen(true);
                  }}
                  className="block w-full rounded-xl px-4 py-3 text-left text-lg font-bold text-forest hover:bg-ivory"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        )}

        {contactOpen && (
          <div
            className={cn(
              "absolute right-0 top-full w-[min(92vw,340px)] paper-surface p-5 shadow-[0_16px_40px_rgba(0,0,0,0.22)]",
              docked ? "rounded-b-3xl rounded-t-2xl" : "mt-3 rounded-3xl"
            )}
          >
            <p className="text-[13px] font-bold uppercase tracking-[0.26em] text-gold">Contact us</p>

            <div className="mt-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8a8577]">Email</p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                onClick={() => setContactOpen(false)}
                className="mt-1 block break-all text-[17px] font-bold text-forest hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            {CONTACT_NUMBERS.map((n) => (
              <div key={n.tel} className="mt-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#8a8577]">Phone</p>
                <a
                  href={`tel:${n.tel}`}
                  onClick={() => setContactOpen(false)}
                  className="mt-1 block text-[17px] font-bold text-forest hover:underline"
                >
                  {n.display}
                </a>
                <div className="mt-2 flex gap-2.5">
                  <a
                    href={`tel:${n.tel}`}
                    onClick={() => setContactOpen(false)}
                    className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-bold text-forest hover:border-gold"
                  >
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${n.wa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setContactOpen(false)}
                    className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-bold text-forest hover:border-gold"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}

            <div className="mt-4 border-t border-line pt-4">
              <a
                href={`https://wa.me/${waMain}?text=${encodeURIComponent("Hi! I'd like to book a tour with Roar and River Safaris.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setContactOpen(false)}
                className="inline-flex items-center justify-center rounded-full bg-forest px-5 py-2.5 text-sm font-bold text-white hover:bg-forest-soft"
              >
                Book on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

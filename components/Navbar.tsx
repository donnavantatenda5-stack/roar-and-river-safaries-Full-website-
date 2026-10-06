"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/#destinations" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  // Docked = the bar is pinned flush to the top instead of floating over the hero.
  const [docked, setDocked] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const [hug, setHug] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            "flex items-center justify-between gap-4 bg-white py-2.5 pl-6 pr-3 md:gap-0 md:pl-10 md:pr-3.5 motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]",
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
          </ul>

          <div className={cn("flex shrink-0 items-center gap-2", docked ? "ml-auto" : "md:ml-[46px]")}>
            <Link
              href="/book"
              className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-forest px-6 py-3 text-[16px] font-bold text-white transition-colors hover:bg-forest-soft md:px-8 md:text-[17px]"
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
              "absolute inset-x-0 top-full bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] md:hidden",
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
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

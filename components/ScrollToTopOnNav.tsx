"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Next's scroll restoration can land a fresh page link back on the previous
 * scroll position (e.g. Home from /tours arriving half-way down the page).
 * Force a real page change back to the top, while leaving in-page anchor
 * jumps (#about, #contact, ...) to the built-in smooth scroll.
 */
export default function ScrollToTopOnNav() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    const top = () => window.scrollTo(0, 0);
    top();
    const raf = requestAnimationFrame(top);
    const timer = window.setTimeout(top, 50);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/#destinations" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-7">
      <div className="relative w-full max-w-fit">
        <nav
          aria-label="Main"
          className="flex items-center justify-between gap-4 rounded-full border-0 bg-white py-2.5 pl-6 pr-3 shadow-[0_10px_30px_rgba(0,0,0,0.18)] md:gap-0 md:pl-10 md:pr-3.5"
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

          <div className="flex items-center gap-2 md:ml-[46px]">
            <Link
              href="/book"
              className="rounded-full bg-forest px-6 py-3 text-[16px] font-bold text-white transition-colors hover:bg-forest-soft md:px-8 md:text-[17px]"
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
          <div className="absolute inset-x-0 top-full mt-3 rounded-3xl bg-white p-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] md:hidden">
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

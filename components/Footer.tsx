import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PalmSketch from "@/components/PalmSketch";
import { SHORT_NAMES } from "@/lib/tours";
import { SITE, whatsappHref } from "@/lib/site";
import type { Tour } from "@/lib/types";

const company = [
  { label: "Home", href: "/" },
  { label: "Tours", href: "/tours" },
  { label: "About", href: "/#about" },
  { label: "Gallery", href: "/#destinations" },
  { label: "Contact", href: "/#contact" },
];

const heading = "mb-6 text-[15px] font-bold uppercase tracking-[0.27em] text-sand";
const linkCls = "text-lg text-[#d6e2d6] transition-colors hover:text-white";

export default function Footer({ tours }: { tours: Tour[] }) {
  const wa = whatsappHref();
  return (
    <footer id="contact" className="bg-forest text-white">
      <Container className="pt-20">
        {/* First thing you see when the Contact link jumps here. */}
        <div className="border-b border-[#32483a] pb-14">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.24em] text-[#96ac9a]">Email</p>
              <a
                href="mailto:donnavantatenda5@gmail.com"
                className="mt-3 block break-all text-xl font-bold text-white transition-colors hover:text-sand"
              >
                donnavantatenda5@gmail.com
              </a>
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.24em] text-[#96ac9a]">Phone</p>
              <a href="tel:+263773473009" className="mt-3 block text-xl font-bold text-white transition-colors hover:text-sand">
                +263 773 473 009
              </a>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <a
                  href="tel:+263773473009"
                  className="rounded-full border border-[#3c5442] px-4 py-1.5 text-sm font-bold text-sand transition-colors hover:bg-[#1c3a28] hover:text-white"
                >
                  Call
                </a>
                <a
                  href="https://wa.me/263773473009"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#3c5442] px-4 py-1.5 text-sm font-bold text-sand transition-colors hover:bg-[#1c3a28] hover:text-white"
                >
                  WhatsApp
                </a>
              </div>
            </div>
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.24em] text-[#96ac9a]">Phone</p>
              <a href="tel:+263775418768" className="mt-3 block text-xl font-bold text-white transition-colors hover:text-sand">
                +263 775418768
              </a>
              <div className="mt-3 flex flex-wrap items-center gap-2.5">
                <a
                  href="tel:+263775418768"
                  className="rounded-full border border-[#3c5442] px-4 py-1.5 text-sm font-bold text-sand transition-colors hover:bg-[#1c3a28] hover:text-white"
                >
                  Call
                </a>
                <a
                  href="https://wa.me/263775418768"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#3c5442] px-4 py-1.5 text-sm font-bold text-sand transition-colors hover:bg-[#1c3a28] hover:text-white"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Logo + link columns sit left; the palm etching takes the right-hand side. */}
        <div className="flex flex-col gap-14 md:flex-row md:items-start md:gap-8 lg:gap-12">
          <div className="grid flex-1 gap-12 md:grid-cols-[1.5fr_1.1fr_0.8fr_0.8fr] md:pr-8 lg:pr-10">
          <div>
            <span className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-white">
              <Image src="/logo.png" alt="Roar and River Safaris" width={703} height={606} className="h-[58px] w-auto" />
            </span>
            <p className="mt-7 text-lg font-bold uppercase tracking-[0.19em]">Roar and River Safaris</p>
            <p className="mt-4 max-w-[300px] text-lg leading-relaxed text-[#b2c4b4]">
              A local tour company based in the heart of Victoria Falls, Zimbabwe.
            </p>
          </div>

          <div>
            <h3 className={heading}>Tours</h3>
            <ul className="space-y-3">
              {tours.map((t) => (
                <li key={t.slug}>
                  <Link href={`/tours/${t.slug}`} className={linkCls}>
                    {SHORT_NAMES[t.slug] ?? t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={heading}>Company</h3>
            <ul className="space-y-3">
              {company.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkCls}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={heading}>Find us</h3>
            <ul className="space-y-3 text-lg text-[#d6e2d6]">
              <li>Victoria Falls</li>
              <li>Zimbabwe</li>
              {wa.startsWith("http") && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="text-sand hover:text-white">
                    WhatsApp us
                  </a>
                </li>
              )}
            </ul>
          </div>
          </div>

          <div className="w-[min(70vw,300px)] shrink-0 self-end md:-mr-6 md:w-[min(30vw,340px)] md:self-start md:pt-4 lg:-mr-10">
            <PalmSketch className="opacity-[0.6]" />
          </div>
        </div>

        <div className="mt-16 border-t border-[#32483a] py-8 text-center text-base text-[#96ac9a]">
          &copy; {new Date().getFullYear()} {SITE.name} &nbsp;|&nbsp; {SITE.location}
        </div>
      </Container>
    </footer>
  );
}

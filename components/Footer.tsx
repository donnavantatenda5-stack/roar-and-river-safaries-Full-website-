import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PalmSketch from "@/components/PalmSketch";
import { SHORT_NAMES } from "@/lib/tours";
import { SITE } from "@/lib/site";
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
  return (
    <footer id="contact" className="bg-forest text-white">
      <Container className="pt-20">
        {/* Contact details (email, phones, WhatsApp) live in the nav's Contact panel. */}

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

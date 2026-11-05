import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PalmSketch from "@/components/PalmSketch";
import { SHORT_NAMES } from "@/lib/tours";
import { GOOGLE_MAPS_DIRECTIONS_URL, LOCATION, SITE } from "@/lib/site";
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

        <section aria-labelledby="location-heading" className="mb-20">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <h2 id="location-heading" className="font-serif text-2xl font-bold sm:text-3xl">
              Find us
            </h2>
            <a
              href={GOOGLE_MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-sand underline underline-offset-4 transition-colors hover:text-white"
            >
              Get Directions
            </a>
          </div>
          <div className="h-[260px] w-full overflow-hidden rounded-2xl border border-white/15 sm:h-[340px] lg:h-[400px]">
            <iframe
              title={`Map showing ${LOCATION.address}`}
              src={`https://www.google.com/maps?q=${LOCATION.latitude}%2C${LOCATION.longitude}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        </section>

        {/* Logo + link columns sit left; the palm etching takes the right-hand side. */}
        <div className="flex flex-col gap-14 md:flex-row md:items-start md:gap-8 lg:gap-12">
          <div className="grid min-w-0 flex-1 gap-12 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.1fr)_minmax(0,0.8fr)_minmax(0,0.8fr)] md:pr-8 lg:pr-10">
          <div>
            <span className="flex h-[92px] w-[92px] items-center justify-center rounded-full bg-white">
              <Image src="/logo.png" alt="Roar and River Safaris" width={703} height={606} quality={100} className="h-[58px] w-auto" />
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

const items = ["Local guides", "Fair prices", "Unforgettable memories"];

function Track({ copy = false }: { copy?: boolean }) {
  return (
    <ul
      data-marquee-list={copy ? "copy" : "main"}
      aria-hidden={copy || undefined}
      className="flex shrink-0 items-center gap-x-10 pr-10 sm:gap-x-16 sm:pr-16"
    >
      {items.map((t) => (
        <li
          key={t}
          className="flex items-center gap-x-5 whitespace-nowrap sm:gap-x-7"
        >
          <span>{t}</span>
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 shrink-0 rotate-45 bg-gold"
          />
        </li>
      ))}
    </ul>
  );
}

export default function TrustStrip() {
  return (
    <section aria-label="Why choose us" className="relative overflow-hidden bg-forest">
      <div className="trust-track flex min-h-[84px] w-max items-center py-5 text-[13px] font-bold uppercase tracking-[0.26em] text-[#f0e8d6] sm:text-base sm:tracking-[0.28em]">
        <Track />
        <Track copy />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-forest to-transparent sm:w-20"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-forest to-transparent sm:w-20"
      />
    </section>
  );
}

const items = ["Local guides", "Fair prices", "Unforgettable memories"];

export default function TrustStrip() {
  return (
    <section aria-label="Why choose us" className="bg-forest">
      <ul className="mx-auto flex min-h-[84px] max-w-[1272px] flex-wrap items-center justify-center gap-x-[50px] gap-y-3 px-6 py-5 text-[13px] font-bold uppercase tracking-[0.26em] text-[#f0e8d6] sm:text-base sm:tracking-[0.28em]">
        {items.map((t, i) => (
          <li key={t} className="flex items-center gap-[50px]">
            {t}
            {i < items.length - 1 && (
              <span aria-hidden="true" className="hidden h-2.5 w-2.5 rotate-45 bg-gold sm:block" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

const tiles = [
  {
    title: "Mission",
    body: "Drive development with innovation and lead the future with green energy.",
    image:
      "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1200&q=80",
  },
  {
    title: "Vision",
    body: "To promote global energy transformation with technology.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  },
  {
    title: "Core values",
    lines: [
      "Energy saving",
      "Environmental protection",
      "High quality",
      "High efficiency",
    ],
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&q=80",
  },
] as const;

export function CompanyCultureSection() {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="company-culture-heading"
    >
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="min-h-[350px] flex-[0_0_42%] sm:flex-[0_0_38%] bg-[#f4f6f8]" />
        <div className="flex-1 bg-[#0B2A4A]" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.2),transparent_40%)] opacity-90 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-10 pb-16 pt-14 md:pb-24 md:pt-20">
        <h2
          id="company-culture-heading"
          className="scroll-reveal text-[clamp(1.75rem,2.5vw,2.5rem)] font-bold uppercase tracking-tight text-white"
        >
          Company Culture
        </h2>

        <div className="scroll-reveal mt-8 md:mt-10 mx-auto max-w-7xl rounded-3xl border border-white/20 bg-white/[0.07] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_24px_60px_rgba(11,42,74,0.18)] backdrop-blur-xl sm:p-4 md:p-5">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
            {tiles.map((tile) => (
              <article
                key={`${tile.title}-${tile.image}`}
                className="group relative min-h-[260px] overflow-hidden rounded-2xl border border-white/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform duration-300 ease-out will-change-transform hover:z-10 hover:scale-[1.02] md:min-h-[300px]"
              >
                <div
                  className="absolute inset-0 scale-105 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${tile.image})` }}
                  role="img"
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050d18]/92 via-[#0B2A4A]/45 to-[#0B2A4A]/25" />
                <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-[3px]" />

                <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5 md:min-h-[300px] md:p-6">
                  <div className="rounded-xl border border-white/20 bg-white/[0.12] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md md:px-5 md:py-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/90 md:text-sm">
                      {tile.title}
                    </h3>
                    {"body" in tile ? (
                      <p className="mt-2 text-sm leading-relaxed text-white/95 md:text-base">
                        {tile.body}
                      </p>
                    ) : (
                      <ul className="mt-2 space-y-1.5 text-sm text-white/95 md:text-base">
                        {tile.lines.map((line) => (
                          <li key={line} className="flex items-center gap-2">
                            <span
                              className="h-1 w-1 shrink-0 rounded-full bg-[#4da3ff]"
                              aria-hidden
                            />
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

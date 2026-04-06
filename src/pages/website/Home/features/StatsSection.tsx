import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface StatsSectionProps {
  products: number;
  customers: number;
  installations: number;
}

function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleDeg: number,
) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function describeSector(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export function StatsSection({
  products,
  customers,
  installations,
}: StatsSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[#0B2A4A] text-white py-20 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.28),transparent_42%),radial-gradient(circle_at_88%_24%,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_82%_76%,rgba(37,99,235,0.22),transparent_34%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070e18]/20 to-[#070e18]/60" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-12 lg:gap-6">
          <div className="scroll-reveal">
            <h2 className="text-3xl sm:text-4xl font-bold uppercase">
              About Us
            </h2>
            <h4 className="mt-5 text-2xl sm:text-3xl font-medium leading-[1.25] text-white/90 max-w-2xl">
              EnergyMart was founded in <b className="text-[#4da3ff]">2018</b>,
              and has delivered trusted solar systems across Pakistan for years.
            </h4>
            <p className="mt-4 text-white/85 text-base sm:text-lg max-w-2xl">
              As one of Pakistan's fast-growing solar suppliers, we provide
              complete solar solutions including panels, inverters, batteries,
              and installation support.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b5ace] px-6 py-2.5 text-sm font-semibold transition hover:bg-[#0a4cb0]"
              >
                Learn More
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <a
                href="#consultation"
                className="inline-flex items-center gap-2 rounded-full bg-[#0b5ace] px-6 py-2.5 text-sm font-semibold transition hover:bg-[#0a4cb0]"
              >
                Videos
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="scroll-reveal relative w-full flex justify-center lg:justify-end [perspective:1000px]">
            <div className="group relative h-[360px] w-[360px] sm:h-[520px] sm:w-[520px] [transform-style:preserve-3d] transition-transform duration-500 ease-out hover:[transform:rotateX(4deg)_rotateY(-7deg)]">
              <svg
                viewBox="0 0 520 520"
                className="absolute inset-0 h-full w-full drop-shadow-[0_0_40px_rgba(58,118,255,0.35)]"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient id="pieBg" cx="22%" cy="16%" r="75%">
                    <stop offset="0%" stopColor="#86b5ff" stopOpacity="0.35" />
                    <stop offset="35%" stopColor="#2d63bf" stopOpacity="0.35" />
                    <stop
                      offset="100%"
                      stopColor="#0d1d40"
                      stopOpacity="0.92"
                    />
                  </radialGradient>
                </defs>

                <circle
                  cx="260"
                  cy="260"
                  r="250"
                  fill="url(#pieBg)"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="2"
                />

                <path
                  d={describeSector(260, 260, 250, 20, 95)}
                  fill="rgba(127,174,255,0.30)"
                />
                <path
                  d={describeSector(260, 260, 250, 95, 175)}
                  fill="rgba(28,63,132,0.48)"
                />
                <path
                  d={describeSector(260, 260, 250, 175, 255)}
                  fill="rgba(10,25,58,0.86)"
                />
                <path
                  d={describeSector(260, 260, 250, 255, 340)}
                  fill="rgba(50,109,220,0.46)"
                />
                <path
                  d={describeSector(260, 260, 250, 340, 380)}
                  fill="rgba(149,192,255,0.22)"
                />

                {/* Right glass wedges */}
                <path
                  d={describeSector(260, 260, 250, 25, 55)}
                  fill="rgba(194,221,255,0.22)"
                />
                <path
                  d={describeSector(260, 260, 250, 55, 90)}
                  fill="rgba(185,216,255,0.17)"
                />

                <circle
                  cx="260"
                  cy="260"
                  r="178"
                  fill="rgba(16,31,62,0.82)"
                  stroke="rgba(255,255,255,0.10)"
                  strokeWidth="1.5"
                />
                <path
                  d={describeSector(260, 260, 145, 40, 140)}
                  fill="rgba(12,76,172,0.52)"
                />

                {/* sector separators */}
                <line
                  x1="260"
                  y1="82"
                  x2="260"
                  y2="438"
                  stroke="rgba(255,255,255,0.13)"
                  strokeWidth="1"
                />
                <line
                  x1="82"
                  y1="260"
                  x2="438"
                  y2="260"
                  stroke="rgba(255,255,255,0.13)"
                  strokeWidth="1"
                />
              </svg>

              <div className="absolute left-1/2 top-[11%] -translate-x-1/2 text-center max-w-[170px]">
                <p className="stat-number text-4xl sm:text-5xl font-bold">3</p>
                <p className="text-sm sm:text-base text-white/85">
                  Listed Companies
                </p>
              </div>

              <div className="absolute left-[5%] top-1/2 -translate-y-1/2 text-center max-w-[195px]">
                <p className="stat-number text-3xl sm:text-4xl font-bold">
                  {products.toLocaleString()}+
                </p>
                <p className="text-sm sm:text-base text-white/85">Products</p>
              </div>

              <div className="absolute right-[4%] top-1/2 -translate-y-1/2 text-center max-w-[195px]">
                <p className="stat-number text-3xl sm:text-4xl font-bold">
                  {customers.toLocaleString()}+
                </p>
                <p className="text-sm sm:text-base text-white/85">Customers</p>
              </div>

              <div className="absolute left-1/2 bottom-[7%] -translate-x-1/2 text-center max-w-[260px]">
                <p className="stat-number text-4xl sm:text-5xl font-bold">
                  {installations.toLocaleString()}+
                </p>
                <p className="text-sm sm:text-base text-white/85">
                  Installations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

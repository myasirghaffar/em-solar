import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface StatsSectionProps {
  products: number;
  customers: number;
  installations: number;
}

export function StatsSection({
  products,
  customers,
  installations,
}: StatsSectionProps) {
  const statTiles = [
    {
      value: "3",
      label: "Listed Companies",
      valueClass: "text-4xl sm:text-5xl",
    },
    {
      value: `${customers.toLocaleString()}+`,
      label: "Customers",
      valueClass: "text-3xl sm:text-4xl",
    },
    {
      value: `${products.toLocaleString()}+`,
      label: "Products",
      valueClass: "text-3xl sm:text-4xl",
    },
    {
      value: `${installations.toLocaleString()}+`,
      label: "Installations",
      valueClass: "text-4xl sm:text-5xl",
    },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-[#0B2A4A] text-white py-20 md:py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070e18]/20 to-[#070e18]/60" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] items-center gap-12 lg:gap-6">
          <div className="scroll-reveal" data-aos="fade-right">
            <h2 className="text-3xl sm:text-4xl font-bold uppercase">
              Company Statistics
            </h2>
            <h4 className="mt-5 text-2xl sm:text-3xl font-medium leading-[1.25] text-white/90 max-w-2xl">
              We are a leading solar energy e-commerce platform, empowering
              homes and businesses with clean, renewable energy solutions.
            </h4>
            <p className="mt-4 text-white/85 text-base sm:text-lg max-w-2xl">
              Our mission is to make clean, renewable energy accessible to
              everyone.
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

          <div
            className="scroll-reveal relative flex w-full justify-center lg:justify-end [perspective:1000px]"
            data-aos="fade-left"
            data-aos-delay="100"
          >
            <div className="group w-full max-w-[min(100%,380px)] sm:max-w-[460px] [transform-style:preserve-3d] transition-transform duration-500 ease-out hover:[transform:rotateX(4deg)_rotateY(-7deg)]">
              <div
                className="grid aspect-square grid-cols-2 gap-3 sm:gap-4 rounded-3xl border border-white/25 bg-gradient-to-br from-white/10 to-white/[0.03] p-3 sm:p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_0_48px_rgba(58,118,255,0.22)] backdrop-blur-2xl"
                aria-label="Company statistics"
              >
                {statTiles.map((tile, index) => (
                  <div
                    key={tile.label}
                    className="relative flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/[0.07] px-2 py-5 sm:py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md transition-transform duration-300 ease-out will-change-transform hover:z-10 hover:scale-[1.05]"
                    data-aos="zoom-in"
                    data-aos-delay={index * 80}
                  >
                    <p
                      className={`stat-number font-bold tabular-nums ${tile.valueClass}`}
                    >
                      {tile.value}
                    </p>
                    <p className="mt-1 text-sm text-white/85 sm:text-base">
                      {tile.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

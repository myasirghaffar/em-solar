import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  ArrowRight,
  Sun,
  PanelTop,
  Sparkles,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative -mt-20 pt-8 min-h-[100vh] w-full bg-gradient-to-b from-[#cfeaff] via-[#eaf6ff] to-white overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-[#FF7A00]/15 rounded-full blur-3xl" />
        <div className="absolute top-24 left-10 w-[420px] h-[420px] bg-[#0B2A4A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Decorative shapes (gives the “reference” card feel without copying) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[100%] h-[85%] rounded-[36px] backdrop-blur-md border border-white" />
        <div className="absolute top-[22%] right-[10%] w-20 h-20 rounded-2xl bg-[#FF7A00]/15 rotate-12" />
        <div className="absolute bottom-[18%] left-[12%] w-16 h-16 rounded-2xl bg-[#0B2A4A]/10 -rotate-6" />
      </div>

      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 right-16 hidden lg:block"
      >
        <Sun className="w-28 h-28 text-[#0B2A4A]/15" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 left-16 hidden lg:block"
      >
        <PanelTop className="w-24 h-24 text-[#0B2A4A]/12" />
      </motion.div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
            {/* Left: copy inside “card” */}
            <div className="px-6 md:px-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B2A4A]/90 text-white text-sm font-medium mb-5">
                <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                Custom solar solutions for Pakistan
              </div>
              <h1 className="hero-title text-4xl md:text-6xl font-extrabold tracking-tight text-[#0B2A4A] leading-[1.05]">
                Power Your Future With{" "}
                <span className="text-[#FF7A00]">Clean Solar</span> Energy
              </h1>
              <p className="hero-subtitle text-lg md:text-xl text-gray-600 mt-5 max-w-xl">
                Custom solar solutions designed to lower energy costs and power
                your home more efficiently.
              </p>
              <div className="hero-cta flex flex-col sm:flex-row gap-3 mt-7">
                <Link to="/shop">
                  <button className="bg-[#0B2A4A] text-white px-7 py-4 rounded-full font-semibold text-base hover:bg-[#0B2A4A]/90 transition-all flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Shop Solar Products
                  </button>
                </Link>
                <a href="#consultation">
                  <button className="bg-white text-[#0B2A4A] px-7 py-4 rounded-full font-semibold text-base border border-[#0B2A4A]/15 hover:border-[#FF7A00]/50 hover:text-[#FF7A00] transition-all flex items-center justify-center">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#FF7A00]/10 flex items-center justify-center">
                    <Sun className="w-5 h-5 text-[#FF7A00]" />
                  </div>
                  <span>Trusted brands</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-[#0B2A4A]/10 flex items-center justify-center">
                    <PanelTop className="w-5 h-5 text-[#0B2A4A]" />
                  </div>
                  <span>Fast delivery</span>
                </div>
              </div>
            </div>

            {/* Right: Inverter image */}
            <div className="px-6 md:px-10">
              <div className="relative rounded-[30px] overflow-hidden bg-gradient-to-b from-white to-[#f6fbff] border border-white shadow-[0_30px_90px_rgba(11,42,74,0.16)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,122,0,0.14),transparent_48%),radial-gradient(circle_at_85%_30%,rgba(11,42,74,0.12),transparent_52%)]" />

                <div className="relative p-8 md:p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-xs font-semibold text-[#0B2A4A]/70 tracking-wide">
                      HYBRID SOLAR INVERTER
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white/80 border border-white text-xs font-semibold text-[#0B2A4A]">
                      Top seller
                    </div>
                  </div>

                  <div className="relative flex items-center justify-center">
                    <motion.img
                      src="/images/inverter.png"
                      alt="Hybrid solar inverter"
                      className="w-full max-w-[300px] md:max-w-[350px] drop-shadow-[0_22px_40px_rgba(11,42,74,0.20)]"
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 4.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className="absolute -bottom-6 w-[70%] h-10 bg-[#0B2A4A]/10 blur-2xl rounded-full" />
                  </div>

                  <div className="mt-10 grid grid-cols-3 gap-3 text-center">
                    {[
                      { label: "Warranty", value: "5 Years" },
                      { label: "Hybrid", value: "Smart" },
                      { label: "Support", value: "Expert" },
                    ].map((k) => (
                      <div
                        key={k.label}
                        className="bg-white/70 rounded-2xl border border-white px-3 py-4"
                      >
                        <div className="text-lg font-extrabold text-[#0B2A4A]">
                          {k.value}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {k.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

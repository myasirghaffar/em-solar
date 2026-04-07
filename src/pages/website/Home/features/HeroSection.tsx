import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowRight, Sparkles } from "lucide-react";

const heroSlides = [
  {
    id: "slide-1",
    badgeText: "Custom solar solutions for Pakistan",
    headingTop: "Power Your Future With",
    headingAccent: "Clean Solar",
    headingBottom: "Energy",
    subtitle:
      "Custom solar solutions designed to lower energy costs and power your home more efficiently.",
    tag: "HYBRID SOLAR INVERTER",
    badge: "Top seller",
    image: "/images/inverter.png",
    title: "High-Efficiency Inverter",
    details: [
      { label: "Warranty", value: "5 Years" },
      { label: "Output", value: "10kW" },
      { label: "Support", value: "Expert" },
    ],
  },
  {
    id: "slide-2",
    badgeText: "Efficient panels for modern homes",
    headingTop: "Upgrade To",
    headingAccent: "Premium Solar",
    headingBottom: "Panels",
    subtitle:
      "High-performance mono panels with strong output and long-term durability for every season.",
    tag: "MONO SOLAR PANEL",
    badge: "Best value",
    image: "/images/solar-panel-1.png",
    title: "Premium Solar Panel",
    details: [
      { label: "Efficiency", value: "22%" },
      { label: "Power", value: "550W" },
      { label: "Durability", value: "25Y" },
    ],
  },
  {
    id: "slide-3",
    badgeText: "Reliable backup for uninterrupted power",
    headingTop: "Store More With",
    headingAccent: "Smart Battery",
    headingBottom: "Systems",
    subtitle:
      "Advanced lithium storage keeps your home powered day and night with stable and safe backup.",
    tag: "LITHIUM BATTERY",
    badge: "Reliable backup",
    image: "/images/battery-1.webp",
    title: "Smart Energy Storage",
    details: [
      { label: "Capacity", value: "13.5kWh" },
      { label: "Cycles", value: "6000+" },
      { label: "Safety", value: "BMS" },
    ],
  },
];

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [internalIndex, setInternalIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);

  const displaySlides = useMemo(() => [...heroSlides, heroSlides[0]], []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setInternalIndex((prev) => prev + 1);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (internalIndex === heroSlides.length) {
      setActiveIndex(0);
      const t = window.setTimeout(() => {
        setWithTransition(false);
        setInternalIndex(0);
        requestAnimationFrame(() => setWithTransition(true));
      }, 520);
      return () => window.clearTimeout(t);
    }
    setActiveIndex(internalIndex);
  }, [internalIndex]);

  return (
    <section className="relative -mt-20 pt-8 min-h-[100vh] w-full bg-gradient-to-b from-[#cfeaff] via-[#eaf6ff] to-white overflow-hidden flex items-center">
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-[#FF7A00]/15 rounded-full blur-3xl" />
        <div className="absolute top-24 left-10 w-[420px] h-[420px] bg-[#0B2A4A]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[100%] h-[85%] rounded-[36px] backdrop-blur-md border border-white" />
        <div className="absolute top-[22%] right-[10%] w-20 h-20 rounded-2xl bg-[#FF7A00]/15 rotate-12" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="w-full mx-auto overflow-hidden">
          <div
            className={`flex ${withTransition ? "transition-transform duration-500 ease-out" : ""}`}
            style={{ transform: `translateX(-${internalIndex * 100}%)` }}
          >
            {displaySlides.map((slide, idx) => (
              <div key={`${slide.id}-${idx}`} className="min-w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-20">
                  <div className="px-6 md:px-10 order-1 lg:order-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B2A4A]/90 text-white text-xs sm:text-sm font-medium mb-5 mx-auto lg:mx-0">
                      <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                      {slide.badgeText}
                    </div>
                    <h1 className="hero-title text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-[#0B2A4A] leading-[1.08] sm:leading-[1.05]">
                      {slide.headingTop}{" "}
                      <span className="text-[#FF7A00]">
                        {slide.headingAccent}
                      </span>{" "}
                      {slide.headingBottom}
                    </h1>
                    <p className="hero-subtitle text-base sm:text-lg md:text-xl text-gray-600 mt-5 max-w-xl mx-auto lg:mx-0">
                      {slide.subtitle}
                    </p>
                    <div className="lg:hidden mt-5">
                      <div className="mx-auto w-[50%] max-w-[220px] aspect-square flex items-center justify-center">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-contain"
                          loading={idx === 0 ? "eager" : "lazy"}
                          fetchPriority={idx === 0 ? "high" : undefined}
                        />
                      </div>
                    </div>
                    <div className="hero-cta hidden lg:flex flex-col sm:flex-row gap-3 mt-7 justify-center lg:justify-start items-center">
                      <Link to="/shop" className="w-[260px]">
                        <button className="w-full h-14 bg-[#0B2A4A] text-white px-7 py-4 rounded-full font-semibold text-sm sm:text-base hover:bg-[#0B2A4A]/90 transition-all flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Shop Solar Products
                        </button>
                      </Link>
                      <a href="#consultation" className="w-[260px]">
                        <button className="w-full h-14 bg-white text-[#0B2A4A] px-7 py-4 rounded-full font-semibold text-sm sm:text-base border border-[#0B2A4A]/15 hover:border-[#FF7A00]/50 hover:text-[#FF7A00] transition-all flex items-center justify-center">
                          Get Started
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                      </a>
                    </div>
                  </div>

                  <div className="px-6 md:px-10 order-2 lg:order-2 hidden lg:block">
                    <div className="mx-auto w-[50%] sm:w-[42%] lg:w-full max-w-[560px] aspect-square lg:h-[560px] lg:aspect-auto flex items-center justify-center">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-contain"
                        loading={idx === 0 ? "eager" : "lazy"}
                        fetchPriority={idx === 0 ? "high" : undefined}
                      />
                    </div>
                  </div>

                  <div className="px-6 md:px-10 order-3 lg:hidden">
                    <div className="hero-cta flex flex-col gap-3 mt-2 justify-center items-center">
                      <Link to="/shop" className="w-[260px]">
                        <button className="w-full h-14 bg-[#0B2A4A] text-white px-7 py-4 rounded-full font-semibold text-sm transition-all flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Shop Solar Products
                        </button>
                      </Link>
                      <a href="#consultation" className="w-[260px]">
                        <button className="w-full h-14 bg-white text-[#0B2A4A] px-7 py-4 rounded-full font-semibold text-sm border border-[#0B2A4A]/15 transition-all flex items-center justify-center">
                          Get Started
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2 flex justify-center gap-2">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to hero slide ${i + 1}`}
                onClick={() => {
                  setWithTransition(true);
                  setInternalIndex(i);
                  setActiveIndex(i);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === i
                    ? "w-8 bg-[#0B2A4A]"
                    : "w-2.5 bg-[#0B2A4A]/30 hover:bg-[#0B2A4A]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

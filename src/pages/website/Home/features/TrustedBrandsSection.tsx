import { useRef, useEffect, useCallback } from "react";

const brands = [
  {
    name: "LONGi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/LONGi_logo.svg",
  },
  {
    name: "Jinko",
    logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/JinkoSolar_logo.svg",
  },
  {
    name: "Trina",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Trina_Solar_logo.svg",
  },
  {
    name: "Huawei",
    logo: "https://upload.wikimedia.org/wikipedia/en/0/04/Huawei_Standard_logo.svg",
  },
  {
    name: "Growatt",
    logo: "https://www.ginverter.com/upload/logo.png",
  },
  {
    name: "Sungrow",
    logo: "https://en.sungrowpower.com/templates/default/images/logo.svg",
  },
  {
    name: "JA Solar",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/JA_Solar_logo.svg",
  },
  {
    name: "Canadian Solar",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Canadian_Solar_logo.svg",
  },
  {
    name: "Tesla",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
  },
  {
    name: "LG",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg",
  },
];

const SLIDE_WIDTH = 220;
const SLIDE_GAP = 16;
const SLIDE_STEP = SLIDE_WIDTH + SLIDE_GAP;
const LOOP_JUMP_THRESHOLD = 120;

function BrandCard({ brand }: { brand: { name: string; logo: string } }) {
  return (
    <div
      className="flex-shrink-0 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-md"
      style={{ width: SLIDE_WIDTH, minHeight: 100 }}
    >
      <img
        src={brand.logo}
        alt={`${brand.name} logo`}
        loading="lazy"
        className="mx-auto max-h-12 w-auto object-contain grayscale"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export function TrustedBrandsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const jumpLockRef = useRef(false);
  const autoPlayPausedRef = useRef(false);

  const logicalBrands =
    brands.length > 0 && brands.length < 8 ? [...brands, ...brands] : brands;
  const count = logicalBrands.length;
  const setWidth = count > 0 ? count * SLIDE_STEP - SLIDE_GAP : 0;

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || count < 2 || jumpLockRef.current || setWidth <= 0) return;

    const { scrollLeft } = el;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    if (scrollLeft >= maxScrollLeft - LOOP_JUMP_THRESHOLD) {
      jumpLockRef.current = true;
      el.scrollLeft = scrollLeft - setWidth;
      requestAnimationFrame(() => {
        jumpLockRef.current = false;
      });
    } else if (scrollLeft <= LOOP_JUMP_THRESHOLD) {
      jumpLockRef.current = true;
      el.scrollLeft = scrollLeft + setWidth;
      requestAnimationFrame(() => {
        jumpLockRef.current = false;
      });
    }
  }, [count, setWidth]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || count < 2) return;
    requestAnimationFrame(() => {
      el.scrollLeft = setWidth;
    });
  }, [count, setWidth]);

  useEffect(() => {
    if (count < 2) return;
    const timer = window.setInterval(() => {
      if (autoPlayPausedRef.current) return;
      trackRef.current?.scrollBy({ left: SLIDE_STEP, behavior: "smooth" });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [count]);

  const loopSlides =
    count > 1
      ? [...logicalBrands, ...logicalBrands, ...logicalBrands]
      : logicalBrands;

  return (
    <section className="py-40 bg-gray-50">
      <div className="container mx-auto px-4 mb-10">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">
            Trusted Brands
          </h2>
          <p className="text-gray-600">
            We partner with the world's leading solar manufacturers
          </p>
        </div>
      </div>

      <div className="scroll-reveal w-full overflow-hidden">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Trusted brands"
          onScroll={handleScroll}
          onMouseEnter={() => {
            autoPlayPausedRef.current = true;
          }}
          onMouseLeave={() => {
            autoPlayPausedRef.current = false;
          }}
          onTouchStart={() => {
            autoPlayPausedRef.current = true;
          }}
          onTouchEnd={() => {
            autoPlayPausedRef.current = false;
          }}
          className="trusted-brands-carousel flex overflow-x-auto overflow-y-hidden pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
        >
          {loopSlides.map((brand, i) => (
            <div key={`${brand.name}-${i}`} className="mr-4 flex-shrink-0">
              <BrandCard brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

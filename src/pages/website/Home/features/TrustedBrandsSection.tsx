import { useState } from "react";

type PartnerBrand = { name: string; logo: string };

const ENERGY_STORAGE_PARTNERS: PartnerBrand[] = [
  { name: "JA Solar", logo: "https://upload.wikimedia.org/wikipedia/commons/7/74/JA_Solar_logo.svg" },
  { name: "JinkoSolar", logo: "https://upload.wikimedia.org/wikipedia/commons/8/89/JinkoSolar_logo.svg" },
  { name: "Trina Solar", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Trina_Solar_logo.svg" },
  { name: "LONGi", logo: "https://upload.wikimedia.org/wikipedia/commons/4/48/LONGi_logo.svg" },
  { name: "Canadian Solar", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Canadian_Solar_logo.svg" },
  { name: "Huawei", logo: "https://upload.wikimedia.org/wikipedia/en/0/04/Huawei_Standard_logo.svg" },
  { name: "Sungrow", logo: "https://en.sungrowpower.com/templates/default/images/logo.svg" },
  { name: "Growatt", logo: "https://www.ginverter.com/upload/logo.png" },
];

const POWER_BATTERY_PARTNERS: PartnerBrand[] = [
  { name: "Pylontech", logo: "" },
  { name: "HICONICS", logo: "" },
  { name: "Pytes", logo: "" },
  { name: "SRNE", logo: "" },
  { name: "Deye", logo: "" },
  { name: "GOODWE", logo: "" },
  { name: "GSL Energy", logo: "" },
  { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" },
  { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg" },
];

const CARD_WIDTH = 168;
const CARD_GAP = 12;
/** Minimum logos per loop set so wide screens never show empty edges */
const MIN_BRANDS_PER_SET = 12;

type PartnerTab = "storage" | "battery";

function expandBrandsForMarquee(brands: PartnerBrand[]): PartnerBrand[] {
  if (brands.length === 0) return [];
  let expanded = [...brands];
  while (expanded.length < MIN_BRANDS_PER_SET) {
    expanded = [...expanded, ...brands];
  }
  return expanded;
}

function rotateBrands(brands: PartnerBrand[], offset: number): PartnerBrand[] {
  if (brands.length === 0) return [];
  const n = offset % brands.length;
  return [...brands.slice(n), ...brands.slice(0, n)];
}

function BrandCard({ brand }: { brand: PartnerBrand }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg border border-gray-200/90 bg-white px-4 py-5"
      style={{ width: CARD_WIDTH, minHeight: 88 }}
    >
      {brand.logo ? (
        <img
          src={brand.logo}
          alt={`${brand.name} logo`}
          loading="lazy"
          className="max-h-10 w-auto max-w-[120px] object-contain"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback instanceof HTMLElement) fallback.style.display = "block";
          }}
        />
      ) : null}
      <span
        className={`text-center text-sm font-semibold text-[#0B2A4A] ${brand.logo ? "hidden" : "block"}`}
      >
        {brand.name}
      </span>
    </div>
  );
}

function MarqueeRow({
  brands,
  direction,
}: {
  brands: PartnerBrand[];
  direction: "left" | "right";
}) {
  const sequence = expandBrandsForMarquee(brands);
  if (sequence.length === 0) return null;

  return (
    <div className="trusted-brands-marquee overflow-hidden py-1">
      <div
        className={`trusted-brands-track flex w-max flex-nowrap ${
          direction === "left" ? "trusted-brands-track--left" : "trusted-brands-track--right"
        }`}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="trusted-brands-set flex shrink-0 flex-nowrap"
            style={{ gap: CARD_GAP, paddingRight: CARD_GAP }}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {sequence.map((brand, i) => (
              <BrandCard key={`${copy}-${brand.name}-${i}`} brand={brand} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrustedBrandsSection() {
  const [tab, setTab] = useState<PartnerTab>("storage");
  const partners =
    tab === "storage" ? ENERGY_STORAGE_PARTNERS : POWER_BATTERY_PARTNERS;
  const midpoint = Math.ceil(partners.length / 2);
  const topRow = partners;
  const bottomRow = rotateBrands(partners, midpoint);

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center" data-aos="fade-up">
          <h2 className="text-2xl font-bold leading-tight text-[#0B2A4A] sm:text-3xl md:text-4xl">
            Powering Pakistan with Advanced{" "}
            <span className="relative inline-block">
              Solar
              <span
                className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-secondary"
                aria-hidden
              />
            </span>
          </h2>

          <div className="mt-8 inline-flex rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setTab("storage")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:px-6 ${
                tab === "storage"
                  ? "bg-[#0B2A4A] text-white shadow-sm"
                  : "text-gray-600 hover:text-[#0B2A4A]"
              }`}
            >
              Energy Storage Partners
            </button>
            <button
              type="button"
              onClick={() => setTab("battery")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors sm:px-6 ${
                tab === "battery"
                  ? "bg-[#0B2A4A] text-white shadow-sm"
                  : "text-gray-600 hover:text-[#0B2A4A]"
              }`}
            >
              Power Battery Partners
            </button>
          </div>
        </div>

        <div
          className="relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 space-y-3 sm:mt-12"
          data-aos="fade-up"
          data-aos-delay="80"
        >
          <MarqueeRow brands={topRow} direction="left" />
          <MarqueeRow brands={bottomRow} direction="right" />
        </div>
      </div>
    </section>
  );
}

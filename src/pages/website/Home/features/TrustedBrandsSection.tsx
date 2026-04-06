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

function BrandCard({ brand }: { brand: { name: string; logo: string } }) {
  return (
    <div className="flex-shrink-0 w-[160px] md:w-[180px] bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 px-5 py-4 flex items-center justify-center min-h-[100px] transition-shadow">
      <img
        src={brand.logo}
        alt={`${brand.name} logo`}
        loading="lazy"
        className="max-h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export function TrustedBrandsSection() {
  return (
    <section className="py-40 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">
            Trusted Brands
          </h2>
          <p className="text-gray-600">
            We partner with the world's leading solar manufacturers
          </p>
        </div>
        <div className="scroll-reveal">
          <div
            className="flex gap-4 w-max h-36 items-center"
            style={{ animation: "brands-marquee 30s linear infinite" }}
          >
            {[...brands, ...brands].map((brand, i) => (
              <BrandCard key={`${brand.name}-${i}`} brand={brand} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

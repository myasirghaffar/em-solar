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
  const loopSlides = [...brands, ...brands];

  return (
    <section className="py-40 bg-gray-50">
      <div className="container mx-auto px-4 mb-10">
        <div className="text-center mb-12 scroll-reveal" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">
            Trusted Brands
          </h2>
          <p className="text-gray-600">
            We partner with the world's leading solar manufacturers
          </p>
        </div>
      </div>

      <div
        className="scroll-reveal w-full overflow-hidden py-3"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Trusted brands"
          className="trusted-brands-carousel trusted-brands-track flex w-max pl-4 pr-4 sm:pl-6 sm:pr-6 lg:pl-8 lg:pr-8"
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

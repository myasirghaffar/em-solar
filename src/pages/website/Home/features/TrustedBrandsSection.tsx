const brands = [
  "Longi",
  "Jinko",
  "Trina",
  "Canadian",
  "Huawei",
  "Growatt",
  "Tesla",
  "LG",
];

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
              <div
                key={`${brand}-${i}`}
                className="flex-shrink-0 w-[140px] md:w-[160px] bg-white rounded-xl shadow-md hover:shadow-lg border border-gray-100 p-6 flex items-center justify-center min-h-[100px] transition-shadow"
              >
                <span className="text-lg md:text-xl font-bold text-[#0B2A4A] text-center">
                  {brand}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

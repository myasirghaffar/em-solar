const keyPoints = [
  "ISO 9001 Certified",
  "Tier-1 Solar Products",
  "Government Approved",
  "Pan-Pakistan Presence",
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative" data-aos="fade-right">
            <div className="overflow-hidden rounded-2xl shadow-[0_18px_48px_rgba(11,42,74,0.16)]">
              <img
                src="/images/solar-panel-12.jpg"
                alt="Large scale solar farm installation"
                loading="lazy"
                width={1200}
                height={800}
                className="h-[400px] w-full object-cover lg:h-[500px]"
              />
            </div>
            <div
              data-aos="zoom-in"
              data-aos-delay="140"
              className="absolute -bottom-6 -right-4 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_18px_48px_rgba(11,42,74,0.16)] lg:-right-8"
            >
              <div className="text-3xl font-extrabold text-[#FF7A00]">500MW+</div>
              <div className="mt-1 text-sm text-gray-600">
                Total Capacity Installed
              </div>
            </div>
          </div>

          <div data-aos="fade-left" data-aos-delay="80">
            <span className="text-sm font-semibold uppercase tracking-widest text-[#FF7A00]">
              About Us
            </span>
            <h2 className="mt-3 mb-6 text-3xl font-extrabold text-[#0B2A4A] sm:text-4xl lg:text-5xl">
              Pioneering Solar Excellence for Two Decades
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-600">
              Since 2005, we have been at the forefront of the solar energy
              revolution. Our commitment to quality, innovation, and customer
              satisfaction has made us one of the most trusted names in the
              industry.
            </p>
            <p className="mb-8 leading-relaxed text-gray-600">
              We partner with world-class manufacturers to deliver premium
              products and employ certified professionals to ensure flawless
              installations. Our mission is to make clean, renewable energy
              accessible to everyone.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {keyPoints.map((point, index) => (
                <div
                  key={point}
                  className="flex items-center gap-3"
                  data-aos="fade-up"
                  data-aos-delay={120 + index * 60}
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-[#FF7A00]" />
                  <span className="text-sm font-medium text-[#0B2A4A]">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

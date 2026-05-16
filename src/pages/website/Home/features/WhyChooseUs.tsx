const features = [
  {
    index: "01",
    title: "Wholesale Pricing",
    description:
      "Direct from source pricing that maximizes your margins and keeps your projects competitive.",
  },
  {
    index: "02",
    title: "Original Stock with Warranty",
    description:
      "100% genuine products backed by manufacturer warranties you can trust.",
  },
  {
    index: "03",
    title: "Installer & EPC Focused",
    description:
      "Built specifically for professionals who demand reliability and support at every stage.",
  },
  {
    index: "04",
    title: "Fast Delivery Across Pakistan",
    description:
      "Strategic logistics ensuring your projects stay on schedule, wherever you are.",
  },
];

export function WhyChooseUs() {
  return (
    <section
      id="why-energy-mart"
      className="scroll-reveal bg-[#f5f6f8] py-16 md:py-24"
      aria-labelledby="why-energy-mart-heading"
    >
      <div className="container mx-auto max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center md:mb-14" data-aos="fade-up">
          <h2
            id="why-energy-mart-heading"
            className="text-3xl font-bold tracking-tight text-[#0B2A4A] md:text-4xl"
          >
            Why Choose EnergyMart.pk?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-gray-500 md:text-lg">
            We are a leading solar energy e-commerce platform, empowering homes
            and businesses with clean, renewable energy solutions.
          </p>
        </div>

        <div
          className="why-choose-carousel -mx-4 grid w-full min-w-0 max-w-[100vw] grid-flow-col auto-cols-[100%] gap-4 overflow-x-auto snap-x snap-mandatory px-4 pb-2 md:mx-0 md:max-w-none md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:gap-6 md:overflow-visible md:snap-none md:px-0 lg:grid-cols-4 lg:gap-8"
          role="region"
          aria-roledescription="carousel"
          aria-label="Why choose EnergyMart"
        >
          {features.map((feature, i) => (
            <article
              key={feature.index}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className="group relative box-border flex w-full min-w-0 snap-center flex-col rounded-2xl border border-gray-200/90 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#FF7A00] hover:shadow-[0_16px_48px_rgba(11,42,74,0.12)] focus-within:ring-2 focus-within:ring-[#FF7A00]/30 focus-within:ring-offset-2 md:w-auto md:snap-align-none md:p-7"
            >
              <span className="text-sm font-semibold tabular-nums text-[#FF7A00] transition-colors duration-300 group-hover:text-[#0B2A4A]">
                {feature.index}
              </span>
              <span
                className="mt-3 block h-1 w-10 rounded-full bg-[#FF7A00] transition-all duration-300 group-hover:w-14 group-hover:bg-[#0B2A4A]"
                aria-hidden
              />
              <h3 className="mt-5 text-lg font-bold leading-snug text-[#0B2A4A] md:text-xl">
                {feature.title}
              </h3>
              <p className="mt-3 flex-1 break-words text-sm leading-relaxed text-gray-600 md:text-[15px]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

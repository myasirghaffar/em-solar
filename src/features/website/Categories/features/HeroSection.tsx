export function HeroSection() {
  return (
    <section className="bg-[#0B2A4A] text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#FF7A00] sm:text-sm">
          Shop by category
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          All <span className="text-[#FF7A00]">Categories</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Explore our full range of solar products — panels, inverters, batteries,
          and accessories for every project.
        </p>
      </div>
    </section>
  );
}

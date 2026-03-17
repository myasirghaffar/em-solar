interface StatsSectionProps {
  products: number;
  customers: number;
  installations: number;
}

export function StatsSection({ products, customers, installations }: StatsSectionProps) {
  return (
    <section className="py-20 bg-[#0B2A4A] text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center scroll-reveal">
            <p className="stat-number text-5xl md:text-6xl font-bold text-[#FF7A00] mb-2">{products.toLocaleString()}+</p>
            <p className="text-xl text-gray-300">Products Sold</p>
          </div>
          <div className="text-center scroll-reveal">
            <p className="stat-number text-5xl md:text-6xl font-bold text-[#FF7A00] mb-2">{customers.toLocaleString()}+</p>
            <p className="text-xl text-gray-300">Happy Customers</p>
          </div>
          <div className="text-center scroll-reveal">
            <p className="stat-number text-5xl md:text-6xl font-bold text-[#FF7A00] mb-2">{installations.toLocaleString()}+</p>
            <p className="text-xl text-gray-300">Installations</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ShopHeader() {
  return (
    <div className="border-b border-white/10 bg-[#0B2A4A] text-white">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FF7A00]">Store</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.5rem] lg:leading-tight">
          Shop solar products
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-gray-300 md:text-base">
          Panels, inverters, batteries, and accessories — filter by category and budget.
        </p>
      </div>
    </div>
  );
}

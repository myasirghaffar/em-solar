import { Search } from "lucide-react";

interface FiltersSidebarProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  priceRange: { min: string; max: string };
  setPriceRange: (v: { min: string; max: string }) => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  clearFilters: () => void;
  showFilters: boolean;
}

const inputClass =
  "box-border h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 shadow-sm outline-none transition-shadow placeholder:text-gray-400 focus:border-transparent focus:ring-2 focus:ring-[#FF7A00]";

export function FiltersSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  searchTerm,
  setSearchTerm,
  clearFilters,
}: FiltersSidebarProps) {
  return (
    <aside className="lg:w-72 xl:w-80">
      <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/90 md:p-7">
        <div className="mb-6 flex items-start justify-between gap-3 border-b border-gray-100 pb-5">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#0B2A4A]">Filters</h2>
            <p className="mt-1 text-xs text-gray-500">Refine products by search, category, or price.</p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="shrink-0 text-xs font-semibold uppercase tracking-wide text-[#FF7A00] transition-colors hover:text-[#e86e00]"
          >
            Clear all
          </button>
        </div>

        <div className="border-b border-gray-100 pb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
            <input
              type="search"
              placeholder="Search products…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${inputClass} pl-10`}
            />
          </div>
        </div>

        <div className="border-b border-gray-100 py-6">
          <label className="mb-3 block text-sm font-medium text-gray-700">Category</label>
          <div className="space-y-1 rounded-xl bg-gray-50/80 p-2 ring-1 ring-gray-100">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/90">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ""}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-4 w-4 shrink-0 text-[#FF7A00] focus:ring-[#FF7A00]"
              />
              <span className="text-sm font-medium text-[#0B2A4A]">All categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-white/90">
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={selectedCategory === cat}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-4 w-4 shrink-0 text-[#FF7A00] focus:ring-[#FF7A00]"
                />
                <span className="text-sm text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6">
          <label className="mb-3 block text-sm font-medium text-gray-700">Price (PKR)</label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
              className={inputClass}
            />
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

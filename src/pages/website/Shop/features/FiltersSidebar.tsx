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
    <aside className="lg:w-64">
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#0B2A4A]">Filters</h2>
          <button onClick={clearFilters} className="text-sm text-[#FF7A00] hover:text-[#FF7A00]/80">Clear All</button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]" />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <div className="space-y-2">
            <label className="flex items-center cursor-pointer">
              <input type="radio" name="category" value="" checked={selectedCategory === ""} onChange={(e) => setSelectedCategory(e.target.value)} className="w-4 h-4 text-[#FF7A00] focus:ring-[#FF7A00]" />
              <span className="ml-2 text-gray-700">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat} className="flex items-center cursor-pointer">
                <input type="radio" name="category" value={cat} checked={selectedCategory === cat} onChange={(e) => setSelectedCategory(e.target.value)} className="w-4 h-4 text-[#FF7A00] focus:ring-[#FF7A00]" />
                <span className="ml-2 text-gray-700">{cat}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range (PKR)</label>
          <div className="flex flex-col gap-3">
            <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]" />
            <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7A00]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

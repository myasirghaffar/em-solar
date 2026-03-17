import { Filter, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../../../../components/store/ProductCard";

interface ProductGridProps {
  loading: boolean;
  filteredProducts: any[];
  selectedCategory: string;
  priceRange: { min: string; max: string };
  searchTerm: string;
  showFilters: boolean;
  setShowFilters: (v: boolean) => void;
  clearFilters: () => void;
  onAddToCart: (p: any) => void;
}

export function ProductGrid({
  loading,
  filteredProducts,
  selectedCategory,
  priceRange,
  searchTerm,
  showFilters,
  setShowFilters,
  clearFilters,
  onAddToCart,
}: ProductGridProps) {
  const hasFilters = selectedCategory || priceRange.min || priceRange.max || searchTerm;

  return (
    <div className="flex-1">
      <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden w-full mb-4 bg-white rounded-lg shadow-md p-4 flex items-center justify-center space-x-2">
        <SlidersHorizontal className="w-5 h-5" />
        <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
      </button>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-gray-600">Showing <span className="font-semibold text-[#0B2A4A]">{filteredProducts.length}</span> products</p>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center space-x-1 text-[#FF7A00] hover:text-[#FF7A00]/80">
            <X className="w-4 h-4" />
            <span>Clear filters</span>
          </button>
        )}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

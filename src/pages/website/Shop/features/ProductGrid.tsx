import { Filter, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../../../../components/store/ProductCard";
import Pagination from "../../../../components/ui/Pagination";

interface ProductGridProps {
  loading: boolean;
  filteredProducts: any[];
  productsOnPage: any[];
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
  productsOnPage,
  page,
  pageSize,
  totalPages,
  onPageChange,
  selectedCategory,
  priceRange,
  searchTerm,
  showFilters,
  setShowFilters,
  clearFilters,
  onAddToCart,
}: ProductGridProps) {
  const hasFilters = selectedCategory || priceRange.min || priceRange.max || searchTerm;
  const safePage =
    totalPages <= 0 ? 1 : Math.min(Math.max(1, page), totalPages);
  const startItem =
    filteredProducts.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem =
    filteredProducts.length === 0
      ? 0
      : Math.min(safePage * pageSize, filteredProducts.length);

  return (
    <div className="min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setShowFilters(!showFilters)}
        className="mb-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-semibold text-[#0B2A4A] shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/90 transition-colors hover:bg-gray-50/80 lg:hidden"
      >
        <SlidersHorizontal className="h-5 w-5 text-[#FF7A00]" aria-hidden />
        <span>{showFilters ? "Hide filters" : "Show filters"}</span>
      </button>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600 md:text-base">
          Showing{" "}
          <span className="font-bold tabular-nums text-[#0B2A4A]">{filteredProducts.length}</span>{" "}
          product{filteredProducts.length === 1 ? "" : "s"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF7A00] transition-colors hover:text-[#e86e00]"
          >
            <X className="h-4 w-4" aria-hidden />
            Clear filters
          </button>
        )}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl bg-gray-200/90 ring-1 ring-gray-100"
            />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {productsOnPage.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-10 rounded-2xl bg-white px-4 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/90 sm:px-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
                startItem={startItem}
                endItem={endItem}
                totalItems={filteredProducts.length}
              />
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/90">
          <Filter className="mx-auto mb-4 h-14 w-14 text-gray-300" aria-hidden />
          <h3 className="text-lg font-bold tracking-tight text-[#0B2A4A] md:text-xl">No products found</h3>
          <p className="mt-2 text-sm text-gray-600">Try adjusting search, category, or price range.</p>
        </div>
      )}
    </div>
  );
}

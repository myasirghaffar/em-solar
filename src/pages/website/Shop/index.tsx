import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { ShopHeader, FiltersSidebar, ProductGrid } from "./features";

const categories = ["Solar Panels", "Solar Inverters", "Batteries", "Accessories"];
const SHOP_PAGE_SIZE = 9;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, priceRange.min, priceRange.max, searchTerm]);

  useEffect(() => {
    (async () => {
      try {
        const { fetchProducts } = await import("../../../lib/api");
        const { withStoreProductFallback } = await import(
          "../../../data/dummyProducts"
        );
        const data = await fetchProducts();
        setProducts(withStoreProductFallback(data));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (selectedCategory) filtered = filtered.filter((p) => p.category === selectedCategory);
    if (priceRange.min) filtered = filtered.filter((p) => p.price >= parseFloat(priceRange.min));
    if (priceRange.max) filtered = filtered.filter((p) => p.price <= parseFloat(priceRange.max));
    if (searchTerm) filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, searchTerm]);

  const totalPages =
    filteredProducts.length === 0 ? 0 : Math.ceil(filteredProducts.length / SHOP_PAGE_SIZE);

  useEffect(() => {
    if (totalPages === 0) return;
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  const paginatedProducts = useMemo(() => {
    if (filteredProducts.length === 0) return [];
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * SHOP_PAGE_SIZE;
    return filteredProducts.slice(start, start + SHOP_PAGE_SIZE);
  }, [filteredProducts, page, totalPages]);

  const clearFilters = () => {
    setSelectedCategory("");
    setPriceRange({ min: "", max: "" });
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ShopHeader />
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
          <div className={showFilters ? "block" : "hidden lg:block"}>
            <FiltersSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              clearFilters={clearFilters}
              showFilters={showFilters}
            />
          </div>
          <ProductGrid
            loading={loading}
            filteredProducts={filteredProducts}
            productsOnPage={paginatedProducts}
            page={page}
            pageSize={SHOP_PAGE_SIZE}
            totalPages={totalPages}
            onPageChange={setPage}
            selectedCategory={selectedCategory}
            priceRange={priceRange}
            searchTerm={searchTerm}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            clearFilters={clearFilters}
            onAddToCart={addToCart}
          />
        </div>
      </div>
    </div>
  );
}

import { useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../../../components/store/ProductCard";
import { useCart } from "../../../../context/CartContext";

interface FeaturedProductsProps {
  products: any[];
  loading: boolean;
}

const CARD_WIDTH = 280;
const GAP = 24;
const SCROLL_AMOUNT = CARD_WIDTH + GAP;

export function FeaturedProducts({ products, loading }: FeaturedProductsProps) {
  const { addToCart } = useCart();
  const carouselRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  const singleSetWidth =
    products.length > 0 ? products.length * SCROLL_AMOUNT - GAP : 0;
  const jumpThreshold = 50;

  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el || products.length < 2 || isScrollingRef.current) return;

    const { scrollLeft } = el;

    if (scrollLeft >= 2 * singleSetWidth - jumpThreshold) {
      isScrollingRef.current = true;
      el.scrollLeft = scrollLeft - singleSetWidth;
      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    } else if (scrollLeft <= jumpThreshold) {
      isScrollingRef.current = true;
      el.scrollLeft = (products.length - 1) * SCROLL_AMOUNT;
      requestAnimationFrame(() => {
        isScrollingRef.current = false;
      });
    }
  }, [products.length, singleSetWidth]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || products.length < 2) return;
    el.scrollLeft = singleSetWidth;
  }, [products.length, singleSetWidth]);

  const scroll = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    carouselRef.current.scrollBy({
      left: dir === "right" ? SCROLL_AMOUNT : -SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  const infiniteProducts =
    products.length > 1 ? [...products, ...products, ...products] : products;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Top-rated solar products from trusted brands
          </p>
        </div>

        <div className="scroll-reveal relative group px-12 md:px-14">
          <button
            onClick={() => scroll("left")}
            aria-label="Previous products"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#0B2A4A] hover:bg-[#FF7A00] hover:text-white hover:border-[#FF7A00] transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            aria-label="Next products"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-[#0B2A4A] hover:bg-[#FF7A00] hover:text-white hover:border-[#FF7A00] transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {loading ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-[280px] h-80 bg-gray-200 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="featured-products-carousel flex gap-6 overflow-x-auto overflow-y-hidden pb-2 scroll-smooth snap-x snap-mandatory"
            >
              {infiniteProducts.map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="flex-shrink-0 w-[280px] h-[480px] snap-start"
                >
                  <ProductCard product={product} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-10 scroll-reveal">
          <Link to="/shop">
            <button className="bg-[#0B2A4A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0B2A4A]/90 transition-all hover:scale-105">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

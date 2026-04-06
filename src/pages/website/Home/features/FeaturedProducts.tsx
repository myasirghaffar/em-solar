import { useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedProductsProps {
  products: any[];
  loading: boolean;
}

/** Matches reference: ~312.391px slide + 20px margin */
const SLIDE_WIDTH = 312;
const SLIDE_GAP = 20;
const SLIDE_STEP = SLIDE_WIDTH + SLIDE_GAP;
/** Wider threshold so smooth arrow scroll still triggers loop reset */
const LOOP_JUMP_THRESHOLD = 120;
const CARD_HEIGHT = 460;

function productImageUrl(product: any): string {
  const first = product?.images?.[0];
  if (!first) return "/placeholder-product.jpg";
  return typeof first === "string" ? first : String(first);
}

export function FeaturedProducts({ products, loading }: FeaturedProductsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const jumpLockRef = useRef(false);

  const count = products.length;
  const setWidth = count > 0 ? count * SLIDE_STEP - SLIDE_GAP : 0;

  const handleScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el || count < 2 || jumpLockRef.current || setWidth <= 0) return;

    const { scrollLeft } = el;

    if (scrollLeft >= 2 * setWidth - LOOP_JUMP_THRESHOLD) {
      jumpLockRef.current = true;
      el.scrollLeft = scrollLeft - setWidth;
      requestAnimationFrame(() => {
        jumpLockRef.current = false;
      });
    } else if (scrollLeft <= LOOP_JUMP_THRESHOLD) {
      jumpLockRef.current = true;
      el.scrollLeft = scrollLeft + setWidth;
      requestAnimationFrame(() => {
        jumpLockRef.current = false;
      });
    }
  }, [count, setWidth]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || count < 2) return;
    requestAnimationFrame(() => {
      el.scrollLeft = setWidth;
    });
  }, [count, setWidth]);

  const scrollPrev = () => {
    trackRef.current?.scrollBy({ left: -SLIDE_STEP, behavior: "smooth" });
  };

  const scrollNext = () => {
    trackRef.current?.scrollBy({ left: SLIDE_STEP, behavior: "smooth" });
  };

  const loopSlides =
    count > 1 ? [...products, ...products, ...products] : products;

  return (
    <section className="scroll-reveal bg-[#0B2A4A] text-white py-20">
      {/* Header row — mirrors .wp + .hd */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between gap-4 pb-6 md:pb-8">
          <h2 className="text-[clamp(1.75rem,2.5vw,2.5rem)] font-bold tracking-tight text-white uppercase">
            Products
          </h2>
          <div
            className="flex items-center gap-3 shrink-0 arrow-product"
            role="group"
            aria-label="Product carousel controls"
          >
            <button
              type="button"
              id="swiper-pro-prev"
              onClick={scrollPrev}
              aria-label="Previous slide"
              className="swiper-circle-arrow flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white text-[#070e18] shadow-sm transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ChevronLeft
                className="h-5 w-5 md:h-6 md:w-6"
                strokeWidth={2.2}
              />
            </button>
            <button
              type="button"
              id="swiper-pro-next"
              onClick={scrollNext}
              aria-label="Next slide"
              className="swiper-circle-arrow flex h-11 w-11 md:h-12 md:w-12 items-center justify-center rounded-full bg-white text-[#070e18] shadow-sm transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <ChevronRight
                className="h-5 w-5 md:h-6 md:w-6"
                strokeWidth={2.2}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Track — mirrors .wp-offset padding-left: 171px (responsive) */}
      <div className="pl-6 sm:pl-10 md:pl-16 lg:pl-[171px] overflow-hidden">
        {loading ? (
          <div className="flex gap-5 overflow-hidden pr-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[312px] rounded-sm bg-white/5 animate-pulse"
                style={{ height: CARD_HEIGHT }}
              />
            ))}
          </div>
        ) : count === 0 ? (
          <p className="text-white/60 px-4 py-8">No products to show.</p>
        ) : (
          <div
            ref={trackRef}
            id="swiper-pro"
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured products"
            onScroll={handleScroll}
            className="featured-products-carousel flex overflow-x-auto overflow-y-hidden"
          >
            {loopSlides.map((product, idx) => (
              <div
                key={`${product.id}-${idx}`}
                className="swiper-slide flex-shrink-0 mr-5 last:mr-0"
                style={{ width: SLIDE_WIDTH }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${idx + 1} of ${loopSlides.length}`}
              >
                <div className="item h-full">
                  <div className="txt h-full">
                    <Link
                      to={`/product/${product.id}`}
                      className="pad img-hover group relative block overflow-hidden rounded-sm bg-[#0a1524] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                      style={{ height: CARD_HEIGHT }}
                    >
                      <div
                        className="img absolute inset-0 bg-center bg-cover bg-no-repeat transition-transform duration-500 ease-out group-hover:scale-[1.5]"
                        style={{
                          backgroundImage: `url(${productImageUrl(product)})`,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
                      <div className="relative z-10 flex h-full flex-col p-6">
                        <h4 className="text-lg md:text-xl font-semibold leading-snug text-white line-clamp-3">
                          {product.name}
                        </h4>
                        <span className="more-link mt-5 inline-flex items-center gap-2 text-sm text-white">
                          <em className="not-italic font-medium underline underline-offset-4 decoration-white/80 group-hover:decoration-white">
                            Discover
                          </em>
                          <ChevronRight
                            className="h-5 w-5 rounded-full p-1 bg-white/20 text-white transition-all group-hover:translate-x-0.5 group-hover:bg-[#FF7A00]"
                            strokeWidth={2}
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 mt-10 text-center">
        <Link to="/shop">
          <span className="inline-flex items-center justify-center rounded-sm border border-white/25 bg-transparent px-8 py-3 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/5">
            View all products
          </span>
        </Link>
      </div>
    </section>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid } from "lucide-react";
import {
  STORE_CATEGORIES,
  categoryShopHref,
  resolveStoreCategories,
  type StoreCategory,
} from "../../../../data/storeCategories";
import { fetchProductCategories } from "../../../../lib/api";

const GAP_PX = 8;

function useVisibleCount() {
  const [count, setCount] = useState(6);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 480px)");
    const update = () => setCount(mq.matches ? 6 : 4);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return count;
}

function CategoryIconItem({
  category,
  width,
}: {
  category: StoreCategory;
  width: number;
}) {
  const Icon = category.icon;
  const label = category.shortName ?? category.name;

  return (
    <Link
      to={categoryShopHref(category.slug)}
      className="group flex shrink-0 snap-start flex-col items-center gap-2.5 py-1"
      style={{ width: width > 0 ? width : undefined }}
    >
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-visible sm:h-16 sm:w-16">
        <span
          className={`absolute h-12 w-12 rounded-full sm:h-14 sm:w-14 ${category.accentClass} transition-transform duration-300 group-hover:scale-105`}
          aria-hidden
        />
        <Icon
          className="relative z-10 h-7 w-7 text-[#0B2A4A] transition-colors group-hover:text-[#FF7A00] sm:h-8 sm:w-8"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
      <span className="w-full px-0.5 text-center text-[11px] font-medium leading-tight text-[#0B2A4A] sm:text-xs">
        {label}
      </span>
    </Link>
  );
}

function MoreCategoryItem({ width }: { width: number }) {
  return (
    <Link
      to="/categories"
      className="group flex shrink-0 snap-start flex-col items-center gap-2.5 py-1"
      style={{ width: width > 0 ? width : undefined }}
    >
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-visible sm:h-16 sm:w-16">
        <span
          className="absolute h-12 w-12 rounded-full bg-slate-200/80 transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14"
          aria-hidden
        />
        <LayoutGrid
          className="relative z-10 h-7 w-7 text-[#0B2A4A] transition-colors group-hover:text-[#FF7A00] sm:h-8 sm:w-8"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
      <span className="w-full text-center text-[11px] font-medium leading-tight text-[#0B2A4A] sm:text-xs">
        More
      </span>
    </Link>
  );
}

export function CategoriesSection() {
  const [categories, setCategories] = useState<StoreCategory[]>(STORE_CATEGORIES);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [itemWidth, setItemWidth] = useState(0);
  const visibleCount = useVisibleCount();

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchProductCategories();
        setCategories(resolveStoreCategories(data));
      } catch {
        setCategories(STORE_CATEGORIES);
      }
    })();
  }, []);

  const updateLayout = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const gaps = GAP_PX * (visibleCount - 1);
    setItemWidth(Math.max(0, (viewport.clientWidth - gaps) / visibleCount));
  }, [visibleCount]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    updateLayout();
    const ro = new ResizeObserver(updateLayout);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [categories.length, updateLayout]);

  return (
    <section
      id="categories"
      className="relative z-20 -mt-6 flex items-center bg-gradient-to-b from-white from-50% to-[#0B2A4A] to-50% py-8 sm:-mt-8 sm:py-10"
      aria-label="Shop by category"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="overflow-visible rounded-2xl border border-gray-200/90 bg-white px-3 py-5 shadow-[0_8px_32px_rgba(11,42,74,0.12)] sm:px-4 sm:py-6 md:px-5">
          <div
            ref={viewportRef}
            className="categories-carousel -mx-1 overflow-x-auto overflow-y-visible px-1"
            role="region"
            aria-roledescription="carousel"
            aria-label="Product categories"
          >
            <div
              className="flex w-max min-w-full snap-x snap-mandatory scroll-smooth py-0.5"
              style={{ gap: GAP_PX }}
            >
              {categories.map((category) => (
                <CategoryIconItem
                  key={category.slug}
                  category={category}
                  width={itemWidth}
                />
              ))}
              <MoreCategoryItem width={itemWidth} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

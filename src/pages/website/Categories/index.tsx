import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  categoryShopHref,
  resolveStoreCategories,
  type StoreCategory,
} from "../../../data/storeCategories";
import { fetchProductCategories } from "../../../lib/api";
import { HeroSection } from "./features";

export default function Categories() {
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchProductCategories();
        setCategories(resolveStoreCategories(data));
      } catch {
        setCategories(resolveStoreCategories(null));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />

      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF7A00] hover:underline mb-10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-h-[280px] animate-pulse rounded-xl bg-slate-200/80"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Link
                    key={category.name}
                    to={categoryShopHref(category.slug)}
                    className="group scroll-reveal"
                    data-aos="fade-up"
                    data-aos-delay={index * 60}
                  >
                    <article className="flex h-full min-h-[280px] flex-col rounded-xl border-2 border-transparent bg-white p-8 text-center shadow-md transition-all duration-300 hover:border-[#FF7A00] hover:shadow-xl">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#FF7A00]/10 transition-colors group-hover:bg-[#FF7A00]">
                        <Icon className="h-10 w-10 text-[#FF7A00] transition-colors group-hover:text-white" />
                      </div>
                      <h2 className="mb-2 text-xl font-semibold text-[#0B2A4A]">
                        {category.name}
                      </h2>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                      <span className="mt-auto pt-6 text-sm font-semibold text-[#FF7A00] group-hover:underline">
                        Browse products →
                      </span>
                    </article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

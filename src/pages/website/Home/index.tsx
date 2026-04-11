import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  HeroSection,
  AboutSection,
  CategoriesSection,
  FeaturedProducts,
  StatsSection,
  WhyChooseUs,
  TestimonialsSection,
  LatestNewsSection,
  TrustedBrandsSection,
  CompanyCultureSection,
  CTASection,
} from "./features";

export default function Home() {
  const { pathname, hash } = useLocation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    installations: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const { fetchProducts } = await import("../../../lib/api");
        const { withStoreProductFallback } =
          await import("../../../data/dummyProducts");
        const data = await fetchProducts();
        const list = withStoreProductFallback(data);
        setProducts(list.slice(0, 8));
        setStats({
          products: (data.length > 0 ? data.length : 0) + 5000,
          customers: 1200,
          installations: 350,
        });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (pathname !== "/" || hash !== "#categories") return;
    const scroll = () =>
      document.getElementById("categories")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    scroll();
    const t = window.setTimeout(scroll, 80);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <CategoriesSection />
      <FeaturedProducts products={products} loading={loading} />

      <WhyChooseUs />
      <TestimonialsSection />

      <TrustedBrandsSection />
      <StatsSection
        products={stats.products}
        customers={stats.customers}
        installations={stats.installations}
      />

      <CompanyCultureSection />

      <LatestNewsSection />
      <CTASection />
    </>
  );
}

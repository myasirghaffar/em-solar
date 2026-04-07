import { useEffect, useState } from "react";
import {
  HeroSection,
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

  return (
    <>
      <HeroSection />
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

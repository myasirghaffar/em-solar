import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  HeroSection,
  CategoriesSection,
  FeaturedProducts,
  StatsSection,
  WhyChooseUs,
  TestimonialsSection,
  TrustedBrandsSection,
  CTASection,
} from "./features";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, customers: 0, installations: 0 });

  useEffect(() => {
    (async () => {
      try {
        const { fetchProducts } = await import("../../../lib/api");
        const data = await fetchProducts();
        setProducts(data.slice(0, 8));
        setStats({ products: data.length + 5000, customers: 1200, installations: 350 });
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.timeline({ defaults: { ease: "power2.out", overwrite: "auto" } })
          .fromTo(".hero-title", { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 })
          .fromTo(".hero-subtitle", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
          .fromTo(".hero-cta", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, "-=0.5");
      }
      gsap.set(".scroll-reveal", { y: 36 });
      ScrollTrigger.batch(".scroll-reveal", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: { each: 0.08, from: "start" },
            ease: "power2.out",
            overwrite: true,
          }),
      });
      if (statsRef.current) {
        gsap.fromTo(
          ".stat-number",
          { scale: 0.92, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: { trigger: statsRef.current, start: "top 85%", toggleActions: "play none none none" },
          }
        );
      }
    });
    return () => ctx.revert();
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <>
      <div ref={heroRef}>
        <HeroSection />
      </div>
      <CategoriesSection />
      <FeaturedProducts products={products} loading={loading} />
      <div ref={statsRef}>
        <StatsSection products={stats.products} customers={stats.customers} installations={stats.installations} />
      </div>
      <WhyChooseUs />
      <TestimonialsSection />
      <TrustedBrandsSection />
      <CTASection />
    </>
  );
}

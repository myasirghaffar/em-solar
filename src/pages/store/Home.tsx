import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Zap,
  Shield,
  Truck,
  Award,
  ArrowRight,
  Sun,
  PanelTop,
  Battery,
  Plug,
  Quote,
  Star,
} from "lucide-react";
import ProductCard from "../../components/store/ProductCard";
import { useCart } from "../../context/CartContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  {
    name: "Solar Panels",
    slug: "Solar Panels",
    icon: PanelTop,
    description: "High-efficiency solar panels for maximum energy generation",
  },
  {
    name: "Solar Inverters",
    slug: "Solar Inverters",
    icon: Plug,
    description: "Reliable inverters for seamless power conversion",
  },
  {
    name: "Batteries",
    slug: "Batteries",
    icon: Battery,
    description: "Long-lasting batteries for energy storage",
  },
  {
    name: "Accessories",
    slug: "Accessories",
    icon: Zap,
    description: "Complete range of solar accessories and mounting systems",
  },
];

const features = [
  {
    icon: Zap,
    title: "High Efficiency",
    description: "Premium solar products with up to 22% efficiency",
  },
  {
    icon: Shield,
    title: "Certified Equipment",
    description: "All products are certified and warranty-backed",
  },
  {
    icon: Award,
    title: "Warranty Support",
    description: "Comprehensive warranty on all products",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick delivery across Pakistan",
  },
];

const testimonials = [
  {
    name: "Ahmed Khan",
    location: "Lahore",
    text: "Excellent quality solar panels. The team was very helpful in choosing the right system for my home.",
    rating: 5,
  },
  {
    name: "Sara Ali",
    location: "Karachi",
    text: "Best prices in Pakistan! Got my complete solar system installed within a week.",
    rating: 5,
  },
  {
    name: "Muhammad Hassan",
    location: "Islamabad",
    text: "Professional service and genuine products. Highly recommended for solar solutions.",
    rating: 5,
  },
];

const brands = [
  "Longi",
  "Jinko",
  "Trina",
  "Canadian",
  "Huawei",
  "Growatt",
  "Tesla",
  "LG",
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentBrand, setCurrentBrand] = useState(0);
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    installations: 0,
  });
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.slice(0, 8));
      setStats({
        products: data.length + 5000,
        customers: 1200,
        installations: 350,
      });
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // GSAP Animations - use fromTo and proper ScrollTrigger config so content displays correctly
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations - stagger entrance (hero elements animate in on load)
      if (heroRef.current) {
        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl
          .fromTo(
            ".hero-title",
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
          )
          .fromTo(
            ".hero-subtitle",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9 },
            "-=0.7",
          )
          .fromTo(
            ".hero-cta",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.15 },
            "-=0.5",
          );
      }

      // Scroll reveal - animate in when scrolled into view; use clearProps to avoid stuck states
      gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((elem) => {
        gsap.fromTo(
          elem,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: elem,
              start: "top 90%",
              toggleActions: "play none none none",
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // Stats section animation - scale and fade in on scroll
      if (statsRef.current) {
        gsap.fromTo(
          ".stat-number",
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, [loading]);

  // Refresh ScrollTrigger when content loads (products) to recalc positions
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => ScrollTrigger.refresh(), 100);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, []);

  useEffect(() => {
    const brandInterval = setInterval(() => {
      setCurrentBrand((prev) => (prev + 1) % brands.length);
    }, 3000);
    return () => clearInterval(brandInterval);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-br from-[#0B2A4A] via-[#0d3560] to-[#0B2A4A] text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#FF7A00] rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400 rounded-full blur-3xl" />
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 right-20 hidden lg:block"
        >
          <Sun className="w-32 h-32 text-[#FF7A00]/20" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-20 hidden lg:block"
        >
          <PanelTop className="w-24 h-24 text-[#FF7A00]/10" />
        </motion.div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Power Your Future with{" "}
              <span className="text-[#FF7A00]">Solar Energy</span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-8">
              Premium solar products at competitive prices. Join thousands of
              Pakistanis saving money and going green.
            </p>
            <div className="hero-cta flex flex-col sm:flex-row gap-4">
              <Link to="/shop">
                <button className="bg-[#FF7A00] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#FF7A00]/90 transition-all hover:scale-105 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Shop Now
                </button>
              </Link>
              <a href="#consultation">
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#0B2A4A] transition-all hover:scale-105 flex items-center justify-center">
                  Get Solar Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect solar products for your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.name}
                  to={`/shop?category=${encodeURIComponent(category.slug)}`}
                  className="scroll-reveal group"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 text-center group-hover:border-[#FF7A00] border-2 border-transparent"
                  >
                    <div className="w-16 h-16 bg-[#FF7A00]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#FF7A00] transition-colors">
                      <Icon className="w-8 h-8 text-[#FF7A00] group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#0B2A4A] mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.description}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-xl h-80 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
          <div className="text-center mt-10 scroll-reveal">
            <Link to="/shop">
              <button className="bg-[#0B2A4A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0B2A4A]/90 transition-all hover:scale-105">
                View All Products
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">
              Why Choose EnergyMart?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best solar solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="scroll-reveal text-center"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-20 h-20 bg-[#FF7A00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-10 h-10 text-[#FF7A00]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#0B2A4A] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section ref={statsRef} className="py-20 bg-[#0B2A4A] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center scroll-reveal">
              <p className="stat-number text-5xl md:text-6xl font-bold text-[#FF7A00] mb-2">
                {stats.products.toLocaleString()}+
              </p>
              <p className="text-xl text-gray-300">Products Sold</p>
            </div>
            <div className="text-center scroll-reveal">
              <p className="stat-number text-5xl md:text-6xl font-bold text-[#FF7A00] mb-2">
                {stats.customers.toLocaleString()}+
              </p>
              <p className="text-xl text-gray-300">Happy Customers</p>
            </div>
            <div className="text-center scroll-reveal">
              <p className="stat-number text-5xl md:text-6xl font-bold text-[#FF7A00] mb-2">
                {stats.installations.toLocaleString()}+
              </p>
              <p className="text-xl text-gray-300">Installations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real reviews from satisfied customers
            </p>
          </div>
          <div className="max-w-3xl mx-auto scroll-reveal">
            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg relative">
              <Quote className="absolute top-4 left-4 w-12 h-12 text-[#FF7A00]/20" />
              <p className="text-xl text-gray-700 mb-6 italic relative z-10">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-[#0B2A4A]">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-gray-500">
                    {testimonials[currentTestimonial].location}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonials[currentTestimonial].rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-3 h-3 rounded-full transition-colors ${i === currentTestimonial ? "bg-[#FF7A00]" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">
              Trusted Brands
            </h2>
            <p className="text-gray-600">
              We partner with the world's leading solar manufacturers
            </p>
          </div>
          <div className="max-w-4xl mx-auto scroll-reveal">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center justify-center h-20">
                <motion.div
                  key={currentBrand}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-3xl font-bold text-[#0B2A4A]"
                >
                  {brands[currentBrand]}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="consultation"
        className="py-20 bg-gradient-to-r from-[#FF7A00] to-[#ff9429] text-white"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Go Solar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get a free consultation and find the best solar solution for your
              home or business
            </p>
            <ConsultationForm />
          </div>
        </div>
      </section>
    </>
  );
}

function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    monthly_bill: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        city: "",
        monthly_bill: "",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
        <p className="text-xl font-semibold">
          Thank you! We'll contact you soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/20 backdrop-blur-sm rounded-xl p-6 md:p-8 text-left"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          className="px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
          className="px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
        <input
          type="text"
          placeholder="Monthly Electricity Bill (PKR)"
          value={formData.monthly_bill}
          onChange={(e) =>
            setFormData({ ...formData, monthly_bill: e.target.value })
          }
          className="px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows={3}
        className="w-full px-4 py-3 rounded-lg bg-white/90 text-[#0B2A4A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white mb-4"
      />
      <button
        type="submit"
        className="w-full bg-[#0B2A4A] text-white py-3 rounded-lg font-semibold hover:bg-[#0B2A4A]/90 transition-colors"
      >
        Request Consultation
      </button>
    </form>
  );
}

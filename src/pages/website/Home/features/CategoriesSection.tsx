import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PanelTop, Plug, Battery, Zap } from "lucide-react";

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

export function CategoriesSection() {
  return (
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
                  className="bg-white p-8 rounded-xl min-h-[250px] shadow-md hover:shadow-xl transition-all duration-300 text-center group-hover:border-[#FF7A00] border-2 border-transparent"
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
  );
}

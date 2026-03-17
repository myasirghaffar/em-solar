import { motion } from "framer-motion";
import { Sun, Users, Award } from "lucide-react";

const stats = [
  { icon: Sun, value: "5000+", label: "Products Sold" },
  { icon: Users, value: "1200+", label: "Happy Customers" },
  { icon: Award, value: "350+", label: "Installations" },
];

export function OurStorySection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0B2A4A] mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">Founded with a vision to make solar energy accessible to every Pakistani household and business, EnergyMart.pk has grown into Pakistan's most trusted solar e-commerce platform.</p>
            <p className="text-lg text-gray-600 leading-relaxed">Our team of solar experts brings together years of experience in the renewable energy sector, ensuring that every customer receives personalized solutions tailored to their specific energy needs.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-white rounded-xl shadow-md p-8 text-center">
                <Icon className="w-12 h-12 text-[#FF7A00] mx-auto mb-4" />
                <p className="text-4xl font-bold text-[#0B2A4A] mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

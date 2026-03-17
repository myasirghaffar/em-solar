import { motion } from "framer-motion";
import { Target, Sun } from "lucide-react";

export function MissionVisionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="bg-[#0B2A4A] text-white rounded-2xl p-8">
              <Target className="w-12 h-12 text-[#FF7A00] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">To accelerate Pakistan's transition to clean energy by providing high-quality solar products at competitive prices, backed by expert consultation and reliable after-sales support.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="bg-[#FF7A00] text-white rounded-2xl p-8">
              <Sun className="w-12 h-12 text-white mb-4" />
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="leading-relaxed">To become Pakistan's most trusted and innovative solar energy platform, leading the way in renewable energy solutions.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

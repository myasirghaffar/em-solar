import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="bg-[#0B2A4A] text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About <span className="text-[#FF7A00]">EnergyMart.pk</span></h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Pakistan's leading solar energy e-commerce platform, empowering homes and businesses with clean, renewable energy solutions.</p>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="bg-[#0B2A4A] text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Sun, Zap, Shield, Award, Users, Target, Leaf } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#0B2A4A] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="text-[#FF7A00]">EnergyMart.pk</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Pakistan's leading solar energy e-commerce platform, empowering homes and businesses with clean, renewable energy solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-[#0B2A4A] mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Founded with a vision to make solar energy accessible to every Pakistani household and business, EnergyMart.pk has grown into 
                Pakistan's most trusted solar e-commerce platform. We believe that clean, renewable energy should be affordable, 
                reliable, and easy to access for everyone.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our team of solar experts brings together years of experience in the renewable energy sector, ensuring that every 
                customer receives personalized solutions tailored to their specific energy needs. From small residential installations to large 
                commercial projects, we've successfully delivered thousands of solar systems across Pakistan.
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {[
                { icon: Sun, value: '5000+', label: 'Products Sold' },
                { icon: Users, value: '1200+', label: 'Happy Customers' },
                { icon: Award, value: '350+', label: 'Installations' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-8 text-center"
                >
                  <stat.icon className="w-12 h-12 text-[#FF7A00] mx-auto mb-4" />
                  <p className="text-4xl font-bold text-[#0B2A4A] mb-2">{stat.value}</p>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#0B2A4A] text-white rounded-2xl p-8">
                <Target className="w-12 h-12 text-[#FF7A00] mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  To accelerate Pakistan's transition to clean energy by providing high-quality solar products at 
                  competitive prices, backed by expert consultation and reliable after-sales support. We're committed to making 
                  sustainable living accessible and affordable for everyone.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#FF7A00] text-white rounded-2xl p-8">
                <Sun className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="leading-relaxed">
                  To become Pakistan's most trusted and innovative solar energy platform, leading the way in renewable 
                  energy solutions and empowering millions of homes and businesses to achieve energy independence while contributing 
                  to a greener, more sustainable future.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-[#0B2A4A] mb-4">Why Choose EnergyMart.pk?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best solar solutions with unmatched quality and service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: 'High Quality', description: 'Premium products from top global brands' },
              { icon: Shield, title: 'Certified Equipment', description: 'All products certified and warranty-backed' },
              { icon: Award, title: 'Expert Support', description: 'Professional consultation and installation guidance' },
              { icon: Leaf, title: 'Sustainable', description: 'Contributing to a greener Pakistan' }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-[#FF7A00] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#0B2A4A] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF7A00] to-[#ff9429] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Go Solar?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of Pakistanis who have already made the switch to clean, renewable energy
            </p>
            <a
              href="/shop"
              className="inline-block bg-white text-[#FF7A00] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Browse Products
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

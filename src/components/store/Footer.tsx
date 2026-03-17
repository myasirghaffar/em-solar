import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0B2A4A] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Sun className="w-8 h-8 text-[#FF7A00]" />
              <span className="text-xl font-bold">EnergyMart<span className="text-[#FF7A00]">.pk</span></span>
            </div>
            <p className="text-gray-300 mb-4">
              Pakistan's leading solar energy e-commerce platform. Quality products, expert consultation, and reliable service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#FF7A00] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#FF7A00] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#FF7A00] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-[#FF7A00] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-gray-300 hover:text-[#FF7A00] transition-colors">Shop All Products</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-[#FF7A00] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-[#FF7A00] transition-colors">Contact Us</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-[#FF7A00] transition-colors">Login</Link></li>
              <li><Link to="/admin" className="text-gray-300 hover:text-[#FF7A00] transition-colors">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#FF7A00] mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Solar Street, Lahore, Pakistan</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#FF7A00] flex-shrink-0" />
                <span className="text-gray-300">+92 300 1234567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#FF7A00] flex-shrink-0" />
                <span className="text-gray-300">info@energymart.pk</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe for latest updates and offers.</p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-[#FF7A00]"
              />
              <button
                type="submit"
                className="w-full bg-[#FF7A00] text-white py-2 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2024 EnergyMart.pk. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/login" className="text-gray-400 hover:text-[#FF7A00] text-sm transition-colors">Login</Link>
            <a href="#" className="text-gray-400 hover:text-[#FF7A00] text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[#FF7A00] text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-[#FF7A00] text-sm transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
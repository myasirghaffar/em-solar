import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { STORE_GOOGLE_MAPS_URL } from '../../constants/storeMapsUrl';
import { SOCIAL_LINKS } from '../../constants/socialLinks';

export default function Footer() {
  const { isAuthenticated, isAdmin } = useAuth();
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
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-[#FF7A00]"
                aria-label="EnergyMart on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-[#FF7A00]"
                aria-label="EnergyMart on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-[#FF7A00]"
                aria-label="EnergyMart on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
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
              {!isAuthenticated && (
                <li><Link to="/login" className="text-gray-300 hover:text-[#FF7A00] transition-colors">Login</Link></li>
              )}
              {isAuthenticated && isAdmin && (
                <li><Link to="/admin" className="text-gray-300 hover:text-[#FF7A00] transition-colors">Dashboard</Link></li>
              )}
              {isAuthenticated && !isAdmin && (
                <li><Link to="/profile" className="text-gray-300 hover:text-[#FF7A00] transition-colors">My account</Link></li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#FF7A00]" aria-hidden />
                <a
                  href={STORE_GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 transition-colors hover:text-[#FF7A00]"
                >
                  Shop 64, Lalazar Commercial Market, Raiwind
                  <br />
                  Road - Lahore
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#FF7A00]" aria-hidden />
                <div className="text-gray-300">
                  <p className="text-sm text-gray-400">Open a chat or give us a call</p>
                  <a href="tel:+923014756516" className="mt-0.5 inline-block hover:text-[#FF7A00] transition-colors">
                    +92 301 4756516
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#FF7A00]" aria-hidden />
                <div className="text-gray-300">
                  <p className="text-sm text-gray-400">Send mail to</p>
                  <a href="mailto:info@energymart.pk" className="mt-0.5 inline-block hover:text-[#FF7A00] transition-colors">
                    info@energymart.pk
                  </a>
                </div>
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
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Sun, Menu, X, LogIn, LayoutDashboard, LogOut, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ cartCount }: { cartCount: number }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  return (
    <header
      className={[
        'sticky top-0 z-50',
        isHome ? (scrolled ? 'bg-white/80 backdrop-blur-md' : 'bg-transparent') : 'bg-white/80 backdrop-blur-md',
      ].join(' ')}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sun className="w-8 h-8 text-[#FF7A00]" />
            <span className="text-xl font-extrabold text-[#0B2A4A]">EnergyMart<span className="text-[#FF7A00]">.pk</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white rounded-full px-3 py-2 shadow-[0_18px_60px_rgba(11,42,74,0.10)]">
            {[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'Shop' },
              { to: '/#categories', label: 'Categories' },
              { to: '/about', label: 'About' },
              { to: '/contact', label: 'Contact' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-2 rounded-full text-sm font-semibold text-[#0B2A4A] hover:bg-[#0B2A4A]/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Cart & Auth */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 rounded-full transition-colors group bg-white/80 border border-white shadow-sm hover:shadow-md">
              <ShoppingCart className="w-6 h-6 text-[#0B2A4A]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF7A00] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {/* Login / Dashboard / Logout - Desktop */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin"
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 rounded-full transition-colors font-semibold text-white shadow-sm"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full transition-colors bg-white/70 border border-white text-[#0B2A4A] hover:border-[#FF7A00]/40 hover:text-[#FF7A00]"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-full transition-colors bg-white/70 border border-white text-[#0B2A4A] hover:border-[#FF7A00]/40 hover:text-[#FF7A00] font-semibold"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Login</span>
                </Link>
                <a
                  href="/#consultation"
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-[#0B2A4A] hover:bg-[#0B2A4A]/90 rounded-full transition-colors font-semibold text-white"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </a>
              </>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full bg-white/80 border border-white text-[#0B2A4A]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-[0_18px_60px_rgba(11,42,74,0.10)] p-4">
                <div className="flex flex-col space-y-3">
                  <Link to="/" className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                  <Link to="/shop" className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
                  <Link to="/#categories" className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
                  <Link to="/about" className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5" onClick={() => setMobileMenuOpen(false)}>About</Link>
                  <Link to="/contact" className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
                </div>
              
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 rounded-full transition-colors font-semibold text-white"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={() => { logout(); setMobileMenuOpen(false); }}
                        className="flex items-center justify-center space-x-2 px-4 py-2 border border-[#FF7A00] rounded-full text-[#FF7A00] font-semibold"
                      >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#0B2A4A] hover:bg-[#0B2A4A]/90 rounded-full transition-colors font-semibold text-white"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Login</span>
                      </Link>
                      <a
                        href="/#consultation"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 rounded-full transition-colors font-semibold text-white"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-5 h-5" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

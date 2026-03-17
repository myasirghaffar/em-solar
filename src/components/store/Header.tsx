import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Header({ cartCount }: { cartCount: number }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-[#0B2A4A] text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Sun className="w-8 h-8 text-[#FF7A00]" />
            <span className="text-xl font-bold">EnergyMart<span className="text-[#FF7A00]">.pk</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-[#FF7A00] transition-colors">Home</Link>
            <Link to="/shop" className="hover:text-[#FF7A00] transition-colors">Shop</Link>
            <Link to="/#categories" className="hover:text-[#FF7A00] transition-colors">Categories</Link>
            <Link to="/about" className="hover:text-[#FF7A00] transition-colors">About</Link>
            <Link to="/contact" className="hover:text-[#FF7A00] transition-colors">Contact</Link>
          </nav>

          {/* Cart & Auth */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
              <ShoppingCart className="w-6 h-6" />
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
                  className="hidden md:flex items-center space-x-2 px-4 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 rounded-full transition-colors font-medium"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => logout()}
                  className="hidden md:flex items-center space-x-2 px-4 py-2 hover:bg-white/10 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 rounded-full transition-colors font-medium"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
              <Link to="/#categories" className="hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
              <Link to="/about" className="hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <Link to="/contact" className="hover:text-[#FF7A00] transition-colors" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
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
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 rounded-full transition-colors font-semibold text-white"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

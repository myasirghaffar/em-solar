import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  ArrowRight,
  UserCircle2,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";

export default function Header({ cartCount }: { cartCount: number }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, isSalesman } = useAuth();
  const { openCart, openFavoritesDrawer } = useCart();
  const { favoriteCount } = useFavorites();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const scrollToCategories = () => {
    if (location.pathname !== "/") return;
    window.requestAnimationFrame(() => {
      document.getElementById("categories")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };
  const [scrolled, setScrolled] = useState(false);

  const accountHref = isAdmin
    ? "/admin"
    : isSalesman
      ? "/salesman"
      : "/profile";
  const accountTitle = isAdmin
    ? "Dashboard"
    : isSalesman
      ? "Sales"
      : "My profile";

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <header
      className={[
        "sticky top-0 z-50",
        isHome
          ? scrolled
            ? "bg-white/80 backdrop-blur-md"
            : "bg-transparent"
          : "bg-white/80 backdrop-blur-md",
      ].join(" ")}
    >
      <div className="container mx-auto p-2">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label="EnergyMart.pk home"
          >
            <img
              src="/em-logo.png"
              alt="EnergyMart.pk"
              className="h-9 w-auto max-w-[min(100vw-8rem,280px)] object-contain object-left sm:h-16"
              decoding="async"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-md border border-orange-500/30 rounded-full px-3 py-2 shadow-[0_18px_60px_rgba(11,42,74,0.10)]">
            {[
              { to: "/", label: "Home" },
              { to: "/shop", label: "Shop" },
              { to: "/#categories", label: "Categories" },
              { to: "/news", label: "News" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={
                  item.to === "/#categories" ? scrollToCategories : undefined
                }
                className="px-4 py-2 rounded-full text-sm font-semibold text-[#0B2A4A] hover:bg-[#0B2A4A]/5 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to={accountHref}
                title={accountTitle}
                className="hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-[#0B2A4A] text-white hover:bg-[#0B2A4A]/90 transition-colors shadow-sm"
              >
                <span className="sr-only">{accountTitle}</span>
                <UserCircle2 className="w-6 h-6" />
              </Link>
            ) : (
              <Link
                to="/login"
                className="hidden md:flex items-center space-x-2 rounded-full bg-[#0B2A4A] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0B2A4A]/90"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}

            <button
              type="button"
              onClick={openCart}
              className="group relative rounded-full border border-white bg-white/80 p-2 shadow-sm transition-colors hover:shadow-md"
              aria-label="Open shopping cart"
            >
              <ShoppingCart className="h-6 w-6 text-[#0B2A4A]" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF7A00] text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={openFavoritesDrawer}
              className="group relative rounded-full border border-white bg-white/80 p-2 shadow-sm transition-colors hover:shadow-md"
              aria-label="Open saved items"
            >
              <Heart className="h-6 w-6 text-[#0B2A4A]" />
              {favoriteCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF7A00] text-xs font-bold text-white">
                  {favoriteCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2 rounded-full bg-white/80 border border-white text-[#0B2A4A]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white shadow-[0_18px_60px_rgba(11,42,74,0.10)] p-4">
                <div className="flex flex-col space-y-3">
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link
                    to="/shop"
                    className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Shop
                  </Link>
                  <Link
                    to="/#categories"
                    className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5"
                    onClick={() => {
                      scrollToCategories();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Categories
                  </Link>
                  <Link
                    to="/news"
                    className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    News
                  </Link>
                  <Link
                    to="/about"
                    className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="px-3 py-2 rounded-lg text-[#0B2A4A] font-semibold hover:bg-[#0B2A4A]/5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>

                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200 mt-4">
                  {isAuthenticated ? (
                    <Link
                      to={accountHref}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0B2A4A] hover:bg-[#0B2A4A]/90 rounded-full transition-colors font-semibold text-white"
                    >
                      <UserCircle2 className="w-5 h-5" />
                      <span>{isAdmin ? "Dashboard" : "My profile"}</span>
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 rounded-full bg-[#0B2A4A] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#0B2A4A]/90"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
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

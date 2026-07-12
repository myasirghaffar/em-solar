"use client";

import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import CartDrawer from "@/components/store/CartDrawer";
import ScrollToTop from "@/components/ScrollToTop";
import { AosRouteSync } from "@/components/AosRouteSync";
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import { useCart } from "@/context/CartContext";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const { cartCount } = useCart();

  return (
    <>
      <AosRouteSync />
      <ScrollToTop />
      <PwaInstallPrompt />
      <CartDrawer />
      <Header cartCount={cartCount} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}

"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toastInfo, toastSuccess } from "../lib/toast";

export type StoreDrawerTab = "cart" | "favorites";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: CartItem, quantity?: number) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  drawerTab: StoreDrawerTab;
  setDrawerTab: (tab: StoreDrawerTab) => void;
  openCart: () => void;
  openFavoritesDrawer: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "energymart-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<StoreDrawerTab>("cart");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) setCartItems(JSON.parse(saved) as CartItem[]);
    } catch {
      /* ignore */
    }
  }, []);

  const openCart = useCallback(() => {
    setDrawerTab("cart");
    setIsCartOpen(true);
  }, []);

  const openFavoritesDrawer = useCallback(() => {
    setDrawerTab("favorites");
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((v) => !v), []);

  const addToCart = useCallback((product: CartItem, quantity = 1) => {
    const q = Math.max(1, Math.floor(quantity));
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      const newCart = existing
        ? prev.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + q } : item,
          )
        : [...prev, { ...product, quantity: q }];
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });
    toastSuccess(
      q > 1 ? `Added ${q} × ${product.name} to cart` : `Added “${product.name}” to cart`,
    );
  }, []);

  const updateCartQuantity = useCallback((id: number, quantity: number) => {
    setCartItems((prev) => {
      const newCart =
        quantity === 0
          ? prev.filter((item) => item.id !== id)
          : prev.map((item) => (item.id === id ? { ...item, quantity } : item));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartItems((prev) => {
      const newCart = prev.filter((item) => item.id !== id);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      return newCart;
    });
    toastInfo("Removed from cart");
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        drawerTab,
        setDrawerTab,
        openCart,
        openFavoritesDrawer,
        closeCart,
        toggleCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

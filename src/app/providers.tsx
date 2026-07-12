"use client";

import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { CartProvider } from "@/context/CartContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3200}
            theme="colored"
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable={false}
            pauseOnHover
            limit={4}
            style={{ zIndex: 99999 }}
          />
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

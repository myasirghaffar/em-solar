import { createContext, useContext } from 'react';

interface CartContextType {
  cartItems: any[];
  addToCart: (product: any) => void;
  updateCartQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children, value }: any) => (
  <CartContext.Provider value={value}>{children}</CartContext.Provider>
);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
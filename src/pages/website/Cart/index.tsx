import { useCart } from "../../../context/CartContext";
import { CartEmpty, CartItems, OrderSummary } from "./features";

export default function Cart() {
  const { cartItems, updateCartQuantity, removeFromCart } = useCart();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + shipping;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  if (cartItems.length === 0) return <CartEmpty />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#0B2A4A] mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CartItems items={cartItems} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} />
          <OrderSummary subtotal={subtotal} shipping={shipping} total={total} itemCount={itemCount} />
        </div>
      </div>
    </div>
  );
}

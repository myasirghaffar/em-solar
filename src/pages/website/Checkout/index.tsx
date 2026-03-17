import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import { CheckoutEmpty, CheckoutForm, CheckoutOrderSummary } from "./features";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    notes: "",
    payment_method: "cod",
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...formData, products: cartItems, total_price: total }) });
      clearCart();
      navigate("/");
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return <CheckoutEmpty />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-[#0B2A4A] mb-8">Checkout</h1>
        <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CheckoutForm formData={formData} setFormData={setFormData} />
          <CheckoutOrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} total={total} loading={loading} />
        </form>
      </div>
    </div>
  );
}

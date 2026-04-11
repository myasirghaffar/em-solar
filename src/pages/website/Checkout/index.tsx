import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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
      const { createOrder } = await import("../../../lib/api");
      const ok = await createOrder({ ...formData, products: cartItems, total_price: total });
      if (!ok) throw new Error("createOrder failed");
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
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/shop"
            className="inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-[#FF7A00]"
          >
            <ArrowLeft className="mr-2 h-4 w-4 shrink-0" aria-hidden />
            Back to shop
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A00]">Secure checkout</span>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B2A4A] md:text-4xl">Checkout</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
            Enter your shipping details and choose how you would like to pay.
          </p>
        </div>
        <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          <CheckoutForm formData={formData} setFormData={setFormData} />
          <CheckoutOrderSummary cartItems={cartItems} subtotal={subtotal} shipping={shipping} total={total} loading={loading} />
        </form>
      </div>
    </div>
  );
}

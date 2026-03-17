import { Link } from "react-router-dom";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  images?: string[];
}

interface CheckoutOrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  loading: boolean;
}

export function CheckoutOrderSummary({ cartItems, subtotal, shipping, total, loading }: CheckoutOrderSummaryProps) {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
        <h2 className="text-xl font-bold text-[#0B2A4A] mb-6">Order Summary</h2>
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.quantity}`} className="flex space-x-4">
              <img src={item.images?.[0] || "/placeholder.jpg"} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              <div className="flex-1">
                <h4 className="font-medium text-[#0B2A4A] text-sm line-clamp-2">{item.name}</h4>
                <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-[#FF7A00]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="border-t pt-4 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-[#0B2A4A] border-t pt-3">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full mt-6 bg-[#FF7A00] text-white py-3 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Processing..." : "Place Order"}
        </button>
        <Link to="/cart" className="block mt-4 text-center text-[#0B2A4A] hover:text-[#FF7A00] transition-colors">← Back to Cart</Link>
      </div>
    </div>
  );
}

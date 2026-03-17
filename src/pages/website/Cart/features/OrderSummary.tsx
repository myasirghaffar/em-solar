import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

export function OrderSummary({ subtotal, shipping, total, itemCount }: OrderSummaryProps) {
  return (
    <div>
      <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
        <h2 className="text-xl font-bold text-[#0B2A4A] mb-6">Order Summary</h2>
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal ({itemCount} items)</span>
            <span>Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}</span>
          </div>
          {shipping === 0 && <p className="text-sm text-green-600">Free shipping on orders above Rs. 50,000</p>}
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold text-[#0B2A4A]">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <Link to="/checkout">
          <button className="w-full bg-[#FF7A00] text-white py-3 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors flex items-center justify-center space-x-2">
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
        <Link to="/shop" className="block mt-4 text-center text-[#0B2A4A] hover:text-[#FF7A00] transition-colors">Continue Shopping</Link>
      </div>
    </div>
  );
}

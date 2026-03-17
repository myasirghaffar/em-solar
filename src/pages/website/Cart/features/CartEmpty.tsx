import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function CartEmpty() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
        <Link to="/shop">
          <button className="bg-[#FF7A00] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors">Continue Shopping</button>
        </Link>
      </div>
    </div>
  );
}

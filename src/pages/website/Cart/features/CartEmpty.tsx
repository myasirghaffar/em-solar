import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function CartEmpty({ onContinue }: { onContinue?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-lg font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">Add products from the shop to see them here.</p>
      <Link
        to="/shop"
        onClick={onContinue}
        className="bg-[#FF7A00] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  );
}

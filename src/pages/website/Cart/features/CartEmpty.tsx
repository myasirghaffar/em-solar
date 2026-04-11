import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function CartEmpty({ onContinue }: { onContinue?: () => void }) {
  return (
    <div className="flex flex-col items-center px-4 py-14 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FF7A00]/10 text-[#FF7A00]">
        <ShoppingBag className="h-8 w-8" aria-hidden />
      </div>
      <p className="text-base font-semibold text-[#0B2A4A]">Your cart is empty</p>
      <p className="mt-2 max-w-xs text-sm text-gray-600">
        Add products from the shop to see them here for checkout.
      </p>
      <Link
        to="/shop"
        onClick={onContinue}
        className="mt-6 rounded-full bg-[#0B2A4A] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B2A4A]/90"
      >
        Browse shop
      </Link>
    </div>
  );
}

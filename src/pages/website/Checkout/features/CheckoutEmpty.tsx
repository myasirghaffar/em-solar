import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

export function CheckoutEmpty() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/90 md:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF7A00]/10 ring-1 ring-[#FF7A00]/15">
          <ShoppingBag className="h-7 w-7 text-[#FF7A00]" aria-hidden />
        </span>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-[#0B2A4A]">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-600">Add products from the shop to check out.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#FF7A00] text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#e86e00] hover:shadow-lg md:text-base"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

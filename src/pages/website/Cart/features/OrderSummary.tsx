import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  /** Called before navigating (e.g. close cart drawer). */
  onNavigate?: () => void;
  className?: string;
}

export function OrderSummary({
  subtotal,
  shipping,
  total,
  itemCount,
  onNavigate,
  className = "",
}: OrderSummaryProps) {
  return (
    <div className={className}>
      <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-5">
        <h2 className="text-base font-bold text-[#0B2A4A] sm:text-lg">Order summary</h2>
        <div className="mt-4 space-y-3 text-sm text-gray-600">
          <div className="flex justify-between gap-4">
            <span>Subtotal ({itemCount} items)</span>
            <span className="shrink-0 font-medium tabular-nums text-gray-800">
              Rs. {subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>Shipping</span>
            <span className="shrink-0 font-medium tabular-nums text-gray-800">
              {shipping === 0 ? "Free" : `Rs. ${shipping.toLocaleString()}`}
            </span>
          </div>
          {shipping === 0 && (
            <p className="text-xs text-green-600">Free shipping on orders above Rs. 50,000</p>
          )}
        </div>
        <div className="mt-4 rounded-lg bg-white px-4 py-3 ring-1 ring-gray-200/80">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className="text-xl font-bold tabular-nums text-[#FF7A00] sm:text-2xl">
              Rs. {total.toLocaleString()}
            </span>
          </div>
        </div>
        <Link
          to="/checkout"
          onClick={onNavigate}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#FF7A00] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF7A00]/90 sm:text-base"
        >
          Proceed to checkout
          <ArrowRight className="h-5 w-5 shrink-0" />
        </Link>
        <Link
          to="/shop"
          onClick={onNavigate}
          className="mt-3 block text-center text-sm font-medium text-[#0B2A4A] transition-colors hover:text-[#FF7A00]"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}

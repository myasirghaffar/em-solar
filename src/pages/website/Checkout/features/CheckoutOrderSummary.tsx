import { useCart } from "../../../../context/CartContext";

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
  const { openCart } = useCart();
  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] ring-1 ring-gray-200/90 md:p-7">
        <h2 className="mb-2 text-lg font-bold tracking-tight text-[#0B2A4A] md:text-xl">Order summary</h2>
        <p className="mb-6 text-sm text-gray-500">{cartItems.length} line{cartItems.length === 1 ? "" : "s"} in your order</p>
        <div className="mb-6 max-h-72 space-y-4 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.quantity}`}
              className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <img
                src={item.images?.[0] || "/placeholder-product.jpg"}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-gray-100"
              />
              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-[#0B2A4A]">{item.name}</h4>
                <p className="mt-1 text-xs text-gray-500">Qty {item.quantity}</p>
              </div>
              <p className="shrink-0 text-sm font-bold tabular-nums text-[#FF7A00]">
                Rs. {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium tabular-nums text-[#0B2A4A]">Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="font-medium text-[#0B2A4A]">
              {shipping === 0 ? <span className="text-emerald-600">Free</span> : `Rs. ${shipping.toLocaleString()}`}
            </span>
          </div>
          <div className="flex items-baseline justify-between border-t border-gray-100 pt-4">
            <span className="text-base font-bold text-[#0B2A4A]">Total</span>
            <span className="text-xl font-bold tabular-nums tracking-tight text-[#FF7A00] md:text-2xl">
              Rs. {total.toLocaleString()}
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-2xl bg-[#FF7A00] text-sm font-semibold text-white shadow-md shadow-orange-500/20 transition-all hover:bg-[#e86e00] hover:shadow-lg hover:shadow-orange-500/25 disabled:cursor-not-allowed disabled:opacity-50 md:h-[3.25rem] md:text-base"
        >
          {loading ? "Processing…" : "Place order"}
        </button>
        <button
          type="button"
          onClick={openCart}
          className="mt-4 w-full text-center text-sm font-medium text-[#0B2A4A] transition-colors hover:text-[#FF7A00]"
        >
          View cart
        </button>
      </div>
    </div>
  );
}

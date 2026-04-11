import { Trash2, Minus, Plus } from "lucide-react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category?: string;
  images?: string[];
}

interface CartItemsProps {
  items: CartItem[];
  updateCartQuantity: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
}

export function CartItems({ items, updateCartQuantity, removeFromCart }: CartItemsProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="flex gap-3">
            <img
              src={item.images?.[0] || "/placeholder-product.jpg"}
              alt=""
              className="h-20 w-20 shrink-0 rounded-lg object-cover sm:h-24 sm:w-24"
            />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug text-[#0B2A4A] sm:text-base">
                  {item.name}
                </h3>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="shrink-0 rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              {item.category ? (
                <p className="text-xs text-gray-500 sm:text-sm">{item.category}</p>
              ) : null}
              <p className="text-sm font-bold text-[#FF7A00]">
                Rs. {item.price.toLocaleString()}
                <span className="pl-1 text-xs font-normal text-gray-500">each</span>
              </p>

              <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="inline-flex w-fit items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-[2.25rem] px-2 text-center text-sm font-semibold tabular-nums text-[#0B2A4A]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
                      Line total
                    </p>
                    <p className="text-base font-bold text-[#0B2A4A] sm:text-lg">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

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
    <div className="lg:col-span-2 space-y-4">
      {items.map((item) => (
        <div key={`${item.id}-${item.quantity}`} className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row gap-4">
          <img src={item.images?.[0] || "/placeholder-product.jpg"} alt={item.name} className="w-full sm:w-32 h-32 object-cover rounded-lg" />
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-[#0B2A4A] mb-1">{item.name}</h3>
            <p className="text-gray-500 text-sm mb-2">{item.category}</p>
            <p className="text-[#FF7A00] font-bold text-lg">Rs. {item.price.toLocaleString()}</p>
          </div>
          <div className="flex flex-col items-end justify-between">
            <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
            <div className="flex items-center border-2 border-gray-300 rounded-lg">
              <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-semibold">{item.quantity}</span>
              <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="font-semibold text-[#0B2A4A]">Rs. {(item.price * item.quantity).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

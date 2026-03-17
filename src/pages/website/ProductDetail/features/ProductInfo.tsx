import { ShoppingCart, Star, Truck, Shield, Check, Minus, Plus } from "lucide-react";

interface ProductInfoProps {
  product: any;
  quantity: number;
  setQuantity: (v: number) => void;
  onAddToCart: () => void;
}

export function ProductInfo({ product, quantity, setQuantity, onAddToCart }: ProductInfoProps) {
  return (
    <div>
      <span className="inline-block bg-[#FF7A00]/10 text-[#FF7A00] px-3 py-1 rounded-full text-sm font-medium mb-4">{product.category}</span>
      <h1 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">{product.name}</h1>
      <div className="flex items-center space-x-2 mb-6">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <span className="text-gray-600">(4.5 out of 5)</span>
      </div>
      <div className="mb-6">
        <p className="text-4xl font-bold text-[#FF7A00]">Rs. {product.price.toLocaleString()}</p>
        <p className="text-gray-500">Inclusive of all taxes</p>
      </div>
      <p className="text-gray-600 mb-6">{product.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { icon: Truck, label: "Free Delivery" },
          { icon: Shield, label: "2 Year Warranty" },
          { icon: Check, label: "Certified Product" },
          { icon: Check, label: "Easy Returns" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-[#FF7A00]" />
            <span className="text-gray-700">{label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex items-center border-2 border-gray-300 rounded-lg">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-100 transition-colors">
            <Minus className="w-5 h-5" />
          </button>
          <span className="px-6 py-3 font-semibold text-lg">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-100 transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <button onClick={onAddToCart} className="flex-1 bg-[#FF7A00] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors flex items-center justify-center space-x-2">
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
      <div className={`flex items-center space-x-2 ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
        <Check className="w-5 h-5" />
        <span className="font-medium">{product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}</span>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import ProductCard from "../../../../components/store/ProductCard";
import { useCart } from "../../../../context/CartContext";

interface FeaturedProductsProps {
  products: any[];
  loading: boolean;
}

export function FeaturedProducts({ products, loading }: FeaturedProductsProps) {
  const { addToCart } = useCart();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 scroll-reveal">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Top-rated solar products from trusted brands</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )}
        <div className="text-center mt-10 scroll-reveal">
          <Link to="/shop">
            <button className="bg-[#0B2A4A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#0B2A4A]/90 transition-all hover:scale-105">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

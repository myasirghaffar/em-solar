import { Link } from "react-router-dom";

interface RelatedProductsProps {
  products: any[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[#0B2A4A] mb-6">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <img src={p.images?.[0] || "/placeholder-product.jpg"} alt={p.name} className="w-full aspect-square object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-[#0B2A4A] mb-2 line-clamp-2">{p.name}</h3>
                <p className="text-[#FF7A00] font-bold">Rs. {p.price.toLocaleString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

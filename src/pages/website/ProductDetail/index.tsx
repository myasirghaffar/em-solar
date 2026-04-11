import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../../../context/CartContext";
import { ProductInfo, ProductImages, ProductContentTabs, RelatedProducts } from "./features";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    (async () => {
      try {
        const { fetchProductById, fetchProducts } = await import("../../../lib/api");
        const { withStoreProductFallback } = await import(
          "../../../data/dummyProducts"
        );
        const pid = parseInt(id || "0", 10);
        if (!Number.isFinite(pid) || pid < 1) {
          setProduct(null);
          return;
        }
        let found: any = null;
        try {
          found = await fetchProductById(pid);
        } catch {
          found = null;
        }
        const list = withStoreProductFallback(await fetchProducts());
        if (!found) {
          found = list.find((p: any) => p.id === pid) ?? null;
        }
        setProduct(found);
        if (found) {
          const related = list
            .filter(
              (p: any) => p.category === found.category && p.id !== found.id,
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleAddToCart = () => {
    if (product) for (let i = 0; i < quantity; i++) addToCart(product);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF7A00]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Product not found</h2>
          <Link to="/shop">
            <button className="bg-[#FF7A00] text-white px-6 py-2 rounded-lg">Back to Shop</button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length ? product.images : ["/placeholder-product.jpg"];

  const getImageUrl = (index: number) => {
    if (imageError || !product.images?.[index]) return "/placeholder-product.jpg";
    return product.images[index];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-white bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link to="/shop" className="inline-flex items-center text-gray-600 hover:text-[#FF7A00] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImages product={product} images={images} selectedImage={selectedImage} setSelectedImage={setSelectedImage} getImageUrl={getImageUrl} onImageError={() => setImageError(true)} />
          <ProductInfo product={product} quantity={quantity} setQuantity={setQuantity} onAddToCart={handleAddToCart} />
        </div>
        <ProductContentTabs product={product} />
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}

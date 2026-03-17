import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, Truck, Shield, Check, ArrowLeft, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';

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
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products`);
      const data = await res.json();
      const found = data.find((p: any) => p.id === parseInt(id || '0'));
      setProduct(found);
      
      // Get related products
      const related = data
        .filter((p: any) => p.category === found?.category && p.id !== found?.id)
        .slice(0, 4);
      setRelatedProducts(related);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageUrl = (index: number) => {
    if (imageError || !product.images?.[index]) {
      return '/placeholder-product.jpg';
    }
    return product.images[index];
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

  const images = product.images?.length ? product.images : ['/placeholder-product.jpg'];
  const specs = product.specifications || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/shop" className="inline-flex items-center text-gray-600 hover:text-[#FF7A00] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
              <img
                src={getImageUrl(selectedImage)}
                alt={product.name}
                onError={handleImageError}
                className="w-full aspect-square object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-[#FF7A00]' : 'border-transparent'
                    }`}
                  >
                    <img src={getImageUrl(index)} alt={`${product.name} ${index + 1}`} className="w-full aspect-square object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="inline-block bg-[#FF7A00]/10 text-[#FF7A00] px-3 py-1 rounded-full text-sm font-medium mb-4">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0B2A4A] mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">(4.5 out of 5)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <p className="text-4xl font-bold text-[#FF7A00]">Rs. {product.price.toLocaleString()}</p>
              <p className="text-gray-500">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-[#FF7A00]" />
                <span className="text-gray-700">Free Delivery</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-[#FF7A00]" />
                <span className="text-gray-700">2 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF7A00]" />
                <span className="text-gray-700">Certified Product</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-[#FF7A00]" />
                <span className="text-gray-700">Easy Returns</span>
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center border-2 border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-6 py-3 font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 bg-[#FF7A00] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#FF7A00]/90 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </motion.button>
            </div>

            {/* Stock Status */}
            <div className={`flex items-center space-x-2 ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <Check className="w-5 h-5" />
              <span className="font-medium">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        {Object.keys(specs).length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#0B2A4A] mb-6">Specifications</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="w-full">
                <tbody>
                  {Object.entries(specs).map(([key, value]) => (
                    <tr key={key} className="border-t">
                      <td className="px-6 py-4 font-medium text-gray-700 bg-gray-50">{key}</td>
                      <td className="px-6 py-4 text-gray-600">{value as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#0B2A4A] mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <img src={p.images?.[0] || '/placeholder-product.jpg'} alt={p.name} className="w-full aspect-square object-cover" />
                    <div className="p-4">
                      <h3 className="font-semibold text-[#0B2A4A] mb-2 line-clamp-2">{p.name}</h3>
                      <p className="text-[#FF7A00] font-bold">Rs. {p.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

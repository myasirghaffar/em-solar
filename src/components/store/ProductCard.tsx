import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import Card from '../ui/Card';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    description: string;
    images: string[];
    category: string;
  };
  onAddToCart?: (product: any) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get image URL with fallback
  const getImageUrl = () => {
    if (imageError || !product.images?.[0]) {
      return '/placeholder-product.jpg';
    }
    return product.images[0];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card hover className="group">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-200">
          <img
            src={getImageUrl()}
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 bg-[#FF7A00] text-white text-xs px-2 py-1 rounded-full">
            {product.category}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg text-[#0B2A4A] mb-2 group-hover:text-[#FF7A00] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-[#FF7A00]">Rs. {product.price.toLocaleString()}</p>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-500 ml-1">(4.5)</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onAddToCart?.(product)}
            className="bg-[#0B2A4A] text-white p-3 rounded-full hover:bg-[#FF7A00] transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </Card>
  );
}

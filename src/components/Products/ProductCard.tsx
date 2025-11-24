import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Shuffle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlistStore } from '../../stores/wishlistStore';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  showCompareButton?: boolean;
}

export function ProductCard({ product, showCompareButton = true }: ProductCardProps) {
  const navigate = useNavigate();
  const { isInWishlist, addItem: addWishlistItem, removeItem: removeWishlistItem } = useWishlistStore();
  const [isInWishlistLocal, setIsInWishlistLocal] = useState(isInWishlist(product.slug));

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlistLocal) {
      removeWishlistItem(product.slug);
    } else {
      addWishlistItem(product.slug);
    }
    setIsInWishlistLocal(!isInWishlistLocal);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get existing compared products from localStorage
    const comparedProducts = localStorage.getItem('comparedProducts');
    let products = comparedProducts ? JSON.parse(comparedProducts) : [];
    
    // Check if product is already in comparison
    const isAlreadyCompared = products.some((p: Product) => p.id === product.id);
    
    if (isAlreadyCompared) {
      // Remove from comparison
      products = products.filter((p: Product) => p.id !== product.id);
      alert('Product removed from comparison');
    } else {
      // Add to comparison (limit to 4 products)
      if (products.length >= 4) {
        alert('You can only compare up to 4 products. Remove one to add this product.');
        return;
      }
      
      products.push(product);
      alert('Product added to comparison');
    }
    
    // Save back to localStorage
    localStorage.setItem('comparedProducts', JSON.stringify(products));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/product/${product.slug}`)}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.images[0] || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {product.model_url && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
            3D
          </div>
        )}
        
        {/* Action buttons */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isInWishlistLocal
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-900 hover:bg-red-500 hover:text-white'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart size={16} fill={isInWishlistLocal ? 'currentColor' : 'none'} />
          </button>
          
          {showCompareButton && (
            <button
              onClick={handleCompare}
              className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-gray-900 hover:text-white transition-colors"
              aria-label="Compare product"
            >
              <Shuffle size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>
        <p className="text-xl font-bold text-gray-900">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </motion.div>
  );
}
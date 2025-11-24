import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingCart } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useWishlistStore } from '../stores/wishlistStore.ts';
import { productApi } from '../lib/api';
import type { Product } from '../types';

export function WishlistPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    fetchWishlistProducts();
  }, [user, items]);

  const fetchWishlistProducts = async () => {
    setLoading(true);
    try {
      const productPromises = items.map((itemId: string) => 
        productApi.getProductBySlug(itemId)
      );
      
      const products = await Promise.all(productPromises);
      const validProducts = products.filter(Boolean) as Product[];
      setWishlistProducts(validProducts);
    } catch (error) {
      console.error('Fetch wishlist products error:', error);
    }
    setLoading(false);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
  };

  const handleAddToCart = (product: Product) => {
    // In a real implementation, this would add to cart
    alert(`Added ${product.name} to cart!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Wishlist
          </h1>
          <p className="text-gray-600">
            {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} saved
          </p>
        </motion.div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love for later</p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} in your wishlist
              </p>
              <button
                onClick={clearWishlist}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All
              </button>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {wishlistProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group relative border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => handleRemoveFromWishlist(product.slug)}
                    className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>

                  <div 
                    className="aspect-square bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    <img
                      src={product.images[0] || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 
                      className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-gray-600"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-gray-900 mb-4">
                      ${product.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
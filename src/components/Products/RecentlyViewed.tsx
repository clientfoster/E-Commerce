import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecentlyViewedStore } from '../../stores/recentlyViewedStore';

interface RecentlyViewedProps {
  currentProductId?: string;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
  const navigate = useNavigate();
  const { items, removeProduct, clearAll } = useRecentlyViewedStore();
  
  // Filter out the current product if provided
  const filteredItems = currentProductId 
    ? items.filter(item => item.id !== currentProductId)
    : items;

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Recently Viewed
          </h2>
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div 
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <img
                  src={product.images[0] || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="mt-2">
                <h3 
                  className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-gray-600"
                  onClick={() => navigate(`/product/${product.slug}`)}
                >
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-gray-900">
                  ${product.price.toFixed(2)}
                </p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeProduct(product.id);
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-xs">×</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
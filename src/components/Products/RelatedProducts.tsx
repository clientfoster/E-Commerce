import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { productApi } from '../../lib/api';
import { ProductCard } from './ProductCard';
import type { Product } from '../../types';

interface RelatedProductsProps {
  categoryId?: string | null;
  currentProductId: string;
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  const fetchRelatedProducts = async () => {
    if (!categoryId) return;
    
    setLoading(true);
    try {
      const data = await productApi.getProducts({
        categoryId: categoryId,
        limit: 10,
      });
      
      if (data) {
        // Filter out the current product and take first 5
        const filteredProducts = (data as Product[])
          .filter(product => product.id !== currentProductId)
          .slice(0, 5);
        setRelatedProducts(filteredProducts);
      }
    } catch (error) {
      console.error('Fetch related products error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} showCompareButton={false} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import { Product } from '../types';

const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuthStore();

  // Get products from localStorage
  useEffect(() => {
    const comparedProducts = localStorage.getItem('comparedProducts');
    if (comparedProducts) {
      setProducts(JSON.parse(comparedProducts));
    }
  }, []);

  const removeFromCompare = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('comparedProducts', JSON.stringify(updatedProducts));
  };

  const clearAll = () => {
    setProducts([]);
    localStorage.removeItem('comparedProducts');
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      // Handle unauthenticated user
      alert('Please log in to add items to cart');
      return;
    }
    
    addItem({
      product_id: product.id,
      quantity: 1,
      size: product.sizes?.[0] || null,
      color: product.colors?.[0]?.name || null,
      material: product.materials?.[0]?.name || null,
    });
  };

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <h1 className="text-3xl font-bold mb-4">Product Comparison</h1>
          <p className="text-gray-600 mb-8">No products to compare. Add products to compare them.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Product Comparison</h1>
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b p-4 text-left w-48">Product</th>
                {products.map((product) => (
                  <th key={product.id} className="border-b p-4 text-center relative w-64">
                    <button
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600"
                    >
                      <X size={20} />
                    </button>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-32 h-32 object-cover mx-auto mb-4"
                    />
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b p-4 font-medium">Rating</td>
                {products.map((product) => (
                  <td key={product.id} className="border-b p-4 text-center">
                    <div className="flex items-center justify-center">
                      <Star className="text-yellow-400 fill-current" size={16} />
                      <span className="ml-1">{5} {/* Mock rating */}</span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Description</td>
                {products.map((product) => (
                  <td key={product.id} className="border-b p-4 text-center">
                    <p className="text-sm text-gray-600 line-clamp-3">{product.description || 'No description available'}</p>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Category</td>
                {products.map((product) => (
                  <td key={product.id} className="border-b p-4 text-center">
                    N/A {/* Category would need to be fetched separately */}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Sizes</td>
                {products.map((product) => (
                  <td key={product.id} className="border-b p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.sizes?.map((size) => (
                        <span
                          key={size}
                          className="px-2 py-1 bg-gray-100 rounded text-xs"
                        >
                          {size}
                        </span>
                      )) || 'N/A'}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Colors</td>
                {products.map((product) => (
                  <td key={product.id} className="border-b p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.colors?.map((color) => (
                        <span
                          key={color.name}
                          className="px-2 py-1 bg-gray-100 rounded text-xs"
                          style={{ backgroundColor: color.hex }}
                        >
                          {color.name}
                        </span>
                      )) || 'N/A'}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Materials</td>
                {products.map((product) => (
                  <td key={product.id} className="border-b p-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1">
                      {product.materials?.map((material) => (
                        <span
                          key={material.name}
                          className="px-2 py-1 bg-gray-100 rounded text-xs"
                        >
                          {material.name}
                        </span>
                      )) || 'N/A'}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-b p-4 font-medium">Actions</td>
                {products.map((product) => (
                  <td key={product.id} className="border-b p-4 text-center">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors text-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => navigate(`/product/${product.slug}`)}
                        className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ComparePage;
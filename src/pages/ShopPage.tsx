import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Filter, Gift } from 'lucide-react';
import { productApi, categoryApi } from '../lib/api';
import { ProductCard } from '../components/Products/ProductCard';
import type { Product, Category } from '../types';

export function ShopPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement>(null);

  const loadProducts = useCallback(async (pageNum: number) => {
    try {
      const data = await productApi.getProducts({
        categoryId: selectedCategory || undefined,
        isActive: true,
        page: pageNum,
        limit: 12,
        // In a real implementation, we would pass the filters and sorting to the API
        // For now, we'll handle filtering on the client side
      });

      if (data && Array.isArray(data.products)) {
        if (pageNum === 1) {
          setProducts(data.products as Product[]);
        } else {
          setProducts(prev => [...prev, ...(data.products as Product[])]);
        }
        setHasMore(data.page < data.pages);
      }
    } catch (error) {
      console.error('Fetch products error:', error);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setPage(1);

      try {
        const [categoriesData] = await Promise.all([
          categoryApi.getCategories(),
          loadProducts(1)
        ]);

        if (categoriesData) setCategories(categoriesData as Category[]);
      } catch (error) {
        console.error('Fetch data error:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, [selectedCategory, loadProducts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          loadProducts(nextPage);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [loading, hasMore, page, loadProducts]);

  const filteredProducts = products
    .filter((p) => {
      // Original price range filter
      return p.price >= priceRange[0] && p.price <= priceRange[1];
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop Collection
          </h1>
          <p className="text-lg text-gray-600">
            Discover our curated selection of premium fashion
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Categories
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === null
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            )}
            <div ref={loaderRef} className="py-8 flex justify-center">
              {hasMore && (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                  <span>Loading more products...</span>
                </div>
              )}
            </div>

            {/* Gift Cards Section */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gift Cards</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Give the gift of choice with an ATELIER gift card. Perfect for any occasion.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Send a Gift Card</h3>
                    <p className="text-gray-600 mb-4">
                      Let your loved ones choose their perfect style with a digital gift card.
                    </p>
                    <button
                      onClick={() => navigate('/gift-card/purchase')}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      Purchase Gift Card
                    </button>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-lg w-64">
                      <div className="text-center">
                        <Gift className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-1">ATELIER Gift Card</h4>
                        <p className="text-sm text-gray-600 mb-3">Digital Card</p>
                        <div className="bg-gray-100 rounded p-2 text-center">
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-semibold text-gray-900">₹25 - ₹500</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

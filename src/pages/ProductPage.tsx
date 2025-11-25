import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, ShoppingBag, Send, Heart } from 'lucide-react';
import { productApi } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useUIStore } from '../stores/uiStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useRecentlyViewedStore } from '../stores/recentlyViewedStore';
import { ProductViewer3D } from '../components/3D/ProductViewer3D';
import { RelatedProducts } from '../components/Products/RelatedProducts';
import { RecentlyViewed } from '../components/Products/RecentlyViewed';
import type { Product } from '../types';

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [view, setView] = useState<'3d' | 'images'>('images');
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { user, profile } = useAuthStore();
  const { addItem } = useCartStore();
  const { setCartOpen, setAuthModalOpen } = useUIStore();
  const { isInWishlist, addItem: addWishlistItem, removeItem: removeWishlistItem } = useWishlistStore();
  const { addProduct: addRecentlyViewed } = useRecentlyViewedStore();

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  useEffect(() => {
    // Add to recently viewed when product loads
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const data = await productApi.getProductBySlug(slug!);

      if (data) {
        const productData = data as Product;
        setProduct(productData);
        if (productData.colors.length > 0) setSelectedColor(productData.colors[0]);
        if (productData.sizes.length > 0) setSelectedSize(productData.sizes[0]);
        if (productData.materials.length > 0) setSelectedMaterial(productData.materials[0].name);

        // Set mock reviews for now - in a real app, these would come from the backend
        setReviews([
          {
            id: '1',
            user: { name: 'Alex Johnson', avatar: null },
            rating: 5,
            title: 'Absolutely stunning!',
            comment: 'This piece exceeded my expectations. The quality and craftsmanship are exceptional.',
            date: '2024-01-15',
          },
          {
            id: '2',
            user: { name: 'Sarah Miller', avatar: null },
            rating: 4,
            title: 'Great product',
            comment: 'Beautiful design and comfortable to wear. Will definitely buy again.',
            date: '2024-01-10',
          },
          {
            id: '3',
            user: { name: 'Michael Chen', avatar: null },
            rating: 5,
            title: 'Perfect gift',
            comment: 'Bought this as a gift and it was a huge hit. Excellent quality and fast shipping.',
            date: '2024-01-05',
          },
        ]);
      }
    } catch (error) {
      console.error('Fetch product error:', error);
    }
    setLoading(false);
  };

  const handleAddToCart = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (!product) return;

    try {
      await addItem({
        product_id: product.id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor?.name || null,
        material: selectedMaterial,
      });

      // Show success feedback
      setCartOpen(true);
    } catch (error) {
      console.error('Add to cart failed:', error);
      // Show error message to user
      alert(error instanceof Error ? error.message : 'Failed to add item to cart. Please try again.');
    }
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    if (isInWishlist(product.slug)) {
      removeWishlistItem(product.slug);
    } else {
      addWishlistItem(product.slug);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    if (!product) return;

    setSubmittingReview(true);

    try {
      // In a real app, this would be an API call to submit the review
      const newReview = {
        id: Date.now().toString(),
        user: { name: profile?.fullName || user?.email, avatar: null },
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        date: new Date().toISOString().split('T')[0],
      };

      setReviews(prev => [newReview, ...prev]);
      setReviewTitle('');
      setReviewComment('');
      setReviewRating(5);

      // Show success message
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Submit review error:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/shop')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Shop
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setView('images')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === 'images'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Images
              </button>
              {product.model_url && (
                <button
                  onClick={() => setView('3d')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${view === '3d'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  3D View
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {view === '3d' && product.model_url ? (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-square"
                >
                  <ProductViewer3D
                    selectedColor={selectedColor?.hex}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="images"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {product.images.length > 1 && view === 'images' && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-gray-900">
                ₹{product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < 4
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200'
                    }`}
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">(24 reviews)</span>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {product.colors.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Color: {selectedColor?.name}
                </h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <motion.button
                      key={color.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor?.name === color.name
                        ? 'border-gray-900 shadow-lg'
                        : 'border-gray-300'
                        }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex gap-3">
                  {product.sizes.map((size) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedSize === size
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {product.materials.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Material
                </h3>
                <div className="flex gap-3">
                  {product.materials.map((material) => (
                    <motion.button
                      key={material.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMaterial(material.name)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedMaterial === material.name
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {material.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleToggleWishlist}
              className={`w-full py-4 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 border-2 ${isInWishlist(product?.slug || '') ? 'bg-red-50 border-red-500 text-red-600' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <Heart className={`w-5 h-5 ${isInWishlist(product?.slug || '') ? 'fill-current' : ''}`} />
              {isInWishlist(product?.slug || '') ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </motion.button>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Product Details
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Premium quality materials</li>
                <li>• Sustainable production</li>
                <li>• Free shipping on orders over ₹100</li>
                <li>• 30-day return policy</li>
              </ul>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(4.5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">4.5 out of 5</span>
                </div>
              </div>

              {/* Review Form */}
              {user ? (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="text-2xl focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${star <= reviewRating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'fill-gray-200 text-gray-200'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Give your review a title"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      placeholder="Share your thoughts about this product"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600 mb-4">Please sign in to write a review</p>
                  <button
                    onClick={() => setAuthModalOpen(true)}
                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-700">
                            {review.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-gray-200 text-gray-200'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900 mb-1">{review.title}</p>
                          <p className="text-sm text-gray-600 mb-2">{review.date}</p>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this product!</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {product && (
        <>
          <RelatedProducts
            categoryId={product.category_id}
            currentProductId={product.id}
          />
          <RecentlyViewed currentProductId={product.id} />
        </>
      )}
    </div>
  );
}

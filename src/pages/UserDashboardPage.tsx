import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Heart,
  Gift,
  User,
  LogOut,
  Menu,
  X,
  Eye,
  ChevronRight,
  Package2,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useWishlistStore } from '../stores/wishlistStore';
import { useGiftCardStore } from '../stores/giftcardStore';
import { orderApi, cartApi } from '../lib/api';
import { wishlistApi } from '../lib/api/newApis';
import type { Product } from '../types';

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: Array<{
    quantity: number;
    price_at_time: number;
    products: {
      name: string;
      images: string[];
    } | null;
  }>;
}

interface GiftCard {
  _id: any;
  code: string;
  initialAmount: number;
  currentBalance: number;
  expiresAt: Date;
  isRedeemed: boolean;
}

type Tab = 'dashboard' | 'orders' | 'wishlist' | 'gift-cards' | 'profile';

export function UserDashboardPage() {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { giftCards, getUserGiftCards } = useGiftCardStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Array<Product & { wishlistItemId: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    loadDashboardData();
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') loadOrders();
    else if (activeTab === 'wishlist') loadWishlistProducts();
    else if (activeTab === 'gift-cards') loadGiftCards();
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load orders
      const ordersData = await orderApi.getOrders();
      if (ordersData) setOrders(ordersData as Order[]);
      
      // Load gift cards (uses token, no userId needed)
      getUserGiftCards();
    } catch (error) {
      console.error('Load dashboard data error:', error);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getOrders();
      if (data) setOrders(data as Order[]);
    } catch (error) {
      console.error('Load orders error:', error);
    }
    setLoading(false);
  };

  const loadWishlistProducts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const wishlistItems = await wishlistApi.getWishlist();
      
      // Transform wishlist items to Product format for display, keeping wishlist item ID
      const products = wishlistItems.map((item: any) => ({
        id: item.product_id,
        name: item.product.name,
        slug: item.product.slug,
        description: null,
        price: item.product.price,
        category_id: null,
        images: item.product.images || [],
        model_url: null,
        sizes: [],
        colors: [],
        materials: [],
        stock_quantity: item.product.stock_quantity || 0,
        is_featured: false,
        is_active: true,
        created_at: item.created_at,
        updated_at: item.created_at,
        wishlistItemId: item.id, // Store the wishlist item ID for removal
      }));
      
      setWishlistProducts(products);
    } catch (error) {
      console.error('Load wishlist products error:', error);
      setWishlistProducts([]);
    }
    setLoading(false);
  };

  const handleRemoveFromWishlist = async (itemId: string, productId: string) => {
    try {
      await wishlistApi.removeFromWishlist(itemId);
      // Update local state immediately for better UX
      setWishlistProducts(prev => prev.filter(p => p.wishlistItemId !== itemId));
      // Optionally reload to ensure sync
      await loadWishlistProducts();
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      alert('Failed to remove item from wishlist. Please try again.');
    }
  };

  const handleAddToCartFromWishlist = async (product: Product) => {
    try {
      await cartApi.addToCart(product.id, 1);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Add to cart error:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const loadGiftCards = async () => {
    setLoading(true);
    try {
      getUserGiftCards();
    } catch (error) {
      console.error('Load gift cards error:', error);
    }
    setLoading(false);
  };

  const handleCopyCode = (code: string, cardId: any) => {
    navigator.clipboard.writeText(code);
    setCopiedCardId(cardId.toString());
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cart Items</p>
              <p className="text-2xl font-semibold text-gray-900">{cartItems.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
              <p className="text-2xl font-semibold text-gray-900">{wishlistItems.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Gift className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gift Cards</p>
              <p className="text-2xl font-semibold text-gray-900">{giftCards.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="font-semibold text-gray-900">${order.total_amount.toFixed(2)}</span>
                  <button
                    onClick={() => navigate(`/order-tracking?orderId=${order.id}`)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-gray-500">No orders yet</p>
            </div>
          )}
        </div>
        {orders.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => setActiveTab('orders')}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all orders
            </button>
          </div>
        )}
      </motion.div>

      {/* Gift Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Gift Cards</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {giftCards.slice(0, 2).map((card) => (
            <div key={card._id.toString()} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">${card.initialAmount.toFixed(2)} Gift Card</h3>
                  <p className="text-sm text-gray-500">Balance: ${card.currentBalance.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!card.isRedeemed && card.currentBalance > 0 && (
                    <button
                      onClick={() => handleCopyCode(card.code, card._id)}
                      className="px-3 py-1 text-sm bg-gray-900 text-white rounded hover:bg-gray-800"
                    >
                      {copiedCardId === card._id.toString() ? 'Copied!' : 'Copy Code'}
                    </button>
                  )}
                  {card.isRedeemed && (
                    <span className="text-xs text-red-600">Redeemed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {giftCards.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-gray-500">No gift cards yet</p>
            </div>
          )}
        </div>
        {giftCards.length > 0 && (
          <div className="p-4 border-t border-gray-200 text-center">
            <button
              onClick={() => setActiveTab('gift-cards')}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View all gift cards
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Your Orders</h2>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <Package2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                {order.order_items.slice(0, 2).map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <img
                      src={item.products?.images[0] || 'https://via.placeholder.com/60'}
                      alt={item.products?.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{item.products?.name}</h4>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.order_items.length > 2 && (
                  <p className="text-sm text-gray-500">+{order.order_items.length - 2} more items</p>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-900">${order.total_amount.toFixed(2)}</span>
                <button
                  onClick={() => navigate(`/order-tracking?orderId=${order.id}`)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-900 hover:text-gray-700"
                >
                  Track Order
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Wishlist</h2>
        {wishlistProducts.length > 0 && (
          <button
            onClick={() => navigate('/wishlist')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View Full Wishlist
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      ) : wishlistProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Start adding items to your wishlist to save them for later</p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/150'}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg cursor-pointer"
                    onClick={() => navigate(`/product/${product.slug}`)}
                  />
                  
                  <div className="flex-1">
                    <h3
                      className="text-lg font-semibold text-gray-900 mb-1 cursor-pointer hover:text-gray-700"
                      onClick={() => navigate(`/product/${product.slug}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-xl font-bold text-gray-900 mb-3">${product.price.toFixed(2)}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleAddToCartFromWishlist(product)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(product.wishlistItemId, product.id)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderGiftCards = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Gift Cards</h2>
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      ) : giftCards.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gift cards yet</h3>
          <p className="text-gray-600 mb-6">Purchase a gift card to get started</p>
          <button
            onClick={() => navigate('/gift-card/purchase')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Buy Gift Card
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {giftCards.map((card) => (
              <div key={card._id.toString()} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        ${card.initialAmount.toFixed(2)} Gift Card
                      </h3>
                      {card.isRedeemed && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Redeemed
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Code:</span> {card.code}
                      </div>
                      <div>
                        <span className="font-medium">Balance:</span> ${card.currentBalance.toFixed(2)}
                      </div>
                      <div>
                        <span className="font-medium">Expires:</span> {card.expiresAt ? new Date(card.expiresAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    {!card.isRedeemed && card.currentBalance > 0 && (
                      <button
                        onClick={() => handleCopyCode(card.code, card._id)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                      >
                        {copiedCardId === card._id.toString() ? 'Copied!' : 'Copy Code'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Print
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-gray-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{profile?.fullName || 'User'}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <button
            onClick={() => navigate('/profile')}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit Profile Information
          </button>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
          <p className="text-gray-600">You need to be logged in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-sm min-h-screen transition-all duration-300`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'orders'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package2 className="w-5 h-5" />
            {sidebarOpen && <span>Orders</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'wishlist'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Heart className="w-5 h-5" />
            {sidebarOpen && <span>Wishlist</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('gift-cards')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'gift-cards'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Gift className="w-5 h-5" />
            {sidebarOpen && <span>Gift Cards</span>}
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              activeTab === 'profile'
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <User className="w-5 h-5" />
            {sidebarOpen && <span>Profile</span>}
          </button>
          
          <button
            onClick={signOut}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50`}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-0' : 'ml-0'} flex-1`}>
        <div className="max-w-6xl mx-auto p-6">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'wishlist' && renderWishlist()}
          {activeTab === 'gift-cards' && renderGiftCards()}
          {activeTab === 'profile' && renderProfile()}
        </div>
      </div>
    </div>
  );
}
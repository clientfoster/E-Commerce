import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Bell,
  Shield,
  ShieldOff,
  Circle,
  Package2,
  FileText,
  Tag,
  Star,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { adminApi } from '../lib/api';

interface Stats {
  products: number;
  orders: number;
  users: number;
  blogs: number;
  categories: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string | null;
  category_name: string | null;
  images: string[];
  model_url: string | null;
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  materials: Array<{ name: string; texture?: string }>;
  stock_quantity: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Order {
  id: string;
  user_email: string;
  user_name: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items: any[];
}

interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  category: string;
  is_published: boolean;
  views: number;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

interface Review {
  id: string;
  product_id: string;
  product_name: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string | null;
  comment: string | null;
  created_at: string;
}

interface SiteSettings {
  id: string;
  site_name: string;
  site_description: string;
  logo: string;
  favicon: string;
  contact_email: string;
  contact_phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  social_media: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
    youtube?: string;
  };
  email_settings: {
    smtpHost?: string;
    smtpPort?: number;
    smtpUser?: string;
    smtpPassword?: string;
    fromEmail: string;
    fromName: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
    googleAnalyticsId?: string;
    facebookPixelId?: string;
  };
  shipping: {
    freeShippingThreshold: number;
    standardShippingCost: number;
    expressShippingCost: number;
    internationalShippingCost: number;
  };
  currency: {
    code: string;
    symbol: string;
  };
  maintenance: {
    enabled: boolean;
    message: string;
  };
  updated_at: string;
}

type Tab = 'dashboard' | 'products' | 'orders' | 'users' | 'blogs' | 'categories' | 'reviews' | 'settings';

export function AdminPage() {
  const { signOut, profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<Stats>({ products: 0, orders: 0, users: 0, blogs: 0, categories: 0 });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') loadProducts();
    else if (activeTab === 'orders') loadOrders();
    else if (activeTab === 'users') loadUsers();
    else if (activeTab === 'blogs') loadBlogs();
    else if (activeTab === 'categories') loadCategories();
    else if (activeTab === 'reviews') loadReviews();
    else if (activeTab === 'settings') loadSettings();
  }, [activeTab]);

  const loadStats = async () => {
    try {
      const data = await adminApi.getStats();
      // Update stats with categories count when available
      setStats({ ...data, categories: categories.length });
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllProducts();
      setProducts(data as Product[]);
    } catch (error) {
      console.error('Load products error:', error);
    }
    setLoading(false);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllOrders();
      // Ensure data is an array
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Load orders error:', error);
      setOrders([]); // Set to empty array on error
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data as User[]);
    } catch (error) {
      console.error('Load users error:', error);
    }
    setLoading(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await adminApi.deleteProduct(productId);
      loadProducts();
      loadStats();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleToggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      await adminApi.updateProduct(productId, { isActive: !isActive });
      loadProducts();
    } catch (error) {
      alert('Failed to update product');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      loadOrders();
    } catch (error) {
      alert('Failed to update order');
    }
  };

  const handleToggleUserAdmin = async (userId: string, isAdmin: boolean) => {
    if (!confirm(`${isAdmin ? 'Remove' : 'Grant'} admin access?`)) return;
    try {
      await adminApi.toggleUserAdmin(userId, !isAdmin);
      loadUsers();
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await adminApi.deleteUser(userId);
      loadUsers();
      loadStats();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  // Category Management Functions
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Delete this category? This action cannot be undone.')) return;
    try {
      await adminApi.deleteCategory(categoryId);
      loadCategories();
      loadStats();
    } catch (error) {
      alert('Failed to delete category');
    }
  };

  const handleSaveCategory = async (categoryData: any) => {
    try {
      console.log('Saving category data:', categoryData);
      
      // Validate required fields
      if (!categoryData.name || !categoryData.name.trim()) {
        alert('Category name is required');
        return;
      }
      
      // Convert field names from snake_case to camelCase for the backend
      const transformedData = {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        imageUrl: categoryData.image_url,
      };
      
      console.log('Transformed data for API:', transformedData);
      
      if (editingCategory) {
        // Update existing category
        console.log('Updating existing category:', editingCategory.id);
        await adminApi.updateCategory(editingCategory.id, transformedData);
      } else {
        // Create new category
        console.log('Creating new category');
        await adminApi.createCategory(transformedData);
      }
      setShowCategoryModal(false);
      loadCategories();
      loadStats();
      alert(`${editingCategory ? 'Updated' : 'Created'} category successfully!`);
    } catch (error: any) {
      console.error('Save category error:', error);
      // Try to get more detailed error message
      let errorMessage = `Failed to ${editingCategory ? 'update' : 'create'} category`;
      
      // Handle different types of errors
      if (error.message) {
        errorMessage += `: ${error.message}`;
      } else if (error.error) {
        errorMessage += `: ${error.error}`;
      } else if (typeof error === 'string') {
        errorMessage += `: ${error}`;
      } else {
        errorMessage += `. Please check the console for more details.`;
      }
      
      // Add additional context for common issues
      if (errorMessage.includes('Network error')) {
        errorMessage += ' Please check your internet connection and ensure the backend server is running.';
      } else if (errorMessage.includes('404')) {
        errorMessage += ' The API endpoint was not found. Please check if the backend server is running correctly.';
      } else if (errorMessage.includes('500')) {
        errorMessage += ' There was a server error. Please check the backend logs for more details.';
      }
      
      alert(errorMessage);
    }
  };

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/blogs');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Load blogs error:', error);
    }
    setLoading(false);
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('Load settings error:', error);
    }
    setLoading(false);
  };

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
      // Update stats with categories count
      setStats(prev => ({ ...prev, categories: Array.isArray(data) ? data.length : 0 }));
    } catch (error) {
      console.error('Load categories error:', error);
      setCategories([]);
      setStats(prev => ({ ...prev, categories: 0 }));
    }
    setLoading(false);
  };

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error('Load reviews error:', error);
    }
    setLoading(false);
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      await fetch(`http://localhost:5000/api/admin/blogs/${blogId}`, { method: 'DELETE' });
      loadBlogs();
      loadStats();
    } catch (error) {
      alert('Failed to delete blog');
    }
  };

  const handleToggleBlogPublish = async (blogId: string) => {
    try {
      await fetch(`http://localhost:5000/api/admin/blogs/${blogId}/publish`, { method: 'PUT' });
      loadBlogs();
    } catch (error) {
      alert('Failed to update blog');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    
    setLoading(true);
    try {
      // Transform settings to match backend schema
      const transformedSettings = {
        siteName: settings.site_name,
        siteDescription: settings.site_description,
        contactEmail: settings.contact_email,
        contactPhone: settings.contact_phone,
        address: settings.address,
        socialMedia: settings.social_media,
        emailSettings: settings.email_settings,
        seo: settings.seo,
        shipping: settings.shipping,
        currency: settings.currency,
        maintenance: settings.maintenance,
      };
      
      await adminApi.updateSiteSettings(transformedSettings);
      alert('Settings saved successfully!');
      loadSettings();
    } catch (error) {
      console.error('Save settings error:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        // Update existing product
        await adminApi.updateProduct(editingProduct.id, productData);
      } else {
        // Create new product
        await adminApi.createProduct(productData);
      }
      setShowProductModal(false);
      loadProducts();
      loadStats();
      alert(`${editingProduct ? 'Updated' : 'Created'} product successfully!`);
    } catch (error) {
      console.error('Save product error:', error);
      alert(`Failed to ${editingProduct ? 'update' : 'create'} product`);
    }
  };

  const menuItems = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products' as Tab, label: 'Products', icon: Package },
    { id: 'orders' as Tab, label: 'Orders', icon: ShoppingCart },
    { id: 'blogs' as Tab, label: 'Blog', icon: FileText },
    { id: 'categories' as Tab, label: 'Categories', icon: Tag },
    { id: 'reviews' as Tab, label: 'Reviews', icon: Star },
    { id: 'users' as Tab, label: 'Users', icon: Users },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 relative z-50"
      >
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
            <AnimatePresence mode="wait">
              {sidebarOpen ? (
                <motion.div
                  key="logo-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Package2 className="w-5 h-5 text-gray-900" />
                  </div>
                  <span className="text-xl font-bold text-white">
                    ATELIER
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="logo-mini"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto"
                >
                  <Package2 className="w-5 h-5 text-gray-900" />
                </motion.div>
              )}
            </AnimatePresence>
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${sidebarOpen ? '' : 'mx-auto'}`} />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="font-medium text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && sidebarOpen && (
                    <motion.div
                      layoutId="activeTab"
                      className="ml-auto w-1.5 h-1.5 bg-gray-900 rounded-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-800">
            {sidebarOpen ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-900">
                      {profile?.fullName?.[0]?.toUpperCase() || 'A'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {profile?.fullName || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{profile?.email}</p>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors group"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={signOut}
                className="w-full p-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5 mx-auto" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-900" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {menuItems.find((item) => item.id === activeTab)?.label}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-900" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gray-900 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {profile?.fullName?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stats.products}</p>
                  <p className="text-sm text-gray-600">Total Products</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stats.orders}</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stats.users}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stats.blogs}</p>
                  <p className="text-sm text-gray-600">Blog Posts</p>
                </motion.div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Add Product</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">View Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Manage Users</span>
                  </button>
                  <button className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all group">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Products</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
                </div>
                <button 
                  onClick={handleCreateProduct}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="font-medium">Add Product</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500">Loading products...</p>
                          </div>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Package className="w-12 h-12 text-gray-300" />
                            <p className="text-gray-500">No products found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                              />
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                                <p className="text-xs text-gray-500 mt-0.5">ID: {product.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                              {product.category_name || 'Uncategorized'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">${product.price.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-lg ${product.stock_quantity > 10 ? 'bg-green-100 text-green-700' : product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                              {product.stock_quantity} units
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleProductStatus(product.id, product.is_active)}
                              className="group relative"
                            >
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${product.is_active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                <Circle className={`w-2 h-2 ${product.is_active ? 'fill-green-600' : 'fill-gray-400'}`} />
                                {product.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Orders</h3>
                  <p className="text-sm text-gray-500 mt-1">Track and manage customer orders</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500">Loading orders...</p>
                          </div>
                        </td>
                      </tr>
                    ) : orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <ShoppingCart className="w-12 h-12 text-gray-300" />
                            <p className="text-gray-500">No orders found</p>
                          </div>
                        </td>
                      </tr>
                    ) : Array.isArray(orders) && orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-indigo-600" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">#{order.id.slice(0, 8)}</p>
                                <p className="text-xs text-gray-500">{order.order_items?.length || 0} items</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{order.user_name}</p>
                              <p className="text-xs text-gray-500">{order.user_email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">${order.total_amount.toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              className={`text-xs font-semibold border-0 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <ShoppingCart className="w-12 h-12 text-gray-300" />
                            <p className="text-gray-500">No orders found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Users</h3>
                  <p className="text-sm text-gray-500 mt-1">Manage user accounts and permissions</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500">Loading users...</p>
                          </div>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Users className="w-12 h-12 text-gray-300" />
                            <p className="text-gray-500">No users found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-base font-bold text-white">
                                  {(user.full_name || user.email)[0].toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{user.full_name || 'No name'}</p>
                                <p className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg ${
                              user.is_admin 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {user.is_admin ? (
                                <Shield className="w-3 h-3" />
                              ) : (
                                <Circle className="w-2 h-2 fill-current" />
                              )}
                              {user.is_admin ? 'Admin' : 'Customer'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleUserAdmin(user.id, user.is_admin)}
                                className={`p-2 rounded-lg transition-colors ${
                                  user.is_admin 
                                    ? 'text-gray-900 hover:bg-gray-100' 
                                    : 'text-gray-900 hover:bg-gray-100'
                                }`}
                                title={user.is_admin ? 'Remove admin' : 'Make admin'}
                              >
                                {user.is_admin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Blogs Content */}
          {activeTab === 'blogs' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Blog Posts</h2>
                <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  New Post
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Post</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Views</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                            <p className="text-gray-500">Loading...</p>
                          </div>
                        </td>
                      </tr>
                    ) : blogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <FileText className="w-12 h-12 text-gray-300" />
                            <p className="text-gray-500">No blog posts found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      blogs.map((blog) => (
                        <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={blog.cover_image}
                                alt={blog.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="max-w-xs">
                                <p className="text-sm font-semibold text-gray-900 line-clamp-1">{blog.title}</p>
                                <p className="text-xs text-gray-500 line-clamp-2">{blog.excerpt}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                              {blog.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Eye className="w-4 h-4" />
                              {blog.views}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleBlogPublish(blog.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                blog.is_published
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <Circle className="w-2 h-2 fill-current" />
                              {blog.is_published ? 'Published' : 'Draft'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(blog.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit post"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete post"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Content */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Site Settings</h2>
                
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                  </div>
                ) : settings ? (
                  <form onSubmit={handleSaveSettings} className="space-y-8">
                    {/* General Settings */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">General Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                          <input
                            type="text"
                            value={settings.site_name}
                            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                          <input
                            type="email"
                            value={settings.contact_email}
                            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                          <textarea
                            value={settings.site_description}
                            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            value={settings.contact_phone}
                            onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                          <input
                            type="text"
                            value={settings.address.street}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              address: { ...settings.address, street: e.target.value } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input
                            type="text"
                            value={settings.address.city}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              address: { ...settings.address, city: e.target.value } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                          <input
                            type="text"
                            value={settings.address.state}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              address: { ...settings.address, state: e.target.value } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                          <input
                            type="text"
                            value={settings.address.zipCode}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              address: { ...settings.address, zipCode: e.target.value } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                          <input
                            type="text"
                            value={settings.address.country}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              address: { ...settings.address, country: e.target.value } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Facebook URL</label>
                          <input
                            type="url"
                            value={settings.social_media.facebook || ''}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              social_media: { ...settings.social_media, facebook: e.target.value } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Instagram URL</label>
                          <input
                            type="url"
                            value={settings.social_media.instagram || ''}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              social_media: { ...settings.social_media, instagram: e.target.value } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Twitter URL</label>
                          <input
                            type="url"
                            value={settings.social_media.twitter || ''}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              social_media: { ...settings.social_media, twitter: e.target.value } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                          <input
                            type="url"
                            value={settings.social_media.youtube || ''}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              social_media: { ...settings.social_media, youtube: e.target.value } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Shipping Settings */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold ($)</label>
                          <input
                            type="number"
                            value={settings.shipping.freeShippingThreshold}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              shipping: { ...settings.shipping, freeShippingThreshold: parseFloat(e.target.value) || 0 } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Standard Shipping Cost ($)</label>
                          <input
                            type="number"
                            value={settings.shipping.standardShippingCost}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              shipping: { ...settings.shipping, standardShippingCost: parseFloat(e.target.value) || 0 } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Express Shipping Cost ($)</label>
                          <input
                            type="number"
                            value={settings.shipping.expressShippingCost}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              shipping: { ...settings.shipping, expressShippingCost: parseFloat(e.target.value) || 0 } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">International Shipping Cost ($)</label>
                          <input
                            type="number"
                            value={settings.shipping.internationalShippingCost}
                            onChange={(e) => setSettings({ 
                              ...settings, 
                              shipping: { ...settings.shipping, internationalShippingCost: parseFloat(e.target.value) || 0 } 
                            })}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Maintenance Mode */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Mode</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Enable Maintenance Mode</p>
                            <p className="text-sm text-gray-600">Temporarily disable your site for maintenance</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSettings({ 
                              ...settings, 
                              maintenance: { ...settings.maintenance, enabled: !settings.maintenance.enabled } 
                            })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                              settings.maintenance.enabled ? 'bg-gray-900' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                settings.maintenance.enabled ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        {settings.maintenance.enabled && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Message</label>
                            <textarea
                              value={settings.maintenance.message}
                              onChange={(e) => setSettings({ 
                                ...settings, 
                                maintenance: { ...settings.maintenance, message: e.target.value } 
                              })}
                              rows={3}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-200">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      >
                        Save Settings
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Failed to load settings</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Categories Content */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Product Categories</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage product categories and organize your inventory</p>
                </div>
                <button 
                  onClick={() => handleCreateCategory()}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Products</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                            <p className="text-gray-500">Loading...</p>
                          </div>
                        </td>
                      </tr>
                    ) : Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {category.image_url ? (
                                <img 
                                  src={category.image_url} 
                                  alt={category.name} 
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Tag className="w-5 h-5 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{category.name}</p>
                                <p className="text-xs text-gray-500">{category.slug}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                            {category.description || 'No description'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">0</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(category.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Edit category"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete category"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Tag className="w-12 h-12 text-gray-300" />
                            <p className="text-gray-500">No categories found</p>
                            <button 
                              onClick={() => handleCreateCategory()}
                              className="mt-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                            >
                              Create your first category
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Content */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
                <p className="text-sm text-gray-500 mt-1">Manage and moderate customer reviews</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Review</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                            <p className="text-gray-500">Loading...</p>
                          </div>
                        </td>
                      </tr>
                    ) : Array.isArray(reviews) && reviews.length > 0 ? (
                      reviews.map((review) => (
                        <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{review.product_name}</p>
                                <p className="text-xs text-gray-500">ID: {review.product_id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{review.user_name}</p>
                              <p className="text-xs text-gray-500">ID: {review.user_id.slice(0, 8)}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-sm font-medium text-gray-900">{review.title}</p>
                            <p className="text-xs text-gray-600 line-clamp-2">{review.comment}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'fill-gray-200 text-gray-200'
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-gray-600 ml-1">{review.rating}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  if (confirm('Delete this review?')) {
                                    adminApi.deleteReview(review.id).then(() => {
                                      loadReviews();
                                    }).catch(() => {
                                      alert('Failed to delete review');
                                    });
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete review"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Star className="w-12 h-12 text-gray-300" />
                            <p className="text-gray-500">No reviews found</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
      <ProductModal 
        isOpen={showProductModal}
        onClose={() => setShowProductModal(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
        categories={categories}
      />
      <CategoryModal 
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: string;
  images: string[];
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  materials: Array<{ name: string; texture?: string }>;
  isFeatured: boolean;
  isActive: boolean;
}

function ProductModal({ 
  isOpen, 
  onClose, 
  product, 
  onSave,
  categories
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  product: Product | null; 
  onSave: (data: any) => void; 
  categories: Category[];
}) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stockQuantity: product?.stock_quantity || 0,
    categoryId: product?.category_id || '',
    images: product?.images || [''],
    sizes: product?.sizes || [''],
    colors: product?.colors || [{ name: '', hex: '' }],
    materials: product?.materials || [{ name: '' }],
    isFeatured: product?.is_featured || false,
    isActive: product?.is_active || true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      slug: product ? undefined : formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
    });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {Array.isArray(categories) && categories.map((category: Category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <button 
                  type="button"
                  onClick={addImage}
                  className="text-sm text-gray-900 hover:text-gray-600 font-medium"
                >
                  + Add Image
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                      placeholder="Image URL"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    {formData.images.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        className="px-3 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm font-medium text-gray-700">Featured Product</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="text-sm font-medium text-gray-700">Active</span>
            </label>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              {product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

function CategoryModal({ 
  isOpen, 
  onClose, 
  category, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  category: Category | null; 
  onSave: (data: any) => void; 
}) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image_url: category?.image_url || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }
    
    // Generate slug if not provided
    let slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    // Ensure slug is not empty
    if (!slug) {
      alert('Could not generate a valid slug. Please provide a category name with alphanumeric characters.');
      return;
    }
    
    // Remove leading/trailing hyphens
    slug = slug.replace(/^-+|-+$/g, '');
    
    // Ensure slug is not empty after cleaning
    if (!slug) {
      alert('Could not generate a valid slug. Please provide a category name with alphanumeric characters.');
      return;
    }
    
    // Ensure slug meets minimum length requirement
    if (slug.length < 2) {
      alert('Slug must be at least 2 characters long.');
      return;
    }
    
    onSave({
      ...formData,
      slug,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="auto-generated if empty"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              {category ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

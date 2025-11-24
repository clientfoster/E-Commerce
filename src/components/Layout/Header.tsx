import { ShoppingBag, User, Menu, Search, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { useWishlistStore } from '../../stores/wishlistStore';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.items);
  const { setCartOpen, setAuthModalOpen, setMobileMenuOpen, setSearchModalOpen } = useUIStore();

  const currentPage = location.pathname.split('/')[1] || 'home';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              ATELIER
            </button>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'home'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/shop')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'shop'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Shop
              </button>
              <button 
                onClick={() => navigate('/blog')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'blog'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Blog
              </button>
              <button 
                onClick={() => navigate('/about')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'about'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'contact'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Contact
              </button>
              
              <button 
                onClick={() => navigate('/compare')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'compare'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Compare
              </button>
              
              {/* Legal Section */}
              <button 
                onClick={() => navigate('/terms')}
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'terms'
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Legal
              </button>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const query = formData.get('search') as string;
                if (query.trim()) {
                  navigate(`/search?q=${encodeURIComponent(query)}`);
                }
              }}
              className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-gray-900"
            >
              <Search className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                className="bg-transparent border-none focus:outline-none text-sm w-32 lg:w-48"
              />
              <button type="submit" className="hidden">Search</button>
            </form>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchModalOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-gray-700" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                user ? navigate('/dashboard') : setAuthModalOpen(true)
              }
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <User className="w-5 h-5 text-gray-700" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => user ? navigate('/wishlist') : setAuthModalOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className="w-5 h-5 text-gray-700" />
              {wishlistItems.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {wishlistItems.length}
                </motion.span>
              )}
            </motion.button>

            {profile?.isAdmin && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/admin')}
                className="hidden md:block px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                Admin
              </motion.button>
            )}

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

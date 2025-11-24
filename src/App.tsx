import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Cart } from './components/Cart/Cart';
import { AuthModal } from './components/Auth/AuthModal';
import { SearchModal } from './components/Search/SearchModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminPage } from './pages/AdminPage';
import { AdminSetupPage } from './pages/AdminSetupPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { ProfilePage } from './pages/ProfilePage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { WishlistPage } from './pages/WishlistPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { FAQPage } from './pages/FAQPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { CategoryPage } from './pages/CategoryPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import ComparePage from './pages/ComparePage';
import { GiftCardsPage } from './pages/GiftCardsPage';
import { GiftCardPurchasePage } from './pages/GiftCardPurchasePage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { useAuthStore } from './stores/authStore';
import { useCartStore } from './stores/cartStore';

function App() {
  const { user, initialize, loading } = useAuthStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user, fetchCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Admin Routes - No Header/Footer */}
      <Route path="/admin" element={<><AdminPage /><AuthModal /></>} />
      <Route path="/setup" element={<AdminSetupPage />} />
      <Route path="/dashboard" element={<UserDashboardPage />} />

      {/* Main App Routes - With Header/Footer */}
      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-white">
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/size-guide" element={<SizeGuidePage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/returns" element={<ReturnsPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/gift-cards" element={<GiftCardsPage />} />
              <Route path="/gift-card/purchase" element={<GiftCardPurchasePage />} />
              <Route path="/order-tracking" element={<OrderTrackingPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
            <Cart />
            <AuthModal />
            <SearchModal />
          </div>
        }
      />
    </Routes>
  );
}

export default App;

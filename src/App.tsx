import { useEffect, useState } from 'react';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { Cart } from './components/Cart/Cart';
import { AuthModal } from './components/Auth/AuthModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { AdminPage } from './pages/AdminPage';
import { useAuthStore } from './stores/authStore';
import { useCartStore } from './stores/cartStore';
import type { Page } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [productSlug, setProductSlug] = useState<string>('');
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

  const handleNavigate = (page: Page, slug?: string) => {
    setCurrentPage(page);
    if (slug) setProductSlug(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />

      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'shop' && <ShopPage onNavigate={handleNavigate} />}
      {currentPage === 'product' && (
        <ProductPage productSlug={productSlug} onNavigate={handleNavigate} />
      )}
      {currentPage === 'checkout' && <CheckoutPage onNavigate={handleNavigate} />}
      {currentPage === 'orders' && <OrdersPage />}
      {currentPage === 'admin' && <AdminPage />}

      <Footer />
      <Cart onNavigate={handleNavigate} />
      <AuthModal />
    </div>
  );
}

export default App;

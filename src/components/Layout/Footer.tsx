import { Instagram, Facebook, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">ATELIER</h3>
            <p className="text-sm text-gray-600">
              Redefining fashion through interactive 3D experiences and timeless design.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/shop')} className="text-sm text-gray-600 hover:text-gray-900">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop')} className="text-sm text-gray-600 hover:text-gray-900">
                  Collections
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/gift-card/purchase')} className="text-sm text-gray-600 hover:text-gray-900">
                  Gift Cards
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/about')} className="text-sm text-gray-600 hover:text-gray-900">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/order-tracking')} className="text-sm text-gray-600 hover:text-gray-900">
                  Order Tracking
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <Instagram className="w-4 h-4 text-gray-700" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <Facebook className="w-4 h-4 text-gray-700" />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-700" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © 2024 Atelier. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

export function Cart() {
  const navigate = useNavigate();
  const { cartOpen, setCartOpen } = useUIStore();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Shopping Bag</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/shop');
                    }}
                    className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="flex gap-4 bg-gray-50 rounded-lg p-4"
                      >
                        <img
                          src={item.product?.images[0] || 'https://via.placeholder.com/100'}
                          alt={item.product?.name}
                          className="w-20 h-20 object-cover rounded-md"
                        />

                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {item.product?.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.size && `Size: ${item.size}`}
                            {item.color && ` • ${item.color}`}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            ${item.product?.price.toFixed(2)}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-gray-200 rounded-full h-fit transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${getTotalPrice().toFixed(2)}
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    disabled={!user}
                    className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {user ? 'Checkout' : 'Sign in to Checkout'}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

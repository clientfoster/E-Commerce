import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useDiscountStore } from '../stores/discountStore';
import { useGiftCardStore } from '../stores/giftcardStore';
import { useCouponStore } from '../stores/couponStore';
import { orderApi } from '../lib/api';
import { DiscountForm } from '../components/Checkout/DiscountForm';
import { GiftCardForm } from '../components/Checkout/GiftCardForm';
import { CouponForm } from '../components/Checkout/CouponForm';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { appliedDiscount } = useDiscountStore();
  const { activeGiftCard } = useGiftCardStore();
  const { appliedCoupon } = useCouponStore();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [giftCardAmount, setGiftCardAmount] = useState(0);
  const [couponAmount, setCouponAmount] = useState(0);

  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0;

    const total = getTotalPrice();

    if (appliedDiscount.discountType === 'percentage') {
      return (total * appliedDiscount.discountValue) / 100;
    } else if (appliedDiscount.discountType === 'fixed') {
      return appliedDiscount.discountValue;
    }

    return 0;
  };

  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const subtotal = getTotalPrice();
      const discountAmount = calculateDiscountAmount();
      const totalAmount = subtotal - discountAmount - giftCardAmount - couponAmount;

      const orderData = {
        userId: user.id,
        subtotal,
        discountAmount,
        giftCardAmount,
        totalAmount,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        billingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        items: items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
          size: item.size || undefined,
          color: item.color || undefined,
          material: item.material || undefined,
          priceAtTime: item.product?.price || 0,
        })),
      };

      await orderApi.createOrder(
        orderData.totalAmount,
        orderData.shippingAddress,
        orderData.billingAddress,
        orderData.items
      );

      await clearCart();
      setOrderPlaced(true);

      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. Redirecting to your orders...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Shipping Information
                </h2>

                {profile?.addresses && profile.addresses.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Use Saved Address
                    </label>
                    <select
                      onChange={(e) => {
                        const addr = profile.addresses?.find(a => a._id === e.target.value);
                        if (addr) {
                          setFormData(prev => ({
                            ...prev,
                            fullName: addr.fullName,
                            phone: addr.phone,
                            address: addr.address,
                            city: addr.city,
                            state: addr.state,
                            zipCode: addr.zipCode,
                            country: addr.country,
                          }));
                        }
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Select an address...</option>
                      {profile.addresses.map(addr => (
                        <option key={addr._id} value={addr._id}>
                          {addr.type.toUpperCase()} - {addr.address}, {addr.city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent md:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent md:col-span-2"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    required
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    required
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Discount
                </h2>
                <DiscountForm />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Gift Card
                </h2>
                <GiftCardForm
                  onApply={setGiftCardAmount}
                  totalAmount={getTotalPrice()}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Coupon
                </h2>
                <CouponForm
                  subtotal={getTotalPrice()}
                  onDiscountApplied={setCouponAmount}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Payment Information
                  </h2>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Card Number"
                    required
                    maxLength={16}
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      required
                      maxLength={5}
                      value={formData.expiryDate}
                      onChange={(e) =>
                        setFormData({ ...formData, expiryDate: e.target.value })
                      }
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      required
                      maxLength={3}
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({ ...formData, cvv: e.target.value })
                      }
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span>Your payment information is secure</span>
                  </div>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Processing...' : `Place Order - ₹${(getTotalPrice() - calculateDiscountAmount() - giftCardAmount - couponAmount).toFixed(2)}`}
              </motion.button>
            </form>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg p-6 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product?.images[0]}
                      alt={item.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">
                        {item.product?.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 mt-6 pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getTotalPrice().toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount ({appliedDiscount.code})</span>
                    <span className="font-medium text-red-600">-₹{calculateDiscountAmount().toFixed(2)}</span>
                  </div>
                )}
                {giftCardAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Gift Card</span>
                    <span className="font-medium text-red-600">-₹{giftCardAmount.toFixed(2)}</span>
                  </div>
                )}
                {couponAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Coupon</span>
                    <span className="font-medium text-red-600">-₹{couponAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{(getTotalPrice() - calculateDiscountAmount() - giftCardAmount - couponAmount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

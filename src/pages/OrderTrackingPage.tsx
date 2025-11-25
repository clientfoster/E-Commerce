import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, ArrowLeft, RotateCcw, AlertCircle } from 'lucide-react';
import { orderApi } from '../lib/api';

interface OrderDetails {
  id: string;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  total_amount: number;
  shipping_address: any;
  created_at: string;
  delivered_at: string | null;
  return_window_closed_at: string | null;
  order_items: any[];
}

const STEPS = [
  { status: 'pending', label: 'Order Placed', icon: Clock },
  { status: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { status: 'packed', label: 'Packed', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await orderApi.getOrderById(orderId!);
      if (data) {
        setOrder(data);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    if (!confirm('Are you sure you want to return this order?')) return;
    try {
      await orderApi.returnOrder(orderId!);
      fetchOrder(); // Refresh status
    } catch (err) {
      alert('Failed to initiate return');
    }
  };

  const getCurrentStepIndex = () => {
    if (!order) return 0;
    if (order.status === 'cancelled' || order.status === 'returned') return -1;
    return STEPS.findIndex(step => step.status === order.status);
  };

  const isReturnEligible = () => {
    if (!order || order.status !== 'delivered') return false;
    if (!order.return_window_closed_at) return false;
    return new Date() < new Date(order.return_window_closed_at);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </button>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Order #{order.id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-500 text-sm">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize
                  ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      order.status === 'returned' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'}`}
                >
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {(order.status !== 'cancelled' && order.status !== 'returned') && (
            <div className="p-6 md:p-8 bg-gray-50 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between relative">
                {/* Vertical Line for Mobile */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 md:hidden" />

                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = index <= currentStepIndex;

                  return (
                    <div key={step.status} className="flex md:flex-col items-center relative z-10 mb-8 md:mb-0 last:mb-0 md:w-full">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 flex-shrink-0
                        ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`ml-4 md:ml-0 md:mt-3 text-sm font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </span>

                      {/* Horizontal Line for Desktop */}
                      {index < STEPS.length - 1 && (
                        <div className={`hidden md:block absolute top-5 left-1/2 w-full h-0.5 -z-10
                          ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}`}
                          style={{ width: '100%' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
                <div className="space-y-4">
                  {order.order_items.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      {item.products && item.products.images && (
                        <img
                          src={item.products.images[0]}
                          alt={item.products.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{item.products?.name || 'Product'}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-gray-900">₹{item.price_at_time.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">{order.shipping_address.address}</p>
                    <p className="text-gray-600">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}</p>
                    <p className="text-gray-600">{order.shipping_address.country}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{order.total_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{order.total_amount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {isReturnEligible() && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Return Available</p>
                        <p className="text-xs text-blue-600 mt-1">
                          You can return this order until {new Date(order.return_window_closed_at!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleReturn}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Return Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
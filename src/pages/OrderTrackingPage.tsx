import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

export function OrderTrackingPage() {
  const [orderId, setOrderId] = useState('');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // Mock tracking data
      const mockTrackingData = {
        id: orderId,
        status: 'shipped',
        estimatedDelivery: '2024-02-15',
        shippedDate: '2024-02-10',
        items: [
          {
            name: 'Premium Cotton T-Shirt',
            quantity: 2,
            price: 29.99,
            image: 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'
          },
          {
            name: 'Designer Jeans',
            quantity: 1,
            price: 89.99,
            image: 'https://images.pexels.com/photos/1082528/pexels-photo-1082528.jpeg'
          }
        ],
        trackingEvents: [
          {
            status: 'order_placed',
            date: '2024-02-09T10:30:00Z',
            description: 'Order has been placed',
            location: 'New York, NY'
          },
          {
            status: 'processing',
            date: '2024-02-09T15:45:00Z',
            description: 'Order is being processed',
            location: 'New York, NY'
          },
          {
            status: 'shipped',
            date: '2024-02-10T09:15:00Z',
            description: 'Order has been shipped',
            location: 'New York, NY'
          },
          {
            status: 'in_transit',
            date: '2024-02-11T14:20:00Z',
            description: 'Package is in transit',
            location: 'Chicago, IL'
          }
        ]
      };
      
      setTrackingData(mockTrackingData);
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'order_placed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'in_transit':
        return <Truck className="w-5 h-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'order_placed':
        return 'Order Placed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'in_transit':
        return 'In Transit';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Tracking</h1>
          <p className="text-gray-600">Track your order status and delivery progress</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="order-id" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="order-id"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="Enter your order ID"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </motion.div>

        {trackingData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Order #{trackingData.id.slice(0, 8)}</h2>
                  <p className="text-gray-600">Shipped on {new Date(trackingData.shippedDate).toLocaleDateString()}</p>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {getStatusText(trackingData.status)}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Items in this order</h3>
                  <div className="space-y-3">
                    {trackingData.items.map((item: any, index: number) => (
                      <div key={index} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Delivery Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="text-gray-600">Estimated Delivery:</span>{' '}
                      <span className="font-medium">{new Date(trackingData.estimatedDelivery).toLocaleDateString()}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Tracking Number:</span>{' '}
                      <span className="font-medium">TRK{trackingData.id.slice(0, 10).toUpperCase()}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-gray-600">Carrier:</span>{' '}
                      <span className="font-medium">DHL Express</span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {trackingData.trackingEvents.map((event: any, index: number) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {getStatusIcon(event.status)}
                        </div>
                        {index < trackingData.trackingEvents.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-1"></div>
                        )}
                      </div>
                      <div className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{getStatusText(event.status)}</h4>
                          <span className="text-sm text-gray-500">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
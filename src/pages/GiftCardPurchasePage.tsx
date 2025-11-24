import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Gift } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useGiftCardStore } from '../stores/giftcardStore';

export function GiftCardPurchasePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createGiftCard, loading, error } = useGiftCardStore();
  
  const [formData, setFormData] = useState({
    amount: 50,
    recipientEmail: '',
    senderName: '',
    message: '',
  });
  
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please log in to purchase a gift card');
      return;
    }
    
    // Generate a random gift card code
    const code = 'GIFT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    
    const giftCardData = {
      code,
      amount: formData.amount,
      balance: formData.amount,
      recipientEmail: formData.recipientEmail || undefined,
      senderName: formData.senderName || undefined,
      message: formData.message || undefined,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    };
    
    const success = await createGiftCard(giftCardData);
    
    if (success) {
      setGiftCardCode(code);
      setPurchaseComplete(true);
    }
  };

  const formatAmount = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const presetAmounts = [25, 50, 75, 100, 150, 200];

  if (purchaseComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Gift Card Purchased!</h1>
            <p className="text-gray-600 mb-6">
              Your gift card has been successfully purchased and is ready to use.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Gift Card Code</h2>
              <div className="text-2xl font-bold text-gray-900 bg-white p-4 rounded border">
                {giftCardCode}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Copy this code and share it with the recipient
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/gift-cards')}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                View All Gift Cards
              </button>
              <button
                onClick={() => navigate('/shop')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Purchase a Gift Card</h1>
          <p className="text-gray-600">Send the perfect gift with an ATELIER gift card</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Amount</h2>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                {presetAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount })}
                    className={`py-3 px-2 rounded-lg border transition-colors ${
                      formData.amount === amount
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {formatAmount(amount)}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Or enter custom amount:</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    step="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personalize</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="senderName"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Email (Optional)
                  </label>
                  <input
                    type="email"
                    id="recipientEmail"
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    placeholder="Enter recipient's email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Add a personal message"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">
                  {formatAmount(formData.amount)}
                </span>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Purchase Gift Card'}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                By purchasing, you agree to our terms and conditions
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
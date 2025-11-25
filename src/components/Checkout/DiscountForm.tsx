import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDiscountStore } from '../../stores/discountStore';

export function DiscountForm() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setDiscount, appliedDiscount, removeDiscount } = useDiscountStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!code.trim()) {
      setError('Please enter a discount code');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would be an API call to validate the discount
      // For now, we'll simulate with a sample discount
      const mockDiscount = {
        code: code.toUpperCase(),
        name: 'Summer Sale',
        description: '20% off your entire order',
        discountType: 'percentage' as const,
        discountValue: 20,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo purposes, accept any code that starts with "DISCOUNT"
      if (code.toUpperCase().startsWith('DISCOUNT')) {
        setDiscount(mockDiscount);
        setCode('');
      } else {
        setError('Invalid discount code');
      }
    } catch (error) {
      console.error('Failed to apply discount:', error);
      setError('Failed to apply discount. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (appliedDiscount) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-green-800">{appliedDiscount.name}</h3>
            <p className="text-sm text-green-700">{appliedDiscount.description}</p>
          </div>
          <button
            onClick={removeDiscount}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Discount Code</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter discount code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Applying...' : 'Apply'}
        </motion.button>
      </form>
      
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-red-600 mt-2"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
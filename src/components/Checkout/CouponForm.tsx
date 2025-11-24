import { useState } from 'react';
import { useCouponStore } from '../../stores/couponStore';
import { couponApi } from '../../lib/api/couponApi';

interface CouponFormProps {
  subtotal: number;
  onDiscountApplied: (discount: number) => void;
}

export function CouponForm({ subtotal, onDiscountApplied }: CouponFormProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { appliedCoupon, setCoupon, removeCoupon } = useCouponStore();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await couponApi.validateCoupon(code, subtotal);
      
      if (response.success && response.data) {
        setCoupon(response.data.coupon);
        onDiscountApplied(response.data.discountAmount);
        setSuccess('Coupon applied successfully!');
      } else {
        setError(response.message || 'Invalid coupon code');
      }
    } catch (err) {
      setError('Failed to apply coupon');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    onDiscountApplied(0);
    setCode('');
    setSuccess('');
  };

  return (
    <div className="border-t border-gray-200 pt-6">
      {appliedCoupon ? (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              Coupon applied: {appliedCoupon.code}
            </p>
            <p className="text-sm text-gray-500">
              {appliedCoupon.name}
            </p>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-sm font-medium text-red-600 hover:text-red-500"
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApplyCoupon} className="flex gap-2">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !code.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50"
          >
            {isLoading ? 'Applying...' : 'Apply'}
          </button>
        </form>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
    </div>
  );
}
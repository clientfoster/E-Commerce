import React, { useState } from 'react';
import { useGiftCardStore } from '../../stores/giftcardStore';

interface GiftCardFormProps {
  onApply: (amount: number) => void;
  totalAmount: number;
}

export function GiftCardForm({ onApply, totalAmount }: GiftCardFormProps) {
  const [code, setCode] = useState('');
  const [amountToUse, setAmountToUse] = useState('');
  const { applyGiftCard, activeGiftCard, loading, error, clearError } = useGiftCardStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code.trim()) {
      return;
    }
    
    clearError();
    
    // If we don't have an active gift card, try to apply the code first
    if (!activeGiftCard) {
      const success = await applyGiftCard(code);
      if (!success) {
        return;
      }
    }
    
    // If we have an active gift card, apply the specified amount
    if (activeGiftCard) {
      const amount = parseFloat(amountToUse) || 0;
      if (amount <= 0) {
        return;
      }
      
      // Make sure amount doesn't exceed gift card balance or total amount
      const maxAmount = Math.min(activeGiftCard.currentBalance, totalAmount);
      const finalAmount = Math.min(amount, maxAmount);
      
      onApply(finalAmount);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    // Clear active gift card when code changes
    if (activeGiftCard) {
      useGiftCardStore.getState().setActiveGiftCard(null);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gift Card</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gift-card-code" className="block text-sm font-medium text-gray-700 mb-1">
            Gift Card Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="gift-card-code"
              value={code}
              onChange={handleCodeChange}
              placeholder="Enter gift card code"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              disabled={loading || !!activeGiftCard}
            />
            {!activeGiftCard && (
              <button
                type="button"
                onClick={() => applyGiftCard(code)}
                disabled={loading || !code.trim()}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            )}
          </div>
        </div>
        
        {activeGiftCard && (
          <div className="p-4 bg-green-50 rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-800">Valid Gift Card</p>
                <p className="text-sm text-green-700 mt-1">
                  Balance: ${activeGiftCard.currentBalance.toFixed(2)}
                </p>
                {activeGiftCard.expiresAt && (
                  <p className="text-xs text-green-600 mt-1">
                    Expires: {new Date(activeGiftCard.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => useGiftCardStore.getState().setActiveGiftCard(null)}
                className="text-green-600 hover:text-green-800"
              >
                Remove
              </button>
            </div>
            
            <div className="mt-4">
              <label htmlFor="amount-to-use" className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Use
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="amount-to-use"
                  value={amountToUse}
                  onChange={(e) => setAmountToUse(e.target.value)}
                  min="0.01"
                  max={Math.min(activeGiftCard.currentBalance, totalAmount)}
                  step="0.01"
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading || !amountToUse || parseFloat(amountToUse) <= 0}
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Max: ${Math.min(activeGiftCard.currentBalance, totalAmount).toFixed(2)}
              </p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-red-50 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
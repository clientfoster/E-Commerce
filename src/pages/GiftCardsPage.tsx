import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';
import { useGiftCardStore } from '../stores/giftcardStore';
import type { IGiftCard } from '../models/GiftCard';

export function GiftCardsPage() {
  const { user } = useAuthStore();
  const { giftCards, loading, getUserGiftCards } = useGiftCardStore();
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getUserGiftCards(); // Uses token, no userId needed
    }
  }, [user]);

  const handleCopyCode = (code: string, cardId: any) => {
    navigator.clipboard.writeText(code);
    setCopiedCardId(cardId.toString());
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Gift Cards</h1>
          <p className="text-gray-600 mb-8">Please log in to view your gift cards.</p>
        </div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Gift Cards</h1>
          <p className="text-gray-600">View and manage your gift cards</p>
        </motion.div>

        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
        ) : giftCards.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No gift cards yet</h3>
            <p className="text-gray-600 mb-6">You don't have any gift cards in your account.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {giftCards.map((card: IGiftCard) => (
                <motion.div
                  key={card._id.toString()}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          ${card.initialAmount.toFixed(2)} Gift Card
                        </h3>
                        {card.isRedeemed && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Redeemed
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Code:</span> {card.code}
                        </div>
                        <div>
                          <span className="font-medium">Balance:</span> ${card.currentBalance.toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span> {card.expiresAt ? formatDate(card.expiresAt) : 'N/A'}
                        </div>
                        {card.recipientEmail && (
                          <div>
                            <span className="font-medium">Recipient:</span> {card.recipientEmail}
                          </div>
                        )}
                      </div>
                      
                      {card.message && (
                        <p className="mt-2 text-sm text-gray-600 italic">
                          "{card.message}"
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      {!card.isRedeemed && card.currentBalance > 0 && (
                        <button
                          onClick={() => handleCopyCode(card.code, card._id)}
                          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                        >
                          {copiedCardId === card._id.toString() ? 'Copied!' : 'Copy Code'}
                        </button>
                      )}
                      
                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
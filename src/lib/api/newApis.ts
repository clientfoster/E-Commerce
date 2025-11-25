interface Review {
    id: string;
    product_id: string;
    product_name: string;
    user_id: string;
    user_name: string;
    rating: number;
    title: string | null;
    comment: string | null;
    created_at: string;
}

const API_URL = '/api';

// Helper function to get auth token
const getAuthToken = () => {
    return localStorage.getItem('auth_token');
};

// Helper function to create auth headers
const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

export interface UserProfile {
    id: string;
    email: string;
    fullName: string | null;
    avatarUrl: string | null;
    isAdmin: boolean;
}

// ... existing API code ...

// Reviews API
export const reviewApi = {
    getProductReviews: async (productId: string) => {
        const response = await fetch(`${API_URL}/reviews/product/${productId}`);
        return response.json();
    },

    submitReview: async (productId: string, rating: number, title?: string, comment?: string) => {
        const response = await fetch(`${API_URL}/reviews`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ productId, rating, title, comment }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit review');
        }

        return response.json();
    },

    updateReview: async (reviewId: string, rating?: number, title?: string, comment?: string) => {
        const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ rating, title, comment }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update review');
        }

        return response.json();
    },

    deleteReview: async (reviewId: string) => {
        const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete review');
        }

        return response.json();
    },
};

// Wishlist API
export const wishlistApi = {
    /**
     * Get user's wishlist items
     * Uses token-based authentication - userId is extracted from JWT token
     */
    getWishlist: async () => {
        try {
            const response = await fetch(`${API_URL}/wishlist`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Failed to fetch wishlist' }));
                throw new Error(error.error || `HTTP ${response.status}: Failed to fetch wishlist`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Wishlist API error:', error);
            throw error instanceof Error ? error : new Error('Failed to fetch wishlist');
        }
    },

    /**
     * Add a product to wishlist
     * @param productId - The product ID to add to wishlist
     */
    addToWishlist: async (productId: string) => {
        try {
            const response = await fetch(`${API_URL}/wishlist`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Failed to add to wishlist' }));
                throw new Error(error.error || `HTTP ${response.status}: Failed to add to wishlist`);
            }

            return await response.json();
        } catch (error) {
            console.error('Add to wishlist API error:', error);
            throw error instanceof Error ? error : new Error('Failed to add to wishlist');
        }
    },

    /**
     * Remove an item from wishlist
     * @param itemId - The wishlist item ID to remove
     */
    removeFromWishlist: async (itemId: string) => {
        try {
            const response = await fetch(`${API_URL}/wishlist/${itemId}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Failed to remove from wishlist' }));
                throw new Error(error.error || `HTTP ${response.status}: Failed to remove from wishlist`);
            }

            return await response.json();
        } catch (error) {
            console.error('Remove from wishlist API error:', error);
            throw error instanceof Error ? error : new Error('Failed to remove from wishlist');
        }
    },

    /**
     * Clear entire wishlist
     * Uses token-based authentication - userId is extracted from JWT token
     */
    clearWishlist: async () => {
        try {
            const response = await fetch(`${API_URL}/wishlist`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Failed to clear wishlist' }));
                throw new Error(error.error || `HTTP ${response.status}: Failed to clear wishlist`);
            }

            return await response.json();
        } catch (error) {
            console.error('Clear wishlist API error:', error);
            throw error instanceof Error ? error : new Error('Failed to clear wishlist');
        }
    },
};

// Coupon API
export const couponApi = {
    validateCoupon: async (code: string) => {
        const response = await fetch(`${API_URL}/coupons/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Invalid coupon code');
        }

        return response.json();
    },

    applyCoupon: async (code: string, orderAmount: number) => {
        const response = await fetch(`${API_URL}/coupons/apply`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, orderAmount }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to apply coupon');
        }

        return response.json();
    },
};

// Gift Card API
export const giftCardApi = {
    purchaseGiftCard: async (amount: number, recipientEmail?: string, recipientName?: string, message?: string) => {
        const response = await fetch(`${API_URL}/giftcards/purchase`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ amount, recipientEmail, recipientName, message }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to purchase gift card');
        }

        return response.json();
    },

    validateGiftCard: async (code: string) => {
        const response = await fetch(`${API_URL}/giftcards/validate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Invalid gift card');
        }

        return response.json();
    },

    redeemGiftCard: async (code: string, amount: number) => {
        const response = await fetch(`${API_URL}/giftcards/redeem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, amount }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to redeem gift card');
        }

        return response.json();
    },

    getBalance: async (code: string) => {
        try {
            const response = await fetch(`${API_URL}/giftcards/balance/${code}`);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Failed to get balance' }));
                throw new Error(error.error || `HTTP ${response.status}: Failed to get gift card balance`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get gift card balance API error:', error);
            throw error instanceof Error ? error : new Error('Failed to get gift card balance');
        }
    },

    /**
     * Get user's purchased gift cards
     * Uses token-based authentication - userId is extracted from JWT token
     */
    getUserGiftCards: async () => {
        try {
            const response = await fetch(`${API_URL}/giftcards/my-cards`, {
                headers: getAuthHeaders(),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please sign in again.');
                }
                const error = await response.json().catch(() => ({ error: 'Failed to fetch gift cards' }));
                throw new Error(error.error || `HTTP ${response.status}: Failed to fetch gift cards`);
            }

            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Get user gift cards API error:', error);
            throw error instanceof Error ? error : new Error('Failed to fetch gift cards');
        }
    },
};

// Newsletter API
export const newsletterApi = {
    subscribe: async (email: string, name?: string) => {
        const response = await fetch(`${API_URL}/newsletter/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to subscribe');
        }

        return response.json();
    },

    unsubscribe: async (email: string) => {
        const response = await fetch(`${API_URL}/newsletter/unsubscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to unsubscribe');
        }

        return response.json();
    },

    getStatus: async (email: string) => {
        const response = await fetch(`${API_URL}/newsletter/status/${email}`);
        return response.json();
    },
};

// Search API
export const searchApi = {
    searchProducts: async (query: string, filters?: { category?: string; minPrice?: number; maxPrice?: number; limit?: number }) => {
        const params = new URLSearchParams({ q: query });
        if (filters?.category) params.append('category', filters.category);
        if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
        if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const response = await fetch(`${API_URL}/search/products?${params}`);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Search failed');
        }

        return response.json();
    },

    getSuggestions: async (query: string, limit?: number) => {
        const params = new URLSearchParams({ q: query });
        if (limit) params.append('limit', String(limit));

        const response = await fetch(`${API_URL}/search/suggestions?${params}`);
        return response.json();
    },
};

// Payment API (Stripe)
export const paymentApi = {
    createPaymentIntent: async (amount: number, currency: string = 'usd', orderId?: string) => {
        const response = await fetch(`${API_URL}/payments/create-intent`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ amount, currency, orderId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create payment intent');
        }

        return response.json();
    },

    confirmPayment: async (paymentIntentId: string, orderId?: string) => {
        const response = await fetch(`${API_URL}/payments/confirm`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ paymentIntentId, orderId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to confirm payment');
        }

        return response.json();
    },

    getPaymentStatus: async (intentId: string) => {
        const response = await fetch(`${API_URL}/payments/status/${intentId}`, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to get payment status');
        }

        return response.json();
    },
};

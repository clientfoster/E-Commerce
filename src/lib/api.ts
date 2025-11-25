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

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
  addresses?: Address[];
}

// Auth API
export const authApi = {
  /**
   * Sign up a new user
   * @param email - User email address
   * @param password - User password (will be hashed on server)
   * @param fullName - User's full name
   */
  signUp: async (email: string, password: string, fullName: string) => {
    try {
      // Validate input
      if (!email || !email.includes('@')) {
        throw new Error('Valid email address is required');
      }
      if (!password || password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      if (!fullName || fullName.trim().length === 0) {
        throw new Error('Full name is required');
      }

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password, fullName: fullName.trim() }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Signup failed' }));
        throw new Error(error.error || `HTTP ${response.status}: Signup failed`);
      }

      return await response.json();
    } catch (error) {
      console.error('Sign up API error:', error);
      throw error instanceof Error ? error : new Error('Failed to create account');
    }
  },

  /**
   * Sign in an existing user
   * @param email - User email address
   * @param password - User password
   */
  signIn: async (email: string, password: string) => {
    try {
      // Validate input
      if (!email || !email.includes('@')) {
        throw new Error('Valid email address is required');
      }
      if (!password) {
        throw new Error('Password is required');
      }

      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid email or password');
        }
        const error = await response.json().catch(() => ({ error: 'Login failed' }));
        throw new Error(error.error || `HTTP ${response.status}: Login failed`);
      }

      return await response.json();
    } catch (error) {
      console.error('Sign in API error:', error);
      throw error instanceof Error ? error : new Error('Failed to sign in');
    }
  },

  /**
   * Get user profile
   * Uses token-based authentication - userId is extracted from JWT token
   */
  getProfile: async () => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          return null;
        }
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Get profile API error:', error);
      return null;
    }
  },

  addAddress: async (address: Address) => {
    try {
      const response = await fetch(`${API_URL}/auth/addresses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to add address' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to add address`);
      }

      return await response.json();
    } catch (error) {
      console.error('Add address API error:', error);
      throw error instanceof Error ? error : new Error('Failed to add address');
    }
  },

  updateAddress: async (addressId: string, address: Address) => {
    try {
      const response = await fetch(`${API_URL}/auth/addresses/${addressId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to update address' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to update address`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update address API error:', error);
      throw error instanceof Error ? error : new Error('Failed to update address');
    }
  },

  deleteAddress: async (addressId: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/addresses/${addressId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to delete address' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to delete address`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete address API error:', error);
      throw error instanceof Error ? error : new Error('Failed to delete address');
    }
  },

  /**
   * Verify token (placeholder - actual verification happens on server)
   * @deprecated Token verification is handled by server
   */
  verifyToken: (token: string) => {
    return token || null;
  },
};

// Cart API
export const cartApi = {
  /**
   * Get user's cart items
   * Uses token-based authentication - userId is extracted from JWT token
   */
  getCart: async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('auth_token');
          throw new Error('Session expired. Please sign in again.');
        }
        const error = await response.json().catch(() => ({ error: 'Failed to fetch cart' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch cart`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get cart API error:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch cart');
    }
  },

  /**
   * Add a product to cart
   * @param productId - The product ID to add
   * @param quantity - Quantity to add (default: 1)
   * @param size - Optional size variant
   * @param color - Optional color variant
   * @param material - Optional material variant
   */
  addToCart: async (
    productId: string,
    quantity: number,
    size?: string,
    color?: string,
    material?: string
  ) => {
    try {
      // Validate input
      if (!productId) {
        throw new Error('Product ID is required');
      }
      if (!quantity || quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      const response = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId, quantity, size, color, material }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to add to cart' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to add to cart`);
      }

      const result = await response.json();

      // Validate response structure
      if (!result || typeof result !== 'object' || !('id' in result)) {
        throw new Error('Invalid response from server');
      }

      return result;
    } catch (error) {
      console.error('Add to cart API error:', error);
      throw error instanceof Error ? error : new Error('Failed to add to cart');
    }
  },

  /**
   * Update cart item quantity
   * @param itemId - The cart item ID to update
   * @param quantity - New quantity (must be > 0)
   */
  updateQuantity: async (itemId: string, quantity: number) => {
    try {
      if (!itemId) {
        throw new Error('Item ID is required');
      }
      if (!quantity || quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }

      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to update quantity' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to update quantity`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update cart quantity API error:', error);
      throw error instanceof Error ? error : new Error('Failed to update cart item quantity');
    }
  },

  /**
   * Remove an item from cart
   * @param itemId - The cart item ID to remove
   */
  removeFromCart: async (itemId: string) => {
    try {
      if (!itemId) {
        throw new Error('Item ID is required');
      }

      const response = await fetch(`${API_URL}/cart/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to remove item' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to remove item from cart`);
      }

      return await response.json();
    } catch (error) {
      console.error('Remove from cart API error:', error);
      throw error instanceof Error ? error : new Error('Failed to remove item from cart');
    }
  },

  /**
   * Clear entire cart
   * Uses token-based authentication - userId is extracted from JWT token
   */
  clearCart: async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to clear cart' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to clear cart`);
      }

      return await response.json();
    } catch (error) {
      console.error('Clear cart API error:', error);
      throw error instanceof Error ? error : new Error('Failed to clear cart');
    }
  },
};

// Product API
export const productApi = {
  getProducts: async (filters?: { categoryId?: string; isActive?: boolean; isFeatured?: boolean; limit?: number; page?: number }) => {
    try {
      const params = new URLSearchParams();
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
      if (filters?.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
      if (filters?.limit) params.append('limit', String(filters.limit));
      if (filters?.page) params.append('page', String(filters.page));

      const response = await fetch(`${API_URL}/products?${params}`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch products' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch products`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get products API error:', error);
      // Return empty result structure on error
      return { products: [], total: 0, page: 1, pages: 0 };
    }
  },

  getProductBySlug: async (slug: string) => {
    try {
      const response = await fetch(`${API_URL}/products/slug/${slug}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const error = await response.json().catch(() => ({ error: 'Failed to fetch product' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch product`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get product by slug API error:', error);
      return null;
    }
  },
};

// Category API
export const categoryApi = {
  getCategories: async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch categories' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch categories`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get categories API error:', error);
      // Return empty array on error to not break the UI
      return [];
    }
  },
};

// Order API
export const orderApi = {
  createOrder: async (
    totalAmount: number,
    shippingAddress: Record<string, string>,
    billingAddress: Record<string, string>,
    items: Array<{
      productId: string;
      quantity: number;
      size?: string;
      color?: string;
      material?: string;
      priceAtTime: number;
    }>
  ) => {
    try {
      // Validate input
      if (!totalAmount || totalAmount <= 0) {
        throw new Error('Invalid order amount');
      }
      if (!items || items.length === 0) {
        throw new Error('Order must contain at least one item');
      }
      if (!shippingAddress || !billingAddress) {
        throw new Error('Shipping and billing addresses are required');
      }

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ totalAmount, shippingAddress, billingAddress, items }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create order' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to create order`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create order API error:', error);
      throw error instanceof Error ? error : new Error('Failed to create order');
    }
  },

  getOrders: async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch orders' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch orders`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get orders API error:', error);
      // Return empty array on error to not break the UI
      return [];
    }
  },

  getOrderById: async (orderId: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch order' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch order`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get order API error:', error);
      return null;
    }
  },

  returnOrder: async (orderId: string) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}/return`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to return order' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to return order`);
      }

      return await response.json();
    } catch (error) {
      console.error('Return order API error:', error);
      throw error instanceof Error ? error : new Error('Failed to return order');
    }
  },
};

// Admin API
export const adminApi = {
  getStats: async () => {
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  getAllProducts: async () => {
    const response = await fetch(`${API_URL}/admin/products`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  deleteProduct: async (productId: string) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to delete product' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to delete product`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete product API error:', error);
      throw error instanceof Error ? error : new Error('Failed to delete product');
    }
  },

  updateProduct: async (productId: string, updates: any) => {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }
      if (!updates || typeof updates !== 'object') {
        throw new Error('Product updates are required');
      }

      const response = await fetch(`${API_URL}/admin/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to update product' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to update product`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update product API error:', error);
      throw error instanceof Error ? error : new Error('Failed to update product');
    }
  },

  createProduct: async (productData: any) => {
    try {
      if (!productData || typeof productData !== 'object') {
        throw new Error('Product data is required');
      }
      if (!productData.name || !productData.price) {
        throw new Error('Product name and price are required');
      }

      const response = await fetch(`${API_URL}/admin/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create product' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to create product`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create product API error:', error);
      throw error instanceof Error ? error : new Error('Failed to create product');
    }
  },

  getAllOrders: async () => {
    const response = await fetch(`${API_URL}/admin/orders`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    await fetch(`${API_URL}/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  toggleUserAdmin: async (userId: string, isAdmin: boolean) => {
    await fetch(`${API_URL}/admin/users/${userId}/admin`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ isAdmin }),
    });
  },

  deleteUser: async (userId: string) => {
    await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },

  // Site Settings
  getSiteSettings: async () => {
    const response = await fetch(`${API_URL}/admin/settings`, {
      headers: getAuthHeaders(),
    });
    return response.json();
  },

  updateSiteSettings: async (settings: any) => {
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings),
    });
    return response.json();
  },

  // Categories
  getAllCategories: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/categories`);

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch categories' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch categories`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get all categories API error:', error);
      // Return empty array on error to not break the UI
      return [];
    }
  },

  createCategory: async (categoryData: any) => {
    try {
      // Convert field names from snake_case to camelCase for the backend
      const transformedData = {
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        imageUrl: categoryData.image_url,
      };

      const response = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create category' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to create category`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create category API error:', error);
      throw error instanceof Error ? error : new Error('Failed to create category');
    }
  },

  updateCategory: async (categoryId: string, updates: any) => {
    try {
      // Convert field names from snake_case to camelCase for the backend
      const transformedData = {
        name: updates.name,
        slug: updates.slug,
        description: updates.description,
        imageUrl: updates.image_url,
      };

      const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to update category' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to update category`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update category API error:', error);
      throw error instanceof Error ? error : new Error('Failed to update category');
    }
  },

  deleteCategory: async (categoryId: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to delete category' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to delete category`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete category API error:', error);
      throw error instanceof Error ? error : new Error('Failed to delete category');
    }
  },

  // Reviews
  getAllReviews: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/reviews`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch reviews' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch reviews`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get all reviews API error:', error);
      throw error instanceof Error ? error : new Error('Failed to fetch reviews');
    }
  },

  deleteReview: async (reviewId: string) => {
    try {
      const response = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to delete review' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to delete review`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete review API error:', error);
      throw error instanceof Error ? error : new Error('Failed to delete review');
    }
  },

  // Coupons
  getAllCoupons: async () => {
    try {
      const response = await fetch(`${API_URL}/admin/coupons`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch coupons' }));
        throw new Error(error.error || `HTTP ${response.status}: Failed to fetch coupons`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Get all coupons API error:', error);
      // Return empty array on error for coupons to not break the UI
      return [];
    }
  },
};

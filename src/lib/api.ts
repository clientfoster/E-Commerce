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

const API_URL = 'http://localhost:5000/api';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isAdmin: boolean;
}

// Auth API
export const authApi = {
  signUp: async (email: string, password: string, fullName: string) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, fullName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    return response.json();
  },

  signIn: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  getProfile: async (userId: string) => {
    const response = await fetch(`${API_URL}/auth/profile/${userId}`);
    
    if (!response.ok) {
      return null;
    }

    return response.json();
  },

  verifyToken: (token: string) => {
    return token || null;
  },
};

// Cart API
export const cartApi = {
  getCart: async (userId: string) => {
    const response = await fetch(`${API_URL}/cart/${userId}`);
    return response.json();
  },

  addToCart: async (
    userId: string,
    productId: string,
    quantity: number,
    size?: string,
    color?: string,
    material?: string
  ) => {
    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, productId, quantity, size, color, material }),
    });

    return response.json();
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
  },

  removeFromCart: async (itemId: string) => {
    await fetch(`${API_URL}/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  clearCart: async (userId: string) => {
    await fetch(`${API_URL}/cart/user/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Product API
export const productApi = {
  getProducts: async (filters?: { categoryId?: string; isActive?: boolean; isFeatured?: boolean; limit?: number; page?: number }) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.isFeatured !== undefined) params.append('isFeatured', String(filters.isFeatured));
    if (filters?.limit) params.append('limit', String(filters.limit));
    if (filters?.page) params.append('page', String(filters.page));

    const response = await fetch(`${API_URL}/products?${params}`);
    return response.json();
  },

  getProductBySlug: async (slug: string) => {
    const response = await fetch(`${API_URL}/products/slug/${slug}`);
    
    if (!response.ok) {
      return null;
    }

    return response.json();
  },
};

// Category API
export const categoryApi = {
  getCategories: async () => {
    const response = await fetch(`${API_URL}/categories`);
    return response.json();
  },
};

// Order API
export const orderApi = {
  createOrder: async (
    userId: string,
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
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, totalAmount, shippingAddress, billingAddress, items }),
    });

    return response.json();
  },

  getOrders: async (userId: string) => {
    const response = await fetch(`${API_URL}/orders/user/${userId}`);
    return response.json();
  },
};

// Admin API
export const adminApi = {
  getStats: async () => {
    const response = await fetch(`${API_URL}/admin/stats`);
    return response.json();
  },

  getAllProducts: async () => {
    const response = await fetch(`${API_URL}/admin/products`);
    return response.json();
  },

  deleteProduct: async (productId: string) => {
    await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'DELETE',
    });
  },

  updateProduct: async (productId: string, updates: any) => {
    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    return response.json();
  },

  createProduct: async (productData: any) => {
    const response = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });

    return response.json();
  },

  getAllOrders: async () => {
    const response = await fetch(`${API_URL}/admin/orders`);
    return response.json();
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    await fetch(`${API_URL}/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  },

  getAllUsers: async () => {
    const response = await fetch(`${API_URL}/admin/users`);
    return response.json();
  },

  toggleUserAdmin: async (userId: string, isAdmin: boolean) => {
    await fetch(`${API_URL}/admin/users/${userId}/admin`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAdmin }),
    });
  },

  deleteUser: async (userId: string) => {
    await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Site Settings
  getSiteSettings: async () => {
    const response = await fetch(`${API_URL}/admin/settings`);
    return response.json();
  },

  updateSiteSettings: async (settings: any) => {
    const response = await fetch(`${API_URL}/admin/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    return response.json();
  },

  // Categories
  getAllCategories: async () => {
    try {
      console.log('Fetching categories from:', `${API_URL}/admin/categories`);
      const response = await fetch(`${API_URL}/admin/categories`);
      
      console.log('Get all categories response status:', response.status);
      
      if (!response.ok) {
        const responseText = await response.text();
        let errorData: any = {};
        try {
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          errorData = { message: responseText || `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('Get all categories error data:', errorData);
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const responseText = await response.text();
      let data: any;
      try {
        data = responseText ? JSON.parse(responseText) : [];
      } catch (parseError) {
        console.warn('Get all categories response is not valid JSON:', responseText);
        data = [];
      }
      
      // Ensure we return an array
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Network or unexpected error during get all categories:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to the server. Please ensure the backend server is running at ' + API_URL);
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  createCategory: async (categoryData: any) => {
    console.log('Creating category with data:', categoryData);
    
    // Convert field names from camelCase to snake_case for the backend
    const transformedData = {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      image_url: categoryData.imageUrl,
    };
    
    try {
      console.log('Sending request to:', `${API_URL}/admin/categories`);
      const response = await fetch(`${API_URL}/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData),
      });
      
      console.log('Category creation response status:', response.status);
      console.log('Category creation response headers:', response.headers);
      
      // Try to get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Category creation response text:', responseText);
      
      if (!response.ok) {
        // Try to parse as JSON, but handle plain text responses too
        let errorData: any = {};
        try {
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          // If parsing fails, use the raw text as the error message
          errorData = { message: responseText || `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('Category creation error data:', errorData);
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Try to parse the response as JSON
      let data: any;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn('Category creation response is not valid JSON:', responseText);
        data = { message: 'Category created successfully but response is not JSON' };
      }
      
      console.log('Category creation successful:', data);
      return data;
    } catch (error) {
      console.error('Network or unexpected error during category creation:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to the server. Please ensure the backend server is running at ' + API_URL);
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  updateCategory: async (categoryId: string, updates: any) => {
    console.log('Updating category:', categoryId, 'with data:', updates);
    
    // Convert field names from camelCase to snake_case for the backend
    const transformedData = {
      name: updates.name,
      slug: updates.slug,
      description: updates.description,
      image_url: updates.imageUrl,
    };
    
    try {
      console.log('Sending request to:', `${API_URL}/admin/categories/${categoryId}`);
      const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transformedData),
      });
      
      console.log('Category update response status:', response.status);
      console.log('Category update response headers:', response.headers);
      
      // Try to get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Category update response text:', responseText);
      
      if (!response.ok) {
        // Try to parse as JSON, but handle plain text responses too
        let errorData: any = {};
        try {
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          // If parsing fails, use the raw text as the error message
          errorData = { message: responseText || `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('Category update error data:', errorData);
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Try to parse the response as JSON
      let data: any;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn('Category update response is not valid JSON:', responseText);
        data = { message: 'Category updated successfully but response is not JSON' };
      }
      
      console.log('Category update successful:', data);
      return data;
    } catch (error) {
      console.error('Network or unexpected error during category update:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to the server. Please ensure the backend server is running at ' + API_URL);
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  deleteCategory: async (categoryId: string) => {
    console.log('Deleting category:', categoryId);
    
    try {
      console.log('Sending request to:', `${API_URL}/admin/categories/${categoryId}`);
      const response = await fetch(`${API_URL}/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      console.log('Category deletion response status:', response.status);
      console.log('Category deletion response headers:', response.headers);
      
      // Try to get response text first to see what we're dealing with
      const responseText = await response.text();
      console.log('Category deletion response text:', responseText);
      
      if (!response.ok) {
        // Try to parse as JSON, but handle plain text responses too
        let errorData: any = {};
        try {
          errorData = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          // If parsing fails, use the raw text as the error message
          errorData = { message: responseText || `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error('Category deletion error data:', errorData);
        throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Try to parse the response as JSON
      let data: any;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.warn('Category deletion response is not valid JSON:', responseText);
        data = { message: 'Category deleted successfully but response is not JSON' };
      }
      
      console.log('Category deletion successful:', data);
      return data;
    } catch (error) {
      console.error('Network or unexpected error during category deletion:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to the server. Please ensure the backend server is running at ' + API_URL);
      }
      throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Reviews
  getAllReviews: async () => {
    const response = await fetch(`${API_URL}/admin/reviews`);
    return response.json();
  },

  deleteReview: async (reviewId: string) => {
    const response = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

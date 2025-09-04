// Optimized API utilities for Capsaicin E-commerce
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Optimized fetch wrapper with timeout and error handling
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout - please try again');
    }
    throw error;
  }
};

export const api = {
  // Auth endpoints
  register: async (email: string, password: string) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/register`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Products endpoints with optimized error handling
  getProducts: async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch products`);
      }
      
      const data = await response.json();
      console.log(`Products fetched: ${data.length} items (Cache: ${response.headers.get('X-Cache') || 'N/A'})`);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  addProduct: async (productData: {
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category: string;
    image_url: string;
  }) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/products`, {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add product');
      }
      
      const result = await response.json();
      console.log('Product added successfully:', result.name);
      return result;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  },

  updateProduct: async (id: string, productData: any) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product');
      }
      
      const result = await response.json();
      console.log('Product updated successfully:', result.name);
      return result;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }
      
      const result = await response.json();
      console.log('Product deleted successfully');
      return result;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Cart and order endpoints (optimized)
  addToCart: async (productId: string, quantity: number, token: string) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to cart');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  createOrder: async (orderData: any, token: string) => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create order');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  // Health check for monitoring
  healthCheck: async () => {
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};

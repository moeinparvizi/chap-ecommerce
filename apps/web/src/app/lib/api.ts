import { demoRequest, isDemoSession } from './demo';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || '/api').replace(/\/$/, '');

async function request(url: string, options?: RequestInit) {
  if (isDemoSession()) return demoRequest(url, options);
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token && !url.startsWith('/auth/')) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    cache: 'no-store',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.message || `API Error: ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Products
  getProducts: () => request('/products'),
  createProduct: (data: any) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => request(`/products/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: async (data: any) => { const result = await request('/categories', { method: 'POST', body: JSON.stringify(data) }); window.dispatchEvent(new Event('categories-updated')); return result; },
  updateCategory: async (id: string, data: any) => { const result = await request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }); window.dispatchEvent(new Event('categories-updated')); return result; },
  deleteCategory: async (id: string) => { const result = await request(`/categories/${id}`, { method: 'DELETE' }); window.dispatchEvent(new Event('categories-updated')); return result; },

  // Orders
  getOrders: () => request('/orders'),
  createOrder: (data: any) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id: string, data: any) => request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteOrder: (id: string) => request(`/orders/${id}`, { method: 'DELETE' }),

  // Marketing - Campaigns
  getCampaigns: () => request('/marketing/campaigns'),
  createCampaign: (data: any) => request('/marketing/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  updateCampaign: (id: string, data: any) => request(`/marketing/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCampaign: (id: string) => request(`/marketing/campaigns/${id}`, { method: 'DELETE' }),

  // Marketing - Coupons
  getCoupons: () => request('/marketing/coupons'),
  createCoupon: (data: any) => request('/marketing/coupons', { method: 'POST', body: JSON.stringify(data) }),
  updateCoupon: (id: string, data: any) => request(`/marketing/coupons/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCoupon: (id: string) => request(`/marketing/coupons/${id}`, { method: 'DELETE' }),

  // Marketing - Banners
  getBanners: () => request('/marketing/banners'),
  createBanner: (data: any) => request('/marketing/banners', { method: 'POST', body: JSON.stringify(data) }),
  updateBanner: (id: string, data: any) => request(`/marketing/banners/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBanner: (id: string) => request(`/marketing/banners/${id}`, { method: 'DELETE' }),

  // Customers
  getCustomers: () => request('/customers'),
  createCustomer: (data: any) => request('/customers', { method: 'POST', body: JSON.stringify(data) }),
  updateCustomer: (id: string, data: any) => request(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCustomer: (id: string) => request(`/customers/${id}`, { method: 'DELETE' }),

  // Comments
  getComments: (userId?: string, productId?: string) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (productId) params.append('productId', productId);
    const q = params.toString() ? `?${params.toString()}` : '';
    return request(`/comments${q}`);
  },
  createComment: (data: any) => request('/comments', { method: 'POST', body: JSON.stringify(data) }),
  replyComment: (id: string, reply: string) => request(`/comments/${id}`, { method: 'PUT', body: JSON.stringify({ reply }) }),
  deleteComment: (id: string) => request(`/comments/${id}`, { method: 'DELETE' }),

  // Reviews
  getReviews: (userId?: string, productId?: string) => {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (productId) params.append('productId', productId);
    const q = params.toString() ? `?${params.toString()}` : '';
    return request(`/reviews${q}`);
  },
  createReview: (data: any) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  deleteReview: (id: string) => request(`/reviews/${id}`, { method: 'DELETE' }),

  // Locations
  getLocations: (userId?: string) => {
    const q = userId ? `?userId=${userId}` : '';
    return request(`/locations${q}`);
  },
  createLocation: (data: any) => request('/locations', { method: 'POST', body: JSON.stringify(data) }),
  updateLocation: (id: string, data: any) => request(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLocation: (id: string) => request(`/locations/${id}`, { method: 'DELETE' }),
  setDefaultLocation: (id: string, userId: string) => request(`/locations/${id}/default`, { method: 'PUT', body: JSON.stringify({ userId }) }),

  // User orders
  getUserOrders: (userId: string) => request(`/orders?userId=${userId}`),

  // Profile
  getProfile: (id: string) => request(`/profile/${id}`),
  updateProfile: (id: string, data: any) => request(`/profile/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Auth
  login: (email: string, password: string) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, name: string, password: string) => process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
    ? request('/customers', { method: 'POST', body: JSON.stringify({ email, name, password }) })
    : request('/auth/register', { method: 'POST', body: JSON.stringify({ email, name, password }) }),

  // Discounts
  getDiscounts: () => request('/discounts'),
  createDiscount: (data: any) => request('/discounts', { method: 'POST', body: JSON.stringify(data) }),
  updateDiscount: (id: string, data: any) => request(`/discounts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteDiscount: (id: string) => request(`/discounts/${id}`, { method: 'DELETE' }),

  // Wishlist
  getWishlist: (userId: string) => request(`/wishlist?userId=${userId}`),
  toggleWishlist: (data: any) => request('/wishlist/toggle', { method: 'POST', body: JSON.stringify(data) }),
  deleteWishlist: (id: string) => request(`/wishlist/${id}`, { method: 'DELETE' }),

  // Markups (hidden)
  getMarkups: () => request('/markups'),
  createMarkup: (data: any) => request('/markups', { method: 'POST', body: JSON.stringify(data) }),
  updateMarkup: (id: string, data: any) => request(`/markups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMarkup: (id: string) => request(`/markups/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: (userId: string) => request(`/notifications?userId=${userId}`),
  markNotificationRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: (userId: string) => request(`/notifications/read-all?userId=${userId}`, { method: 'PUT' }),
  deleteNotification: (id: string) => request(`/notifications/${id}`, { method: 'DELETE' }),
};

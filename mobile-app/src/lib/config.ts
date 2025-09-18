export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const endpoints = {
  products: `${API_BASE_URL}/api/products`,
  productDetail: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  categories: `${API_BASE_URL}/api/categories`,
  cart: `${API_BASE_URL}/api/cart`,
  orders: `${API_BASE_URL}/api/orders`,
  orderDetail: (orderNumber: string) => `${API_BASE_URL}/api/orders/${orderNumber}`,
  wishlist: `${API_BASE_URL}/api/wishlist`,
  users: `${API_BASE_URL}/api/users`,
  notifications: `${API_BASE_URL}/api/notifications`,
  tracking: (trackingNumber: string) => `${API_BASE_URL}/api/tracking/${trackingNumber}`,
  groupBuys: `${API_BASE_URL}/api/group-buys`,
  groupBuyJoin: (id: string) => `${API_BASE_URL}/api/group-buys/${id}/join`,
  reviewsHelpful: (id: string) => `${API_BASE_URL}/api/reviews/${id}/helpful`,
  homepage: `${API_BASE_URL}/api/homepage`,
  paystackInitialize: `${API_BASE_URL}/api/paystack/initialize`,
  paymentVerify: `${API_BASE_URL}/api/payment`,
};

export function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

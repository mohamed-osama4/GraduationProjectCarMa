import api from "./api";

/**
 * Fetch Admin Dashboard data.
 * GET /api/admin/dashboard
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getAdminDashboard = () => {
  return api.get("/api/admin/dashboard");
};

/**
 * Global search for users and orders.
 * GET /api/admin/search?keyword={keyword}
 * @param {string} keyword
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const globalSearch = (keyword) => {
  return api.get(`/api/admin/search?keyword=${keyword}`);
};

/**
 * Fetch Admin Notifications.
 * GET /api/admin/notifications
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getAdminNotifications = () => {
  return api.get("/api/admin/notifications");
};

/**
 * Fetch current admin account info.
 * GET /api/admin/me
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getAccountInfo = () => {
  return api.get("/api/admin/me");
};

/**
 * Fetch all orders.
 * GET /api/orders
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const searchOrders = () => {
  return api.get("/api/orders");
};

/**
 * Update Order Status.
 * PUT /api/orders/{id}
 * @param {string} id
 * @param {number} status
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const updateOrderStatus = (id, status) => {
  return api.put(`/api/orders/${id}`, { orderStatus: status });
};

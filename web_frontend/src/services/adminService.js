import api from "./api";

/**
 * Fetch Admin Dashboard data.
 * GET /admin
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getAdminDashboard = () => {
  return api.get("/admin");
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
 * Search/Fetch all orders.
 * GET /searchOrders
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const searchOrders = () => {
  return api.get("/searchOrders");
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

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
 * Fetch Order details by ID.
 * GET /api/orders/{id}
 * @param {string|number} id
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getOrderById = (id) => {
  return api.get(`/api/orders/${id}`);
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

/**
 * Accept an order.
 * POST /api/orders/{id}/accept
 * @param {string|number} id
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const acceptOrder = (id) => {
  return api.post(`/api/orders/${id}/accept`);
};

/**
 * Reject an order.
 * POST /api/orders/{id}/reject
 * @param {string|number} id
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const rejectOrder = (id) => {
  return api.post(`/api/orders/${id}/reject`);
};

/**
 * Fetch New Notifications with pagination and filters
 * GET /api/new-notifications
 * @param {Object} params { page, pageSize, isRead, type }
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getNewNotifications = (params = {}) => {
  return api.get("/api/new-notifications", { params });
};

/**
 * Fetch Unread Notifications Count
 * GET /api/new-notifications/unread-count
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getUnreadNotificationsCount = () => {
  return api.get("/api/new-notifications/unread-count");
};

/**
 * Mark a notification as read
 * PATCH /api/new-notifications/{id}/read
 * @param {string|number} id
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const markNotificationAsRead = (id) => {
  return api.patch(`/api/new-notifications/${id}/read`);
};

/**
 * Mark all notifications as read
 * PATCH /api/new-notifications/read-all
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const markAllNotificationsAsRead = () => {
  return api.patch(`/api/new-notifications/read-all`);
};

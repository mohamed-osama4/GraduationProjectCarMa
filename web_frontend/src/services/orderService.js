import api from "./api";

/**
 * Create a new order.
 * POST /api/orders
 * @param {{ userId: number, serviceId: number, address: string, phoneNumber: string, paymentMethod: string }} orderData
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const createOrder = (orderData) => {
  return api.post("/api/orders", orderData);
};

/**
 * Get all orders for the current user.
 * GET /api/orders/my-orders (assuming this exists or will be added)
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getMyOrders = () => {
  return api.get("/api/orders/my-orders");
};

import api from "./api";

/**
 * Login with email and password.
 * POST /api/Auth/login
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const login = (credentials) => {
  return api.post("/api/Auth/login", credentials);
};

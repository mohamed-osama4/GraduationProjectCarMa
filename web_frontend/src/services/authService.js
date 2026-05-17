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
/**
 * Get current user profile.
 * GET /api/profile/me
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const getProfile = () => {
  return api.get("/api/profile/me");
};
/**
 * Change current user password.
 * POST /api/change-password/ChangePassword
 * @param {Object} data { currentPassword, newPassword, confirmPassword }
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const changePassword = (data) => {
  return api.post("/api/change-password/ChangePassword", data);
};

/**
 * Upload profile image.
 * POST /api/profile/upload-image
 * @param {File} file
 * @returns {Promise<import("axios").AxiosResponse>}
 */
export const uploadProfileImage = (file) => {
  const formData = new FormData();
  formData.append("File", file);
  return api.post("/api/profile/upload-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


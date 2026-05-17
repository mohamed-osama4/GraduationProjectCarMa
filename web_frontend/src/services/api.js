import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5238/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response interceptor for error handling and URL normalization
api.interceptors.response.use(
  (response) => {
    // Normalize http://carma-backend-api.onrender.com to https://
    if (response.data && typeof response.data === 'object') {
      const normalizeUrls = (obj) => {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'string' && obj[key].startsWith('http://carma-backend-api.onrender.com')) {
              obj[key] = obj[key].replace('http://', 'https://');
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              normalizeUrls(obj[key]);
            }
          }
        }
      };
      normalizeUrls(response.data);
    }
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized (e.g. expired token)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

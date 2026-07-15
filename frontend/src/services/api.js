import axios from "axios";

const api = axios.create({
  // In production Vercel uses VITE_API_URL; locally Vite proxies /api to port 5000.
  baseURL: import.meta.env.VITE_API_URL || "/api",
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Attach token from localStorage (fallback to cookie-based auth on the server)
api.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");
  const token = adminToken || userToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || "Something went wrong";
    return Promise.reject({ ...err, message });
  }
);

export default api;

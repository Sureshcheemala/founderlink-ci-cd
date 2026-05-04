import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log(import.meta.env.VITE_API_URL);

// 🔐 REQUEST INTERCEPTOR (attach token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 RESPONSE INTERCEPTOR (handle errors globally)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Unauthorized → logout user automatically
    if (error.response?.status === 401) {
      console.warn("Unauthorized - logging out");

      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("role");

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
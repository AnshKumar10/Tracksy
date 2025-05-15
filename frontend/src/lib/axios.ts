import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Handle unauthorized access
        localStorage.removeItem("access_token");
        window.location.href = "/login"; // Redirect to login page
      } else if (status === 403) {
        // Handle forbidden access
        console.error("You do not have permission to access this resource.");
      } else if (status >= 500) {
        // Handle server errors
        console.error("Server error. Please try again later.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

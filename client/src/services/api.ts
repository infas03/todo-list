import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem("token") || null;

      if (token) {
        if (!config.headers) {
          config.headers = new axios.AxiosHeaders();
        }
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error accessing localStorage:", error);
    }

    return config;
  },
  (error) => {
    // eslint-disable-next-line no-console
    console.error("Request interceptor error:", error);

    return Promise.reject(error);
  }
);

export default api;

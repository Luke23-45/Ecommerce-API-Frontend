import axios, {
  type AxiosRequestConfig,
  AxiosError,
  type AxiosResponse,
} from "axios";

import { getAppDispatch } from "@/store";

import { logout } from "@/store/slices/authSlice";

import { callRefreshTokenEndpoint } from "@/api/auth/authApi";

const API_BASE_URL = import.meta.env.VITE_ECOMMERCE_API_BASE_URL;

const api = axios.create({
  baseURL: "/api",
  headers: {
//  'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      api(promise.config).then(promise.resolve).catch(promise.reject);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.endsWith("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          console.log("Interceptor: 401 detected, attempting token refresh...");

          await callRefreshTokenEndpoint();

          console.log(
            "Interceptor: Token refresh successful. Retrying failed requests..."
          );
          processQueue(null);

          return api(originalRequest);
        } catch (refreshError: any) {
          console.error(
            "Interceptor: Token refresh failed. Forcing logout.",
            refreshError
          );

          const dispatch = getAppDispatch();

          dispatch(logout());

          processQueue(refreshError);

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
          console.log("Interceptor: Refreshing flag reset.");
        }
      } else {
        console.log(
          "Interceptor: Refresh already in progress. Queueing request..."
        );
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }
    }

    console.error(
      "Interceptor: API Response Error (not a handled 401):",
      error.response || error.message
    );

    return Promise.reject(error);
  }
);

export default api;

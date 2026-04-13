import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const TOKEN_STORAGE_KEY = "auth_token";
const USER_ID_STORAGE_KEY = "auth_user_id";
const USERNAME_STORAGE_KEY = "auth_username";

const clearAuthStorage = () => {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(USER_ID_STORAGE_KEY);
  sessionStorage.removeItem(USERNAME_STORAGE_KEY);

  // Keep cleanup for legacy keys from old localStorage-based auth.
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_ID_STORAGE_KEY);
  localStorage.removeItem(USERNAME_STORAGE_KEY);
};

const axiosClient = axios.create({
  baseURL: "http://localhost:5035/api",
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem(TOKEN_STORAGE_KEY);

    if (token) {
      const headers = AxiosHeaders.from(config.headers);
      headers.set("Authorization", `Bearer ${token}`);
      config.headers = headers;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error.config?.url ?? "");
    const isAuthEndpoint =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      clearAuthStorage();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosClient;

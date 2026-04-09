import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const TOKEN_STORAGE_KEY = "auth_token";

const axiosClient = axios.create({
  baseURL: "http://localhost:5035/api",
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

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
  (error) => Promise.reject(error),
);

export default axiosClient;

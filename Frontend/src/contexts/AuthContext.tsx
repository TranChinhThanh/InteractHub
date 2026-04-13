/* eslint-disable react-refresh/only-export-components */

import { isAxiosError } from "axios";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { login as loginService } from "../services/authService";
import type { ApiResponse, LoginResponseData } from "../types";

const TOKEN_STORAGE_KEY = "auth_token";
const USER_ID_STORAGE_KEY = "auth_user_id";
const USERNAME_STORAGE_KEY = "auth_username";

const clearLegacyLocalStorageAuth = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_ID_STORAGE_KEY);
  localStorage.removeItem(USERNAME_STORAGE_KEY);
};

export interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_STORAGE_KEY);
};

const getInitialUser = (): User | null => {
  const userId = sessionStorage.getItem(USER_ID_STORAGE_KEY);
  const username = sessionStorage.getItem(USERNAME_STORAGE_KEY);

  if (!userId || !username) {
    return null;
  }

  return {
    id: userId,
    username,
  };
};

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => getInitialUser());
  const [token, setToken] = useState<string | null>(() => getInitialToken());

  const login = async (username: string, password: string) => {
    try {
      const response = await loginService({ username, password });

      if (!response.success || !response.data) {
        const apiErrors = response.errors?.length
          ? response.errors
          : ["Đăng nhập thất bại"];
        throw new Error(apiErrors.join(" | "));
      }

      const data = response.data as LoginResponseData;
      const nextUser: User = {
        id: data.userId,
        username: data.username,
      };

      sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
      sessionStorage.setItem(USER_ID_STORAGE_KEY, data.userId);
      sessionStorage.setItem(USERNAME_STORAGE_KEY, data.username);
      clearLegacyLocalStorageAuth();

      setToken(data.token);
      setUser(nextUser);
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorPayload = error.response?.data as
          | ApiResponse<LoginResponseData>
          | undefined;
        const apiErrors = errorPayload?.errors;

        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          throw new Error(apiErrors.join(" | "));
        }

        throw new Error("Đăng nhập thất bại");
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Đăng nhập thất bại");
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_ID_STORAGE_KEY);
    sessionStorage.removeItem(USERNAME_STORAGE_KEY);
    clearLegacyLocalStorageAuth();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = Boolean(token && user);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      logout,
    }),
    [user, token, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };

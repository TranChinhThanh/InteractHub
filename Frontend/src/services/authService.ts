import axiosClient from "../api/axiosClient";
import type {
  ApiResponse,
  LoginResponseData,
  RegisterRequestDto,
} from "../types";

export interface LoginRequestDto {
  username: string;
  password: string;
}

export const login = async (
  payload: LoginRequestDto,
): Promise<ApiResponse<LoginResponseData>> => {
  const response = await axiosClient.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    payload,
  );

  return response.data;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const register = async (
  payload: RegisterRequestDto,
): Promise<ApiResponse<any>> => {
  const response = await axiosClient.post<ApiResponse<any>>(
    "/auth/register",
    payload,
  );

  return response.data;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

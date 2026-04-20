import axiosClient from "../api/axiosClient";
import type {
  ApiResponse,
  LoginResponseData,
  RegisterRequestDto,
  SuccessMessageData,
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

export const register = async (
  payload: RegisterRequestDto,
): Promise<ApiResponse<SuccessMessageData>> => {
  const response = await axiosClient.post<ApiResponse<SuccessMessageData>>(
    "/auth/register",
    payload,
  );

  return response.data;
};

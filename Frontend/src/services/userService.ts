import axiosClient from "../api/axiosClient";
import type {
  ApiResponse,
  UpdateProfileDto,
  UserProfileResponseDto,
} from "../types";

export const getUserProfile = async (
  userId: string,
): Promise<UserProfileResponseDto> => {
  const response = await axiosClient.get<ApiResponse<UserProfileResponseDto>>(
    `/users/${userId}`,
  );

  return response.data.data;
};

export const searchUsers = async (
  query: string,
): Promise<UserProfileResponseDto[]> => {
  const response = await axiosClient.get<ApiResponse<UserProfileResponseDto[]>>(
    `/users/search?q=${encodeURIComponent(query)}`,
  );

  return response.data.data ?? [];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateProfile = async (
  userId: string,
  payload: UpdateProfileDto,
): Promise<ApiResponse<any>> => {
  const response = await axiosClient.put<ApiResponse<any>>(
    `/users/${userId}`,
    payload,
  );

  return response.data;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

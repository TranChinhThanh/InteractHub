import axiosClient from "../api/axiosClient";
import type { ApiResponse, NotificationResponseDto } from "../types";

export const getNotifications = async (): Promise<
  NotificationResponseDto[]
> => {
  const response =
    await axiosClient.get<ApiResponse<NotificationResponseDto[]>>(
      "/notifications",
    );

  return response.data.data;
};

export const markAsRead = async (id: number): Promise<ApiResponse<unknown>> => {
  const response = await axiosClient.put<ApiResponse<unknown>>(
    `/notifications/${id}/read`,
  );

  return response.data;
};

export const deleteNotification = async (
  id: number,
): Promise<ApiResponse<unknown>> => {
  const response = await axiosClient.delete<ApiResponse<unknown>>(
    `/notifications/${id}`,
  );

  return response.data;
};

export const deleteAllNotifications = async (): Promise<
  ApiResponse<unknown>
> => {
  const response = await axiosClient.delete<ApiResponse<unknown>>(
    "/notifications",
  );

  return response.data;
};

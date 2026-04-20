import axiosClient from "../api/axiosClient";
import type {
  ApiResponse,
  DeleteAllNotificationsResponseData,
  NotificationResponseDto,
  SuccessMessageData,
} from "../types";

export const getNotifications = async (): Promise<
  NotificationResponseDto[]
> => {
  const response =
    await axiosClient.get<ApiResponse<NotificationResponseDto[]>>(
      "/notifications",
    );

  return response.data.data;
};

export const markAsRead = async (
  id: number,
): Promise<ApiResponse<SuccessMessageData>> => {
  const response = await axiosClient.put<ApiResponse<SuccessMessageData>>(
    `/notifications/${id}/read`,
  );

  return response.data;
};

export const deleteNotification = async (
  id: number,
): Promise<ApiResponse<SuccessMessageData>> => {
  const response = await axiosClient.delete<ApiResponse<SuccessMessageData>>(
    `/notifications/${id}`,
  );

  return response.data;
};

export const deleteAllNotifications = async (): Promise<
  ApiResponse<DeleteAllNotificationsResponseData>
> => {
  const response =
    await axiosClient.delete<ApiResponse<DeleteAllNotificationsResponseData>>(
      "/notifications",
    );

  return response.data;
};

import axiosClient from "../api/axiosClient";
import type { ApiResponse, CreateReportDto } from "../types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const reportPost = async (
  postId: number,
  payload: CreateReportDto,
): Promise<ApiResponse<any>> => {
  const response = await axiosClient.post<ApiResponse<any>>(
    `/reports/post/${postId}`,
    payload,
  );

  return response.data;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

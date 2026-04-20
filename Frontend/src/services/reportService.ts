import axiosClient from "../api/axiosClient";
import type { ApiResponse, CreateReportDto, ReportResponseDto } from "../types";

export const reportPost = async (
  postId: number,
  payload: CreateReportDto,
): Promise<ApiResponse<ReportResponseDto>> => {
  const response = await axiosClient.post<ApiResponse<ReportResponseDto>>(
    `/reports/post/${postId}`,
    payload,
  );

  return response.data;
};

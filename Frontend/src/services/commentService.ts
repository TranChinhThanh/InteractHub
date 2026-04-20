import axiosClient from "../api/axiosClient";
import type {
  ApiResponse,
  CommentResponseDto,
  CreateCommentDto,
  SuccessMessageData,
} from "../types";

export const getCommentsByPostId = async (
  postId: number,
): Promise<CommentResponseDto[]> => {
  const response = await axiosClient.get<ApiResponse<CommentResponseDto[]>>(
    `/comments/post/${postId}`,
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
};

export const createComment = async (
  postId: number,
  payload: CreateCommentDto,
): Promise<ApiResponse<CommentResponseDto>> => {
  const response = await axiosClient.post<ApiResponse<CommentResponseDto>>(
    `/comments/post/${postId}`,
    payload,
  );

  return response.data;
};

export const deleteComment = async (
  commentId: number,
): Promise<ApiResponse<SuccessMessageData>> => {
  const response = await axiosClient.delete<ApiResponse<SuccessMessageData>>(
    `/comments/${commentId}`,
  );

  return response.data;
};

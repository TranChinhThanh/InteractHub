import axiosClient from "../api/axiosClient";
import type {
  ApiResponse,
  CommentResponseDto,
  CreateCommentDto,
} from "../types";

export const getCommentsByPostId = async (
  postId: number,
): Promise<CommentResponseDto[]> => {
  const response = await axiosClient.get<ApiResponse<CommentResponseDto[]>>(
    `/comments/post/${postId}`,
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const createComment = async (
  postId: number,
  payload: CreateCommentDto,
): Promise<ApiResponse<any>> => {
  const response = await axiosClient.post<ApiResponse<any>>(
    `/comments/post/${postId}`,
    payload,
  );

  return response.data;
};

export const deleteComment = async (
  commentId: number,
): Promise<ApiResponse<any>> => {
  const response = await axiosClient.delete<ApiResponse<any>>(
    `/comments/${commentId}`,
  );

  return response.data;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

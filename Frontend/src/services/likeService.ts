import axiosClient from "../api/axiosClient";
import type { ApiResponse } from "../types";

export interface TogglePostLikeResponseData {
  isLiked: boolean;
}

export const togglePostLike = async (
  postId: number,
): Promise<ApiResponse<TogglePostLikeResponseData>> => {
  const response = await axiosClient.post<
    ApiResponse<TogglePostLikeResponseData>
  >(`/likes/post/${postId}`);

  return response.data;
};

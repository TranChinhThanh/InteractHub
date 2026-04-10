import axiosClient from "../api/axiosClient";
import type { ApiResponse, FriendResponseDto } from "../types";

interface FollowActionResult {
  message: string;
}

export const followUser = async (
  followeeId: string,
): Promise<ApiResponse<FollowActionResult>> => {
  const response = await axiosClient.post<ApiResponse<FollowActionResult>>(
    `/friends/${followeeId}`,
  );

  return response.data;
};

export const unfollowUser = async (
  followeeId: string,
): Promise<ApiResponse<FollowActionResult>> => {
  const response = await axiosClient.delete<ApiResponse<FollowActionResult>>(
    `/friends/${followeeId}`,
  );

  return response.data;
};

export const getFollowers = async (
  userId: string,
): Promise<FriendResponseDto[]> => {
  const response = await axiosClient.get<ApiResponse<FriendResponseDto[]>>(
    `/friends/${userId}/followers`,
  );

  return response.data.data ?? [];
};

export const getFollowing = async (
  userId: string,
): Promise<FriendResponseDto[]> => {
  const response = await axiosClient.get<ApiResponse<FriendResponseDto[]>>(
    `/friends/${userId}/following`,
  );

  return response.data.data ?? [];
};

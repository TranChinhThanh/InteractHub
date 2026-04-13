import axiosClient from "../api/axiosClient";
import type { ApiResponse, CreateStoryDto, StoryResponseDto } from "../types";

export const getActiveStories = async (): Promise<StoryResponseDto[]> => {
  const response =
    await axiosClient.get<ApiResponse<StoryResponseDto[]>>("/stories");

  return response.data.data ?? [];
};

export const createStory = async (
  payload: CreateStoryDto,
): Promise<ApiResponse<StoryResponseDto>> => {
  const response = await axiosClient.post<ApiResponse<StoryResponseDto>>(
    "/stories",
    payload,
  );

  return response.data;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const deleteStory = async (id: number): Promise<ApiResponse<any>> => {
  const response = await axiosClient.delete<ApiResponse<any>>(`/stories/${id}`);

  return response.data;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

import axiosClient from "../api/axiosClient";
import type {
  ApiResponse,
  CreateStoryDto,
  StoryResponseDto,
  SuccessMessageData,
} from "../types";

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

export const deleteStory = async (
  id: number,
): Promise<ApiResponse<SuccessMessageData>> => {
  const response = await axiosClient.delete<ApiResponse<SuccessMessageData>>(
    `/stories/${id}`,
  );

  return response.data;
};

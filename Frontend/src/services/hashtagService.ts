import axiosClient from "../api/axiosClient";
import type { ApiResponse } from "../types";

export const getTrendingHashtags = async (limit = 5): Promise<string[]> => {
  const response = await axiosClient.get<ApiResponse<string[]>>(
    "/hashtags/trending",
    {
      params: { limit },
    },
  );

  return response.data.data ?? [];
};

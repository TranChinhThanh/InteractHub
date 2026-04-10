import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  createStory,
  deleteStory,
  getActiveStories,
} from "../services/storyService";
import type { ApiResponse, CreateStoryDto, StoryResponseDto } from "../types";

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (isAxiosError<ApiResponse<unknown>>(error)) {
    const apiErrors = error.response?.data?.errors;

    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      return apiErrors[0];
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallbackMessage;
};

const formatStoryDate = (createdAt: string): string => {
  const parsedDate = new Date(createdAt);

  if (Number.isNaN(parsedDate.getTime())) {
    return createdAt;
  }

  return parsedDate.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function StoriesBar() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeStory, setActiveStory] = useState<StoryResponseDto | null>(null);

  const {
    data: stories = [],
    isLoading,
    isError,
    error,
  } = useQuery<StoryResponseDto[], Error>({
    queryKey: ["stories"],
    queryFn: getActiveStories,
    staleTime: 1000 * 30,
  });

  const createStoryMutation = useMutation({
    mutationFn: (payload: CreateStoryDto) => createStory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
    onError: (mutationError) => {
      window.alert(getErrorMessage(mutationError, "Tạo tin thất bại."));
    },
  });

  const deleteStoryMutation = useMutation({
    mutationFn: (storyId: number) => deleteStory(storyId),
    onSuccess: () => {
      setActiveStory(null);
      queryClient.invalidateQueries({ queryKey: ["stories"] });
    },
    onError: (mutationError) => {
      window.alert(getErrorMessage(mutationError, "Xóa tin thất bại."));
    },
  });

  const handleCreateStory = () => {
    const inputValue = window.prompt("Nhập nội dung tin (tối đa 24h):");

    if (!inputValue) {
      return;
    }

    const content = inputValue.trim();

    if (content.length === 0) {
      return;
    }

    createStoryMutation.mutate({ content });
  };

  const handleDeleteStory = () => {
    if (!activeStory) {
      return;
    }

    const confirmed = window.confirm("Bạn có chắc muốn xóa tin này?");

    if (!confirmed) {
      return;
    }

    deleteStoryMutation.mutate(activeStory.id);
  };

  return (
    <section className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700">
          Stories
        </h2>
        {isLoading ? (
          <span className="text-xs text-gray-500">Đang tải tin...</span>
        ) : null}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={handleCreateStory}
          disabled={createStoryMutation.isPending}
          className="flex shrink-0 flex-col items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-blue-500 bg-blue-50 text-2xl font-semibold text-blue-600">
            +
          </span>
          <span className="max-w-16 text-center text-xs font-medium text-gray-700">
            {createStoryMutation.isPending ? "Đang tạo" : "Tạo tin"}
          </span>
        </button>

        {stories.map((story) => {
          const initials = story.userName.trim().charAt(0).toUpperCase() || "U";
          const isActive = activeStory?.id === story.id;

          return (
            <button
              key={story.id}
              type="button"
              onClick={() => setActiveStory(story)}
              className="flex shrink-0 flex-col items-center gap-2"
            >
              {story.userAvatarUrl ? (
                <img
                  src={story.userAvatarUrl}
                  alt={story.userName}
                  className={`h-14 w-14 rounded-full object-cover ${
                    isActive
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "ring-1 ring-gray-200"
                  }`}
                />
              ) : (
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full font-semibold text-white ${
                    isActive
                      ? "bg-blue-600 ring-2 ring-blue-500 ring-offset-2"
                      : "bg-gray-500"
                  }`}
                >
                  {initials}
                </div>
              )}

              <span className="max-w-16 truncate text-xs font-medium text-gray-700">
                {story.userName}
              </span>
            </button>
          );
        })}
      </div>

      {isError ? (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error?.message || "Không thể tải danh sách stories."}
        </div>
      ) : null}

      {activeStory !== null ? (
        <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm text-gray-600">
                Đăng bởi
                <span className="ml-1 font-semibold text-gray-800">
                  {activeStory.userName}
                </span>
              </p>
              <p className="text-xs text-gray-500">
                {formatStoryDate(activeStory.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeStory.userId === user?.id ? (
                <button
                  type="button"
                  onClick={handleDeleteStory}
                  disabled={deleteStoryMutation.isPending}
                  className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                >
                  {deleteStoryMutation.isPending ? "Đang xóa..." : "Xóa tin"}
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => setActiveStory(null)}
                className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-gray-400"
              >
                Đóng
              </button>
            </div>
          </div>

          <p className="whitespace-pre-wrap text-sm text-gray-800">
            {activeStory.content}
          </p>

          {activeStory.imageUrl ? (
            <img
              src={activeStory.imageUrl}
              alt="Story"
              className="max-h-[320px] w-full rounded-lg object-cover"
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export default StoriesBar;

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import CommentSection from "./CommentSection";
import type { ApiResponse, PostResponseDto } from "../types";
import { togglePostLike } from "../services/likeService";
import { deletePost } from "../services/postService";

interface PostCardProps {
  post: PostResponseDto;
  currentUserId: string | undefined;
}

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

const formatCreatedAt = (createdAt: string): string => {
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

const mapInfinitePosts = (
  oldData: InfiniteData<PostResponseDto[], number> | undefined,
  mapper: (post: PostResponseDto) => PostResponseDto,
): InfiniteData<PostResponseDto[], number> | undefined => {
  if (!oldData) {
    return oldData;
  }

  return {
    ...oldData,
    pages: oldData.pages.map((page) => page.map(mapper)),
  };
};

function PostCard({ post, currentUserId }: PostCardProps) {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const initials = post.userName.trim().charAt(0).toUpperCase() || "U";
  const canDelete = post.userId === currentUserId;

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      window.alert("Đã xóa");
      queryClient.setQueriesData<InfiniteData<PostResponseDto[], number>>(
        { queryKey: ["posts"] },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page) =>
              page.filter((item) => item.id !== post.id),
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      window.alert(getErrorMessage(error, "Xóa bài viết thất bại."));
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(post.id),
    onSuccess: (response) => {
      const delta = response.data.isLiked ? 1 : -1;

      queryClient.setQueriesData<InfiniteData<PostResponseDto[], number>>(
        { queryKey: ["posts"] },
        (oldData) =>
          mapInfinitePosts(oldData, (item) =>
            item.id === post.id
              ? {
                  ...item,
                  likeCount: Math.max(0, item.likeCount + delta),
                }
              : item,
          ),
      );

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      window.alert(getErrorMessage(error, "Thả tim thất bại."));
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa bài viết này?");

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(post.id);
  };

  const handleToggleLike = () => {
    likeMutation.mutate();
  };

  return (
    <article className="relative rounded-xl bg-white p-5 shadow-sm">
      {canDelete ? (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="absolute right-4 top-4 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
        </button>
      ) : null}

      <header className="mb-3 flex items-center gap-3 pr-20">
        <Link
          to={`/profile/${post.userId}`}
          className="cursor-pointer hover:underline"
        >
          {post.userAvatarUrl ? (
            <img
              src={post.userAvatarUrl}
              alt={post.userName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              {initials}
            </div>
          )}
        </Link>

        <div>
          <Link
            to={`/profile/${post.userId}`}
            className="cursor-pointer font-semibold text-gray-800 hover:underline"
          >
            {post.userName}
          </Link>
          <p className="text-sm text-gray-500">
            {formatCreatedAt(post.createdAt)}
          </p>
        </div>
      </header>

      <p className="whitespace-pre-wrap text-gray-800">{post.content}</p>

      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt="Post"
          className="mt-3 max-h-[420px] w-full rounded-lg object-cover"
        />
      ) : null}

      {post.hashtags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.hashtags.map((tag) => (
            <span
              key={`${post.id}-${tag}`}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <footer className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={likeMutation.isPending}
          className="rounded-md border border-gray-200 px-3 py-1.5 font-medium text-gray-600 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {likeMutation.isPending
            ? "Đang xử lý..."
            : `Lượt thích (${post.likeCount})`}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((previous) => !previous)}
          className="hover:underline"
        >
          {post.commentCount} bình luận
        </button>
      </footer>

      {showComments ? (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <CommentSection postId={post.id} currentUserId={currentUserId} />
        </div>
      ) : null}
    </article>
  );
}

export default PostCard;

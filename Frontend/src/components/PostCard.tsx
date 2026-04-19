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
import { reportPost } from "../services/reportService";

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
  const canReport = currentUserId !== post.userId;

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
                  isLikedByCurrentUser: response.data.isLiked,
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

  const reportMutation = useMutation({
    mutationFn: ({ postId, reason }: { postId: number; reason: string }) =>
      reportPost(postId, { reason }),
    onSuccess: () => {
      window.alert(
        "Đã gửi báo cáo vi phạm thành công. Quản trị viên sẽ xem xét.",
      );
    },
    onError: (error) => {
      window.alert(getErrorMessage(error, "Gửi báo cáo thất bại."));
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

  const handleReport = () => {
    const reason = window.prompt(
      "Nhập lý do báo cáo bài viết này (tối đa 500 ký tự):",
    );

    if (!reason || reason.trim().length === 0) {
      return;
    }

    reportMutation.mutate({
      postId: post.id,
      reason: reason.trim(),
    });
  };

  return (
    <article className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      {canDelete ? (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Xoa bai viet"
        >
          {deleteMutation.isPending ? (
            <span className="text-[10px]">...</span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">
              more_horiz
            </span>
          )}
        </button>
      ) : null}

      {!canDelete && canReport ? (
        <button
          type="button"
          onClick={handleReport}
          disabled={reportMutation.isPending}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Bao cao bai viet"
        >
          {reportMutation.isPending ? (
            <span className="text-[10px]">...</span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">
              more_horiz
            </span>
          )}
        </button>
      ) : null}

      <header className="mb-4 flex items-center gap-3 pr-10">
        <Link to={`/profile/${post.userId}`} className="cursor-pointer">
          {post.userAvatarUrl ? (
            <img
              src={post.userAvatarUrl}
              alt={post.userName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-400 font-semibold text-white">
              {initials}
            </div>
          )}
        </Link>

        <div>
          <Link
            to={`/profile/${post.userId}`}
            className="cursor-pointer font-semibold text-gray-900 hover:underline"
          >
            {post.userName}
          </Link>
          <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
            {formatCreatedAt(post.createdAt)}
          </p>
        </div>
      </header>

      <p className="whitespace-pre-wrap leading-7 text-gray-700">
        {post.content}
      </p>

      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt="Post"
          className="mt-4 max-h-[420px] w-full rounded-2xl border border-gray-100 object-cover"
        />
      ) : null}

      {post.hashtags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.hashtags.map((tag) => (
            <span
              key={`${post.id}-${tag}`}
              className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <footer className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleToggleLike}
            disabled={likeMutation.isPending}
            className="inline-flex items-center gap-1 font-medium text-gray-600 transition hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span
              className={[
                "material-symbols-outlined text-[18px]",
                post.isLikedByCurrentUser ? "text-blue-600" : "text-gray-500",
              ].join(" ")}
            >
              favorite
            </span>
            <span>{likeMutation.isPending ? "..." : post.likeCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowComments((previous) => !previous)}
            className="inline-flex items-center gap-1 font-medium text-gray-600 transition hover:text-blue-700"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>{post.commentCount}</span>
          </button>

          {/* <button
            type="button"
            disabled
            className="inline-flex cursor-default items-center text-gray-400"
            aria-label="Chia se"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button> */}
        </div>

        {/* <span className="material-symbols-outlined text-[18px] text-gray-500">
          bookmark
        </span> */}
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

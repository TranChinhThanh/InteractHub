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
import { useDialog } from "../contexts/DialogContext";
import { togglePostLike } from "../services/likeService";
import { deletePost } from "../services/postService";
import { reportPost } from "../services/reportService";
import { notifyError, notifySuccess, notifyWarning } from "../utils/notify";

interface PostCardProps {
  post: PostResponseDto;
  currentUserId: string | undefined;
  currentUserRole?: string;
  onDeleteSuccess?: (postId: number) => void;
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

interface LikeMutationContext {
  previousPosts?: InfiniteData<PostResponseDto[], number>;
}

const DEFAULT_REPORT_REASON = "User reported this post";

function PostCard({
  post,
  currentUserId,
  currentUserRole,
  onDeleteSuccess,
}: PostCardProps) {
  const queryClient = useQueryClient();
  const { confirm } = useDialog();
  const [showComments, setShowComments] = useState(false);
  const initials = post.userName.trim().charAt(0).toUpperCase() || "U";
  const isAdmin = currentUserRole === "Admin";
  const canDelete = post.userId === currentUserId || isAdmin;
  const canReport = !canDelete && currentUserId !== undefined;

  const deleteMutation = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      notifySuccess("Đã xóa bài viết.");
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
      queryClient.invalidateQueries({ queryKey: ["post", post.id] });
      onDeleteSuccess?.(post.id);
    },
    onError: (error) => {
      notifyError(getErrorMessage(error, "Xóa bài viết thất bại."));
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => togglePostLike(post.id),
    onMutate: async (): Promise<LikeMutationContext> => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData<
        InfiniteData<PostResponseDto[], number>
      >(["posts"]);

      queryClient.setQueryData<InfiniteData<PostResponseDto[], number>>(
        ["posts"],
        (oldData) =>
          mapInfinitePosts(oldData, (item) => {
            if (item.id !== post.id) {
              return item;
            }

            const nextIsLiked = !item.isLikedByCurrentUser;
            const delta = nextIsLiked ? 1 : -1;

            return {
              ...item,
              isLikedByCurrentUser: nextIsLiked,
              likeCount: Math.max(0, item.likeCount + delta),
            };
          }),
      );

      return { previousPosts };
    },
    onError: (error, _variables, context) => {
      queryClient.setQueryData(["posts"], context?.previousPosts);
      notifyError(getErrorMessage(error, "Thả tim thất bại."));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const reportMutation = useMutation({
    mutationFn: (postId: number) =>
      reportPost(postId, { reason: DEFAULT_REPORT_REASON }),
    onSuccess: () => {
      notifyWarning(
        "Đã gửi báo cáo vi phạm thành công. Quản trị viên sẽ xem xét.",
      );
    },
    onError: (error) => {
      notifyError(getErrorMessage(error, "Gửi báo cáo thất bại."));
    },
  });

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: "Xóa bài viết",
      message:
        "Bạn có chắc muốn xóa bài viết này? Hành động này không thể hoàn tác.",
      confirmText: "Xóa",
      cancelText: "Hủy",
      tone: "danger",
    });

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(post.id);
  };

  const handleToggleLike = () => {
    likeMutation.mutate();
  };

  const handleReport = () => {
    reportMutation.mutate(post.id);
  };

  return (
    <article className="relative rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      {canDelete ? (
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="absolute right-4 top-4 inline-flex min-w-20 items-center justify-center rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Xoa bai viet"
        >
          {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
        </button>
      ) : null}

      {!canDelete && canReport ? (
        <button
          type="button"
          onClick={handleReport}
          disabled={reportMutation.isPending}
          className="absolute right-4 top-4 inline-flex min-w-20 items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Bao cao bai viet"
        >
          {reportMutation.isPending ? "Đang gửi..." : "Báo cáo"}
        </button>
      ) : null}

      <header className="mb-4 flex items-center gap-3 pr-28">
        <Link to={`/profile/${post.userId}`} className="cursor-pointer">
          {post.userAvatarUrl ? (
            <img
              src={post.userAvatarUrl}
              alt={post.userName}
              loading="lazy"
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
          loading="lazy"
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
          <CommentSection
            postId={post.id}
            currentUserId={currentUserId}
            currentUserRole={currentUserRole}
          />
        </div>
      ) : null}
    </article>
  );
}

export default PostCard;

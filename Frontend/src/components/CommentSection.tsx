import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import {
  createComment,
  deleteComment,
  getCommentsByPostId,
} from "../services/commentService";
import type { ApiResponse } from "../types";

interface CommentSectionProps {
  postId: number;
  currentUserId: string | undefined;
}

interface CommentFormValues {
  content: string;
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

function CommentSection({ postId, currentUserId }: CommentSectionProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    defaultValues: {
      content: "",
    },
  });

  const { data: comments, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getCommentsByPostId(postId),
    staleTime: 1000 * 30,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CommentFormValues) =>
      createComment(postId, {
        content: payload.content.trim(),
      }),
    onSuccess: () => {
      reset({ content: "" });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      window.alert(getErrorMessage(error, "Tạo bình luận thất bại."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      window.alert(getErrorMessage(error, "Xóa bình luận thất bại."));
    },
  });

  const onSubmit = (payload: CommentFormValues) => {
    createMutation.mutate(payload);
  };

  return (
    <section className="space-y-3">
      {isLoading ? (
        <p className="text-sm text-gray-500">Đang tải bình luận...</p>
      ) : comments && comments.length > 0 ? (
        <div className="space-y-2">
          {comments.map((comment) => {
            const canDelete = comment.userId === currentUserId;
            const isDeleting =
              deleteMutation.isPending &&
              deleteMutation.variables === comment.id;
            const initials =
              comment.userName.trim().charAt(0).toUpperCase() || "U";

            return (
              <article
                key={comment.id}
                className="rounded-lg bg-gray-50 px-3 py-2"
              >
                <div className="flex items-start gap-2">
                  {comment.userAvatarUrl ? (
                    <img
                      src={comment.userAvatarUrl}
                      alt={comment.userName}
                      loading="lazy"
                      className="mt-0.5 h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-semibold text-gray-800">
                        {comment.userName}
                      </span>
                      <span>{formatCreatedAt(comment.createdAt)}</span>
                      {canDelete ? (
                        <button
                          type="button"
                          onClick={() => deleteMutation.mutate(comment.id)}
                          disabled={isDeleting}
                          className="text-red-600 transition hover:underline disabled:cursor-not-allowed disabled:text-red-300"
                        >
                          {isDeleting ? "Đang xóa..." : "Xóa"}
                        </button>
                      ) : null}
                    </div>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Chưa có bình luận nào.</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
        <div className="flex items-start gap-2">
          <input
            type="text"
            placeholder="Viết bình luận..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            disabled={createMutation.isPending}
            {...register("content", {
              required: "Vui lòng nhập bình luận",
              maxLength: {
                value: 500,
                message: "Bình luận tối đa 500 ký tự",
              },
              validate: (value) =>
                value.trim().length > 0 || "Vui lòng nhập bình luận",
            })}
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {createMutation.isPending ? "Đang gửi..." : "Gửi"}
          </button>
        </div>

        {errors.content ? (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        ) : null}
      </form>
    </section>
  );
}

export default CommentSection;

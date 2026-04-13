import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getNotifications, markAsRead } from "../services/notificationService";
import type { ApiResponse, NotificationResponseDto } from "../types";

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

function NotificationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    staleTime: 1000 * 30,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (mutationError) => {
      window.alert(
        getErrorMessage(mutationError, "Đánh dấu thông báo đã đọc thất bại."),
      );
    },
  });

  const handleNotificationClick = (notification: NotificationResponseDto) => {
    if (!notification) {
      return;
    }

    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    if (notification.type === "Follow") {
      const targetUserId = user?.id ?? notification.userId;

      if (targetUserId) {
        navigate(`/profile/${targetUserId}`);
      }

      return;
    }

    if (
      (notification.type === "Like" || notification.type === "Comment") &&
      notification.relatedEntityId
    ) {
      navigate(`/posts/${notification.relatedEntityId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Đang tải thông báo...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600 shadow-sm">
        {getErrorMessage(error, "Tải thông báo thất bại.")}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Chưa có thông báo nào.
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">Thông báo</h1>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const isUnread = !notification.isRead;
          const isMarkingAsRead =
            markAsReadMutation.isPending &&
            markAsReadMutation.variables === notification.id;

          return (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              disabled={isMarkingAsRead}
              className={`w-full rounded-xl border p-4 text-left shadow-sm transition ${
                isUnread
                  ? "border-blue-100 bg-blue-50 hover:border-blue-200"
                  : "border-gray-200 bg-white"
              } ${
                !isMarkingAsRead ? "cursor-pointer" : "cursor-default"
              } ${isMarkingAsRead ? "opacity-70" : ""}`}
            >
              <p className="text-sm font-medium text-gray-800">
                {notification.content}
              </p>
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                <span>{formatCreatedAt(notification.createdAt)}</span>
                <span
                  className={`rounded-full px-2 py-0.5 font-medium ${
                    isUnread
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {isUnread
                    ? isMarkingAsRead
                      ? "Đang cập nhật..."
                      : "Chưa đọc"
                    : "Đã đọc"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default NotificationsPage;

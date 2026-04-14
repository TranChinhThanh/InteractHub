import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  deleteAllNotifications,
  deleteNotification,
  getNotifications,
  markAsRead,
} from "../services/notificationService";
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

  const markAllAsReadMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await Promise.all(ids.map((id) => markAsRead(id)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (mutationError) => {
      window.alert(
        getErrorMessage(
          mutationError,
          "Đánh dấu tất cả thông báo đã đọc thất bại.",
        ),
      );
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (mutationError) => {
      window.alert(getErrorMessage(mutationError, "Xóa thông báo thất bại."));
    },
  });

  const deleteAllNotificationsMutation = useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (mutationError) => {
      window.alert(
        getErrorMessage(mutationError, "Xóa tất cả thông báo thất bại."),
      );
    },
  });

  const unreadNotificationIds =
    notifications?.filter((notification) => !notification.isRead).map((notification) => notification.id) ?? [];
  const hasNotifications = (notifications?.length ?? 0) > 0;
  const hasUnreadNotifications = unreadNotificationIds.length > 0;
  const isMarkingAllAsRead = markAllAsReadMutation.isPending;
  const isDeletingAllNotifications = deleteAllNotificationsMutation.isPending;
  const isBulkActionPending = isMarkingAllAsRead || isDeletingAllNotifications;

  const handleMarkAllAsRead = () => {
    if (!hasUnreadNotifications || isBulkActionPending) {
      return;
    }

    markAllAsReadMutation.mutate(unreadNotificationIds);
  };

  const handleDeleteAllNotifications = () => {
    if (!hasNotifications || isBulkActionPending) {
      return;
    }

    const shouldDeleteAll = window.confirm(
      "Bạn có chắc muốn xóa toàn bộ thông báo?",
    );
    if (!shouldDeleteAll) {
      return;
    }

    deleteAllNotificationsMutation.mutate();
  };

  const handleDeleteNotification = (notificationId: number) => {
    if (isBulkActionPending || deleteNotificationMutation.isPending) {
      return;
    }

    deleteNotificationMutation.mutate(notificationId);
  };

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
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">Thông báo</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            disabled={!hasUnreadNotifications || isBulkActionPending}
            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:border-blue-300 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isMarkingAllAsRead ? "Đang cập nhật..." : "Đánh dấu đã đọc hết"}
          </button>
          <button
            type="button"
            onClick={handleDeleteAllNotifications}
            disabled={!hasNotifications || isBulkActionPending}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeletingAllNotifications ? "Đang xóa..." : "Xóa hết"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => {
          const isUnread = !notification.isRead;
          const isMarkingAsRead =
            markAsReadMutation.isPending &&
            markAsReadMutation.variables === notification.id;
          const isDeleting =
            deleteNotificationMutation.isPending &&
            deleteNotificationMutation.variables === notification.id;
          const isNotificationActionDisabled =
            isMarkingAsRead || isDeleting || isBulkActionPending;

          return (
            <div
              key={notification.id}
              className={`w-full rounded-xl border p-4 text-left shadow-sm transition ${
                isUnread
                  ? "border-blue-100 bg-blue-50 hover:border-blue-200"
                  : "border-gray-200 bg-white"
              } ${isNotificationActionDisabled ? "opacity-70" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  disabled={isNotificationActionDisabled}
                  className={`flex-1 text-left ${
                    isNotificationActionDisabled
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
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
                      {isDeleting || isDeletingAllNotifications
                        ? "Đang xóa..."
                        : isUnread
                          ? isNotificationActionDisabled
                            ? "Đang cập nhật..."
                            : "Chưa đọc"
                          : "Đã đọc"}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteNotification(notification.id)}
                  disabled={isNotificationActionDisabled}
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default NotificationsPage;

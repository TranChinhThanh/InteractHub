import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  deleteAllNotifications,
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

const splitNotificationContent = (
  content: string,
): { actor: string; detail: string } => {
  const trimmedContent = content.trim();

  if (trimmedContent.length === 0) {
    return {
      actor: "InteractHub",
      detail: "",
    };
  }

  const separators = [":", " đã ", " vừa ", " và "];

  for (const separator of separators) {
    const separatorIndex = trimmedContent.indexOf(separator);

    if (separatorIndex <= 0) {
      continue;
    }

    if (separator === ":") {
      return {
        actor: trimmedContent.slice(0, separatorIndex).trim(),
        detail: trimmedContent.slice(separatorIndex + 1).trim(),
      };
    }

    return {
      actor: trimmedContent.slice(0, separatorIndex).trim(),
      detail: trimmedContent.slice(separatorIndex + 1).trim(),
    };
  }

  return {
    actor: "",
    detail: trimmedContent,
  };
};

const getInitials = (name: string): string => {
  const normalizedName = name.trim();

  if (normalizedName.length === 0) {
    return "IH";
  }

  const words = normalizedName.split(/\s+/).filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
};

const avatarBackgroundClasses = [
  "bg-slate-700",
  "bg-blue-700",
  "bg-indigo-700",
  "bg-teal-700",
  "bg-gray-700",
];

const getAvatarClassName = (notificationId: number): string => {
  return avatarBackgroundClasses[
    Math.abs(notificationId) % avatarBackgroundClasses.length
  ];
};

const getTypeBadge = (
  type: string,
): {
  icon: string;
  className: string;
} => {
  const normalizedType = type.toLowerCase();

  if (normalizedType === "like") {
    return {
      icon: "favorite",
      className: "bg-blue-500",
    };
  }

  if (normalizedType === "comment") {
    return {
      icon: "chat",
      className: "bg-green-500",
    };
  }

  if (normalizedType === "follow") {
    return {
      icon: "person_add",
      className: "bg-violet-500",
    };
  }

  if (normalizedType === "report") {
    return {
      icon: "flag",
      className: "bg-red-500",
    };
  }

  return {
    icon: "campaign",
    className: "bg-orange-500",
  };
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
    notifications
      ?.filter((notification) => !notification.isRead)
      .map((notification) => notification.id) ?? [];
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

  const handleNotificationClick = (notification: NotificationResponseDto) => {
    if (!notification) {
      return;
    }

    const normalizedType = notification.type.toLowerCase();

    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    if (normalizedType === "follow") {
      const targetUserId = user?.id ?? notification.userId;

      if (targetUserId) {
        navigate(`/profile/${targetUserId}`);
      }

      return;
    }

    if (
      (normalizedType === "like" ||
        normalizedType === "comment" ||
        normalizedType === "report") &&
      notification.relatedEntityId
    ) {
      navigate(`/posts/${notification.relatedEntityId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        Đang tải thông báo...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-red-600 shadow-sm">
        {getErrorMessage(error, "Tải thông báo thất bại.")}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        Chưa có thông báo nào.
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900">
        Thông báo
      </h1>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleMarkAllAsRead}
          disabled={!hasUnreadNotifications || isBulkActionPending}
          className="rounded-full bg-[#3f5d90] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#344d78] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isMarkingAllAsRead ? "Đang cập nhật..." : "Đánh dấu đã đọc hết"}
        </button>

        <button
          type="button"
          onClick={handleDeleteAllNotifications}
          disabled={!hasNotifications || isBulkActionPending}
          className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
        >
          {isDeletingAllNotifications ? "Đang xóa..." : "Xóa hết"}
        </button>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        {notifications.map((notification, index) => {
          const isUnread = !notification.isRead;
          const isMarkingAsRead =
            markAsReadMutation.isPending &&
            markAsReadMutation.variables === notification.id;
          const isNotificationActionDisabled =
            isMarkingAsRead || isBulkActionPending;

          const { actor, detail } = splitNotificationContent(
            notification.content,
          );
          const avatarSeed = actor.length > 0 ? actor : detail;
          const initials = getInitials(avatarSeed);
          const typeBadge = getTypeBadge(notification.type);
          const hasBottomBorder = index < notifications.length - 1;

          return (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              disabled={isNotificationActionDisabled}
              className={`flex w-full items-start gap-3 px-5 py-4 text-left transition ${
                hasBottomBorder ? "border-b border-gray-100" : ""
              } ${
                isNotificationActionDisabled
                  ? "cursor-default opacity-70"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="relative mt-0.5 shrink-0">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white ${getAvatarClassName(notification.id)}`}
                >
                  {initials}
                </span>

                <span
                  className={`absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full ${typeBadge.className}`}
                >
                  <span className="material-symbols-outlined text-[12px] text-white">
                    {typeBadge.icon}
                  </span>
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[15px] leading-6 text-gray-700">
                  {actor.length > 0 ? (
                    <span className="font-semibold text-gray-900">
                      {actor}{" "}
                    </span>
                  ) : null}
                  <span>{detail}</span>
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {isMarkingAsRead
                    ? "Đang cập nhật..."
                    : formatCreatedAt(notification.createdAt)}
                </p>
              </div>

              <div className="mt-2 flex shrink-0 items-center justify-center pl-2">
                {isUnread ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default NotificationsPage;

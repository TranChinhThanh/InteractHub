import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile, updateProfile } from "../services/userService";
import type { ApiResponse, UpdateProfileDto } from "../types";

interface ProfileFormValues {
  bio: string;
  avatarUrl: string;
}

const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

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

const formatDateJoined = (dateJoined: string): string => {
  const parsedDate = new Date(dateJoined);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateJoined;
  }

  return parsedDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: {
      bio: "",
      avatarUrl: "",
    },
  });

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(userId as string),
    enabled: Boolean(userId),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      bio: profile.bio ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    });
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateProfileDto) =>
      updateProfile(userId as string, payload),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (mutationError) => {
      window.alert(getErrorMessage(mutationError, "Cập nhật hồ sơ thất bại."));
    },
  });

  const canEdit = Boolean(userId && user && user.id === userId);

  const onSubmit = (values: ProfileFormValues) => {
    const nextBio = values.bio.trim();
    const nextAvatarUrl = values.avatarUrl.trim();

    updateMutation.mutate({
      bio: nextBio.length > 0 ? nextBio : null,
      avatarUrl: nextAvatarUrl.length > 0 ? nextAvatarUrl : null,
    });
  };

  if (!userId) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600 shadow-sm">
        Không tìm thấy người dùng.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Đang tải hồ sơ người dùng...
      </div>
    );
  }

  if (isError) {
    const message = getErrorMessage(error, "Tải hồ sơ thất bại.");

    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600 shadow-sm">
        {message}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Không có dữ liệu hồ sơ.
      </div>
    );
  }

  const initials = profile.userName.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <header className="border-b border-gray-100 pb-6 text-center">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.userName}
            className="mx-auto h-28 w-28 rounded-full object-cover"
          />
        ) : (
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-600 text-3xl font-semibold text-white">
            {initials}
          </div>
        )}

        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          {profile.userName}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{profile.email}</p>
      </header>

      <section className="mt-6 space-y-3 text-sm text-gray-700">
        <p>
          <span className="font-semibold text-gray-800">Ngày tham gia:</span>{" "}
          {formatDateJoined(profile.dateJoined)}
        </p>
        <p>
          <span className="font-semibold text-gray-800">Vai trò:</span>{" "}
          {profile.role}
        </p>
        <p className="whitespace-pre-wrap break-words">
          <span className="font-semibold text-gray-800">Bio:</span>{" "}
          {profile.bio && profile.bio.trim().length > 0
            ? profile.bio
            : "Chưa có mô tả."}
        </p>
      </section>

      {canEdit ? (
        <section className="mt-6 border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={() => setIsEditing((previous) => !previous)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-600"
          >
            {isEditing ? "Đóng chỉnh sửa" : "Chỉnh sửa hồ sơ"}
          </button>

          {isEditing ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 space-y-4 rounded-lg bg-gray-50 p-4"
            >
              <div className="space-y-1">
                <label
                  htmlFor="bio"
                  className="text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows={4}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  disabled={updateMutation.isPending}
                  {...register("bio", {
                    maxLength: {
                      value: 500,
                      message: "Bio tối đa 500 ký tự",
                    },
                  })}
                />
                {errors.bio ? (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                ) : null}
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="avatarUrl"
                  className="text-sm font-medium text-gray-700"
                >
                  Avatar URL
                </label>
                <input
                  id="avatarUrl"
                  type="text"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  disabled={updateMutation.isPending}
                  placeholder="https://example.com/avatar.jpg"
                  {...register("avatarUrl", {
                    validate: (value) => {
                      const trimmedValue = value.trim();

                      if (trimmedValue.length === 0) {
                        return true;
                      }

                      return (
                        urlRegex.test(trimmedValue) || "Avatar URL không hợp lệ"
                      );
                    },
                  })}
                />
                {errors.avatarUrl ? (
                  <p className="text-sm text-red-500">
                    {errors.avatarUrl.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </form>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

export default ProfilePage;

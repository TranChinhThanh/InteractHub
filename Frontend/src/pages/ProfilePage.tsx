import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import PostSkeleton from "../components/PostSkeleton";
import { useAuth } from "../contexts/AuthContext";
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../services/friendService";
import { getPostsByUser } from "../services/postService";
import { getUserProfile, updateProfile } from "../services/userService";
import type { ApiResponse, PostResponseDto, UpdateProfileDto } from "../types";

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
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
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

  const { data: followers = [] } = useQuery({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId as string),
    enabled: Boolean(userId),
    staleTime: 1000 * 60,
  });

  const { data: following = [] } = useQuery({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId as string),
    enabled: Boolean(userId),
    staleTime: 1000 * 60,
  });

  const {
    data: userPostsData,
    isLoading: isUserPostsLoading,
    isError: isUserPostsError,
    error: userPostsError,
    hasNextPage: hasNextUserPostsPage,
    fetchNextPage: fetchNextUserPostsPage,
    isFetchingNextPage: isFetchingNextUserPostsPage,
  } = useInfiniteQuery<
    PostResponseDto[],
    Error,
    InfiniteData<PostResponseDto[], number>,
    string[],
    number
  >({
    queryKey: ["posts", "user", userId ?? ""],
    enabled: Boolean(userId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getPostsByUser(userId as string, pageParam, 10),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
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

  const followMutation = useMutation({
    mutationFn: () => followUser(userId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers", userId] });
      queryClient.invalidateQueries({ queryKey: ["following", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["followers", user?.id] });
    },
    onError: (mutationError) => {
      window.alert(getErrorMessage(mutationError, "Theo dõi thất bại."));
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowUser(userId as string),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers", userId] });
      queryClient.invalidateQueries({ queryKey: ["following", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["followers", user?.id] });
    },
    onError: (mutationError) => {
      window.alert(getErrorMessage(mutationError, "Hủy theo dõi thất bại."));
    },
  });

  const canEdit = Boolean(userId && user && user.id === userId);
  const canFollow = Boolean(userId && user && user.id !== userId);
  const isFollowing = Boolean(
    user?.id && followers.some((follower) => follower.userId === user.id),
  );
  const userPosts = userPostsData?.pages.flatMap((page) => page) ?? [];

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
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="h-36 bg-gradient-to-b from-slate-400 via-slate-300 to-slate-200" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.userName}
                loading="lazy"
                className="h-24 w-24 rounded-2xl border-4 border-white object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-blue-600 text-2xl font-semibold text-white shadow-sm">
                {initials}
              </div>
            )}

            {canEdit ? (
              <button
                type="button"
                onClick={() => setIsEditing((previous) => !previous)}
                className="rounded-full bg-[#3f5d90] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#344d78]"
              >
                {isEditing ? "Đóng chỉnh sửa" : "Chỉnh sửa trang cá nhân"}
              </button>
            ) : null}

            {canFollow ? (
              <button
                type="button"
                onClick={() => {
                  if (isFollowing) {
                    unfollowMutation.mutate();
                    return;
                  }

                  followMutation.mutate();
                }}
                disabled={
                  followMutation.isPending || unfollowMutation.isPending
                }
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {followMutation.isPending || unfollowMutation.isPending
                  ? "Đang xử lý..."
                  : isFollowing
                    ? "Hủy theo dõi"
                    : "Theo dõi"}
              </button>
            ) : null}
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900">
            {profile.userName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">@{profile.userName}</p>

          <p className="mt-4 max-w-2xl whitespace-pre-wrap break-words text-[15px] leading-7 text-gray-700">
            {profile.bio && profile.bio.trim().length > 0
              ? profile.bio
              : "Chưa có mô tả."}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-gray-700">
            <button
              type="button"
              onClick={() => {
                setShowFollowers(true);
                setShowFollowing(false);
              }}
              className="hover:underline"
            >
              <span className="font-semibold text-gray-900">
                {followers.length}
              </span>{" "}
              Followers
            </button>
            <button
              type="button"
              onClick={() => {
                setShowFollowing(true);
                setShowFollowers(false);
              }}
              className="hover:underline"
            >
              <span className="font-semibold text-gray-900">
                {following.length}
              </span>{" "}
              Following
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">
            <p>
              <span className="font-semibold text-gray-800">
                Ngày tham gia:
              </span>{" "}
              {formatDateJoined(profile.dateJoined)}
            </p>
            {/* <p>
              <span className="font-semibold text-gray-800">Vai trò:</span>{" "}
              {profile.role}
            </p> */}
          </div>
        </div>
      </section>

      <section className="space-y-3 text-sm text-gray-700">
        {showFollowers ? (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800">Follower</h2>
            {followers.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">
                Chưa có follower nào.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {followers.map((follower) => {
                  const displayName = follower.userName || "Unknown User";

                  return (
                    <li
                      key={follower.userId}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
                    >
                      <Link
                        to={`/profile/${follower.userId}`}
                        className="h-10 w-10 overflow-hidden rounded-full bg-gray-200"
                      >
                        {follower.avatarUrl ? (
                          <img
                            src={follower.avatarUrl}
                            alt={displayName}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Link>

                      <Link
                        to={`/profile/${follower.userId}`}
                        className="text-sm font-semibold text-gray-800 hover:underline"
                      >
                        {displayName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}

        {showFollowing ? (
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800">Following</h2>
            {following.length === 0 ? (
              <p className="mt-2 text-sm text-gray-600">Chưa theo dõi ai.</p>
            ) : (
              <ul className="mt-3 space-y-3">
                {following.map((followingUser) => {
                  const displayName = followingUser.userName || "Unknown User";

                  return (
                    <li
                      key={followingUser.userId}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3"
                    >
                      <Link
                        to={`/profile/${followingUser.userId}`}
                        className="h-10 w-10 overflow-hidden rounded-full bg-gray-200"
                      >
                        {followingUser.avatarUrl ? (
                          <img
                            src={followingUser.avatarUrl}
                            alt={displayName}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Link>

                      <Link
                        to={`/profile/${followingUser.userId}`}
                        className="text-sm font-semibold text-gray-800 hover:underline"
                      >
                        {displayName}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}

        {canEdit && isEditing ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
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

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Bài viết</h2>

        {isUserPostsLoading ? (
          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <PostSkeleton key={`profile-post-skeleton-${index}`} />
            ))}
          </div>
        ) : null}

        {isUserPostsError ? (
          <div className="mt-3 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {getErrorMessage(
              userPostsError,
              "Tải bài viết của người dùng thất bại.",
            )}
          </div>
        ) : null}

        {!isUserPostsLoading && !isUserPostsError && userPosts.length === 0 ? (
          <div className="mt-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
            Người dùng chưa có bài viết nào.
          </div>
        ) : null}

        {!isUserPostsLoading && !isUserPostsError && userPosts.length > 0 ? (
          <div className="mt-4 space-y-4">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={user?.id} />
            ))}

            {hasNextUserPostsPage ? (
              <button
                type="button"
                onClick={() => fetchNextUserPostsPage()}
                disabled={isFetchingNextUserPostsPage}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
              >
                {isFetchingNextUserPostsPage
                  ? "Đang tải..."
                  : "Tải thêm bài viết"}
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default ProfilePage;

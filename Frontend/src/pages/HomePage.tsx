import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import StoriesBar from "../components/StoriesBar";
import { useAuth } from "../contexts/AuthContext";
import { getPosts } from "../services/postService";
import type { PostResponseDto } from "../types";

function HomePage() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    PostResponseDto[],
    Error,
    InfiniteData<PostResponseDto[], number>,
    string[],
    number
  >({
    queryKey: ["posts"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getPosts(pageParam, 10),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length + 1 : undefined,
    staleTime: 1000 * 60,
  });

  const posts = data?.pages.flatMap((page) => page) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <StoriesBar />
        <CreatePostForm />
        <div className="rounded-xl bg-white p-6 shadow-sm">
          Đang tải danh sách bài viết...
        </div>
      </div>
    );
  }

  if (isError) {
    const message =
      error instanceof Error ? error.message : "Tải bài viết thất bại";

    return (
      <div className="space-y-6">
        <StoriesBar />
        <CreatePostForm />
        <div className="rounded-xl bg-red-50 p-6 text-red-600 shadow-sm">
          {message}
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="space-y-6">
        <StoriesBar />
        <CreatePostForm />
        <div className="rounded-xl bg-white p-6 shadow-sm">
          Chưa có bài viết nào.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StoriesBar />
      <CreatePostForm />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={user?.id} />
        ))}

        {hasNextPage ? (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-blue-500 hover:text-blue-700 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
            >
              {isFetchingNextPage ? "Đang tải..." : "Tải thêm bài viết"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HomePage;

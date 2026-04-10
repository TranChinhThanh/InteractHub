import { useQuery } from "@tanstack/react-query";
import CreatePostForm from "../components/CreatePostForm";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";
import { getPosts } from "../services/postService";

function HomePage() {
  const { user } = useAuth();

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts", 1, 10],
    queryFn: () => getPosts(1, 10),
    staleTime: 1000 * 60,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
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
        <CreatePostForm />
        <div className="rounded-xl bg-white p-6 shadow-sm">
          Chưa có bài viết nào.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreatePostForm />

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} currentUserId={user?.id} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;

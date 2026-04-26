import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useAuth } from "../contexts/AuthContext";
import { getPostById } from "../services/postService";

function PostDetailPage() {
  const { user } = useAuth();
  const { postId } = useParams();

  const parsedPostId = Number(postId);
  const isValidPostId = Number.isInteger(parsedPostId) && parsedPostId > 0;

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post", parsedPostId],
    queryFn: () => getPostById(parsedPostId),
    enabled: isValidPostId,
    staleTime: 1000 * 30,
  });

  if (!isValidPostId) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600 shadow-sm">
        ID bài viết không hợp lệ.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        Đang tải bài viết...
      </div>
    );
  }

  if (isError || !post) {
    const message =
      error instanceof Error ? error.message : "Tải bài viết thất bại.";

    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600 shadow-sm">
        {message}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PostCard
        post={post}
        currentUserId={user?.id}
        currentUserRole={user?.role}
      />
    </div>
  );
}

export default PostDetailPage;

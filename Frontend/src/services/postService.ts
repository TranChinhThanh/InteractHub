import axiosClient from "../api/axiosClient";
import type {
  ApiResponse,
  PostListResponseData,
  PostResponseDto,
} from "../types";

interface BackendPostAuthorDto {
  id: string;
  username: string;
}

interface BackendPostResponseDto {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  hashtags: string[];
  isLikedByCurrentUser?: boolean;
  author?: BackendPostAuthorDto;
  userId?: string;
  userName?: string;
  userAvatarUrl?: string | null;
  likeCount?: number;
  commentCount?: number;
}

interface BackendPostListResponseData {
  items: BackendPostResponseDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

const normalizePost = (post: BackendPostResponseDto): PostResponseDto => {
  return {
    id: post.id,
    userId: post.userId ?? post.author?.id ?? "",
    userName: post.userName ?? post.author?.username ?? "Unknown",
    userAvatarUrl: post.userAvatarUrl ?? null,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt,
    likeCount: post.likeCount ?? 0,
    isLikedByCurrentUser: post.isLikedByCurrentUser ?? false,
    commentCount: post.commentCount ?? 0,
    hashtags: Array.isArray(post.hashtags) ? post.hashtags : [],
  };
};

export const getPosts = async (
  pageNumber = 1,
  pageSize = 10,
): Promise<PostResponseDto[]> => {
  const response = await axiosClient.get<
    ApiResponse<BackendPostListResponseData>
  >("/posts", {
    params: {
      pageNumber,
      pageSize,
    },
  });

  const payload: PostListResponseData = {
    items: response.data.data.items.map((item) => normalizePost(item)),
    pageNumber: response.data.data.pageNumber,
    pageSize: response.data.data.pageSize,
    totalCount: response.data.data.totalCount,
  };

  return payload.items;
};

export const getPostById = async (id: number): Promise<PostResponseDto> => {
  const response = await axiosClient.get<ApiResponse<BackendPostResponseDto>>(
    `/posts/${id}`,
  );

  return normalizePost(response.data.data);
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const createPost = async (data: FormData): Promise<ApiResponse<any>> => {
  const contentValue = data.get("Content");
  const content = typeof contentValue === "string" ? contentValue : "";
  const imageValue = data.get("Image");

  const response =
    imageValue instanceof File
      ? await axiosClient.post<ApiResponse<any>>("/posts/with-image", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      : await axiosClient.post<ApiResponse<any>>("/posts", {
          content,
        });

  return response.data;
};

export const deletePost = async (postId: number): Promise<ApiResponse<any>> => {
  const response = await axiosClient.delete<ApiResponse<any>>(
    `/posts/${postId}`,
  );
  return response.data;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

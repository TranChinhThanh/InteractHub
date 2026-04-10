export interface ApiResponse<T> {
  success: boolean;
  data: T;
  errors: string[];
}

export interface LoginResponseData {
  token: string;
  userId: string;
  username: string;
  expiresAtUtc: string;
}

export interface RegisterRequestDto {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export interface PostResponseDto {
  id: number;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  hashtags: string[];
}

export interface PostListResponseData {
  items: PostResponseDto[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface CommentResponseDto {
  id: number;
  postId: number;
  userId: string;
  userName: string;
  userAvatarUrl: string | null;
  content: string;
  createdAt: string;
}

export interface CreateCommentDto {
  content: string;
}

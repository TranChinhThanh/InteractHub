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

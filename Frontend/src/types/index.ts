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

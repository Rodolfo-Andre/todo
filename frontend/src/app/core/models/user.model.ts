export interface User {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  isActive: boolean;
  roles: string[];
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  fullName: string;
}

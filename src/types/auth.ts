export interface IUser {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  isActive: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginResponseData {
  userId: string;
  email: string;
  roles: string[];
}

export interface RefreshTokenResponseData {
  userId: string;
  roles: string[];
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success?: boolean;
}

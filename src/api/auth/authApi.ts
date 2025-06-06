import api from "..";
import {
  type User,
  type LoginCredentials,
  type RegisterPayload,
  type LoginResponseData,
  type RefreshTokenResponseData,
  type VerifyOtpPayload,
  type ResendOtpPayload,
  type ApiResponse,
} from "@/types/auth";
export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponseData> => {
  console.log("API: Attempting login...");

  const response = await api.post<ApiResponse<LoginResponseData>>(
    "/auth/login",
    credentials
  );
  console.log("API: Login response received.", response.data);
  return response.data.data;
};

export const registerUser = async (
  payload: RegisterPayload
): Promise<ApiResponse<any>> => {
  console.log("API: Attempting registration...");

  const response = await api.post<ApiResponse<any>>("/auth/register", payload);
  console.log("API: Registration response received.", response.data);
  return response.data;
};

export const verifyEmailWithOtp = async (
  payload: VerifyOtpPayload
): Promise<ApiResponse<any>> => {
  console.log("API: Attempting email verification...");
  const response = await api.post<ApiResponse<any>>(
    "/auth/verifyemailwithotp",
    payload
  );
  console.log("API: Verification response received.", response.data);
  return response.data;
};

export const resendPendingRegistrationOtp = async (
  payload: ResendOtpPayload
): Promise<ApiResponse<any>> => {
  console.log("API: Attempting to resend OTP...");
  const response = await api.post<ApiResponse<any>>(
    "/auth/resendpendingpegistrationotp",
    payload
  );
  console.log("API: Resend OTP response received.", response.data);
  return response.data;
};

export const fetchUserProfile = async (): Promise<User> => {
  console.log("API: Attempting to fetch user profile...");
  const response = await api.get<ApiResponse<User>>("/api/getprofile");
  console.log("API: Fetch user profile response received.", response.data);
  return response.data.data;
};

export const logoutUser = async (): Promise<ApiResponse<any>> => {
  console.log("API: Attempting logout...");
  const response = await api.post<ApiResponse<any>>("/auth/logout");
  console.log("API: Logout response received.", response.data);
  return response.data;
};

export const callRefreshTokenEndpoint =
  async (): Promise<RefreshTokenResponseData> => {
    console.log("API: Attempting to call refresh token endpoint...");
    const response =
      await api.post<ApiResponse<RefreshTokenResponseData>>("/auth/refresh");
    console.log("API: Refresh token response received.", response.data);
    return response.data.data;
  };

export const getLoggedInUserProfile = async (): Promise<User> => {
  console.log("Fetching logged in user profile...");
  const response = await api.get<ApiResponse<User>>("/auth/getprofile");
  console.log("User profile fetched:", response.data.data);
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || "Failed to fetch user profile.");
  }
  return response.data.data;
};

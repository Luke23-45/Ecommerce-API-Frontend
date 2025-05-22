import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthenticated, logout } from "@/store/slices/authSlice";
import {
  callRefreshTokenEndpoint,
  getLoggedInUserProfile,
} from "@/api/auth/authApi";
import { type User } from "@/types/auth";

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    try {
      console.log("Attempting to initialize authentication...");
      await callRefreshTokenEndpoint();
      console.log("Refresh token call successful. Fetching user profile...");
      const userProfile: User = await getLoggedInUserProfile();

      dispatch(setAuthenticated(userProfile));
      console.log("Authentication initialized: User is logged in.");
    } catch (error: any) {
      console.error("Authentication initialization failed:", error.message);
      dispatch(logout());
    }
  }
);

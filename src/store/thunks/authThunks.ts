import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAuthenticated, logout } from "@/store/slices/authSlice";
import {
  callRefreshTokenEndpoint,
  getLoggedInUserProfile,
} from "@/api/auth/authApi";
import { type User } from "@/types/auth";

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("Attempting to initialize authentication...");

      await callRefreshTokenEndpoint();
      console.log(
        "Refresh token call successful. Attempting to fetch user profile..."
      );

      const userProfile: User = await getLoggedInUserProfile();

      dispatch(setAuthenticated(userProfile));
      console.log("Authentication initialized: User is logged in.");

      return userProfile;
    } catch (error: any) {
      console.error(
        "Authentication initialization failed:",
        error.message || error
      );

      dispatch(logout());

      return rejectWithValue(
        error.message || "Failed to initialize authentication."
      );
    }
  }
);

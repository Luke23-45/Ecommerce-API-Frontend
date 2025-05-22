import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { type User } from "@/types/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authRequest(state) {
      state.loading = true;
      state.error = null;
    },

    setAuthenticated(state, action: PayloadAction<User>) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },

    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },

    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
    },

    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const {
  authRequest,
  setAuthenticated,
  logout,
  authFailure,
  clearAuthError,
} = authSlice.actions;
export default authSlice.reducer;

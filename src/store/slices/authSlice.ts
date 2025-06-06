import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initializeAuth } from "@/store/thunks/authThunks"; 
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
  loading: true, 
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    
    setAuthenticated: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false; 
      state.error = null;
    },
    
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false; 
      state.error = null;
      
    },
    
    clearAuthError: (state) => {
      state.error = null;
    },
    
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      
      .addCase(initializeAuth.fulfilled, (state, action: PayloadAction<User | null>) => {
        state.loading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
        } else {
          
          state.isAuthenticated = false;
          state.user = null;
        }
        state.error = null;
      })
      
      
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = (action.payload as string) || "Authentication failed."; 
        
      });
  },
});

export const { setAuthenticated, logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  loginUser as loginUserApi,
  registerUser as registerUserApi,
  logoutUser as logoutUserApi,
} from "@/api/auth/authApi";

import { type ApiResponse } from "@/types/auth";

import { type RootState } from "@/store";
import { useNotification } from "@/contexts/NotificationContext";
import { logout } from "@/store/slices/authSlice";

export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

type CurrentUserQueryKey = ReturnType<typeof authKeys.currentUser>;

export const useLogout = (
  options?: UseMutationOptions<ApiResponse<any>, Error, void>
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  return useMutation<ApiResponse<any>, Error, void>({
    mutationFn: logoutUserApi,
    onSuccess: (response) => {
      if (response?.success === false && response?.message) {
        console.warn(
          "Logout API reported an issue but call succeeded:",
          response.message
        );
      }
      console.log("Logout successful on the backend (or API call completed).");

      dispatch(logout());
      console.log("Redux auth state cleared.");

      queryClient.clear();
      console.log("React Query cache cleared.");

      showNotification(
        "You have been successfully logged out.",
        "success",
        3000
      );
      navigate("/", { replace: true });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Logout failed. Please try again.";
      console.error("Logout error via hook:", error);
      showNotification(errorMessage, "error");
      console.warn(
        "Logout API call failed, but performing client-side cleanup anyway for UX."
      );
      dispatch(logout());
      queryClient.clear();
      navigate("/", { replace: true });
    },
    ...options,
  });
};

import React, { useState } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "@/api/auth/authApi";
import { getLoggedInUserProfile } from "@/api/auth/authApi";
import { setAuthenticated, logout } from "@/store/slices/authSlice";

import {
  type LoginCredentials,
  type LoginResponseData,
  type User,
} from "@/types/auth";

import {
  StyledForm,
  FormField,
  StyledLabel,
  StyledInput,
  ErrorMessage,
  SubmitButton,
} from "./AuthForms";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation: UseMutationResult<
    LoginResponseData,
    any,
    LoginCredentials,
    unknown
  > = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: async (data: LoginResponseData) => {
      console.log("Login successful:", data);
      setError(null);
      try {
        const user: User = await queryClient.fetchQuery({
          queryKey: ["userProfile"],
          queryFn: getLoggedInUserProfile,
          staleTime: Infinity,
          retry: false,
        });

        console.log("User profile fetched after login:", user);

        if (user) {
          dispatch(setAuthenticated(user));
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          queryClient.invalidateQueries({ queryKey: ["sellerProfile"] });
          console.log("Navigating to home page after login...");
          navigate("/", { replace: true });
        } else {
          console.warn(
            "Fetch user profile succeeded but returned no user data. Logging out frontend."
          );
          dispatch(logout());
          setError("Login successful, but failed to load profile data.");
        }
      } catch (profileError: any) {
        console.error(
          "Failed to fetch user profile after login:",
          profileError
        );
        dispatch(logout());
        setError(
          "Login successful, but failed to fetch user profile. Please try logging in again."
        );
      }
    },
    onError: (err: any) => {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during login.";
      setError(errorMessage);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ email, password });
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <FormField>
        <StyledLabel htmlFor="login-email">Email:</StyledLabel>
        <StyledInput
          id="login-email"
          type="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          required
          disabled={loginMutation.isPending}
        />
      </FormField>
      <FormField>
        <StyledLabel htmlFor="login-password">Password:</StyledLabel>
        <StyledInput
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loginMutation.isPending}
        />
      </FormField>
      <SubmitButton type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Logging In..." : "Login"}
      </SubmitButton>
    </StyledForm>
  );
}

export default LoginForm;

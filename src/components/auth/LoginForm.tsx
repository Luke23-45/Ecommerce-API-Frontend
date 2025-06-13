import React, { useState, useCallback } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import { FaEnvelope, FaLock, FaStore } from "react-icons/fa";

import { loginUser, getLoggedInUserProfile } from "../../api/auth/authApi";
import { setAuthenticated, logout } from "../../store/slices/authSlice";
import {
  type LoginCredentials,
  type LoginResponseData,
  type User,
} from "../../types/auth";
import { useNotification } from "@/contexts/NotificationContext";

import {
  AuthForm,
  AuthFormField,
  AuthFormLabel,
  AuthFormInput,
  AuthMessage,
  AuthSubmitButton,
  AuthSecondaryLinkButton,
} from "@/pages/AuthPage/AuthPage.styles";
import { BecomeSellerPrompt, SeparatorText, SingleLinePartnerPrompt } from "./AuthForms";

const InputWrapper = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    left: ${(props) => props.theme.spacing(3)};
    top: 50%;
    transform: translateY(-50%);
    color: ${(props) => props.theme.colors.adminTextSecondary};
    font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
    pointer-events: none;
    z-index: 1;
  }
  ${AuthFormInput} {
    padding-left: ${(props) => props.theme.spacing(8)};
  }
`;

function LoginForm() {
  const { showNotification } = useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loginMutation: UseMutationResult<
    LoginResponseData,
    any,
    LoginCredentials,
    unknown
  > = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: async (data: LoginResponseData) => {
      console.log("Login successful:", data);
      setMessage(null);
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
          queryClient.invalidateQueries({ queryKey: ["vendorProfile"] });
          console.log("Navigating to home page after login...");

          showNotification("Login successful! Redirecting...", "success", 2500);
          setTimeout(() => navigate("/", { replace: true }), 500);
        } else {
          console.warn(
            "Fetch user profile succeeded but returned no user data. Logging out frontend."
          );
          dispatch(logout());
          setMessage({
            type: "error",
            text: "Login successful, but failed to load profile data.",
          });
        }
      } catch (profileError: any) {
        console.error(
          "Failed to fetch user profile after login:",
          profileError
        );
        dispatch(logout());
        setMessage({
          type: "error",
          text: "Login successful, but failed to fetch user profile. Please try logging in again.",
        });
      }
    },
    onError: (err: any) => {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred during login.";
      setMessage({ type: "error", text: errorMessage });
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);
      if (!email.trim() || !password.trim()) {
        setMessage({
          type: "error",
          text: "Please enter both email and password.",
        });
        return;
      }
      loginMutation.mutate({ email, password });
    },
    [email, password, loginMutation]
  );

  return (
    <AuthForm onSubmit={handleSubmit}>

      {message && (
        <AuthMessage $type={message.type}>{message.text}</AuthMessage>
      )}

      <AuthFormField>
        <AuthFormLabel htmlFor="login-email">Email Address</AuthFormLabel>
        <InputWrapper>
          {" "}
          {/* DESIGN: Using the wrapper for icon placement */}
          <FaEnvelope /> {/* DESIGN: Icon */}
          <AuthFormInput
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={loginMutation.isPending}
          />
        </InputWrapper>
      </AuthFormField>

      <AuthFormField>
        <AuthFormLabel htmlFor="login-password">Password</AuthFormLabel>
        <InputWrapper>
          {" "}
          {/* DESIGN: Using the wrapper for icon placement */}
          <FaLock /> {/* DESIGN: Icon */}
          <AuthFormInput
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loginMutation.isPending}
          />
        </InputWrapper>
      </AuthFormField>


      <div
        style={{
          textAlign: "right",
          fontSize: "0.9em",
          marginTop: "-10px",
          marginBottom: "15px",
        }}
      >
        <AuthSecondaryLinkButton
          type="button"
          onClick={() => navigate("/auth/forgot-password")}
        >
          Forgot Password?
        </AuthSecondaryLinkButton>
      </div>

      <AuthSubmitButton type="submit" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Signing In..." : "Sign In"}
      </AuthSubmitButton>
    
    </AuthForm>
  );
}

export default LoginForm;

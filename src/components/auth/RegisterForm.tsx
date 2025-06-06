import React, { useState, useCallback } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FaEnvelope, FaLock, FaUserCheck } from "react-icons/fa";

import { registerUser } from "../../api/auth/authApi";
import { type RegisterPayload, type ApiResponse } from "../../types/auth";

import {
  AuthForm,
  AuthFormField,
  AuthFormLabel,
  AuthFormInput,
  AuthMessage,
  AuthSubmitButton,
} from "@/pages/AuthPage/AuthPage.styles";

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

function RegisterForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const registerMutation: UseMutationResult<
    ApiResponse<any>,
    any,
    RegisterPayload,
    unknown
  > = useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: (data: ApiResponse<any>) => {
      console.log("Registration successful:", data);
      setMessage({
        type: "success",
        text:
          data.message ||
          "Registration successful! Please check your email to verify.",
      });

      setPassword("");
      setConfirmPassword("");

      console.log("Navigating to verification page...");
      setTimeout(() =>
        navigate("/auth/verify", {
          state: { email: data.data?.email || email },
        })
      );
    },

    onError: (err: any) => {
      console.error("Registration error:", err);

      const errorData = err.response?.data;
      let errorMessage = "An unexpected error occurred during registration.";
      if (errorData) {
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          const firstErrorField = Object.keys(errorData.errors)[0];
          if (firstErrorField && errorData.errors[firstErrorField].length > 0) {
            errorMessage = errorData.errors[firstErrorField][0];
          }
        } else if (typeof errorData === "string") {
          errorMessage = errorData;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setMessage({ type: "error", text: errorMessage });
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);

      if (password !== confirmPassword) {
        setMessage({ type: "error", text: "Passwords do not match." });
        return;
      }
      if (password.length < 8) {
        setMessage({
          type: "error",
          text: "Password must be at least 8 characters long.",
        });
        return;
      }
      if (!email.trim()) {
        setMessage({ type: "error", text: "Email address is required." });
        return;
      }

      const payload: RegisterPayload = {
        email,
        password,
      };

      registerMutation.mutate(payload);
    },
    [email, password, confirmPassword, registerMutation]
  );

  return (
    <AuthForm onSubmit={handleSubmit}>
      {/* The main title "Register" or "Create Your Account" is handled by AuthHeader in AuthPage.tsx */}
      {/* The <h2>Register</h2> from your previous version is removed */}

      {message && (
        <AuthMessage $type={message.type}>{message.text}</AuthMessage>
      )}

      {/* DESIGN: Optional First Name / Last Name fields if your RegisterPayload and design supports them */}
      {/*
      <AuthFormField>
        <AuthFormLabel htmlFor="register-firstName">First Name</AuthFormLabel>
        <InputWrapper>
          <FaUser /> 
          <AuthFormInput
            id="register-firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Your first name"
            required
            disabled={registerMutation.isPending}
          />
        </InputWrapper>
      </AuthFormField>

      <AuthFormField>
        <AuthFormLabel htmlFor="register-lastName">Last Name</AuthFormLabel>
        <InputWrapper>
          <FaUser />
          <AuthFormInput
            id="register-lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Your last name"
            required
            disabled={registerMutation.isPending}
          />
        </InputWrapper>
      </AuthFormField>
      */}

      <AuthFormField>
        <AuthFormLabel htmlFor="register-email">Email Address</AuthFormLabel>
        <InputWrapper>
          {" "}
          {/* DESIGN: Using the wrapper for icon placement */}
          <FaEnvelope /> {/* DESIGN: Icon */}
          <AuthFormInput
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={registerMutation.isPending}
            placeholder="you@example.com"
          />
        </InputWrapper>
      </AuthFormField>

      <AuthFormField>
        <AuthFormLabel htmlFor="register-password">Password</AuthFormLabel>
        <InputWrapper>
          {" "}
          {/* DESIGN: Using the wrapper for icon placement */}
          <FaLock /> {/* DESIGN: Icon */}
          <AuthFormInput
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={registerMutation.isPending}
            placeholder="Create a strong password (min. 8)"
          />
        </InputWrapper>
      </AuthFormField>

      {/* DESIGN: Added Confirm Password field for better UX */}
      <AuthFormField>
        <AuthFormLabel htmlFor="register-confirm-password">
          Confirm Password
        </AuthFormLabel>
        <InputWrapper>
          <FaLock />
          <AuthFormInput
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={registerMutation.isPending}
            placeholder="Re-enter your password"
          />
        </InputWrapper>
      </AuthFormField>

      {/* DESIGN: Optional Terms and Conditions Checkbox with enhanced styling context */}
      <AuthFormField
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
          marginTop: "5px",
        }}
      >
        <input
          type="checkbox"
          id="register-terms"
          required
          disabled={registerMutation.isPending}
          style={{
            width: "auto",
            height: "auto",
            accentColor: "var(--theme-colors-accent1, #A46E4A)",
          }}
        />
        <AuthFormLabel
          htmlFor="register-terms"
          style={{
            marginBottom: 0,
            textTransform: "none",
            fontWeight: "normal",
            fontSize: "0.9rem",
            color: "var(--theme-colors-adminText, #333)",
          }}
        >
          I agree to the{" "}
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--theme-colors-accent1, #A46E4A)",
              textDecoration: "underline",
            }}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--theme-colors-accent1, #A46E4A)",
              textDecoration: "underline",
            }}
          >
            Privacy Policy
          </a>
          .
        </AuthFormLabel>
      </AuthFormField>

      <AuthSubmitButton type="submit" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? "Creating Account..." : "Create Account"}
      </AuthSubmitButton>

      {/* The "Already have an account? Login" link is handled in AuthPage.tsx via AuthSwitchLinkContainer */}
    </AuthForm>
  );
}

export default RegisterForm;

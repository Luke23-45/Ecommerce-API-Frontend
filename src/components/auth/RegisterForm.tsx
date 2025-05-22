import React, { useState } from "react";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { registerUser } from "@/api/auth/authApi";

import { type RegisterPayload, type ApiResponse } from "@/types/auth";

import {
  StyledForm,
  FormField,
  StyledLabel,
  StyledInput,
  ErrorMessage,
  SuccessMessage,
  SubmitButton,
} from "./AuthForms";

function RegisterForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          data.message || "Registration successful! Please verify your email.",
      });

      setEmail("");
      setPassword("");

      console.log("Navigating to verification page...");
      navigate("/auth/verify", { state: { email: email } });
    },
    onError: (err: any) => {
      console.error("Registration error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.email?.[0] ||
        err.message ||
        "An unexpected error occurred during registration.";
      setMessage({ type: "error", text: errorMessage });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload: RegisterPayload = {
      email,
      password,
    };

    registerMutation.mutate(payload);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      {" "}
      {/* Use StyledForm, remove inline styles */}
      <h2>Register</h2> {/* Styled by h2 within StyledForm */}
      {/* Display success or error message */}
      {message &&
        (message.type === "success" ? (
          <SuccessMessage>{message.text}</SuccessMessage>
        ) : (
          <ErrorMessage>{message.text}</ErrorMessage>
        ))}
      <FormField>
        {" "}
        {/* Use FormField */}
        <StyledLabel htmlFor="register-email">Email:</StyledLabel>{" "}
        {/* Use StyledLabel */}
        <StyledInput
          id="register-email"
          type="email"
          value={email}
          onChange={(e: any) => setEmail(e.target.value)}
          required
          disabled={registerMutation.isPending}
        />{" "}
        {/* Use StyledInput */}
      </FormField>
      <FormField>
        {" "}
        {/* Use FormField */}
        <StyledLabel htmlFor="register-password">Password:</StyledLabel>{" "}
        {/* Use StyledLabel */}
        <StyledInput
          id="register-password"
          type="password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          required
          disabled={registerMutation.isPending}
        />{" "}
        {/* Use StyledInput */}
      </FormField>
      <SubmitButton type="submit" disabled={registerMutation.isPending}>
        {" "}
        {/* Use SubmitButton */}
        {registerMutation.isPending ? "Registering..." : "Register"}
      </SubmitButton>
    </StyledForm>
  );
}

export default RegisterForm;

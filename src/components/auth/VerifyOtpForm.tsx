import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  useNavigate,
  useLocation,
  Link as RouterDomLink,
} from "react-router-dom";
import styled from "styled-components";
import { FaKey, FaEnvelope, FaRedo, FaHourglassHalf } from "react-icons/fa";

import {
  verifyEmailWithOtp,
  resendPendingRegistrationOtp,
  getLoggedInUserProfile,
} from "../../api/auth/authApi";
import { setAuthenticated, logout } from "../../store/slices/authSlice";
import {
  type VerifyOtpPayload,
  type ResendOtpPayload,
  type ApiResponse,
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
  AuthSecondaryActions,
  AuthSecondaryLinkButton,
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

const RESEND_INTERVALS = [60, 300, 600];

function VerifyOtpForm() {
  const { showNotification } = useNotification();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const [email, setEmail] = useState<string>(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const [resendAttempts, setResendAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
    if (!location.state?.email) {
      setMessage({
        type: "info",
        text: "If you need to verify an email, please ensure you've completed registration or try logging in.",
      });
    }
  }, [location.state?.email]);

  useEffect(() => {
    if (resendCooldown > 0) {
      timerRef.current = setInterval(() => {
        setResendCooldown((prevCooldown) => prevCooldown - 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resendCooldown]);

  const verifyMutation: UseMutationResult<
    ApiResponse<any>,
    Error,
    VerifyOtpPayload
  > = useMutation<ApiResponse<any>, Error, VerifyOtpPayload>({
    mutationFn: (payload: VerifyOtpPayload) => verifyEmailWithOtp(payload),
    onSuccess: async (data: ApiResponse<any>) => {
      setMessage(null);
      showNotification(
        data.message || "Email verified successfully! Logging you in...",
        "success",
        3000
      );
      setOtp("");
      try {
        const user: User = await queryClient.fetchQuery({
          queryKey: ["userProfile"],
          queryFn: getLoggedInUserProfile,
          staleTime: 0,
        });

        console.log(user);
        if (user) {
          dispatch(setAuthenticated(user));
          queryClient.invalidateQueries({ queryKey: ["sellerProfile"] });
          queryClient.invalidateQueries({ queryKey: ["vendorProfile"] });
          setTimeout(() => navigate("/", { replace: true }), 500);
        } else {
          dispatch(logout());
          showNotification(
            "Verification successful, but failed to load profile data.",
            "error"
          );
          setTimeout(() => navigate("/", { replace: true }), 500);
        }
      } catch (profileError: any) {
        dispatch(logout());
        showNotification(
          `Verification succeeded, but profile fetch failed: ${profileError.message || "Unknown error"}`,
          "error"
        );
      }
    },
    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "OTP verification failed.";
      setMessage({ type: "error", text: errorMessage });
    },
  });

  const resendMutation: UseMutationResult<
    ApiResponse<any>,
    Error,
    ResendOtpPayload
  > = useMutation<ApiResponse<any>, Error, ResendOtpPayload>({
    mutationFn: (payload: ResendOtpPayload) =>
      resendPendingRegistrationOtp(payload),
    onSuccess: (data: ApiResponse<any>) => {
      setMessage({
        type: "success",
        text: data.message || "A new OTP has been sent to your email.",
      });
      const nextCooldown =
        RESEND_INTERVALS[Math.min(resendAttempts, RESEND_INTERVALS.length - 1)];
      setResendCooldown(nextCooldown);
      setResendAttempts((prev) => prev + 1);
    },
    onError: (err: any) => {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to resend OTP.";
      setMessage({ type: "error", text: errorMessage });
    },
  });

  const handleVerifySubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);
      if (!email) {
        setMessage({
          type: "error",
          text: "Email address is missing. Please go back to registration.",
        });
        return;
      }
      if (!otp.trim() || otp.length !== 6) {
        setMessage({
          type: "error",
          text: "Please enter a valid 6-digit OTP.",
        });
        return;
      }
      verifyMutation.mutate({ email, otp });
    },
    [email, otp, verifyMutation]
  );

  const handleResendOtpClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setMessage(null);
      if (!email) {
        setMessage({
          type: "error",
          text: "Email address is missing for resending OTP.",
        });
        return;
      }
      if (resendCooldown > 0) return;

      resendMutation.mutate({ email });
    },
    [email, resendMutation, resendCooldown]
  );

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isAnyMutationPending =
    verifyMutation.isPending || resendMutation.isPending;

  return (
    <AuthForm onSubmit={handleVerifySubmit}>
      {/* The main title "Verify Your Email" is now handled by AuthHeader in AuthPage.tsx */}

      {/* Contextual message for the user */}
      {!message && (
        <p
          style={{
            textAlign: "center",
            fontSize: "0.95em",
            color: "var(--theme-colors-adminTextSecondary, #555)",
            lineHeight: "1.5",
            marginBottom: "15px",
          }}
        >
          We've sent a One-Time Password (OTP) to{" "}
          <strong style={{ color: "var(--theme-colors-textDark, #333)" }}>
            {email || "your email address"}
          </strong>
          . Please enter it below to complete your registration.
        </p>
      )}

      {message && (
        <AuthMessage $type={message.type}>{message.text}</AuthMessage>
      )}

      <AuthFormField>
        <AuthFormLabel htmlFor="verify-email">
          Email Address (Verify)
        </AuthFormLabel>
        <InputWrapper>
          <FaEnvelope />
          <AuthFormInput
            id="verify-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isAnyMutationPending || !location.state?.email}
            placeholder="you@example.com"
            readOnly={!!location.state?.email}
          />
        </InputWrapper>
      </AuthFormField>

      <AuthFormField>
        <AuthFormLabel htmlFor="verify-otp">
          One-Time Password (OTP)
        </AuthFormLabel>
        <InputWrapper>
          <FaKey />
          <AuthFormInput
            id="verify-otp"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            maxLength={6}
            required
            disabled={isAnyMutationPending || !email}
            placeholder="Enter 6-digit code"
            autoComplete="one-time-code"
          />
        </InputWrapper>
      </AuthFormField>

      <AuthSubmitButton
        type="submit"
        disabled={verifyMutation.isPending || !otp || !email}
      >
        {verifyMutation.isPending ? "Verifying..." : "Verify & Proceed"}
      </AuthSubmitButton>

      <AuthSecondaryActions>
        <AuthSecondaryLinkButton
          type="button"
          onClick={handleResendOtpClick}
          disabled={resendMutation.isPending || resendCooldown > 0 || !email}
        >
          {resendMutation.isPending ? (
            <>
              <FaHourglassHalf style={{ marginRight: "5px" }} />
              Sending OTP...
            </>
          ) : resendCooldown > 0 ? (
            <>Resend OTP in ({formatTime(resendCooldown)})</>
          ) : (
            <>
              <FaRedo style={{ marginRight: "5px" }} />
              Resend OTP
            </>
          )}
        </AuthSecondaryLinkButton>

        <p
          style={{
            fontSize: "0.9em",
            color: "var(--theme-colors-adminTextSecondary, #888)",
            marginTop: "10px",
          }}
        >
          Didn't receive the code or need to log in?
          <RouterDomLink
            to="/auth/login"
            style={{
              color: "var(--theme-colors-accent1, #A46E4A)",
              marginLeft: "5px",
            }}
          >
            Back to Sign In
          </RouterDomLink>
        </p>
      </AuthSecondaryActions>
    </AuthForm>
  );
}

export default VerifyOtpForm;

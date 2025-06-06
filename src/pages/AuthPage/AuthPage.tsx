// src/pages/auth/AuthPage.tsx
import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  Link as RouterDomLink,
  useNavigate,
} from "react-router-dom";

import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";
import VerifyOtpForm from "../../components/auth/VerifyOtpForm";
import elanLogoWhite from "@/assets/logo.png";
import { type RootState } from "@/store";
import {
  AuthPageContainer,
  VisualColumn,
  VisualContent,
  AuthContentWrapper,
  AuthFormContainer,
  AuthHeader,
  AuthSwitchLinkContainer,
} from "./AuthPage.styles";
import { useSelector } from "react-redux";
import {
  SeparatorText,
  SingleLinePartnerPrompt,
} from "@/components/auth/AuthForms";

function AuthPage() {
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const navigate = useNavigate();

  let pageMode: "login" | "register" | "verify" = "login";
  if (location.pathname.includes("/register")) pageMode = "register";
  else if (location.pathname.includes("/verify")) pageMode = "verify";

  const getHeaderContent = () => {
    switch (pageMode) {
      case "register":
        return {
          title: "Create Your Élan Account",
          subtitle: "Join our world of curated elegance and inspiration.",
        };
      case "verify":
        return {
          title: "Verify Your Email",
          subtitle:
            "Please enter the code sent to your email to complete registration.",
        };
      case "login":
      default:
        return {
          title: "Welcome Back to Élan",
          subtitle: "Sign in to access your exclusive homewares experience.",
        };
    }
  };

  const getSwitchLinkContent = () => {
    if (pageMode === "login") {
      return {
        text: "Don't have an account yet?",
        linkTo: "/auth/register",
        actionText: "Sign Up",
      };
    }
    if (pageMode === "register") {
      return {
        text: "Already have an account?",
        linkTo: "/auth/login",
        actionText: "Sign In",
      };
    }
    return null;
  };

  const headerContent = getHeaderContent();
  const switchLinkContent = getSwitchLinkContent();

  if (isAuthenticated) {
    setTimeout(() => navigate("/", { replace: true }), 500);
  }

  return (
    <AuthPageContainer>
      <VisualColumn>
        <VisualContent>
          <img
            src={elanLogoWhite}
            alt="Élan Homewares"
            className="brand-logo"
          />
          <h1>The Art of Living, Beautifully Curated.</h1>{" "}
          {/* More evocative tagline */}
          <p className="description">
            Élan Homewares offers an exquisite selection of pieces designed to
            inspire and elevate your everyday spaces.
          </p>
          <p className="footer-text">Experience Élan. © {currentYear}</p>
        </VisualContent>
      </VisualColumn>

      <AuthContentWrapper>
        <AuthFormContainer>
          <AuthHeader>
            <h1>{headerContent.title}</h1>
            <p>{headerContent.subtitle}</p>
          </AuthHeader>

          <Routes>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path="verify" element={<VerifyOtpForm />} />
            <Route index element={<Navigate to="login" replace />} />
          </Routes>

          {switchLinkContent && (
            <AuthSwitchLinkContainer>
              {switchLinkContent.text}
              <RouterDomLink to={switchLinkContent.linkTo}>
                {switchLinkContent.actionText}
              </RouterDomLink>
            </AuthSwitchLinkContainer>
          )}

          {pageMode === "login" && (
            <>
              <SeparatorText>Or</SeparatorText>
              <SingleLinePartnerPrompt>
                Interested in selling with us?
                <RouterDomLink to="/becomeseller">
                  {" "}
                  {/* Adjust route if different */}
                  Join Élan as a Partner
                </RouterDomLink>
              </SingleLinePartnerPrompt>
            </>
          )}
        </AuthFormContainer>
      </AuthContentWrapper>
    </AuthPageContainer>
  );
}

export default AuthPage;

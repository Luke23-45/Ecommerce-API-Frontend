import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { type RootState } from "@/store";
import { logoutUser } from "@/api/auth/authApi";
import { logout } from "@/store/slices/authSlice";

import {
  StyledHeader,
  SiteTitleLink,
  SiteTitle,
  Nav,
  NavLink,
  LogoutButton,
} from "./Header.styled";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

function Header() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      console.log("Logout successful on backend.");

      dispatch(logout());

      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
    onError: (err) => {
      console.error("Logout error:", err);

      dispatch(logout());

      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });

  const queryClient = useQueryClient();

  const handleLogout = () => {
    console.log("Attempting to log out...");
    logoutMutation.mutate();
  };

  return (
    <StyledHeader>
      {/* Site Title linking to home */}
      <SiteTitleLink to="/">
        <SiteTitle>E-commerce</SiteTitle> {/* Replace with your site name */}
      </SiteTitleLink>

      {/* Navigation */}
      <Nav>
        {/* 21. Conditional rendering based on authentication status */}
        {!isAuthenticated ? (
          <>
            {" "}
            {/* Fragment for multiple elements */}
            <NavLink to="/auth/login">Login</NavLink>
            <NavLink to="/auth/register">Register</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/profile">Profile</NavLink>{" "}
            {/* Link to user profile */}
            {/* 22. Logout Button */}
            <LogoutButton
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? "Logging Out..." : "Logout"}
            </LogoutButton>
          </>
        )}
      </Nav>
    </StyledHeader>
  );
}

export default Header;

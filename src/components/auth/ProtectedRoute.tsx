import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { type RootState } from "@/store";

interface ProtectedRouteProps {}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const authLoading = useSelector((state: RootState) => state.auth.loading);

  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <p>Loading user session...</p> {/* Or a spinner component */}
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(
      "ProtectedRoute: User not authenticated. Redirecting to /auth/login"
    );
    return <Navigate to="/auth/login" replace />;
  }

  console.log("ProtectedRoute: User authenticated. Rendering Outlet.");
  return <Outlet />;
};

export default ProtectedRoute;

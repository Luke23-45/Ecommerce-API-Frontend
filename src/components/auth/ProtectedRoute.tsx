import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom"; 
import { type RootState } from "@/store";

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      flexDirection: "column",
      gap: "10px",
      fontSize: "1.2em",
      color: "#555",
    }}
  >
    <div
      style={{
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #3498db",
        borderRadius: "50%",
        width: "30px",
        height: "30px",
        animation: "spin 1s linear infinite",
      }}
    ></div>
    <p>Loading session and permissions...</p>
    <style>
      {`
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        `}
    </style>
  </div>
);

interface ProtectedRouteProps {
  isAuthenticated?: boolean; 
  allowedRoles?: string[];
  redirectToUnauthorized?: string;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated: propIsAuthenticated, // Destructure with a different name to avoid clash
  allowedRoles,
  redirectToUnauthorized = "/unauthorized", // Default unauthorized page
  children, // For when it wraps specific components directly
}) => {
  const { isAuthenticated: reduxIsAuthenticated, user, loading: authLoading } = useSelector(
    (state: RootState) => state.auth
  );


  const location = useLocation(); // Get current location for redirect 'state'

  // Determine the effective isAuthenticated state.
  // We prefer the Redux state as it's the source of truth,
  // but allow a prop to override for more complex nesting patterns if necessary.
  const isAuth = propIsAuthenticated !== undefined ? propIsAuthenticated : reduxIsAuthenticated;

  //  Step 1: Handle Loading State 
  if (authLoading) {
    console.log("ProtectedRoute: Authentication check in progress...");
    return <LoadingSpinner />;
  }

  //  Step 2: Handle Unauthenticated Users 
  if (!isAuth) {
    console.log("ProtectedRoute: User not authenticated. Redirecting to /auth/login");
    // Pass current path in state so login page can redirect back after success
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  //  Step 3: Handle Role-Based Access Control 
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRequiredRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRequiredRole) {
      console.warn(
        `ProtectedRoute: Authenticated user (roles: ${userRoles.join(", ")}) does not have required roles: ${allowedRoles.join(", ")}. Redirecting to ${redirectToUnauthorized}`
      );
      // Redirect authenticated but unauthorized users
      return <Navigate to={redirectToUnauthorized} replace />;
    }
  }

  //  Step 4: User is Authenticated and Authorized 
  console.log("ProtectedRoute: User authenticated and authorized. Rendering content.");

  // If children are provided, render them directly (for element prop usage)
  if (children) {
    return <>{children}</>;
  }
  // Otherwise, render the Outlet for nested routes
  return <Outlet />;
};

export default ProtectedRoute;
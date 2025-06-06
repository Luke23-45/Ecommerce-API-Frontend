import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import AuthenticatedRoutes from "./AuthenticatedRoutes";

// Lazy load protected components
const ProfilePage = lazy(() => import("@/pages/Others/ProfilePage"));
const ViewSellerApplication = lazy(
  () => import("@/components/seller/ViewSellerApplication")
);
const ViewVendorApplication = lazy(
  () => import("@/components/vendor/ViewVendorApplication")
);

// Lazy load specific dashboards/layouts for nesting
const AdminRoutes = lazy(() => import("./AdminRoutes"));
const SellerRoutes = lazy(() => import("./SellerRoutes"));
const VendorRoutes = lazy(() => import("./VendorRoutes"));

const AuthenticatedInedexRoutes = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // This AuthenticatedRoutes component itself is wrapped in a ProtectedRoute in App.tsx
  // So, we only need to pass isAuthenticated to its own children, or rely on the parent.
  // For nested ProtectedRoutes with roles, we pass userRoles.

  return (
    <Suspense fallback={<div>Loading authenticated content...</div>}>
      <Routes>
        <Route
          path="/admin/*" // Note the /* to match nested paths
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={["admin"]}
            >
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* Seller Routes - uses a nested ProtectedRoute for role-based access */}
        <Route
          path="/seller-dashboard/*" // Note the /*
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={["individual_seller", "admin"]}
            >
              <SellerRoutes />
            </ProtectedRoute>
          }
        />

        {/* Vendor Routes - uses a nested ProtectedRoute for role-based access */}
        <Route
          path="/vendor/dashboard/*"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={["vendor", "admin"]}
            >
              <VendorRoutes /> {/* This will define its own sub-routes */}
            </ProtectedRoute>
          }
        />

        {/* Routes for viewing applications (if not nested in dashboards) */}
        <Route
          path="/view-seller-application/:id"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={["admin", "individual_seller"]}
            >
              <ViewSellerApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-vendor-application/:id"
          element={
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              allowedRoles={["admin", "vendor"]}
            >
              <ViewVendorApplication />
            </ProtectedRoute>
          }
        />

        <Route>
          <Route path="/*" element={<AuthenticatedRoutes />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AuthenticatedInedexRoutes;


import UserProfilePage from "@/pages/profile/UserProfilePage";
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const IndividualSellerProfileForm = lazy(
  () => import("@/components/seller/IndividualSellerProfileForm")
);

const ProfilePage = lazy(
  () => import("@/pages/Others/ProfilePage")
);
const VendorApplicationForm = lazy(
  () => import("@/components/vendor/VendorApplicationForm")
);

const IndividualSellerProfileUpdateForm = lazy(
  () => import("@/components/seller/IndividualSellerProfileUpdateForm")
);
const ViewSellerApplication = lazy(
  () => import("@/components/seller/ViewSellerApplication")
);

const ViewVendorApplication = lazy(
  () => import("@/components/vendor/ViewVendorApplication")
);

const VendorProfileUpdateForm = lazy(
  () => import("@/components/vendor/VendorProfileUpdateForm")
);

const AuthenticatedRoutes = () => (
  <Suspense fallback={<div>Loading public content...</div>}>
    <Routes>
      {/* seller routes */}
      <Route path="/seller/apply" element={<IndividualSellerProfileForm />} />
      <Route
        path="/seller/application/view"
        element={<ViewSellerApplication />}
      />
      <Route
        path="seller/application/update"
        element={<IndividualSellerProfileUpdateForm />}
      />
      <Route path="/vendor/apply" element={<VendorApplicationForm />} />
      <Route
        path="/vendor/application/view"
        element={<ViewVendorApplication />}
      />
      <Route
        path="vendor/application/update"
        element={<VendorProfileUpdateForm />}
      />
      <Route
        path="/profile"
        element={<UserProfilePage />}
      />
    </Routes>
  </Suspense>
);

export default AuthenticatedRoutes;

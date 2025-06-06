import React, { useEffect, useState } from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { type RootState, type AppDispatch } from "@/store";
import { initializeAuth } from "@/store/thunks/authThunks";

import AuthPage from "@/pages/AuthPage/AuthPage";
import ProfilePage from "@/pages/Others/ProfilePage";
import SellerDashboardPage from "@/pages/seller/SellerDashboardPage";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UpdateIndividualSellerUpdate from "../components/seller/IndividualSellerApplicationFormUpdate";
import VendorApplicationForm from "../components/vendor/vendorApplicationForm";
import VendorDashboardPage from "../pages/vendor/VendorDashboardPage";
function App() {
  const dispatch: AppDispatch = useDispatch();
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);

  useEffect(() => {
    const performAuthCheck = async () => {
      console.log(
        "App initialized. Dispatching initial authentication check..."
      );

      await dispatch(initializeAuth());
      console.log("Initial authentication check completed.");
      setIsAuthCheckComplete(true);
    };

    performAuthCheck();
  }, [dispatch]);

  if (!isAuthCheckComplete) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.5em",
          backgroundColor: "#f0f2f5",
          color: "#333",
        }}
      >
        <p>Loading application resources...</p>{" "}
        {/* You can replace this with a spinner/loader */}
      </div>
    );
  }

  return (
    <Router>
      <Header /> {/* Your main header */}
      <main style={{ padding: "0 20px", minHeight: "calc(100vh - 140px)" }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/*" element={<AuthPage />} />{" "}
          {/* All auth-related forms (login, register, OTP) */}
          <Route
            path="/apply-to-sell"
            element={<IndividualSellerApplicationForm />}
          />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/seller-dashboard" element={<SellerDashboardPage />} />
            <Route
              path="/seller/edit-profile"
              element={<UpdateIndividualSellerUpdate />}
            />
            <Route path="/venodr/dashboard" element={<VendorDashboardPage />} />
          </Route>
          <Route path="/venodr/apply" element={<VendorApplicationForm />} />
          {/* Fallback for unknown routes */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </main>
      <Footer /> {/* Your main footer */}
    </Router>
  );
}

export default App;

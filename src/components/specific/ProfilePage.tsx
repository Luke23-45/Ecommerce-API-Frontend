import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import IndividualSellerApplicationForm from "@/components/seller/IndividualSellerApplicationForm";

function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  
  if (!isAuthenticated) {
    return <p>You must be logged in to view this page.</p>;
  }

  if (!user) {
    return <p>Loading user profile...</p>;
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "20px auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
        Your Profile
      </h1>

      <p>
        <strong>Name:</strong> {user.firstName} {user.lastName}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.roles}
      </p>
      <p>
        <strong>User ID:</strong> {user._id}
      </p>
      {/* Add more user details as needed */}

      <hr style={{ margin: "40px 0", borderColor: "#eee" }} />

      {/* Render the Individual Seller Application Form */}
      <IndividualSellerApplicationForm />

      {/* You can add conditional rendering here later
          e.g., if user.role === 'customer' && !user.hasSellerApplication, show form
          else if user.hasSellerApplication && user.sellerStatus === 'pending', show status message
          else if user.role === 'seller', show seller dashboard link
      */}
    </div>
  );
}

const ProtectedProfilePage = () => (
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
);

export default ProtectedProfilePage;

import React from "react";
import { useGetIndividualSellerProfile } from "@/hooks/useIndividualSeller";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { Link } from "react-router-dom";

function SellerDashboardPage() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const userRole = useSelector((state: RootState) => state.auth.user?.roles);

  const {
    data: sellerProfile,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetIndividualSellerProfile();
  console.log(sellerProfile);

  if (!isAuthenticated) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#333" }}>Access Denied</h2>
        <p style={{ color: "#555" }}>
          You must be logged in to view your seller dashboard.
        </p>
        {/* Adjust login path as needed */}
        <Link
          to="/login"
          style={{
            marginTop: "20px",
            padding: "10px 25px",
            backgroundColor: "#007bff",
            color: "white",
            textDecoration: "none",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          Login Here
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ fontSize: "1.2em", color: "#6c757d" }}>
          Loading seller profile...
        </p>
        {/* You can add a spinner or more elaborate loading animation here */}
        <div
          style={{
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            animation: "spin 1s linear infinite",
            marginTop: "20px",
          }}
        ></div>
        {/* Basic CSS for spin animation */}
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
  }

  if (isError) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#dc3545",
        }}
      >
        <h2 style={{ color: "#dc3545" }}>Error Loading Profile</h2>
        <p>
          Failed to load seller profile: {error?.message || "Unknown error"}
        </p>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }
  if (!sellerProfile) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#333" }}>No Seller Profile Found</h2>
        <p style={{ color: "#555" }}>
          You do not have an active seller application or profile.
        </p>
        {/* Show link to apply only if the user's current role doesn't indicate they are already a seller (e.g., 'pending_seller') */}
        {true && (
          <Link
            to="/apply-to-sell"
            style={{
              marginTop: "20px",
              padding: "10px 25px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            Apply to Become a Seller
          </Link>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "30px auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        Your Seller Dashboard
      </h1>

      {/* Application Status Section */}
      <div
        style={{
          border: "1px solid #e0e0e0",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px",
          backgroundColor: "#fcfcfc",
        }}
      >
        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "15px",
            marginBottom: "20px",
            color: "#007bff",
          }}
        >
          Application Status
        </h3>
        <p style={{ fontSize: "1.1em", fontWeight: "bold" }}>
          Status:{" "}
          <span
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              color: "white",
              backgroundColor:
                sellerProfile.status === "pending"
                  ? "#ffc107"
                  : sellerProfile.status === "approved"
                    ? "#28a745"
                    : sellerProfile.status === "rejected" ||
                        sellerProfile.status === "suspended"
                      ? "#dc3545"
                      : "#6c757d",
            }}
          >
            {sellerProfile.status.toUpperCase()}
          </span>
        </p>
        {sellerProfile.status === "pending" && (
          <p style={{ color: "#ffc107", marginTop: "10px" }}>
            Your application is currently under review. We will notify you once
            a decision has been made.
          </p>
        )}
        {sellerProfile.status === "approved" && (
          <p style={{ color: "#28a745", marginTop: "10px" }}>
            Congratulations! Your seller application has been approved. You can
            now list your products.
          </p>
        )}
        {sellerProfile.status === "rejected" && (
          <>
            <p style={{ color: "#dc3545", marginTop: "10px" }}>
              Unfortunately, your application has been rejected.
            </p>

            <p style={{ marginTop: "10px" }}>
              You may try again after addressing the issues, or contact support
              for more details.
            </p>
          </>
        )}
        {sellerProfile.status === "suspended" && (
          <p style={{ color: "#dc3545", marginTop: "10px" }}>
            Your seller account has been suspended. Please contact support for
            more information.
          </p>
        )}
        {sellerProfile.status === "suspended" && (
          <p style={{ color: "#6c757d", marginTop: "10px" }}>
            Your seller account has been deactivated.
          </p>
        )}
      </div>

      {/* Profile Details Section */}
      <div
        style={{
          border: "1px solid #e0e0e0",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "15px",
            marginBottom: "20px",
            color: "#007bff",
          }}
        >
          Profile Details
        </h3>
        <p>
          <strong>Seller Display Name:</strong> {sellerProfile.sellerName}
        </p>
        <p>
          <strong>Phone Number:</strong> {sellerProfile.phoneNumber}
        </p>
        <p>
          <strong>Legal Name:</strong> {sellerProfile.legalFirstName}{" "}
          {sellerProfile.legalLastName}
        </p>
        <p>
          <strong>Date of Birth:</strong>{" "}
          {sellerProfile.dateOfBirth
            ? new Date(sellerProfile.dateOfBirth).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Citizenship Country:</strong>{" "}
          {sellerProfile.citizenshipCountry}
        </p>
        <p>
          <strong>TIN/SSN/EIN:</strong> {sellerProfile.taxIdentificationNumber}
        </p>
      </div>

      {/* Address Section */}
      <div
        style={{
          border: "1px solid #e0e0e0",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "25px",
        }}
      >
        <h3
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "15px",
            marginBottom: "20px",
            color: "#007bff",
          }}
        >
          Address
        </h3>
        <p>{sellerProfile.address.street}</p>
        <p>
          {sellerProfile.address.city}, {sellerProfile.address.state}{" "}
          {sellerProfile.address.zip}
        </p>
        <p>{sellerProfile.address.country}</p>
      </div>

      {/* Payout Preferences Section (conditionally rendered) */}
      {sellerProfile.payoutMethodPreference && (
        <div
          style={{
            border: "1px solid #e0e0e0",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: "15px",
              marginBottom: "20px",
              color: "#007bff",
            }}
          >
            Payout Preferences
          </h3>
          <p>
            <strong>Preferred Method:</strong>{" "}
            {sellerProfile.payoutMethodPreference
              .replace(/_/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </p>{" "}
          {/* Format: bank_transfer -> Bank Transfer */}
          {sellerProfile.payoutMethodPreference === "bank_transfer" && (
            <>
              <p>
                <strong>Account Holder:</strong>{" "}
                {sellerProfile.bankAccountHolderName}
              </p>
              <p>
                <strong>Account Number:</strong>{" "}
                {sellerProfile.bankAccountNumber}
              </p>
              <p>
                <strong>Routing Number:</strong>{" "}
                {sellerProfile.bankRoutingNumber}
              </p>
            </>
          )}
          {/* Add other payout method details if needed (e.g., PayPal email) */}
        </div>
      )}

      {/* Business Details Section (conditionally rendered) */}
      {sellerProfile.briefDescription ||
      (sellerProfile.primaryProductCategories &&
        sellerProfile.primaryProductCategories.length > 0) ||
      sellerProfile.estimatedMonthlySales !== undefined ||
      sellerProfile.yearsOfSellingExperience !== undefined ||
      sellerProfile.otherPlatformsSoldOn ? (
        <div
          style={{
            border: "1px solid #e0e0e0",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              borderBottom: "1px solid #eee",
              paddingBottom: "15px",
              marginBottom: "20px",
              color: "#007bff",
            }}
          >
            Business Details
          </h3>
          {sellerProfile.briefDescription && (
            <p>
              <strong>Description:</strong> {sellerProfile.briefDescription}
            </p>
          )}
          {sellerProfile.primaryProductCategories &&
            sellerProfile.primaryProductCategories.length > 0 && (
              <p>
                <strong>Product Categories:</strong>{" "}
                {sellerProfile.primaryProductCategories.join(", ")}
              </p>
            )}
          {sellerProfile.estimatedMonthlySales !== undefined && (
            <p>
              <strong>Estimated Monthly Sales:</strong> $
              {sellerProfile.estimatedMonthlySales.toLocaleString()}
            </p>
          )}
          {sellerProfile.yearsOfSellingExperience !== undefined && (
            <p>
              <strong>Years of Experience:</strong>{" "}
              {sellerProfile.yearsOfSellingExperience}
            </p>
          )}
          {sellerProfile.otherPlatformsSoldOn && (
            <p>
              <strong>Other Platforms:</strong>{" "}
              {sellerProfile.otherPlatformsSoldOn}
            </p>
          )}
        </div>
      ) : null}

      {/* Optional: Add an "Edit Profile" button later using useUpdateIndividualSellerProfile */}
      {/* You'd typically make this visible only if the status allows editing (e.g., not 'approved' if you don't allow edits post-approval, or if 'rejected') */}
      {/* <Link to="/edit-seller-profile" style={{ display: 'block', textAlign: 'center', marginTop: '30px', padding: '12px 25px', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
                Edit Profile
            </Link> */}
    </div>
  );
}

export default SellerDashboardPage;

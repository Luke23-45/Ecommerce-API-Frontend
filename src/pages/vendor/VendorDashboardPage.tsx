import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store"; // Assuming RootState is defined here
import { Link } from "react-router-dom"; // For navigation links
import { useGetVendorProfile } from "@/hooks/useVendor"; // Custom hook to fetch vendor profile

function VendorDashboardPage() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  // Optional: You might want to check for specific roles like 'vendor' or 'pending_vendor'
  // const userRole = useSelector((state: RootState) => state.auth.user?.roles);

  const {
    data: vendorProfile,
    isLoading,
    isError,
    error,
    isSuccess, // Although not directly used for display in the final return, it's good to keep
  } = useGetVendorProfile();

  console.log("Vendor Profile Data:", vendorProfile); // Log the fetched data for debugging

  // --- Conditional Renderings ---

  // 1. Not Authenticated
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
          You must be logged in to view your vendor dashboard.
        </p>
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

  // 2. Loading State
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
          Loading vendor profile...
        </p>
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
        {/* Basic CSS for spin animation (can be moved to a CSS file) */}
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

  // 3. Error State
  if (isError) {
    // If there's an error fetching, it might mean the user doesn't have a profile yet
    // or there was a server error. Provide a generic error message.
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
          Failed to load vendor profile: {error?.message || "Unknown error"}
        </p>
        <p>Please try again later or contact support.</p>
        <Link
          to="/apply-as-vendor" // Link to the application form if they might need to apply
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
          Apply as a Vendor
        </Link>
      </div>
    );
  }

  // 4. No Vendor Profile Found (API returned null/undefined data, but no error)
  if (!vendorProfile) {
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
        <h2 style={{ color: "#333" }}>No Vendor Profile Found</h2>
        <p style={{ color: "#555" }}>
          You do not have an active vendor application or profile.
        </p>
        {/* Provide a link to apply if no profile exists */}
        <Link
          to="/apply-as-vendor"
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
          Apply to Become a Vendor
        </Link>
      </div>
    );
  }

  // --- Main Dashboard Content (Profile Found and Loaded) ---
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
        Your Vendor Dashboard
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
                vendorProfile.status === "pending"
                  ? "#ffc107" // Yellow for pending
                  : vendorProfile.status === "approved" ||
                    vendorProfile.status === "active" // Assuming 'approved' transitions to 'active'
                    ? "#28a745" // Green for approved/active
                    : vendorProfile.status === "rejected" ||
                      vendorProfile.status === "suspended" ||
                      vendorProfile.status === "closed"
                      ? "#dc3545" // Red for rejected/suspended/deactivated
                      : "#6c757d", // Grey for unknown status
            }}
          >
            {vendorProfile.status.toUpperCase()}
          </span>
        </p>
        {vendorProfile.status === "pending" && (
          <p style={{ color: "#ffc107", marginTop: "10px" }}>
            Your application is currently under review. We will notify you once
            a decision has been made.
          </p>
        )}
        {vendorProfile.status === "approved" ||
          vendorProfile.status === "active" ? (
          <p style={{ color: "#28a745", marginTop: "10px" }}>
            Congratulations! Your vendor application has been approved and is now active. You can
            now manage your products and orders.
          </p>
        ) : null}
        {vendorProfile.status === "rejected" && (
          <>
            <p style={{ color: "#dc3545", marginTop: "10px" }}>
              Unfortunately, your application has been rejected.
            </p>
  
            <p style={{ marginTop: "10px" }}>
              You may try again after addressing the issues, or contact support
              for more details.
            </p>
            <Link
              to="/apply-as-vendor"
              style={{
                marginTop: "15px",
                padding: "8px 15px",
                backgroundColor: "#007bff",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
                fontWeight: "bold",
                display: "inline-block", // To make it behave like a button
              }}
            >
              Re-apply
            </Link>
          </>
        )}
        {vendorProfile.status === "suspended" && (
          <p style={{ color: "#dc3545", marginTop: "10px" }}>
            Your vendor account has been suspended. Please contact support for
            more information.
          </p>
        )}
        {vendorProfile.status === "deactivated" && (
          <p style={{ color: "#6c757d", marginTop: "10px" }}>
            Your vendor account has been deactivated.
          </p>
        )}
      </div>

      {/* Company Information Section */}
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
          Company Information
        </h3>
        <p>
          <strong>Company Name:</strong> {vendorProfile.companyName}
        </p>
        <p>
          <strong>Business Registration Number:</strong>{" "}
          {vendorProfile.businessRegistrationNumber}
        </p>
        <p>
          <strong>Legal Entity Type:</strong> {vendorProfile.legalEntityType}
        </p>
        {vendorProfile.website && (
          <p>
            <strong>Website:</strong>{" "}
            <a
              href={vendorProfile.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              {vendorProfile.website}
            </a>
          </p>
        )}
        {vendorProfile.yearEstablished && (
            <p>
                <strong>Year Established:</strong>{" "}
                {vendorProfile.yearEstablished instanceof Date && !isNaN(vendorProfile.yearEstablished.getTime())
                    ? vendorProfile.yearEstablished.getFullYear()
                    : (typeof vendorProfile.yearEstablished === 'string'
                        ? new Date(vendorProfile.yearEstablished).getFullYear()
                        : 'N/A')}
            </p>
        )}
        <p>
          <strong>Primary Product Categories:</strong>{" "}
          {vendorProfile.primaryProductCategories.join(", ")}
        </p>
        {vendorProfile.estimatedMonthlySales !== undefined && (
          <p>
            <strong>Estimated Monthly Sales:</strong> $
            {vendorProfile.estimatedMonthlySales.toLocaleString()}
          </p>
        )}
      </div>

      {/* Company Address Section */}
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
          Company Address
        </h3>
        <p>{vendorProfile.companyAddress.street}</p>
        <p>
          {vendorProfile.companyAddress.city},{" "}
          {vendorProfile.companyAddress.state}{" "}
          {vendorProfile.companyAddress.zip}
        </p>
        <p>{vendorProfile.companyAddress.country}</p>
      </div>

      {/* Contact Person Information Section */}
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
          Contact Person Details
        </h3>
        <p>
          <strong>Name:</strong> {vendorProfile.contactPersonFirstName}{" "}
          {vendorProfile.contactPersonLastName}
        </p>
        <p>
          <strong>Role:</strong> {vendorProfile.contactPersonRole}
        </p>
        <p>
          <strong>Email:</strong> {vendorProfile.contactPersonEmail}
        </p>
        <p>
          <strong>Phone:</strong> {vendorProfile.contactPersonPhone}
        </p>
      </div>

      {/* Financial Information Section */}
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
          Financial Information
        </h3>
        <p>
          <strong>Company Tax ID:</strong> {vendorProfile.companyTaxId}
        </p>
        <p>
          <strong>Business Bank Name:</strong> {vendorProfile.businessBankName}
        </p>
        <p>
          <strong>Business Bank Account Number:</strong>{" "}
          {vendorProfile.businessBankAccountNumber}
        </p>
        <p>
          <strong>Business Routing Number:</strong>{" "}
          {vendorProfile.businessRoutingNumber}
        </p>
      </div>

      {/* Documents Section */}
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
          Uploaded Documents
        </h3>
        {vendorProfile.businessRegistrationDocumentUrl ? (
          <p>
            <strong>Business Registration:</strong>{" "}
            <a
              href={vendorProfile.businessRegistrationDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              View Document
            </a>
          </p>
        ) : (
          <p>
            <strong>Business Registration:</strong> Not available
          </p>
        )}
        {vendorProfile.taxCertificateUrl ? (
          <p>
            <strong>Tax Certificate:</strong>{" "}
            <a
              href={vendorProfile.taxCertificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              View Document
            </a>
          </p>
        ) : (
          <p>
            <strong>Tax Certificate:</strong> Not available
          </p>
        )}
      </div>

      {/* Terms and Privacy Policy Agreement */}
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
          Agreements
        </h3>
        <p>
          <strong>Agreed to Terms & Conditions:</strong>{" "}
          {vendorProfile.agreedToTerms ? "Yes" : "No"}
        </p>
        <p>
          <strong>Agreed to Privacy Policy:</strong>{" "}
          {vendorProfile.agreedToPrivacyPolicy ? "Yes" : "No"}
        </p>
      </div>

      {/* Quick Actions (Example Buttons) */}
      {vendorProfile.status === "approved" || vendorProfile.status === "active" ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/vendor-dashboard/products"
            style={{
              padding: "12px 25px",
              backgroundColor: "#28a745",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
          >
            Manage Products
          </Link>
          <Link
            to="/vendor-dashboard/orders"
            style={{
              padding: "12px 25px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
          >
            View Orders
          </Link>
          <Link
            to="/vendor-dashboard/edit-profile"
            style={{
              padding: "12px 25px",
              backgroundColor: "#6c757d",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              transition: "background-color 0.2s ease",
            }}
          >
            Edit Profile
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default VendorDashboardPage;
// src/pages/UserProfilePage/UserProfilePage.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useTheme, type DefaultTheme } from "styled-components"; // Keep DefaultTheme for casting if theme is complex
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaMapMarkedAlt,
  FaClipboardList,
  FaRegCreditCard,
  FaShieldAlt,
  FaCog,
  FaStore,
  FaUserTie,
  FaPenFancy,
  FaPlusCircle,
  FaGift,
  FaIdBadge,
  FaInfoCircle,
  FaCalendarAlt,
  FaListAlt, 
  FaBuilding,
  FaPencilAlt,
  FaEye,
  FaUserClock
} from "react-icons/fa";
type ApplicationTypeLabel =
  | "Individual Seller Application"
  | "Vendor Application";

// Import all styled components from the updated styles file
import {
  UserProfilePageWrapper,
  UserProfilePageContainer,
  ProfileHeroSection,
  HeroContent,
  QuickActionIcons,
  ProfileContentWrapper,
  ContentSection,
  SectionTitle,
  SectionContentGrid,
  InfoDisplayItem,
  ApplicationHubSection,
  ApplicationActions,
  FrontendButton,
  ApplicationStatusList,
  ApplicationStatusCard,
  ApplicationInfo,
  ApplicationType,
  ApplicationMeta,
  ApplicationStatusAndActions,

  // FrontendForm, FrontendFormField, FrontendFormLabel, FrontendFormInput, // Import if forms are directly on this page
} from "./UserProfilePage.styles";
import { StatusBadge } from "@/components/seller/ViewSellerApplication.styles";
import { ActionButton } from "@/components/seller/ViewSellerApplication.styles";
import { lighten } from "polished";
// Assuming these interfaces are correctly defined in your project
import { useNotification } from "@/contexts/NotificationContext"; // Adjust path as needed
import { type IUser } from "@/types/auth";
// --- Mock User Data (ensure fields match IUser and IAddress structure) ---
const mockUser: IUser & { applications?: UserApplication[] } = {
  // ... (all existing mockUser properties)
  id: "usr_elan_001",
  email: "elara.vance@elanhomewares.com",
  password: "hashed_password",
  firstName: "Elara",
  lastName: "Vance",
  phoneNumber: "555-0123-4567",
  profilePictureUrl: "https://i.pravatar.cc/150?u=elara.vance.elan",
  addresses: [
    {
      id: "addr_ship_001",
      type: "shipping",
      street: "123 Serenity Lane",
      apartment: "Apt 4B",
      city: "Willow Creek",
      state: "CA",
      zip: "90210",
      country: "USA",
      isDefault: true,
      recipientName: "Elara Vance",
      recipientPhone: "555-0123-4567",
    },
    {
      id: "addr_bill_001",
      type: "billing",
      street: "456 Harmony Avenue",
      city: "Willow Creek",
      state: "CA",
      zip: "90210",
      country: "USA",
      isDefault: true,
      recipientName: "Elara Vance",
      recipientPhone: "555-0123-4567",
    },
  ],
  roles: ["consumer", "individual_seller"],
  individualSellerId: "seller_elan_xyz" as any,
  vendorId: undefined,
  status: "verified" as UserStatus,
  stripeCustomerId: "cus_mock_elan_123",
  createdAt: new Date("2022-01-15T10:30:00Z"),
  updatedAt: new Date("2023-11-20T16:45:00Z"),
  preferences: {
    communication: { email: true, sms: false, appNotifications: true },
    theme: "light",
    language: "en-US",
  },
  paymentMethods: [
    {
      id: "pm_visa_001",
      type: "card",
      last4: "4242",
      brand: "visa",
      isDefault: true,
      expiryMonth: 12,
      expiryYear: 2025,
      cardholderName: "Elara Vance",
    },
  ],
  // NEW Applications array
  applications: [
    {
      id: "app_seller_001",
      type: "Individual Seller Application",
      status: "approved" as UserStatus, // Assuming UserStatus has 'approved'
      applicationId: "ISA-2023-007",
      submittedDate: new Date("2023-08-10T00:00:00Z"),
      lastUpdatedDate: new Date("2023-08-25T00:00:00Z"),
      notes: "Congratulations! Your artisan profile is live.",
      viewLink: "/profile/seller-application/view/ISA-2023-007", // Path to view full application
    },
    // {
    //   id: 'app_vendor_001',
    //   type: "Vendor Application",
    //   status: "pending" as UserStatus,
    //   applicationId: "VA-2023-015",
    //   submittedDate: new Date("2023-11-01T00:00:00Z"),
    //   lastUpdatedDate: new Date("2023-11-01T00:00:00Z"),
    //   notes: "Your vendor application is currently under review.",
    //   viewLink: "/profile/vendor-application/view/VA-2023-015",
    //   updateLink: "/profile/vendor-application/update/VA-2023-015" // If pending can be updated
    // }
  ],
};

const UserProfilePage: React.FC = () => {
  const theme = useTheme() as DefaultTheme; // Cast if needed for specific theme properties
  const navigate = useNavigate();
  const { showNotification } = useNotification(); // Assuming context is set up
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserDataTimer = setTimeout(() => {
      setCurrentUser(mockUser);
      setIsLoading(false);
    }, 400); // Slightly faster simulated load
    return () => clearTimeout(fetchUserDataTimer);
  }, []);

  const handleEditSection = (sectionName: string, path?: string) => {
    if (path) {
      navigate(path);
    } else {
      // In a real app, this might open a modal for inline editing or provide specific feedback
      showNotification(
        `Editing ${sectionName} is a planned feature.`,
        "info",
        3000
      );
    }
  };
  const formatDate = (dateInput?: Date | string): string => {
    if (!dateInput) return "Not available";
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return "Invalid Date"; // Check if date is valid
      return date.toLocaleDateString(undefined, {
        // Use undefined for user's locale, or specify e.g., 'en-US'
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Date Error";
    }
  };

  const handleNavigate = (path: string, pageName?: string) => {
    if (pageName)
      showNotification(`Navigating to ${pageName}...`, "info", 2000);
    navigate(path);
  };

  const cardAnimationDelays = [
    "0.1s",
    "0.18s",
    "0.26s",
    "0.34s",
    "0.42s",
    "0.5s",
    "0.58s",
    "0.66s",
  ];
  let delayIdx = 3;

  const isSeller = useMemo(
    () =>
      currentUser?.roles.includes("individual_seller") &&
      !!currentUser.individualSellerId,
    [currentUser]
  );
  const isVendor = useMemo(
    () =>
      currentUser?.roles.some((role) => String(role).startsWith("vendor")) &&
      !!currentUser.vendorId,
    [currentUser]
  );

  // Define quick action items for the hero section
  const heroQuickActions = [
    {
      label: "My Orders",
      icon: FaClipboardList,
      action: () => handleNavigate("/profile/orders", "My Orders"),
    },
    {
      label: "Wishlist",
      icon: FaGift,
      action: () => handleNavigate("/profile/wishlist", "My Wishlist"),
    },
    {
      label: "Settings",
      icon: FaCog,
      action: () => handleNavigate("/profile/settings", "Account Settings"),
    },
  ];

  if (isLoading) {
    return (
      <UserProfilePageWrapper>
        <UserProfilePageContainer>
          <ProfileContentWrapper
            style={{
              minHeight: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                fontSize: theme.typography.body.sizes.large,
                color: theme.colors.textMedium,
              }}
            >
              Loading Your Élan Profile...
            </p>{" "}
            {/* Add a spinner/loader component here for better UX */}
          </ProfileContentWrapper>
        </UserProfilePageContainer>
      </UserProfilePageWrapper>
    );
  }

  if (!currentUser) {
    return (
      <UserProfilePageWrapper>
        <UserProfilePageContainer>
          <ProfileContentWrapper
            style={{
              textAlign: "center",
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaInfoCircle
              size="3rem"
              color={theme.colors.error}
              style={{ marginBottom: theme.spacing(3) }}
            />
            <h2
              style={{
                fontFamily: theme.typography.heading.fontFamily,
                color: theme.colors.textDark,
                marginBottom: theme.spacing(2),
              }}
            >
              Profile Unavailable
            </h2>
            <p
              style={{
                fontSize: theme.typography.body.sizes.base,
                color: theme.colors.textMedium,
                marginBottom: theme.spacing(4),
              }}
            >
              We encountered an issue loading your profile. Please try again.
            </p>
            <FrontendButton
              $variant="primary"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </FrontendButton>
          </ProfileContentWrapper>
        </UserProfilePageContainer>
      </UserProfilePageWrapper>
    );
  }

  const defaultShippingAddress = currentUser.addresses?.find(
    (addr) => addr.isDefault && addr.type === "shipping"
  );

  return (
    <UserProfilePageWrapper>
      {/* --- Hero Section --- */}
      <ProfileHeroSection>
        <HeroContent>
          <h1>Welcome, {currentUser.firstName || "Valued Member"}.</h1>
          <p className="subtitle">
            Your personal dashboard to manage preferences, orders, and explore
            the exclusive world of Élan.
          </p>
          <QuickActionIcons>
            {heroQuickActions.map((actionItem, idx) => (
              <button
                key={actionItem.label}
                onClick={actionItem.action}
                title={actionItem.label}
                // Stagger animation for hero buttons can also be done via index in TSX if preferred over nth-child
                // style={{ animationDelay: `${1 + idx * 0.15}s` }}
              >
                <actionItem.icon /> {actionItem.label}
              </button>
            ))}
          </QuickActionIcons>
        </HeroContent>
      </ProfileHeroSection>

      {/* --- Main Content Area Below Hero --- */}
      <UserProfilePageContainer>
        <ProfileContentWrapper>
          {/* Personal Details Section */}
          <ContentSection $animationDelay="0.1s">
            {" "}
            {/* Pass animation delay as transient prop */}
            <SectionTitle>
              <h2>
                <FaIdBadge /> My Profile
              </h2>
              <button
                className="section-action-btn"
                onClick={() =>
                  handleEditSection(
                    "Personal Information",
                    "/profile/edit/info"
                  )
                }
              >
                Edit Profile <FaUserEdit size="0.9em" />
              </button>
            </SectionTitle>
            <SectionContentGrid>
              <InfoDisplayItem>
                <p className="label">Full Name</p>{" "}
                <span className="value">
                  {currentUser.firstName} {currentUser.lastName}
                </span>
              </InfoDisplayItem>
              <InfoDisplayItem>
                <p className="label">Email Address</p>{" "}
                <span className="value">{currentUser.email}</span>
              </InfoDisplayItem>
              <InfoDisplayItem>
                <p className="label">Phone Number</p>{" "}
                <span className="value">
                  {currentUser.phoneNumber || "Not Provided"}
                </span>
              </InfoDisplayItem>
              <InfoDisplayItem>
                <p className="label">Élan Member Since</p>{" "}
                <span className="value">
                  {new Date(currentUser.createdAt).toLocaleDateString(
                    undefined,
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </span>
              </InfoDisplayItem>
            </SectionContentGrid>
          </ContentSection>

          {/* Address Book Section */}
          <ContentSection $animationDelay="0.2s">
            <SectionTitle>
              <h2>
                <FaMapMarkedAlt /> Address Book
              </h2>
              <button
                className="section-action-btn"
                onClick={() =>
                  handleEditSection("Addresses", "/profile/edit/addresses")
                }
              >
                Manage Addresses <FaPlusCircle size="1em" />
              </button>
            </SectionTitle>
            {currentUser.addresses && currentUser.addresses.length > 0 ? (
              <SectionContentGrid>
                {/* Display Default Shipping Address First if available, then others */}
                {defaultShippingAddress && (
                  <InfoDisplayItem
                    key={
                      defaultShippingAddress.id || defaultShippingAddress.street
                    }
                    style={{
                      borderColor: theme.colors.accent1Subtle,
                      background: lighten(
                        0.02,
                        theme.colors.accent1Subtle || "#fff"
                      ),
                    }}
                  >
                    <p
                      className="label"
                      style={{ textTransform: "capitalize" }}
                    >
                      {defaultShippingAddress.type} (Default Shipping)
                    </p>
                    <div className="value address-value">
                      {defaultShippingAddress.recipientName && (
                        <span>{defaultShippingAddress.recipientName}</span>
                      )}
                      <span>{defaultShippingAddress.street}</span>
                      {defaultShippingAddress.apartment && (
                        <span>{defaultShippingAddress.apartment}</span>
                      )}
                      <span>
                        {defaultShippingAddress.city},{" "}
                        {defaultShippingAddress.state}{" "}
                        {defaultShippingAddress.zip}
                      </span>
                      <span>{defaultShippingAddress.country}</span>
                      {defaultShippingAddress.recipientPhone && (
                        <span>
                          Phone: {defaultShippingAddress.recipientPhone}
                        </span>
                      )}
                    </div>
                  </InfoDisplayItem>
                )}
                {currentUser.addresses
                  .filter(
                    (addr) => !(addr.isDefault && addr.type === "shipping")
                  )
                  .slice(0, 1)
                  .map(
                    (
                      addr // Show one other address
                    ) => (
                      <InfoDisplayItem key={addr.id || addr.street}>
                        <p
                          className="label"
                          style={{ textTransform: "capitalize" }}
                        >
                          {addr.type} {addr.isDefault && "(Default Billing)"}
                        </p>
                        <div className="value address-value">
                          {addr.recipientName && (
                            <span>{addr.recipientName}</span>
                          )}
                          <span>{addr.street}</span>
                          {addr.apartment && <span>{addr.apartment}</span>}
                          <span>
                            {addr.city}, {addr.state} {addr.zip}
                          </span>
                          <span>{addr.country}</span>
                          {addr.recipientPhone && (
                            <span>Phone: {addr.recipientPhone}</span>
                          )}
                        </div>
                      </InfoDisplayItem>
                    )
                  )}
                {currentUser.addresses.length >
                  (defaultShippingAddress ? 2 : 1) && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      marginTop: theme.spacing(2),
                    }}
                  >
                    <FrontendButton
                      $variant="text"
                      onClick={() => handleNavigate("/profile/addresses")}
                    >
                      View all {currentUser.addresses.length} addresses
                    </FrontendButton>
                  </div>
                )}
              </SectionContentGrid>
            ) : (
              <p
                style={{
                  color: theme.colors.textMedium,
                  textAlign: "center",
                  padding: theme.spacing(4),
                }}
              >
                You haven't saved any addresses yet. Add an address for faster
                checkout.
              </p>
            )}
          </ContentSection>

          {/* Payment Methods Section */}
          <ContentSection $animationDelay="0.3s">
            <SectionTitle>
              <h2>
                <FaRegCreditCard /> Payment Methods
              </h2>
              <button
                className="section-action-btn"
                onClick={() =>
                  handleEditSection("Payment Methods", "/profile/edit/payment")
                }
              >
                Manage Payments <FaPlusCircle size="1em" />
              </button>
            </SectionTitle>
            {currentUser.paymentMethods &&
            currentUser.paymentMethods.length > 0 ? (
              <SectionContentGrid>
                {currentUser.paymentMethods.slice(0, 2).map((pm) => (
                  <InfoDisplayItem key={pm.id}>
                    <p
                      className="label"
                      style={{ textTransform: "capitalize" }}
                    >
                      {pm.brand} {pm.isDefault && "(Default)"}
                    </p>
                    <span className="value">•••• •••• •••• {pm.last4}</span>
                    <span
                      className="value"
                      style={{
                        fontSize: theme.typography.body.sizes.xsmall,
                        color: theme.colors.textMuted,
                      }}
                    >
                      Expires {String(pm.expiryMonth).padStart(2, "0")}/
                      {pm.expiryYear}
                    </span>
                  </InfoDisplayItem>
                ))}
                {currentUser.paymentMethods.length > 2 && (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      marginTop: theme.spacing(2),
                    }}
                  >
                    <FrontendButton
                      $variant="text"
                      onClick={() => handleNavigate("/profile/payment-methods")}
                    >
                      View all {currentUser.paymentMethods.length} methods
                    </FrontendButton>
                  </div>
                )}
              </SectionContentGrid>
            ) : (
              <p
                style={{
                  color: theme.colors.textMedium,
                  textAlign: "center",
                  padding: theme.spacing(4),
                }}
              >
                No payment methods on file. Securely add a payment method for
                swift purchases.
              </p>
            )}
          </ContentSection>

          {/* Order History Teaser Section */}
          <ContentSection $animationDelay="0.4s">
            <SectionTitle>
              <h2>
                <FaListAlt /> Order History
              </h2>
              <FrontendButton
                $variant="secondary"
                $size="medium"
                onClick={() =>
                  handleNavigate("/profile/orders", "Order History")
                }
              >
                View All My Orders
              </FrontendButton>
            </SectionTitle>
            {/* Placeholder for a few recent orders or summary */}
            <p
              style={{
                color: theme.colors.textMedium,
                textAlign: "center",
                padding: theme.spacing(2),
              }}
            >
              Track your recent purchases and view detailed order history.
            </p>
          </ContentSection>

          {currentUser.applications && currentUser.applications.length > 0 && (
            <ContentSection $animationDelay={cardAnimationDelays[delayIdx++]}>
              <SectionTitle>
                <h2>
                  <FaUserClock /> My Applications
                </h2>
              </SectionTitle>
              <ApplicationStatusList>
                {currentUser.applications.map((app) => (
                  <ApplicationStatusCard key={app.id} $status={app.status}>
                    <ApplicationInfo>
                      <ApplicationType>{app.type}</ApplicationType>
                      <ApplicationMeta>
                        {app.applicationId && (
                          <>
                            ID: <span>{app.applicationId}</span>
                            <br />
                          </>
                        )}
                        Submitted: <span>{formatDate(app.submittedDate)}</span>
                        <br />
                        Last Update:{" "}
                        <span>{formatDate(app.lastUpdatedDate)}</span>
                        {app.notes && (
                          <>
                            <br />
                            Note: <em>{app.notes}</em>
                          </>
                        )}
                      </ApplicationMeta>
                    </ApplicationInfo>
                    <ApplicationStatusAndActions>
                      <StatusBadge status={app.status}>
                        {app.status.replace(/_/g, " ")}
                      </StatusBadge>
                      <ActionButton
                        $variant="secondary"
                        $size="small"
                        onClick={() => app.viewLink && navigate(app.viewLink)} // Added check for app.viewLink
                        title={`View details for ${app.type}`}
                        disabled={!app.viewLink} // Disable if no link
                      >
                        <FaEye /> View Details
                      </ActionButton>
                      {(app.status === "withdrawn" ||
                        app.status === "rejected" ||
                        app.status === "action_required") &&
                        app.updateLink && (
                          <ActionButton
                            $variant="primary"
                            $size="small"
                            onClick={() =>
                              app.updateLink && navigate(app.updateLink)
                            } // Added check
                            title={`Update your ${app.type}`}
                            disabled={!app.updateLink}
                          >
                            <FaPencilAlt /> Update
                          </ActionButton>
                        )}
                    </ApplicationStatusAndActions>
                  </ApplicationStatusCard>
                ))}
              </ApplicationStatusList>
            </ContentSection>
          )}

          <ApplicationHubSection $animationDelay="0.5s">
            <SectionTitle
              style={{
                justifyContent: "center",
                borderBottom: "none",
                marginBottom: theme.spacing(3),
              }}
            >
              <h2>
                {isSeller ? (
                  <FaStore />
                ) : isVendor ? (
                  <FaBuilding />
                ) : (
                  <FaUserTie />
                )}
                {isSeller
                  ? "My Seller Central"
                  : isVendor
                  ? "My Vendor Portal"
                  : "Join the Élan Collective"}
              </h2>
            </SectionTitle>

            {!isSeller && !isVendor && (
              <>
                <p className="hub-description">
                  Elevate your brand and share your unique craftsmanship with a
                  discerning audience. Apply to become an Élan partner.
                </p>
                <ApplicationActions>
                  <FrontendButton
                    $variant="primary"
                    $size="large"
                    onClick={() => handleNavigate("/apply/seller")}
                  >
                    Apply as Artisan Seller
                  </FrontendButton>
                  {/* <FrontendButton $variant="secondary" $size="large" onClick={() => handleNavigate('/apply/vendor')}>
                        Register as Brand Partner
                    </FrontendButton> */}
                </ApplicationActions>
              </>
            )}
            {isSeller && (
              <>
                <p className="hub-description">
                  Access your Seller Dashboard to manage listings, orders, and
                  connect with the Élan community.
                </p>
                <ApplicationActions>
                  <FrontendButton
                    $variant="primary"
                    $size="large"
                    onClick={() => handleNavigate("/seller/dashboard")}
                  >
                    Go to Seller Dashboard
                  </FrontendButton>
                </ApplicationActions>
              </>
            )}
            {isVendor && (
              <>
                <p className="hub-description">
                  Utilize the Vendor Portal to manage your brand's products,
                  inventory, and collaborative opportunities with Élan.
                </p>
                <ApplicationActions>
                  <FrontendButton
                    $variant="primary"
                    $size="large"
                    onClick={() => handleNavigate("/vendor/dashboard")}
                  >
                    Go to Vendor Portal
                  </FrontendButton>
                </ApplicationActions>
              </>
            )}
          </ApplicationHubSection>
        </ProfileContentWrapper>
      </UserProfilePageContainer>
    </UserProfilePageWrapper>
  );
};

export default UserProfilePage;

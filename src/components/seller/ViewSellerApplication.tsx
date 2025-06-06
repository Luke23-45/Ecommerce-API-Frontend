// src/components/profile/display/ViewSellerApplication.tsx
import React, { useEffect, useCallback, useMemo } from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaStore,
  FaMapMarkedAlt,
  FaFileInvoiceDollar,
  FaFilePdf,
  FaCalendarAlt,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaPhone,
  FaGlobe,
  FaTags,
  FaDollarSign,
  FaBriefcase,
  FaRegCalendarCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaEdit,
  FaUndo,
  FaBan,
  FaPencilAlt,
} from "react-icons/fa";

// Import ALL styled components from the REFINED styles file
import {
  PageContainer,
  ViewHeader,
  StatusBadge,
  CardGridContainer,
  InfoCard,
  CardHeader,
  CardContent,
  CardTitle,
  FieldGrid,
  ViewField,
  ViewLabel,
  ViewValue,
  DocumentLink,
  TitleGroup,
  HeaderActionsContainer,
  ActionButton,
  TwoCardRowWrapper,
} from "./ViewSellerApplication.styles";

// Import Types and Hooks
import type {
  IAddress,
  SellerApplicationStatus,
  SellerProfileData,
} from "@/types/seller"; // Adjust path
import {
  useGetIndividualSellerProfile,
  useUpdateIndividualSellerProfileStatus,
} from "@/hooks/useIndividualSeller"; // Adjust path
import { useNotification } from "@/contexts/NotificationContext"; // Adjust path

// Mock Theme (Can be removed if ThemeProvider is globally available and configured)
const mockThemeForDemo: DefaultTheme = {
  /* ... (Your full mock theme as provided in previous prompts) ... */ colors: {
    primaryNeutral: "#F8F5F2",
    accent1: "#A46E4A",
    accent1Subtle: "#F0E7E1",
    accent2: "#8DA382",
    accent2Vibrant: "#AED581",
    accent1Vibrant: "#E57373",
    textDark: "#302D2A",
    textLight: "#FFFFFF",
    textMedium: "#5c5855",
    textMuted: "#9E9E9E",
    lightGray: "#E9E9E9",
    mediumGray: "#b0aead",
    darkGray: "#757575",
    backgroundLight: "#FFFFFF",
    adminPrimaryBg: "#f4f6f8",
    adminSurface: "#ffffff",
    error: "#D32F2F",
    success: "#388E3C",
    warning: "#FBC02D",
    adminBorder: "#e0e0e0",
    adminText: "#2C3E50",
    adminTextSecondary: "#5D6D7E",
    adminStatusError: "#D32F2F",
    adminStatusSuccess: "#388E3C",
    adminStatusWarning: "#FBC02D",
    accentFocus: "#4A90E2",
  },
  spacing: (val: number) => `${val * 4}px`,
  typography: {
    heading: {
      fontFamily: "'Playfair Display', serif",
      weights: { regular: 400, semiBold: 600, bold: 700, extraBold: 800 },
      sizes: {
        h1: "2rem",
        h2: "1.8rem",
        h3: "1.5rem",
        h4: "1.2rem",
        h5: "1rem",
      },
      lineHeights: {
        h1: "1.2",
        h2: "1.3",
        h3: "1.4",
        tight: 1.2,
        base: 1.5,
      } as any,
      letterSpacings: { h1: "-0.5px", h2: "-0.25px", tight: "-0.02em" } as any,
    },
    body: {
      fontFamily: "'Inter', sans-serif",
      sizes: {
        xsmall: "0.75rem",
        small: "0.875rem",
        base: "1rem",
        medium: "1.125rem",
        large: "1.25rem",
        base_large: "1.05rem",
      },
      weights: { regular: 400, medium: 500, semiBold: 600, bold: 700 },
      lineHeights: { base: 1.6, small: 1.5, relaxed: 1.75 },
    } as any,
    admin: {
      fontFamily: "'Inter', sans-serif",
      weights: { regular: 400, medium: 500, semiBold: 600, bold: 700 },
      sizes: {
        moduleTitle: "1.5rem",
        sectionTitle: "1.2rem",
        bodyBase: "0.95rem",
        dataCell: "0.9rem",
        label: "0.8rem",
        small: "0.75rem",
        xsmall: "0.65rem",
      },
    },
  },
  breakpoints: {
    mobileS: "320px",
    mobileM: "375px",
    mobileL: "480px",
    tablet: "768px",
    laptop: "1024px",
    laptopL: "1440px",
    desktop: "1920px",
    desktopL: "2560px",
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    xlarge: "16px",
    pill: "20px",
    circle: "50%",
  },
  shadows: {
    xs: "0 1px 3px rgba(0,0,0,0.04)",
    sm: "0 3px 8px rgba(0,0,0,0.05)",
    md: "0 5px 15px rgba(0,0,0,0.06)",
    lg: "0 8px 24px rgba(0,0,0,0.07)",
    xl: "0 12px 35px rgba(0,0,0,0.08)",
  },
  zIndex: {
    dropdown: 1000,
    stickyNav: 990,
    megaMenu: 900,
    modalOverlay: 1010,
    modalContent: 1020,
    notificationToast: 2000,
  },
  maxWidth: "1600px",
  containerPadding: "clamp(1rem, 4vw, 3.5rem)",
};

const ViewSellerApplication = () => {
  const themeFromContext = useTheme();
  const theme = (
    themeFromContext && Object.keys(themeFromContext).length > 10
      ? themeFromContext
      : mockThemeForDemo
  ) as DefaultTheme;
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const {
    data: profileData,
    error: fetchError,
    isError,
    isLoading,
    refetch,
  } = useGetIndividualSellerProfile();
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } =
    useUpdateIndividualSellerProfileStatus();

  useEffect(() => {
    if (isError && fetchError) {
      console.error("Error fetching seller profile:", fetchError);
      showNotification(
        "Failed to load seller profile. Please try again.",
        "error"
      );
    }
  }, [isError, fetchError, showNotification]);

  const handleEditProfile = useCallback(() => {
    if (profileData?._id) {
      showNotification("Redirecting to edit your profile...", "info");
      navigate(`/seller/profile/edit/${profileData._id}`);
    }
  }, [navigate, profileData, showNotification]);

  const handleNavigateToUpdateForm = useCallback(() => {
    showNotification(
      "Redirecting to update your application details...",
      "info"
    );
    navigate("/profile/edit", { state: { applicationData: profileData } });
  }, [navigate, showNotification, profileData]);

  const handleApplicationAction = useCallback(
    async (
      newStatus: SellerApplicationStatus,
      confirmMessage: string,
      actionVerb: string
    ) => {
      if (profileData?._id) {
        if (profileData.status === newStatus && newStatus !== "submitted") {
          showNotification(`Application is already ${newStatus}.`, "info");
          return;
        }
        if (window.confirm(confirmMessage)) {
          showNotification(
            `${actionVerb} application for ${profileData.sellerName}...`,
            "info",
            3000
          );
          try {
            await updateStatus({
              status: newStatus,
              sellerId: profileData._id,
            });
            showNotification(
              `Application for ${profileData.sellerName} has been ${newStatus}.`,
              "success"
            );
            refetch?.();
          } catch (err: any) {
            const message =
              err?.response?.data?.message ||
              `Failed to ${newStatus.toLowerCase()} application.`;
            showNotification(message, "error");
          }
        }
      }
    },
    [profileData, showNotification, updateStatus, refetch]
  );

  const handleWithdrawApplication = () =>
    handleApplicationAction(
      "withdrawn",
      "Are you sure you want to withdraw this application?",
      "Withdrawing"
    );
  const handleResubmitApplication = () =>
    handleApplicationAction(
      "submitted",
      "Are you sure you want to resubmit this application for review?",
      "Resubmitting"
    );

  const formatDate = (dateInput?: Date | string): string => {
    if (!dateInput) return "Not Applicable";
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Error formatting date";
    }
  };

 // --- REFINED renderAddress to return a single string ---
  const renderAddress = (address?: IAddress): string => { // Return type is now string
    if (!address || (!address.street && !address.city)) {
      return "Not Provided"; // Return string directly
    }

    const parts: string[] = [];
    if (address.recipientName) parts.push(address.recipientName);
    
    let line1 = address.street || "";
    if (address.apartment) line1 += `, ${address.apartment}`;
    if (line1) parts.push(line1);

    let line2 = "";
    if (address.city) line2 += address.city;
    if (address.state) line2 += `${line2 ? ', ' : ''}${address.state}`;
    if (address.zip) line2 += ` ${address.zip}`;
    if (line2.trim()) parts.push(line2.trim());
    
    if (address.country) parts.push(address.country);
    
    // Join all parts with a comma and space, then add phone on a new conceptual line if needed.
    // For true single line, concatenate phone too, but it might get too long.
    // For now, let's assume phone is not part of this primary single line string for address.
    let addressString = parts.filter(Boolean).join(", ");

    // If you want to include phone on the same line (can make it very long):
    // if (address.recipientPhone) {
    //   addressString += ` (Phone: ${address.recipientPhone})`;
    // }

    return addressString || "Not Provided";
  };

  const renderBusinessDocumentLink = () => {
    const documentSource = profileData?.documentURI;
    if (!documentSource) {
      return (
        <ViewValue
          style={{ fontStyle: "italic", color: theme.colors.textMuted }}
        >
          No document provided
        </ViewValue>
      );
    }
    const docName = profileData?.documentName || "View Business Document";
    const docUrl =
      typeof documentSource === "string" &&
      (documentSource.startsWith("http://") ||
        documentSource.startsWith("https://"))
        ? documentSource
        : "#";
    const isLinkActive = docUrl !== "#";

    return (
      <DocumentLink
        href={isLinkActive ? docUrl : undefined}
        target={isLinkActive ? "_blank" : undefined}
        rel={isLinkActive ? "noopener noreferrer" : undefined}
        title={
          isLinkActive
            ? `View ${docName}`
            : `Document: ${docName} (link unavailable)`
        }
        as={isLinkActive ? "a" : "span"}
        // Inline style for non-active link is handled well by styles.ts if DocumentLink has proper default and disabled-like states
        style={!isLinkActive ? { cursor: "default", opacity: 0.7 } : {}}
      >
        <FaFilePdf /* Style via IconElement or direct if simple */ /> {docName}
        {isLinkActive && (
          <FaExternalLinkAlt
            size="0.9em"
            style={{ opacity: 0.8, marginLeft: theme.spacing(1) }}
          />
        )}
      </DocumentLink>
    );
  };

  if (isLoading || isUpdatingStatus) {
    return (
      <PageContainer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        {" "}
        <div style={{ textAlign: "center" }}>
          {" "}
          <FaSpinner
            className="fa-spin"
            style={{
              fontSize: "2.8rem",
              marginBottom: theme.spacing(3),
              color: theme.colors.accent1,
            }}
          />{" "}
          <p
            style={{
              fontSize: theme.typography.body.sizes.large,
              color: theme.colors.textMedium,
            }}
          >
            {" "}
            {isUpdatingStatus
              ? "Processing Update..."
              : "Loading Profile Details..."}{" "}
          </p>{" "}
        </div>{" "}
      </PageContainer>
    );
  }
  if (isError || !profileData) {
    return (
      <PageContainer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        {" "}
        <div style={{ textAlign: "center" }}>
          {" "}
          <FaExclamationTriangle
            style={{
              fontSize: "2.8rem",
              marginBottom: theme.spacing(3),
              color: theme.colors.error,
            }}
          />{" "}
          <p
            style={{
              fontSize: theme.typography.body.sizes.large,
              color: theme.colors.textDark,
              fontWeight: theme.typography.body.weights.medium,
            }}
          >
            {" "}
            Profile Data Unavailable{" "}
          </p>{" "}
          {fetchError && (
            <p
              style={{
                fontSize: theme.typography.body.sizes.small,
                marginTop: theme.spacing(2),
                color: theme.colors.textMedium,
              }}
            >
              {" "}
              Error:{" "}
              {(fetchError as any).message ||
                "Please attempt to refresh or contact support."}{" "}
            </p>
          )}{" "}
        </div>{" "}
      </PageContainer>
    );
  }

  const currentStatus = profileData.status as SellerApplicationStatus;
  const canEdit = currentStatus === "approved";
  const canWithdraw = ["submitted", "processing", "pending"].includes(
    currentStatus
  );
  const canResubmit = ["withdrawn", "rejected"].includes(currentStatus);
  const showUpdateCardAction = canResubmit; // This makes "Update Info" show for withdrawn or rejected

  const cardAnimationDelays = [
    "0.05s",
    "0.1s",
    "0.15s",
    "0.2s",
    "0.25s",
    "0.3s",
    "0.35s",
  ]; // Shorter stagger
  let delayIndex = 0;

  return (
    <PageContainer>
      <ViewHeader>
        <TitleGroup>
          {" "}
          {/* For h1 and potential subtext like ID */}
          <h1>{profileData.sellerName || "Seller Application"}</h1>
        </TitleGroup>
        <HeaderActionsContainer>
          {canEdit && (
            <ActionButton
              $variant="secondary"
              onClick={handleEditProfile}
              title="Edit your active profile"
            >
              <FaEdit /> Edit Profile
            </ActionButton>
          )}
          {canWithdraw && (
            <ActionButton
              $variant="warning"
              onClick={handleWithdrawApplication}
              title="Withdraw application"
              disabled={isUpdatingStatus}
            >
              <FaBan /> Withdraw
            </ActionButton>
          )}
          {canResubmit && (
            <ActionButton
              $variant="primary"
              onClick={handleResubmitApplication}
              title="Resubmit this application for review"
              disabled={isUpdatingStatus}
            >
              <FaUndo /> Resubmit Application
            </ActionButton>
          )}
          {currentStatus && (
            <StatusBadge status={currentStatus}>
              {currentStatus.replace(/_/g, " ")}
            </StatusBadge>
          )}
        </HeaderActionsContainer>
      </ViewHeader>

      <CardGridContainer>
        {/* --- ROW 1 --- */}
  <TwoCardRowWrapper style={{ gridColumn: '1 / -1' }}> {/* This wrapper spans the parent grid, creating its own 2-col context */}
          
          {/* Card 1: Business Information */}
          <InfoCard animationDelay={cardAnimationDelays[delayIndex++]}>
            <CardHeader>
              <CardTitle><FaStore />Business Information</CardTitle>
              {showUpdateCardAction && (
                  <ActionButton $variant="subtle" onClick={handleNavigateToUpdateForm} title="Update Application Details">
                      <FaPencilAlt /> Update Info
                  </ActionButton>
              )}
            </CardHeader>
            <CardContent>
              <FieldGrid columns={2} $rowGap={theme.spacing(3)}> 
                <ViewField>
                  <ViewLabel as="p">Store/Seller Name</ViewLabel>
                  <ViewValue highlight>{profileData.sellerName || "N/A"}</ViewValue>
                </ViewField>
                <ViewField>
                  <ViewLabel as="p">    <FaPhone className="value-icon"/> Contact Phone</ViewLabel>
                  <ViewValue> 
                    
                      {profileData.phoneNumber || "N/A"}
                  </ViewValue>
                </ViewField>
              </FieldGrid>
            </CardContent>
          </InfoCard>

          {/* Card 2: Business Address (Conditional) */}
          {/* This will appear next to Business Information card if there's space */}
          {profileData.address && (profileData.address.street || profileData.address.city) && (
            <InfoCard animationDelay={cardAnimationDelays[delayIndex++]}>
              <CardHeader>
                <CardTitle><FaMapMarkedAlt />Business Address</CardTitle>
              </CardHeader>
              <CardContent>
                <ViewField>
                  <ViewLabel as="p">Registered Business Address</ViewLabel>
                  <ViewValue className="address-value">
                    {renderAddress(profileData.address)}
                  </ViewValue>
                </ViewField>
              </CardContent>
            </InfoCard>
          )}
          {/* If profileData.address is missing, the Business Information card will effectively take 100% 
              width of the TwoCardRowWrapper (or 50% if you add an empty placeholder or adjust styles).
              Or you can conditionally render the TwoCardRowWrapper itself.
          */}
           {/* Placeholder if address is missing but you still want to maintain the 2-column structure visually for the first card */}
           {!(profileData.address && (profileData.address.street || profileData.address.city)) && (
            <div>{/* Empty div as a grid item to maintain layout, or conditionally change TwoCardRowWrapper's grid-template-columns */}</div>
           )}

        </TwoCardRowWrapper> {/* End of the 50/50 row */}
        
        {/* If only one card on this row and CardGridContainer is auto-fit, it will take full width */}
        {/* Or adjust CardGridContainer columns for small number of items in a row if specific layout is needed */}

        {/* --- ROW 2 --- */}
        {/* Legal & Identity - Full Width Card */}
        <InfoCard
          animationDelay={cardAnimationDelays[delayIndex++]}
          style={{ gridColumn: "1 / -1" }}
        >
          <CardHeader>
            <CardTitle>
              <FaUserTie />
              Legal & Identity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGrid className="two-columns">
              <ViewField>
                <ViewLabel as="p">Legal First Name</ViewLabel>
                <ViewValue
                  style={{
                    lineHeight:
                      theme.typography.body.lineHeights?.relaxed || 1.75,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {profileData.legalFirstName || "N/A"}
                </ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p">Legal Last Name</ViewLabel>
                <ViewValue
                  style={{
                    lineHeight:
                      theme.typography.body.lineHeights?.relaxed || 1.75,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {profileData.legalLastName || "N/A"}
                </ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p">
                  {" "}
                  <FaCalendarAlt className="label-icon" /> Date of Birth
                </ViewLabel>
                <ViewValue
                  style={{
                    lineHeight:
                      theme.typography.body.lineHeights?.relaxed || 1.75,
                    display: "inline",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {formatDate(profileData.dateOfBirth)}
                </ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p">
                  {" "}
                  <FaGlobe
                    style={{
                      paddingRight: "1px",
                      paddingTop: "1px",
                    }}
                    className="label-icon"
                  />
                  Citizenship
                </ViewLabel>
                <ViewValue
                  style={{
                    lineHeight:
                      theme.typography.body.lineHeights?.relaxed || 1.75,
                    display: "inline",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {profileData.citizenshipCountry || "N/A"}
                </ViewValue>
              </ViewField>
            </FieldGrid>
            <FieldGrid columns={1} style={{ marginTop: theme.spacing(4) }}>
              <ViewField>
                <ViewLabel as="p">Tax Identification Number (TIN)</ViewLabel>
                <ViewValue>
                  {profileData.taxIdentificationNumber || "Not Provided"}
                </ViewValue>
              </ViewField>
            </FieldGrid>
          </CardContent>
        </InfoCard>

        {/* --- SUBSEQUENT CARDS (will flow into the grid) --- */}
        <InfoCard animationDelay={cardAnimationDelays[delayIndex++]}>
          <CardHeader>
            <CardTitle>
              <FaFilePdf />
              Business Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ViewField>{renderBusinessDocumentLink()}</ViewField>
          </CardContent>
        </InfoCard>

        {profileData.payoutMethodPreference && (
          <InfoCard animationDelay={cardAnimationDelays[delayIndex++]}>
            <CardHeader>
              <CardTitle>
                <FaFileInvoiceDollar />
                Bank Payout Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGrid className="two-columns">
                <ViewField>
                  <ViewLabel as="p">Payout Method</ViewLabel>
                  <ViewValue>
                    {profileData.payoutMethodPreference
                      .replace(/_/g, " ")
                      .toUpperCase()}
                  </ViewValue>
                </ViewField>
                {/* Empty ViewField trick for layout can be removed if .two-columns with auto-fit handles it well */}
                {profileData.payoutMethodPreference === "bank_transfer" && (
                  <ViewField style={{ display: "none" }} />
                )}
                {profileData.payoutMethodPreference === "bank_transfer" && (
                  <>
                    <ViewField>
                      <ViewLabel as="p">Account Holder</ViewLabel>
                      <ViewValue>
                        {profileData.bankAccountHolderName || "N/A"}
                      </ViewValue>
                    </ViewField>
                    <ViewField>
                      <ViewLabel as="p">Account Number</ViewLabel>
                      <ViewValue>
                        {profileData.bankAccountNumber || "N/A"}
                      </ViewValue>
                    </ViewField>
                    <ViewField>
                      <ViewLabel as="p">Routing Number</ViewLabel>
                      <ViewValue>
                        {profileData.bankRoutingNumber || "N/A"}
                      </ViewValue>
                    </ViewField>
                  </>
                )}
              </FieldGrid>
            </CardContent>
          </InfoCard>
        )}

        {(profileData.briefDescription ||
          profileData.primaryProductCategories?.length ||
          profileData.websiteURL ||
          profileData.estimatedMonthlySales !== undefined ||
          profileData.yearsOfSellingExperience !== undefined) && (
          <InfoCard
            animationDelay={cardAnimationDelays[delayIndex++]}
            style={{ gridColumn: "1 / -1" }}
          >
            <CardHeader>
              <CardTitle>
                <FaBriefcase />
                Business Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileData.briefDescription && (
                <ViewField style={{ marginBottom: theme.spacing(4) }}>
                  <ViewLabel as="p">Business Description</ViewLabel>
                  <ViewValue
                    style={{
                      lineHeight:
                        theme.typography.body.lineHeights?.relaxed || 1.75,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {profileData.briefDescription}
                  </ViewValue>
                </ViewField>
              )}
              <FieldGrid
                columns={3}
                $rowGap={theme.spacing(4)}
                $columnGap={theme.spacing(4)}
              >
                {profileData.primaryProductCategories &&
                  profileData.primaryProductCategories.length > 0 && (
                    <ViewField>
                      <ViewLabel as="p">
                        <FaTags className="label-icon" /> Product Categories
                      </ViewLabel>
                      <ViewValue className="array-values">
                        {profileData.primaryProductCategories.map((cat) => (
                          <span key={cat} className="array-item">
                            {cat}
                          </span>
                        ))}
                      </ViewValue>
                    </ViewField>
                  )}
                <ViewField>
                  <ViewLabel as="p">
                    <FaDollarSign className="label-icon" /> Est. Sales
                  </ViewLabel>
                  <ViewValue>
                    {profileData.estimatedMonthlySales?.toLocaleString()
                      ? `$${profileData.estimatedMonthlySales.toLocaleString()}`
                      : "Not Spec."}
                  </ViewValue>
                </ViewField>
                <ViewField>
                  <ViewLabel as="p">
                    <FaCalendarAlt className="label-icon" /> Experience
                  </ViewLabel>
                  <ViewValue>
                    {profileData.yearsOfSellingExperience !== undefined
                      ? `${profileData.yearsOfSellingExperience} yrs`
                      : "Not Spec."}
                  </ViewValue>
                </ViewField>
                {profileData.websiteURL && (
                  <ViewField>
                    {" "}
                    <ViewLabel as="p">
                      <FaGlobe className="label-icon" /> Website
                    </ViewLabel>{" "}
                    <ViewValue>
                      <DocumentLink
                        href={profileData.websiteURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Visit website`}
                      >
                        {profileData.websiteURL.replace(/^https?:\/\//, "")}{" "}
                        <FaExternalLinkAlt
                          size="0.9em"
                          style={{
                            opacity: 0.8,
                            marginLeft: theme.spacing(0.75),
                          }}
                        />
                      </DocumentLink>
                    </ViewValue>{" "}
                  </ViewField>
                )}
                {profileData.otherPlatformsSoldOn && (
                  <ViewField style={{ gridColumn: "1 / -1" }}>
                    {" "}
                    <ViewLabel as="p">
                      <FaStore className="label-icon" /> Also Sells On
                    </ViewLabel>{" "}
                    <ViewValue>
                      {profileData.otherPlatformsSoldOn}
                    </ViewValue>{" "}
                  </ViewField>
                )}
              </FieldGrid>
            </CardContent>
          </InfoCard>
        )}

        <InfoCard
          animationDelay={cardAnimationDelays[delayIndex++]}
          style={{ gridColumn: "1 / -1" }}
        >
          <CardHeader>
            <CardTitle>
              <FaShieldAlt />
              Agreements & History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGrid className="two-columns">
              <ViewField>
                <ViewLabel as="p">Terms Agreed</ViewLabel>
                <ViewValue>
                  {profileData.agreedToTerms ? "Yes" : "No"}
                </ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p">Privacy Policy Agreed</ViewLabel>
                <ViewValue>
                  {profileData.agreedToPrivacyPolicy ? "Yes" : "No"}
                </ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p">Submitted On</ViewLabel>
                <ViewValue>
                  <FaCalendarAlt className="value-icon" />
                  {formatDate(profileData.createdAt)}
                </ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p">Last Profile Update</ViewLabel>
                <ViewValue>
                  <FaRegCalendarCheck className="value-icon" />
                  {formatDate(profileData.updatedAt)}
                </ViewValue>
              </ViewField>
            </FieldGrid>
          </CardContent>
        </InfoCard>
      </CardGridContainer>
    </PageContainer>
  );
};

export default ViewSellerApplication;

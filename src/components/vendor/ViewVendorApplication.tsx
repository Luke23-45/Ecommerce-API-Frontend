// src/components/profile/display/ViewVendorApplication.tsx
import React, { useEffect, useCallback, useMemo } from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding, FaUserTie, FaMapMarkedAlt, FaFileInvoiceDollar, FaFilePdf,
  FaCalendarAlt, FaShieldAlt, FaExternalLinkAlt, FaLink, FaUsers,
  FaExclamationTriangle, FaSpinner, FaEdit, FaUndo, FaBan, FaPencilAlt,
  FaTags, FaDollarSign, FaPhone, FaRegCalendarCheck,FaBriefcase 
} from "react-icons/fa";

// Import ALL styled components from your refined styles file
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
  HeaderActionsContainer,
  ActionButton,
  MemberList,
  MemberListItem,
  TwoCardRowWrapper,
} from "./ViewVendorApplication.styles"; // Ensure this path is correct

// Import Types and Hooks
import type { IAddress, VendorProfileStatus, IVendorProfile, VendorMember, VendorScopedRole } from "@/types/vendor"; // Added VendorMember and VendorScopedRole
import { useGetVendorProfile, useVendorProfileStatus } from "@/hooks/useVendor"; // Ensure hook name matches
import { useNotification } from "@/contexts/NotificationContext";
import { TitleGroup } from "../seller/ViewSellerApplication.styles";

// Mock Theme (REMOVE if global ThemeProvider is correctly set up in your app)
const mockThemeForDemo: DefaultTheme = { colors: { primaryNeutral: "#F8F5F2", accent1: "#A46E4A", accent1Subtle: "#F0E7E1", accent2: "#8DA382", accent2Vibrant: "#AED581", accent1Vibrant: "#E57373", textDark: "#302D2A", textLight: "#FFFFFF", textMedium: "#5c5855", textMuted: "#9E9E9E", lightGray: "#E9E9E9", mediumGray: "#b0aead", darkGray: "#757575", backgroundLight: "#FFFFFF", adminPrimaryBg: "#f4f6f8", adminSurface: "#ffffff", error: "#D32F2F", success: "#388E3C", warning: "#FBC02D", adminBorder: "#e0e0e0", adminText: "#2C3E50", adminTextSecondary: "#5D6D7E", adminStatusError: "#D32F2F", adminStatusSuccess: "#388E3C", adminStatusWarning: "#FBC02D", accentFocus: "#4A90E2"}, spacing: (val: number) => `${val * 4}px`, typography: { heading: { fontFamily: "'Playfair Display', serif", weights: { regular: 400, semiBold: 600, bold: 700, extraBold: 800 }, sizes: { h1: "2rem", h2: "1.8rem", h3: "1.5rem", h4: "1.2rem", h5: "1rem"}, lineHeights: { h1: "1.2", h2: "1.3", h3: "1.4", tight: 1.2, base: 1.5 } as any, letterSpacings: { h1: "-0.5px", h2: "-0.25px", tight: "-0.02em" } as any }, body: { fontFamily: "'Inter', sans-serif", sizes: { xsmall: "0.75rem", small: "0.875rem", base: "1rem", medium: "1.125rem", large: "1.25rem", base_large: "1.05rem" }, weights: { regular: 400, medium: 500, semiBold: 600, bold: 700 }, lineHeights: { base: 1.6, small: 1.5, relaxed: 1.75 } } as any, admin: {fontFamily:"'Inter', sans-serif", weights:{regular:400, medium:500, semiBold:600, bold:700}, sizes:{moduleTitle:"1.5rem", sectionTitle:"1.2rem", bodyBase:"0.95rem",dataCell:"0.9rem",label:"0.8rem",small:"0.75rem",xsmall:"0.65rem"}} }, breakpoints: { mobileS: "320px", mobileM: "375px", mobileL: "480px", tablet: "768px", laptop: "1024px", laptopL: "1440px", desktop: "1920px", desktopL: "2560px" }, borderRadius: {small:"4px", medium:"8px",large:"12px",xlarge:"16px",pill:"20px", circle:"50%"}, shadows:{xs:"0 1px 3px rgba(0,0,0,0.04)",sm:"0 3px 8px rgba(0,0,0,0.05)",md:"0 5px 15px rgba(0,0,0,0.06)",lg:"0 8px 24px rgba(0,0,0,0.07)",xl:"0 12px 35px rgba(0,0,0,0.08)"}, zIndex:{dropdown:1000,stickyNav:990,megaMenu:900,modalOverlay:1010,modalContent:1020,notificationToast:2000}, maxWidth:"1600px", containerPadding:"clamp(1rem, 4vw, 3.5rem)" };

const ViewVendorApplication: React.FC = () => {
  const themeFromContext = useTheme();
  const theme = (themeFromContext && Object.keys(themeFromContext).length > 10 ? themeFromContext : mockThemeForDemo) as DefaultTheme;
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const { data: vendorProfileData, error: fetchError, isError, isLoading, refetch } = useGetVendorProfile();
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useVendorProfileStatus();

  useEffect(() => {
    if (isError && fetchError) {
      console.error("Error fetching vendor profile:", fetchError);
      showNotification("Failed to load vendor profile. Please try again.", "error");
    }
  }, [isError, fetchError, showNotification]);

  const handleEditProfile = useCallback(() => {
    if (vendorProfileData?._id) {
      showNotification("Redirecting to edit vendor profile...", "info");
      navigate(`/admin/vendors/edit/${vendorProfileData._id}`); // Adjusted example path for admin context
    }
  }, [navigate, vendorProfileData, showNotification]);

  const handleNavigateToUpdateForm = useCallback(() => {
    showNotification("Redirecting to update application details...", "info");
    navigate(`/admin/vendors/update-application/${vendorProfileData?._id}`, { state: { applicationData: vendorProfileData } });
  }, [navigate, showNotification, vendorProfileData]);

  const handleApplicationAction = useCallback(async (newStatus: VendorProfileStatus, confirmMessage: string, actionVerb: string) => {
    if (vendorProfileData?._id) {
      if (vendorProfileData.status === newStatus && newStatus !== "submitted") {
        showNotification(`Application is already ${newStatus}.`, "info");
        return;
      }
      if (window.confirm(confirmMessage)) {
        showNotification(`${actionVerb} application for ${vendorProfileData.companyName}...`, "info", 3000);
        try {
          await updateStatus({ status: newStatus, vendorId: vendorProfileData._id });
          showNotification(`Application for ${vendorProfileData.companyName} has been updated to ${newStatus}.`, "success");
          refetch?.();
        } catch (err: any) {
          const message = err?.response?.data?.message || `Failed to ${actionVerb.toLowerCase()} application.`;
          showNotification(`Error: ${message}`, "error");
        }
      }
    }
  }, [vendorProfileData, showNotification, updateStatus, refetch]);

  const handleWithdrawApplication = () => handleApplicationAction("withdrawn", "Are you sure you want to withdraw this vendor application?", "Withdrawing");
  const handleResubmitApplication = () => handleApplicationAction("submitted", "Are you sure you want to resubmit this vendor application for review?", "Resubmitting");

  const formatDate = (dateInput?: Date | string): string => { if (!dateInput) return "Not Specified"; try { const d = new Date(dateInput); return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString(undefined, {year:'numeric', month:'long', day:'numeric'}); } catch(e){ return "Date Format Error";} };
  
const renderAddress = (address?: IAddress): string => { // Return type is now string
    if (!address || (!address.street && !address.city && !address.zip)) {
      // Return a string directly for "Not Provided" to be consistent
      return "Not Provided"; 
    }

    const parts: string[] = [];

    if (address.attentionTo) {
      parts.push(`Attn: ${address.attentionTo}`);
    }

    let streetLine = address.street || "";
    if (address.street2) {
      streetLine += `, ${address.street2}`;
    }
    if (streetLine) {
      parts.push(streetLine);
    }
    
    // Combine city, state, zip into one segment if they exist
    const cityStateZipParts: string[] = [];
    if (address.city) cityStateZipParts.push(address.city);
    if (address.state) cityStateZipParts.push(address.state);
    if (address.zip) cityStateZipParts.push(address.zip);
    const cityStateZipString = cityStateZipParts.filter(Boolean).join(" "); // e.g., "City CA 12345"
    
    if (cityStateZipString) {
        // Add comma before city if street parts exist and cityStateZip exists
        if(parts.length > 0 && (address.city || address.state || address.zip)) {
            parts[parts.length-1] += ","; // Add comma to previous part if this part starts with city
        }
        parts.push(cityStateZipString);
    }


    if (address.country) {
      parts.push(address.country);
    }
    
    // Join parts with ", " but avoid double commas if cityStateZip started with a comma
    // A more robust way is to build parts then join.
    let finalAddress = parts.filter(p => p.trim() !== "").join(", ");
    
    // Optional: Add phone number to the same line, can make it long.
    // If you want phone on a new line, handle it separately in the JSX.
    // if (address.phoneNumber) {
    //   finalAddress += ` (Phone: ${address.phoneNumber})`;
    // }

    return finalAddress || "Not Provided"; // Fallback if all parts were somehow empty
  };

  const renderBusinessDocumentLink = () => {
    const documentSource = vendorProfileData?.businessDocument;
    if (!documentSource) { return <ViewValue as="span" style={{ fontStyle: "italic", color: theme.colors.textMuted }}>No document provided.</ViewValue>; }
    const docUrl = typeof documentSource === 'string' ? documentSource : documentSource.url;
    const docName = typeof documentSource === 'string' ? "View Uploaded Document" : (documentSource.name || "View Business Document");
    const isLinkActive = docUrl && (docUrl.startsWith('http://') || docUrl.startsWith('https://'));

    return (
      <DocumentLink
        href={isLinkActive ? docUrl : undefined}
        target={isLinkActive ? "_blank" : undefined}
        rel={isLinkActive ? "noopener noreferrer" : undefined}
        title={isLinkActive ? `View ${docName}` : `Document: ${docName} (Preview not available)`}
        as={isLinkActive ? "a" : "span"}
        // Apply disabled-like styles if not an active link
        style={!isLinkActive ? { cursor: "default", color: theme.colors.textMuted, borderColor: "transparent", background: "transparent", boxShadow: 'none', paddingLeft: 0, paddingRight: 0, opacity: 0.7 } : {}}
      >
        <FaFilePdf style={{ opacity: isLinkActive ? 1 : 0.7, color: isLinkActive ? theme.colors.accent1 : theme.colors.textMuted }} /> {docName}
        {isLinkActive && <FaExternalLinkAlt size="0.9em" style={{ opacity: 0.8, marginLeft: theme.spacing(1) }} />}
      </DocumentLink>
    );
  };

  const getLegalEntityTypeName = (typeKey?: string): string => { if (!typeKey) return "Not Specified"; const map: { [key: string]: string } = { corporation: "Corporation", llc: "LLC (Limited Liability Company)", partnership: "Partnership", sole_proprietorship: "Sole Proprietorship", other: "Other Entity"}; return map[typeKey.toLowerCase()] || typeKey; };

  // --- Loading and Error UI States ---
  if (isLoading || isUpdatingStatus) {
    return (
      <PageContainer style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 120px)" }}> {/* Adjusted minHeight */}
        <div style={{ textAlign: "center" }}>
          <FaSpinner className="fa-spin" style={{ fontSize: "2.8rem", marginBottom: theme.spacing(4), color: theme.colors.accent1 }}/>
          <p style={{ fontSize: theme.typography.body.sizes.large, color: theme.colors.textMedium }}>
            {isUpdatingStatus ? "Processing Update..." : "Loading Vendor Profile..."}
          </p>
        </div>
      </PageContainer>
    );
  }
  if (isError || !vendorProfileData) {
    return (
      <PageContainer style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 120px)" }}>
        <div style={{ textAlign: "center" }}>
          <FaExclamationTriangle style={{ fontSize: "2.8rem", marginBottom: theme.spacing(4), color: theme.colors.error }}/>
          <p style={{ fontSize: theme.typography.body.sizes.large, color: theme.colors.textDark, fontWeight: theme.typography.body.weights.medium }}>
            Unable to Load Vendor Profile
          </p>
          {fetchError && (
            <p style={{ fontSize: theme.typography.body.sizes.small, marginTop: theme.spacing(2), color: theme.colors.textMedium }}>
             Error: {(fetchError as any).message || "Please refresh the page or contact support if the issue persists."}
            </p>
          )}
        </div>
      </PageContainer>
    );
  }
  
  // --- Derived data and flags for rendering ---
  const currentStatus = vendorProfileData.status as VendorProfileStatus;
  const canEdit = currentStatus === "approved";
  const canWithdraw = ["submitted", "processing", "pending"].includes(currentStatus);
  const canResubmitOrUpdate = ["withdrawn", "rejected"].includes(currentStatus); // Flag for combined "Resubmit" or "Update Info" scenarios

  const cardAnimationDelays = ["0.05s", "0.1s", "0.15s", "0.2s", "0.25s", "0.3s", "0.35s", "0.42s"];
  let delayIndex = 0;

  return (
    <PageContainer>
      <ViewHeader>
        <TitleGroup>
    <h1>{vendorProfileData.companyName || "Vendor Application Details"}</h1>
        </TitleGroup>
  
        <HeaderActionsContainer>
          {canEdit && <ActionButton $variant="secondary" onClick={handleEditProfile} title="Edit this vendor's profile"><FaEdit /> Edit Profile</ActionButton>}
          {canWithdraw && <ActionButton $variant="warning" onClick={handleWithdrawApplication} disabled={isUpdatingStatus}><FaBan /> Withdraw</ActionButton>}
          {canResubmitOrUpdate && (
             <ActionButton 
                $variant="primary" 
                onClick={currentStatus === "withdrawn" ? handleNavigateToUpdateForm : handleResubmitApplication} 
                title={currentStatus === "withdrawn" ? "Update and Resubmit Application" : "Resubmit Application"}
                disabled={isUpdatingStatus}
              >
                {currentStatus === "withdrawn" ? <FaPencilAlt /> : <FaUndo />} 
                {currentStatus === "withdrawn" ? "Update & Resubmit" : "Resubmit"}
            </ActionButton>
          )}
          {currentStatus && <StatusBadge status={currentStatus}>{currentStatus.replace(/_/g, " ")}</StatusBadge>}
        </HeaderActionsContainer>
      </ViewHeader>

      <CardGridContainer>
        {/* Card 1: Company Overview */}
       <InfoCard 
          animationDelay={cardAnimationDelays[delayIndex++]} 
          style={{ gridColumn: '1 / -1' }} // Make this card span all columns of the CardGridContainer
        >
          <CardHeader>
            <CardTitle><FaBuilding /> Company Overview</CardTitle>
            {/* "Update Info" button logic, if it applies to this section specifically when 'canUpdateFromCard' is true */}
            {canResubmitOrUpdate  && ( // Renamed 'showUpdateCardAction' for clarity
                <ActionButton 
                    $variant="subtle" 
                    onClick={handleNavigateToUpdateForm} 
                    title="Update Company Overview Details"
                >
                    <FaPencilAlt /> Update Info
                </ActionButton>
            )}
          </CardHeader>
          <CardContent>
            <FieldGrid columns={3} $rowGap={theme.spacing(3.5)}> 
              <ViewField>
                <ViewLabel as="p" className="label">Company Name</ViewLabel>
                <ViewValue className="value" highlight>{vendorProfileData.companyName || "N/A"}</ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p" className="label">Legal Entity Type</ViewLabel>
                <ViewValue className="value">{getLegalEntityTypeName(vendorProfileData.legalEntityType)}</ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p" className="label">Business Registration No.</ViewLabel>
                <ViewValue className="value">{vendorProfileData.businessRegistrationNumber || "N/A"}</ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p" className="label">Tax ID / VAT</ViewLabel>
                <ViewValue className="value">{vendorProfileData.companyTaxId || "N/A"}</ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p" className="label">Year Established</ViewLabel>
                <ViewValue className="value">
                  <FaCalendarAlt className="value-icon"/> 
                  {vendorProfileData.yearEstablished?.toString() || "N/A"}
                </ViewValue>
              </ViewField>
              {vendorProfileData.website && (
                <ViewField>
                  <ViewLabel as="p" className="label">Company Website</ViewLabel>
                  <ViewValue className="value">
                    <FaLink className="value-icon" />
                    <DocumentLink 
                      href={vendorProfileData.website.startsWith("http") ? vendorProfileData.website : `//${vendorProfileData.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      title={`Visit ${vendorProfileData.companyName || 'company'} website`}
                    >
                      {vendorProfileData.website.replace(/^https?:\/\//, '')} 
                      <FaExternalLinkAlt size="0.85em" style={{opacity:0.8, marginLeft: theme.spacing(0.75)}}/>
                    </DocumentLink>
                  </ViewValue>
                </ViewField>
              )}
            </FieldGrid>
          </CardContent>
        </InfoCard>

  <TwoCardRowWrapper style={{ gridColumn: '1 / -1' }}>
  
          {vendorProfileData.companyAddress && (vendorProfileData.companyAddress.street || vendorProfileData.companyAddress.city) && (
          <InfoCard animationDelay={cardAnimationDelays[delayIndex++]}>
            <CardHeader><CardTitle><FaMapMarkedAlt /> Company Address</CardTitle></CardHeader>
            <CardContent>
              <ViewField><ViewLabel as="p" className="label">Registered Address</ViewLabel><ViewValue className="value address-value">{renderAddress(vendorProfileData.companyAddress)}</ViewValue></ViewField>
            </CardContent>
          </InfoCard>
        )}
        {!(vendorProfileData.companyAddress && (vendorProfileData.companyAddress.street || vendorProfileData.companyAddress.city)) && CardGridContainer.defaultProps?.style?.gridTemplateColumns?.split(' ').length === 2 && delayIndex % 2 !== 0 && <div style={{visibility:'hidden'}} />}
      <InfoCard animationDelay={cardAnimationDelays[delayIndex++]}>
            <CardHeader><CardTitle><FaFilePdf /> Business Verification</CardTitle></CardHeader>
            <CardContent><ViewField><ViewLabel as="p" className="label">Uploaded Document</ViewLabel>{renderBusinessDocumentLink()}</ViewField></CardContent>
        </InfoCard>
  </TwoCardRowWrapper>




        {/* Card 3: Primary Contact */}
        <InfoCard 
          animationDelay={cardAnimationDelays[delayIndex++]} 
          style={{ gridColumn: '1 / -1' }} // Ensures this InfoCard takes a full row
        >
          <CardHeader>
            <CardTitle><FaUserTie /> Primary Contact Details</CardTitle> {/* Icon inside CardTitle */}
            {/* Optional: Add an edit button for this section if applicable */}
            {/* {canEdit && <ActionButton $variant="subtle" onClick={() => handleEditContactDetails()}>Edit Contact</ActionButton>} */}
          </CardHeader>
          <CardContent>
            {/* 
              FieldGrid will default to 1 column if the 'columns' prop is not set 
              AND the 'two-columns' className (which applies auto-fit) is not used.
              To be explicit for single column:
            */}
            <FieldGrid columns={3} $rowGap={theme.spacing(3.5)}> {/* Explicitly 1 column, adjust rowGap */}
              <ViewField>
                <ViewLabel as="p" className="label">Full Name</ViewLabel>
                <ViewValue className="value">
                  {`${vendorProfileData.contactPersonFirstName || ''} ${vendorProfileData.contactPersonLastName || ''}`.trim() || "N/A"}
                </ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p" className="label">Role / Title</ViewLabel>
                <ViewValue className="value">
                  {vendorProfileData.contactPersonRole || "N/A"}
                </ViewValue>
              </ViewField>
              <ViewField> {/* Email already spans full width in a single column layout */}
                <ViewLabel as="p" className="label">Email Address</ViewLabel>
                <ViewValue className="value" highlight> {/* highlight prop makes it accent color */}
                  {vendorProfileData.contactPersonEmail || "N/A"}
                </ViewValue>
              </ViewField>
              <ViewField>
                <ViewLabel as="p" className="label">Contact Phone</ViewLabel>
                <ViewValue className="value">
                    <FaPhone className="value-icon"/> {/* Ensure value-icon class exists in styles for alignment */}
                    {vendorProfileData.contactPersonPhone || "N/A"}
                </ViewValue>
              </ViewField>
            </FieldGrid>
          </CardContent>
        </InfoCard>

        {/* Card 4: Business Verification Document */}
    

        {/* Card 5: Financial Information */}
        {vendorProfileData.businessBankName && ( // Only show card if essential bank info exists
             <InfoCard animationDelay={cardAnimationDelays[delayIndex++]} style={{gridColumn: '1 / -1'}}>
                <CardHeader><CardTitle><FaFileInvoiceDollar /> Financial & Payout Details</CardTitle></CardHeader>
                <CardContent>
                    <FieldGrid className="two-columns" $rowGap={theme.spacing(3)} $columnGap={theme.spacing(5)}>
                        <ViewField><ViewLabel as="p" className="label">Bank Name</ViewLabel><ViewValue className="value">{vendorProfileData.businessBankName}</ViewValue></ViewField>
                        {/* Ensure Payout Method is displayed if it exists and relates to bank transfer */}
                        {vendorProfileData.payoutMethodPreference === "bank_transfer" && <ViewField><ViewLabel as="p" className="label">Payout Method</ViewLabel><ViewValue className="value">BANK TRANSFER</ViewValue></ViewField> }
                        <ViewField><ViewLabel as="p" className="label">Account Holder</ViewLabel><ViewValue className="value">{vendorProfileData.businessBankAccountHolderName || "N/A"}</ViewValue></ViewField>
                        <ViewField><ViewLabel as="p" className="label">Account Number</ViewLabel><ViewValue className="value">{vendorProfileData.businessBankAccountNumber || "N/A"}</ViewValue></ViewField>
                        <ViewField><ViewLabel as="p" className="label">Routing Number</ViewLabel><ViewValue className="value">{vendorProfileData.businessRoutingNumber || "N/A"}</ViewValue></ViewField>
                    </FieldGrid>
                </CardContent>
            </InfoCard>
        )}
       
        {/* Card 6: Product & Sales Information */}
        {(vendorProfileData.primaryProductCategories?.length || vendorProfileData.estimatedMonthlySales !== undefined) && (
          <InfoCard animationDelay={cardAnimationDelays[delayIndex++]} style={{gridColumn: '1 / -1'}}>
            <CardHeader><CardTitle><FaBriefcase /> Product & Sales</CardTitle></CardHeader>
            <CardContent>
              <FieldGrid 
                columns={4} 
                $rowGap={theme.spacing(4)} // Corrected: Only one $rowGap specified
                $columnGap={theme.spacing(5)}
              >
                {vendorProfileData.primaryProductCategories && vendorProfileData.primaryProductCategories.length > 0 && (
                  <ViewField style={{ gridColumn: '1 / -1' }}> {/* Categories span all 3 columns */}
                    <ViewLabel as="p" className="label">
                      <FaTags className="value-icon" style={{marginRight: theme.spacing(1.5)}}/> {/* Use label-icon if defined, or value-icon */}
                      Main Product Categories
                    </ViewLabel>
                    <ViewValue className="value array-values">
                        {vendorProfileData.primaryProductCategories.map(cat => (<span key={cat} className="array-item">{cat}</span>))}
                    </ViewValue>
                  </ViewField>
                )}
                
                {/* These next two ViewFields will try to fit into the 3-column layout */}
                {/* If categories are present and span all columns, these will start on a new "row" within the 3-col grid */}
                <ViewField>
                  <ViewLabel as="p" className="label">
                    <FaDollarSign className="value-icon" style={{marginRight: theme.spacing(1.5)}}/> {/* Use label-icon if defined */}
                    Estimated Monthly Sales
                  </ViewLabel>
                  <ViewValue className="value">
                    {vendorProfileData.estimatedMonthlySales?.toLocaleString() ? `$${vendorProfileData.estimatedMonthlySales.toLocaleString()} USD` : "Not Specified"}
                  </ViewValue>
                </ViewField>

                {/* Add other fields here that should be part of this 3-column grid */}
                {/* For example, if "Years Experience", "Website", "Other Platforms" should also be in this grid: */}
                <ViewField>
                  <ViewLabel as="p" className="label">
                    <FaCalendarAlt className="value-icon" style={{marginRight: theme.spacing(1.5)}}/> {/* Use label-icon */}
                    Years Experience
                  </ViewLabel>
                  <ViewValue className="value">
                    {vendorProfileData.yearsOfSellingExperience !== undefined && vendorProfileData.yearsOfSellingExperience !== null ? `${vendorProfileData.yearsOfSellingExperience} Years` : "Not Specified"}
                  </ViewValue>
                </ViewField>
                
                {/* Website (will be on next row if 3 items are already there, or you make it span) */}
                {vendorProfileData.websiteURL && (
                    <ViewField> {/* Could be made to span if needed, e.g., style={{ gridColumn: '1 / span 2' }} */}
                        <ViewLabel as="p" className="label"><FaGlobe className="value-icon" style={{marginRight: theme.spacing(1.5)}} /> Website</ViewLabel>
                        <ViewValue className="value">
                            <DocumentLink href={vendorProfileData.websiteURL} target="_blank" rel="noopener noreferrer" title={`Visit website`}>
                              {vendorProfileData.websiteURL.replace(/^https?:\/\//, '')} <FaExternalLinkAlt size="0.9em" style={{opacity:0.8, marginLeft: theme.spacing(0.75)}}/>
                            </DocumentLink>
                        </ViewValue>
                    </ViewField>
                )}
                
                {/* Other Platforms (will also flow in the 3-column grid or span) */}
                 {vendorProfileData.otherPlatformsSoldOn && (
                    <ViewField style={{ gridColumn: '1 / -1' }}> {/* Example: Making this one span full width if it's the last distinct piece */}
                        <ViewLabel as="p" className="label"><FaStore className="value-icon" style={{marginRight: theme.spacing(1.5)}} /> Other Selling Platforms</ViewLabel>
                        <ViewValue className="value">{vendorProfileData.otherPlatformsSoldOn}</ViewValue>
                    </ViewField>
                 )}

              </FieldGrid>
            </CardContent>
          </InfoCard>
        )}
        
        {/* Card 7: Team Members */}
        {vendorProfileData.members && vendorProfileData.members.length > 0 && (
            <InfoCard animationDelay={cardAnimationDelays[delayIndex++]} style={{gridColumn: '1 / -1'}}>
                <CardHeader><CardTitle><FaUsers /> Team Members</CardTitle></CardHeader>
                <CardContent>
                    <MemberList>
                        {vendorProfileData.members.map((member: VendorMember, index: number) => (
                            <MemberListItem key={member.userId || `member-${index}`}>
                                <ViewField style={{marginBottom: theme.spacing(2)}}><ViewLabel as="p" className="label">User Identifier</ViewLabel><ViewValue className="value">{member.userId}</ViewValue></ViewField>
                                {member.email && <ViewField style={{marginBottom: theme.spacing(2)}}><ViewLabel as="p" className="label">Email</ViewLabel><ViewValue className="value">{member.email}</ViewValue></ViewField>}
                                <ViewField><ViewLabel as="p" className="label">Roles</ViewLabel>
                                    <ViewValue className="value array-values" style={{gap: theme.spacing(1)}}>
                                        {(member.roles as VendorScopedRole[])?.map((role) => (<span key={role} className="role-tag">{role.replace(/_/g, " ")}</span>))}
                                    </ViewValue>
                                </ViewField>
                                {/* Additional member details if available */}
                            </MemberListItem>
                        ))}
                    </MemberList>
                </CardContent>
            </InfoCard>
        )}

        {/* Card 8: Agreements & Timestamps */}
        <InfoCard animationDelay={cardAnimationDelays[delayIndex++]} style={{ gridColumn: '1 / -1' }}>
            <CardHeader><CardTitle><FaShieldAlt /> Legal Agreements & History</CardTitle></CardHeader>
            <CardContent>
                <FieldGrid className="two-columns">
                    <ViewField><ViewLabel as="p" className="label">Terms Agreement</ViewLabel><ViewValue className="value">{vendorProfileData.agreedToTerms ? "Agreed" : "Not Agreed"}</ViewValue></ViewField>
                    <ViewField><ViewLabel as="p" className="label">Privacy Policy Agreement</ViewLabel><ViewValue className="value">{vendorProfileData.agreedToPrivacyPolicy ? "Agreed" : "Not Agreed"}</ViewValue></ViewField>
                    <ViewField><ViewLabel as="p" className="label"><FaCalendarAlt className="value-icon"/> Application Date</ViewLabel><ViewValue className="value">{formatDate(vendorProfileData.createdAt)}</ViewValue></ViewField>
                    <ViewField><ViewLabel as="p" className="label"><FaRegCalendarCheck className="value-icon"/> Last Profile Update</ViewLabel><ViewValue className="value">{formatDate(vendorProfileData.updatedAt)}</ViewValue></ViewField>
                    {vendorProfileData.approvedBy && <ViewField><ViewLabel as="p" className="label">Approved By Admin</ViewLabel><ViewValue className="value">{vendorProfileData.approvedBy}</ViewValue></ViewField>}
                    {vendorProfileData.activatedAt && <ViewField><ViewLabel as="p" className="label"><FaCalendarAlt className="value-icon"/> Profile Activated On</ViewLabel><ViewValue className="value">{formatDate(vendorProfileData.activatedAt)}</ViewValue></ViewField>}
                </FieldGrid>
            </CardContent>
        </InfoCard>
      </CardGridContainer>
    </PageContainer>
  );
};

export default ViewVendorApplication;
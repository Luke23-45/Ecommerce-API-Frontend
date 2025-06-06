// src/components/forms/IndividualSellerProfile/IndividualSellerProfileUpdateForm.tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import { lighten,transparentize  } from "polished";
import {
  FaSave, FaTimes, FaInfoCircle, FaUpload, FaFilePdf, FaTrash,
  FaExternalLinkAlt, FaBriefcase, FaUserTie, FaMapMarkedAlt, FaCreditCard,
  FaFileSignature, FaRegListAlt, FaUserShield, FaCalendarAlt, FaCalendarCheck,
  FaSpinner, FaExclamationTriangle,
  // Rose & Progress Icons
  FaSeedling, FaLightbulb,
} from "react-icons/fa";

// Import styled components (ensure path is correct and styles file is updated)
import {
  TwoColumnPageLayout, InteractiveGuidePanel, MascotContainer, IntroMessage, InfoBubble,
  ProgressBarContainer, ProgressStep, FormPanel, FormWrapper, FormHeader, FormSection,
  FormSectionTitle, FieldGroup, MultiFieldRow, FormLabel, StyledInput, StyledSelect,
  StyledTextArea, ButtonGroup, SubmitButton, CancelButton, HelperText,
  ReadOnlyLabel, ReadOnlyValue, InfoDisplayItem, SectionContentGrid,
  FileInputWrapper, FileInfoDisplay, ExistingFileInfo,
  // AuthMessage, // If needed for general messages, useNotification preferred for toasts
} from "./IndividualSellerProfileForm.styles"; // Assuming styles are in this shared file
import { StatusBadge } from "./ViewSellerApplication.styles";
import type {
  IIndividualSellerProfile, IAddress, IIndividualSellerProfileUpdate,
} from "@/types/seller";
import {
  useGetIndividualSellerProfile, useUpdateIndividualSellerProfile,
} from "@/hooks/useIndividualSeller";
import { useNotification } from "@/contexts/NotificationContext";

// Local interface for form data including UI-specific fields
interface SellerProfileUpdateFormDataInternal extends IIndividualSellerProfileUpdate {
  selectedBusinessDocument?: File | null; // Changed from null to File | null
  currentBusinessDocumentName?: string;
  currentBankAccountNumberMasked?: string;
  currentBankRoutingNumberMasked?: string;
}

// Mock Theme (from your provided file)
const mockThemeForDemo: DefaultTheme = { /* ... (same as in your provided update form file) ... */
  colors: { primaryNeutral: "#F8F5F2", accent1: "#A46E4A", accent2: "#8DA382", accent1Vibrant: "#E57373", accent2Vibrant: "#AED581", textDark: "#302D2A", textLight: "#FFFFFF", lightGray: "#E9E9E9", darkGray: "#757575", adminSurface: "#FFFFFF", adminBorder: "#D1D1D1", adminPrimaryBg: "#FCFBF9", adminText: "#3F3F3F", adminTextSecondary: "#6B6B6B", adminStatusError: "#D32F2F", adminStatusSuccess: "#388E3C", adminStatusWarning: "#FBC02D", gradients: { accent1ToVibrant: "linear-gradient(to right, #A46E4A, #E57373)" }, },
  spacing: (val: number) => `${val * 4}px`,
  typography: { heading: { fontFamily: "'Playfair Display', serif", weights: { bold: 700, semiBold: 600, extraBold: 800 }, sizes: { h1: "2rem", h2: "1.8rem", h3: "1.5rem", h4: "1.2rem", h5: "1rem" }, lineHeights:{h1:"1.2"},letterSpacings:{} }, body: { fontFamily: "'Inter', sans-serif", sizes: {xsmall:"0.75rem", small:"0.875rem",base:"1rem",medium:"1.125rem",large:"1.25rem"}, weights: {regular:400,medium:500,semiBold:600,bold:700},lineHeights:{base:"1.6"} }, admin: { fontFamily: "'Inter', sans-serif', sans-serif", weights: {regular:400,medium:500,semiBold:600,bold:700}, sizes: {moduleTitle:"1.5rem",sectionTitle:"1.2rem",bodyBase:"0.95rem",dataCell:"0.9rem",label:"0.8rem",small:"0.75rem",xsmall:"0.65rem"} } },
  breakpoints: { mobileS: "320px", mobileM: "375px", mobileL: "425px", tablet: "768px", laptop: "1024px", laptopL: "1440px", desktop: "2560px" },
  maxWidth: "1600px", containerPadding: "clamp(1rem, 4vw, 4rem)",
  borderRadius: { small: "4px", medium: "8px", large: "12px", xlarge: "16px", pill: "999px" },
  shadows: { subtle: "0 2px 4px rgba(0,0,0,0.05)", medium: "0 4px 10px rgba(0,0,0,0.1)", large: "0 8px 20px rgba(0,0,0,0.15)" }
};


// Rose SVG Placeholder (same as for creation form)
const RoseMascotSVG = ({ theme }: { theme: DefaultTheme }) => ( /* ... (SVG code from previous response) ... */
  <svg viewBox="0 0 100 100" width="100%" height="100%" aria-label="Rose Mascot"><defs><radialGradient id="roseGradientUpd" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"><stop offset="0%" style={{ stopColor: theme.colors.accent1Vibrant ? theme.colors.accent1Vibrant : '#E57373', stopOpacity: 1 }} /><stop offset="100%" style={{ stopColor: theme.colors.accent1Vibrant ? theme.colors.accent1Vibrant : '#E57373', stopOpacity: 1 }} /></radialGradient><filter id="roseGlowUpd" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="coloredBlurUpd"/><feMerge><feMergeNode in="coloredBlurUpd"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="50" cy="50" r="30" fill="url(#roseGradientUpd)" filter="url(#roseGlowUpd)" /><circle cx="50" cy="50" r="20" fill={theme.colors.accent1Vibrant ? lighten(0.2, theme.colors.accent1Vibrant) : '#E57373'} />{[0, 72, 144, 216, 288].map(angle => (<ellipse key={angle} cx="50" cy="50" rx="25" ry="40" fill={theme.colors.accent2Vibrant ? transparentize(0.2, theme.colors.accent2Vibrant) : '#AED581'} transform={`rotate(${angle} 50 50) translate(0 -5)`} />))}<circle cx="42" cy="45" r="3" fill={theme.colors.textDark} /><circle cx="58" cy="45" r="3" fill={theme.colors.textDark} /><path d="M 40 55 Q 50 62, 60 55" stroke={theme.colors.textDark} strokeWidth="2" fill="transparent" /></svg>
);


// --- FORM_SECTIONS tailored for the UPDATE form ---
const UPDATE_FORM_SECTIONS = [
  { id: "updateBusinessProfile", title: "Business Profile", icon: <FaBriefcase />, fields: ["sellerName", "phoneNumber"], requiredFields: ["sellerName"] },
  { id: "updateBusinessAddress", title: "Business Address", icon: <FaMapMarkedAlt />, fields: ["address.street", "address.city", "address.state", "address.zip", "address.country"], requiredFields: ["address.street", "address.city", "address.state", "address.zip", "address.country"] },
  { id: "updatePayoutConfig", title: "Payout Configuration", icon: <FaCreditCard />, fields: ["payoutMethodPreference", "bankAccountHolderName", "bankAccountNumber", "bankRoutingNumber"], requiredFields: ["payoutMethodPreference"] }, // Bank fields conditional
  { id: "updateBusinessDocument", title: "Business Document", icon: <FaUpload />, fields: ["selectedBusinessDocument"], requiredFields: [] }, // File itself is not "required" to submit an update unless it's a new one.
  { id: "updateAboutOfferings", title: "About Your Offerings", icon: <FaRegListAlt />, fields: ["briefDescription", "primaryProductCategories", "estimatedMonthlySales", "yearsOfSellingExperience", "otherPlatformsSoldOn"], requiredFields: ["briefDescription", "primaryProductCategories"] },
  // Read-only sections are not interactive steps for Rose's guidance on "filling fields"
];

// Initial form data setup (from your provided file, slightly adapted)
const getInitialFormData = (profile?: IIndividualSellerProfile | null): SellerProfileUpdateFormDataInternal => {
  // ... (Logic from your IndividualSellerProfileUpdateForm.tsx [cite: 1]) ...
  const defaultEditableShape: IIndividualSellerProfileUpdate = { sellerName: "", phoneNumber: "", address: { street: "", city: "", state: "", zip: "", country: "" }, briefDescription: "", payoutMethodPreference: "bank_transfer", bankAccountHolderName: "", bankAccountNumber: "", bankRoutingNumber: "", primaryProductCategories: [], estimatedMonthlySales: undefined, yearsOfSellingExperience: undefined, otherPlatformsSoldOn: "", };
  if (!profile) return { ...defaultEditableShape, selectedBusinessDocument: null, currentBusinessDocumentName: "", currentBankAccountNumberMasked: "", currentBankRoutingNumberMasked: "", };
  const editableData: Partial<SellerProfileUpdateFormDataInternal> = {};
  (Object.keys(defaultEditableShape) as Array<keyof IIndividualSellerProfileUpdate>).forEach((key) => { if (key in profile && profile[key] !== undefined && profile[key] !== null) { if (key === "address" && profile.address) { editableData.address = { ...profile.address }; } else if (key === "primaryProductCategories" && profile.primaryProductCategories) { editableData.primaryProductCategories = [ ...profile.primaryProductCategories, ]; } else { (editableData as any)[key] = profile[key]; } } });
  editableData.bankAccountNumber = ""; editableData.bankRoutingNumber = ""; // Clear these for update form, user provides new if changing
  let currentDocName = ""; if (typeof profile.documentURI === "string") { currentDocName = profile.documentName || "View Current Document"; }
  return { ...defaultEditableShape, ...editableData, selectedBusinessDocument: null, currentBusinessDocumentName: currentDocName, currentBankAccountNumberMasked: profile.bankAccountNumber || "", currentBankRoutingNumberMasked: profile.bankRoutingNumber || "", };
};


const IndividualSellerProfileUpdateForm: React.FC = () => {
  const themeFromContext = useTheme();
  const theme = (Object.keys(themeFromContext || {}).length > 0 ? themeFromContext : mockThemeForDemo) as DefaultTheme;
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const { data: fetchedProfileData, isLoading: isLoadingProfile, isError: isFetchError, error: fetchErrorDetail } = useGetIndividualSellerProfile();
  const { mutateAsync: updateProfileMutate, isPending: isSubmitting } = useUpdateIndividualSellerProfile();

  const [formData, setFormData] = useState<SellerProfileUpdateFormDataInternal>(() => getInitialFormData(fetchedProfileData));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Rose & Progress
  const [currentSectionId, setCurrentSectionId] = useState<string>(UPDATE_FORM_SECTIONS[0].id);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [mascotMessage, setMascotMessage] = useState<string>("");
  const [showIntroMessage, setShowIntroMessage] = useState<boolean>(true);
  const [introMessageFaded, setIntroMessageFaded] = useState<boolean>(false);

  useEffect(() => {
    if (fetchedProfileData) {
      setFormData(getInitialFormData(fetchedProfileData));
      setErrors({}); // Clear errors when new data is fetched
      if (fetchedProfileData.status !== "withdrawn" && fetchedProfileData.status !== "rejected") {
        showNotification("This profile is currently active or under review. Only certain fields might be editable until the application is withdrawn or rejected.", "info", 6000);
        // setTimeout(() => navigate("/applications/seller", { replace: true }), 6000); // Optional redirect
      }
    }
  }, [fetchedProfileData, showNotification, navigate]);

  // Rose's Introduction
  useEffect(() => {
    setMascotMessage("Hi again! I'm <strong>Rose</strong> <FaSeedling style='color:"+theme.colors.accent2Vibrant+"; margin-left: 5px;'/>. Let's get your profile updated and shining!");
    const introTimer = setTimeout(() => setShowIntroMessage(false), 4000);
    const fadeOutTimer = setTimeout(() => {
      setIntroMessageFaded(true);
      const firstEditableField = UPDATE_FORM_SECTIONS[0]?.fields[0];
      setMascotMessage(getMascotGuidance(firstEditableField, fetchedProfileData));
    }, 4700);
    return () => { clearTimeout(introTimer); clearTimeout(fadeOutTimer); };
  }, [theme.colors.accent2Vibrant, fetchedProfileData]); // Added fetchedProfileData dependency

  // Mascot Guidance Logic (Tailored for Update Form)
  const getMascotGuidance = useCallback((fieldName: string | null, profileData?: IIndividualSellerProfile | null): string => {
    if (!fieldName && introMessageFaded) return `Click on any field you'd like to update, and I'll provide some tips! <FaLightbulb style='color:${theme.colors.adminStatusWarning};'/>`;
    if (!fieldName) return "Ready to make some updates?";

    const currentValue = fieldName.startsWith("address.")
      ? profileData?.address?.[fieldName.split(".")[1] as keyof IAddress]
      : profileData?.[fieldName as keyof IIndividualSellerProfile];

    let guidance = "";
    // Use your detailed messages from the creation form, slightly adapted for update context
    switch (fieldName) {
      case "sellerName": guidance = `Thinking of a new <strong>Store Name</strong>? Your current one is "${currentValue || "Not Set"}". Make it pop!`; break;
      case "phoneNumber": guidance = `Updating your <strong>Phone Number</strong>? Your current is ${currentValue || "not provided"}.`; break;
      // ... (Add more cases for all editable fields, referencing currentValue)
      case "address.street": guidance = `Updating your <strong>Street Address</strong>? Currently: "${currentValue || "N/A"}"`; break;
      case "briefDescription": guidance = `Want to refresh your <strong>Business Description</strong>? Polish your story!`; break;
      case "selectedBusinessDocument": guidance = `Need to upload a new <strong>Business Document</strong>? Ensure it's a PDF (max 2MB).`; break;
      default:
        const section = UPDATE_FORM_SECTIONS.find(s => s.fields.includes(fieldName)) || UPDATE_FORM_SECTIONS.find(s => s.id === currentSectionId);
        guidance = `Reviewing the <strong>${section?.title || 'details'}</strong>? Let me know if you need help with any field!`;
    }
    return guidance;
  }, [currentSectionId, introMessageFaded, theme.colors.adminStatusWarning]);

  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.name;
    setActiveField(fieldName);
    const sectionContainingField = UPDATE_FORM_SECTIONS.find(section => section.fields.includes(fieldName));
    if (sectionContainingField) setCurrentSectionId(sectionContainingField.id);
    if (!showIntroMessage && introMessageFaded) setMascotMessage(getMascotGuidance(fieldName, fetchedProfileData));
  }, [showIntroMessage, introMessageFaded, getMascotGuidance, fetchedProfileData]);

  // Validation and Change Handlers (from your provided update form file[cite: 1], ensure onFocus is called)
  const validateField = useCallback((name: string, value: any): string | null => {
    // ... (Using validation logic from your IndividualSellerProfileUpdateForm.tsx [cite: 1]) ...
    // Ensure this validation logic is appropriate for an update (e.g., some fields might be optional if already set)
    switch (name) {
      case "sellerName": return value.trim() ? null : "Seller name cannot be empty.";
      case "address.street": case "address.city": case "address.state": case "address.zip": case "address.country": return value.trim() ? null : `${name.replace("address.", "")} is required.`;
      case "phoneNumber": return !value || !value.trim() || /^[+]?[0-9\s\-()]{7,20}$/.test(value) ? null : "Invalid phone format."; // Allow empty if not changing
      case "bankAccountHolderName": return formData.payoutMethodPreference === "bank_transfer" && !value.trim() && !formData.currentBankAccountNumberMasked /* only require if no existing & new method is bank */ ? "Account holder name is required for new bank details." : null;
      case "bankAccountNumber": return formData.payoutMethodPreference === "bank_transfer" && value.trim() && !/^[0-9]{5,17}$/.test(value) ? "Invalid new account number." : null;
      case "bankRoutingNumber": return formData.payoutMethodPreference === "bank_transfer" && value.trim() && !/^[A-Za-z0-9]{5,17}$/.test(value) ? "Invalid new routing number." : null;
      case "briefDescription": return !value.trim() || value.trim().length >= 20 ? null : "If updating, description must be at least 20 characters.";
      case "primaryProductCategories": return (value as string[])?.length > 0 || !value ? null : "Please list at least one product category.";
      default: return null;
    }
  }, [formData.payoutMethodPreference, formData.currentBankAccountNumberMasked]);


  const validateForm = useCallback((): boolean => {
     // ... (Using validation logic from your IndividualSellerProfileUpdateForm.tsx, adapted for update form's editable fields [cite: 1]) ...
    const newErrors: Record<string, string> = {};
    let isValid = true;
    const fieldsToValidate = UPDATE_FORM_SECTIONS.flatMap(s => s.requiredFields.map(f => ({field: f, sectionId: s.id })));

    fieldsToValidate.forEach(({field, sectionId}) => {
        let valueToValidate;
        if (field.startsWith("address.")) {
          const addressKey = field.split(".")[1] as keyof IAddress;
          valueToValidate = formData.address?.[addressKey];
        } else {
          valueToValidate = formData[field as keyof SellerProfileUpdateFormDataInternal];
        }
         // Conditional validation for bank details
        if (field.startsWith("bank") && formData.payoutMethodPreference !== "bank_transfer" && sectionId === "updatePayoutConfig") {
           // If new bank details are not provided, and there's no current masked number, it's an error for bank_transfer.
           // If changing TO bank_transfer, these become required.
           // If current method is bank_transfer and user is clearing these to change method, it's fine.
           // For simplicity, if it's bank_transfer and new fields are empty, it's an error if there's no *current* detail.
           if(formData.payoutMethodPreference === "bank_transfer" && !valueToValidate && !formData.currentBankAccountNumberMasked && field !== "bankAccountHolderName"){
               // only truly require if no prior details and new ones are empty
           } else if (formData.payoutMethodPreference !== "bank_transfer"){
               return; // Not required if not bank transfer
           }
        }
        const error = validateField(field, valueToValidate);
        if (error) {
          newErrors[field] = error;
          isValid = false;
        }
    });
    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // ... (Logic from your IndividualSellerProfileUpdateForm.tsx [cite: 1]) ...
    const { name, value, type } = e.target;
    let currentErrors = { ...errors }; let processedValue: any = value;
    if ((name === "estimatedMonthlySales" || name === "yearsOfSellingExperience") && type === "number") { processedValue = value === "" ? undefined : parseInt(value, 10); if (isNaN(processedValue as number)) processedValue = undefined; }
    if (name.startsWith("address.")) { const addressField = name.split(".")[1] as keyof IAddress; setFormData(prev => ({ ...prev, address: { ...(prev.address as IAddress), [addressField]: processedValue, }}));
    } else { setFormData(prev => ({ ...prev, [name as keyof SellerProfileUpdateFormDataInternal]: processedValue, })); }
    const fieldError = validateField(name, processedValue);
    if (fieldError) currentErrors[name] = fieldError; else delete currentErrors[name];
    setErrors(currentErrors);
  }, [errors, validateField]);

  const handleProductCategoriesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (Logic from your IndividualSellerProfileUpdateForm.tsx [cite: 1]) ...
    const categories = e.target.value.split(",").map(cat => cat.trim()).filter(cat => cat && cat.length > 0);
    setFormData(prev => ({ ...prev, primaryProductCategories: categories, }));
    const fieldError = validateField("primaryProductCategories", categories);
    setErrors(prevErr => ({ ...prevErr, primaryProductCategories: fieldError || undefined, })); // Use undefined to clear
    handleInputFocus(e as any);
  }, [validateField, handleInputFocus]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // ... (Logic from your IndividualSellerProfileUpdateForm.tsx, ensuring mascot update [cite: 1]) ...
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === "application/pdf" && file.size <= 2 * 1024 * 1024) {
            setFormData(prev => ({ ...prev, selectedBusinessDocument: file }));
            setErrors(prevErr => ({ ...prevErr, selectedBusinessDocument: undefined }));
        } else { /* error handling */ 
            const errorMsg = file.size > 2 * 1024 * 1024 ? "File too large (max 2MB)." : "PDF only.";
            setErrors(prevErr => ({ ...prevErr, selectedBusinessDocument: errorMsg }));
            setFormData(prev => ({ ...prev, selectedBusinessDocument: null }));
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    } else { setFormData(prev => ({ ...prev, selectedBusinessDocument: null })); }
    if(introMessageFaded) setMascotMessage(getMascotGuidance("selectedBusinessDocument", fetchedProfileData));
  }, [introMessageFaded, getMascotGuidance, fetchedProfileData]);

  const removeSelectedFile = useCallback(() => {
    // ... (Logic from your IndividualSellerProfileUpdateForm.tsx, ensuring mascot update [cite: 1]) ...
    setFormData(prev => ({ ...prev, selectedBusinessDocument: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors(prevErr => ({ ...prevErr, selectedBusinessDocument: undefined }));
    if(introMessageFaded) setMascotMessage(getMascotGuidance("selectedBusinessDocument", fetchedProfileData));
  }, [introMessageFaded, getMascotGuidance, fetchedProfileData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && fetchedProfileData) {
      // Construct payload with ONLY changed fields (from your original update form logic [cite: 1])
      const { selectedBusinessDocument, currentBusinessDocumentName, currentBankAccountNumberMasked, currentBankRoutingNumberMasked, ...editablePayloadFromForm } = formData;
      const updatePayload: Partial<IIndividualSellerProfileUpdate> = {};

      // Compare with fetchedProfileData and add to updatePayload if different
      (Object.keys(editablePayloadFromForm) as Array<keyof IIndividualSellerProfileUpdate>).forEach(key => {
        const formValue = editablePayloadFromForm[key];
        const profileValue = fetchedProfileData[key];
        // Deep compare for address and arrays
        if (key === 'address' || key === 'primaryProductCategories') {
          if (JSON.stringify(formValue) !== JSON.stringify(profileValue)) {
            (updatePayload as any)[key] = formValue;
          }
        } else if (formValue !== undefined && formValue !== profileValue) {
           // Handle bank details specifically: only include if non-empty
           if (key.startsWith("bank") && typeof formValue === 'string' && formValue.trim() === "") {
               // Don't send empty bank strings unless it's an explicit clear (which your type might not support)
           } else {
               (updatePayload as any)[key] = formValue;
           }
        }
      });
      
      // Add new document if selected
      if (selectedBusinessDocument) {
        updatePayload.applicationReport = selectedBusinessDocument; // API needs to handle 'applicationReport' for the file
      }

      if (Object.keys(updatePayload).length === 0) {
        showNotification("No changes detected to update.", "info");
        return;
      }

      try {
        const response = await updateProfileMutate(updatePayload); // Pass only changed data
        showNotification(response?.message || "Profile updated successfully!", "success");
        // Optionally refetch or update local state based on response
      } catch (err: any) {
        showNotification(err?.response?.data?.message || "Update failed. Please try again.", "error");
      }
    } else {
      showNotification("Please correct any errors before submitting.", "error");
    }
  };

  // Progress bar completion logic
  const completedSections = useMemo(() => {
    const completed: { [key: string]: boolean } = {};
    const currentSectionIndex = UPDATE_FORM_SECTIONS.findIndex(s => s.id === currentSectionId);
    UPDATE_FORM_SECTIONS.forEach((section, index) => {
      if (index < currentSectionIndex) {
        const sectionIsErrorFree = section.requiredFields.every(fieldKey => !errors[fieldKey]);
        completed[section.id] = sectionIsErrorFree;
      } else {
        completed[section.id] = false;
      }
    });
    return completed;
  }, [currentSectionId, errors]);

  // --- Render Logic (Loading, Error, Form) ---
  if (isLoadingProfile) return <FormWrapper theme={theme} style={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"400px"}}><FaSpinner className="fa-spin" size="2em" /> Loading profile...</FormWrapper>; // Simplified loader
  if (isFetchError || !fetchedProfileData) return <FormWrapper theme={theme} style={{display:"flex", justifyContent:"center", alignItems:"center", minHeight:"400px"}}><FaExclamationTriangle size="2em" /> Error loading profile. {(fetchErrorDetail as any)?.message}</FormWrapper>; // Simplified error

  return (
    <TwoColumnPageLayout theme={theme}>
      <InteractiveGuidePanel theme={theme}>
        <MascotContainer theme={theme}><RoseMascotSVG theme={theme} /></MascotContainer>
        {showIntroMessage && <IntroMessage theme={theme} isVisible={showIntroMessage} dangerouslySetInnerHTML={{ __html: mascotMessage }} />}
        {!showIntroMessage && introMessageFaded && <InfoBubble theme={theme} isVisible={!showIntroMessage && introMessageFaded} dangerouslySetInnerHTML={{ __html: mascotMessage }} />}
        <ProgressBarContainer theme={theme}>
          {UPDATE_FORM_SECTIONS.map(section => (
            <ProgressStep key={section.id} theme={theme} isActive={section.id === currentSectionId && introMessageFaded} isCompleted={completedSections[section.id] || false}>
              {section.icon} {section.title}
            </ProgressStep>
          ))}
        </ProgressBarContainer>
      </InteractiveGuidePanel>

      <FormPanel theme={theme}>
        <FormWrapper theme={theme} onSubmit={handleSubmit} noValidate>
          <FormHeader theme={theme}>
            <h2>Update Your Seller Profile</h2>
            {fetchedProfileData.status && <StatusBadge theme={theme} status={fetchedProfileData.status}>{fetchedProfileData.status.replace(/_/g, " ")}</StatusBadge>}
          </FormHeader>

          {/* Editable Sections (using structure from your provided update form) */}
          {/* Business Profile */}
          <FormSection theme={theme} id={UPDATE_FORM_SECTIONS[0].id}>
            <FormSectionTitle theme={theme}>{UPDATE_FORM_SECTIONS[0].icon} {UPDATE_FORM_SECTIONS[0].title}</FormSectionTitle>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="sellerName">Seller / Store Name*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="sellerName" name="sellerName" value={formData.sellerName || ""} onChange={handleChange} hasError={!!errors.sellerName} required disabled={isSubmitting} />{errors.sellerName && <HelperText theme={theme} error><FaInfoCircle /> {errors.sellerName}</HelperText>}</FieldGroup>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="phoneNumber">Contact Phone Number</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber || ""} onChange={handleChange} hasError={!!errors.phoneNumber} placeholder="+1 (555) 123-4567" disabled={isSubmitting} />{errors.phoneNumber && <HelperText theme={theme} error><FaInfoCircle /> {errors.phoneNumber}</HelperText>}</FieldGroup>
          </FormSection>

          {/* Read-Only Legal & Identity (from your provided update form [cite: 1]) */}
          <FormSection theme={theme}>
            <FormSectionTitle theme={theme}><FaUserShield /> Legal & Identity (Verification Purposes)</FormSectionTitle>
            <SectionContentGrid theme={theme}>
              <InfoDisplayItem theme={theme}><p className="label">Legal Full Name</p><span className="value">{fetchedProfileData.legalFirstName} {fetchedProfileData.legalLastName}</span></InfoDisplayItem>
              <InfoDisplayItem theme={theme}><p className="label">Date of Birth</p><span className="value">{new Date(fetchedProfileData.dateOfBirth || "").toLocaleDateString()}</span></InfoDisplayItem>
              <InfoDisplayItem theme={theme}><p className="label">Citizenship</p><span className="value">{fetchedProfileData.citizenshipCountry}</span></InfoDisplayItem>
              <InfoDisplayItem theme={theme}><p className="label">Tax ID</p><span className="value">{fetchedProfileData.taxIdentificationNumber || "N/A"}</span></InfoDisplayItem>
            </SectionContentGrid>
            <HelperText theme={theme} style={{ marginTop: theme.spacing(4) }}><FaInfoCircle /> Legal info is verified. Contact support for changes.</HelperText>
          </FormSection>

          {/* Business Address (Editable) */}
          <FormSection theme={theme} id={UPDATE_FORM_SECTIONS[1].id}>
             {/* ... (Address fields with onFocus={handleInputFocus} as in previous detailed TSX) ... */}
            <FormSectionTitle theme={theme}>{UPDATE_FORM_SECTIONS[1].icon} {UPDATE_FORM_SECTIONS[1].title}</FormSectionTitle>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="address.street">Street Address*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="address.street" name="address.street" value={formData.address?.street || ""} onChange={handleChange} hasError={!!errors["address.street"]} required disabled={isSubmitting} />{errors["address.street"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["address.street"]}</HelperText>}</FieldGroup>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="address.city">City*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="address.city" name="address.city" value={formData.address?.city || ""} onChange={handleChange} hasError={!!errors["address.city"]} required disabled={isSubmitting}/>{errors["address.city"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["address.city"]}</HelperText>}</FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="address.state">State/Province*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="address.state" name="address.state" value={formData.address?.state || ""} onChange={handleChange} hasError={!!errors["address.state"]} required disabled={isSubmitting}/>{errors["address.state"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["address.state"]}</HelperText>}</FieldGroup>
            </MultiFieldRow>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="address.zip">ZIP/Postal Code*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="address.zip" name="address.zip" value={formData.address?.zip || ""} onChange={handleChange} hasError={!!errors["address.zip"]} required disabled={isSubmitting}/>{errors["address.zip"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["address.zip"]}</HelperText>}</FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="address.country">Country*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="address.country" name="address.country" value={formData.address?.country || ""} onChange={handleChange} hasError={!!errors["address.country"]} required disabled={isSubmitting}/>{errors["address.country"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["address.country"]}</HelperText>}</FieldGroup>
            </MultiFieldRow>
          </FormSection>

          {/* Payout Configuration (Editable) */}
          <FormSection theme={theme} id={UPDATE_FORM_SECTIONS[2].id}>
            {/* ... (Payout fields with onFocus={handleInputFocus} and logic for masked current details as in your provided file [cite: 1]) ... */}
            <FormSectionTitle theme={theme}>{UPDATE_FORM_SECTIONS[2].icon} {UPDATE_FORM_SECTIONS[2].title}</FormSectionTitle>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="payoutMethodPreference">Preferred Payout Method</FormLabel><StyledSelect onFocus={handleInputFocus} theme={theme} id="payoutMethodPreference" name="payoutMethodPreference" value={formData.payoutMethodPreference || "bank_transfer"} onChange={handleChange} disabled={isSubmitting}><option value="bank_transfer">Direct Bank Transfer</option><option value="paypal">PayPal</option></StyledSelect></FieldGroup>
            {formData.payoutMethodPreference === "bank_transfer" && (<>
              <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="bankAccountHolderName">Bank Account Holder's Full Name* {formData.currentBankAccountNumberMasked && "(Leave blank to keep current)"}</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="bankAccountHolderName" name="bankAccountHolderName" value={formData.bankAccountHolderName || ""} onChange={handleChange} placeholder={fetchedProfileData.bankAccountHolderName ? "Enter new if changing" : "As on bank statement"} hasError={!!errors.bankAccountHolderName} required={!formData.currentBankAccountNumberMasked} disabled={isSubmitting} />{errors.bankAccountHolderName && <HelperText theme={theme} error><FaInfoCircle /> {errors.bankAccountHolderName}</HelperText>}</FieldGroup>
              <HelperText theme={theme} style={{ marginTop: `-${theme.spacing(2)}`, marginBottom: theme.spacing(4) }}><FaInfoCircle /> To update bank details, provide new information. Current details (if any) are shown masked.</HelperText>
              <MultiFieldRow theme={theme}>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="bankAccountNumber">New Bank Account Number {formData.currentBankAccountNumberMasked && "(To Update)"}</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="bankAccountNumber" name="bankAccountNumber" value={formData.bankAccountNumber || ""} onChange={handleChange} placeholder="Enter complete new account number" hasError={!!errors.bankAccountNumber} disabled={isSubmitting} />{errors.bankAccountNumber && <HelperText theme={theme} error><FaInfoCircle /> {errors.bankAccountNumber}</HelperText>}{formData.currentBankAccountNumberMasked && <ReadOnlyValue theme={theme} style={{ fontSize: theme.typography.body.sizes.small, marginTop: theme.spacing(1), opacity: 0.7 }}>Current (Masked): {formData.currentBankAccountNumberMasked}</ReadOnlyValue>}</FieldGroup>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="bankRoutingNumber">New Bank Routing Number {formData.currentBankRoutingNumberMasked && "(To Update)"}</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="bankRoutingNumber" name="bankRoutingNumber" value={formData.bankRoutingNumber || ""} onChange={handleChange} placeholder="Enter new routing number" hasError={!!errors.bankRoutingNumber} disabled={isSubmitting} />{errors.bankRoutingNumber && <HelperText theme={theme} error><FaInfoCircle /> {errors.bankRoutingNumber}</HelperText>}{formData.currentBankRoutingNumberMasked && <ReadOnlyValue theme={theme} style={{ fontSize: theme.typography.body.sizes.small, marginTop: theme.spacing(1), opacity: 0.7 }}>Current (Masked): {formData.currentBankRoutingNumberMasked}</ReadOnlyValue>}</FieldGroup>
              </MultiFieldRow>
            </>)}
          </FormSection>

          {/* Business Document (Editable) */}
          <FormSection theme={theme} id={UPDATE_FORM_SECTIONS[3].id}>
            {/* ... (Document upload with onFocus={handleInputFocus} (on label/button) and logic for existing doc as in your file [cite: 1]) ... */}
            <FormSectionTitle theme={theme}>{UPDATE_FORM_SECTIONS[3].icon} {UPDATE_FORM_SECTIONS[3].title}</FormSectionTitle>
            {formData.currentBusinessDocumentName && !formData.selectedBusinessDocument && (<FieldGroup theme={theme}><ReadOnlyLabel theme={theme}>Current Verified Document:</ReadOnlyLabel><ExistingFileInfo theme={theme}><a href={fetchedProfileData.documentURI} target="_blank" rel="noopener noreferrer" title={formData.currentBusinessDocumentName}><FaFilePdf /> <span>{formData.currentBusinessDocumentName}</span> <FaExternalLinkAlt size="0.85em" /></a></ExistingFileInfo></FieldGroup>)}
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="selectedBusinessDocument">{formData.currentBusinessDocumentName ? "Replace Business Document (PDF, max 2MB)" : "Upload Business Document (PDF, max 2MB)"}</FormLabel><FileInputWrapper theme={theme}><label htmlFor="selectedBusinessDocument" className="file-input-label"><FaUpload />{formData.selectedBusinessDocument ? formData.selectedBusinessDocument.name.substring(0,25) + (formData.selectedBusinessDocument.name.length > 25 ? "..." : "") : "Choose PDF File"}</label><input ref={fileInputRef} type="file" id="selectedBusinessDocument" name="selectedBusinessDocument" accept=".pdf" onChange={handleFileChange} disabled={isSubmitting} /></FileInputWrapper>{formData.selectedBusinessDocument && (<FileInfoDisplay theme={theme}><span className="file-info-text"><FaFilePdf /><span className="file-name">{formData.selectedBusinessDocument.name}</span>({(formData.selectedBusinessDocument.size / 1024 / 1024).toFixed(2)}{" "}MB)</span><button type="button" onClick={removeSelectedFile} className="remove-file-btn" aria-label="Remove selected file" disabled={isSubmitting}><FaTrash /></button></FileInfoDisplay>)}{errors.selectedBusinessDocument && <HelperText theme={theme} error><FaInfoCircle /> {errors.selectedBusinessDocument}</HelperText>}</FieldGroup>
          </FormSection>

          {/* About Your Offerings (Editable) */}
          <FormSection theme={theme} id={UPDATE_FORM_SECTIONS[4].id}>
            {/* ... (Offerings fields with onFocus={handleInputFocus} as in your file [cite: 1]) ... */}
             <FormSectionTitle theme={theme}>{UPDATE_FORM_SECTIONS[4].icon} {UPDATE_FORM_SECTIONS[4].title}</FormSectionTitle>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="briefDescription">Store Description (Min. 20 chars if updating)</FormLabel><StyledTextArea onFocus={handleInputFocus} theme={theme} id="briefDescription" name="briefDescription" value={formData.briefDescription || ""} onChange={handleChange} rows={5} placeholder="Update your brand story or product focus..." minLength={20} hasError={!!errors.briefDescription} disabled={isSubmitting} />{errors.briefDescription && <HelperText theme={theme} error><FaInfoCircle /> {errors.briefDescription}</HelperText>}</FieldGroup>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="primaryProductCategories">Primary Product Categories* (comma-separated)</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="primaryProductCategories" name="primaryProductCategories" value={formData.primaryProductCategories?.join(", ") || ""} onChange={handleProductCategoriesChange} placeholder="e.g., Handcrafted Ceramics, Luxury Linens" required hasError={!!errors.primaryProductCategories} disabled={isSubmitting} />{errors.primaryProductCategories && <HelperText theme={theme} error><FaInfoCircle /> {errors.primaryProductCategories}</HelperText>}</FieldGroup>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="estimatedMonthlySales">Estimated Monthly Sales (USD)</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="number" id="estimatedMonthlySales" name="estimatedMonthlySales" value={formData.estimatedMonthlySales === undefined ? "" : formData.estimatedMonthlySales} onChange={handleChange} min="0" placeholder="e.g., 5000" disabled={isSubmitting} /></FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="yearsOfSellingExperience">Years of Selling Experience</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="number" id="yearsOfSellingExperience" name="yearsOfSellingExperience" value={formData.yearsOfSellingExperience === undefined ? "" : formData.yearsOfSellingExperience} onChange={handleChange} min="0" placeholder="e.g., 5" disabled={isSubmitting} /></FieldGroup>
            </MultiFieldRow>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="otherPlatformsSoldOn">Other Online Platforms You Sell On</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="otherPlatformsSoldOn" name="otherPlatformsSoldOn" value={formData.otherPlatformsSoldOn || ""} onChange={handleChange} placeholder="e.g., Own Website, Etsy, Not applicable" disabled={isSubmitting} /></FieldGroup>
          </FormSection>

          {/* Read-Only Agreements (from your provided update form [cite: 1]) */}
          <FormSection theme={theme}>
            <FormSectionTitle theme={theme}><FaFileSignature /> Agreements & Account Information</FormSectionTitle>
            <SectionContentGrid theme={theme} columns={1}>
              <InfoDisplayItem theme={theme}><p className="label">Terms & Conditions</p><span className="value boolean-true">Agreed on {new Date(fetchedProfileData.createdAt || "").toLocaleDateString()}</span></InfoDisplayItem>
              <InfoDisplayItem theme={theme}><p className="label">Privacy Policy</p><span className="value boolean-true">Acknowledged on {new Date(fetchedProfileData.createdAt || "").toLocaleDateString()}</span></InfoDisplayItem>
              <InfoDisplayItem theme={theme}><p className="label"><FaCalendarAlt /> Profile Created</p><span className="value">{new Date(fetchedProfileData.createdAt || "").toLocaleDateString()}</span></InfoDisplayItem>
              <InfoDisplayItem theme={theme}><p className="label"><FaCalendarCheck /> Last Updated</p><span className="value">{new Date(fetchedProfileData.updatedAt || "").toLocaleDateString()}</span></InfoDisplayItem>
            </SectionContentGrid>
          </FormSection>

          <ButtonGroup theme={theme}>
            <CancelButton theme={theme} type="button" onClick={() => setFormData(getInitialFormData(fetchedProfileData))} disabled={isSubmitting}><FaTimes /> Discard Changes</CancelButton>
            <SubmitButton theme={theme} type="submit" disabled={isSubmitting || isLoadingProfile}>{isSubmitting ? "Saving..." : <><FaSave /> Update Profile</>}</SubmitButton>
          </ButtonGroup>
        </FormWrapper>
      </FormPanel>
    </TwoColumnPageLayout>
  );
};

export default IndividualSellerProfileUpdateForm;
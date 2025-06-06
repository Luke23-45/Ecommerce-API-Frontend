// src/components/forms/VendorApplication/VendorApplicationForm.tsx
import React, { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import {
  FaBuilding, FaUserTie, FaLink, FaLandmark, FaInfoCircle, FaUpload,
  FaFilePdf, FaTrash, FaSave, FaTimes, FaCalendarAlt, FaPercentage,
  FaFileSignature, FaAtlas, FaTags, FaMoneyBillWave, FaMapMarkedAlt,
  FaUserShield, FaPaperPlane,
  // Rose & Progress Icons
  FaSeedling, FaLightbulb,
} from "react-icons/fa";

// Using the "Rose" interactive styles from the seller form's styles file
import {
  TwoColumnPageLayout, InteractiveGuidePanel, MascotContainer, IntroMessage, InfoBubble,
  ProgressBarContainer, ProgressStep, FormPanel, FormWrapper, FormHeader, FormSection,
  FormSectionTitle, FieldGroup, MultiFieldRow, FormLabel, StyledInput, StyledSelect,
  StyledTextArea, StyledCheckbox, CheckboxLabel, CheckboxWrapper, ButtonGroup,
  SubmitButton, CancelButton, HelperText, FileInputWrapper, FileInfoDisplay,
} from "../seller/IndividualSellerProfileForm.styles"; // Path to your "Rose" styles

import { type IAddress } from "@/types/seller";
import type { IVendorProfile } from "@/types/vendor";
import { useNotification } from "@/contexts/NotificationContext";
import { useCreateVendorProfile } from "@/hooks/useVendor";
import { AuthMessage } from "@/pages/AuthPage/AuthPage.styles";
import { lighten, transparentize } from 'polished'; // Ensure polished is imported for RoseMascotSVG

// Mock Theme (from your VendorApplicationForm.tsx)
const mockThemeForDemo: DefaultTheme = {
  colors: { primaryNeutral: "#F8F5F2", accent1: "#A46E4A", accent2: "#8DA382", accent1Vibrant: "#E57373", accent2Vibrant: "#AED581", textDark: "#302D2A", textLight: "#FFFFFF", lightGray: "#E9E9E9", darkGray: "#757575", adminSurface: "#FFFFFF", adminBorder: "#D1D1D1", adminPrimaryBg: "#FCFBF9", adminText: "#3F3F3F", adminTextSecondary: "#6B6B6B", adminStatusError: "#D32F2F", adminStatusSuccess: "#388E3C", adminStatusWarning: "#FBC02D", gradients: { accent1ToVibrant: "linear-gradient(to right, #A46E4A, #E57373)" }, },
  spacing: (val: number) => `${val * 4}px`,
  typography: { heading: { fontFamily: "'Playfair Display', serif", weights: { regular:400, bold: 700, semiBold: 600, extraBold: 800 }, sizes: { h1: "2rem", h2: "1.8rem", h3: "1.5rem", h4: "1.2rem", h5: "1rem" }, lineHeights:{h1:"1.2"},letterSpacings:{} }, body: { fontFamily: "'Inter', sans-serif", sizes: {xsmall:"0.75rem", small:"0.875rem",base:"1rem",medium:"1.125rem",large:"1.25rem"}, weights: {regular:400,medium:500,semiBold:600,bold:700},lineHeights:{base:"1.6"} }, admin: { fontFamily: "'Inter', sans-serif', sans-serif", weights: {regular:400,medium:500,semiBold:600,bold:700}, sizes: {moduleTitle:"1.5rem",sectionTitle:"1.2rem",bodyBase:"0.95rem",dataCell:"0.9rem",label:"0.8rem",small:"0.75rem",xsmall:"0.65rem"} } },
  breakpoints: { mobileS: "320px", mobileM: "375px", mobileL: "425px", tablet: "768px", laptop: "1024px", laptopL: "1440px", desktop: "2560px" },
  maxWidth: "1600px", containerPadding: "clamp(1rem, 4vw, 4rem)",
  borderRadius: { small: "4px", medium: "8px", large: "12px", xlarge: "16px", pill: "999px" },
  shadows: { subtle: "0 2px 4px rgba(0,0,0,0.05)", medium: "0 4px 10px rgba(0,0,0,0.1)", large: "0 8px 20px rgba(0,0,0,0.15)" }
};

// Rose SVG Placeholder
const RoseMascotSVG = ({ theme }: { theme: DefaultTheme }) => (
  <svg viewBox="0 0 100 100" width="100%" height="100%" aria-label="Rose Mascot">
    <defs>
      <radialGradient id="roseGradientVendorApp" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style={{ stopColor: lighten(0.1, theme.colors.accent1Vibrant || '#E57373'), stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: theme.colors.accent1Vibrant || '#E57373', stopOpacity: 1 }} />
      </radialGradient>
      <filter id="roseGlowVendorApp" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlurVendorApp"/>
        <feMerge>
            <feMergeNode in="coloredBlurVendorApp"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="50" cy="50" r="30" fill="url(#roseGradientVendorApp)" filter="url(#roseGlowVendorApp)" />
    <circle cx="50" cy="50" r="20" fill={lighten(0.2, theme.colors.accent1Vibrant || '#E57373')} />
    {[0, 72, 144, 216, 288].map(angle => (
      <ellipse
        key={angle}
        cx="50"
        cy="50"
        rx="25"
        ry="40"
        fill={transparentize(0.2, theme.colors.accent2Vibrant || '#AED581')}
        transform={`rotate(${angle} 50 50) translate(0 -5)`}
      />
    ))}
    <circle cx="42" cy="45" r="3" fill={theme.colors.textDark} />
    <circle cx="58" cy="45" r="3" fill={theme.colors.textDark} />
    <path d="M 40 55 Q 50 62, 60 55" stroke={theme.colors.textDark} strokeWidth="2" fill="transparent" />
  </svg>
);

type VendorFormDataType = Omit<IVendorProfile, "_id" | "userId" | "status" | "approvedBy" | "activatedAt" | "members" | "createdAt" | "updatedAt" | "businessDocumentUrl"> & {
  // applicationReport should be File | null
};

const initialVendorFormData: VendorFormDataType = {
  companyName: "", businessRegistrationNumber: "", companyAddress: { street: "", city: "", state: "", zip: "", country: "" }, legalEntityType: "", contactPersonFirstName: "", contactPersonLastName: "", contactPersonEmail: "", contactPersonPhone: "", contactPersonRole: "", website: "", yearEstablished: undefined, companyTaxId: "", businessBankName: "", businessBankAccountNumber: "", businessRoutingNumber: "", primaryProductCategories: [], estimatedMonthlySales: undefined, agreedToTerms: false, agreedToPrivacyPolicy: false, applicationReport: null,
};

const VENDOR_FORM_SECTIONS = [
  { id: "vendorCompanyInfo", title: "Company Information", icon: <FaBuilding />, fields: ["companyName", "businessRegistrationNumber", "legalEntityType", "yearEstablished", "companyTaxId", "website"], requiredFields: ["companyName", "businessRegistrationNumber", "legalEntityType"] },
  { id: "vendorCompanyAddress", title: "Company Address", icon: <FaMapMarkedAlt />, fields: ["companyAddress.street", "companyAddress.city", "companyAddress.state", "companyAddress.zip", "companyAddress.country"], requiredFields: ["companyAddress.street", "companyAddress.city", "companyAddress.state", "companyAddress.zip", "companyAddress.country"] },
  { id: "vendorPrimaryContact", title: "Primary Contact", icon: <FaUserTie />, fields: ["contactPersonFirstName", "contactPersonLastName", "contactPersonEmail", "contactPersonPhone", "contactPersonRole"], requiredFields: ["contactPersonFirstName", "contactPersonLastName", "contactPersonEmail"] },
  { id: "vendorBusinessBanking", title: "Business Banking", icon: <FaLandmark />, fields: ["businessBankName", "businessBankAccountNumber", "businessRoutingNumber"], requiredFields: ["businessBankName", "businessBankAccountNumber", "businessRoutingNumber"] },
  { id: "vendorProductSales", title: "Product & Sales", icon: <FaTags />, fields: ["primaryProductCategories", "estimatedMonthlySales"], requiredFields: ["primaryProductCategories"] },
  { id: "vendorVerificationDoc", title: "Verification Document", icon: <FaUserShield />, fields: ["applicationReport"], requiredFields: ["applicationReport"] },
  { id: "vendorAgreements", title: "Agreements", icon: <FaFileSignature />, fields: ["agreedToTerms", "agreedToPrivacyPolicy"], requiredFields: ["agreedToTerms", "agreedToPrivacyPolicy"] },
];

const VendorApplicationForm = () => {
  const themeFromContext = useTheme();
  const theme = (Object.keys(themeFromContext || {}).length > 0 ? themeFromContext : mockThemeForDemo) as DefaultTheme;

  const [formData, setFormData] = useState<VendorFormDataType>(initialVendorFormData);
  const [documentName, setDocumentName] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showNotification } = useNotification();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { mutateAsync, isPending: isLoadingSubmission } = useCreateVendorProfile();

  const [currentSectionId, setCurrentSectionId] = useState<string>(VENDOR_FORM_SECTIONS[0].id);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [mascotMessage, setMascotMessage] = useState<string>("");
  const [showIntroMessage, setShowIntroMessage] = useState<boolean>(true);
  const [introMessageFaded, setIntroMessageFaded] = useState<boolean>(false);

  useEffect(() => {
    const iconHtml = `<span style="color:${theme.colors.accent2Vibrant || '#AED581'}; margin-left: 5px;">&#127801;</span>`; // Rose emoji or use FaSeedling
    setMascotMessage(`Hello! I'm <strong>Rose</strong> ${iconHtml}, and I'm thrilled to help you join Élan as a Vendor Partner! Let's get started on your application.`);
    const introTimer = setTimeout(() => setShowIntroMessage(false), 4500);
    const fadeOutTimer = setTimeout(() => {
      setIntroMessageFaded(true);
      const firstEditableField = VENDOR_FORM_SECTIONS[0]?.fields[0];
      setMascotMessage(getMascotGuidance(firstEditableField));
    }, 5200);
    return () => { clearTimeout(introTimer); clearTimeout(fadeOutTimer); };
  }, [theme.colors.accent2Vibrant]);

  const getMascotGuidance = useCallback((fieldName: string | null): string => {
    const lightbulbHtml = `<span style="color:${theme.colors.adminStatusWarning || '#FBC02D'}; margin-left: 5px;">&#128161;</span>`; // Lightbulb emoji
    if (!fieldName && introMessageFaded) return `Ready to tell us about your amazing business? Click any field for guidance! ${lightbulbHtml}`;
    if (!fieldName) return "Let's build a great partnership!";

    switch (fieldName) {
      case "companyName": return "What's the <strong>Official Company Name</strong>? This is how we'll formally know you.";
      case "businessRegistrationNumber": return "Your <strong>Business Registration Number</strong> helps us verify your company's legitimacy.";
      case "legalEntityType": return "What's your company's <strong>Legal Entity Type</strong> (e.g., Corporation, LLC)?";
      case "yearEstablished": return "When was your company <strong>Established</strong>? (YYYY format)";
      case "companyTaxId": return "Your <strong>Company Tax ID or VAT Number</strong> is important for financial processing.";
      case "website": return "Have a <strong>Company Website</strong>? Share the link so we can see your online presence!";
      case "companyAddress.street": return "Let's get your <strong>Company's Street Address</strong>. Accuracy is key!";
      case "companyAddress.city": return "The <strong>City</strong> where your company is registered.";
      case "companyAddress.state": return "The <strong>State or Province</strong> for your company's address.";
      case "companyAddress.zip": return "The <strong>ZIP or Postal Code</strong> for your company.";
      case "companyAddress.country": return "And the <strong>Country</strong> of your company's registration.";
      case "contactPersonFirstName": return "Who is our <strong>Primary Contact Person</strong>? Let's start with their First Name.";
      case "contactPersonLastName": return "And the <strong>Last Name</strong> of your primary contact.";
      case "contactPersonEmail": return "What's the <strong>Email Address</strong> for your primary contact? We'll send important updates here.";
      case "contactPersonPhone": return "A <strong>Phone Number</strong> for the primary contact is helpful for quick communication.";
      case "contactPersonRole": return "What is the <strong>Role or Title</strong> of your primary contact person?";
      case "businessBankName": return "Which <strong>Bank</strong> does your company use for business transactions?";
      case "businessBankAccountNumber": return "Please provide your company's <strong>Bank Account Number</strong> carefully.";
      case "businessRoutingNumber": return "The <strong>Bank Routing Number</strong> (like ABA, SWIFT, or IBAN) ensures smooth payouts.";
      case "primaryProductCategories": return "What are your <strong>Main Product Categories</strong>? (e.g., Luxury Furniture, Artisan Decor), comma-separated.";
      case "estimatedMonthlySales": return "What's your company's <strong>Estimated Monthly Sales Volume</strong> in USD?";
      case "applicationReport": return "Please upload your <strong>Business Verification Document</strong> (e.g., Registration, License). PDF format, max 5MB.";
      case "agreedToTerms": return "Time for the formalities! Please review and agree to our <strong>Vendor Agreement & Terms of Service</strong>.";
      case "agreedToPrivacyPolicy": return "One last step for agreements: please acknowledge our <strong>Privacy Policy</strong>.";
      default:
        const section = VENDOR_FORM_SECTIONS.find(s => s.fields.includes(fieldName)) || VENDOR_FORM_SECTIONS.find(s => s.id === currentSectionId);
        return `Working on the <strong>${section?.title || 'details'}</strong> section. You're doing great!`;
    }
  }, [currentSectionId, introMessageFaded, theme.colors.adminStatusWarning]);

  const handleInputFocus = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.name;
    setActiveField(fieldName);
    const sectionContainingField = VENDOR_FORM_SECTIONS.find(section => section.fields.includes(fieldName));
    if (sectionContainingField) setCurrentSectionId(sectionContainingField.id);
    if (!showIntroMessage && introMessageFaded) setMascotMessage(getMascotGuidance(fieldName));
  }, [showIntroMessage, introMessageFaded, getMascotGuidance]);

  const validateField = useCallback((name: string, value: any): string | null => {
    switch (name) {
      case "companyName": case "businessRegistrationNumber": case "companyAddress.street": case "companyAddress.city": case "companyAddress.state": case "companyAddress.zip": case "companyAddress.country": case "legalEntityType": case "contactPersonFirstName": case "contactPersonLastName": case "contactPersonEmail": case "businessBankName": case "businessBankAccountNumber": case "businessRoutingNumber":
        return value?.toString().trim() ? null : `${name.replace("companyAddress.", "")} is required.`;
      case "contactPersonPhone": return !value || !value.toString().trim() || /^[+]?[0-9\s\-()]{7,20}$/.test(value) ? null : "Invalid phone format.";
      case "website": return !value || !value.toString().trim() || /^(https|http):\/\/[^\s/$.?#].[^\s]*$/i.test(value) ? null : "Invalid URL (e.g., https://example.com).";
      case "yearEstablished": return !value || (Number(value) >= 1800 && Number(value) <= new Date().getFullYear()) ? null : "Invalid year (1800-current).";
      case "applicationReport": return formData.applicationReport ? null : "Business document is required.";
      case "agreedToTerms": case "agreedToPrivacyPolicy": return value === true ? null : "Agreement is required.";
      case "primaryProductCategories": return (Array.isArray(value) && value.length > 0) ? null : "At least one product category is required.";
      default: return null;
    }
  }, [formData.applicationReport]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}; let isValid = true;
    VENDOR_FORM_SECTIONS.forEach(section => {
        section.requiredFields.forEach(fieldName => {
            let valueToValidate;
            if (fieldName.startsWith("companyAddress.")) {
                const addressKey = fieldName.split(".")[1] as keyof IAddress;
                valueToValidate = formData.companyAddress[addressKey];
            } else {
                valueToValidate = formData[fieldName as keyof VendorFormDataType];
            }
            const error = validateField(fieldName, valueToValidate);
            if (error) { newErrors[fieldName] = error; isValid = false; }
        });
    });
    setErrors(newErrors); return isValid;
  }, [formData, validateField]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target; let currentErrors = { ...errors };
    if (type === "checkbox") { const { checked } = e.target as HTMLInputElement; setFormData(prev => ({ ...prev, [name]: checked })); if (checked && currentErrors[name]) delete currentErrors[name]; else if (!checked) { const err = validateField(name,checked); if(err) currentErrors[name]=err; }
    } else if (name.startsWith("companyAddress.")) { const addressField = name.split(".")[1]; setFormData(prev => ({ ...prev, companyAddress: { ...prev.companyAddress, [addressField]: value }})); const fieldError = validateField(name, value); if (fieldError) currentErrors[name] = fieldError; else delete currentErrors[name];
    } else if (name === "yearEstablished" || name === "estimatedMonthlySales") { const numValue = value === "" ? undefined : parseInt(value, 10); setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? undefined : numValue })); const fieldError = validateField(name, numValue); if (fieldError) currentErrors[name] = fieldError; else delete currentErrors[name];
    } else { setFormData(prev => ({ ...prev, [name]: value })); const fieldError = validateField(name, value); if (fieldError) currentErrors[name] = fieldError; else delete currentErrors[name]; }
    setErrors(currentErrors);
  }, [errors, validateField]);

  const handleProductCategoriesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const categories = e.target.value.split(",").map(cat => cat.trim()).filter(cat => cat);
    setFormData(prev => ({ ...prev, primaryProductCategories: categories }));
    const fieldError = validateField("primaryProductCategories", categories);
    setErrors(prevErr => ({...prevErr, primaryProductCategories: fieldError || undefined }));
    handleInputFocus(e as any);
  }, [validateField, handleInputFocus]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let localFileError = "";
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) { // Max 5MB
            setFormData(prev => ({ ...prev, applicationReport: file }));
            setDocumentName(file.name);
            setErrors(prev => ({ ...prev, applicationReport: undefined })); // Clear error
            localFileError = "";
        } else {
            localFileError = file.size > 5 * 1024 * 1024 ? "File too large (max 5MB)." : "PDF only.";
            setErrors(prev => ({ ...prev, applicationReport: localFileError }));
            setFormData(prev => ({ ...prev, applicationReport: null }));
            setDocumentName("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }
    if(introMessageFaded) setMascotMessage(getMascotGuidance(localFileError ? null : "applicationReport"));
  }, [introMessageFaded, getMascotGuidance]);

  const removeSelectedFile = useCallback(() => {
    setFormData(prev => ({ ...prev, applicationReport: null }));
    setDocumentName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors(prev => ({ ...prev, applicationReport: undefined })); // Clear error
    if(introMessageFaded) setMascotMessage(getMascotGuidance("applicationReport"));
  }, [introMessageFaded, getMascotGuidance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (validateForm()) {
      const submissionData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'applicationReport' && value instanceof File) { submissionData.append(key, value, value.name);
        } else if (key === 'companyAddress' && typeof value === 'object' && value !== null) { Object.entries(value).forEach(([addrKey, addrValue]) => { submissionData.append(`companyAddress[${addrKey}]`, String(addrValue)); });
        } else if (key === 'primaryProductCategories' && Array.isArray(value)) { value.forEach(cat => submissionData.append('primaryProductCategories[]', cat));
        } else if (value !== undefined && value !== null) { submissionData.append(key, String(value)); }
      });

      try {
        const response = await mutateAsync(submissionData);
        showNotification(response?.message || "Vendor application submitted! We'll be in touch soon.", "success");
        setFormData(initialVendorFormData); setDocumentName(""); setErrors({});
        if (fileInputRef.current) fileInputRef.current.value = "";
        setCurrentSectionId(VENDOR_FORM_SECTIONS[0].id); setShowIntroMessage(true); setIntroMessageFaded(false);
        const iconHtml = `<span style="color:${theme.colors.accent2Vibrant || '#AED581'}; margin-left: 5px;">&#127801;</span>`;
        setMascotMessage(`Hello! I'm <strong>Rose</strong> ${iconHtml}, ready for a new application!`);
      } catch (err: any) {
        const errMsg = err?.response?.data?.message || "Submission failed. Please review and try again.";
        showNotification(errMsg, "error");
        setMessage({ type: "error", text: errMsg });
      }
    } else {
      showNotification("Please correct the highlighted errors in the form.", "error");
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) { const el = document.getElementsByName(firstErrorKey)[0] || document.getElementById(firstErrorKey); el?.scrollIntoView({behavior: "smooth", block:"center"}); el?.focus();}
    }
  };

  const completedSections = useMemo(() => {
    const completed: { [key: string]: boolean } = {};
    const currentSectionIndex = VENDOR_FORM_SECTIONS.findIndex(s => s.id === currentSectionId);
    VENDOR_FORM_SECTIONS.forEach((section, index) => {
      if (index < currentSectionIndex) {
        const sectionIsErrorFree = section.requiredFields.every(fieldKey => !errors[fieldKey]);
        completed[section.id] = sectionIsErrorFree;
      } else { completed[section.id] = false; }
    });
    return completed;
  }, [currentSectionId, errors]);

  return (
    <TwoColumnPageLayout theme={theme}>
      <InteractiveGuidePanel theme={theme}>
        <MascotContainer theme={theme}><RoseMascotSVG theme={theme} /></MascotContainer>
        {showIntroMessage && <IntroMessage theme={theme} isVisible={showIntroMessage} dangerouslySetInnerHTML={{ __html: mascotMessage }} />}
        {!showIntroMessage && introMessageFaded && <InfoBubble theme={theme} isVisible={!showIntroMessage && introMessageFaded} dangerouslySetInnerHTML={{ __html: mascotMessage }} />}
        <ProgressBarContainer theme={theme}>
          {VENDOR_FORM_SECTIONS.map(section => (
            <ProgressStep key={section.id} theme={theme} isActive={section.id === currentSectionId && introMessageFaded} isCompleted={completedSections[section.id] || false}>
              {section.icon} {section.title}
            </ProgressStep>
          ))}
        </ProgressBarContainer>
      </InteractiveGuidePanel>

      <FormPanel theme={theme}>
        <FormWrapper theme={theme} onSubmit={handleSubmit} noValidate>
          <FormHeader theme={theme}><h2>Become an Élan Vendor Partner</h2></FormHeader>
          {message && <AuthMessage $type={message.type} theme={theme}>{message.text}</AuthMessage>}

          {/* Company Information */}
          <FormSection theme={theme} id={VENDOR_FORM_SECTIONS[0].id}>
            <FormSectionTitle theme={theme}>{VENDOR_FORM_SECTIONS[0].icon} {VENDOR_FORM_SECTIONS[0].title}</FormSectionTitle>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="companyName">Official Company Name*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} hasError={!!errors.companyName} required />{errors.companyName && <HelperText theme={theme} error><FaInfoCircle /> {errors.companyName}</HelperText>}</FieldGroup>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="businessRegistrationNumber">Business Registration No.*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="businessRegistrationNumber" name="businessRegistrationNumber" value={formData.businessRegistrationNumber} onChange={handleChange} hasError={!!errors.businessRegistrationNumber} required />{errors.businessRegistrationNumber && <HelperText theme={theme} error><FaInfoCircle /> {errors.businessRegistrationNumber}</HelperText>}</FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="legalEntityType">Legal Entity Type*</FormLabel><StyledSelect onFocus={handleInputFocus} theme={theme} id="legalEntityType" name="legalEntityType" value={formData.legalEntityType} onChange={handleChange} hasError={!!errors.legalEntityType} required><option value="">Select Type...</option><option value="corporation">Corporation</option><option value="llc">LLC</option><option value="partnership">Partnership</option><option value="sole_proprietorship">Sole Proprietorship</option><option value="other">Other</option></StyledSelect>{errors.legalEntityType && <HelperText theme={theme} error><FaInfoCircle /> {errors.legalEntityType}</HelperText>}</FieldGroup>
            </MultiFieldRow>
            <MultiFieldRow theme={theme}>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="yearEstablished">Year Established</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="number" id="yearEstablished" name="yearEstablished" value={formData.yearEstablished === undefined ? "" : formData.yearEstablished} onChange={handleChange} placeholder="YYYY" min="1800" max={new Date().getFullYear()} hasError={!!errors.yearEstablished} />{errors.yearEstablished && <HelperText theme={theme} error><FaInfoCircle /> {errors.yearEstablished}</HelperText>}</FieldGroup>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="companyTaxId">Company Tax ID / VAT</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="companyTaxId" name="companyTaxId" value={formData.companyTaxId || ""} onChange={handleChange} /></FieldGroup>
            </MultiFieldRow>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="website">Company Website</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="url" id="website" name="website" value={formData.website || ""} onChange={handleChange} placeholder="https://www.yourbrand.com" hasError={!!errors.website} />{errors.website && <HelperText theme={theme} error><FaInfoCircle /> {errors.website}</HelperText>}</FieldGroup>
          </FormSection>

          {/* Registered Company Address */}
          <FormSection theme={theme} id={VENDOR_FORM_SECTIONS[1].id}>
            <FormSectionTitle theme={theme}>{VENDOR_FORM_SECTIONS[1].icon} {VENDOR_FORM_SECTIONS[1].title}</FormSectionTitle>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="companyAddress.street">Street Address*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="companyAddress.street" name="companyAddress.street" value={formData.companyAddress.street} onChange={handleChange} hasError={!!errors["companyAddress.street"]} required />{errors["companyAddress.street"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["companyAddress.street"]}</HelperText>}</FieldGroup>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="companyAddress.city">City*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="companyAddress.city" name="companyAddress.city" value={formData.companyAddress.city} onChange={handleChange} hasError={!!errors["companyAddress.city"]} required />{errors["companyAddress.city"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["companyAddress.city"]}</HelperText>}</FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="companyAddress.state">State / Province*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="companyAddress.state" name="companyAddress.state" value={formData.companyAddress.state} onChange={handleChange} hasError={!!errors["companyAddress.state"]} required />{errors["companyAddress.state"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["companyAddress.state"]}</HelperText>}</FieldGroup>
            </MultiFieldRow>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="companyAddress.zip">ZIP / Postal Code*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="companyAddress.zip" name="companyAddress.zip" value={formData.companyAddress.zip} onChange={handleChange} hasError={!!errors["companyAddress.zip"]} required />{errors["companyAddress.zip"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["companyAddress.zip"]}</HelperText>}</FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="companyAddress.country">Country*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="companyAddress.country" name="companyAddress.country" value={formData.companyAddress.country} onChange={handleChange} hasError={!!errors["companyAddress.country"]} required />{errors["companyAddress.country"] && <HelperText theme={theme} error><FaInfoCircle /> {errors["companyAddress.country"]}</HelperText>}</FieldGroup>
            </MultiFieldRow>
          </FormSection>

          {/* Primary Business Contact */}
          <FormSection theme={theme} id={VENDOR_FORM_SECTIONS[2].id}>
            <FormSectionTitle theme={theme}>{VENDOR_FORM_SECTIONS[2].icon} {VENDOR_FORM_SECTIONS[2].title}</FormSectionTitle>
            <MultiFieldRow theme={theme}>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="contactPersonFirstName">Contact First Name*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="contactPersonFirstName" name="contactPersonFirstName" value={formData.contactPersonFirstName} onChange={handleChange} hasError={!!errors.contactPersonFirstName} required />{errors.contactPersonFirstName && <HelperText theme={theme} error><FaInfoCircle /> {errors.contactPersonFirstName}</HelperText>}</FieldGroup>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="contactPersonLastName">Contact Last Name*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="contactPersonLastName" name="contactPersonLastName" value={formData.contactPersonLastName} onChange={handleChange} hasError={!!errors.contactPersonLastName} required />{errors.contactPersonLastName && <HelperText theme={theme} error><FaInfoCircle /> {errors.contactPersonLastName}</HelperText>}</FieldGroup>
            </MultiFieldRow>
            <MultiFieldRow theme={theme}>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="contactPersonEmail">Contact Email*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="email" id="contactPersonEmail" name="contactPersonEmail" value={formData.contactPersonEmail} onChange={handleChange} hasError={!!errors.contactPersonEmail} required />{errors.contactPersonEmail && <HelperText theme={theme} error><FaInfoCircle /> {errors.contactPersonEmail}</HelperText>}</FieldGroup>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="contactPersonPhone">Contact Phone</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="tel" id="contactPersonPhone" name="contactPersonPhone" value={formData.contactPersonPhone || ""} onChange={handleChange} hasError={!!errors.contactPersonPhone} />{errors.contactPersonPhone && <HelperText theme={theme} error><FaInfoCircle /> {errors.contactPersonPhone}</HelperText>}</FieldGroup>
            </MultiFieldRow>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="contactPersonRole">Contact Role/Title</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="contactPersonRole" name="contactPersonRole" value={formData.contactPersonRole || ""} onChange={handleChange} placeholder="e.g., Founder, Sales Manager" /></FieldGroup>
          </FormSection>

          {/* Business Banking */}
          <FormSection theme={theme} id={VENDOR_FORM_SECTIONS[3].id}>
            <FormSectionTitle theme={theme}>{VENDOR_FORM_SECTIONS[3].icon} {VENDOR_FORM_SECTIONS[3].title}</FormSectionTitle>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="businessBankName">Bank Name*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="businessBankName" name="businessBankName" value={formData.businessBankName || ""} onChange={handleChange} hasError={!!errors.businessBankName} required />{errors.businessBankName && <HelperText theme={theme} error><FaInfoCircle /> {errors.businessBankName}</HelperText>}</FieldGroup>
            <MultiFieldRow theme={theme}>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="businessBankAccountNumber">Bank Account Number*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="businessBankAccountNumber" name="businessBankAccountNumber" value={formData.businessBankAccountNumber || ""} onChange={handleChange} hasError={!!errors.businessBankAccountNumber} required />{errors.businessBankAccountNumber && <HelperText theme={theme} error><FaInfoCircle /> {errors.businessBankAccountNumber}</HelperText>}</FieldGroup>
                <FieldGroup theme={theme} fullWidthMobile><FormLabel theme={theme} htmlFor="businessRoutingNumber">Routing Number*</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="businessRoutingNumber" name="businessRoutingNumber" value={formData.businessRoutingNumber || ""} onChange={handleChange} hasError={!!errors.businessRoutingNumber} required />{errors.businessRoutingNumber && <HelperText theme={theme} error><FaInfoCircle /> {errors.businessRoutingNumber}</HelperText>}</FieldGroup>
            </MultiFieldRow>
          </FormSection>

          {/* Product & Sales Information */}
          <FormSection theme={theme} id={VENDOR_FORM_SECTIONS[4].id}>
            <FormSectionTitle theme={theme}>{VENDOR_FORM_SECTIONS[4].icon} {VENDOR_FORM_SECTIONS[4].title}</FormSectionTitle>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="primaryProductCategories">Primary Product Categories* (comma-separated)</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="text" id="primaryProductCategories" name="primaryProductCategories" value={formData.primaryProductCategories?.join(", ") || ""} onChange={handleProductCategoriesChange} placeholder="e.g., Furniture, Lighting, Textiles" hasError={!!errors.primaryProductCategories} required />{errors.primaryProductCategories && <HelperText theme={theme} error><FaInfoCircle /> {errors.primaryProductCategories}</HelperText>}</FieldGroup>
            <FieldGroup theme={theme}><FormLabel theme={theme} htmlFor="estimatedMonthlySales">Estimated Monthly Sales (USD)</FormLabel><StyledInput onFocus={handleInputFocus} theme={theme} type="number" id="estimatedMonthlySales" name="estimatedMonthlySales" value={formData.estimatedMonthlySales === undefined ? "" : formData.estimatedMonthlySales} onChange={handleChange} min="0" placeholder="e.g., 25000" /></FieldGroup>
          </FormSection>

          {/* Business Verification Document */}
          <FormSection theme={theme} id={VENDOR_FORM_SECTIONS[5].id}>
            <FormSectionTitle theme={theme}>{VENDOR_FORM_SECTIONS[5].icon} {VENDOR_FORM_SECTIONS[5].title}</FormSectionTitle>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="applicationReport">Business Registration/License (PDF, max 5MB)*</FormLabel>
              <FileInputWrapper theme={theme}>
                  <label htmlFor="applicationReport" className="file-input-label" onFocus={handleInputFocus} tabIndex={0}><FaUpload /> {documentName ? documentName.substring(0,20) + (documentName.length > 20 ? "..." : "") : "Upload PDF"}</label>
                  <input ref={fileInputRef} type="file" id="applicationReport" name="applicationReport" accept=".pdf" onChange={handleFileChange} style={{ display: 'none' }}/>
              </FileInputWrapper>
              {documentName && formData.applicationReport && (
                <FileInfoDisplay theme={theme}>
                  <span className="file-info-text">
                    <FaFilePdf />
                    <span className="file-name">{documentName}</span>
                    <span className="file-size">({(formData.applicationReport.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </span>
                  <button type="button" onClick={removeSelectedFile} className="remove-file-btn" aria-label="Remove file"><FaTrash /></button>
                </FileInfoDisplay>
              )}
              {errors.applicationReport && <HelperText theme={theme} error><FaInfoCircle /> {errors.applicationReport}</HelperText>}
            </FieldGroup>
          </FormSection>

          {/* Agreements */}
          <FormSection theme={theme} id={VENDOR_FORM_SECTIONS[6].id}>
            <FormSectionTitle theme={theme}>{VENDOR_FORM_SECTIONS[6].icon} {VENDOR_FORM_SECTIONS[6].title}</FormSectionTitle>
            <CheckboxWrapper theme={theme}><StyledCheckbox onFocus={handleInputFocus} theme={theme} type="checkbox" id="agreedToTerms" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleChange} required /><CheckboxLabel theme={theme} htmlFor="agreedToTerms">I agree to the Élan Homewares <a href="/legal/vendor-agreement" target="_blank" rel="noopener noreferrer">Vendor Agreement & Terms</a>.*</CheckboxLabel></CheckboxWrapper>{errors.agreedToTerms && <HelperText theme={theme} error style={{ marginTop: `-${theme.spacing(1.5)}`, marginBottom: theme.spacing(3) }}><FaInfoCircle /> {errors.agreedToTerms}</HelperText>}
            <CheckboxWrapper theme={theme}><StyledCheckbox onFocus={handleInputFocus} theme={theme} type="checkbox" id="agreedToPrivacyPolicy" name="agreedToPrivacyPolicy" checked={formData.agreedToPrivacyPolicy} onChange={handleChange} required /><CheckboxLabel theme={theme} htmlFor="agreedToPrivacyPolicy">I agree to the Élan Homewares <a href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.*</CheckboxLabel></CheckboxWrapper>{errors.agreedToPrivacyPolicy && <HelperText theme={theme} error style={{ marginTop: `-${theme.spacing(1.5)}`, marginBottom: theme.spacing(3) }}><FaInfoCircle /> {errors.agreedToPrivacyPolicy}</HelperText>}
          </FormSection>

          <ButtonGroup theme={theme}>
            <CancelButton theme={theme} type="button" onClick={() => { setFormData(initialVendorFormData); setErrors({}); setDocumentName(""); setCurrentSectionId(VENDOR_FORM_SECTIONS[0].id); setShowIntroMessage(true); setIntroMessageFaded(false); setMessage(null); if(fileInputRef.current) fileInputRef.current.value = ""; }} disabled={isLoadingSubmission}><FaTimes /> Reset Form</CancelButton>
            <SubmitButton theme={theme} type="submit" disabled={isLoadingSubmission}>{isLoadingSubmission ? "Submitting..." : <><FaPaperPlane /> Submit Application</>}</SubmitButton>
          </ButtonGroup>
        </FormWrapper>
      </FormPanel>
    </TwoColumnPageLayout>
  );
};

export default VendorApplicationForm;
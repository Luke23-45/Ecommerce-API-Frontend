// src/components/forms/IndividualSellerProfile/IndividualSellerProfileForm.tsx
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import { useNotification } from "@/contexts/NotificationContext";
import {
  FaTimes,
  FaInfoCircle,
  FaUpload,
  FaFilePdf,
  FaTrash,
  FaBriefcase,
  FaUserTie,
  FaMapMarkedAlt,
  FaCreditCard,
  FaFileSignature,
  FaRegListAlt,
  FaUserShield,
  FaPaperPlane,
  FaPaw, // Placeholder for Rose/Mascot
  // FaCommentDots, // Using InfoBubble directly
} from "react-icons/fa";

// Import the styled components
import {
  TwoColumnPageLayout,
  InteractiveGuidePanel,
  MascotContainer,
  IntroMessage,
  InfoBubble,
  ProgressBarContainer,
  ProgressStep,
  FormPanel,
  FormWrapper,
  FormHeader,
  FormSection,
  FormSectionTitle,
  FieldGroup,
  MultiFieldRow,
  FormLabel,
  StyledInput,
  StyledSelect,
  StyledTextArea,
  StyledCheckbox,
  CheckboxLabel,
  CheckboxWrapper,
  ButtonGroup,
  SubmitButton,
  CancelButton,
  HelperText,
  AuthMessage, // Assuming this is for general messages, showNotification for toasts
  FileInputWrapper,
  FileInfoDisplay,
} from "./IndividualSellerProfileForm.styles";

import type {
  IIndividualSellerProfileForm as IIndividualSellerProfile,
  IAddress,
} from "@/types/seller"; // Ensure your types are correctly defined
import { useCreateIndividualSellerProfile } from "@/hooks/useIndividualSeller"; // Ensure hook path is correct
import { useNavigate } from "react-router-dom";

// Mock Theme (ensure this matches or is replaced by your actual theme provider)
const mockThemeForDemo: DefaultTheme = {
  colors: {
    primaryNeutral: "#F8F5F2",
    accent1: "#A46E4A",
    accent2: "#8DA382",
    accent1Vibrant: "#E57373",
    accent2Vibrant: "#AED581",
    textDark: "#302D2A",
    textLight: "#FFFFFF",
    lightGray: "#E9E9E9",
    mediumGray: "#b0aead",
    darkGray: "#757575",
    adminSurface: "#FFFFFF",
    adminBorder: "#E0E3E8",
    adminPrimaryBg: "#F4F6F8",
    adminText: "#2C3E50",
    adminTextSecondary: "#5D6D7E",
    adminStatusError: "#D32F2F",
    adminStatusSuccess: "#388E3C",
    adminStatusWarning: "#FBC02D",
    accentFocus: "#4A90E2",
    gradients: {
      accent1ToVibrant: "linear-gradient(to right, #A46E4A, #E57373)",
    },
  },
  spacing: (val: number) => `${val * 4}px`,
  typography: {
    heading: {
      fontFamily: "'Playfair Display', serif",
      weights: {
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
        extraBold: 800,
      },
      sizes: {
        h1: "2rem",
        h2: "1.8rem",
        h3: "1.5rem",
        h4: "1.2rem",
        h5: "1rem",
      },
      lineHeights: { h1: "1.2" },
      letterSpacings: {},
    },
    body: {
      fontFamily: "'Inter', sans-serif",
      sizes: {
        xsmall: "0.75rem",
        small: "0.875rem",
        base: "1rem",
        medium: "1.125rem",
        large: "1.25rem",
      },
      weights: { regular: 400, medium: 500, semiBold: 600, bold: 700 },
      lineHeights: { base: "1.6" },
    },
    admin: {
      fontFamily: "'Inter', sans-serif', sans-serif",
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
    mobileL: "425px",
    tablet: "768px",
    laptop: "1024px",
    laptopL: "1440px",
    desktop: "2560px",
  },
  maxWidth: "1600px",
  containerPadding: "clamp(1rem, 4vw, 4rem)",
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    xlarge: "16px",
    pill: "999px",
  },
  shadows: {
    subtle: "0 2px 4px rgba(0,0,0,0.05)",
    medium: "0 4px 10px rgba(0,0,0,0.1)",
    large: "0 8px 20px rgba(0,0,0,0.15)",
  },
};

const initialFormData: IIndividualSellerProfile = {
  sellerName: "",
  phoneNumber: "",
  address: { street: "", city: "", state: "", zip: "", country: "" },
  legalFirstName: "",
  legalLastName: "",
  dateOfBirth: null,
  citizenshipCountry: "",
  taxIdentificationNumber: "",
  payoutMethodPreference: "bank_transfer",
  bankAccountHolderName: "",
  bankRoutingNumber: "",
  bankAccountNumber: "",
  briefDescription: "",
  primaryProductCategories: [],
  estimatedMonthlySales: undefined,
  yearsOfSellingExperience: undefined,
  otherPlatformsSoldOn: "",
  agreedToTerms: false,
  agreedToPrivacyPolicy: false,
  applicationReport: null,
};

const FORM_SECTIONS = [
  {
    id: "businessBasics",
    title: "Business Basics",
    icon: <FaBriefcase />,
    fields: ["sellerName", "phoneNumber"],
    requiredFields: ["sellerName"],
  },
  {
    id: "legalIdentity",
    title: "Legal & Identity",
    icon: <FaUserTie />,
    fields: [
      "legalFirstName",
      "legalLastName",
      "dateOfBirth",
      "citizenshipCountry",
      "taxIdentificationNumber",
    ],
    requiredFields: [
      "legalFirstName",
      "legalLastName",
      "dateOfBirth",
      "citizenshipCountry",
      "taxIdentificationNumber",
    ],
  },
  {
    id: "businessAddress",
    title: "Business Address",
    icon: <FaMapMarkedAlt />,
    fields: [
      "address.street",
      "address.city",
      "address.state",
      "address.zip",
      "address.country",
    ],
    requiredFields: [
      "address.street",
      "address.city",
      "address.state",
      "address.zip",
      "address.country",
    ],
  },
  {
    id: "payoutDetails",
    title: "Payout Details",
    icon: <FaCreditCard />,
    fields: [
      "payoutMethodPreference",
      "bankAccountHolderName",
      "bankAccountNumber",
      "bankRoutingNumber",
    ],
    requiredFields: ["payoutMethodPreference"],
  }, // Bank fields conditional
  {
    id: "businessVerification",
    title: "Business Verification",
    icon: <FaUserShield />,
    fields: ["applicationReport"],
    requiredFields: ["applicationReport"],
  },
  {
    id: "aboutOfferings",
    title: "About Your Offerings",
    icon: <FaRegListAlt />,
    fields: [
      "briefDescription",
      "primaryProductCategories",
      "estimatedMonthlySales",
      "yearsOfSellingExperience",
      "otherPlatformsSoldOn",
    ],
    requiredFields: ["briefDescription", "primaryProductCategories"],
  },
  {
    id: "agreements",
    title: "Agreements & Submission",
    icon: <FaFileSignature />,
    fields: ["agreedToTerms", "agreedToPrivacyPolicy"],
    requiredFields: ["agreedToTerms", "agreedToPrivacyPolicy"],
  },
];

const IndividualSellerProfileForm = () => {
  const themeFromContext = useTheme();
  const theme = (
    Object.keys(themeFromContext || {}).length > 0
      ? themeFromContext
      : mockThemeForDemo
  ) as DefaultTheme;
  const { showNotification } = useNotification();

  const [formData, setFormData] =
    useState<IIndividualSellerProfile>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [documentName, setDocumentName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentSectionId, setCurrentSectionId] = useState<string>(
    FORM_SECTIONS[0].id
  );
  const [activeField, setActiveField] = useState<string | null>(null);
  const [mascotMessage, setMascotMessage] = useState<string>("");
  const [showIntroMessage, setShowIntroMessage] = useState<boolean>(true);
  const [introMessageFaded, setIntroMessageFaded] = useState<boolean>(false);

  const navigate = useNavigate();

  const { mutateAsync, isPending: isLoadingSubmission } =
    useCreateIndividualSellerProfile();

  useEffect(() => {
    setMascotMessage(
      "Hi, I'm <strong>Rose</strong>! Your friendly guide for this application. Let's create something amazing together!"
    );
    const introTimer = setTimeout(() => setShowIntroMessage(false), 4500);
    const fadeOutTimer = setTimeout(() => {
      setIntroMessageFaded(true);
      const firstSectionInfo =
        getFieldInfo(FORM_SECTIONS[0].fields[0]) ||
        `Let's start with your <strong>${FORM_SECTIONS[0].title}</strong>.`;
      setMascotMessage(firstSectionInfo);
    }, 5200); // 4500ms visible + 700ms fade-out animation
    return () => {
      clearTimeout(introTimer);
      clearTimeout(fadeOutTimer);
    };
  }, []);

  const getFieldInfo = useCallback(
    (fieldName: string | null): string => {
      if (!fieldName) return `Ready to fill in your details? I'm here to help!`;
      // More detailed and engaging messages for Rose
      switch (fieldName) {
        case "sellerName":
          return "Every great story needs a name! What's your <strong>Store or Seller Name</strong>? Make it catchy!";
        case "phoneNumber":
          return "Just a <strong>Phone Number</strong> so we can connect if needed. Your privacy is important to us!";
        case "legalFirstName":
          return "Let's get official! What's your <strong>Legal First Name</strong> as on your documents?";
        case "legalLastName":
          return "And your <strong>Legal Last Name</strong>, please. Accuracy is key here!";
        case "dateOfBirth":
          return "Your <strong>Date of Birth</strong> helps us verify you're old enough to join our amazing seller community!";
        case "citizenshipCountry":
          return "Which <strong>Country of Citizenship</strong> do you hold? This helps with legal bits.";
        case "taxIdentificationNumber":
          return "Your <strong>Tax ID Number</strong> (like SSN or EIN) is needed for financial setup. It's kept secure!";
        case "address.street":
          return "Where is your business hub? Start with the <strong>Street Address</strong>.";
        case "address.city":
          return "Which <strong>City</strong> are you based in?";
        case "address.state":
          return "And the <strong>State or Province</strong>?";
        case "address.zip":
          return "Don't forget the <strong>ZIP or Postal Code</strong>!";
        case "address.country":
          return "Finally, the <strong>Country</strong> for your business address.";
        case "payoutMethodPreference":
          return "How would you like to receive your earnings? Choose your <strong>Preferred Payout Method</strong>.";
        case "bankAccountHolderName":
          return "For bank transfers, what's the <strong>Account Holder's Full Name</strong>?";
        case "bankAccountNumber":
          return "And the <strong>Bank Account Number</strong>? Double-check for accuracy!";
        case "bankRoutingNumber":
          return "The <strong>Bank Routing Number</strong> (like ABA or SWIFT/BIC) is also needed for bank payouts.";
        case "applicationReport":
          return "Time for some paperwork! Please upload your <strong>Supporting Document</strong> (PDF, max 2MB).";
        case "briefDescription":
          return "Tell your brand's unique story! A compelling <strong>Business Description</strong> (min. 50 characters) can really shine.";
        case "primaryProductCategories":
          return "What kind of amazing products will you offer? List your <strong>Main Categories</strong>, separated by commas.";
        case "estimatedMonthlySales":
          return "What are your <strong>Estimated Monthly Sales</strong>? This helps us understand your scale.";
        case "yearsOfSellingExperience":
          return "How many <strong>Years of Selling Experience</strong> do you have? Every bit counts!";
        case "otherPlatformsSoldOn":
          return "Do you sell on <strong>Other Platforms</strong>? Let us know where else your talent shines!";
        case "agreedToTerms":
          return "Almost there! Please review and agree to our <strong>Seller Terms & Conditions</strong>.";
        case "agreedToPrivacyPolicy":
          return "And finally, please acknowledge our <strong>Privacy Policy</strong>. Transparency is key!";
        default:
          const section =
            FORM_SECTIONS.find((s) => s.fields.includes(fieldName)) ||
            FORM_SECTIONS.find((s) => s.id === currentSectionId);
          return `You're working on the <strong>${section?.title || "details"}</strong>. Looking good!`;
      }
    },
    [currentSectionId]
  );

  const handleInputFocus = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const fieldName = e.target.name;
      setActiveField(fieldName);
      const sectionContainingField = FORM_SECTIONS.find((section) =>
        section.fields.includes(fieldName)
      );
      if (sectionContainingField)
        setCurrentSectionId(sectionContainingField.id);
      if (!showIntroMessage && introMessageFaded)
        setMascotMessage(getFieldInfo(fieldName));
    },
    [showIntroMessage, introMessageFaded, getFieldInfo]
  );

  const validateField = useCallback(
    (name: string, value: any): string | null => {
      const requiredErrorMsg = (fieldName: string) =>
        `${fieldName
          .replace("address.", "")
          .replace(/([A-Z])/g, " $1")
          .trim()} is required.`;

      if (name.startsWith("address.")) {
        const fieldKey = name.split(".")[1] as keyof IAddress;
        if (!value || typeof value !== "string" || !value.trim())
          return requiredErrorMsg(fieldKey);
      }

      switch (name) {
        case "sellerName":
        case "legalFirstName":
        case "legalLastName":
        case "citizenshipCountry":
        case "taxIdentificationNumber":
          if (!value || !String(value).trim()) return requiredErrorMsg(name);
          break;
        case "phoneNumber": // Optional, but validate format if present
          if (value && !/^[+]?[0-9\s\-()]{7,20}$/.test(value))
            return "Invalid phone number format.";
          break;
        case "dateOfBirth":
          if (!value) return requiredErrorMsg(name);
          try {
            const dob = new Date(value);
            const today = new Date();
            const minAgeDate = new Date(
              today.getFullYear() - 18,
              today.getMonth(),
              today.getDate()
            );
            if (isNaN(dob.getTime()) || dob > minAgeDate)
              return "Invalid date or must be at least 18 years old.";
          } catch {
            return "Invalid date format.";
          }
          break;
        case "payoutMethodPreference":
          if (!value) return requiredErrorMsg(name);
          break;
        case "bankAccountHolderName":
        case "bankRoutingNumber":
        case "bankAccountNumber":
          if (
            formData.payoutMethodPreference === "bank_transfer" &&
            (!value || !String(value).trim())
          )
            return requiredErrorMsg(name);
          break;
        case "briefDescription":
          if (!value || String(value).trim().length < 50)
            return "Description must be at least 50 characters.";
          break;
        case "primaryProductCategories":
          if (!Array.isArray(value) || value.length === 0)
            return "At least one product category is required.";
          break;
        case "applicationReport":
          if (value === null) return "Supporting document is required.";
          break;
        case "agreedToTerms":
        case "agreedToPrivacyPolicy":
          if (value !== true) return "You must agree to continue.";
          break;
        default:
          break;
      }
      return null;
    },
    [formData.payoutMethodPreference]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    FORM_SECTIONS.forEach((section) => {
      (section.requiredFields || section.fields).forEach((fieldName) => {
        // Validate required fields or all for thoroughness
        let valueToValidate;
        if (fieldName.startsWith("address.")) {
          const addressKey = fieldName.split(".")[1] as keyof IAddress;
          valueToValidate = formData.address[addressKey];
        } else {
          valueToValidate =
            formData[fieldName as keyof IIndividualSellerProfile];
        }
        // Special handling for conditional bank fields
        if (
          fieldName.startsWith("bank") &&
          formData.payoutMethodPreference !== "bank_transfer" &&
          section.id === "payoutDetails"
        ) {
          return; // Skip validation if not bank transfer
        }
        const error = validateField(fieldName, valueToValidate);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      });
    });
    setErrors(newErrors);
    return isValid;
  }, [formData, validateField]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      let currentErrors = { ...errors };
      let processedValue: any = value;
      if (type === "checkbox")
        processedValue = (e.target as HTMLInputElement).checked;

      if (name.startsWith("address.")) {
        const addressField = name.split(".")[1] as keyof IAddress;
        setFormData((prev) => ({
          ...prev,
          address: { ...prev.address, [addressField]: processedValue },
        }));
      } else if (
        (name === "estimatedMonthlySales" ||
          name === "yearsOfSellingExperience") &&
        type === "number"
      ) {
        processedValue = value === "" ? undefined : Number(value); // Store as number or undefined
        setFormData((prev) => ({ ...prev, [name]: processedValue }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: processedValue }));
      }
      const fieldError = validateField(name, processedValue);
      if (fieldError) currentErrors[name] = fieldError;
      else delete currentErrors[name];
      setErrors(currentErrors);
    },
    [errors, validateField]
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const dateValue = value ? new Date(value + "T00:00:00Z") : null; // Ensure UTC if backend expects, or keep local
      setFormData((prev) => ({ ...prev, [name]: dateValue }));
      const fieldError = validateField(name, dateValue);
      const currentErrors = { ...errors };
      if (fieldError) currentErrors[name] = fieldError;
      else delete currentErrors[name];
      setErrors(currentErrors);
      handleInputFocus(e as any); // Also update mascot on date change
    },
    [errors, validateField, handleInputFocus]
  );

  const handleProductCategoriesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const categories = e.target.value
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat);
      setFormData((prev) => ({
        ...prev,
        primaryProductCategories: categories,
      }));
      const fieldError = validateField("primaryProductCategories", categories);
      const currentErrors = { ...errors };
      if (fieldError) currentErrors["primaryProductCategories"] = fieldError;
      else delete currentErrors["primaryProductCategories"];
      setErrors(currentErrors);
      handleInputFocus(e as any);
    },
    [errors, validateField, handleInputFocus]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let fileError = "";
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === "application/pdf" && file.size <= 2 * 1024 * 1024) {
          setFormData((prev) => ({ ...prev, applicationReport: file }));
          setDocumentName(file.name);
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.applicationReport;
            return newErrors;
          });
        } else {
          fileError =
            file.type !== "application/pdf"
              ? "PDF only."
              : file.size > 2 * 1024 * 1024
                ? "Max 2MB."
                : "Invalid file.";
          setErrors((prev) => ({ ...prev, applicationReport: fileError }));
          setFormData((prev) => ({ ...prev, applicationReport: null }));
          setDocumentName("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
      if (introMessageFaded)
        setMascotMessage(getFieldInfo(fileError ? null : "applicationReport"));
    },
    [introMessageFaded, getFieldInfo]
  );

  const removeSelectedFile = useCallback(() => {
    setFormData((prev) => ({ ...prev, applicationReport: null }));
    setDocumentName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.applicationReport;
      return newErrors;
    });
    setActiveField(null);
    if (introMessageFaded) setMascotMessage(getFieldInfo("applicationReport")); // Prompt to upload again
  }, [introMessageFaded, getFieldInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (key === "address" && typeof value === "object" && value !== null) {
          for (const [addrKey, addrValue] of Object.entries(value)) {
            if (addrValue !== null && addrValue !== undefined)
              submissionData.append(`address[${addrKey}]`, String(addrValue));
          }
        } else if (key === "primaryProductCategories" && Array.isArray(value)) {
          value.forEach((category) =>
            submissionData.append("primaryProductCategories[]", category)
          );
        } else if (key === "dateOfBirth" && value instanceof Date) {
          submissionData.append(key, value.toISOString());
        } else if (key === "applicationReport" && value instanceof File) {
          submissionData.append(key, value, value.name);
        } else if (value !== null && value !== undefined) {
          submissionData.append(key, String(value));
        }
      }
      try {
        const response = await mutateAsync(submissionData);
        showNotification(
          response?.message ||
            "Application submitted successfully! We'll review it soon.",
          "success"
        );
        setFormData(initialFormData);
        setErrors({});
        setDocumentName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
        setCurrentSectionId(FORM_SECTIONS[0].id);
        setShowIntroMessage(true);
        setIntroMessageFaded(false); // Reset for potential new submission
        setMascotMessage(
          "Hi, I'm <strong>Rose</strong>! Your friendly guide for this application. Let's create something amazing together!"
        ); 
        navigate("/seller/application/view")
      } catch (error: any) {
        const apiErrors = error?.response?.data?.errors;
        if (apiErrors && typeof apiErrors === "object") {
          setErrors((prev) => ({ ...prev, ...apiErrors }));
        }
        showNotification(
          error?.response?.data?.message ||
            "Submission failed. Please check your details and try again.",
          "error"
        );
      }
    } else {
      showNotification(
        "Oops! Please correct the errors highlighted in the form.",
        "error"
      );
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const errorElement =
          document.getElementsByName(firstErrorKey)[0] ||
          document.getElementById(firstErrorKey);
        errorElement?.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement?.focus();
      }
    }
  };

  const completedSections = useMemo(() => {
    const completed: { [key: string]: boolean } = {};
    const currentSectionIndex = FORM_SECTIONS.findIndex(
      (s) => s.id === currentSectionId
    );

    FORM_SECTIONS.forEach((section, index) => {
      if (index < currentSectionIndex) {
        // A section is considered "completed" if all its required fields have no errors.
        const sectionFields = section.requiredFields || section.fields;
        const hasErrorsInSection = sectionFields.some(
          (fieldKey) => !!errors[fieldKey]
        );
        completed[section.id] = !hasErrorsInSection;
      } else {
        completed[section.id] = false;
      }
    });
    return completed;
  }, [currentSectionId, errors]);

  return (
    <TwoColumnPageLayout theme={theme}>
      <InteractiveGuidePanel theme={theme}>
        <MascotContainer theme={theme}>
          {/* Replace with your actual mascot (e.g., a cute bunny or cat SVG/image) */}
          <FaPaw
            size="70%"
            style={{
              color: theme.colors.accent1,
              opacity: 0.9,
              marginTop: "10%",
            }}
          />
        </MascotContainer>

        {showIntroMessage && (
          <IntroMessage
            theme={theme}
            isVisible={showIntroMessage}
            dangerouslySetInnerHTML={{ __html: mascotMessage }}
          />
        )}
        {!showIntroMessage && introMessageFaded && (
          <InfoBubble
            theme={theme}
            isVisible={!showIntroMessage && introMessageFaded}
            dangerouslySetInnerHTML={{ __html: mascotMessage }}
          />
        )}

        <ProgressBarContainer theme={theme}>
          {FORM_SECTIONS.map((section) => (
            <ProgressStep
              key={section.id}
              theme={theme}
              isActive={section.id === currentSectionId && introMessageFaded} // Active only after intro
              isCompleted={completedSections[section.id] || false}
              // onClick={() => { /* Consider navigation logic */ }}
            >
              {section.icon} {section.title}
            </ProgressStep>
          ))}
        </ProgressBarContainer>
      </InteractiveGuidePanel>

      <FormPanel theme={theme}>
        <FormWrapper theme={theme} onSubmit={handleSubmit} noValidate>
          <FormHeader theme={theme}>
            <h2>Become an Élan Seller - Application</h2>
          </FormHeader>

          {/* --- Form Sections --- */}
          {/* Business Basics */}
          <FormSection theme={theme} id={FORM_SECTIONS[0].id}>
            <FormSectionTitle theme={theme}>
              {FORM_SECTIONS[0].icon} {FORM_SECTIONS[0].title}
            </FormSectionTitle>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="sellerName">
                Seller / Store Name*
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="text"
                id="sellerName"
                name="sellerName"
                value={formData.sellerName}
                onChange={handleChange}
                hasError={!!errors.sellerName}
                required
              />
              {errors.sellerName && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.sellerName}
                </HelperText>
              )}
            </FieldGroup>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="phoneNumber">
                Contact Phone Number
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber || ""}
                onChange={handleChange}
                hasError={!!errors.phoneNumber}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phoneNumber && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.phoneNumber}
                </HelperText>
              )}
            </FieldGroup>
          </FormSection>

          {/* Legal & Identity */}
          <FormSection theme={theme} id={FORM_SECTIONS[1].id}>
            <FormSectionTitle theme={theme}>
              {FORM_SECTIONS[1].icon} {FORM_SECTIONS[1].title}
            </FormSectionTitle>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="legalFirstName">
                  Legal First Name*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="legalFirstName"
                  name="legalFirstName"
                  value={formData.legalFirstName}
                  onChange={handleChange}
                  hasError={!!errors.legalFirstName}
                  required
                />
                {errors.legalFirstName && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors.legalFirstName}
                  </HelperText>
                )}
              </FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="legalLastName">
                  Legal Last Name*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="legalLastName"
                  name="legalLastName"
                  value={formData.legalLastName}
                  onChange={handleChange}
                  hasError={!!errors.legalLastName}
                  required
                />
                {errors.legalLastName && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors.legalLastName}
                  </HelperText>
                )}
              </FieldGroup>
            </MultiFieldRow>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="dateOfBirth">
                  Date of Birth*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={
                    formData.dateOfBirth instanceof Date
                      ? formData.dateOfBirth.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleDateChange}
                  hasError={!!errors.dateOfBirth}
                  required
                />
                {errors.dateOfBirth && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors.dateOfBirth}
                  </HelperText>
                )}
              </FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="citizenshipCountry">
                  Country of Citizenship*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="citizenshipCountry"
                  name="citizenshipCountry"
                  value={formData.citizenshipCountry}
                  onChange={handleChange}
                  hasError={!!errors.citizenshipCountry}
                  required
                />
                {errors.citizenshipCountry && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors.citizenshipCountry}
                  </HelperText>
                )}
              </FieldGroup>
            </MultiFieldRow>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="taxIdentificationNumber">
                Tax Identification Number*
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="text"
                id="taxIdentificationNumber"
                name="taxIdentificationNumber"
                value={formData.taxIdentificationNumber}
                onChange={handleChange}
                hasError={!!errors.taxIdentificationNumber}
                required
              />
              {errors.taxIdentificationNumber && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.taxIdentificationNumber}
                </HelperText>
              )}
            </FieldGroup>
          </FormSection>

          {/* Business Address */}
          <FormSection theme={theme} id={FORM_SECTIONS[2].id}>
            <FormSectionTitle theme={theme}>
              {FORM_SECTIONS[2].icon} {FORM_SECTIONS[2].title}
            </FormSectionTitle>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="address.street">
                Street Address*
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="text"
                id="address.street"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                hasError={!!errors["address.street"]}
                required
              />
              {errors["address.street"] && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors["address.street"]}
                </HelperText>
              )}
            </FieldGroup>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="address.city">
                  City*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="address.city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  hasError={!!errors["address.city"]}
                  required
                />
                {errors["address.city"] && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors["address.city"]}
                  </HelperText>
                )}
              </FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="address.state">
                  State / Province*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="address.state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleChange}
                  hasError={!!errors["address.state"]}
                  required
                />
                {errors["address.state"] && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors["address.state"]}
                  </HelperText>
                )}
              </FieldGroup>
            </MultiFieldRow>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="address.zip">
                  ZIP / Postal Code*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="address.zip"
                  name="address.zip"
                  value={formData.address.zip}
                  onChange={handleChange}
                  hasError={!!errors["address.zip"]}
                  required
                />
                {errors["address.zip"] && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors["address.zip"]}
                  </HelperText>
                )}
              </FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="address.country">
                  Country*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="address.country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  hasError={!!errors["address.country"]}
                  required
                />
                {errors["address.country"] && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors["address.country"]}
                  </HelperText>
                )}
              </FieldGroup>
            </MultiFieldRow>
          </FormSection>

          {/* Payout Details */}
          <FormSection theme={theme} id={FORM_SECTIONS[3].id}>
            <FormSectionTitle theme={theme}>
              {FORM_SECTIONS[3].icon} {FORM_SECTIONS[3].title}
            </FormSectionTitle>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="payoutMethodPreference">
                Preferred Payout Method
              </FormLabel>
              <StyledSelect
                onFocus={handleInputFocus}
                theme={theme}
                id="payoutMethodPreference"
                name="payoutMethodPreference"
                value={formData.payoutMethodPreference}
                onChange={handleChange}
              >
                <option value="bank_transfer">Direct Bank Transfer</option>
                <option value="paypal">PayPal</option>
              </StyledSelect>
            </FieldGroup>
            {formData.payoutMethodPreference === "bank_transfer" && (
              <>
                <FieldGroup theme={theme}>
                  <FormLabel theme={theme} htmlFor="bankAccountHolderName">
                    Bank Account Holder's Full Name*
                  </FormLabel>
                  <StyledInput
                    onFocus={handleInputFocus}
                    theme={theme}
                    type="text"
                    id="bankAccountHolderName"
                    name="bankAccountHolderName"
                    value={formData.bankAccountHolderName || ""}
                    onChange={handleChange}
                    hasError={!!errors.bankAccountHolderName}
                    required={
                      formData.payoutMethodPreference === "bank_transfer"
                    }
                  />
                  {errors.bankAccountHolderName && (
                    <HelperText theme={theme} error>
                      <FaInfoCircle /> {errors.bankAccountHolderName}
                    </HelperText>
                  )}
                </FieldGroup>
                <MultiFieldRow theme={theme}>
                  <FieldGroup theme={theme} fullWidthMobile>
                    <FormLabel theme={theme} htmlFor="bankAccountNumber">
                      Bank Account Number*
                    </FormLabel>
                    <StyledInput
                      onFocus={handleInputFocus}
                      theme={theme}
                      type="text"
                      id="bankAccountNumber"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber || ""}
                      onChange={handleChange}
                      hasError={!!errors.bankAccountNumber}
                      required={
                        formData.payoutMethodPreference === "bank_transfer"
                      }
                    />
                    {errors.bankAccountNumber && (
                      <HelperText theme={theme} error>
                        <FaInfoCircle /> {errors.bankAccountNumber}
                      </HelperText>
                    )}
                  </FieldGroup>
                  <FieldGroup theme={theme} fullWidthMobile>
                    <FormLabel theme={theme} htmlFor="bankRoutingNumber">
                      Bank Routing Number*
                    </FormLabel>
                    <StyledInput
                      onFocus={handleInputFocus}
                      theme={theme}
                      type="text"
                      id="bankRoutingNumber"
                      name="bankRoutingNumber"
                      value={formData.bankRoutingNumber || ""}
                      onChange={handleChange}
                      hasError={!!errors.bankRoutingNumber}
                      required={
                        formData.payoutMethodPreference === "bank_transfer"
                      }
                    />
                    {errors.bankRoutingNumber && (
                      <HelperText theme={theme} error>
                        <FaInfoCircle /> {errors.bankRoutingNumber}
                      </HelperText>
                    )}
                  </FieldGroup>
                </MultiFieldRow>
              </>
            )}
          </FormSection>

          {/* Business Verification */}
          <FormSection theme={theme} id={FORM_SECTIONS[4].id}>
            <FormSectionTitle theme={theme}>
              {FORM_SECTIONS[4].icon} {FORM_SECTIONS[4].title}
            </FormSectionTitle>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="applicationReport">
                Supporting Document (PDF, max 2MB)*
              </FormLabel>
              <FileInputWrapper theme={theme}>
                <label htmlFor="applicationReport" className="file-input-label">
                  <FaUpload /> {documentName ? "Change PDF" : "Upload PDF"}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="applicationReport"
                  name="applicationReport"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </FileInputWrapper>
              {documentName && formData.applicationReport && (
                <FileInfoDisplay theme={theme}>
                  <span className="file-info-text">
                    <FaFilePdf />
                    <span className="file-name">{documentName}</span>
                    {`(${(formData.applicationReport.size / 1024 / 1024).toFixed(2)} MB)`}
                  </span>
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="remove-file-btn"
                    aria-label="Remove file"
                  >
                    <FaTrash />
                  </button>
                </FileInfoDisplay>
              )}
              {errors.applicationReport && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.applicationReport}
                </HelperText>
              )}
            </FieldGroup>
          </FormSection>

          {/* About Your Offerings */}
          <FormSection theme={theme} id={FORM_SECTIONS[5].id}>
            <FormSectionTitle theme={theme}>
              {FORM_SECTIONS[5].icon} {FORM_SECTIONS[5].title}
            </FormSectionTitle>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="briefDescription">
                Brief Description (Min. 50 chars)*
              </FormLabel>
              <StyledTextArea
                onFocus={handleInputFocus}
                theme={theme}
                id="briefDescription"
                name="briefDescription"
                value={formData.briefDescription || ""}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about your brand..."
                minLength={50}
                hasError={!!errors.briefDescription}
                required
              />
              {errors.briefDescription && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.briefDescription}
                </HelperText>
              )}
            </FieldGroup>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="primaryProductCategories">
                Primary Product Categories (comma-separated)*
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="text"
                id="primaryProductCategories"
                name="primaryProductCategories"
                value={formData.primaryProductCategories?.join(", ") || ""}
                onChange={handleProductCategoriesChange}
                placeholder="Ceramics, Linens..."
                hasError={!!errors.primaryProductCategories}
                required
              />
              {errors.primaryProductCategories && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.primaryProductCategories}
                </HelperText>
              )}
            </FieldGroup>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="estimatedMonthlySales">
                  Est. Monthly Sales (USD)
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="number"
                  id="estimatedMonthlySales"
                  name="estimatedMonthlySales"
                  value={
                    formData.estimatedMonthlySales === undefined
                      ? ""
                      : formData.estimatedMonthlySales
                  }
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 1500"
                />
              </FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="yearsOfSellingExperience">
                  Years of Selling Experience
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="number"
                  id="yearsOfSellingExperience"
                  name="yearsOfSellingExperience"
                  value={
                    formData.yearsOfSellingExperience === undefined
                      ? ""
                      : formData.yearsOfSellingExperience
                  }
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 3"
                />
              </FieldGroup>
            </MultiFieldRow>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="otherPlatformsSoldOn">
                Other Platforms You Sell On
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="text"
                id="otherPlatformsSoldOn"
                name="otherPlatformsSoldOn"
                value={formData.otherPlatformsSoldOn || ""}
                onChange={handleChange}
                placeholder="e.g., Etsy, Own Website"
              />
            </FieldGroup>
          </FormSection>

          {/* Agreements & Submission */}
          <FormSection theme={theme} id={FORM_SECTIONS[6].id}>
            <FormSectionTitle theme={theme}>
              {FORM_SECTIONS[6].icon} {FORM_SECTIONS[6].title}
            </FormSectionTitle>
            <CheckboxWrapper theme={theme}>
              <StyledCheckbox
                onFocus={handleInputFocus}
                theme={theme}
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                required
              />
              <CheckboxLabel theme={theme} htmlFor="agreedToTerms">
                I agree to the{" "}
                <a
                  href="/legal/seller-terms"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Seller Terms & Conditions
                </a>
                .*
              </CheckboxLabel>
            </CheckboxWrapper>
            {errors.agreedToTerms && (
              <HelperText
                theme={theme}
                error
                style={{
                  marginTop: `-${theme.spacing(2)}`,
                  marginBottom: theme.spacing(3),
                }}
              >
                <FaInfoCircle /> {errors.agreedToTerms}
              </HelperText>
            )}
            <CheckboxWrapper theme={theme}>
              <StyledCheckbox
                onFocus={handleInputFocus}
                theme={theme}
                type="checkbox"
                id="agreedToPrivacyPolicy"
                name="agreedToPrivacyPolicy"
                checked={formData.agreedToPrivacyPolicy}
                onChange={handleChange}
                required
              />
              <CheckboxLabel theme={theme} htmlFor="agreedToPrivacyPolicy">
                I agree to the{" "}
                <a
                  href="/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .*
              </CheckboxLabel>
            </CheckboxWrapper>
            {errors.agreedToPrivacyPolicy && (
              <HelperText
                theme={theme}
                error
                style={{
                  marginTop: `-${theme.spacing(2)}`,
                  marginBottom: theme.spacing(3),
                }}
              >
                <FaInfoCircle /> {errors.agreedToPrivacyPolicy}
              </HelperText>
            )}
          </FormSection>

          <ButtonGroup theme={theme}>
            <CancelButton
              theme={theme}
              type="button"
              onClick={() => {
                setFormData(initialFormData);
                setErrors({});
                setDocumentName("");
                setShowIntroMessage(true);
                setIntroMessageFaded(false);
                setCurrentSectionId(FORM_SECTIONS[0].id);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              disabled={isLoadingSubmission}
            >
              <FaTimes /> Reset Form
            </CancelButton>
            <SubmitButton
              theme={theme}
              type="submit"
              disabled={isLoadingSubmission}
            >
              {isLoadingSubmission ? (
                "Submitting..."
              ) : (
                <>
                  <FaPaperPlane /> Submit Application
                </>
              )}
            </SubmitButton>
          </ButtonGroup>
        </FormWrapper>
      </FormPanel>
    </TwoColumnPageLayout>
  );
};

export default IndividualSellerProfileForm;

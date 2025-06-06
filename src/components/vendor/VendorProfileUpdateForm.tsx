// src/components/forms/VendorProfile/VendorProfileUpdateForm.tsx
import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaSave,
  FaTimes,
  FaInfoCircle,
  FaUpload,
  FaFilePdf,
  FaTrash,
  FaExternalLinkAlt,
  FaBuilding,
  FaUserTie,
  FaMapMarkedAlt,
  FaLandmark,
  FaFileSignature,
  FaRegListAlt,
  FaIdCardAlt,
  FaGlobe,
  FaCalendarAlt,
  FaTags,
  FaCalendarCheck,
  FaDollarSign,
  FaSpinner,
  FaExclamationTriangle,
  // Rose & Progress Icons
  FaSeedling,
  FaLightbulb,
  FaUserShield,
} from "react-icons/fa";
import { lighten, transparentize } from "polished"; // Ensure polished is imported

// Styles from the shared seller form's styles file
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
  ButtonGroup,
  SubmitButton,
  CancelButton,
  HelperText,
  ReadOnlyFieldWrapper,
  ReadOnlyLabel,
  ReadOnlyValue,
  FileInputWrapper,
  FileInfoDisplay,
  ExistingFileInfo,
  InfoDisplayItem,
  SectionContentGrid,
} from "../seller/IndividualSellerProfileForm.styles";
import { StatusBadge } from "./ViewVendorApplication.styles";
import type {
  IVendorProfile,
  updateVendorProfileUpdateFields,
} from "@/types/vendor";
import { type IAddress } from "@/types/seller";
import { useGetVendorProfile, useUpdateVendorProfile } from "@/hooks/useVendor";
import { useNotification } from "@/contexts/NotificationContext";
import { AuthMessage } from "@/pages/AuthPage/AuthPage.styles"; // If used for general messages

// Mock Theme (as provided in your VendorProfileUpdateForm.tsx)
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
    darkGray: "#757575",
    adminSurface: "#FFFFFF",
    adminBorder: "#D1D1D1",
    adminPrimaryBg: "#FCFBF9",
    adminText: "#3F3F3F",
    adminTextSecondary: "#6B6B6B",
    adminStatusError: "#D32F2F",
    adminStatusSuccess: "#388E3C",
    adminStatusWarning: "#FBC02D",
    gradients: {
      accent1ToVibrant: "linear-gradient(to right, #A46E4A, #E57373)",
    },
  },
  spacing: (val: number) => `${val * 4}px`,
  typography: {
    heading: {
      fontFamily: "'Playfair Display', serif",
      weights: { regular: 400, bold: 700, semiBold: 600, extraBold: 800 },
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

// Rose SVG Placeholder
const RoseMascotSVG = ({ theme }: { theme: DefaultTheme }) => (
  <svg
    viewBox="0 0 100 100"
    width="100%"
    height="100%"
    aria-label="Rose Mascot"
  >
    <defs>
      <radialGradient
        id="roseGradientVendorUpdate"
        cx="50%"
        cy="50%"
        r="50%"
        fx="50%"
        fy="50%"
      >
        <stop
          offset="0%"
          style={{
            stopColor: lighten(0.1, theme.colors.accent1Vibrant || "#E57373"),
            stopOpacity: 1,
          }}
        />
        <stop
          offset="100%"
          style={{
            stopColor: theme.colors.accent1Vibrant || "#E57373",
            stopOpacity: 1,
          }}
        />
      </radialGradient>
      <filter
        id="roseGlowVendorUpdate"
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
      >
        <feGaussianBlur stdDeviation="3" result="coloredBlurVendorUpdate" />
        <feMerge>
          <feMergeNode in="coloredBlurVendorUpdate" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <circle
      cx="50"
      cy="50"
      r="30"
      fill="url(#roseGradientVendorUpdate)"
      filter="url(#roseGlowVendorUpdate)"
    />
    <circle
      cx="50"
      cy="50"
      r="20"
      fill={lighten(0.2, theme.colors.accent1Vibrant || "#E57373")}
    />
    {[0, 72, 144, 216, 288].map((angle) => (
      <ellipse
        key={angle}
        cx="50"
        cy="50"
        rx="25"
        ry="40"
        fill={transparentize(0.2, theme.colors.accent2Vibrant || "#AED581")}
        transform={`rotate(${angle} 50 50) translate(0 -5)`}
      />
    ))}
    <circle cx="42" cy="45" r="3" fill={theme.colors.textDark} />
    <circle cx="58" cy="45" r="3" fill={theme.colors.textDark} />
    <path
      d="M 40 55 Q 50 62, 60 55"
      stroke={theme.colors.textDark}
      strokeWidth="2"
      fill="transparent"
    />
  </svg>
);

interface VendorProfileUpdateFormData extends updateVendorProfileUpdateFields {
  selectedBusinessDocument?: File | null;
  currentBusinessDocumentName?: string;
}

// --- FORM_SECTIONS for VENDOR UPDATE (Focus on editable fields) ---
const VENDOR_UPDATE_FORM_SECTIONS = [
  {
    id: "vendorUpdateCompanyDetails",
    title: "Company Details",
    icon: <FaBuilding />,
    fields: ["companyName", "yearEstablished", "website"],
    requiredFields: ["companyName"],
  },
  {
    id: "vendorUpdateCompanyAddress",
    title: "Company Address",
    icon: <FaMapMarkedAlt />,
    fields: [
      "companyAddress.street",
      "companyAddress.city",
      "companyAddress.state",
      "companyAddress.zip",
      "companyAddress.country",
    ],
    requiredFields: [
      "companyAddress.street",
      "companyAddress.city",
      "companyAddress.state",
      "companyAddress.zip",
      "companyAddress.country",
    ],
  },
  {
    id: "vendorUpdatePrimaryContact",
    title: "Primary Contact",
    icon: <FaUserTie />,
    fields: [
      "contactPersonFirstName",
      "contactPersonLastName",
      "contactPersonEmail",
      "contactPersonPhone",
      "contactPersonRole",
    ],
    requiredFields: [
      "contactPersonFirstName",
      "contactPersonLastName",
      "contactPersonEmail",
    ],
  },
  {
    id: "vendorUpdateProductSales",
    title: "Product & Sales",
    icon: <FaTags />,
    fields: ["primaryProductCategories", "estimatedMonthlySales"],
    requiredFields: ["primaryProductCategories"],
  },
  {
    id: "vendorUpdateBusinessDoc",
    title: "Business Document",
    icon: <FaUpload />,
    fields: ["selectedBusinessDocument"],
    requiredFields: [],
  }, // New doc upload is optional for update
];

const getInitialVendorFormData = (
  profile?: IVendorProfile | null
): VendorProfileUpdateFormData => {
  const defaults: VendorProfileUpdateFormData = {
    companyName: "",
    companyAddress: { street: "", city: "", state: "", zip: "", country: "" },
    contactPersonFirstName: "",
    contactPersonLastName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    contactPersonRole: "",
    website: "",
    yearEstablished: undefined,
    primaryProductCategories: [],
    estimatedMonthlySales: undefined,
    businessDocument: null,
    selectedBusinessDocument: null,
    currentBusinessDocumentName: "",
  };
  if (!profile) return defaults;
  return {
    ...defaults, // ensures all keys from VendorProfileUpdateFormData are present
    companyName: profile.companyName || "",
    companyAddress: profile.companyAddress
      ? { ...profile.companyAddress }
      : defaults.companyAddress,
    contactPersonFirstName: profile.contactPersonFirstName || "",
    contactPersonLastName: profile.contactPersonLastName || "",
    contactPersonEmail: profile.contactPersonEmail || "",
    contactPersonPhone: profile.contactPersonPhone || "",
    contactPersonRole: profile.contactPersonRole || "",
    website: profile.website || "",
    yearEstablished:
      profile.yearEstablished === null ? undefined : profile.yearEstablished,
    primaryProductCategories: profile.primaryProductCategories
      ? [...profile.primaryProductCategories]
      : [],
    estimatedMonthlySales:
      profile.estimatedMonthlySales === null
        ? undefined
        : profile.estimatedMonthlySales,
    currentBusinessDocumentName:
      typeof profile.documentURL === "string" && profile.documentName
        ? profile.documentName
        : "",
    // businessDocument (for submission) and selectedBusinessDocument (for UI) are reset for updates
    businessDocument: null,
    selectedBusinessDocument: null,
  };
};

const isFieldFilled = (
  fieldName: string,
  value: any,
  formData: VendorProfileUpdateFormData
): boolean => {
  if (value === undefined || value === null) return false;
  if (fieldName === "selectedBusinessDocument") return value instanceof File;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "boolean") return value === true;
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    fieldName.startsWith("companyAddress")
  ) {
    const address = value as IAddress;
    return !!(
      address.street?.trim() &&
      address.city?.trim() &&
      address.state?.trim() &&
      address.zip?.trim() &&
      address.country?.trim()
    );
  }
  if (typeof value === "number") return true;
  return false;
};

const VendorProfileUpdateForm = () => {
  const themeFromContext = useTheme();
  const theme = (
    Object.keys(themeFromContext || {}).length > 0
      ? themeFromContext
      : mockThemeForDemo
  ) as DefaultTheme;
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const {
    data: fetchedProfileData,
    error: fetchError,
    isError: isFetchError,
    isLoading: isLoadingProfile,
  } = useGetVendorProfile();
  const { mutateAsync: updateProfileMutate, isPending: isUpdating } =
    useUpdateVendorProfile();

  const [formData, setFormData] = useState<VendorProfileUpdateFormData>(() =>
    getInitialVendorFormData(null)
  ); // Initialize with null
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formLevelMessage, setFormLevelMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Rose & Progress states
  const [currentSectionId, setCurrentSectionId] = useState<string>(
    VENDOR_UPDATE_FORM_SECTIONS[0].id
  );
  const [activeField, setActiveField] = useState<string | null>(null);
  const [mascotMessage, setMascotMessage] = useState<string>("");
  const [showIntroMessage, setShowIntroMessage] = useState<boolean>(true);
  const [introMessageFaded, setIntroMessageFaded] = useState<boolean>(false);

  useEffect(() => {
    if (fetchedProfileData) {
      setFormData(
        getInitialVendorFormData(fetchedProfileData as IVendorProfile)
      );
      setErrors({});
      // Your existing status check logic for redirection
      if (fetchedProfileData.status !== "withdrawn") {
        showNotification(
          "This profile is active or under review. To make full edits, please withdraw the application first.",
          "info",
          4000
        );
        // setTimeout(() => navigate("/applications/vendor", { replace: true }), 4000); // Or seller path if that's intended
      }
    }
  }, [fetchedProfileData, navigate, showNotification]);

  useEffect(() => {
    // Rose's Introduction
    const iconHtml = `<span style="color:${theme.colors.accent2Vibrant || "#AED581"}; margin-left: 5px;">&#127801;</span>`;
    setMascotMessage(
      `Welcome back! I'm <strong>Rose</strong> ${iconHtml}. Let's fine-tune your Vendor Profile.`
    );
    const introTimer = setTimeout(() => setShowIntroMessage(false), 4000);
    const fadeOutTimer = setTimeout(() => {
      setIntroMessageFaded(true);
      const firstEditableField = VENDOR_UPDATE_FORM_SECTIONS[0]?.fields[0];
      setMascotMessage(getMascotGuidance(firstEditableField));
    }, 4700);
    return () => {
      clearTimeout(introTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [theme.colors.accent2Vibrant]);

  const getMascotGuidance = useCallback(
    (fieldName: string | null): string => {
      const lightbulbHtml = `<span style="color:${theme.colors.adminStatusWarning || "#FBC02D"}; margin-left: 5px;">&#128161;</span>`;
      if (!fieldName && introMessageFaded)
        return `Need to update something? Click a field for tips! ${lightbulbHtml}`;
      if (!fieldName) return "Ready to make your profile even better?";
      // ... (Add specific messages for editable vendor update fields) ...
      switch (fieldName) {
        case "companyName":
          return `Updating your <strong>Company Name</strong>? Your current is "${fetchedProfileData?.companyName || "N/A"}".`;
        case "companyAddress.street":
          return `Reviewing your <strong>Street Address</strong>? Make sure it's current.`;
        case "contactPersonEmail":
          return `Is your <strong>Contact Email</strong> up-to-date? This is important for communication.`;
        case "primaryProductCategories":
          return `Refining your <strong>Product Categories</strong>? Keep them relevant!`;
        case "selectedBusinessDocument":
          return `Need to upload a new <strong>Business Document</strong>? Ensure it's a PDF (max 5MB).`;
        default:
          const section =
            VENDOR_UPDATE_FORM_SECTIONS.find((s) =>
              s.fields.includes(fieldName)
            ) ||
            VENDOR_UPDATE_FORM_SECTIONS.find((s) => s.id === currentSectionId);
          return `You're on the <strong>${section?.title || "details"}</strong> section. Let me know if I can help!`;
      }
    },
    [
      currentSectionId,
      introMessageFaded,
      theme.colors.adminStatusWarning,
      fetchedProfileData,
    ]
  );

  const handleInputFocus = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const fieldName = e.target.name;
      setActiveField(fieldName);
      const sectionContainingField = VENDOR_UPDATE_FORM_SECTIONS.find(
        (section) => section.fields.includes(fieldName)
      );
      if (sectionContainingField)
        setCurrentSectionId(sectionContainingField.id);
      if (!showIntroMessage && introMessageFaded)
        setMascotMessage(getMascotGuidance(fieldName));
    },
    [showIntroMessage, introMessageFaded, getMascotGuidance]
  );

  const validateField = useCallback(
    (name: string, value: any): string | null => {
      /* ... (Your existing validateField from VendorProfileUpdateForm.tsx) ... */
      switch (name) {
        case "companyName":
          return value.trim() ? null : "Company name is required.";
        case "companyAddress.street":
        case "companyAddress.city":
        case "companyAddress.state":
        case "companyAddress.zip":
        case "companyAddress.country":
          return value.trim()
            ? null
            : `Address ${name.split(".")[1]} is required.`;
        case "contactPersonFirstName":
        case "contactPersonLastName":
        case "contactPersonEmail":
          return value.trim()
            ? null
            : `${name.replace("contactPerson", "Contact ")} is required.`;
        case "contactPersonEmail":
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || !value.trim()
            ? null
            : "Invalid contact email.";
        case "website":
          return /^(https|http):\/\/[^\s/$.?#].[^\s]*$/i.test(value) ||
            !value.trim()
            ? null
            : "Invalid website URL.";
        case "yearEstablished":
          return (value &&
            Number(value) >= 1800 &&
            Number(value) <= new Date().getFullYear()) ||
            !value
            ? null
            : "Invalid year.";
        case "primaryProductCategories":
          return Array.isArray(value) && value.length > 0
            ? null
            : "At least one product category is required.";
        default:
          return null;
      }
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    /* ... (Your existing validateForm from VendorProfileUpdateForm.tsx, adapted for editable fields) ... */
    const newErrors: Record<string, string> = {};
    let isValid = true;
    VENDOR_UPDATE_FORM_SECTIONS.forEach((section) => {
      // Validate based on defined editable sections
      section.requiredFields.forEach((fieldKey) => {
        let valueToTest;
        if (fieldKey.startsWith("companyAddress.")) {
          const addressKey = fieldKey.split(".")[1] as keyof IAddress;
          valueToTest = formData.companyAddress?.[addressKey];
        } else {
          valueToTest = formData[fieldKey as keyof VendorProfileUpdateFormData];
        }
        const error = validateField(fieldKey, valueToTest);
        if (error) {
          newErrors[fieldKey] = error;
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
      /* ... (Your existing handleChange from VendorProfileUpdateForm.tsx) ... */
      const { name, value, type } = e.target;
      let currentErrors = { ...errors };
      let processedValue: any = value;
      if (name === "yearEstablished" || name === "estimatedMonthlySales") {
        processedValue = value === "" ? undefined : parseInt(value, 10);
        if (isNaN(processedValue as number)) processedValue = undefined;
      }
      if (name.startsWith("companyAddress.")) {
        const addressField = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          companyAddress: {
            ...(prev.companyAddress as IAddress),
            [addressField]: processedValue,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name as keyof VendorProfileUpdateFormData]: processedValue,
        }));
      }
      const fieldError = validateField(name, processedValue);
      if (fieldError) currentErrors[name] = fieldError;
      else delete currentErrors[name];
      setErrors(currentErrors);
    },
    [errors, validateField]
  );

  const handleProductCategoriesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      /* ... (Your existing handleProductCategoriesChange from VendorProfileUpdateForm.tsx) ... */
      const categories = e.target.value
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat);
      setFormData((prev) => ({
        ...prev,
        primaryProductCategories: categories,
      }));
      const fieldError = validateField("primaryProductCategories", categories);
      setErrors((prevErr) => ({
        ...prevErr,
        primaryProductCategories: fieldError || undefined,
      }));
      handleInputFocus(e as any); // Trigger mascot update
    },
    [validateField, handleInputFocus]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      /* ... (Your existing handleFileChange from VendorProfileUpdateForm.tsx, ensure mascot update) ... */
      let localFileError = "";
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.type === "application/pdf" && file.size <= 5 * 1024 * 1024) {
          // Max 5MB
          setFormData((prev) => ({
            ...prev,
            selectedBusinessDocument: file,
            businessDocument: file /* for submission */,
          }));
          setErrors((prevErr) => ({ ...prevErr, businessDocument: undefined }));
          localFileError = "";
        } else {
          localFileError =
            file.size > 5 * 1024 * 1024
              ? "File too large (max 5MB)."
              : "PDF only.";
          setErrors((prevErr) => ({
            ...prevErr,
            businessDocument: localFileError,
          }));
          setFormData((prev) => ({
            ...prev,
            selectedBusinessDocument: null,
            businessDocument: null,
          }));
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      }
      if (introMessageFaded)
        setMascotMessage(
          getMascotGuidance(localFileError ? null : "selectedBusinessDocument")
        );
    },
    [introMessageFaded, getMascotGuidance]
  );

  const removeSelectedFile = useCallback(() => {
    /* ... (Your existing removeSelectedFile from VendorProfileUpdateForm.tsx, ensure mascot update) ... */
    setFormData((prev) => ({
      ...prev,
      selectedBusinessDocument: null,
      businessDocument: null,
    }));
    if (fileInputRef.current) fileInputRef.current.value = "";
    setErrors((prevErr) => ({ ...prevErr, businessDocument: undefined }));
    if (introMessageFaded)
      setMascotMessage(getMascotGuidance("selectedBusinessDocument"));
  }, [introMessageFaded, getMascotGuidance]);

  const handleSubmit = async (e: React.FormEvent) => {
    /* ... (Your existing handleSubmit from VendorProfileUpdateForm.tsx, for changed data) ... */
    e.preventDefault();
    setFormLevelMessage(null);
    if (validateForm() && fetchedProfileData) {
      const {
        selectedBusinessDocument,
        currentBusinessDocumentName,
        businessDocument,
        ...editableFieldsFromForm
      } = formData;
      const updatePayload: Partial<updateVendorProfileUpdateFields> = {};
      let hasChanges = false;

      (
        Object.keys(editableFieldsFromForm) as Array<
          keyof Omit<
            VendorProfileUpdateFormData,
            | "selectedBusinessDocument"
            | "currentBusinessDocumentName"
            | "businessDocument"
          >
        >
      ).forEach((key) => {
        const formValue = editableFieldsFromForm[key];
        const profileValue = fetchedProfileData[key as keyof IVendorProfile];
        if (key === "companyAddress") {
          if (JSON.stringify(formValue) !== JSON.stringify(profileValue)) {
            updatePayload.companyAddress = formValue as IAddress;
            hasChanges = true;
          }
        } else if (key === "primaryProductCategories") {
          if (
            JSON.stringify(formValue) !== JSON.stringify(profileValue || [])
          ) {
            updatePayload.primaryProductCategories = formValue as string[];
            hasChanges = true;
          }
        } else if (
          formValue !== undefined &&
          formValue !== profileValue &&
          !(
            key === "yearEstablished" &&
            formValue === (profileValue === null ? undefined : profileValue)
          ) &&
          !(
            key === "estimatedMonthlySales" &&
            formValue === (profileValue === null ? undefined : profileValue)
          )
        ) {
          // Special handling for optional numbers that might be null in DB but undefined in form
          (updatePayload as any)[key] = formValue;
          hasChanges = true;
        }
      });
      if (!hasChanges && !selectedBusinessDocument) {
        showNotification("No changes detected to update.", "info");
        return;
      }
      const formDataToSubmit = new FormData();
      if (Object.keys(updatePayload).length > 0) {
        // Append textual changes as JSON string or individual fields
        Object.entries(updatePayload).forEach(([key, value]) => {
          if (key === "companyAddress" && typeof value === "object")
            formDataToSubmit.append(key, JSON.stringify(value));
          else if (Array.isArray(value))
            value.forEach((item) => formDataToSubmit.append(`${key}[]`, item));
          else if (value !== undefined && value !== null)
            formDataToSubmit.append(key, String(value));
        });
      }
      if (selectedBusinessDocument)
        formDataToSubmit.append("applicationReport", selectedBusinessDocument); // Key for file

      try {
        const response = await updateProfileMutate(formDataToSubmit);
        showNotification(
          response?.message || "Profile updated successfully!",
          "success"
        );
        if (response && response.data)
          setFormData(
            getInitialVendorFormData(response.data as IVendorProfile)
          ); // Refresh form with new data
        setFormLevelMessage({
          type: "success",
          text: response?.message || "Profile updated successfully!",
        });
      } catch (err: any) {
        const errMsg =
          err?.response?.data?.message || "Update failed. Please try again.";
        showNotification(errMsg, "error");
        setFormLevelMessage({ type: "error", text: errMsg });
      }
    } else {
      showNotification("Please correct errors before submitting.", "error");
    }
  };

  const formatDate = (date?: Date | string): string => {
    /* ... (Your existing formatDate) ... */
    if (!date) return "N/A";
    try {
      const d = new Date(date);
      return isNaN(d.getTime())
        ? "Invalid Date"
        : d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Refined Progress Bar Logic
  const completedSections = useMemo(() => {
    const completed: { [key: string]: boolean } = {};
    VENDOR_UPDATE_FORM_SECTIONS.forEach((section) => {
      if (section.id === currentSectionId) {
        completed[section.id] = false;
        return;
      } // Active section is not "completed"
      const allRequiredFieldsFilledAndValid = section.requiredFields.every(
        (fieldKey) => {
          let valueToTest;
          if (fieldKey.startsWith("companyAddress.")) {
            const addressKey = fieldKey.split(".")[1] as keyof IAddress;
            valueToTest = formData.companyAddress?.[addressKey];
          } else {
            valueToTest =
              formData[fieldKey as keyof VendorProfileUpdateFormData];
          }
          return (
            isFieldFilled(fieldKey, valueToTest, formData) && !errors[fieldKey]
          );
        }
      );
      completed[section.id] = allRequiredFieldsFilledAndValid;
    });
    return completed;
  }, [currentSectionId, formData, errors]);

  // --- Page Level Loading/Error/Status Checks ---
  if (isLoadingProfile)
    return (
      <FormWrapper
        theme={theme}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <FaSpinner className="fa-spin" size="2em" /> Loading profile...
      </FormWrapper>
    );
  if (isFetchError || !fetchedProfileData)
    return (
      <FormWrapper
        theme={theme}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <FaExclamationTriangle size="2em" /> Error loading profile.{" "}
        {(fetchError as any)?.message}
      </FormWrapper>
    );
  // If profile is submitted and not withdrawn, show message (as per your original logic, slightly adapted)
  if (fetchedProfileData.status !== "withdrawn") {
    return (
      <FormWrapper
        theme={theme}
        style={{ padding: theme.spacing(10), textAlign: "center" }}
      >
        <FaInfoCircle
          size="3em"
          color={theme.colors.adminStatusWarning}
          style={{ marginBottom: theme.spacing(4) }}
        />
        <h2 style={{ fontFamily: theme.typography.heading.fontFamily }}>
          Profile Submitted
        </h2>
        <p
          style={{
            fontFamily: theme.typography.body.fontFamily,
            fontSize: theme.typography.body.sizes.large,
            lineHeight: 1.7,
          }}
        >
          Your vendor profile has been submitted and is currently{" "}
          <strong>{fetchedProfileData.status?.replace(/_/g, " ")}</strong>. To
          make further edits, you would typically need to contact support or
          have the application returned to a draft state. For this demo, major
          edits are restricted.
        </p>
        {/* Optionally add a button to navigate away:
        <SubmitButton theme={theme} onClick={() => navigate("/dashboard")} style={{marginTop: theme.spacing(6)}}>
            Back to Dashboard
        </SubmitButton> */}
      </FormWrapper>
    );
  }

  // --- Main Form Render ---
  return (
    <TwoColumnPageLayout theme={theme}>
      <InteractiveGuidePanel theme={theme}>
        <MascotContainer theme={theme}>
          <RoseMascotSVG theme={theme} />
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
          {VENDOR_UPDATE_FORM_SECTIONS.map((section) => (
            <ProgressStep
              key={section.id}
              theme={theme}
              isActive={section.id === currentSectionId && introMessageFaded}
              isCompleted={completedSections[section.id] || false}
            >
              {section.icon} {section.title}
            </ProgressStep>
          ))}
        </ProgressBarContainer>
      </InteractiveGuidePanel>

      <FormPanel theme={theme}>
        <FormWrapper theme={theme} onSubmit={handleSubmit} noValidate>
          <FormHeader theme={theme}>
            <h2>Edit Vendor Profile</h2>
            {fetchedProfileData.status && (
              <StatusBadge theme={theme} status={fetchedProfileData.status}>
                {fetchedProfileData.status.replace(/_/g, " ")}
              </StatusBadge>
            )}
          </FormHeader>
          {formLevelMessage && (
            <AuthMessage $type={formLevelMessage.type} theme={theme}>
              {formLevelMessage.text}
            </AuthMessage>
          )}

          {/* Section 1: Company Details (Editable Parts) */}
          <FormSection theme={theme} id={VENDOR_UPDATE_FORM_SECTIONS[0].id}>
            <FormSectionTitle theme={theme}>
              {VENDOR_UPDATE_FORM_SECTIONS[0].icon}{" "}
              {VENDOR_UPDATE_FORM_SECTIONS[0].title}
            </FormSectionTitle>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="companyName">
                Company Name*
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName || ""}
                onChange={handleChange}
                hasError={!!errors.companyName}
                required
                disabled={isUpdating}
              />
              {errors.companyName && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.companyName}
                </HelperText>
              )}
            </FieldGroup>
            <ReadOnlyFieldWrapper theme={theme}>
              <ReadOnlyLabel theme={theme}>
                Business Registration No.
              </ReadOnlyLabel>
              <ReadOnlyValue theme={theme}>
                {fetchedProfileData.businessRegistrationNumber}
              </ReadOnlyValue>
            </ReadOnlyFieldWrapper>
            <ReadOnlyFieldWrapper theme={theme}>
              <ReadOnlyLabel theme={theme}>Legal Entity Type</ReadOnlyLabel>
              <ReadOnlyValue theme={theme}>
                {fetchedProfileData.legalEntityType?.toUpperCase()}
              </ReadOnlyValue>
            </ReadOnlyFieldWrapper>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="yearEstablished">
                  Year Established
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="number"
                  id="yearEstablished"
                  name="yearEstablished"
                  value={
                    formData.yearEstablished === undefined
                      ? ""
                      : formData.yearEstablished
                  }
                  onChange={handleChange}
                  placeholder="YYYY"
                  min="1800"
                  max={new Date().getFullYear()}
                  hasError={!!errors.yearEstablished}
                  disabled={isUpdating}
                />
                {errors.yearEstablished && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors.yearEstablished}
                  </HelperText>
                )}
              </FieldGroup>
              <ReadOnlyFieldWrapper theme={theme} style={{ flex: 1 }}>
                <ReadOnlyLabel theme={theme}>
                  Company Tax ID / VAT
                </ReadOnlyLabel>
                <ReadOnlyValue theme={theme}>
                  {fetchedProfileData.companyTaxId || "N/A"}
                </ReadOnlyValue>
              </ReadOnlyFieldWrapper>
            </MultiFieldRow>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="website">
                Company Website
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="url"
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                placeholder="https://www.yourbrand.com"
                hasError={!!errors.website}
                disabled={isUpdating}
              />
              {errors.website && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.website}
                </HelperText>
              )}
            </FieldGroup>
          </FormSection>

          {/* Section 2: Company Address (Editable) */}
          <FormSection theme={theme} id={VENDOR_UPDATE_FORM_SECTIONS[1].id}>
            <FormSectionTitle theme={theme}>
              {VENDOR_UPDATE_FORM_SECTIONS[1].icon}{" "}
              {VENDOR_UPDATE_FORM_SECTIONS[1].title}
            </FormSectionTitle>
            {/* ... Address fields with onFocus={handleInputFocus} ... */}
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="companyAddress.street">
                Street Address*
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="text"
                id="companyAddress.street"
                name="companyAddress.street"
                value={formData.companyAddress?.street || ""}
                onChange={handleChange}
                hasError={!!errors["companyAddress.street"]}
                required
                disabled={isUpdating}
              />
              {errors["companyAddress.street"] && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors["companyAddress.street"]}
                </HelperText>
              )}
            </FieldGroup>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="companyAddress.city">
                  City*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="companyAddress.city"
                  name="companyAddress.city"
                  value={formData.companyAddress?.city || ""}
                  onChange={handleChange}
                  hasError={!!errors["companyAddress.city"]}
                  required
                  disabled={isUpdating}
                />
                {errors["companyAddress.city"] && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors["companyAddress.city"]}
                  </HelperText>
                )}
              </FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="companyAddress.state">
                  State/Province*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="companyAddress.state"
                  name="companyAddress.state"
                  value={formData.companyAddress?.state || ""}
                  onChange={handleChange}
                  hasError={!!errors["companyAddress.state"]}
                  required
                  disabled={isUpdating}
                />
                {errors["companyAddress.state"] && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors["companyAddress.state"]}
                  </HelperText>
                )}
              </FieldGroup>
            </MultiFieldRow>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="companyAddress.zip">
                  ZIP/Postal Code*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="companyAddress.zip"
                  name="companyAddress.zip"
                  value={formData.companyAddress?.zip || ""}
                  onChange={handleChange}
                  hasError={!!errors["companyAddress.zip"]}
                  required
                  disabled={isUpdating}
                />
                {errors["companyAddress.zip"] && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors["companyAddress.zip"]}
                  </HelperText>
                )}
              </FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="companyAddress.country">
                  Country*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="companyAddress.country"
                  name="companyAddress.country"
                  value={formData.companyAddress?.country || ""}
                  onChange={handleChange}
                  hasError={!!errors["companyAddress.country"]}
                  required
                  disabled={isUpdating}
                />
                {errors["companyAddress.country"] && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors["companyAddress.country"]}
                  </HelperText>
                )}
              </FieldGroup>
            </MultiFieldRow>
          </FormSection>

          {/* Section 3: Primary Contact (Editable) */}
          <FormSection theme={theme} id={VENDOR_UPDATE_FORM_SECTIONS[2].id}>
            <FormSectionTitle theme={theme}>
              {VENDOR_UPDATE_FORM_SECTIONS[2].icon}{" "}
              {VENDOR_UPDATE_FORM_SECTIONS[2].title}
            </FormSectionTitle>
            {/* ... Contact fields with onFocus={handleInputFocus} ... */}
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="contactPersonFirstName">
                  Contact First Name*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="contactPersonFirstName"
                  name="contactPersonFirstName"
                  value={formData.contactPersonFirstName || ""}
                  onChange={handleChange}
                  hasError={!!errors.contactPersonFirstName}
                  required
                  disabled={isUpdating}
                />
                {errors.contactPersonFirstName && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors.contactPersonFirstName}
                  </HelperText>
                )}
              </FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="contactPersonLastName">
                  Contact Last Name*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="text"
                  id="contactPersonLastName"
                  name="contactPersonLastName"
                  value={formData.contactPersonLastName || ""}
                  onChange={handleChange}
                  hasError={!!errors.contactPersonLastName}
                  required
                  disabled={isUpdating}
                />
                {errors.contactPersonLastName && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors.contactPersonLastName}
                  </HelperText>
                )}
              </FieldGroup>
            </MultiFieldRow>
            <MultiFieldRow theme={theme}>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="contactPersonEmail">
                  Contact Email*
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="email"
                  id="contactPersonEmail"
                  name="contactPersonEmail"
                  value={formData.contactPersonEmail || ""}
                  onChange={handleChange}
                  hasError={!!errors.contactPersonEmail}
                  required
                  disabled={isUpdating}
                />
                {errors.contactPersonEmail && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors.contactPersonEmail}
                  </HelperText>
                )}
              </FieldGroup>
              <FieldGroup theme={theme} fullWidthMobile>
                <FormLabel theme={theme} htmlFor="contactPersonPhone">
                  Contact Phone
                </FormLabel>
                <StyledInput
                  onFocus={handleInputFocus}
                  theme={theme}
                  type="tel"
                  id="contactPersonPhone"
                  name="contactPersonPhone"
                  value={formData.contactPersonPhone || ""}
                  onChange={handleChange}
                  hasError={!!errors.contactPersonPhone}
                  disabled={isUpdating}
                />
                {errors.contactPersonPhone && (
                  <HelperText theme={theme} error>
                    <FaInfoCircle /> {errors.contactPersonPhone}
                  </HelperText>
                )}
              </FieldGroup>
            </MultiFieldRow>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="contactPersonRole">
                Contact Role/Title
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="text"
                id="contactPersonRole"
                name="contactPersonRole"
                value={formData.contactPersonRole || ""}
                onChange={handleChange}
                placeholder="e.g., CEO, Sales Director"
                disabled={isUpdating}
              />
            </FieldGroup>
          </FormSection>

          {/* Section 4: Banking Info (Read-Only) */}
          <FormSection theme={theme}>
            <FormSectionTitle theme={theme}>
              <FaLandmark /> Business Banking
            </FormSectionTitle>
            {/* ... Read-only banking info ... */}
            <SectionContentGrid
              theme={theme}
              style={{ gridTemplateColumns: "1fr" }}
            >
              <InfoDisplayItem theme={theme}>
                <p className="label">Bank Name</p>
                <span className="value">
                  {fetchedProfileData.businessBankName || "N/A"}
                </span>
              </InfoDisplayItem>
              <InfoDisplayItem theme={theme}>
                <p className="label">Account Number</p>
                <span className="value">
                  {fetchedProfileData.businessBankAccountNumber
                    ? `**** **** **** ${fetchedProfileData.businessBankAccountNumber.slice(-4)}`
                    : "N/A"}
                </span>
              </InfoDisplayItem>
              <InfoDisplayItem theme={theme}>
                <p className="label">Routing Number</p>
                <span className="value">
                  {fetchedProfileData.businessRoutingNumber
                    ? `*****${fetchedProfileData.businessRoutingNumber.slice(-4)}`
                    : "N/A"}
                </span>
              </InfoDisplayItem>
            </SectionContentGrid>
            <HelperText theme={theme} style={{ marginTop: theme.spacing(3) }}>
              <FaInfoCircle /> Banking details are sensitive. To update, please
              contact Vendor Support.
            </HelperText>
          </FormSection>

          {/* Section 5: Product & Sales (Editable) */}
          <FormSection theme={theme} id={VENDOR_UPDATE_FORM_SECTIONS[3].id}>
            <FormSectionTitle theme={theme}>
              {VENDOR_UPDATE_FORM_SECTIONS[3].icon}{" "}
              {VENDOR_UPDATE_FORM_SECTIONS[3].title}
            </FormSectionTitle>
            {/* ... Product fields with onFocus={handleInputFocus} ... */}
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="primaryProductCategories">
                Primary Product Categories* (comma-separated)
              </FormLabel>
              <StyledInput
                onFocus={handleInputFocus}
                theme={theme}
                type="text"
                id="primaryProductCategories"
                name="primaryProductCategories"
                value={formData.primaryProductCategories?.join(", ") || ""}
                onChange={handleProductCategoriesChange}
                placeholder="e.g., Handcrafted Furniture, Artisanal Lighting"
                required
                hasError={!!errors.primaryProductCategories}
                disabled={isUpdating}
              />
              {errors.primaryProductCategories && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.primaryProductCategories}
                </HelperText>
              )}
            </FieldGroup>
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="estimatedMonthlySales">
                Estimated Monthly Sales (USD)
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
                placeholder="e.g., 50000"
                disabled={isUpdating}
              />
            </FieldGroup>
          </FormSection>

          {/* Section 6: Business Document (Editable) */}
          <FormSection theme={theme} id={VENDOR_UPDATE_FORM_SECTIONS[4].id}>
            <FormSectionTitle theme={theme}>
              {VENDOR_UPDATE_FORM_SECTIONS[4].icon}{" "}
              {VENDOR_UPDATE_FORM_SECTIONS[4].title}
            </FormSectionTitle>
            {/* ... Document upload with onFocus={handleInputFocus} on label ... */}
            {formData.currentBusinessDocumentName &&
              !formData.selectedBusinessDocument && (
                <FieldGroup theme={theme}>
                  <ReadOnlyLabel theme={theme}>
                    Current Verified Document:
                  </ReadOnlyLabel>
                  <ExistingFileInfo theme={theme}>
                    <a
                      href={fetchedProfileData.documentURL || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={formData.currentBusinessDocumentName}
                    >
                      <FaFilePdf />{" "}
                      <span>{formData.currentBusinessDocumentName}</span>{" "}
                      <FaExternalLinkAlt size="0.85em" />
                    </a>
                  </ExistingFileInfo>
                </FieldGroup>
              )}
            <FieldGroup theme={theme}>
              <FormLabel theme={theme} htmlFor="selectedBusinessDocument">
                {formData.currentBusinessDocumentName
                  ? "Replace Document (PDF, max 5MB)"
                  : "Upload Document (PDF, max 5MB)"}
              </FormLabel>
              <FileInputWrapper theme={theme}>
                <label
                  htmlFor="selectedBusinessDocument"
                  className="file-input-label"
                  onFocus={handleInputFocus}
                  tabIndex={0}
                >
                  <FaUpload />{" "}
                  {formData.selectedBusinessDocument
                    ? formData.selectedBusinessDocument.name.substring(0, 20) +
                      (formData.selectedBusinessDocument.name.length > 20
                        ? "..."
                        : "")
                    : "Choose PDF"}
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="selectedBusinessDocument"
                  name="selectedBusinessDocument"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  disabled={isUpdating}
                />
              </FileInputWrapper>
              {formData.selectedBusinessDocument && (
                <FileInfoDisplay theme={theme}>
                  <span className="file-info-text">
                    <FaFilePdf />
                    <span className="file-name">
                      {formData.selectedBusinessDocument.name}
                    </span>
                    <span className="file-size">
                      {" "}
                      (
                      {(
                        formData.selectedBusinessDocument.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="remove-file-btn"
                    aria-label="Remove file"
                    disabled={isUpdating}
                  >
                    <FaTrash />
                  </button>
                </FileInfoDisplay>
              )}
              {errors.businessDocument && (
                <HelperText theme={theme} error>
                  <FaInfoCircle /> {errors.businessDocument}
                </HelperText>
              )}
            </FieldGroup>
          </FormSection>

          {/* Section 7: Agreements & Account Info (Read-Only) */}
          <FormSection theme={theme}>
            <FormSectionTitle theme={theme}>
              <FaFileSignature /> Agreements & Account Details
            </FormSectionTitle>
            {/* ... Read-only agreement info ... */}
            <SectionContentGrid
              theme={theme}
              style={{ gridTemplateColumns: "1fr" }}
            >
              <InfoDisplayItem theme={theme}>
                <p className="label">Vendor Agreement</p>
                <span className="value">
                  {fetchedProfileData.agreedToTerms
                    ? `Agreed on ${formatDate(fetchedProfileData.createdAt)}`
                    : "Pending"}
                </span>
              </InfoDisplayItem>
              <InfoDisplayItem theme={theme}>
                <p className="label">Privacy Policy</p>
                <span className="value">
                  {fetchedProfileData.agreedToPrivacyPolicy
                    ? `Acknowledged on ${formatDate(fetchedProfileData.createdAt)}`
                    : "Pending"}
                </span>
              </InfoDisplayItem>
              <InfoDisplayItem theme={theme}>
                <p className="label">
                  <FaCalendarAlt /> Profile Created
                </p>
                <span className="value">
                  {formatDate(fetchedProfileData.createdAt)}
                </span>
              </InfoDisplayItem>
              <InfoDisplayItem theme={theme}>
                <p className="label">
                  <FaCalendarCheck /> Last Updated
                </p>
                <span className="value">
                  {formatDate(fetchedProfileData.updatedAt)}
                </span>
              </InfoDisplayItem>
              {fetchedProfileData.approvedBy && (
                <InfoDisplayItem theme={theme}>
                  <p className="label">Approved By (Admin)</p>
                  <span className="value">{fetchedProfileData.approvedBy}</span>
                </InfoDisplayItem>
              )}
              {fetchedProfileData.activatedAt && (
                <InfoDisplayItem theme={theme}>
                  <p className="label">Account Activated</p>
                  <span className="value">
                    <FaCalendarCheck />{" "}
                    {formatDate(fetchedProfileData.activatedAt)}
                  </span>
                </InfoDisplayItem>
              )}
            </SectionContentGrid>
          </FormSection>

          <ButtonGroup theme={theme}>
            <CancelButton
              theme={theme}
              type="button"
              onClick={() =>
                fetchedProfileData &&
                setFormData(
                  getInitialVendorFormData(fetchedProfileData as IVendorProfile)
                )
              }
              disabled={isUpdating}
            >
              <FaTimes /> Discard Changes
            </CancelButton>
            <SubmitButton
              theme={theme}
              type="submit"
              disabled={isUpdating || isLoadingProfile}
            >
              {isUpdating ? (
                "Saving..."
              ) : (
                <>
                  <FaSave /> Save Profile
                </>
              )}
            </SubmitButton>
          </ButtonGroup>
        </FormWrapper>
      </FormPanel>
    </TwoColumnPageLayout>
  );
};

export default VendorProfileUpdateForm;

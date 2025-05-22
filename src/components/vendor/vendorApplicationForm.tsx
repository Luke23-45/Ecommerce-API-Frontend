import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { useNavigate } from "react-router-dom";

import { type IAddress } from "@/types/seller";
import { useGetVendorProfile, useCreateVendorProfile } from "@/hooks/useVendor";

import {
  StyledForm,
  FormField,
  StyledLabel,
  StyledInput,
  SubmitButton,
  ErrorMessage,
  SuccessMessage,
  FormSectionTitle,
  CheckboxContainer,
  FormRow,
  StyledSelect,
} from "@/components/seller/IndividualSellerApplicationForm.styled";
import { type IVendorProfile } from "@/types/vendor";
import { useQueryClient } from "@tanstack/react-query";

type VendorSellerFormState = Omit<
  IVendorProfile,
  | "_id"
  | "userId"
  | "status"
  | "activatedAt"
  | "approvedBy"
  | "createdAt"
  | "updatedAt"
  | "__v"
  | "sellerType"
  | "submittedAt"
  | "reviewedBy"
  | "reviewedAt"
  | "rejectionReason"
  | "members"
>;

function VendorApplicationForm() {
  const queryClient = useQueryClient(); // Initialize query client
  const navigate = useNavigate(); // Initialize navigate hook

  // Hooks must be called unconditionally at the top level
  const user = useSelector((state: RootState) => state.auth.user); // Get user from Redux store

  // Query to get existing vendor profile
  // const {
  //   data: vendorProfile,
  //   isLoading: isProfileLoading,
  //   isError: isProfileError,
  //   error: profileError,
  // } = useGetVendorProfile();

  // Mutation hook for creating vendor profile
  const {
    mutate: createVendorProfile,
    isPending: isCreating,
    isSuccess: createSuccess,
    isError: createError,
    error: createErrorObj,
  } = useCreateVendorProfile();

  // Form state initialization
  const [formData, setFormData] = useState<VendorSellerFormState>({
    companyName: "",
    businessRegistrationNumber: "",
    companyAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    legalEntityType: "",
    contactPersonFirstName: "",
    contactPersonLastName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    contactPersonRole: "",
    website: "",
    yearEstablished: undefined,
    companyTaxId: "",
    businessBankName: "",
    businessBankAccountNumber: "",
    businessRoutingNumber: "",
    primaryProductCategories: [],
    estimatedMonthlySales: undefined,
    businessRegistrationDocumentUrl: "",
    taxCertificateUrl: "",
    agreedToTerms: false,
    agreedToPrivacyPolicy: false,
  });

  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  // useEffect(() => {
  //   if (vendorProfile && !isProfileLoading && !isCreating) {
  //     console.log(
  //       "Vendor profile found, redirecting to dashboard:",
  //       vendorProfile
  //     );
  //     navigate("/vendor-dashboard", { replace: true });
  //   }
  // }, [vendorProfile, isProfileLoading, isCreating, navigate]);
const isProfileLoading  = false;
const isProfileError = false;
const vendorProfile = false;

  useEffect(() => {
    if (createSuccess) {
      setMessage({
        type: "success",
        text: "Vendor application submitted successfully!",
      });

      queryClient.invalidateQueries({ queryKey: ["vendorProfile"] });
    }
    if (createError) {
      const errorMessage =
        (createErrorObj as any)?.response?.data?.message ||
        (createErrorObj as any)?.message ||
        "Failed to submit vendor application. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    }
  }, [createSuccess, createError, createErrorObj, queryClient]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (name.startsWith("companyAddress.")) {
      const addressField = name.split(".")[1] as keyof IAddress;
      setFormData((prev) => ({
        ...prev,
        companyAddress: {
          ...prev.companyAddress,
          [addressField]: value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : Number(value),
      }));
    } else if (name === "yearEstablished") {
      const dateValue = value ? new Date(value).getFullYear() : undefined;
      setFormData((prev) => ({
        ...prev,
        yearEstablished: dateValue?.getFullYear(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { options } = e.target;
    const selectedValues: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setFormData((prev) => ({
      ...prev,
      primaryProductCategories: selectedValues,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      console.log(`Simulating file upload for ${name}:`, files[0].name);
      const dummyUrl = `https://example.com/uploads/${files[0].name}`;
      setFormData((prev) => ({
        ...prev,
        [name]: dummyUrl,
      }));
      setMessage({ type: "success", text: `File selected: ${files[0].name}` });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: null, text: "" });

    let validationErrors: string[] = [];

    if (!formData.companyName.trim())
      validationErrors.push("Company Name is required.");
    if (!formData.businessRegistrationNumber.trim())
      validationErrors.push("Business Registration Number is required.");
    if (!formData.legalEntityType.trim())
      validationErrors.push("Legal Entity Type is required.");
    if (
      !formData.companyAddress.street.trim() ||
      !formData.companyAddress.city.trim() ||
      !formData.companyAddress.state.trim() ||
      !formData.companyAddress.zip.trim() ||
      !formData.companyAddress.country.trim()
    ) {
      validationErrors.push("All Company Address fields are required.");
    }
    if (
      !formData.yearEstablished ||
      isNaN(formData.yearEstablished.getTime())
    ) {
      validationErrors.push("Year Established must be a valid date.");
    }

    if (!formData.contactPersonFirstName.trim())
      validationErrors.push("Contact Person First Name is required.");
    if (!formData.contactPersonLastName.trim())
      validationErrors.push("Contact Person Last Name is required.");
    if (!formData.contactPersonEmail.trim()) {
      validationErrors.push("Contact Person Email is required.");
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactPersonEmail)
    ) {
      validationErrors.push("Contact Person Email is invalid.");
    }
    // if (!formData.contactPersonPhone.trim())
    //   validationErrors.push("Contact Person Phone is required.");
    // if (!formData.contactPersonRole.trim())
    //   validationErrors.push("Contact Person Role is required.");

    // if (!formData.companyTaxId.trim())
    //   validationErrors.push("Company Tax ID is required.");
    // if (!formData.businessBankName.trim())
    //   validationErrors.push("Business Bank Name is required.");
    // if (!formData.businessBankAccountNumber.trim())
    //   validationErrors.push("Business Bank Account Number is required.");
    // if (!formData.businessRoutingNumber.trim())
    //   validationErrors.push("Business Routing Number is required.");

    // Section 4: Business Details (Optional, but categories might be required)
    // If primaryProductCategories is an optional field, remove this check.
    // if (formData.primaryProductCategories.length === 0)
    //   validationErrors.push(
    //     "Please select at least one Primary Product Category."
    //   );
    if (
      formData.estimatedMonthlySales === undefined ||
      formData.estimatedMonthlySales < 0
    )
      validationErrors.push(
        "Estimated Monthly Sales is required and must be non-negative."
      );

    if (!formData.businessRegistrationDocumentUrl.trim())
      validationErrors.push("Business Registration Document is required.");
    if (!formData.taxCertificateUrl.trim())
      validationErrors.push("Tax Certificate is required.");

    if (!formData.agreedToTerms)
      validationErrors.push("You must agree to the Terms and Conditions.");
    if (!formData.agreedToPrivacyPolicy)
      validationErrors.push("You must agree to the Privacy Policy.");

    if (validationErrors.length > 0) {
      setMessage({ type: "error", text: validationErrors.join(" ") });
      return;
    }

    const payload: IVendorProfile = {
      companyName: formData.companyName,
      businessRegistrationNumber: formData.businessRegistrationNumber,
      companyAddress: formData.companyAddress,
      legalEntityType: formData.legalEntityType,
      contactPersonFirstName: formData.contactPersonFirstName,
      contactPersonLastName: formData.contactPersonLastName,
      contactPersonEmail: formData.contactPersonEmail,
      contactPersonPhone: formData.contactPersonPhone,
      contactPersonRole: formData.contactPersonRole,
      companyTaxId: formData.companyTaxId,
      businessBankName: formData.businessBankName,
      businessBankAccountNumber: formData.businessBankAccountNumber,
      businessRoutingNumber: formData.businessRoutingNumber,
      primaryProductCategories: formData.primaryProductCategories,
      businessRegistrationDocumentUrl: formData.businessRegistrationDocumentUrl,
      taxCertificateUrl: formData.taxCertificateUrl,
      agreedToTerms: formData.agreedToTerms,
      agreedToPrivacyPolicy: formData.agreedToPrivacyPolicy,

      ...(formData.website && { website: formData.website }),
      ...(formData.yearEstablished && {
        yearEstablished: formData.yearEstablished.getFullYear(),
      }),
      ...(formData.estimatedMonthlySales !== undefined && {
        estimatedMonthlySales: formData.estimatedMonthlySales,
      }),
    } as IVendorProfile;

    console.log("Attempting to create vendor profile with payload:", payload);
    createVendorProfile(payload);
  };

  if (isProfileLoading) {
    return <div>Loading vendor profile status...</div>;
  }

  if (isProfileError) {
    console.error("Error fetching existing vendor profile:", profileError);
    return (
      <ErrorMessage>
        Error checking vendor profile: {profileError?.message}. Please try
        again.
      </ErrorMessage>
    );
  }

  if (vendorProfile) {
    return <div>Redirecting to vendor dashboard...</div>;
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h2>Vendor Application Form</h2>

      {/* Display messages */}
      {message.type === "error" && <ErrorMessage>{message.text}</ErrorMessage>}
      {message.type === "success" && (
        <SuccessMessage>{message.text}</SuccessMessage>
      )}

      {isCreating && <p>Submitting your application...</p>}

      <FormSectionTitle>1. Company Information</FormSectionTitle>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="companyName">Company Name:</StyledLabel>
          <StyledInput
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="businessRegistrationNumber">
            Business Registration Number:
          </StyledLabel>
          <StyledInput
            type="text"
            id="businessRegistrationNumber"
            name="businessRegistrationNumber"
            value={formData.businessRegistrationNumber}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
      </FormRow>

      <FormField>
        <StyledLabel htmlFor="legalEntityType">Legal Entity Type:</StyledLabel>
        <StyledSelect
          id="legalEntityType"
          name="legalEntityType"
          value={formData.legalEntityType}
          onChange={handleChange}
          required
          disabled={isCreating}
        >
          <option value="">Select Type</option>
          <option value="Sole Proprietorship">Sole Proprietorship</option>
          <option value="partnership">Partnership</option>
          <option value="corporation">Corporation</option>
          <option value="llc">LLC (Limited Liability Company)</option>
          <option value="Other">Other</option>
        </StyledSelect>
      </FormField>

      <FormSectionTitle>Company Address</FormSectionTitle>
      <FormField>
        <StyledLabel htmlFor="companyAddress.street">
          Street Address:
        </StyledLabel>
        <StyledInput
          type="text"
          id="companyAddress.street"
          name="companyAddress.street"
          value={formData.companyAddress.street}
          onChange={handleChange}
          required
          disabled={isCreating}
        />
      </FormField>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="companyAddress.city">City:</StyledLabel>
          <StyledInput
            type="text"
            id="companyAddress.city"
            name="companyAddress.city"
            value={formData.companyAddress.city}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="companyAddress.state">
            State/Province:
          </StyledLabel>
          <StyledInput
            type="text"
            id="companyAddress.state"
            name="companyAddress.state"
            value={formData.companyAddress.state}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="companyAddress.zip">
            Zip/Postal Code:
          </StyledLabel>
          <StyledInput
            type="text"
            id="companyAddress.zip"
            name="companyAddress.zip"
            value={formData.companyAddress.zip}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="companyAddress.country">Country:</StyledLabel>
          <StyledInput
            type="text"
            id="companyAddress.country"
            name="companyAddress.country"
            value={formData.companyAddress.country}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
      </FormRow>

      <FormField>
        <StyledLabel htmlFor="website">Website (Optional):</StyledLabel>
        <StyledInput
          type="url"
          id="website"
          name="website"
          value={formData.website || ""}
          onChange={handleChange}
          placeholder="https://www.yourcompany.com"
          disabled={isCreating}
        />
      </FormField>

      <FormField>
        <StyledLabel htmlFor="yearEstablished">Year Established:</StyledLabel>
        <StyledInput
          type="date" // Use type="date" for a date input
          id="yearEstablished"
          name="yearEstablished"
          // Format Date object to YYYY-MM-DD for date input
          value={
            formData.yearEstablished instanceof Date &&
            !isNaN(formData.yearEstablished.getTime())
              ? formData.yearEstablished.toISOString().split("T")[0]
              : ""
          }
          onChange={handleChange}
          required
          disabled={isCreating}
        />
      </FormField>

      {/* SECTION 2: Contact Person Information */}
      <FormSectionTitle>2. Contact Person Information</FormSectionTitle>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="contactPersonFirstName">
            First Name:
          </StyledLabel>
          <StyledInput
            type="text"
            id="contactPersonFirstName"
            name="contactPersonFirstName"
            value={formData.contactPersonFirstName}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="contactPersonLastName">Last Name:</StyledLabel>
          <StyledInput
            type="text"
            id="contactPersonLastName"
            name="contactPersonLastName"
            value={formData.contactPersonLastName}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="contactPersonEmail">Email:</StyledLabel>
          <StyledInput
            type="email"
            id="contactPersonEmail"
            name="contactPersonEmail"
            value={formData.contactPersonEmail}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="contactPersonPhone">Phone Number:</StyledLabel>
          <StyledInput
            type="tel"
            id="contactPersonPhone"
            name="contactPersonPhone"
            value={formData.contactPersonPhone}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
      </FormRow>
      <FormField>
        <StyledLabel htmlFor="contactPersonRole">Role/Title:</StyledLabel>
        <StyledInput
          type="text"
          id="contactPersonRole"
          name="contactPersonRole"
          value={formData.contactPersonRole}
          onChange={handleChange}
          required
          disabled={isCreating}
        />
      </FormField>

      {/* SECTION 3: Financial Information */}
      <FormSectionTitle>3. Financial Information</FormSectionTitle>
      <FormField>
        <StyledLabel htmlFor="companyTaxId">Company Tax ID:</StyledLabel>
        <StyledInput
          type="text"
          id="companyTaxId"
          name="companyTaxId"
          value={formData.companyTaxId}
          onChange={handleChange}
          required
          disabled={isCreating}
        />
      </FormField>
      <FormField>
        <StyledLabel htmlFor="businessBankName">
          Business Bank Name:
        </StyledLabel>
        <StyledInput
          type="text"
          id="businessBankName"
          name="businessBankName"
          value={formData.businessBankName}
          onChange={handleChange}
          required
          disabled={isCreating}
        />
      </FormField>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="businessBankAccountNumber">
            Business Bank Account Number:
          </StyledLabel>
          <StyledInput
            type="text"
            id="businessBankAccountNumber"
            name="businessBankAccountNumber"
            value={formData.businessBankAccountNumber}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="businessRoutingNumber">
            Business Routing Number:
          </StyledLabel>
          <StyledInput
            type="text"
            id="businessRoutingNumber"
            name="businessRoutingNumber"
            value={formData.businessRoutingNumber}
            onChange={handleChange}
            required
            disabled={isCreating}
          />
        </FormField>
      </FormRow>

      {/* SECTION 4: Business Details */}
      <FormSectionTitle>4. Business Details</FormSectionTitle>
      <FormField>
        <StyledLabel htmlFor="primaryProductCategories">
          Primary Product Categories (Multi-select):
        </StyledLabel>
        <StyledSelect
          id="primaryProductCategories"
          name="primaryProductCategories"
          multiple
          value={formData.primaryProductCategories}
          onChange={handleMultiSelectChange}
          required // Assuming at least one category is required
          disabled={isCreating}
        >
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Books">Books</option>
          <option value="Sports & Outdoors">Sports & Outdoors</option>
          <option value="Health & Beauty">Health & Beauty</option>
          <option value="Automotive">Automotive</option>
          <option value="Collectibles">Collectibles</option>
        </StyledSelect>
      </FormField>
      <FormField>
        <StyledLabel htmlFor="estimatedMonthlySales">
          Estimated Monthly Sales (USD) (Optional):
        </StyledLabel>
        <StyledInput
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
          disabled={isCreating}
        />
      </FormField>

      {/* SECTION 5: Document Uploads */}
      <FormSectionTitle>5. Document Uploads</FormSectionTitle>
      <FormField>
        <StyledLabel htmlFor="businessRegistrationDocumentUrl">
          Business Registration Document:
        </StyledLabel>
        <StyledInput
          type="file" // Use type="file" for file uploads
          id="businessRegistrationDocumentUrl"
          name="businessRegistrationDocumentUrl"
          onChange={handleFileChange}
          required
          disabled={isCreating}
        />
        {formData.businessRegistrationDocumentUrl && (
          <p>
            File selected:{" "}
            {formData.businessRegistrationDocumentUrl.split("/").pop()}
          </p>
        )}
      </FormField>
      <FormField>
        <StyledLabel htmlFor="taxCertificateUrl">Tax Certificate:</StyledLabel>
        <StyledInput
          type="file" // Use type="file" for file uploads
          id="taxCertificateUrl"
          name="taxCertificateUrl"
          onChange={handleFileChange}
          required
          disabled={isCreating}
        />
        {formData.taxCertificateUrl && (
          <p>File selected: {formData.taxCertificateUrl.split("/").pop()}</p>
        )}
      </FormField>

      {/* SECTION 6: Terms and Privacy Policy */}
      <FormSectionTitle>6. Legal Agreements</FormSectionTitle>
      <CheckboxContainer>
        <input
          type="checkbox"
          id="agreedToTerms"
          name="agreedToTerms"
          checked={formData.agreedToTerms}
          onChange={handleChange}
          required
          disabled={isCreating}
        />
        <StyledLabel htmlFor="agreedToTerms">
          I agree to the{" "}
          <a href="/terms" target="_blank" rel="noopener noreferrer">
            Terms and Conditions
          </a>
          .
        </StyledLabel>
      </CheckboxContainer>
      <CheckboxContainer>
        <input
          type="checkbox"
          id="agreedToPrivacyPolicy"
          name="agreedToPrivacyPolicy"
          checked={formData.agreedToPrivacyPolicy}
          onChange={handleChange}
          required
          disabled={isCreating}
        />
        <StyledLabel htmlFor="agreedToPrivacyPolicy">
          I agree to the{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
          .
        </StyledLabel>
      </CheckboxContainer>

      <SubmitButton type="submit" disabled={isCreating}>
        {isCreating ? "Submitting Application..." : "Submit Application"}
      </SubmitButton>
    </StyledForm>
  );
}

export default VendorApplicationForm;

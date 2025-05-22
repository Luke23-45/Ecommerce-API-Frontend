// src/components/seller/IndividualSellerApplicationForm.tsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { useNavigate } from "react-router";

import { type IIndividualSellerProfile, type IAddress } from "@/types/seller";
import {
  useCreateIndividualSellerProfile,
  useGetIndividualSellerProfile,
} from "@/hooks/useIndividualSeller"; // Import the new hook

// Import styled components
import {
  StyledForm,
  FormField,
  StyledLabel,
  StyledInput,
  SubmitButton,
  ErrorMessage,
  SuccessMessage,
  StyledTextArea,
  FormSectionTitle,
  CheckboxContainer,
  FormRow,
  StyledSelect,
} from "./IndividualSellerApplicationForm.styled";

// Define a type for the form's internal state, omitting system-managed fields
type IndividualSellerFormState = Omit<
  IIndividualSellerProfile,
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
>;

function IndividualSellerApplicationForm() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState<IndividualSellerFormState>({
    sellerName: user?.firstName || "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    legalFirstName: user?.firstName || "",
    legalLastName: user?.lastName || "",
    dateOfBirth: new Date(),
    citizenshipCountry: "",
    taxIdentificationNumber: "",
    payoutMethodPreference: "",
    bankAccountHolderName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
    briefDescription: "",
    primaryProductCategories: [],
    estimatedMonthlySales: undefined,
    yearsOfSellingExperience: undefined,
    otherPlatformsSoldOn: "",
    agreedToTerms: false,
    agreedToPrivacyPolicy: false,
  });

  const [message, setMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  // Initialize the mutation hook
  const {
    mutate: createSellerProfile,
    isPending,
    isSuccess,
    isError,
    error,
  } = useCreateIndividualSellerProfile();

  const { data: sellerProfile } = useGetIndividualSellerProfile();

  const navigate = useNavigate();
  if (sellerProfile) {
    navigate("/seller-dashboard", { replace: true });
  }

  // Effect to pre-fill user's names
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        sellerName: user.firstName || prev.sellerName,
        legalFirstName: user.firstName || prev.legalFirstName,
        legalLastName: user.lastName || prev.legalLastName,
      }));
    }
  }, [user]);

  // Handle incoming mutation states (success/error)
  useEffect(() => {
    if (isSuccess) {
      setMessage({
        type: "success",
        text: "Seller application submitted successfully!",
      });
      // Optionally reset form after successful submission
      // setFormData( /* reset to initial empty state or default values */ );
    }
    if (isError) {
      // Error could be an instance of Error or ApiResponse<IIndividualSellerProfile> with success: false
      const errorMessage =
        error?.message ||
        "Failed to submit seller application. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    }
  }, [isSuccess, isError, error]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1] as keyof IAddress;
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : Number(value),
      }));
    } else if (name === "dateOfBirth") {
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: value ? new Date(value) : new Date(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: null, text: "" }); // Clear previous messages

    // Basic client-side validation
    if (!formData.agreedToTerms || !formData.agreedToPrivacyPolicy) {
      setMessage({
        type: "error",
        text: "You must agree to the Terms and Privacy Policy.",
      });
      return;
    }
    if (
      !formData.phoneNumber ||
      !formData.address.street ||
      !formData.taxIdentificationNumber ||
      !formData.citizenshipCountry
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields in each section.",
      });
      return;
    }
    if (!formData.dateOfBirth || isNaN(formData.dateOfBirth.getTime())) {
      setMessage({
        type: "error",
        text: "Please provide a valid Date of Birth.",
      });
      return;
    }

    const payload: Partial<IIndividualSellerProfile> = {
      sellerName: formData.sellerName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      legalFirstName: formData.legalFirstName,
      legalLastName: formData.legalLastName,
      dateOfBirth: formData.dateOfBirth,
      citizenshipCountry: formData.citizenshipCountry,
      taxIdentificationNumber: formData.taxIdentificationNumber,
      payoutMethodPreference: formData.payoutMethodPreference,
      agreedToTerms: formData.agreedToTerms,
      agreedToPrivacyPolicy: formData.agreedToPrivacyPolicy,

      ...(formData.bankAccountHolderName && {
        bankAccountHolderName: formData.bankAccountHolderName,
      }),
      ...(formData.bankAccountNumber && {
        bankAccountNumber: formData.bankAccountNumber,
      }),
      ...(formData.bankRoutingNumber && {
        bankRoutingNumber: formData.bankRoutingNumber,
      }),
      ...(formData.briefDescription && {
        briefDescription: formData.briefDescription,
      }),
      ...(formData.primaryProductCategories &&
        formData.primaryProductCategories.length > 0 && {
          primaryProductCategories: formData.primaryProductCategories,
        }),
      ...(formData.estimatedMonthlySales !== undefined && {
        estimatedMonthlySales: formData.estimatedMonthlySales,
      }),
      ...(formData.yearsOfSellingExperience !== undefined && {
        yearsOfSellingExperience: formData.yearsOfSellingExperience,
      }),
      ...(formData.otherPlatformsSoldOn && {
        otherPlatformsSoldOn: formData.otherPlatformsSoldOn,
      }),
    };

    console.log("Attempting to create seller profile with payload:", payload);
    // Call the mutate function from useCreateIndividualSellerProfile
    createSellerProfile(payload);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h2>Apply to Be an Individual Seller</h2>
      {message.type === "error" && <ErrorMessage>{message.text}</ErrorMessage>}
      {message.type === "success" && (
        <SuccessMessage>{message.text}</SuccessMessage>
      )}
      {isPending && <p>Submitting your application...</p>}{" "}
      {/* Show loading indicator */}
      {/* SECTION 1: Personal Information */}
      <FormSectionTitle>1. Personal Information</FormSectionTitle>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="legalFirstName">Legal First Name:</StyledLabel>
          <StyledInput
            type="text"
            id="legalFirstName"
            name="legalFirstName"
            value={formData.legalFirstName}
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="legalLastName">Legal Last Name:</StyledLabel>
          <StyledInput
            type="text"
            id="legalLastName"
            name="legalLastName"
            value={formData.legalLastName}
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="dateOfBirth">Date of Birth:</StyledLabel>
          <StyledInput
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={
              formData.dateOfBirth
                ? formData.dateOfBirth.toISOString().split("T")[0]
                : ""
            }
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="citizenshipCountry">
            Citizenship Country:
          </StyledLabel>
          <StyledInput
            type="text"
            id="citizenshipCountry"
            name="citizenshipCountry"
            value={formData.citizenshipCountry}
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </FormField>
      </FormRow>
      <FormField>
        <StyledLabel htmlFor="taxIdentificationNumber">
          Tax Identification Number (TIN/SSN/EIN):
        </StyledLabel>
        <StyledInput
          type="text"
          id="taxIdentificationNumber"
          name="taxIdentificationNumber"
          value={formData.taxIdentificationNumber}
          onChange={handleChange}
          required
          disabled={isPending}
        />
      </FormField>
      {/* SECTION 2: Contact & Display Information */}
      <FormSectionTitle>2. Contact & Display Information</FormSectionTitle>
      <FormField>
        <StyledLabel htmlFor="sellerName">Seller Display Name:</StyledLabel>
        <StyledInput
          type="text"
          id="sellerName"
          name="sellerName"
          value={formData.sellerName}
          onChange={handleChange}
          required
          disabled={isPending}
        />
      </FormField>
      <FormField>
        <StyledLabel htmlFor="phoneNumber">Phone Number:</StyledLabel>
        <StyledInput
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          disabled={isPending}
        />
      </FormField>
      <FormSectionTitle>Address</FormSectionTitle>
      <FormField>
        <StyledLabel htmlFor="address-street">Street Address:</StyledLabel>
        <StyledInput
          type="text"
          id="address-street"
          name="address.street"
          value={formData.address.street}
          onChange={handleChange}
          required
          disabled={isPending}
        />
      </FormField>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="address-city">City:</StyledLabel>
          <StyledInput
            type="text"
            id="address-city"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="address-state">State/Province:</StyledLabel>
          <StyledInput
            type="text"
            id="address-state"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="address-zip">Zip/Postal Code:</StyledLabel>
          <StyledInput
            type="text"
            id="address-zip"
            name="address.zip"
            value={formData.address.zip}
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="address-country">Country:</StyledLabel>
          <StyledInput
            type="text"
            id="address-country"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </FormField>
      </FormRow>
      {/* SECTION 3: Payout Preferences */}
      <FormSectionTitle>3. Payout Preferences</FormSectionTitle>
      <FormField>
        <StyledLabel htmlFor="payoutMethodPreference">
          Preferred Payout Method:
        </StyledLabel>
        <StyledSelect
          id="payoutMethodPreference"
          name="payoutMethodPreference"
          value={formData.payoutMethodPreference}
          onChange={handleChange}
          required
          disabled={isPending}
        >
          <option value="">Select Method</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="paypal">PayPal</option>
          {/* Add other options as needed */}
        </StyledSelect>
      </FormField>
      {formData.payoutMethodPreference === "bank_transfer" && (
        <>
          <FormField>
            <StyledLabel htmlFor="bankAccountHolderName">
              Bank Account Holder Name:
            </StyledLabel>
            <StyledInput
              type="text"
              id="bankAccountHolderName"
              name="bankAccountHolderName"
              value={formData.bankAccountHolderName}
              onChange={handleChange}
              required={formData.payoutMethodPreference === "bank_transfer"}
              disabled={isPending}
            />
          </FormField>
          <FormRow>
            <FormField>
              <StyledLabel htmlFor="bankAccountNumber">
                Bank Account Number:
              </StyledLabel>
              <StyledInput
                type="text"
                id="bankAccountNumber"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleChange}
                required={formData.payoutMethodPreference === "bank_transfer"}
                disabled={isPending}
              />
            </FormField>
            <FormField>
              <StyledLabel htmlFor="bankRoutingNumber">
                Bank Routing Number:
              </StyledLabel>
              <StyledInput
                type="text"
                id="bankRoutingNumber"
                name="bankRoutingNumber"
                value={formData.bankRoutingNumber}
                onChange={handleChange}
                required={formData.payoutMethodPreference === "bank_transfer"}
                disabled={isPending}
              />
            </FormField>
          </FormRow>
        </>
      )}
      {/* SECTION 4: Business Details (Optional) */}
      <FormSectionTitle>4. Business Details (Optional)</FormSectionTitle>
      <FormField>
        <StyledLabel htmlFor="briefDescription">
          Brief Description of Your Products/Business:
        </StyledLabel>
        <StyledTextArea
          id="briefDescription"
          name="briefDescription"
          value={formData.briefDescription}
          onChange={handleChange}
          disabled={isPending}
        />
      </FormField>
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
          disabled={isPending}
        >
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Home & Kitchen">Home & Kitchen</option>
          <option value="Books">Books</option>
          <option value="Sports & Outdoors">Sports & Outdoors</option>
          <option value="Health & Beauty">Health & Beauty</option>
          {/* Add more categories as needed */}
        </StyledSelect>
      </FormField>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="estimatedMonthlySales">
            Estimated Monthly Sales (USD):
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
            disabled={isPending}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="yearsOfSellingExperience">
            Years of Selling Experience:
          </StyledLabel>
          <StyledInput
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
            disabled={isPending}
          />
        </FormField>
      </FormRow>
      <FormField>
        <StyledLabel htmlFor="otherPlatformsSoldOn">
          Other Platforms You've Sold On:
        </StyledLabel>
        <StyledInput
          type="text"
          id="otherPlatformsSoldOn"
          name="otherPlatformsSoldOn"
          value={formData.otherPlatformsSoldOn}
          onChange={handleChange}
          placeholder="e.g., Etsy, eBay, Shopify"
          disabled={isPending}
        />
      </FormField>



      
      {/* SECTION 5: Terms and Agreements */}
      <FormSectionTitle>5. Terms and Agreements</FormSectionTitle>
      <CheckboxContainer>
        <input
          type="checkbox"
          id="agreedToTerms"
          name="agreedToTerms"
          checked={formData.agreedToTerms}
          onChange={handleCheckboxChange}
          required
          disabled={isPending}
        />
        <label htmlFor="agreedToTerms">
          I agree to the{" "}
          <a href="#" target="_blank" rel="noopener noreferrer">
            Terms and Conditions
          </a>
        </label>
      </CheckboxContainer>
      <CheckboxContainer>
        <input
          type="checkbox"
          id="agreedToPrivacyPolicy"
          name="agreedToPrivacyPolicy"
          checked={formData.agreedToPrivacyPolicy}
          onChange={handleCheckboxChange}
          required
          disabled={isPending}
        />
        <label htmlFor="agreedToPrivacyPolicy">
          I agree to the{" "}
          <a href="#" target="_blank" rel="noopener noreferrer">
            Privacy Policy
          </a>
        </label>
      </CheckboxContainer>
      <SubmitButton type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Seller Application"}
      </SubmitButton>
    </StyledForm>
  );
}

export default IndividualSellerApplicationForm;

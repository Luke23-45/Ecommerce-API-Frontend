import { useEditableSellerProfile } from "@/api/seller/sellerApi";
import type { IAddress, IIndividualSellerProfileUpdate } from "@/types/seller";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FormRow,
  StyledSelect,
} from "./IndividualSellerApplicationForm.styled";
import {
  useGetIndividualSellerProfile,
  useUpdateIndividualSellerProfile,
} from "@/hooks/useIndividualSeller";

function UpdateIndividualSellerUpdate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IIndividualSellerProfileUpdate>({
    sellerName: "",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    briefDescription: "",
    payoutMethodPreference: "",
    bankAccountHolderName: "",
    bankRoutingNumber: "",
    bankAccountNumber: "",
    primaryProductCategories: [],
    estimatedMonthlySales: 0,
    yearsOfSellingExperience: 0,
    otherPlatformsSoldOn: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    data: fetchedProfile,
    isError: sellerFectchError,
    isLoading: sellerDataLoading,
    error: sellerDataGettingError,
  } = useGetIndividualSellerProfile();

  const {
    mutate: updateSellerProfile,
    isPending: isLoading,
    isSuccess: updateSuccess,
    isError: updateError,
    error: updateErrorObj,
  } = useUpdateIndividualSellerProfile();

  useEffect(() => {
    if (fetchedProfile) {
      setFormData({
        sellerName: fetchedProfile.sellerName || "",
        phoneNumber: fetchedProfile.phoneNumber || "",
        address: {
          street: fetchedProfile.address?.street || "",
          city: fetchedProfile.address?.city || "",
          state: fetchedProfile.address?.state || "",
          zip: fetchedProfile.address?.zip || "",
          country: fetchedProfile.address?.country || "",
        },
        briefDescription: fetchedProfile.briefDescription || "",
        payoutMethodPreference: fetchedProfile.payoutMethodPreference || "",
        bankAccountHolderName: fetchedProfile.bankAccountHolderName || "",
        bankRoutingNumber: fetchedProfile.bankRoutingNumber || "",
        bankAccountNumber: fetchedProfile.bankAccountNumber || "",
        primaryProductCategories: fetchedProfile.primaryProductCategories || [],
        estimatedMonthlySales: fetchedProfile.estimatedMonthlySales,
        yearsOfSellingExperience: fetchedProfile.yearsOfSellingExperience,
        otherPlatformsSoldOn: fetchedProfile.otherPlatformsSoldOn || "",
      });
    }
  }, [fetchedProfile]);

  useEffect(() => {
    if (updateSuccess) {
      setMessage({
        type: "success",
        text: "Seller application updated successfully!",
      });
      // Optionally reset form after successful submission
      // setFormData( /* reset to initial empty state or default values */ );
    }
    if (updateError) {
      // Error could be an instance of Error or ApiResponse<IIndividualSellerProfile> with success: false
      const errorMessage =
        updateErrorObj?.message ||
        "Failed to submit seller application. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    }
  }, [updateSuccess, updateError, updateErrorObj]);

  if (sellerDataLoading) return <div>Loading seller profile...</div>;
  if (sellerFectchError)
    return (
      <ErrorMessage>
        Error loading seller profile: {sellerDataGettingError?.message}
      </ErrorMessage>
    );
  if (!fetchedProfile)
    return <ErrorMessage>Seller profile not found.</ErrorMessage>;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const payload: Partial<IIndividualSellerProfileUpdate> = {
      sellerName: formData.sellerName,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      payoutMethodPreference: formData.payoutMethodPreference,

      ...(formData.bankAccountHolderName && {
        bankAccountHolderName: formData.bankAccountHolderName,
      }),
      ...(formData.bankAccountNumber && {
        bankAccountNumber: formData.bankAccountNumber,
      }),
      ...(formData.bankRoutingNumber && {
        bankRoutingNumber: formData.bankRoutingNumber,
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
    updateSellerProfile(payload);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <h2>Upating the sellerProfile</h2>
      {message?.type === "error" && <ErrorMessage>{message.text}</ErrorMessage>}
      {message?.type == "success" && (
        <SuccessMessage>{message.text}</SuccessMessage>
      )}
      {isLoading && <p>Updating your application!</p>}

      <FormSectionTitle>1.Contact & Display Information</FormSectionTitle>

      <FormField>
        <StyledLabel htmlFor="sellerName">Seller Display Name:</StyledLabel>
        <StyledInput
          type="text"
          id="sellerName"
          name="sellerName"
          value={formData.sellerName || ""}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </FormField>
      <FormField>
        <StyledLabel htmlFor="phoneNumber">Phone Number:</StyledLabel>
        <StyledInput
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber || ""}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </FormField>
      <FormSectionTitle>Address</FormSectionTitle>
      <FormField>
        <StyledLabel htmlFor="address-street">Street Address:</StyledLabel>
        <StyledInput
          type="text"
          id="address-street"
          name="address.street"
          value={formData.address.street || ""}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </FormField>
      <FormRow>
        <FormField>
          <StyledLabel htmlFor="address-city">City:</StyledLabel>
          <StyledInput
            type="text"
            id="address-city"
            name="address.city"
            value={formData.address.city || ""}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="address-state">State/Province:</StyledLabel>
          <StyledInput
            type="text"
            id="address-state"
            name="address.state"
            value={formData.address.state || ""}
            onChange={handleChange}
            required
            disabled={isLoading}
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
            value={formData.address.zip || ""}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </FormField>
        <FormField>
          <StyledLabel htmlFor="address-country">Country:</StyledLabel>
          <StyledInput
            type="text"
            id="address-country"
            name="address.country"
            value={formData.address.country || ""}
            onChange={handleChange}
            required
            disabled={isLoading}
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
          value={formData.payoutMethodPreference || ""}
          onChange={handleChange}
          required
          disabled={isLoading}
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
              value={formData.bankAccountHolderName || ""}
              onChange={handleChange}
              required={formData.payoutMethodPreference === "bank_transfer"}
              disabled={isLoading}
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
                value={formData.bankAccountNumber || ""}
                onChange={handleChange}
                required={formData.payoutMethodPreference === "bank_transfer"}
                disabled={isLoading}
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
                value={formData.bankRoutingNumber || ""}
                onChange={handleChange}
                required={formData.payoutMethodPreference === "bank_transfer"}
                disabled={isLoading}
              />
            </FormField>
          </FormRow>
        </>
      )}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
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
          disabled={isLoading}
        />
      </FormField>

      <SubmitButton type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Seller Application"}
      </SubmitButton>
    </StyledForm>
  );
}

export default UpdateIndividualSellerUpdate;

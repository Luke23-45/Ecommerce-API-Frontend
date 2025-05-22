import type { IAddress } from "@/types/seller";
import { type updateVendorProfileUpdateFields } from "@/types/vendor";
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
} from "@/components/seller/IndividualSellerApplicationForm.styled";

import { useGetVendorProfile, useUpdateVendorProfile } from "@/hooks/useVendor";

function UpdateVendorProfile() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<updateVendorProfileUpdateFields>({
    companyName: "",
    companyAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
    contactPersonFirstName: "",
    contactPersonLastName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    contactPersonRole: "",
    website: "",
    yearEstablished: new Date().getFullYear(),
    primaryProductCategories: [],
    estimatedMonthlySales: 0,
    businessRegistrationDocumentUrl: "",
    taxCertificateUrl: "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    data: fetchedProfile,
    isError: vendorFectchError,
    isLoading: vendorDataLoading,
    error: vendorDataGettingError,
  } = useGetVendorProfile();

  const {
    mutate: updateVendorProfile,
    isPending: isLoading,
    isSuccess: updateSuccess,
    isError: updateError,
    error: updateErrorObj,
  } = useUpdateVendorProfile();

  useEffect(() => {
    if (fetchedProfile) {
      setFormData({
        companyName: fetchedProfile.companyName || "",
        companyAddress: {
          street: fetchedProfile.companyAddress.street || "",
          city: fetchedProfile.companyAddress.city || "",
          state: fetchedProfile.companyAddress.state || "",
          zip: fetchedProfile.companyAddress.zip || "",
          country: fetchedProfile.companyAddress.country || "",
        },
        contactPersonFirstName: fetchedProfile.contactPersonFirstName || "",
        contactPersonLastName: fetchedProfile.contactPersonLastName || "",
        contactPersonEmail: fetchedProfile.contactPersonEmail || "",
        contactPersonPhone: fetchedProfile.contactPersonPhone || "",
        contactPersonRole: fetchedProfile.contactPersonRole || "",
        website: fetchedProfile.website || "",
        yearEstablished: fetchedProfile.yearEstablished || new Date(),
        primaryProductCategories: fetchedProfile.primaryProductCategories || [],
        estimatedMonthlySales: fetchedProfile.estimatedMonthlySales || 0,
        businessRegistrationDocumentUrl:
          fetchedProfile.businessRegistrationDocumentUrl || "",
        taxCertificateUrl: fetchedProfile.taxCertificateUrl || "",
      });
    }
  }, [fetchedProfile]);

  useEffect(() => {
    if (updateSuccess) {
      setMessage({
        type: "success",
        text: "Seller application updated successfully!",
      });
    }
    if (updateError) {
      const errorMessage =
        updateErrorObj?.message ||
        "Failed to submit seller application. Please try again.";
      setMessage({ type: "error", text: errorMessage });
    }
  }, [updateSuccess, updateError, updateErrorObj]);

  if (vendorDataLoading) return <div>Loading vendor profile...</div>;
  if (vendorFectchError)
    return (
      <ErrorMessage>
        Error loading vendor profile: {vendorDataGettingError?.message}
      </ErrorMessage>
    );
  if (!fetchedProfile)
    return <ErrorMessage>vendor profile not found.</ErrorMessage>;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.startsWith("companyAddress.")) {
      const addressField = name.split(".")[1] as keyof IAddress;
      setFormData((prev) => ({
        ...prev,
        companyAddress: {
          ...prev.companyAddress,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    let validationErrors: string[] = [];

    if (!formData.companyName.trim())
      validationErrors.push("Company Name is required.");

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
      isNaN(formData.yearEstablished)
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


    if (validationErrors.length > 0) {
      setMessage({ type: "error", text: validationErrors.join(" ") });
      return;
    }

    const payload: any = {
      companyName: formData.companyName,
      companyAddress: formData.companyAddress,
      contactPersonFirstName: formData.contactPersonFirstName,
      contactPersonLastName: formData.contactPersonLastName,
      contactPersonEmail: formData.contactPersonEmail,
      contactPersonPhone: formData.contactPersonPhone,
      contactPersonRole: formData.contactPersonRole,
      primaryProductCategories: formData.primaryProductCategories,
      businessRegistrationDocumentUrl: formData.businessRegistrationDocumentUrl,
      taxCertificateUrl: formData.taxCertificateUrl,

      ...(formData.website && { website: formData.website }),
      ...(formData.yearEstablished && {
        yearEstablished: formData.yearEstablished,
      }),
      ...(formData.estimatedMonthlySales !== undefined && {
        estimatedMonthlySales: formData.estimatedMonthlySales,
      }),
    };

    console.log("Attempting to create vendor profile with payload:", payload);
    updateVendorProfile(payload);
  };

  
}

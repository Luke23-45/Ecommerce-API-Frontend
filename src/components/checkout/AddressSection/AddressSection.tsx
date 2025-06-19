// src/components/checkout/AddressSection/AddressSection.tsx
import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCheck, FaPlus, FaSpinner } from "react-icons/fa";
import { useTheme } from "styled-components";

// --- React Query Hooks ---
import {
  useGetAddresses,
  useCreateAddress,
} from "@/hooks/general/useCheckout"; // VERIFY PATH (e.g., @/hooks/checkout/useCheckout)

// --- Styled Components ---
import {
  AddressSectionWrapper,
  AddressSectionTitle,
  AddressList,
  AddressCard,
  AddressContent,
  DefaultBadge,
  SelectionIndicator,
  AddNewAddressToggleWrapper,
  ToggleAddressFormButton,
  AddressFormWrapper,
  FormActions,
  SameAsShippingWrapper,
  StyledFormLabel,
  StyledInput,
} from "./AddressSection.styles";

// --- Common UI Components ---
// CRITICAL: Replace with your actual common, themed button components
// import {
//   PrimaryButton as PrimaryCtaButton,
//   SecondaryButton,
// } from "@/components/common/Button/Button"; // EXAMPLE COMMON PATH
import { FieldGroup } from "@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles"; // VERIFY PATH
// import AdminCheckbox from "@/components/common/AdminCheckbox/AdminCheckbox"; // VERIFY PATH & STYLING
import AdminCheckbox from "@/components/admin/common/AdminCheckbox/AdminCheckbox";
import { PrimaryCtaButton } from "@/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles";

import { SecondaryButton } from "@/components/auth/AuthForms";
import { useNotification } from "@/contexts/NotificationContext";
// --- Type Definitions ---
// This interface should match the structure of an address object returned by useGetAddresses
// and expected by onSelectAddress. Uses _id from backend.
export interface Address {
  _id: string;
  userId?: string;
  name?: string; // Address label/nickname, e.g., "Home", "Work"
  firstName?: string;
  lastName?: string;
  street: string;
  apartment?: string; // Was street2, renamed to match validator
  city: string;
  state: string; // Backend validator requires if present
  zipCode: string; // Matched to validator (was zip)
  country: string; // Backend validator requires
  phone?: string; // Backend validator requires
  email?: string; // Optional, allowed by validator
  isDefault?: boolean; // For setting default address, allowed by validator
  // These are typically for display if the backend differentiates default types
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

// State for the new address form, aligns with AddressCreationDto and backend validator
interface AddressCreationFormState {
  name: string; // Address label/nickname
  firstName: string;
  lastName: string;
  street: string;
  apartment: string; // Optional
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string; // Optional, but part of form
  isDefault: boolean; // Option to set as default
}

interface AddressSectionProps {
  titleText: string;
  selectedAddress: Address | null;
  onSelectAddress: (address: Address | null) => void;
  isBillingSection: boolean;
  canUseShippingAsBilling?: boolean;
  shippingAddressForBilling?: Address | null;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  titleText,
  selectedAddress,
  onSelectAddress,
  isBillingSection,
  canUseShippingAsBilling,
  shippingAddressForBilling,
}) => {
  const theme = useTheme();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [useShippingForBillingLocal, setUseShippingForBillingLocal] = useState(
    isBillingSection &&
      canUseShippingAsBilling &&
      !!shippingAddressForBilling &&
      selectedAddress?._id === shippingAddressForBilling?._id
  );

  const initialFormState: AddressCreationFormState = {
    name: "",
    firstName: "",
    lastName: "",
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US", // Default country to US
    phone: "",
    email: "",
    isDefault: false,
  };
  const [newAddressForm, setNewAddressForm] =
    useState<AddressCreationFormState>(initialFormState);

  const {
    data: fetchedAddresses,
    isLoading: isLoadingAddresses,
    error: addressesError,
  } = useGetAddresses();
  const addressesToDisplay = fetchedAddresses || [];
  const { mutate: createAddress, isLoading: isCreatingAddress } =
    useCreateAddress();


    const { showNotification } = useNotification(); 

  useEffect(() => {
    if (isBillingSection && canUseShippingAsBilling) {
      if (useShippingForBillingLocal && shippingAddressForBilling) {
        onSelectAddress(shippingAddressForBilling);
        if (showNewAddressForm) setShowNewAddressForm(false);
      } else if (
        !useShippingForBillingLocal &&
        selectedAddress?._id === shippingAddressForBilling?._id
      ) {
        onSelectAddress(null);
      }
    }
  }, [
    isBillingSection,
    useShippingForBillingLocal,
    shippingAddressForBilling,
    onSelectAddress,
    canUseShippingAsBilling,
    selectedAddress?._id,
    showNewAddressForm,
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setNewAddressForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setOperationError(null); // Clear previous errors

    // Client-side validation based on backend validator
    const errors: string[] = [];
    const requiredFields: (keyof Pick<
      AddressCreationFormState,
      | "firstName"
      | "lastName"
      | "street"
      | "city"
      | "zipCode"
      | "country"
      | "phone"
    >)[] = [
      "firstName",
      "lastName",
      "street",
      "city",
      "zipCode",
      "country",
      "phone",
    ];

    for (const field of requiredFields) {
      if (
        !newAddressForm[field] ||
        String(newAddressForm[field]).trim() === ""
      ) {
        errors.push(
          `'${field.replace(/([A-Z])/g, " $1").toLowerCase()}' is required.`
        );
      }
    }
    if (
      newAddressForm.email &&
      !/\S+@\S+\.\S+/.test(newAddressForm.email.trim())
    ) {
      errors.push("Please provide a valid email address.");
    }
    if (newAddressForm.state && newAddressForm.state.length > 100) {
      errors.push("'State / Province' must be at most 100 characters.");
    }
    if (newAddressForm.apartment && newAddressForm.apartment.length > 100) {
      errors.push("'Apartment, suite, etc.' must be at most 100 characters.");
    }
    if (newAddressForm.name && newAddressForm.name.length > 50) {
      errors.push("'Address Label' must be at most 50 characters.");
    }
    // Add more specific validations for phone, zipCode format if needed

    if (errors.length > 0) {
      // TODO: Replace with a more user-friendly notification system that displays all errors
      // For now, using a local state for form-specific error
      setOperationError("Validation Errors:\n- " + errors.join("\n- "));
      // alert("Validation Errors:\n- " + errors.join("\n- "));
      return;
    }

    // DTO to send to backend, must match AddressCreationDto
    const addressCreationDtoPayload: any = {
      // Cast to any for flexibility, but DTO type should be precise
      firstName: newAddressForm.firstName.trim(),
      lastName: newAddressForm.lastName.trim(),
      street: newAddressForm.street.trim(),
      city: newAddressForm.city.trim(),
      zipCode: newAddressForm.zipCode.trim(), // Use zipCode
      country: newAddressForm.country.trim(), // Should be a country code like 'US'
      phone: newAddressForm.phone.trim(),
    };
    if (newAddressForm.apartment.trim())
      addressCreationDtoPayload.apartment = newAddressForm.apartment.trim();
    if (newAddressForm.state.trim())
      addressCreationDtoPayload.state = newAddressForm.state.trim();
    if (newAddressForm.name.trim())
      addressCreationDtoPayload.name = newAddressForm.name.trim();
    if (newAddressForm.email.trim())
      addressCreationDtoPayload.email = newAddressForm.email.trim();
    if (typeof newAddressForm.isDefault === "boolean")
      addressCreationDtoPayload.isDefault = newAddressForm.isDefault;

    createAddress(addressCreationDtoPayload, {
      onSuccess: (savedAddressData: Address) => {
        onSelectAddress(savedAddressData);
        setShowNewAddressForm(false);
        setNewAddressForm(initialFormState);
        setOperationError(null); // Clear any previous form errors
      },
      onError: (error: any) => {
        // Notification already handled by useCreateAddress hook's onError
        // Set local error for form display if needed
        setOperationError(
          error?.response?.data?.message ||
            error.message ||
            "Failed to save address."
        );
      },
    });
  };
  const [operationError, setOperationError] = useState<string | null>(null);

  const handleCardClick = (address: Address) => {
    setOperationError(null); // Clear errors when user makes a selection
    onSelectAddress(address);
    if (isBillingSection && canUseShippingAsBilling) {
      setUseShippingForBillingLocal(
        address._id === shippingAddressForBilling?._id
      );
    }
  };

  const handleToggleNewAddressForm = () => {
    setOperationError(null); // Clear errors when toggling form
    setShowNewAddressForm((prev) => {
      const willOpenForm = !prev;
      if (willOpenForm) {
        setNewAddressForm(initialFormState); // Reset form when opening
        if (isBillingSection) {
          setUseShippingForBillingLocal(false);
          if (selectedAddress?._id === shippingAddressForBilling?._id) {
            onSelectAddress(null);
          }
        }
      }
      return willOpenForm;
    });
  };

  // --- Render Loading State ---
  if (isLoadingAddresses) {
    return (
      <AddressSectionWrapper>
        {" "}
        <AddressSectionTitle>
          <FaMapMarkerAlt className="icon" /> {titleText}
        </AddressSectionTitle>{" "}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: theme.spacing(10),
          }}
        >
          <FaSpinner
            style={{
              fontSize: "2rem",
              animation: "spin 1s linear infinite",
              color: theme.colors.accent1,
            }}
          />
        </div>{" "}
      </AddressSectionWrapper>
    );
  }

  // --- Render Error State for Fetching Addresses ---
  if (addressesError) {
    return (
      <AddressSectionWrapper>
        {" "}
        <AddressSectionTitle>
          <FaMapMarkerAlt className="icon" /> {titleText}
        </AddressSectionTitle>{" "}
        <p style={{ color: theme.colors.error, textAlign: "center" }}>
          Could not load addresses: {addressesError.message}. Please try again.
        </p>{" "}
      </AddressSectionWrapper>
    );
  }

  // --- Main Render ---
  return (
    <AddressSectionWrapper>
      <AddressSectionTitle>
        <FaMapMarkerAlt className="icon" /> {titleText}
      </AddressSectionTitle>
      {isBillingSection && canUseShippingAsBilling && (
        <SameAsShippingWrapper>
          <AdminCheckbox
            id={`useShippingForBilling-${
              isBillingSection ? "Billing" : "Shipping"
            }`}
            label="My billing address is the same as my shipping address"
            checked={useShippingForBillingLocal}
            onChange={(e) => {
              setUseShippingForBillingLocal(e.target.checked);
              setOperationError(null);
            }}
            disabled={!shippingAddressForBilling || isCreatingAddress}
          />
          {useShippingForBillingLocal && !shippingAddressForBilling && (
            <p
              style={{
                color: theme.colors.error,
                fontSize: "0.8rem",
                marginTop: theme.spacing(1),
              }}
            >
              Please select or add a shipping address first.
            </p>
          )}
        </SameAsShippingWrapper>
      )}

      {!(
        isBillingSection &&
        useShippingForBillingLocal &&
        shippingAddressForBilling
      ) && (
        <>
          {addressesToDisplay.length > 0 ? (
            <AddressList>
              {addressesToDisplay.map((address) => (
                <AddressCard
                  key={address._id}
                  $isSelected={selectedAddress?._id === address._id}
                  $isSelectable={!isCreatingAddress}
                  onClick={() => !isCreatingAddress && handleCardClick(address)}
                  role="radio"
                  aria-checked={selectedAddress?._id === address._id}
                  tabIndex={isCreatingAddress ? -1 : 0}
                  onKeyPress={(e) => {
                    if (
                      !isCreatingAddress &&
                      (e.key === "Enter" || e.key === " ")
                    ) {
                      e.preventDefault();
                      handleCardClick(address);
                    }
                  }}
                >
                  {selectedAddress?._id === address._id && (
                    <SelectionIndicator>
                      <FaCheck />
                    </SelectionIndicator>
                  )}
                  <AddressContent>
                    <strong>
                      {address.name ||
                        `${address.firstName || ""} ${
                          address.lastName || ""
                        }`.trim() ||
                        "N/A"}
                    </strong>
                    <span>{address.street || "N/A"}</span>
                    {address.apartment && <span>{address.apartment}</span>}
                    <span>{`${address.city || "N/A"}, ${
                      address.state || "N/A"
                    } ${address.zipCode || "N/A"}`}</span>
                    <span>{address.country || "N/A"}</span>
                    {address.phone && <span>{address.phone}</span>}
                    {address.email && (
                      <span
                        style={{
                          fontSize: theme.typography.body.sizes.xsmall,
                          color: theme.colors.textMuted,
                        }}
                      >
                        Email: {address.email}
                      </span>
                    )}
                  </AddressContent>
                  {address.isDefaultShipping && !isBillingSection && (
                    <DefaultBadge>Default Shipping</DefaultBadge>
                  )}
                  {address.isDefaultBilling && isBillingSection && (
                    <DefaultBadge>Default Billing</DefaultBadge>
                  )}
                  {address.isDefault && (
                    <DefaultBadge>
                      {isBillingSection
                        ? "Default Billing"
                        : "Default Shipping"}
                    </DefaultBadge>
                  )}
                </AddressCard>
              ))}
            </AddressList>
          ) : (
            !showNewAddressForm && (
              <p
                style={{
                  marginBottom: theme.spacing(3),
                  color: theme.colors.textMedium,
                  textAlign: "center",
                }}
              >
                You have no saved addresses. Feel free to add one!
              </p>
            )
          )}

          <AddNewAddressToggleWrapper>
            <ToggleAddressFormButton
              type="button"
              onClick={handleToggleNewAddressForm}
              disabled={isCreatingAddress}
            >
              <FaPlus style={{ marginRight: theme.spacing(1.5) }} />{" "}
              {showNewAddressForm ? "Cancel" : "Add New Address"}
            </ToggleAddressFormButton>
          </AddNewAddressToggleWrapper>

          <AddressFormWrapper $isOpen={showNewAddressForm}>
            <form onSubmit={handleSaveNewAddress}>
              <FieldGroup style={{ gridColumn: "1 / span 2" }}>
                <StyledFormLabel htmlFor={`addressName-${isBillingSection}`}>
                  Address Label{" "}
                  <span
                    style={{
                      fontWeight: "normal",
                      color: theme.colors.textMuted,
                    }}
                  >
                    (e.g., Home, Work)
                  </span>
                </StyledFormLabel>
                <StyledInput
                  id={`addressName-${isBillingSection}`}
                  name="name"
                  type="text"
                  value={newAddressForm.name}
                  onChange={handleInputChange}
                  placeholder="Optional nickname for this address"
                  disabled={isCreatingAddress}
                  maxLength={50}
                />
              </FieldGroup>
              <FieldGroup>
                <StyledFormLabel htmlFor={`firstName-${isBillingSection}`}>
                  First Name *
                </StyledFormLabel>
                <StyledInput
                  id={`firstName-${isBillingSection}`}
                  name="firstName"
                  type="text"
                  value={newAddressForm.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                  disabled={isCreatingAddress}
                />
              </FieldGroup>
              <FieldGroup>
                <StyledFormLabel htmlFor={`lastName-${isBillingSection}`}>
                  Last Name *
                </StyledFormLabel>
                <StyledInput
                  id={`lastName-${isBillingSection}`}
                  name="lastName"
                  type="text"
                  value={newAddressForm.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                  disabled={isCreatingAddress}
                />
              </FieldGroup>
              <FieldGroup style={{ gridColumn: "1 / span 2" }}>
                <StyledFormLabel htmlFor={`street-${isBillingSection}`}>
                  Street Address *
                </StyledFormLabel>
                <StyledInput
                  id={`street-${isBillingSection}`}
                  name="street"
                  type="text"
                  value={newAddressForm.street}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Élan Avenue"
                  required
                  disabled={isCreatingAddress}
                />
              </FieldGroup>
              <FieldGroup style={{ gridColumn: "1 / span 2" }}>
                <StyledFormLabel htmlFor={`apartment-${isBillingSection}`}>
                  Apartment, suite, etc. (Optional)
                </StyledFormLabel>
                <StyledInput
                  id={`apartment-${isBillingSection}`}
                  name="apartment"
                  type="text"
                  value={newAddressForm.apartment}
                  onChange={handleInputChange}
                  placeholder="e.g., Apt. 101"
                  disabled={isCreatingAddress}
                  maxLength={100}
                />
              </FieldGroup>
              <FieldGroup>
                <StyledFormLabel htmlFor={`city-${isBillingSection}`}>
                  City *
                </StyledFormLabel>
                <StyledInput
                  id={`city-${isBillingSection}`}
                  name="city"
                  type="text"
                  value={newAddressForm.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Willow Creek"
                  required
                  disabled={isCreatingAddress}
                />
              </FieldGroup>
              <FieldGroup>
                <StyledFormLabel htmlFor={`state-${isBillingSection}`}>
                  State / Province *
                </StyledFormLabel>
                <StyledInput
                  id={`state-${isBillingSection}`}
                  name="state"
                  type="text"
                  value={newAddressForm.state}
                  onChange={handleInputChange}
                  placeholder="e.g., CA or California"
                  required
                  disabled={isCreatingAddress}
                  maxLength={100}
                />
              </FieldGroup>
              <FieldGroup>
                <StyledFormLabel htmlFor={`zipCode-${isBillingSection}`}>
                  ZIP / Postal Code *
                </StyledFormLabel>
                <StyledInput
                  id={`zipCode-${isBillingSection}`}
                  name="zipCode"
                  type="text"
                  value={newAddressForm.zipCode}
                  onChange={handleInputChange}
                  placeholder="e.g., 90210"
                  required
                  disabled={isCreatingAddress}
                />
              </FieldGroup>
              <FieldGroup>
                <StyledFormLabel htmlFor={`country-${isBillingSection}`}>
                  Country *
                </StyledFormLabel>
                {/* TODO: Convert to a Select component for countries. For now, 'US' is default and fixed for simplicity. */}
                <StyledInput
                  id={`country-${isBillingSection}`}
                  name="country"
                  type="text"
                  value={newAddressForm.country}
                  readOnly
                  disabled={isCreatingAddress}
                  style={{ backgroundColor: theme.colors.lightGray }}
                />
              </FieldGroup>
              <FieldGroup style={{ gridColumn: "1 / span 2" }}>
                <StyledFormLabel htmlFor={`phone-${isBillingSection}`}>
                  Phone *{" "}
                  <span
                    style={{
                      fontWeight: "normal",
                      color: theme.colors.textMuted,
                    }}
                  >
                    (For delivery updates)
                  </span>
                </StyledFormLabel>
                <StyledInput
                  id={`phone-${isBillingSection}`}
                  name="phone"
                  type="tel"
                  value={newAddressForm.phone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  required
                  disabled={isCreatingAddress}
                />
              </FieldGroup>
              <FieldGroup style={{ gridColumn: "1 / span 2" }}>
                <StyledFormLabel htmlFor={`email-${isBillingSection}`}>
                  Email (Optional)
                </StyledFormLabel>
                <StyledInput
                  id={`email-${isBillingSection}`}
                  name="email"
                  type="email"
                  value={newAddressForm.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  disabled={isCreatingAddress}
                />
              </FieldGroup>
              <FieldGroup
                style={{ gridColumn: "1 / span 2", alignItems: "center" }}
              >
                <AdminCheckbox
                  id={`isDefaultAddress-${isBillingSection}`}
                  name="isDefault"
                  label={`Set as default ${
                    isBillingSection ? "billing" : "shipping"
                  } address`}
                  checked={newAddressForm.isDefault}
                  onChange={handleInputChange}
                  disabled={isCreatingAddress}
                />
              </FieldGroup>

              {operationError && ( // Display form-specific errors here
                <p
                  style={{
                    gridColumn: "1 / span 2",
                    color: theme.colors.error,
                    textAlign: "center",
                    fontSize: theme.typography.body.sizes.small,
                  }}
                >
                  {operationError}
                </p>
              )}

              <FormActions>
                <SecondaryButton
                  type="button"
                  onClick={() => {
                    setShowNewAddressForm(false);
                    setNewAddressForm(initialFormState);
                    setOperationError(null);
                  }}
                  disabled={isCreatingAddress}
                >
                  Cancel
                </SecondaryButton>
                <PrimaryCtaButton
                  type="submit"
                  isLoading={isCreatingAddress}
                  disabled={isCreatingAddress}
                >
                  {isCreatingAddress ? "Saving..." : "Save Address"}
                </PrimaryCtaButton>
              </FormActions>
            </form>
          </AddressFormWrapper>
        </>
      )}
    </AddressSectionWrapper>
  );
};

export default AddressSection;

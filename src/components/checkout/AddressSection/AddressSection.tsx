// src/components/checkout/AddressSection/AddressSection.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { FaMapMarkerAlt, FaCheck, FaPlus } from 'react-icons/fa';
import { useTheme } from 'styled-components'; // If needed for dynamic styles beyond theme object

// Import local styles (updated)
import {
  AddressSectionWrapper,
  AddressSectionTitle,
  AddressList,
  AddressCard,
  AddressContent,
  DefaultBadge,
  SelectionIndicator,
  AddNewAddressToggleWrapper, // Renamed in styles, let's keep it descriptive if wrapper is distinct
  ToggleAddressFormButton,   // New specific button
  AddressFormWrapper,
  FormActions,
  SameAsShippingWrapper,
  StyledFormLabel,          // Assuming these are now preferred
  StyledInput,              // Assuming these are now preferred
} from './AddressSection.styles';

// Imported button components - ensure these are styled for Élan's premium feel
import { PrimaryCtaButton } from '@/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles'; // Or a common premium button
import { SecondaryButton } from '@/components/auth/AuthForms'; // Or a common premium secondary button

// Assuming FieldGroup is styled elegantly or we style a local version
import { FieldGroup } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';
// Assuming AdminCheckbox is beautifully styled for frontend
import AdminCheckbox from '@/components/admin/common/AdminCheckbox/AdminCheckbox';

// Type definitions (ensure this is consistent with CheckoutPage and mockData)
export interface Address {
  id: string;
  firstName?: string; // Common to have first/last name
  lastName?: string;
  name?: string; // Could be computed from firstName + lastName, or a company name
  street: string;
  street2?: string; // Optional second address line
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string; // Often needed for shipping
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

interface AddressSectionProps {
  titleText: string; // Renamed from 'title' to avoid conflict if 'title' HTML attribute is used
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address | null) => void;
  // onSetValidity?: (isValid: boolean) => void; // Optional: To inform parent about step validity for global continue button

  // For Billing Address specific logic
  isBillingSection: boolean;
  canUseShippingAsBilling?: boolean;
  shippingAddressForBilling?: Address | null;
  // onNewAddressSaved?: (newAddress: Address) => void; // Callback if parent needs to update its address list
}

const AddressSection: React.FC<AddressSectionProps> = ({
  titleText,
  addresses,
  selectedAddress,
  onSelectAddress,
  // onSetValidity,
  isBillingSection,
  canUseShippingAsBilling,
  shippingAddressForBilling,
  // onNewAddressSaved,
}) => {
  const theme = useTheme(); // Available if needed
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  // State for "Use Shipping for Billing" checkbox - only relevant if isBillingSection is true
  const [useShippingForBillingLocal, setUseShippingForBillingLocal] = useState(
    isBillingSection && canUseShippingAsBilling && selectedAddress?.id === shippingAddressForBilling?.id && !!shippingAddressForBilling
  );

  // New address form state
  const initialFormState = {
    firstName: '', lastName: '', street: '', street2: '',
    city: '', state: '', zip: '', country: 'USA', phone: '',
  };
  const [newAddressForm, setNewAddressForm] = useState(initialFormState);

  // Effect to handle "Use Shipping for Billing" behavior
  useEffect(() => {
    if (isBillingSection && canUseShippingAsBilling) {
      if (useShippingForBillingLocal && shippingAddressForBilling) {
        onSelectAddress(shippingAddressForBilling);
        setShowNewAddressForm(false); // Close new address form if open
      } else if (!useShippingForBillingLocal && selectedAddress?.id === shippingAddressForBilling?.id) {
        // If "use shipping" was unchecked and current selected billing IS the shipping address,
        // clear the selection to force user to choose or add a new one.
        onSelectAddress(null);
      }
    }
  }, [
    isBillingSection,
    useShippingForBillingLocal,
    shippingAddressForBilling,
    onSelectAddress,
    canUseShippingAsBilling,
    selectedAddress?.id // Dependency added
  ]);

  // Update validity to parent (basic example, can be more complex)
  // useEffect(() => {
  //   if (onSetValidity) {
  //     if (isBillingSection && useShippingForBillingLocal && shippingAddressForBilling) {
  //       onSetValidity(true);
  //     } else {
  //       onSetValidity(!!selectedAddress);
  //     }
  //   }
  // }, [selectedAddress, onSetValidity, isBillingSection, useShippingForBillingLocal, shippingAddressForBilling]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add form validation here (e.g., using Zod or Yup)
    // In a real app, this would call a useMutation hook to save to backend.
    const newMockAddress: Address = {
      id: `new_${Date.now()}`, // Backend would provide ID
      name: `${newAddressForm.firstName} ${newAddressForm.lastName}`.trim(), // Example: compute name
      ...newAddressForm,
    };

    // Simulate saving and getting back the new address
    // if (onNewAddressSaved) {
    //   onNewAddressSaved(newMockAddress); // Parent can add to its 'addresses' list
    // }
    onSelectAddress(newMockAddress); // Select the newly "saved" address
    setShowNewAddressForm(false);
    setNewAddressForm(initialFormState); // Clear form
  };

  const handleCardClick = (address: Address) => {
    onSelectAddress(address);
    if (isBillingSection) {
      // If user manually selects an address, uncheck "use shipping for billing"
      // unless the selected address *is* the shipping address.
      if (address.id !== shippingAddressForBilling?.id) {
        setUseShippingForBillingLocal(false);
      } else {
        setUseShippingForBillingLocal(true);
      }
    }
  };
  
  const handleToggleNewAddressForm = () => {
    setShowNewAddressForm(prev => !prev);
    if (!showNewAddressForm && isBillingSection) { // If opening the form for billing
        setUseShippingForBillingLocal(false); // Uncheck "use shipping as billing"
        if(selectedAddress?.id === shippingAddressForBilling?.id){
          onSelectAddress(null); // Clear selection if it was "same as shipping"
        }
    }
  };


  return (
    <AddressSectionWrapper>
      <AddressSectionTitle>
        <FaMapMarkerAlt className="icon" /> {titleText}
      </AddressSectionTitle>

      {/* "Use Shipping Address for Billing" Checkbox */}
      {isBillingSection && canUseShippingAsBilling && (
        <SameAsShippingWrapper>
          <AdminCheckbox
            id={`useShippingForBilling-${titleText.replace(/\s+/g, '')}`} // Unique ID
            label="My billing address is the same as my shipping address"
            checked={useShippingForBillingLocal}
            onChange={(e) => setUseShippingForBillingLocal(e.target.checked)}
            disabled={!shippingAddressForBilling} // Disable if no shipping address to use
          />
          {useShippingForBillingLocal && !shippingAddressForBilling && (
            <p style={{color: theme.colors.error, fontSize: '0.8rem', marginTop: theme.spacing(1)}}>
                Please select a shipping address first.
            </p>
          )}
        </SameAsShippingWrapper>
      )}

      {/* Address List and "Add New" button - Hidden if "Use Shipping for Billing" is checked and active */}
      {!(isBillingSection && useShippingForBillingLocal && shippingAddressForBilling) && (
        <>
          <AddressList>
            {addresses.map(address => (
              <AddressCard
                key={address.id}
                $isSelected={selectedAddress?.id === address.id && !(isBillingSection && useShippingForBillingLocal)}
                $isSelectable={true} // All existing addresses are selectable by default
                onClick={() => handleCardClick(address)}
                role="radio"
                aria-checked={selectedAddress?.id === address.id}
                tabIndex={0} // Make cards focusable
                onKeyPress={(e) => { // Accessibility: select with Enter/Space
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCardClick(address);
                    }
                }}
              >
                {selectedAddress?.id === address.id && !(isBillingSection && useShippingForBillingLocal) && (
                  <SelectionIndicator><FaCheck /></SelectionIndicator>
                )}
                <AddressContent>
                  <strong>{address.name || `${address.firstName} ${address.lastName}`}</strong>
                  <span>{address.street}</span>
                  {address.street2 && <span>{address.street2}</span>}
                  <span>{address.city}, {address.state} {address.zip}</span>
                  <span>{address.country}</span>
                  {address.phone && <span>{address.phone}</span>}
                </AddressContent>
                {/* Differentiate default badges more clearly */}
                {address.isDefaultShipping && !isBillingSection && <DefaultBadge>Default Shipping</DefaultBadge>}
                {address.isDefaultBilling && isBillingSection && <DefaultBadge>Default Billing</DefaultBadge>}
              </AddressCard>
            ))}
          </AddressList>

          <AddNewAddressToggleWrapper>
            <ToggleAddressFormButton type="button" onClick={handleToggleNewAddressForm}>
              <FaPlus style={{ marginRight: theme.spacing(1.5) }} />
              {showNewAddressForm ? 'Cancel Adding Address' : 'Add New Address'}
            </ToggleAddressFormButton>
          </AddNewAddressToggleWrapper>

          <AddressFormWrapper $isOpen={showNewAddressForm}>
            <form onSubmit={handleSaveNewAddress}>
              {/* Using FieldGroup and StyledInput/StyledFormLabel */}
              <FieldGroup style={{ gridColumn: '1 / -1' }}> {/* Example: Full Name spans both columns */}
                <StyledFormLabel htmlFor={`firstName-${isBillingSection}`}>First Name</StyledFormLabel>
                <StyledInput id={`firstName-${isBillingSection}`} name="firstName" type="text" value={newAddressForm.firstName} onChange={handleInputChange} placeholder="Recipient's First Name" required />
              </FieldGroup>
              <FieldGroup style={{ gridColumn: '1 / -1' }}>
                <StyledFormLabel htmlFor={`lastName-${isBillingSection}`}>Last Name</StyledFormLabel>
                <StyledInput id={`lastName-${isBillingSection}`} name="lastName" type="text" value={newAddressForm.lastName} onChange={handleInputChange} placeholder="Recipient's Last Name" required />
              </FieldGroup>

              <FieldGroup style={{ gridColumn: '1 / -1' }}>
                <StyledFormLabel htmlFor={`street-${isBillingSection}`}>Street Address</StyledFormLabel>
                <StyledInput id={`street-${isBillingSection}`} name="street" type="text" value={newAddressForm.street} onChange={handleInputChange} placeholder="123 Élan Avenue" required />
              </FieldGroup>
              <FieldGroup style={{ gridColumn: '1 / -1' }}>
                <StyledFormLabel htmlFor={`street2-${isBillingSection}`}>Apartment, suite, etc. (Optional)</StyledFormLabel>
                <StyledInput id={`street2-${isBillingSection}`} name="street2" type="text" value={newAddressForm.street2} onChange={handleInputChange} placeholder="Apt. 101" />
              </FieldGroup>

              <FieldGroup>
                <StyledFormLabel htmlFor={`city-${isBillingSection}`}>City</StyledFormLabel>
                <StyledInput id={`city-${isBillingSection}`} name="city" type="text" value={newAddressForm.city} onChange={handleInputChange} placeholder="Willow Creek" required />
              </FieldGroup>
              <FieldGroup> {/* Consider a Select component for State/Country for better UX */}
                <StyledFormLabel htmlFor={`state-${isBillingSection}`}>State / Province</StyledFormLabel>
                <StyledInput id={`state-${isBillingSection}`} name="state" type="text" value={newAddressForm.state} onChange={handleInputChange} placeholder="California" required />
              </FieldGroup>
              <FieldGroup>
                <StyledFormLabel htmlFor={`zip-${isBillingSection}`}>ZIP / Postal Code</StyledFormLabel>
                <StyledInput id={`zip-${isBillingSection}`} name="zip" type="text" value={newAddressForm.zip} onChange={handleInputChange} placeholder="90210" required />
              </FieldGroup>
              <FieldGroup>
                <StyledFormLabel htmlFor={`country-${isBillingSection}`}>Country</StyledFormLabel>
                <StyledInput id={`country-${isBillingSection}`} name="country" type="text" value={newAddressForm.country} onChange={handleInputChange} placeholder="United States" required readOnly/> {/* Usually selected, not typed freely */}
              </FieldGroup>
               <FieldGroup style={{ gridColumn: '1 / -1' }}>
                <StyledFormLabel htmlFor={`phone-${isBillingSection}`}>Phone (For delivery updates)</StyledFormLabel>
                <StyledInput id={`phone-${isBillingSection}`} name="phone" type="tel" value={newAddressForm.phone} onChange={handleInputChange} placeholder="(555) 123-4567" />
              </FieldGroup>

              <FormActions>
                {/* Ensure SecondaryButton and PrimaryCtaButton are beautifully styled */}
                <SecondaryButton type="button" onClick={() => { setShowNewAddressForm(false); setNewAddressForm(initialFormState);}}>Cancel</SecondaryButton>
                <PrimaryCtaButton type="submit">Save Address</PrimaryCtaButton>
              </FormActions>
            </form>
          </AddressFormWrapper>
        </>
      )}
      
      {/* The old "Continue" button div is removed from here */}

    </AddressSectionWrapper>
  );
};

export default AddressSection;
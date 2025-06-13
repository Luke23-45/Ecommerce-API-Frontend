// src/pages/CheckoutPage/components/AddressSection.tsx

import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaCheck, FaPlus, FaEdit } from 'react-icons/fa';

// Import local styles
import {
  AddressList,
  AddressCard,
  AddressContent,
  DefaultBadge,
  SelectionIndicator,
  AddNewAddressButtonWrapper,
  AddressFormWrapper,
  FormActions,
  SameAsShippingWrapper,
} from './AddressSection.styles';

// Import shared styles & components
import {
  CheckoutSection,
  SectionHeader,
  SectionContent,
  EditLink,
  SectionSummary,
} from '@/pages/CheckoutPage/CheckoutPage.styles';
// import { PrimaryCtaButton, SecondaryButton } from '@/components/common/Button/Button.styles';
import { PrimaryCtaButton } from '@/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles';
import { SecondaryButton } from '@/components/auth/AuthForms';
import { AdminInput } from '@/components/admin/Dashboard/Common/Common.styles'; // Assuming you have AdminInput
import AdminCheckbox from '@/components/admin/common/AdminCheckbox/AdminCheckbox'; // Assuming you have AdminCheckbox
import { FieldGroup, FormLabel } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles'; // Assuming these

// Define the shape of an address object (could come from a shared types file)
interface Address {
  id: string;
  name?: string; // Added for recipient name
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

interface AddressSectionProps {
  title: string;
  addresses: Address[];
  selectedAddress: Address | null;
  onSelectAddress: (address: Address | null) => void;
  isOpen: boolean;
  onToggle: () => void;
  onComplete: () => void;
  isBilling: boolean;
  canUseShippingAsBilling?: boolean;
  shippingAddressForBilling?: Address | null;
}

const AddressSection: React.FC<AddressSectionProps> = ({
  title,
  addresses,
  selectedAddress,
  onSelectAddress,
  isOpen,
  onToggle,
  onComplete,
  isBilling,
  canUseShippingAsBilling,
  shippingAddressForBilling,
}) => {
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [useShippingForBilling, setUseShippingForBilling] = useState(false);

  // New address form state
  const [newName, setNewName] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const [newCountry, setNewCountry] = useState('USA'); // Default

  useEffect(() => {
    // If 'Use Shipping for Billing' is checked and we have a shipping address,
    // automatically select it for billing.
    if (isBilling && useShippingForBilling && shippingAddressForBilling) {
      onSelectAddress(shippingAddressForBilling);
      setShowNewAddressForm(false); // Close new address form if open
    }
  }, [isBilling, useShippingForBilling, shippingAddressForBilling, onSelectAddress]);

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call an API to save the new address.
    // For this static design, we'll just create a mock new address.
    const newMockAddress: Address = {
      id: `new_${Date.now()}`,
      name: newName,
      street: newStreet,
      city: newCity,
      state: newState,
      zip: newZip,
      country: newCountry,
    };
    onSelectAddress(newMockAddress);
    setShowNewAddressForm(false);
    // Clear form fields
    setNewName(''); setNewStreet(''); setNewCity(''); setNewState(''); setNewZip('');
  };

  const summaryText = selectedAddress
    ? `${selectedAddress.name ? selectedAddress.name + ', ' : ''}${selectedAddress.street}, ${selectedAddress.city}`
    : isBilling && useShippingForBilling && shippingAddressForBilling
      ? `Same as Shipping: ${shippingAddressForBilling.street}`
      : `Select ${title}`;

  return (
    <CheckoutSection className={isOpen ? 'is-active' : ''}>
      <SectionHeader onClick={onToggle} $isClickable={true}>
        <h2><FaMapMarkerAlt className="icon" /> {title}</h2>
        {!isOpen && selectedAddress ? (
          <SectionSummary>{summaryText}</SectionSummary>
        ) : !isOpen ? (
            <SectionSummary style={{color: 'red'}}>Required</SectionSummary>
        ) : null}
        {!isOpen && <EditLink onClick={(e) => { e.stopPropagation(); onToggle(); }}>Edit</EditLink>}
      </SectionHeader>

      <SectionContent isOpen={isOpen}>
        {isBilling && canUseShippingAsBilling && (
          <SameAsShippingWrapper>
            <AdminCheckbox
              id="useShippingForBilling"
              label="Use my shipping address for billing"
              checked={useShippingForBilling}
              onChange={(e) => setUseShippingForBilling(e.target.checked)}
            />
          </SameAsShippingWrapper>
        )}

        {!(isBilling && useShippingForBilling) && (
          <>
            <AddressList>
              {addresses.map(address => (
                <AddressCard
                  key={address.id}
                  $isSelected={selectedAddress?.id === address.id}
                  onClick={() => {
                    onSelectAddress(address);
                    if (isBilling) setUseShippingForBilling(false); // Uncheck if manually selecting
                  }}
                >
                  {selectedAddress?.id === address.id && (
                    <SelectionIndicator><FaCheck size="0.8em" /></SelectionIndicator>
                  )}
                  <AddressContent>
                    {address.name && <strong>{address.name}</strong>}
                    <span>{address.street}</span>
                    <span>{address.city}, {address.state} {address.zip}</span>
                    <span>{address.country}</span>
                  </AddressContent>
                  {address.isDefaultShipping && !isBilling && <DefaultBadge>Default Shipping</DefaultBadge>}
                  {address.isDefaultBilling && isBilling && <DefaultBadge>Default Billing</DefaultBadge>}
                </AddressCard>
              ))}
            </AddressList>

            <AddNewAddressButtonWrapper>
              <SecondaryButton type="button" $variant="outline" onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
                <FaPlus /> {showNewAddressForm ? 'Cancel Adding Address' : 'Add New Address'}
              </SecondaryButton>
            </AddNewAddressButtonWrapper>

            <AddressFormWrapper isOpen={showNewAddressForm}>
              <form onSubmit={handleSaveNewAddress}>
                <FieldGroup style={{ gridColumn: 'span 2' }}>
                  <FormLabel htmlFor={`name_${isBilling}`}>Full Name</FormLabel>
                  <AdminInput id={`name_${isBilling}`} type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Recipient's Full Name" />
                </FieldGroup>
                <FieldGroup style={{ gridColumn: 'span 2' }}>
                  <FormLabel htmlFor={`street_${isBilling}`}>Street Address</FormLabel>
                  <AdminInput id={`street_${isBilling}`} type="text" value={newStreet} onChange={e => setNewStreet(e.target.value)} placeholder="123 Serenity Lane" required />
                </FieldGroup>
                <FieldGroup>
                  <FormLabel htmlFor={`city_${isBilling}`}>City</FormLabel>
                  <AdminInput id={`city_${isBilling}`} type="text" value={newCity} onChange={e => setNewCity(e.target.value)} placeholder="Willow Creek" required />
                </FieldGroup>
                <FieldGroup>
                  <FormLabel htmlFor={`state_${isBilling}`}>State / Province</FormLabel>
                  <AdminInput id={`state_${isBilling}`} type="text" value={newState} onChange={e => setNewState(e.target.value)} placeholder="CA" required />
                </FieldGroup>
                <FieldGroup>
                  <FormLabel htmlFor={`zip_${isBilling}`}>ZIP / Postal Code</FormLabel>
                  <AdminInput id={`zip_${isBilling}`} type="text" value={newZip} onChange={e => setNewZip(e.target.value)} placeholder="90210" required />
                </FieldGroup>
                <FieldGroup>
                  <FormLabel htmlFor={`country_${isBilling}`}>Country</FormLabel>
                  <AdminInput id={`country_${isBilling}`} type="text" value={newCountry} onChange={e => setNewCountry(e.target.value)} placeholder="USA" required />
                </FieldGroup>
                <FormActions>
                  <SecondaryButton type="button" onClick={() => setShowNewAddressForm(false)}>Cancel</SecondaryButton>
                  <PrimaryCtaButton type="submit">Save Address</PrimaryCtaButton>
                </FormActions>
              </form>
            </AddressFormWrapper>
          </>
        )}
        
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
          <PrimaryCtaButton
            onClick={onComplete}
            disabled={!selectedAddress && !(isBilling && useShippingForBilling)}
          >
            Continue
          </PrimaryCtaButton>
        </div>
      </SectionContent>
    </CheckoutSection>
  );
};

export default AddressSection;
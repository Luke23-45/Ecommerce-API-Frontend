// src/pages/CheckoutPage/components/ShippingMethodSection.tsx

import React, { useState } from 'react';
import { FaTruck } from 'react-icons/fa';

// Import local styles
import {
  ShippingOptionsList,
  ShippingOptionCard,
  OptionDetails,
  OptionName,
  OptionDescription,
  OptionCost,
} from './ShippingMethodSection.styles';

// Import shared styles & components
import {
  CheckoutSection,
  SectionHeader,
  SectionContent,
  EditLink,
  SectionSummary,
} from '@/pages/CheckoutPage/CheckoutPage.styles';
// import { StepActions } from './AddressSection.styles'; // Re-use from AddressStep
// import { PrimaryCtaButton, SecondaryButton } from '@/components/common/Button/Button.styles';
// import { RadioCircle } from './AddressSection.styles'; // Re-use or create a common RadioCircle

import { PrimaryCtaButton } from '@/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles';
import { SecondaryButton } from '@/components/auth/AuthForms';
import { RadioCircle } from '../PaymentMethodSection/PaymentMethodSection.styles';
// Define the shape of a shipping option object
import { StepActions } from './ShippingMethodSection.styles';
interface ShippingOption {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDelivery?: string;
  isDefault?: boolean;
}

interface ShippingMethodSectionProps {
  shippingOptions: ShippingOption[];
  selectedMethod: ShippingOption | null;
  onSelectMethod: (method: ShippingOption | null) => void;
  isOpen: boolean;
  onToggle: () => void;
  onComplete: () => void;
}

const ShippingMethodSection: React.FC<ShippingMethodSectionProps> = ({
  shippingOptions,
  selectedMethod,
  onSelectMethod,
  isOpen,
  onToggle,
  onComplete,
}) => {
  const handleContinue = () => {
    if (selectedMethod) {
      onComplete();
    }
  };

  const summaryText = selectedMethod
    ? `${selectedMethod.name} (${selectedMethod.cost === 0 ? 'FREE' : '$' + selectedMethod.cost.toFixed(2)})`
    : 'Select Delivery Method';

  return (
    <CheckoutSection className={isOpen ? 'is-active' : ''}>
      <SectionHeader onClick={onToggle} $isClickable={true}>
        <h2><FaTruck className="icon" /> Delivery Method</h2>
        {!isOpen && selectedMethod ? (
          <SectionSummary>{summaryText}</SectionSummary>
        ) : !isOpen ? (
            <SectionSummary style={{color: 'red'}}>Required</SectionSummary>
        ) : null}
        {!isOpen && <EditLink onClick={(e) => { e.stopPropagation(); onToggle(); }}>Edit</EditLink>}
      </SectionHeader>

      <SectionContent isOpen={isOpen}>
        <ShippingOptionsList>
          {shippingOptions.map(option => (
            <ShippingOptionCard
              key={option.id}
              $isSelected={selectedMethod?.id === option.id}
              onClick={() => onSelectMethod(option)}
            >
              <RadioCircle $isSelected={selectedMethod?.id === option.id} />
              <OptionDetails>
                <OptionName>{option.name}</OptionName>
                <OptionDescription>{option.description}</OptionDescription>
                {option.estimatedDelivery && <OptionDescription style={{ fontStyle: 'italic' }}>Est: {option.estimatedDelivery}</OptionDescription>}
              </OptionDetails>
              <OptionCost>
                {option.cost === 0 ? 'FREE' : `$${option.cost.toFixed(2)}`}
              </OptionCost>
            </ShippingOptionCard>
          ))}
        </ShippingOptionsList>
        
        <StepActions>
           <SecondaryButton onClick={() => { /* TODO: Back to previous step handler */ onToggle(); /* For now just toggle */}}>
            Back
          </SecondaryButton>
          <PrimaryCtaButton
            onClick={handleContinue}
            disabled={!selectedMethod}
          >
            Continue to Payment
          </PrimaryCtaButton>
        </StepActions>
      </SectionContent>
    </CheckoutSection>
  );
};

export default ShippingMethodSection;
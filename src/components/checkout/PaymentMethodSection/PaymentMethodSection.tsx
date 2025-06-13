// src/pages/CheckoutPage/components/PaymentMethodSection.tsx

import React, { useState } from 'react';
import { FaCreditCard, FaUniversity, FaLock } from 'react-icons/fa';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Import local styles
import {
  PaymentMethodList,
  PaymentOptionCard,
  PaymentOptionDetails,
  PaymentOptionText,
  PaymentFormWrapper,
  PaymentError,
  SecurityInfo,
} from './PaymentMethodSection.styles';

// Import shared styles & components
import {
  CheckoutSection,
  SectionHeader,
  SectionContent,
  EditLink,
  SectionSummary,
} from '@/pages/CheckoutPage/CheckoutPage.styles';

import { RadioCircle } from './PaymentMethodSection.styles';

interface SavedPaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiry?: string;
  isDefault?: boolean;
}

interface PaymentMethodSectionProps {
  savedMethods: SavedPaymentMethod[];
  selectedMethod: SavedPaymentMethod | null;
  onSelectMethod: (method: SavedPaymentMethod | null) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Inter", "Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: { color: "#fa755a", iconColor: "#fa755a" },
  },
};

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  savedMethods,
  selectedMethod,
  onSelectMethod,
  isOpen,
  onToggle,
}) => {
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Stripe hooks
  // These hooks require an <Elements> provider higher up in the component tree
  const stripe = useStripe();
  const elements = useElements();

  const handleSelectOption = (methodId: string | 'new_card') => {
    if (methodId === 'new_card') {
      onSelectMethod(null); // Indicate new card is being used
      setShowNewCardForm(true);
    } else {
      const method = savedMethods.find(m => m.id === methodId);
      onSelectMethod(method || null);
      setShowNewCardForm(false);
    }
    setPaymentError(null); // Clear any previous card errors
  };

  const summaryText = selectedMethod
    ? `${selectedMethod.type} ending in ${selectedMethod.last4}`
    : showNewCardForm
      ? 'New Card Details'
      : 'Select Payment Method';

  return (
    <CheckoutSection className={isOpen ? 'is-active' : ''}>
      <SectionHeader onClick={onToggle} $isClickable={true}>
        <h2><FaCreditCard className="icon" /> Payment Method</h2>
        {!isOpen ? (
          <SectionSummary>{summaryText}</SectionSummary>
        ) : null}
        {!isOpen && <EditLink onClick={(e) => { e.stopPropagation(); onToggle(); }}>Edit</EditLink>}
      </SectionHeader>

      <SectionContent isOpen={isOpen}>
        <PaymentMethodList>
          {/* Render saved payment methods */}
          {savedMethods.map(method => (
            <PaymentOptionCard
              key={method.id}
              $isSelected={selectedMethod?.id === method.id}
              onClick={() => handleSelectOption(method.id)}
            >
              <RadioCircle $isSelected={selectedMethod?.id === method.id} />
              <PaymentOptionDetails>
                <FaUniversity size="1.5em" style={{opacity: 0.7}} /> {/* Placeholder icon */}
                <PaymentOptionText>
                  {method.type} ending in {method.last4}
                  {method.expiry && ` (Exp: ${method.expiry})`}
                  {method.isDefault && <em> (Default)</em>}
                </PaymentOptionText>
              </PaymentOptionDetails>
            </PaymentOptionCard>
          ))}

          {/* Option to add a new card */}
          <PaymentOptionCard
            $isSelected={showNewCardForm}
            onClick={() => handleSelectOption('new_card')}
          >
            <RadioCircle $isSelected={showNewCardForm} />
            <PaymentOptionDetails>
              <FaCreditCard size="1.5em" />
              <PaymentOptionText>Pay with new card</PaymentOptionText>
            </PaymentOptionDetails>
          </PaymentOptionCard>
        </PaymentMethodList>

        {/* Stripe Card Element Form */}
        <PaymentFormWrapper isOpen={showNewCardForm}>
          <CardElement options={CARD_ELEMENT_OPTIONS} onChange={() => setPaymentError(null)} />
        </PaymentFormWrapper>

        {paymentError && <PaymentError>{paymentError}</PaymentError>}

        <SecurityInfo>
          <FaLock />
          <span>All transactions are secure and encrypted. Payment processing by Stripe.</span>
        </SecurityInfo>

      </SectionContent>
    </CheckoutSection>
  );
};

export default PaymentMethodSection;
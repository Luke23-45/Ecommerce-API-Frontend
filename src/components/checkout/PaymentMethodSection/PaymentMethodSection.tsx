// src/components/checkout/PaymentMethodSection/PaymentMethodSection.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import {
  FaCreditCard, FaLock,
  FaCcVisa, FaCcMastercard, FaCcAmex, FaUniversity // Example card brand icons
} from 'react-icons/fa';
import {
  CardElement, // Using single CardElement for simplicity first
  // CardNumberElement, CardExpiryElement, CardCvcElement, // For split elements
  useStripe,
  useElements,
  type StripeCardElementChangeEvent
} from '@stripe/react-stripe-js';

// Import local styles (updated)
import {
  PaymentMethodSectionWrapper,
  PaymentSectionTitle,
  PaymentMethodList,
  PaymentOptionCard,
  PaymentOptionDetails,
  PaymentOptionText,
  PaymentOptionMeta,
  PaymentFormWrapper,
  StripeElementContainer, // Wrapper for the Stripe Element
  getStripeElementStyle,   // Function to get style object for Stripe
  PaymentErrorDisplay,
  SecurityInfo,
} from './PaymentMethodSection.styles';

// Import the beautifully styled RadioCircle

import { RadioCircle } from './PaymentMethodSection.styles';
// Type definitions
// Ensure this matches definitions in CheckoutPage and mockData
export interface SavedPaymentMethod {
  id: string; // Stripe PaymentMethod ID (e.g., "pm_xxxx")
  type: string; // e.g., "Visa", "Mastercard"
  last4: string;
  expiryMonth?: number; // Stripe provides month/year
  expiryYear?: number;
  isDefault?: boolean;
  // cardBrand might be a more specific field from Stripe like 'visa', 'mastercard'
  cardBrand?: string; // e.g., 'visa', 'mastercard', 'amex'
}

// Data structure for what this component passes up to CheckoutPage
export interface SelectedPaymentInfo {
  type: 'saved' | 'new_card';
  id?: string; // Stripe PaymentMethod ID (for saved) or a temporary client-side ID for 'new_card' selection state
  paymentMethodId?: string; // Actual Stripe PaymentMethod ID for a *newly created* card, to be set on successful tokenization
  last4?: string; // For display
  cardBrand?: string; // For display
  requiresSetup?: boolean; // True if Stripe Elements need to be submitted to create a PaymentMethod
  isCompleteAndValid?: boolean; // For new card input state
  saveCard?: boolean; // For "Save this card" checkbox
}


interface PaymentMethodSectionProps {
  savedMethods: SavedPaymentMethod[];
  // selectedPaymentInfo prop from parent reflects parent's understanding of selection
  selectedPaymentInfo: SelectedPaymentInfo | null;
  // onSelectionChange passes up the user's intent or confirmed new payment method details
  onSelectionChange: (selection: SelectedPaymentInfo | null) => void;
  // Optional: For CheckoutPage to trigger submission of Stripe form if needed,
  // or this component can handle its own "confirmation" logic internally before Place Order.
  // For the global continue button, CheckoutPage needs to know if this step is "valid".
  onValidityChange?: (isValid: boolean, requiresSetup?: boolean, paymentMethodId?: string, saveCard?:boolean) => void;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  savedMethods,
  selectedPaymentInfo,
  onSelectionChange,
  onValidityChange,
}) => {
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();

  // Internal state:
  // 'selectedOptionId' tracks which card or 'new_card' is chosen in the UI
  // It could be a Stripe PM ID for a saved card, or the string 'new_card'
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(() => {
    if (selectedPaymentInfo) {
      return selectedPaymentInfo.type === 'saved' ? selectedPaymentInfo.id || null : 'new_card';
    }
    return savedMethods.find(m => m.isDefault)?.id || (savedMethods.length > 0 ? savedMethods[0].id : 'new_card');
  });

  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isStripeElementComplete, setIsStripeElementComplete] = useState(false);
  const [isStripeElementFocused, setIsStripeElementFocused] = useState(false);
  const [saveNewCard, setSaveNewCard] = useState(true); // Default to saving the card

  // Sync internal selectedOptionId with parent's selectedPaymentInfo if parent changes it
  useEffect(() => {
    if (selectedPaymentInfo) {
      const newOptionId = selectedPaymentInfo.type === 'saved' ? selectedPaymentInfo.id : 'new_card';
      if (newOptionId !== selectedOptionId) { // Check to prevent loop
          setSelectedOptionId(newOptionId);
      }
    } else if (savedMethods.length > 0) { // Default to first saved if parent clears
        //setSelectedOptionId(savedMethods.find(m => m.isDefault)?.id || savedMethods[0].id);
    } else {
        //setSelectedOptionId('new_card');
    }
  }, [selectedPaymentInfo, savedMethods]); // Removed selectedOptionId from deps


  // Inform parent about validity when selection or Stripe Element state changes
  useEffect(() => {
    if (onValidityChange) {
      if (selectedOptionId === 'new_card') {
        onValidityChange(isStripeElementComplete && !!stripe && !!elements, true, undefined, saveNewCard);
      } else {
        const sm = savedMethods.find(m => m.id === selectedOptionId);
        onValidityChange(!!sm, false, sm?.id, false); // No PM to create, pass existing ID
      }
    }
  }, [selectedOptionId, isStripeElementComplete, onValidityChange, stripe, elements, saveNewCard, savedMethods]);


  const handleOptionSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
    setStripeError(null); // Clear Stripe error when changing selection

    if (optionId === 'new_card') {
      onSelectionChange({
        type: 'new_card',
        id: 'new_card_intent', // Temporary ID
        requiresSetup: true,
        isCompleteAndValid: isStripeElementComplete,
        saveCard: saveNewCard,
      });
    } else {
      const selectedSavedMethod = savedMethods.find(m => m.id === optionId);
      if (selectedSavedMethod) {
        onSelectionChange({
          type: 'saved',
          id: selectedSavedMethod.id,
          last4: selectedSavedMethod.last4,
          cardBrand: selectedSavedMethod.cardBrand || selectedSavedMethod.type, // Fallback to type
          requiresSetup: false,
          isCompleteAndValid: true, // Saved cards are considered valid for selection
        });
      }
    }
  };

  const handleStripeElementChange = (event: StripeCardElementChangeEvent) => {
    setIsStripeElementFocused(event.focused);
    if (event.error) {
      setStripeError(event.error.message);
      setIsStripeElementComplete(false);
    } else {
      setStripeError(null);
      setIsStripeElementComplete(event.complete);
    }
    // Update parent about the current state of new card input
     if (selectedOptionId === 'new_card') {
        onSelectionChange({
            type: 'new_card',
            id: 'new_card_intent',
            requiresSetup: true,
            isCompleteAndValid: event.complete,
            saveCard: saveNewCard,
        });
    }
  };

  const getCardIcon = (brand?: string) => {
    const lowerBrand = brand?.toLowerCase();
    switch (lowerBrand) {
      case 'visa': return <FaCcVisa className="payment-icon" aria-label="Visa" />;
      case 'mastercard': return <FaCcMastercard className="payment-icon" aria-label="Mastercard" />;
      case 'amex': return <FaCcAmex className="payment-icon" aria-label="American Express" />;
      default: return <FaCreditCard className="payment-icon" aria-label="Credit Card" style={{opacity: 0.7}}/>; // Generic
    }
  };

  const showNewCardForm = selectedOptionId === 'new_card';
  const stripeElementOptions = getStripeElementStyle(theme);

  return (
    <PaymentMethodSectionWrapper>
      <PaymentSectionTitle>
        <FaCreditCard className="icon" /> Payment Method
      </PaymentSectionTitle>

      <PaymentMethodList role="radiogroup" aria-labelledby="payment-method-title">
        {savedMethods.map(method => (
          <PaymentOptionCard
            key={method.id}
            $isSelected={selectedOptionId === method.id}
            onClick={() => handleOptionSelect(method.id)}
            role="radio"
            aria-checked={selectedOptionId === method.id}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOptionSelect(method.id);}}}
          >
            <RadioCircle $isSelected={selectedOptionId === method.id} aria-hidden="true" />
            {getCardIcon(method.cardBrand || method.type)}
            <PaymentOptionDetails>
              <PaymentOptionText>
                {method.cardBrand || method.type} ending in {method.last4}
              </PaymentOptionText>
              {method.expiryMonth && method.expiryYear && (
                <PaymentOptionMeta>
                  Exp: {String(method.expiryMonth).padStart(2, '0')}/{method.expiryYear}
                </PaymentOptionMeta>
              )}
              {method.isDefault && <PaymentOptionMeta style={{fontStyle: 'italic', color: theme.colors.accent2}}>Default</PaymentOptionMeta>}
            </PaymentOptionDetails>
          </PaymentOptionCard>
        ))}

        {/* Option to add a new card */}
        <PaymentOptionCard
          $isSelected={showNewCardForm}
          onClick={() => handleOptionSelect('new_card')}
          role="radio"
          aria-checked={showNewCardForm}
          tabIndex={0}
          onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOptionSelect('new_card');}}}
        >
          <RadioCircle $isSelected={showNewCardForm} aria-hidden="true" />
          <FaCreditCard className="payment-icon" style={{opacity:0.9}}/>
          <PaymentOptionDetails>
            <PaymentOptionText>Pay with new card</PaymentOptionText>
          </PaymentOptionDetails>
        </PaymentOptionCard>
      </PaymentMethodList>

      <PaymentFormWrapper $showForm={showNewCardForm}>
        {showNewCardForm && ( // Conditionally render to re-initialize CardElement if needed, or rely on Stripe's own update logic
          <>
            <StripeElementContainer
              className={`${isStripeElementFocused ? 'StripeElement--focus' : ''} ${stripeError ? 'StripeElement--invalid' : ''} ${isStripeElementComplete && !stripeError ? 'StripeElement--complete' : ''}`}
            >
              <CardElement
                options={{ style: stripeElementOptions, hidePostalCode: true }}
                onChange={handleStripeElementChange}
                onFocus={() => setIsStripeElementFocused(true)}
                onBlur={() => setIsStripeElementFocused(false)}
              />
            </StripeElementContainer>
            
            <div className="stripe-form-footer">
              {/* Assuming AdminCheckbox is beautifully styled for frontend */}
              {/* <AdminCheckbox
                id="saveNewCard"
                label="Save this card for future purchases"
                checked={saveNewCard}
                onChange={(e) => setSaveNewCard(e.target.checked)}
              /> */}
              {/* The AdminCheckbox needs its own beautiful styling */}
            </div>
          </>
        )}
      </PaymentFormWrapper>

      {stripeError && showNewCardForm && (
          <PaymentErrorDisplay>
            {/* Could add an error icon here */}
            {stripeError}
          </PaymentErrorDisplay>
      )}

      <SecurityInfo>
        <FaLock />
        <span>All transactions are secure and encrypted. Payments powered by Stripe.</span>
      </SecurityInfo>

      {/* No internal "Continue" button needed */}
    </PaymentMethodSectionWrapper>
  );
};

export default PaymentMethodSection;
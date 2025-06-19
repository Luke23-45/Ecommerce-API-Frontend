import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "styled-components";
import {
  FaCreditCard,
  FaLock,
  FaUniversity,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaSpinner,
} from "react-icons/fa";
import {
  CardElement,
  type StripeCardElementChangeEvent,
} from "@stripe/react-stripe-js";

import { useGetSavedPaymentMethods } from "@/hooks/general/useCheckout";

import {
  PaymentMethodSectionWrapper,
  PaymentSectionTitle,
  PaymentMethodList,
  PaymentOptionCard,
  PaymentOptionDetails,
  PaymentOptionText,
  PaymentOptionMeta,
  PaymentFormWrapper,
  StripeElementContainer,
  getStripeElementStyle,
  PaymentErrorDisplay,
  SecurityInfo,
  RadioCircle,
} from "./PaymentMethodSection.styles";
import AdminCheckbox from "@/components/admin/common/AdminCheckbox/AdminCheckbox";

export interface SavedPaymentMethod {
  _id: string;
  stripePaymentMethodId: string;
  type: string;
  cardBrand: string;
  last4: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault?: boolean;
  billingDetails?: {
    name?: string;
  };
}

export interface SelectedPaymentInfo {
  type: "saved" | "new_card";
  id?: string;
  stripePaymentMethodId?: string;
  last4?: string;
  cardBrand?: string;
  requiresSetup: boolean;
  isCompleteAndValid: boolean;
  saveCard?: boolean;
}

interface PaymentMethodSectionProps {
  selectedPaymentInfo: SelectedPaymentInfo | null;
  onSelectionChange: (selection: SelectedPaymentInfo | null) => void;
  onValidityChange: (
    isValid: boolean,
    requiresSetup: boolean,
    stripePaymentMethodIdToUse?: string,
    saveCardPreference?: boolean
  ) => void;
  processingError?: string | null;
}

const PaymentMethodSection: React.FC<PaymentMethodSectionProps> = ({
  selectedPaymentInfo,
  onSelectionChange,
  onValidityChange,
  processingError,
}) => {
  const theme = useTheme();
  const {
    data: fetchedSavedMethods,
    isLoading: isLoadingSavedMethods,
    error: savedMethodsError,
  } = useGetSavedPaymentMethods();
  const savedMethods = fetchedSavedMethods || [];

  const [uiSelectedOptionKey, setUiSelectedOptionKey] = useState<string | null>(
    null
  );
  const [stripeElementError, setStripeElementError] = useState<string | null>(
    null
  );
  const [isStripeElementComplete, setIsStripeElementComplete] = useState(false);
  const [isStripeElementFocused, setIsStripeElementFocused] = useState(false);
  const [userWantsToSaveCard, setUserWantsToSaveCard] = useState(true);

  useEffect(() => {
    console.log(
      "PaymentMethodSection: Effect 1 (Sync UI Key) - Parent selectedPaymentInfo:",
      selectedPaymentInfo,
      "Saved methods count:",
      savedMethods.length
    );
    let keyToSet: string | null = null;

    if (selectedPaymentInfo) {
      keyToSet =
        selectedPaymentInfo.type === "saved"
          ? selectedPaymentInfo.id ||
            selectedPaymentInfo.stripePaymentMethodId ||
            null
          : "new_card";
      console.log(
        "PaymentMethodSection: Effect 1 - Using parent's pre-selection. Key to set:",
        keyToSet
      );
    } else if (savedMethods.length > 0) {
      const defaultSaved =
        savedMethods.find((m) => m.isDefault) || savedMethods[0];
      keyToSet = defaultSaved._id;
      console.log(
        "PaymentMethodSection: Effect 1 - Using default saved method. Key to set:",
        keyToSet
      );
    } else {
      keyToSet = "new_card";
      console.log(
        "PaymentMethodSection: Effect 1 - Defaulting to new_card. Key to set:",
        keyToSet
      );
    }

    if (uiSelectedOptionKey !== keyToSet) {
      console.log(
        "PaymentMethodSection: Effect 1 - Setting uiSelectedOptionKey from",
        uiSelectedOptionKey,
        "to",
        keyToSet
      );
      setUiSelectedOptionKey(keyToSet);
    } else {
      console.log(
        "PaymentMethodSection: Effect 1 - uiSelectedOptionKey is already",
        keyToSet,
        ". Not re-setting."
      );
    }
  }, [selectedPaymentInfo, savedMethods]);

  useEffect(() => {
    console.log(
      "PaymentMethodSection: Effect 2 (Inform Parent) - uiSelectedOptionKey:",
      uiSelectedOptionKey,
      "isStripeElementComplete:",
      isStripeElementComplete,
      "userWantsToSaveCard:",
      userWantsToSaveCard
    );

    if (!uiSelectedOptionKey) {
      console.log(
        "PaymentMethodSection: Effect 2 - No uiSelectedOptionKey, potentially calling onSelectionChange(null) and onValidityChange(false, false)."
      );

      onSelectionChange(null);
      onValidityChange(false, false, undefined, userWantsToSaveCard);
      return;
    }

    let newSelectionForParent: SelectedPaymentInfo | null = null;
    let isValidForParent = false;
    let requiresSetupForParent = false;
    let stripePmIdToUseForParent: string | undefined = undefined;

    if (uiSelectedOptionKey === "new_card") {
      newSelectionForParent = {
        type: "new_card",
        id: "new_card_intent",
        requiresSetup: true,
        isCompleteAndValid: isStripeElementComplete,
        saveCard: userWantsToSaveCard,
      };
      isValidForParent = isStripeElementComplete;
      requiresSetupForParent = true;
    } else {
      const selectedSaved = savedMethods.find(
        (m) => m._id === uiSelectedOptionKey
      );
      if (selectedSaved) {
        newSelectionForParent = {
          type: "saved",
          id: selectedSaved._id,
          stripePaymentMethodId: selectedSaved.stripePaymentMethodId,
          last4: selectedSaved.last4,
          cardBrand: selectedSaved.cardBrand,
          requiresSetup: false,
          isCompleteAndValid: true,
        };
        isValidForParent = true;
        requiresSetupForParent = false;
        stripePmIdToUseForParent = selectedSaved.stripePaymentMethodId;
      } else {
        console.warn(
          "PaymentMethodSection: Effect 2 - uiSelectedOptionKey was set to a saved card ID, but card not found in savedMethods. This is unexpected."
        );
        onSelectionChange(null);
        onValidityChange(false, false, undefined, userWantsToSaveCard);
        return;
      }
    }

    if (newSelectionForParent) {
      console.log(
        "PaymentMethodSection: Effect 2 - Calling onSelectionChange with:",
        newSelectionForParent
      );
      onSelectionChange(newSelectionForParent);
    }
    console.log(
      "PaymentMethodSection: Effect 2 - Calling onValidityChange with:",
      {
        isValidForParent,
        requiresSetupForParent,
        stripePmIdToUseForParent,
        userWantsToSaveCard,
      }
    );
    onValidityChange(
      isValidForParent,
      requiresSetupForParent,
      stripePmIdToUseForParent,
      userWantsToSaveCard
    );
  }, [
    uiSelectedOptionKey,
    isStripeElementComplete,
    userWantsToSaveCard,
    savedMethods,
    onSelectionChange,
    onValidityChange,
  ]);

  const handleUiOptionSelect = useCallback((optionKey: string) => {
    console.log(
      "PaymentMethodSection: handleUiOptionSelect - User chose key:",
      optionKey
    );
    setUiSelectedOptionKey(optionKey);
    setStripeElementError(null);
  }, []);

  const handleStripeElementChange = useCallback(
    (event: StripeCardElementChangeEvent) => {
      console.log(
        "PaymentMethodSection: handleStripeElementChange - Event:",
        event
      );
      setIsStripeElementFocused(event.focused || false);
      if (event.error) {
        setStripeElementError(event.error.message);
        setIsStripeElementComplete(false);
      } else {
        setStripeElementError(null);
        setIsStripeElementComplete(event.complete);
      }
    },
    []
  );

  const handleSaveCardChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(
        "PaymentMethodSection: handleSaveCardChange - Checked:",
        e.target.checked
      );
      setUserWantsToSaveCard(e.target.checked);
    },
    []
  );

  const getCardIcon = (brand?: string) => {
    const lowerBrand = brand?.toLowerCase();
    switch (lowerBrand) {
      case "visa":
        return <FaCcVisa className="payment-icon" aria-label="Visa" />;
      case "mastercard":
        return (
          <FaCcMastercard className="payment-icon" aria-label="Mastercard" />
        );
      case "amex":
        return (
          <FaCcAmex className="payment-icon" aria-label="American Express" />
        );
      case "new":
        return <FaCreditCard className="payment-icon" />;
      default:
        return (
          <FaUniversity
            className="payment-icon"
            aria-label="Bank Card"
            style={{ opacity: 0.7 }}
          />
        );
    }
  };

  const stripeElementOptions = getStripeElementStyle(theme);
  const showNewCardForm = uiSelectedOptionKey === "new_card";

  if (isLoadingSavedMethods) {
    return (
      <PaymentMethodSectionWrapper>
        <PaymentSectionTitle>
          <FaCreditCard className="icon" /> Payment Method
        </PaymentSectionTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: theme.spacing(8),
          }}
        >
          <FaSpinner
            style={{
              fontSize: "1.8rem",
              animation: "spin 1s linear infinite",
              color: theme.colors.accent1,
            }}
          />
          <p
            style={{
              marginTop: theme.spacing(2),
              color: theme.colors.textMedium,
            }}
          >
            Loading your payment methods...
          </p>
        </div>
      </PaymentMethodSectionWrapper>
    );
  }

  if (savedMethodsError && !showNewCardForm) {
  }

  return (
    <PaymentMethodSectionWrapper>
      <PaymentSectionTitle id="payment-method-title">
        <FaCreditCard className="icon" /> Payment Method
      </PaymentSectionTitle>

      {savedMethodsError && (
        <PaymentErrorDisplay style={{ marginBottom: theme.spacing(3) }}>
          Could not load your saved payment methods: {savedMethodsError.message}
          . You can still add a new card.
        </PaymentErrorDisplay>
      )}

      <PaymentMethodList
        role="radiogroup"
        aria-labelledby="payment-method-title"
      >
        {savedMethods.map((method) => (
          <PaymentOptionCard
            key={method._id}
            $isSelected={uiSelectedOptionKey === method._id}
            onClick={() => handleUiOptionSelect(method._id)}
            role="radio"
            aria-checked={uiSelectedOptionKey === method._id}
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleUiOptionSelect(method._id);
              }
            }}
          >
            <RadioCircle
              $isSelected={uiSelectedOptionKey === method._id}
              aria-hidden="true"
            />
            {getCardIcon(method.cardBrand)}
            <PaymentOptionDetails>
              <PaymentOptionText>
                {method.cardBrand || "Card"} ending in {method.last4}
              </PaymentOptionText>
              {method.expiryMonth && method.expiryYear && (
                <PaymentOptionMeta>
                  Exp: {String(method.expiryMonth).padStart(2, "0")}/
                  {method.expiryYear}
                </PaymentOptionMeta>
              )}
              {method.isDefault && (
                <PaymentOptionMeta
                  style={{ fontStyle: "italic", color: theme.colors.accent2 }}
                >
                  Default
                </PaymentOptionMeta>
              )}
            </PaymentOptionDetails>
          </PaymentOptionCard>
        ))}

        <PaymentOptionCard
          $isSelected={showNewCardForm}
          onClick={() => handleUiOptionSelect("new_card")}
          role="radio"
          aria-checked={showNewCardForm}
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleUiOptionSelect("new_card");
            }
          }}
        >
          <RadioCircle $isSelected={showNewCardForm} aria-hidden="true" />
          {getCardIcon("new")}
          <PaymentOptionDetails>
            <PaymentOptionText>Pay with a new card</PaymentOptionText>
          </PaymentOptionDetails>
        </PaymentOptionCard>
      </PaymentMethodList>

      <PaymentFormWrapper $showForm={showNewCardForm}>
        {showNewCardForm && (
          <>
            <StripeElementContainer
              className={`${
                isStripeElementFocused ? "StripeElement--focus" : ""
              } ${
                stripeElementError || processingError
                  ? "StripeElement--invalid"
                  : ""
              } ${
                isStripeElementComplete &&
                !stripeElementError &&
                !processingError
                  ? "StripeElement--complete"
                  : ""
              }`}
            >
              <CardElement
                options={{ style: stripeElementOptions, hidePostalCode: true }}
                onChange={handleStripeElementChange}
                onFocus={() => setIsStripeElementFocused(true)}
                onBlur={() => setIsStripeElementFocused(false)}
                onReady={() =>
                  console.log(
                    "PaymentMethodSection: CardElement is ready and mounted."
                  )
                }
              />
            </StripeElementContainer>

            <div
              className="stripe-form-footer"
              style={{
                marginTop: theme.spacing(3),
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <AdminCheckbox
                id={`saveNewCardForUser-${Math.random()
                  .toString(36)
                  .substr(2, 9)}`}
                label="Save this card for future purchases"
                checked={userWantsToSaveCard}
                onChange={handleSaveCardChange}
              />
            </div>

            {stripeElementError && (
              <PaymentErrorDisplay style={{ marginTop: theme.spacing(2) }}>
                {stripeElementError}
              </PaymentErrorDisplay>
            )}
            {processingError && (
              <PaymentErrorDisplay style={{ marginTop: theme.spacing(2) }}>
                {processingError}
              </PaymentErrorDisplay>
            )}
          </>
        )}
      </PaymentFormWrapper>

      <SecurityInfo>
        <FaLock />
        <span>
          All transactions are secure and encrypted. Payments powered by Stripe.
        </span>
      </SecurityInfo>
    </PaymentMethodSectionWrapper>
  );
};

export default PaymentMethodSection;



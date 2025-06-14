import React, { useState, useEffect, useMemo } from "react";

import { useTheme } from "styled-components";

import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaShippingFast,
  FaCreditCard,
} from "react-icons/fa";

import { CardElement } from "@stripe/react-stripe-js";

import CheckoutStepper, {
  type CheckoutStepItem,
} from "./CheckoutStepper/CheckoutStepper";

import AddressSection, {
  type Address,
} from "@/components/checkout/AddressSection/AddressSection";

import ShippingMethodSection, {
  type ShippingOption,
} from "@/components/checkout/ShippingMethodSection/ShippingMethodSection";

import PaymentMethodSection, {
  type SavedPaymentMethod,
  type SelectedPaymentInfo,
} from "@/components/checkout/PaymentMethodSection/PaymentMethodSection";

import BriefOrderSummary, {
  type OrderSummaryData,
  type BriefCartItemPreview,
  type AppliedDiscountInfo,
} from "@/components/checkout/BriefOrderSummary/BriefOrderSummary";

import { useElements, useStripe } from "@stripe/react-stripe-js"; // Still needed here for the `InnerCheckoutContent`

import { PrimaryCtaButton } from "../BecomeAPartnerPage/BecomeAPartnerPage.styles";

import {
  CheckoutPageWrapper,
  CheckoutContentLimiter,
  CheckoutHeader,
  BackButton,
  CheckoutMainGrid,
  CheckoutFlowColumn,
  OrderSummaryColumn,
  ActiveSectionWrapper,
  CompletedSectionSummaryWrapper,
  SummaryDetails,
  EditButton,
  GlobalContinueButtonWrapper,
} from "./CheckoutPage.styles";

// Mock Data

import {
  mockSavedAddresses,
  mockShippingOptions,
  mockSavedPaymentMethods,
  mockBriefCartSummary,
} from "@/data/CheckoutPage/mockData";


import { Elements } from "@stripe/react-stripe-js";

import { loadStripe } from "@stripe/stripe-js";

export type CheckoutStepId =
  | "shippingAddress"
  | "billingAddress"
  | "shippingMethod"
  | "paymentMethod";

const REACT_APP_STRIPE_PUBLISHABLE_KEY = import.meta.env
  .VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(
  REACT_APP_STRIPE_PUBLISHABLE_KEY ?? "pk_test_YOUR_FALLBACK_KEY_HERE"
);

const CHECKOUT_STEPS_CONFIG: CheckoutStepItem[] = [
  { id: "shippingAddress", label: "Shipping", icon: <FaMapMarkerAlt /> },

  { id: "billingAddress", label: "Billing", icon: <FaMapMarkerAlt /> },

  { id: "shippingMethod", label: "Delivery", icon: <FaShippingFast /> },

  { id: "paymentMethod", label: "Payment", icon: <FaCreditCard /> },
];

// --- NEW COMPONENT FOR INNER CONTENT ---

const InnerCheckoutContent: React.FC = () => {
  const navigate = useNavigate();

  const theme = useTheme(); // Now, useStripe and useElements are called INSIDE the Elements provider's scope

  const stripe = useStripe();

  const elements = useElements();

  console.log("Stripe and Elements available:", !!stripe, !!elements);

  const [currentStepId, setCurrentStepId] =
    useState<CheckoutStepId>("shippingAddress");

  const [completedSteps, setCompletedSteps] = useState<CheckoutStepId[]>([]);

  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<Address | null>(
      mockSavedAddresses.find((addr) => addr.isDefaultShipping) || null
    );

  const [selectedBillingAddress, setSelectedBillingAddress] =
    useState<Address | null>(
      mockSavedAddresses.find((addr) => addr.isDefaultBilling) || null
    );

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingOption | null>(
      mockShippingOptions.find((opt) => opt.isDefault) || null
    );

  const [selectedPaymentInfo, setSelectedPaymentInfo] =
    useState<SelectedPaymentInfo | null>(() => {
      const defaultPM = mockSavedPaymentMethods.find((pm) => pm.isDefault);

      return defaultPM
        ? {
            type: "saved",
            id: defaultPM.id,
            last4: defaultPM.last4,
            cardBrand: defaultPM.cardBrand || defaultPM.type,
            requiresSetup: false,
            isCompleteAndValid: true,
          }
        : null;
    });

  const [discountFeedback, setDiscountFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  const [appliedDiscount, setAppliedDiscount] =
    useState<AppliedDiscountInfo | null>(null);

  const [isPageLoading, setIsPageLoading] = useState(false);

  const stepOrder: CheckoutStepId[] = useMemo(
    () => CHECKOUT_STEPS_CONFIG.map((s) => s.id as CheckoutStepId),
    []
  );

  const handleGoToStep = (stepId: CheckoutStepId) => {
    const targetIndex = stepOrder.indexOf(stepId);

    const furthestCompletedIndex =
      completedSteps.length > 0
        ? stepOrder.indexOf(completedSteps[completedSteps.length - 1])
        : -1;

    if (targetIndex <= furthestCompletedIndex + 1) {
      if (completedSteps.includes(stepId) || stepId === currentStepId) {
        setCurrentStepId(stepId);
      }
    }
  };

  const markStepAsComplete = (stepId: CheckoutStepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps((prev) => {
        const newCompleted = [...prev, stepId];

        return newCompleted.sort(
          (a, b) => stepOrder.indexOf(a) - stepOrder.indexOf(b)
        );
      });
    }
  };

  const isCurrentStepValid = (): boolean => {
    switch (currentStepId) {
      case "shippingAddress":
        return !!selectedShippingAddress;

      case "billingAddress":
        const billingSection = document.getElementById(
          `useShippingForBilling-BillingAddress`
        );

        const isUsingShippingForBilling = (billingSection as HTMLInputElement)
          ?.checked;

        return (
          !!selectedBillingAddress ||
          (isUsingShippingForBilling && !!selectedShippingAddress)
        );

      case "shippingMethod":
        return !!selectedShippingMethod;

      case "paymentMethod":
        if (!selectedPaymentInfo) return false;

        if (selectedPaymentInfo.type === "saved") return true;

        return (
          selectedPaymentInfo.type === "new_card" &&
          !!selectedPaymentInfo.isCompleteAndValid
        );

      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    if (!isCurrentStepValid()) {
      alert("Please complete the current step.");

      return;
    }

    if (
      currentStepId === "paymentMethod" &&
      selectedPaymentInfo?.type === "new_card" &&
      selectedPaymentInfo.requiresSetup
    ) {
      setIsPageLoading(true);

      if (!stripe || !elements) {
        // Now 'stripe' and 'elements' are available here

        alert("Payment system is not ready. Please try again.");

        setIsPageLoading(false);

        return;
      }

      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        alert("Payment details form is not available.");

        setIsPageLoading(false);

        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",

        card: cardElement,
      });

      setIsPageLoading(false);

      if (error) {
        setDiscountFeedback({
          type: "error",
          text: error.message || "An error occurred with your payment details.",
        });

        return;
      } else if (paymentMethod) {
        setSelectedPaymentInfo({
          type: "new_card",

          id: "new_card_confirmed",

          paymentMethodId: paymentMethod.id,

          last4: paymentMethod.card?.last4,

          cardBrand: paymentMethod.card?.brand,

          requiresSetup: false,

          isCompleteAndValid: true,

          saveCard: selectedPaymentInfo.saveCard,
        });

        markStepAsComplete(currentStepId);

        navigate("/checkout/review");

        window.scrollTo(0, 0);

        return;
      }
    } else {
      markStepAsComplete(currentStepId);

      const currentIndex = stepOrder.indexOf(currentStepId);

      if (currentIndex < stepOrder.length - 1) {
        setCurrentStepId(stepOrder[currentIndex + 1]);
      } else {
        navigate("/checkout/review");
      }

      window.scrollTo(0, 0);
    }
  };

  const renderActiveStepContent = () => {
    switch (currentStepId) {
      case "shippingAddress":
        return (
          <AddressSection
            key="shippingAddress"
            titleText="Shipping Address"
            addresses={mockSavedAddresses}
            selectedAddress={selectedShippingAddress}
            onSelectAddress={setSelectedShippingAddress}
            isBillingSection={false}
          />
        );

      case "billingAddress":
        return (
          <AddressSection
            key="billingAddress"
            titleText="Billing Address"
            addresses={mockSavedAddresses}
            selectedAddress={selectedBillingAddress}
            onSelectAddress={setSelectedBillingAddress}
            isBillingSection={true}
            canUseShippingAsBilling={true}
            shippingAddressForBilling={selectedShippingAddress}
          />
        );

      case "shippingMethod":
        return (
          <ShippingMethodSection
            key="shippingMethod"
            shippingOptions={mockShippingOptions}
            selectedMethod={selectedShippingMethod}
            onSelectMethod={setSelectedShippingMethod}
          />
        );

      case "paymentMethod":
        return (
          <PaymentMethodSection
            key="paymentMethod"
            savedMethods={mockSavedPaymentMethods}
            selectedPaymentInfo={selectedPaymentInfo}
            onSelectionChange={setSelectedPaymentInfo}
            onValidityChange={(
              isValid,
              requiresSetup,
              paymentMethodId,
              saveCardPreference
            ) => {
              setSelectedPaymentInfo((prev) => ({
                ...(prev || {
                  type: selectedPaymentInfo?.type || "new_card",
                  id: selectedPaymentInfo?.id || "new_card_intent",
                }),

                isCompleteAndValid: isValid,

                requiresSetup: requiresSetup,

                paymentMethodId: paymentMethodId || prev?.paymentMethodId,

                saveCard: saveCardPreference,
              }));
            }}
          />
        );

      default:
        const exhaustiveCheck: never = currentStepId;

        return null;
    }
  };

  const renderCompletedStepSummary = (stepConfigItem: CheckoutStepItem) => {
    const stepId = stepConfigItem.id as CheckoutStepId;

    if (stepId === currentStepId || !completedSteps.includes(stepId)) {
      return null;
    }

    let summaryContent: React.ReactNode = <p>Information provided.</p>;

    switch (stepId) {
      case "shippingAddress":
        summaryContent = selectedShippingAddress ? (
          <>
            {" "}
            <p>
              <strong>
                {selectedShippingAddress.name ||
                  `${selectedShippingAddress.firstName} ${selectedShippingAddress.lastName}`}
              </strong>
            </p>{" "}
            <p>
              {selectedShippingAddress.street}{" "}
              {selectedShippingAddress.street2 || ""}
            </p>{" "}
            <p>
              {selectedShippingAddress.city}, {selectedShippingAddress.state}{" "}
              {selectedShippingAddress.zip}
            </p>{" "}
          </>
        ) : (
          <p>Details pending.</p>
        );

        break;

      case "billingAddress":
        const isSameAsShipping =
          selectedShippingAddress &&
          selectedBillingAddress &&
          selectedShippingAddress.id === selectedBillingAddress.id;

        summaryContent = selectedBillingAddress ? (
          isSameAsShipping ? (
            <p>Same as shipping address.</p>
          ) : (
            <>
              {" "}
              <p>
                <strong>
                  {selectedBillingAddress.name ||
                    `${selectedBillingAddress.firstName} ${selectedBillingAddress.lastName}`}
                </strong>
              </p>{" "}
              <p>
                {selectedBillingAddress.street}{" "}
                {selectedBillingAddress.street2 || ""}
              </p>{" "}
              <p>
                {selectedBillingAddress.city}, {selectedBillingAddress.state}{" "}
                {selectedBillingAddress.zip}
              </p>{" "}
            </>
          )
        ) : (
          <p>Details pending.</p>
        );

        break;

      case "shippingMethod":
        summaryContent = selectedShippingMethod ? (
          <p>
            <strong>{selectedShippingMethod.name}</strong> -{" "}
            {selectedShippingMethod.cost === 0
              ? "FREE"
              : `$${selectedShippingMethod.cost.toFixed(2)}`}
          </p>
        ) : (
          <p>Details pending.</p>
        );

        break;

      case "paymentMethod":
        summaryContent =
          selectedPaymentInfo && selectedPaymentInfo.type === "saved" ? (
            <p>
              <strong>
                {selectedPaymentInfo.cardBrand || selectedPaymentInfo.type}
              </strong>{" "}
              ending in {selectedPaymentInfo.last4 || "****"}
            </p>
          ) : selectedPaymentInfo &&
            selectedPaymentInfo.type === "new_card" &&
            !selectedPaymentInfo.requiresSetup &&
            selectedPaymentInfo.last4 ? (
            <p>
              <strong>{selectedPaymentInfo.cardBrand || "Card"}</strong> ending
              in {selectedPaymentInfo.last4}
            </p>
          ) : (
            <p>Payment details pending.</p>
          );

        break;
    }

    return (
      <CompletedSectionSummaryWrapper key={`${stepId}-summary`}>
        <h3>
          {React.cloneElement(stepConfigItem.icon as React.ReactElement, {
            size: "0.9em",
            style: { marginRight: theme.spacing(1.5) },
          })}{" "}
          {stepConfigItem.label}
        </h3>
        <SummaryDetails>{summaryContent}</SummaryDetails>
        <EditButton onClick={() => handleGoToStep(stepId)}>
          Edit
        </EditButton>{" "}
      </CompletedSectionSummaryWrapper>
    );
  };

  const getPrimaryButtonText = (): string => {
    const currentIndex = stepOrder.indexOf(currentStepId);

    if (currentIndex < stepOrder.length - 1) {
      const nextStepLabel = CHECKOUT_STEPS_CONFIG[currentIndex + 1].label;

      return `Continue to ${nextStepLabel}`;
    }

    return "Proceed to Review Order";
  };

  const orderSummaryForBrief: OrderSummaryData = useMemo(
    () => ({
      itemCount: mockBriefCartSummary.itemCount,

      currency: mockBriefCartSummary.currency || "USD",

      itemsPreview: mockBriefCartSummary.itemsPreview as BriefCartItemPreview[],

      subtotal: mockBriefCartSummary.subtotal,

      shippingCost: selectedShippingMethod?.cost,

      appliedDiscount: appliedDiscount,

      estimatedTaxes: 0,

      grandTotal:
        mockBriefCartSummary.subtotal -
        (appliedDiscount?.amount || 0) +
        (selectedShippingMethod?.cost || 0) +
        0,
    }),
    [mockBriefCartSummary, appliedDiscount, selectedShippingMethod]
  ); // Loading state for Stripe

  if (!stripe || !elements) {
    return <div>Loading payment system...</div>;
  }

  return (
    <CheckoutPageWrapper>
      {" "}
      <CheckoutContentLimiter>
        <CheckoutHeader>
          <h1>Secure Checkout</h1>
          <BackButton
            onClick={() => navigate("/cart")}
            aria-label="Go back to your shopping cart"
          >
            <FaArrowLeft /> Back to Cart
          </BackButton>
        </CheckoutHeader>
        <CheckoutMainGrid>
          <CheckoutFlowColumn>
            <CheckoutStepper
              steps={CHECKOUT_STEPS_CONFIG}
              currentStepId={currentStepId}
              completedSteps={completedSteps}
              onStepClick={handleGoToStep}
            />

            {CHECKOUT_STEPS_CONFIG.map((stepConfig) =>
              renderCompletedStepSummary(stepConfig)
            )}

            <ActiveSectionWrapper>
              {renderActiveStepContent()}
            </ActiveSectionWrapper>

            <GlobalContinueButtonWrapper>
              <PrimaryCtaButton
                onClick={handleNextStep}
                disabled={!isCurrentStepValid() || isPageLoading}
                isLoading={isPageLoading}
              >
                {getPrimaryButtonText()}
              </PrimaryCtaButton>
            </GlobalContinueButtonWrapper>
          </CheckoutFlowColumn>

          <OrderSummaryColumn>
            <BriefOrderSummary
              summary={orderSummaryForBrief}
              onPrimaryAction={() => {
                const allStepsOnPageComplete = stepOrder.every((step) =>
                  completedSteps.includes(step)
                );

                if (allStepsOnPageComplete && isCurrentStepValid()) {
                  if (
                    currentStepId === "paymentMethod" &&
                    selectedPaymentInfo?.type === "new_card" &&
                    selectedPaymentInfo.requiresSetup
                  ) {
                    handleNextStep();
                  } else {
                    navigate("/checkout/review");
                  }
                } else {
                  alert("Please complete all checkout steps first.");
                }
              }}
              primaryActionText="Proceed to Review"
              isPrimaryActionDisabled={
                !(
                  currentStepId === "paymentMethod" &&
                  isCurrentStepValid() &&
                  completedSteps.includes("paymentMethod")
                ) && !stepOrder.every((step) => completedSteps.includes(step))
              }
              onApplyDiscount={async (code) => {
                setIsApplyingDiscount(true);

                setDiscountFeedback(null);

                return new Promise<boolean>((resolve) => {
                  setTimeout(() => {
                    if (code.toUpperCase() === "ELAN15") {
                      setAppliedDiscount({
                        code: "ELAN15",
                        amount: orderSummaryForBrief.subtotal * 0.15,
                        description: "15% Off Your Order",
                      });

                      setDiscountFeedback({
                        type: "success",
                        text: "Discount ELAN15 applied!",
                      });

                      resolve(true);
                    } else {
                      setDiscountFeedback({
                        type: "error",
                        text: "Sorry, that discount code is invalid.",
                      });

                      resolve(false);
                    }

                    setIsApplyingDiscount(false);
                  }, 1000);
                });
              }}
              discountFeedback={discountFeedback}
              onClearDiscountFeedback={() => setDiscountFeedback(null)}
              isApplyingDiscount={isApplyingDiscount}
            />
          </OrderSummaryColumn>
        </CheckoutMainGrid>{" "}
      </CheckoutContentLimiter>{" "}
    </CheckoutPageWrapper>
  );
};

// --- END NEW COMPONENT ---

const CheckoutPage: React.FC = () => {
  console.log(
    "stripe promise",
    stripePromise,
    REACT_APP_STRIPE_PUBLISHABLE_KEY
  ); // This is fine here

  return (
    // Elements provider wraps the component that uses useStripe/useElements

    <Elements stripe={stripePromise}>
      <InnerCheckoutContent /> {/* Render the new component here */}{" "}
    </Elements>
  );
};

export default CheckoutPage;

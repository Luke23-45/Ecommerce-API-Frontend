// src/pages/CheckoutPage/index.tsx

import React, { useState, useEffect } from "react";
import { useTheme } from "styled-components";
import { useNavigate } from "react-router-dom";

import AddressSection from "@/components/checkout/AddressSection/AddressSection";
import ShippingMethodSection from "@/components/checkout/ShippingMethodSection/ShippingMethodSection";
import PaymentMethodSection from "@/components/checkout/PaymentMethodSection/PaymentMethodSection";
import BriefOrderSummary from "@/components/checkout/BriefOrderSummary/BriefOrderSummary";

// --- Styles ---
import {
  CheckoutPageWrapper,
  CheckoutContentLimiter,
  CheckoutHeader,
  BackButton,
  MainCheckoutLayout,
  CheckoutStepsColumn,
  OrderSummaryColumn,
} from "./CheckoutPage.styles";
import { FaArrowLeft } from "react-icons/fa";

// --- Mock Data ---
import {
  mockSavedAddresses,
  mockShippingOptions,
  mockSavedPaymentMethods,
  mockBriefCartSummary,
} from "@/data/CheckoutPage/mockData";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
export type CheckoutAccordionStep =
  | "shippingAddress"
  | "billingAddress"
  | "shippingMethod"
  | "paymentMethod";
const stripePromise = loadStripe('pk_test_51RMMmWHQZBwUjHIm39HCrkwNOD1SjNRzSgANhCIKoBTqLgy37bWZcxN6gkHzRax16rvIAKrCt07hGqYplgO2AHW700ccckwXHV');

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // State to manage which accordion section is open
  const [activeSection, setActiveSection] =
    useState<CheckoutAccordionStep | null>("shippingAddress");

  // State to hold selected data for summary display when sections are collapsed
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<
    any | null
    
  >(mockSavedAddresses.find((a) => a.isDefaultShipping) || null);

    const [savedMethods, setSavedMethods] = useState([
    { id: 'card_1', type: 'Visa', last4: '4242', expiry: '12/2026', isDefault: true },
    { id: 'card_2', type: 'Mastercard', last4: '8888', expiry: '05/2025' },
  ]);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<
    any | null
  >(mockSavedAddresses.find((a) => a.isDefaultBilling) || null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<
    any | null
  >(mockShippingOptions.find((o) => o.isDefault) || null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    any | null
  >(mockSavedPaymentMethods.find((pm) => pm.isDefault) || null);

  const handleSectionComplete = (
    nextSection: CheckoutAccordionStep | "review"
  ) => {
    if (nextSection === "review") {
      // TODO: Validate all selections and then navigate
      console.log("Proceeding to review with:", {
        shipping: selectedShippingAddress,
        billing: selectedBillingAddress,
        method: selectedShippingMethod,
        payment: selectedPaymentMethod,
      });
      navigate("/checkout/review"); // Placeholder for actual review page
    } else {
      setActiveSection(nextSection);
    }
  };

  return (
    <CheckoutPageWrapper>
      <CheckoutContentLimiter>
        <CheckoutHeader>
          <h1>Secure Checkout</h1>
          <BackButton onClick={() => navigate("/cart")}>
            <FaArrowLeft /> Back to Cart
          </BackButton>
        </CheckoutHeader>

        <MainCheckoutLayout>
          <CheckoutStepsColumn>
            <AddressSection
              title="Shipping Address"
              addresses={mockSavedAddresses}
              selectedAddress={selectedShippingAddress}
              onSelectAddress={setSelectedShippingAddress}
              isOpen={activeSection === "shippingAddress"}
              onToggle={() =>
                setActiveSection(
                  activeSection === "shippingAddress" ? null : "shippingAddress"
                )
              }
              onComplete={() => handleSectionComplete("billingAddress")}
              isBilling={false}
            />

            <AddressSection
              title="Billing Address"
              addresses={mockSavedAddresses}
              selectedAddress={selectedBillingAddress}
              onSelectAddress={setSelectedBillingAddress}
              isOpen={activeSection === "billingAddress"}
              onToggle={() =>
                setActiveSection(
                  activeSection === "billingAddress" ? null : "billingAddress"
                )
              }
              onComplete={() => handleSectionComplete("shippingMethod")}
              isBilling={true}
              canUseShippingAsBilling={true}
              shippingAddressForBilling={selectedShippingAddress}
            />

            <ShippingMethodSection
              shippingOptions={mockShippingOptions}
              selectedMethod={selectedShippingMethod}
              onSelectMethod={setSelectedShippingMethod}
              isOpen={activeSection === "shippingMethod"}
              onToggle={() =>
                setActiveSection(
                  activeSection === "shippingMethod" ? null : "shippingMethod"
                )
              }
              onComplete={() => handleSectionComplete("paymentMethod")}
            />
               <Elements stripe={stripePromise}>

            <PaymentMethodSection
              savedMethods={mockSavedPaymentMethods}
              selectedMethod={selectedPaymentMethod}
              onSelectMethod={setSelectedPaymentMethod}
              isOpen={activeSection === "paymentMethod"}
              onToggle={() =>
                setActiveSection(
                  activeSection === "paymentMethod" ? null : "paymentMethod"
                )
              }
              
              // onComplete will be handled by the summary button in this section's content
            />
            </Elements>
          </CheckoutStepsColumn>

          <OrderSummaryColumn>
            <BriefOrderSummary
              summary={mockBriefCartSummary}
              onProceedToReview={() => handleSectionComplete("review")}
              // Disable button if not all previous steps are "conceptually complete"
              // This is a placeholder; actual validation will be more complex
              canProceed={
                !!selectedShippingAddress &&
                !!selectedBillingAddress &&
                !!selectedShippingMethod &&
                !!selectedPaymentMethod
              }
            />
          </OrderSummaryColumn>
        </MainCheckoutLayout>
      </CheckoutContentLimiter>
    </CheckoutPageWrapper>
  );
};

export default CheckoutPage;

// src/components/checkout/ShippingMethodSection/ShippingMethodSection.tsx
import React from "react";
import { FaTruck } from "react-icons/fa";
import { useTheme } from "styled-components";

// Import YOUR LoadingSpinner component
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner"; // ADJUST PATH AS NEEDED

// Import local styles
import {
  ShippingMethodSectionWrapper,
  ShippingSectionTitle,
  ShippingOptionsList,
  ShippingOptionCard,
  OptionDetails,
  OptionName,
  OptionDescription,
  OptionCost,
} from "./ShippingMethodSection.styles";

// Import the beautifully styled RadioCircle
import { RadioCircle } from "../PaymentMethodSection/PaymentMethodSection.styles"; // ADJUST PATH IF MOVED

export interface ShippingOption {
  id: string;
  name: string;
  description?: string;
  cost: number;
  estimatedDeliveryTime?: string;
}

interface ShippingMethodSectionProps {
  shippingOptions: ShippingOption[];
  selectedMethod: ShippingOption | null; // This is the currently selected method object
  onSelectMethod: (method: ShippingOption) => void; // Changed to never pass null if an option is clicked

  isLoadingOptions?: boolean;
  optionsError?: Error | null;
}

const ShippingMethodSection: React.FC<ShippingMethodSectionProps> = ({
  shippingOptions,
  selectedMethod,
  onSelectMethod,
  isLoadingOptions,
  optionsError,
}) => {
  const theme = useTheme();

  console.log(selectedMethod,"selectedMethod",shippingOptions,"shippingOptions")

  // --- Handle Selection ---
  const handleSelect = (option: ShippingOption) => {
    console.log(option,'option.id');
    onSelectMethod(option); // Pass the full option object
  };

  // --- Render Loading State ---
  if (isLoadingOptions) {
    return (
      <ShippingMethodSectionWrapper>
        <ShippingSectionTitle id="shipping-method-section-title-loading">
          <FaTruck className="icon" /> Delivery Method
        </ShippingSectionTitle>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: theme.spacing(10),
          }}
        >
          {/* Using your custom LoadingSpinner */}
          <LoadingSpinner
            size="2.5rem" // Example size
            message="Loading delivery options..."
            // color={theme.colors.accent1} // Pass if your spinner supports color prop
            // thickness="3px" // Example
          />
          {/* TODO: For "utmost beauty", replace with 2-3 skeleton loader cards for ShippingOptionCard */}
        </div>
      </ShippingMethodSectionWrapper>
    );
  }

  // --- Render Error State ---
  if (optionsError) {
    return (
      <ShippingMethodSectionWrapper>
        <ShippingSectionTitle id="shipping-method-section-title-error">
          <FaTruck className="icon" /> Delivery Method
        </ShippingSectionTitle>
        <div
          style={{
            padding: theme.spacing(4),
            textAlign: "center",
            color: theme.colors.error,
          }}
        >
          <p>Could not load delivery options: {optionsError.message}</p>
          <p
            style={{
              marginTop: theme.spacing(2),
              fontSize: theme.typography.body.sizes.small,
              color: theme.colors.textMuted,
            }}
          >
            Please ensure your shipping address is complete, or try again.
          </p>
        </div>
      </ShippingMethodSectionWrapper>
    );
  }

  // --- Render No Options Available State ---
  if (!shippingOptions || shippingOptions.length === 0) {
    return (
      <ShippingMethodSectionWrapper>
        <ShippingSectionTitle id="shipping-method-section-title-empty">
          <FaTruck className="icon" /> Delivery Method
        </ShippingSectionTitle>
        <p
          style={{
            color: theme.colors.textMedium,
            textAlign: "center",
            padding: theme.spacing(5),
          }}
        >
          No delivery options are currently available for your selected shipping
          address.
        </p>
      </ShippingMethodSectionWrapper>
    );
  }

  

  // --- Main Render (Options Available) ---
  return (
    <ShippingMethodSectionWrapper>
      <ShippingSectionTitle id="shipping-method-section-title">
        <FaTruck className="icon" /> Delivery Method
      </ShippingSectionTitle>

      <ShippingOptionsList
        role="radiogroup"
        aria-labelledby="shipping-method-section-title"
      >
        {shippingOptions.map((option) => {
          // Determine if this option is the currently selected one
          const isSelected = selectedMethod?.id === option.id;


          return (
            <ShippingOptionCard
              key={option.id}
              $isSelected={isSelected} // Pass boolean to styled component
              onClick={() => handleSelect(option)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
            >
              <RadioCircle
                $isSelected={isSelected} // Pass boolean to styled component
                aria-hidden="true"
              />
              <OptionDetails>
                <OptionName>{option.name || "N/A"}</OptionName>
                {option.description && (
                  <OptionDescription>{option.description}</OptionDescription>
                )}
                {option.estimatedDeliveryTime && (
                  <OptionDescription className="estimated-delivery">
                    Est. Delivery: {option.estimatedDeliveryTime}
                  </OptionDescription>
                )}
              </OptionDetails>
              <OptionCost>
                {option.cost === 0 ? "FREE" : `$${option.cost.toFixed(2)}`}
              </OptionCost>
            </ShippingOptionCard>
          );
        })}
      </ShippingOptionsList>
    </ShippingMethodSectionWrapper>
  );
};

export default ShippingMethodSection;

// src/components/checkout/ShippingMethodSection/ShippingMethodSection.tsx
import React from 'react'; // Removed useState as it's not used locally
import { FaTruck } from 'react-icons/fa';
import { useTheme } from 'styled-components'; // For potential theme access

// Import local styles (updated)
import {
  ShippingMethodSectionWrapper,
  ShippingSectionTitle,
  ShippingOptionsList,
  ShippingOptionCard,
  OptionDetails,
  OptionName,
  OptionDescription,
  OptionCost,
} from './ShippingMethodSection.styles';

// Import the beautifully styled RadioCircle
// Assuming it's in PaymentMethodSection.styles.ts or a common components area
import { RadioCircle } from '../PaymentMethodSection/PaymentMethodSection.styles'; // ADJUST PATH if moved

// Type definition (ensure this is consistent with CheckoutPage and mockData)
export interface ShippingOption { // Make sure this is exported or defined in a shared types file
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDelivery?: string;
  isDefault?: boolean; // Though default selection might be handled by parent state
}

interface ShippingMethodSectionProps {
  // titleText: string; // Title is now static within this component as "Delivery Method"
  shippingOptions: ShippingOption[];
  selectedMethod: ShippingOption | null;
  onSelectMethod: (method: ShippingOption | null) => void;
  // onSetValidity?: (isValid: boolean) => void; // Optional: To inform parent about step validity
}

const ShippingMethodSection: React.FC<ShippingMethodSectionProps> = ({
  shippingOptions,
  selectedMethod,
  onSelectMethod,
  // onSetValidity,
}) => {
  const theme = useTheme(); // For direct theme access if needed

  // useEffect(() => { // Example of how validity could be communicated
  //   if (onSetValidity) {
  //     onSetValidity(!!selectedMethod);
  //   }
  // }, [selectedMethod, onSetValidity]);

  return (
    <ShippingMethodSectionWrapper>
      <ShippingSectionTitle>
        <FaTruck className="icon" /> Delivery Method
      </ShippingSectionTitle>

      <ShippingOptionsList role="radiogroup" aria-labelledby="shipping-method-title">
        {/* The h2 above acts as the label for this radiogroup via aria-labelledby */}
        {/* Or we could have an invisible h2 with id="shipping-method-title" for screen readers */}

        {shippingOptions.map(option => (
          <ShippingOptionCard
            key={option.id}
            $isSelected={selectedMethod?.id === option.id}
            onClick={() => onSelectMethod(option)}
            role="radio"
            aria-checked={selectedMethod?.id === option.id}
            tabIndex={0} // Make cards focusable
            onKeyPress={(e) => { // Accessibility: select with Enter/Space
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectMethod(option);
                }
            }}
          >
            <RadioCircle
              $isSelected={selectedMethod?.id === option.id}
              aria-hidden="true" // Decorative if card itself is the control
            />
            <OptionDetails>
              <OptionName>{option.name}</OptionName>
              <OptionDescription>{option.description}</OptionDescription>
              {option.estimatedDelivery && (
                <OptionDescription className="estimated-delivery">
                  Est. Delivery: {option.estimatedDelivery}
                </OptionDescription>
              )}
            </OptionDetails>
            <OptionCost>
              {option.cost === 0 ? 'FREE' : `$${option.cost.toFixed(2)}`}
            </OptionCost>
          </ShippingOptionCard>
        ))}
      </ShippingOptionsList>
      
      {/* StepActions (Back/Continue buttons) are removed from here.
          Progression is handled by the global "Continue" button in CheckoutPage.tsx. */}

    </ShippingMethodSectionWrapper>
  );
};

export default ShippingMethodSection;
// src/components/Common/QuantityInput/QuantityInput.tsx
import React, { useCallback } from 'react';
// Removed useTheme, DefaultTheme: theme is available via context from ThemeProvider
import { FaMinus, FaPlus } from 'react-icons/fa';

// Correct import of styled components
import { 
    QuantityInputWrapper,
    QuantityButton,
    QuantityDisplay,
} from './QuantityInput.styles';

interface QuantityInputProps {
  currentQuantity: number;
  onQuantityChange: (newQuantity: number) => void;
  maxQuantity?: number;
  minQuantity?: number;
  disabled?: boolean;
  ariaLabel?: string;
  // Allow passing custom ARIA labels for buttons if needed
  ariaLabelDecrement?: string;
  ariaLabelIncrement?: string;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  currentQuantity,
  onQuantityChange,
  maxQuantity = 99,
  minQuantity = 1,
  disabled = false,
  ariaLabel = "Select quantity",
  ariaLabelDecrement = "Decrease quantity",
  ariaLabelIncrement = "Increase quantity"
}) => {
  // theme prop is no longer needed here, styled-components handles it via context

  const handleDecrement = useCallback(() => {
    // No need to check disabled here, button's disabled attribute handles it
    const newQuantity = Math.max(minQuantity, currentQuantity - 1);
    if (newQuantity !== currentQuantity) { // Only call if quantity actually changes
        onQuantityChange(newQuantity);
    }
  }, [currentQuantity, minQuantity, onQuantityChange]);

  const handleIncrement = useCallback(() => {
    const newQuantity = Math.min(maxQuantity, currentQuantity + 1);
     if (newQuantity !== currentQuantity) { // Only call if quantity actually changes
        onQuantityChange(newQuantity);
    }
  }, [currentQuantity, maxQuantity, onQuantityChange]);

  // Determine disabled states for buttons
  const isDecrementDisabled = disabled || currentQuantity <= minQuantity;
  const isIncrementDisabled = disabled || currentQuantity >= maxQuantity;

  return (
    <QuantityInputWrapper 
      $isDisabled={disabled} // Pass the renamed prop to styled component
      role="group"
      aria-label={ariaLabel}
    >
      <QuantityButton
        type="button"
        onClick={handleDecrement}
        disabled={isDecrementDisabled}
        aria-label={ariaLabelDecrement}
      >
        <FaMinus />
      </QuantityButton>
      {/* 
        Using a read-only input for QuantityDisplay for better accessibility 
        if users might expect to type, even if we don't enable it via JS.
        A simple span is fine too.
      */}
      <QuantityDisplay 
        aria-live="polite" // Announces changes to screen readers
        aria-atomic="true" // Announce the whole number
        role="status"      // Role that supports aria-live
      >
        {currentQuantity}
      </QuantityDisplay>
      {/* Alternative using input for display:
      <QuantityDisplay>
        <input 
            type="number" 
            value={currentQuantity} 
            readOnly 
            aria-live="polite" 
            aria-atomic="true"
        />
      </QuantityDisplay>
      */}
      <QuantityButton
        type="button"
        onClick={handleIncrement}
        disabled={isIncrementDisabled}
        aria-label={ariaLabelIncrement}
      >
        <FaPlus />
      </QuantityButton>
    </QuantityInputWrapper>
  );
};

export default QuantityInput;
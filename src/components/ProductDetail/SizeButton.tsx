// src/components/Common/VariantSelector/SizeButton.tsx
import React from 'react';
// useTheme and DefaultTheme are not needed here if ThemeProvider is globally available
import { SizeButtonStyled } from './SizeButton.styles';

interface SizeButtonProps {
  label: string;
  isSelected: boolean;
  isAvailable?: boolean;
  onClick: () => void;
  className?: string; // For allowing additional custom classes
  /** For screen readers, if the label isn't descriptive enough. Defaults to label. */
  ariaLabelOverride?: string;
}

const SizeButton: React.FC<SizeButtonProps> = ({
  label,
  isSelected,
  isAvailable = true,
  onClick,
  className,
  ariaLabelOverride,
}) => {
  // `theme` prop is removed, styled-components gets it from context

  const effectiveAriaLabel = 
    (ariaLabelOverride || label) + 
    (!isAvailable ? ' (Currently unavailable)' : '') + 
    (isSelected ? ' (Selected)' : '');

  const titleText = 
    label + 
    (!isAvailable ? ' - Unavailable' : '');

  return (
    <SizeButtonStyled
      // theme={theme} // Removed: No longer needed to pass explicitly
      type="button" // Explicitly type="button" is good practice
      $isSelected={isSelected} // Pass transient props
      $isAvailable={isAvailable}
      onClick={isAvailable ? onClick : undefined} // Prevent onClick if not available
      disabled={!isAvailable} // Standard HTML disabled attribute
      aria-pressed={isSelected} // Correct ARIA attribute for toggle buttons
      aria-label={effectiveAriaLabel} // More descriptive ARIA label
      title={titleText} // Tooltip
      className={className}
    >
      {label}
    </SizeButtonStyled>
  );
};

export default SizeButton;
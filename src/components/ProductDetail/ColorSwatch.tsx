// src/components/Common/VariantSelector/ColorSwatch.tsx
import React from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import { SwatchButton } from './ColorSwatch.styles';

interface ColorSwatchProps {
  color: string; // Hex code, color name (e.g., 'red'), or url('path/to/pattern.png')
  label: string; // For accessibility (e.g., "Fiery Red")
  isSelected: boolean;
  isAvailable?: boolean; // Defaults to true
  onClick: () => void;
  className?: string; // For additional styling if needed
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({
  color,
  label,
  isSelected,
  isAvailable = true,
  onClick,
  className,
}) => {
  const theme = useTheme() as DefaultTheme;

  return (
    <SwatchButton
      theme={theme}
      type="button" // Ensure it's not a submit button if inside a form
      $colorValue={color}
      $isSelected={isSelected}
      $isAvailable={isAvailable}
      onClick={isAvailable ? onClick : undefined} // Only clickable if available
      disabled={!isAvailable} // Native disabled attribute
      aria-pressed={isSelected}
      aria-label={label + (!isAvailable ? ' (Unavailable)' : '')}
      title={label + (!isAvailable ? ' - Unavailable' : '')}
      className={className}
    />
  );
};

export default ColorSwatch;
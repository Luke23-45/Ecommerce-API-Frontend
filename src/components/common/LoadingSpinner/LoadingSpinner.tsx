import React from 'react';
import { useTheme, type DefaultTheme } from 'styled-components'; // Import useTheme if needed for default props
import {
  SpinnerContainer,
  SpinnerWithMessageContainer,
  SpinnerText
} from './LoadingSpinner.styles';

interface LoadingSpinnerProps {
  size?: string;      // e.g., '30px', '1.5em'. Default will be from styles.
  color?: string;     // Override theme accent color for spinner.
  thickness?: string; // e.g., '4px'. Default will be from styles.
  message?: string;   // Optional message to display.
  className?: string; // For additional styling via styled-components or CSS.
  inline?: boolean;   // If true, spinner (without message) is display: inline-block.
  centerMessage?: boolean; // If true and message is present, centers the spinner and message.
  style?: React.CSSProperties; // Allow passing standard style object
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size,
  color,
  thickness,
  message,
  className,
  inline = false, // Default to false
  centerMessage = false, // Default to false
  style,
}) => {
  // const theme = useTheme() as DefaultTheme; // Uncomment if you need theme for default prop values not handled by styled-component defaults

  if (message) {
    return (
      <SpinnerWithMessageContainer className={className} $center={centerMessage} style={style}>
        <SpinnerContainer
          $size={size}
          $color={color}
          $thickness={thickness}
          // $inline prop is not directly applicable when a message is present and container is flex-column
        />
        <SpinnerText>{message}</SpinnerText>
      </SpinnerWithMessageContainer>
    );
  }

  return (
    <SpinnerContainer
      className={className}
      $size={size}
      $color={color}
      $thickness={thickness}
      $inline={inline}
      style={style}
      role="status" // Accessibility: indicates a status update region
      aria-live="polite" // Or "assertive" if the update is critical
      aria-label={message || "Loading"} // Provide a label for screen readers
    />
  );
};

export default LoadingSpinner;
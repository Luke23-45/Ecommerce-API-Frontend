// src/components/common/LoadingSpinner/LoadingSpinner.tsx

import React from 'react';
import {
  SpinnerContainer,
  SpinnerWithMessageContainer,
  SpinnerText,
  FullscreenSpinnerWrapper, // <-- Import the new wrapper
} from './LoadingSpinner.styles';

interface LoadingSpinnerProps {
  size?: string;
  color?: string;
  thickness?: string;
  message?: string;
  className?: string;
  inline?: boolean;
  centerMessage?: boolean; // This is now used by the fullscreen wrapper
  fullscreen?: boolean; // <-- Add the new fullscreen prop
  style?: React.CSSProperties;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size,
  color,
  thickness,
  message,
  className,
  inline = false,
  centerMessage = true, // Default to true for better visuals with a message
  fullscreen = false, // Default to false
  style,
}) => {
  const spinnerContent = message ? (
    // When there's a message, we always use the container
    <SpinnerWithMessageContainer className={className} $center={centerMessage} style={style}>
      <SpinnerContainer
        $size={size}
        $color={color}
        $thickness={thickness}
      />
      <SpinnerText>{message}</SpinnerText>
    </SpinnerWithMessageContainer>
  ) : (
    // When there's no message, it's just the spinner itself
    <SpinnerContainer
      className={className}
      $size={size}
      $color={color}
      $thickness={thickness}
      $inline={inline}
      style={style}
      role="status"
      aria-live="polite"
      aria-label={message || "Loading"}
    />
  );

  // --- ** THE FIX ** ---
  // If the fullscreen prop is true, wrap our content in the new fullscreen wrapper.
  if (fullscreen) {
    return (
      <FullscreenSpinnerWrapper>
        {spinnerContent}
      </FullscreenSpinnerWrapper>
    );
  }

  // Otherwise, just return the content as is.
  return spinnerContent;
};

export default LoadingSpinner;
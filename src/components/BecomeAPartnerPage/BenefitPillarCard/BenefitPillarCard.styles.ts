// src/components/BecomeAPartnerPage/BenefitPillarCard/BenefitPillarCard.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { transparentize, lighten, darken, rgba } from 'polished';

const pillarCardEntrance = keyframes`
  from {
    opacity: 0;
    transform: translateY(25px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const iconAnimateOnHover = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(5deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

export const PillarCardWrapper = styled.div<{ $animationDelay?: string }>`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.xlarge}; /* Softer, larger radius */
  padding: ${({ theme }) => theme.spacing(7)}; /* Generous padding */
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align content to the start (left) */
  text-align: left;
  height: 100%; // For equal height in grid
  position: relative;
  overflow: hidden; // For pseudo-elements

  border: 1px solid ${({ theme }) => theme.colors.lightGray}; // Softer default border
  box-shadow: 0 4px 12px ${({theme}) => rgba(darken(0.1, theme.colors.primaryNeutral), 0.04)}; // Very subtle initial shadow

  /* Staggered Entrance Animation */
  opacity: 0;
  animation: ${pillarCardEntrance} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${(props) => props.$animationDelay || '0s'};

  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;

  /* Decorative accent line (subtle) */
  &::before {
    content: '';
    position: absolute;
    left: ${({ theme }) => theme.spacing(5)};
    top: ${({ theme }) => theme.spacing(5)};
    width: 3px;
    height: 0; // Will animate height on hover
    background-color: ${({ theme }) => theme.colors.accent1};
    border-radius: 3px;
    transition: height 0.3s ease-out;
    z-index: 0;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.medium}; // Refined shadow from global theme
    border-color: ${({ theme }) => transparentize(0.7, theme.colors.accent1)};

    &::before {
      height: 50px; // Animate in the accent line
    }

    .pillar-icon-container svg { // Animate icon on card hover
      // animation: ${iconAnimateOnHover} 0.5s ease-in-out; // Can be too much, direct transform is often better
      transform: scale(1.1) rotate(3deg);
      color: ${({ theme }) => theme.colors.accent1Vibrant || theme.colors.accent1};
    }
  }
`;

export const PillarIconContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  font-size: 2.75rem; // Larger, impactful icon
  color: ${({ theme }) => theme.colors.accent1}; // Primary accent color
  line-height: 1;
  padding: ${({ theme }) => theme.spacing(2)}; // Padding around icon
  background-color: ${({ theme }) => transparentize(0.92, theme.colors.accent1)}; // Subtle background circle for icon
  border-radius: 50%; // Make it circular
  display: inline-flex; // To size based on content
  box-shadow: 0 2px 6px ${({theme}) => transparentize(0.9, theme.colors.accent1)}; // Subtle glow for icon
  z-index: 1; // Above ::before element
  
  svg {
    transition: transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275), /* Springy effect */
                color 0.3s ease-out;
    display: block;
  }
`;

export const PillarTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; // Playfair Display
  font-size: clamp(1.25rem, 3vw, 1.6rem); // Prominent yet elegant
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
  line-height: 1.3;
  position: relative;
  z-index: 1;
`;

export const PillarDescription = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily}; // Inter
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.75; // Excellent readability
  margin: 0;
  position: relative;
  z-index: 1;
  flex-grow: 1; // If card uses flex-direction column and items are equal height
`;
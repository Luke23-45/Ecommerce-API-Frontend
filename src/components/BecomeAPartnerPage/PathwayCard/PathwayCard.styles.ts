// src/components/BecomeAPartnerPage/PathwayCard/PathwayCard.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { transparentize, lighten, darken, rgba } from 'polished';

const cardEntrance = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const PathwayCardWrapper = styled.div<{ $isFeatured?: boolean; $animationDelay?: string }>`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.xlarge};
  padding: ${({ theme }) => theme.spacing(7)};
  border: 1px solid ${({ theme, $isFeatured }) => 
    $isFeatured ? theme.colors.accent1 : theme.colors.lightGray
  };
  box-shadow: ${({ theme, $isFeatured }) => 
    $isFeatured ? `0 8px 30px ${transparentize(0.85, theme.colors.accent1)}` : theme.shadows.md
  };
  display: flex;
  flex-direction: column;
  height: 100%; /* For equal height in a grid row */
  position: relative;
  overflow: hidden; /* For potential decorative elements */
  
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out;

  opacity: 0;
  animation: ${cardEntrance} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${(props) => props.$animationDelay || '0s'};

  &:hover {
    transform: translateY(-8px) scale(1.01);
    box-shadow: ${({ theme, $isFeatured }) => 
      $isFeatured ? `0 12px 40px ${transparentize(0.8, theme.colors.accent1)}` : theme.shadows.lg
    };
    border-color: ${({ theme, $isFeatured }) => 
      $isFeatured ? darken(0.05, theme.colors.accent1) : theme.colors.accent1
    };
  }

  /* Optional: Subtle top accent border if not featured */
  ${({ theme, $isFeatured }) => !$isFeatured && css`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0; // Animates in on hover or focus
      height: 4px;
      background-color: ${theme.colors.accent2}; // Secondary accent for non-featured
      border-radius: 0 0 4px 4px;
      transition: width 0.3s ease-out;
    }
    &:hover::before {
      width: 80px;
    }
  `}
`;

export const PathwayIconAndTitle = styled.div`
  display: flex;
  flex-direction: column; /* Stack icon above title */
  align-items: center;   /* Center icon and title */
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  text-align: center;
`;

export const PathwayIconContainer = styled.div<{ $isFeatured?: boolean }>`
  font-size: 3.5rem; /* Large, prominent icon */
  color: ${({ theme, $isFeatured }) => $isFeatured ? theme.colors.accent1 : theme.colors.accent2};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  line-height: 1;
  padding: ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme, $isFeatured }) => 
    transparentize(0.92, $isFeatured ? theme.colors.accent1 : theme.colors.accent2)
  };
  border-radius: 50%;
  width: 90px; /* Fixed size for circle */
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease-out, background-color 0.3s ease-out;

  ${PathwayCardWrapper}:hover & { // Icon animates when card is hovered
    transform: scale(1.1);
    background-color: ${({ theme, $isFeatured }) => 
      transparentize(0.88, $isFeatured ? theme.colors.accent1 : theme.colors.accent2)
    };
  }

  svg { display: block; }
`;

export const PathwayTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; // Playfair Display
  font-size: clamp(1.5rem, 4vw, 2rem); // Matches UserProfile Section Titles
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

export const PathwayDescription = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily}; // Inter
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.7;
  margin: 0 0 ${({ theme }) => theme.spacing(5)} 0;
  text-align: center; // Center description for balance
  min-height: 90px; // Reserve space to help align cards if descriptions vary
`;

export const SectionSubHeading = styled.h4`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.medium};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: ${({ theme }) => theme.spacing(5)} 0 ${({ theme }) => theme.spacing(2)} 0;
  padding-bottom: ${({ theme }) => theme.spacing(1)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  text-align: left; // Keep subheadings aligned left
`;

export const HighlightsList = styled.ul`
  list-style: none; /* Remove default bullets */
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
  text-align: left;

  li {
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    color: ${({ theme }) => theme.colors.textMedium};
    padding-left: ${({ theme }) => theme.spacing(3.5)};
    position: relative;
    line-height: 1.6;
    margin-bottom: ${({ theme }) => theme.spacing(1.5)};

    /* Custom bullet using Élan accent */
    &::before {
      content: '•';
      position: absolute;
      left: 0;
      top: 0px; /* Adjust for vertical alignment */
      color: ${({ theme }) => theme.colors.accent1};
      font-size: 1.2em; /* Size of the bullet */
      line-height: inherit;
    }
  }
`;

export const FeesList = styled.div` // Changed from p to div for better structure
  text-align: left;
  margin-bottom: ${({ theme }) => theme.spacing(6)};

  p {
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    color: ${({ theme }) => theme.colors.textMedium};
    line-height: 1.5;
    margin: 0 0 ${({ theme }) => theme.spacing(1.5)} 0;

    em { /* For "Subscription:", "Commission:" labels */
      font-style: normal;
      font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
      color: ${({ theme }) => theme.colors.textDark};
      margin-right: ${({ theme }) => theme.spacing(1)};
    }
  }
`;

export const PathwayCtaButtonWrapper = styled.div`
  margin-top: auto; /* Pushes button to the bottom of the card */
  padding-top: ${({ theme }) => theme.spacing(4)}; /* Space above button */
  width: 100%;
`;
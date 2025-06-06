// src/components/BecomeAPartnerPage/ProcessComicPanel/ProcessComicPanel.styles.ts
import styled, { keyframes, css } from 'styled-components';
import { transparentize, lighten, darken, rgba } from 'polished';

// --- Keyframes ---
const panelEntrance = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) perspective(500px) rotateX(-15deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) perspective(500px) rotateX(0deg);
  }
`;

// --- Comic Panel Wrapper (Each Step) ---
export const ComicPanelWrapper = styled.div<{ 
  $animationDelay?: string;
  $hasNextStepInRow?: boolean; // For optional connecting arrow
}>`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 2.5px solid ${({ theme }) => theme.colors.textDark};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 0; 
  display: flex;
  flex-direction: column;
  box-shadow: 5px 5px 0px 0px ${({ theme }) => transparentize(0.8, theme.colors.textDark)};
  position: relative;
  height: 100%; // For equal height cards in a grid

  opacity: 0;
  transform-origin: bottom center;
  animation: ${panelEntrance} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${(props) => props.$animationDelay || '0s'};
  
  transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;

  &:hover {
    transform: translateY(-4px) rotate(-0.5deg); 
    box-shadow: 7px 7px 0px 0px ${({ theme }) => transparentize(0.7, theme.colors.accent1)};
    
    /* Hover effect for the image inside PanelVisualContainer when ComicPanelWrapper is hovered */
    /* Targeting by class name if direct child selector is complex */
    .panel-visual-image {
      transform: scale(1.03);
    }
  }

  /* Connecting Arrow Styles (Desktop only, if $hasNextStepInRow is true) */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) { 
    ${(props) => props.$hasNextStepInRow && css`
      &::after {
        content: '';
        position: absolute;
        top: 50%; 
        right: -${({ theme }) => theme.spacing(3.25)}; /* Approx (grid-gap / 2) - (arrow_width / 2) */
                                                         /* Assumes grid-gap of ~spacing(6) to spacing(7) */
        transform: translateY(-50%);
        width: 0; 
        height: 0;
        border-top: 7px solid transparent;
        border-bottom: 7px solid transparent;
        border-left: 10px solid ${({ theme }) => theme.colors.textDark}; /* Arrow color */
        z-index: 0;
      }
    `}
  }
`;

// --- Caption Box for Step Title ---
export const PanelCaptionBox = styled.div`
  background-color: ${({ theme }) => theme.colors.accent2}; 
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(4)};
  border-radius: calc(${({ theme }) => theme.borderRadius.medium} - 2.5px) calc(${({ theme }) => theme.borderRadius.medium} - 2.5px) 0 0; /* Adjust for parent border */
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.medium};
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: center;
  border-bottom: 2.5px solid ${({ theme }) => darken(0.1, theme.colors.accent2)};
`;

// --- Visual Area for Icon/Illustration/Sketch ---
export const PanelVisualContainer = styled.div`
  width: calc(100% - ${({ theme }) => theme.spacing(6)}); /* Take full width minus some internal padding */
  margin: ${({ theme }) => theme.spacing(4)} auto; /* Vertical margin, centered horizontally */
  aspect-ratio: 4 / 3; /* Or adjust to your sketch's dominant aspect ratio (e.g., 16/10, 1/1) */
  padding: ${({ theme }) => theme.spacing(1.5)}; /* Small internal padding for the image */
  background-color: ${({ theme }) => lighten(0.04, theme.colors.primaryNeutral)};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; 
  /* border: 1px solid ${({ theme }) => theme.colors.lightGray}; // Optional subtle border */
  box-shadow: inset 0 0 6px ${({theme}) => rgba(theme.colors.textDark, 0.06)}; // Subtle inset shadow

  img { /* Styling for the <img> tag containing your sketch */
    display: block;
    max-width: 100%;
    max-height: 100%;
    width: auto;  /* Maintain aspect ratio */
    height: auto; /* Maintain aspect ratio */
    object-fit: contain; /* ENSURES THE ENTIRE SKETCH IS VISIBLE without cropping */
    border-radius: inherit; /* Inherit radius from container if image fills it */
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* For hover zoom from parent */
  }

  /* If using react-icons directly as fallback or simple visual */
  svg {
    font-size: 4rem; 
    color: ${({ theme }) => theme.colors.accent1};
    max-width: 75%;
    max-height: 75%;
    object-fit: contain;
  }
`;

// --- Speech Bubble for Description ---
export const PanelSpeechBubble = styled.p`
  background-color: ${({ theme }) => lighten(0.03, theme.colors.backgroundLight)};
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(3.5)};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  border: 1.5px solid ${({ theme }) => theme.colors.mediumGray};
  font-family: 'Comic Neue', 'Inter', sans-serif; /* Ensure 'Comic Neue' is imported via Google Fonts */
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.55;
  margin: ${({ theme }) => theme.spacing(0)} /* No top margin if Visual is above */
          ${({ theme }) => theme.spacing(4)} /* Horizontal margin */
          ${({ theme }) => theme.spacing(4)} /* Bottom margin */;
  position: relative;
  text-align: left;
  box-shadow: 2px 2px 0px 0px ${({ theme }) => transparentize(0.88, theme.colors.textDark)};
  flex-grow: 1; // Helps ensure consistent height if panels are in a flex row that stretches

  &::before { /* Speech bubble tail */
    content: '';
    position: absolute;
    top: -9px; 
    left: 35px; /* Adjust as needed for tail position */
    width: 0; height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid ${({ theme }) => lighten(0.03, theme.colors.backgroundLight)};
    filter: drop-shadow(0 -1.5px 0px ${({theme}) => theme.colors.mediumGray}); /* Tail border illusion */
  }
`;
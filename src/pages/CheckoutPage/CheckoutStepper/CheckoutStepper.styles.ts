// src/components/checkout/CheckoutStepper/CheckoutStepper.styles.ts
import styled, { css,type DefaultTheme } from 'styled-components';
import { darken, lighten } from 'polished';

// Props that will be passed from the component to styled elements
export interface StepStyleProps {
  theme: DefaultTheme;
  $isActive?: boolean;
  $isCompleted?: boolean;
  $isClickable?: boolean;
}

export const StepperStyled = styled.ol`
  display: flex;
  justify-content: space-between;
  align-items: flex-start; // Aligns items to the top if labels are multi-line
  list-style-type: none;
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing(8)} 0; /* Increased bottom margin */
  width: 100%;
  counter-reset: step; /* For optional step numbering if not using icons solely */
`;

export const StepIconContainer = styled.div<StepStyleProps>`
  width: ${({ theme }) => theme.spacing(10)}; /* 40px */
  height: ${({ theme }) => theme.spacing(10)}; /* 40px */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid;
  transition: all 0.25s ${({ theme }) => theme.transitions.base};
  position: relative;
  z-index: 2; /* Above connector lines */
  background-color: ${({ theme }) => theme.colors.backgroundLight}; /* Ensures icon bg is opaque over line */

  svg {
    font-size: 1.25rem; /* Slightly larger icon */
    transition: color 0.25s ${({ theme }) => theme.transitions.base};
  }

  /* Styling based on step state */
  ${({ theme, $isCompleted, $isActive }) => {
    if ($isActive) {
      return css`
        border-color: ${theme.colors.accent1};
        background-color: ${theme.colors.accent1};
        box-shadow: 0 0 0 4px ${lighten(0.3, theme.colors.accent1)}; /* Subtle glow for active */
        svg {
          color: ${theme.colors.textLight};
        }
      `;
    }
    if ($isCompleted) {
      return css`
        border-color: ${theme.colors.accent1};
        background-color: ${theme.colors.accent1Subtle};
        svg {
          color: ${theme.colors.accent1};
        }
      `;
    }
    // Upcoming / Default state
    return css`
      border-color: ${theme.colors.mediumGray};
      background-color: ${theme.colors.backgroundLight};
      svg {
        color: ${theme.colors.textMuted};
      }
    `;
  }}
`;

export const StepLabel = styled.span<StepStyleProps>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small}; /* For labels */
  font-weight: ${({ theme }) => theme.typography.body.weights.regular};
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: ${({ theme }) => theme.spacing(2.5)}; /* Space between icon and label */
  display: block;
  text-align: center;
  transition: color 0.25s ${({ theme }) => theme.transitions.base};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};

  ${({ theme, $isActive }) =>
    $isActive &&
    css`
      color: ${theme.colors.textDark};
      font-weight: ${theme.typography.body.weights.semiBold};
    `}

  ${({ theme, $isCompleted, $isActive }) =>
    $isCompleted &&
    !$isActive && 
    css`
      color: ${theme.colors.textMedium}; /* Completed but not active */
    `}
`;

export const StepClickableArea = styled.div<Pick<StepStyleProps, '$isClickable'>>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({theme}) => theme.spacing(1)}; /* Small padding to ensure bg covers connector edges */
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
  background-color: ${({theme}) => theme.colors.backgroundLight}; /* Opaque background over connector */
  z-index: 2; /* To ensure this area is above the connector line */
  border-radius: ${({theme}) => theme.borderRadius.small}; /* Soften edges slightly if needed */

  transition: transform 0.2s ease-out;

  ${({ theme, $isClickable }) =>
  $isClickable &&
  css`
    &:hover {
      transform: translateY(-2px); /* Slight lift on hover for clickable items */
      ${StepIconContainer} {
        border-color: ${theme.colors.accent1Hover};
        ${(props: StepStyleProps) => props.$isCompleted && !props.$isActive && css`
            background-color: ${lighten(0.02, theme.colors.accent1Subtle)};
        `}
      }
      ${StepLabel} {
         color: ${(props: StepStyleProps) => (props.$isCompleted && !props.$isActive) ? theme.colors.accent1 : theme.colors.textDark};
      }
    }
  `}
`;


export const StepStyled = styled.li<StepStyleProps>`
  flex: 1;
  display: flex;
  flex-direction: column; /* Icon above Label */
  align-items: center; /* Center icon and label horizontally */
  position: relative; /* Crucial for the ::after connector */
  
  /* The Connector Line */
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    // Position the line from the edge of the icon to the edge of the next icon
    left: calc(50% + ${({ theme }) => theme.spacing(5)}); // Start after current icon (40px / 2 + some spacing)
    top: ${({ theme }) => theme.spacing(5)}; // Vertically center with icon (40px / 2)
    
    // Calculate width to span to the next step's center, minus icon radii & padding
    // This is an approximation and might need adjustment based on final layout
    // Essentially (100% of flex item width - icon width)
    width: calc(100% - ${({ theme }) => theme.spacing(10)}); 
    
    height: 2.5px; // Thicker line for premium feel
    background-color: ${(props) =>
      props.$isCompleted ? props.theme.colors.accent1 : props.theme.colors.lightGray};
    
    z-index: 1; // Behind StepClickableArea
    transition: background-color 0.25s ${({ theme }) => theme.transitions.base};
  }

  /* No connector after the last step */
  &:last-child::after {
    display: none;
  }
`;
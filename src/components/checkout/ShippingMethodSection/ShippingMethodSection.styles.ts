// src/pages/CheckoutPage/components/ShippingMethodSection.styles.ts

import styled, { css } from 'styled-components';
import { transparentize } from 'polished';

export const ShippingOptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

interface ShippingOptionCardProps {
  $isSelected: boolean; // Use transient prop
}

export const ShippingOptionCard = styled.div<ShippingOptionCardProps>`
  display: grid;
  grid-template-columns: auto 1fr auto; // Radio, Details, Cost
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing(4)};
  cursor: pointer;
  transition: all 0.25s ease-out;

  &:hover {
    border-color: ${({ theme, $isSelected }) => ($isSelected ? theme.colors.accent1 : theme.colors.mediumGray)};
    background-color: ${({ theme }) => transparentize(0.97, theme.colors.textDark)};
  }

  ${({ theme, $isSelected }) => $isSelected && css`
    border-color: ${theme.colors.accent1};
    box-shadow: 0 0 0 2px ${transparentize(0.75, theme.colors.accent1)};
    background-color: ${transparentize(0.94, theme.colors.accent1)};
  `}
`;

// Re-using RadioCircle from AddressStep for consistency, or define a new one if needed
// For simplicity, we'll assume it's generic enough or you'll create a common Radio component.
// If not, copy the RadioCircle style here.

export const OptionDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const OptionName = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 1rem;
  margin: 0;
`;
export const StepActions = styled.div`
  display: flex;
  justify-content: space-between; // Pushes "Back" to left, "Continue" to right
  align-items: center;
  width: 100%; // Ensure it takes full width of its parent card
  margin-top: ${({ theme }) => theme.spacing(6)}; // Generous space above the actions
  padding-top: ${({ theme }) => theme.spacing(5)}; // Space above the buttons
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray}; // Visual separator

  // On smaller screens, you might want the buttons to stack or take full width
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL || '425px'}) {
    flex-direction: column-reverse; // Stack "Continue" above "Back"
    gap: ${({ theme }) => theme.spacing(3)};
    align-items: stretch; // Make buttons take full width when stacked

    & > button { // Target direct button children
      width: 100%;
    }
  }
`;
export const OptionDescription = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMedium};
  margin: ${({ theme }) => theme.spacing(1)} 0 0 0;
`;

export const OptionCost = styled.p`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
  text-align: right;
  white-space: nowrap;
`;
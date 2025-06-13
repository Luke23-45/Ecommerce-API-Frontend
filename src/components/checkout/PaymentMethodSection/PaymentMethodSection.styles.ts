// src/pages/CheckoutPage/components/PaymentMethodSection.styles.ts

import styled, { css } from 'styled-components';
import { transparentize, lighten } from 'polished';

export const PaymentMethodList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
`;

interface PaymentOptionCardProps {
  $isSelected: boolean; // Use transient prop
}

export const PaymentOptionCard = styled.div<PaymentOptionCardProps>`
  display: flex;
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

export const PaymentOptionDetails = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const PaymentOptionText = styled.span`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 0.95rem;
`;

export const PaymentFormWrapper = styled.div<{ isOpen: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-top: ${({ theme }) => theme.spacing(3)};
  background: ${({ theme }) => lighten(0.02, theme.colors.backgroundLight)};
  
  max-height: ${({ isOpen }) => (isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              padding 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              margin-top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: ${({ isOpen, theme }) => (isOpen ? theme.spacing(4) : '0')};
  margin-top: ${({ isOpen, theme }) => (isOpen ? theme.spacing(3) : '0')};

  .StripeElement {
    padding: 12px;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    background-color: white;
    border: 1px solid ${({ theme }) => theme.colors.mediumGray};
    transition: box-shadow 150ms ease, border 150ms ease;

    &--focus {
      border-color: ${({ theme }) => theme.colors.accent1};
      box-shadow: 0 0 0 3px ${({theme}) => transparentize(0.8, theme.colors.accent1)};
    }
    &--invalid {
      border-color: ${({ theme }) => theme.colors.adminStatusError};
    }
  }
`;

export const PaymentError = styled.div`
  color: ${({ theme }) => theme.colors.adminStatusError};
  background-color: ${({ theme }) => transparentize(0.9, theme.colors.adminStatusError)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing(2.5)};
  margin-top: ${({ theme }) => theme.spacing(3)};
  font-size: 0.9rem;
  font-weight: 500;
  text-align: center;
`;
interface RadioCircleProps {
  $isSelected: boolean; // Use transient prop with '$'
  disabled?: boolean; // Optional: to style a disabled state
}

export const RadioCircle = styled.div<RadioCircleProps>`
  width: 22px; // Standard radio button size
  height: 22px;
  border-radius: 50%; // Makes it a circle
  border: 2px solid ${({ theme, $isSelected }) => 
    $isSelected ? theme.colors.accent1 : theme.colors.mediumGray
  };
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0; // Prevents it from shrinking in flex layouts
  transition: all 0.2s ease-out;
  cursor: pointer; // Indicate it's clickable (if the parent card is clickable)

  // The inner dot that appears when selected
  &::after {
    content: '';
    width: 10px; // Smaller than the outer circle
    height: 10px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.accent1};
    transform: scale(0); // Hidden by default
    transition: transform 0.15s ease-out;
    
    ${({ $isSelected }) => $isSelected && css`
      transform: scale(1); // Visible when selected
    `}
  }

  // Optional: Style for when the parent is disabled
  ${({ theme, disabled }) => disabled && css`
    border-color: ${theme.colors.lightGray};
    background-color: ${theme.colors.primaryNeutral};
    cursor: not-allowed;

    &::after {
      background-color: ${theme.colors.mediumGray};
    }
  `}
`;
export const SecurityInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(3)} 0;
  margin-top: ${({ theme }) => theme.spacing(3)};
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: 0.85rem;

  svg {
    color: ${({ theme }) => theme.colors.accent2};
    flex-shrink: 0;
    font-size: 1.1em;
  }
`;
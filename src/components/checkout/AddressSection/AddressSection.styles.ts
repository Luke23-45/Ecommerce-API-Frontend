// src/pages/CheckoutPage/components/AddressSection.styles.ts

import styled, { css } from 'styled-components';
import { transparentize, lighten } from 'polished';

export const AddressList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }
`;

interface AddressCardProps {
  $isSelected: boolean;
}

export const AddressCard = styled.div<AddressCardProps>`
  border: 2px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing(4)};
  cursor: pointer;
  position: relative;
  transition: all 0.25s ease-out;
  background-color: ${({ theme }) => lighten(0.02, theme.colors.backgroundLight)};

  &:hover {
    border-color: ${({ theme, $isSelected }) => ($isSelected ? theme.colors.accent1 : theme.colors.mediumGray)};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }

  ${({ theme, $isSelected }) => $isSelected && css`
    border-color: ${theme.colors.accent1};
    box-shadow: 0 0 0 2px ${transparentize(0.7, theme.colors.accent1)}, ${({ theme }) => theme.shadows.medium};
    background-color: ${transparentize(0.95, theme.colors.accent1)};
  `}
`;

export const AddressContent = styled.div`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.6;

  strong { // Name
    display: block;
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
  span { // Each line of the address
    display: block;
  }
`;

export const DefaultBadge = styled.span`
  display: inline-block;
  background-color: ${({ theme }) => transparentize(0.9, theme.colors.accent2)};
  color: ${({ theme }) => theme.colors.accent2};
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  font-size: 0.7rem;
  font-weight: 700;
  margin-top: ${({ theme }) => theme.spacing(2)};
  letter-spacing: 0.5px;
`;

export const SelectionIndicator = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.accent1};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
`;

export const AddNewAddressButtonWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const AddressFormWrapper = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '1000px' : '0')};
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              padding 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              margin-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  padding: ${({ isOpen, theme }) => (isOpen ? `${theme.spacing(4)} 0` : '0')};
  margin-top: ${({ isOpen, theme }) => (isOpen ? theme.spacing(4) : '0')};
  border-top: ${({ isOpen, theme }) => (isOpen ? `1px dashed ${theme.colors.lightGray}` : 'none')};

  form {
    display: grid;
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing(3)};

    @media (min-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
      grid-template-columns: 1fr 1fr;
      // Some fields can span both columns using grid-column: span 2;
    }
  }
`;

export const FormActions = styled.div`
  grid-column: span 1; // Default span
  display: flex;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(2)};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    grid-column: span 2; // Span both columns on larger screens
    justify-content: flex-end;
  }
`;

export const SameAsShippingWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  padding: ${({ theme }) => theme.spacing(3)};
  background-color: ${({ theme }) => lighten(0.045, theme.colors.primaryNeutral)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
`;
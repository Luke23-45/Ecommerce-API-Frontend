// src/components/orders/OrderCard/OrderCard.styles.ts
import styled, { css } from 'styled-components';
import { lighten, darken, transparentize } from 'polished';
import { StatusBadge as CommonStatusBadge } from '@/pages/AccountPages/OrderListPage/OrderListPage.styles'; // Import shared StatusBadge

export const OrderCardStyled = styled.article`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all 0.25s ${({ theme }) => theme.transitions.base};
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-3px);
  }
`;

export const OrderCardHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const OrderInfo = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  svg {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const OrderCardBody = styled.div`
  padding: ${({ theme }) => theme.spacing(4)};
  display: flex;
  justify-content: space-between;
  align-items: flex-start; // Align items to the top
  gap: ${({ theme }) => theme.spacing(4)};

  @media (max-width: ${({theme}) => theme.breakpoints.mobileL}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const OrderItemsPreview = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  flex-grow: 1; // Allow it to take up space

  .item-summary {
    display: flex;
    flex-direction: column;
  }
  p.main-item-name {
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0 0 ${({ theme }) => theme.spacing(0.5)} 0;
    line-height: 1.3;
  }
`;

export const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({theme}) => theme.colors.lightGray}; // Placeholder bg
  border: 1px solid ${({theme}) => theme.colors.adminBorder}; // Subtle border
`;

export const ItemCount = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

export const OrderStatus = styled(CommonStatusBadge)` // Extend the common StatusBadge
  // Add any specific overrides for status within an order card here if needed
  // For example, slightly larger font or different margin.
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  align-self: flex-start; // For column layout in mobile

   @media (min-width: ${({theme}) => theme.breakpoints.tablet}) {
    align-self: flex-end; // Align to right on wider screens
  }
`;

export const OrderTotal = styled.p`
  font-size: ${({ theme }) => theme.typography.heading.sizes.h6}; // Use heading scale
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; // Playfair
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
  color: ${({ theme }) => theme.colors.accent1}; // Accent for total
  margin: 0;
  text-align: right;
  white-space: nowrap;
`;

export const OrderCardFooter = styled.footer`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
  background-color: ${({ theme }) => lighten(0.025, theme.colors.primaryNeutral)}; // Slightly off-white
`;

export const StatusTotalBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  min-width: 120px; // Ensure it has some width
  
  ${OrderStatus} { // Target the specific OrderStatus when inside this block
    align-self: flex-end;
  }
  
   @media (max-width: ${({theme}) => theme.breakpoints.mobileL}) {
    align-items: flex-start;
    text-align: left;
    margin-top: ${({theme}) => theme.spacing(3)};
    width: 100%;
     ${OrderStatus} {
        align-self: flex-start;
    }
  }
`;

export const PrimaryButton = styled.button`
  background-color: ${({ theme }) => theme.colors.accent1};
  color: ${({ theme }) => theme.colors.textLight};

  font-size: ${({ theme }) => theme.typography.body.sizes.medium};
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.pill}; // A softer pill shape
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94), background-color 0.2s ease-out;
  box-shadow: 0 4px 15px ${({theme}) => transparentize(0.8, theme.colors.accent1)};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => darken(0.05, theme.colors.accent1)};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${({theme}) => transparentize(0.7, theme.colors.accent1)};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textMedium};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
  border: 1px solid ${({ theme }) => theme.colors.accent1}; // Use a subtle border color: ;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  cursor: pointer;
  transition: background-color 0.2s ease-out, color 0.2s ease-out, border-color 0.2s ease-out;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => transparentize(0.95, theme.colors.textDark)};
    border-color: ${({ theme }) => theme.colors.textMedium};
    color: ${({ theme }) => theme.colors.textDark};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
    border-color: ${({ theme }) => theme.colors.accent1};
    cursor: not-allowed;
  }
`;
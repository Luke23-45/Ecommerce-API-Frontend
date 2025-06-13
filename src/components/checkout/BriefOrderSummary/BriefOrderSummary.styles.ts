// src/pages/CheckoutPage/components/BriefOrderSummary.styles.ts

import styled, { css } from 'styled-components';
import { darken, lighten, transparentize } from 'polished';

export const SummaryCardWrapper = styled.div`
  background: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing(5)};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const SummaryTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const ItemPreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  max-height: 200px; // Allow scrolling if many items, though we'll limit display
  overflow-y: auto;
`;

export const ItemPreview = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const ItemPreviewThumbnail = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.lightGray}; // Placeholder bg

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ItemPreviewDetails = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.4;

  .name {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.textDark};
    display: block;
  }
  .quantity {
    font-size: 0.8rem;
  }
`;

export const ViewAllItemsLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent1};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: underline;
  display: block;
  margin-top: ${({ theme }) => theme.spacing(2)};
  text-align: right;

  &:hover {
    color: ${({ theme }) => theme.colors.accent1Vibrant};
  }
`;

export const SubtotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(3)} 0;
  margin-top: ${({ theme }) => theme.spacing(3)};
  border-top: 1px dashed ${({ theme }) => theme.colors.lightGray};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
`;

export const SubtotalLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const SubtotalValue = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

export const ProceedButtonWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(5)};
`;

export const DiscountInputWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing(4)} 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center; /* Align icon with input/button */

  svg { // For an optional gift icon
    color: ${({ theme }) => theme.colors.textMedium};
    font-size: 1.2rem;
    margin-right: ${({ theme }) => theme.spacing(1)};
  }

  input {
    flex-grow: 1;
    padding: ${({ theme }) => theme.spacing(2.5)};
    border: 1px solid ${({ theme }) => theme.colors.mediumGray};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    &:focus {
      border-color: ${({ theme }) => theme.colors.accent1};
      box-shadow: 0 0 0 2px ${({theme}) => transparentize(0.8, theme.colors.accent1)};
      outline: none;
    }
  }

  button {
    padding: 0 ${({ theme }) => theme.spacing(4)};
    height: 44px; // Match input height
    background-color: ${({ theme }) => theme.colors.textDark};
    color: ${({ theme }) => theme.colors.textLight};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s ease;
    white-space: nowrap;
    &:hover { background-color: ${({ theme }) => darken(0.1, theme.colors.textDark)}; }
  }
`;

export const DiscountMessage = styled.div<{ $type: 'success' | 'error' }>`
  font-size: 0.85rem;
  padding: ${({ theme }) => theme.spacing(2)};
  margin-top: -${({ theme }) => theme.spacing(2)}; // Pull it up slightly below the input
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  text-align: center;

  ${({ theme, $type }) => $type === 'success' && css`
    color: ${theme.colors.adminStatusSuccess};
    background-color: ${transparentize(0.9, theme.colors.adminStatusSuccess)};
  `}
  ${({ theme, $type }) => $type === 'error' && css`
    color: ${theme.colors.adminStatusError};
    background-color: ${transparentize(0.9, theme.colors.adminStatusError)};
  `}
`;

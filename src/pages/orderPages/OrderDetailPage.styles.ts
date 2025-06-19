// src/pages/AccountPages/OrderDetailPage/OrderDetailPage.styles.ts

import styled, { keyframes } from 'styled-components';
import { lighten, darken, transparentize } from 'polished';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const OrderDetailPageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryNeutral || '#F9F9F8'};
  width: 100%;
  min-height: calc(100vh - ${({theme}) => (theme.dimensions as any)?.headerHeight || '90px'});
  padding: ${({ theme }) => theme.spacing(8)} 0 ${({ theme }) => theme.spacing(16)};
  animation: ${fadeIn} 0.6s ease-out;
`;

export const OrderDetailContentLimiter = styled.div`
  max-width: 850px; // Optimized for readability of detailed information
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.containerPadding};
`;

export const OrderDetailHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};

  h1 {
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: clamp(1.8rem, 4vw, 2.2rem); // Slightly more subdued than main page titles
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0;
  }
`;

export const BackLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMedium};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  transition: color 0.2s ease;
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(2)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};

  &:hover {
    color: ${({ theme }) => theme.colors.accent1};
    background-color: ${({ theme }) => transparentize(0.92, theme.colors.accent1)};
  }
  svg { transition: transform 0.2s ease-out; }
  &:hover svg { transform: translateX(-3px); }
`;

export const OrderMetaInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => lighten(0.04, theme.colors.primaryNeutral)};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`;

export const MetaItem = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.5;
  
  strong {
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: 600;
    display: block; // For better spacing if value wraps
    margin-bottom: 2px;
  }
`;

export const OrderSectionCard = styled.section`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.xlarge}; // Larger radius for a softer look
  padding: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  border: 1px solid ${({ theme }) => transparentize(0.9, theme.colors.textDark)};
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: 1.4rem; // Clear but not overpowering
  font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(4)} 0;
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};

  svg {
    color: ${({ theme }) => theme.colors.accent1};
    font-size: 1.2em; // Slightly larger icon
  }
`;

export const AddressBlock = styled.div`
  font-size: 0.95rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textMedium};
  padding-left: ${({ theme }) => theme.spacing(1)}; // Slight indent for readability

  strong { // For recipient name
    display: block;
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: 600;
    margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  }
  span {
    display: block;
  }
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.5)}; // Items will have their own padding/border
`;

export const OrderItemStyled = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing(4)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const ItemThumbnail = styled.img`
  width: 90px; // Slightly larger thumbnail
  height: 90px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  flex-shrink: 0;
`;

export const ItemDetails = styled.div`
  flex-grow: 1;
  padding-top: ${({ theme }) => theme.spacing(1)}; // Align text better with image
`;

export const ItemName = styled.h3`
  font-size: 1.05rem; // More prominent name
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(1.5)} 0;
  line-height: 1.3;
  
  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover {
      color: ${({ theme }) => theme.colors.accent1};
    }
  }
`;

export const ItemVariantInfo = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0 0 ${({ theme }) => theme.spacing(1)} 0;
  text-transform: capitalize;
`;

export const ItemPriceAndQuantity = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textDark};
  text-align: right;
  line-height: 1.6;
  white-space: nowrap;
  padding-top: ${({ theme }) => theme.spacing(1)};

  strong {
    font-weight: 600;
    display: block; // Total on new line
    margin-top: ${({ theme }) => theme.spacing(0.5)};
  }
`;

export const OrderSummaryGrid = styled.div`
  margin-top: ${({ theme }) => theme.spacing(2)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px dashed ${({ theme }) => theme.colors.lightGray};
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(2)} 0;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textMedium};

  &.grand-total {
    font-size: 1.3rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.textDark};
    padding-top: ${({ theme }) => theme.spacing(3)};
    margin-top: ${({ theme }) => theme.spacing(2)};
    border-top: 2px solid ${({ theme }) => theme.colors.textDark};
  }
`;

export const SummaryLabel = styled.span``;
export const SummaryValue = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

export const OrderActionsWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(8)};
  padding-top: ${({ theme }) => theme.spacing(5)};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
  justify-content: flex-end; 
`;
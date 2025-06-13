// src/pages/CheckoutReviewPage/CheckoutReviewPage.styles.ts

import styled, { keyframes } from 'styled-components';

/* --- Inheriting the Premium Design System --- */
const colors = {
  background: '#F7F8FA',
  panelBackground: '#FFFFFF',
  textPrimary: '#2C3E50',
  textSecondary: '#7F8C8D',
  accentPrimary: '#3498DB',
  accentVibrant: '#2980B9',
  border: '#EAECEF',
  success: '#27AE60',
  white: '#FFFFFF',
};

const typography = {
  fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
};

const shadows = {
  soft: '0 4px 12px rgba(44, 62, 80, 0.08)',
  medium: '0 6px 20px rgba(44, 62, 80, 0.12)',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* --- Page Layout --- */

export const ReviewPageWrapper = styled.div`
  background-color: ${colors.background};
  min-height: 100vh;
  font-family: ${typography.fontFamily};
  padding: 4rem 0;
  animation: ${fadeIn} 0.6s ease-out both;

  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

export const ReviewContentLimiter = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

export const ReviewHeader = styled.header`
  text-align: center;
  margin-bottom: 3.5rem;

  h1 {
    font-size: 2.75rem;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 0 0 1rem 0;
  }
`;

export const BackButton = styled.button`
  background: none;
  border: none;
  color: ${colors.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.accentPrimary};
  }
`;

export const ReviewLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 3rem;
  align-items: flex-start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Sidebar = styled.aside`
  position: sticky;
  top: 2rem;

  @media (max-width: 992px) {
    position: static;
  }
`;

/* --- Content Cards --- */

export const ReviewCard = styled.section`
  background: ${colors.panelBackground};
  border-radius: 12px;
  border: 1px solid ${colors.border};
  box-shadow: ${shadows.soft};
`;

export const CardHeader = styled.div`
  padding: 1.5rem 1.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${colors.border};
`;

export const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: ${colors.accentPrimary};
    opacity: 0.9;
  }
`;

export const EditLink = styled.button`
  background: none;
  border: none;
  color: ${colors.accentPrimary};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: ${colors.accentVibrant};
  }
`;

export const CardBody = styled.div`
  padding: 1.75rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.textSecondary};

  strong {
    color: ${colors.textPrimary};
    font-weight: 500;
  }
`;

/* --- Item List Styles --- */

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Item = styled.div`
  display: flex;
  gap: 1.25rem;
  padding: 1.25rem 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${colors.border};
  }
`;

export const ItemThumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background-color: ${colors.background};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ItemDetails = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ItemName = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
  color: ${colors.textPrimary};
  margin: 0 0 0.3rem 0;
`;

export const ItemVariant = styled.p`
  font-size: 0.85rem;
  color: ${colors.textSecondary};
  margin: 0;
`;

export const ItemQuantityPrice = styled.div`
  font-size: 1rem;
  color: ${colors.textPrimary};
  font-weight: 500;
  text-align: right;
  line-height: 1.5;
  white-space: nowrap;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

/* --- Summary Sidebar Styles --- */

export const SummaryCard = styled(ReviewCard)`
  padding: 1.75rem;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 0;
  font-size: 0.95rem;

  &:not(:last-child) {
    border-bottom: 1px dashed ${colors.border};
  }
`;

export const InfoLabel = styled.span`
  color: ${colors.textSecondary};
`;

export const InfoValue = styled.span`
  color: ${colors.textPrimary};
  font-weight: 500;
`;

export const GrandTotalRow = styled(TotalRow)`
  padding-top: 1.25rem;
  margin-top: 0.75rem;
  border-top: 2px solid ${colors.textPrimary};
  border-bottom: none;
  
  ${InfoLabel}, ${InfoValue} {
    font-size: 1.3rem;
    font-weight: 700;
    color: ${colors.textPrimary};
  }
`;

export const DiscountRow = styled(TotalRow)`
  color: ${colors.success};
  ${InfoLabel}, ${InfoValue} {
    color: inherit;
    font-weight: 600;
  }
`;

export const PlaceOrderButton = styled.button`
  width: 100%;
  font-family: ${typography.fontFamily};
  font-weight: 600;
  font-size: 1.15rem;
  padding: 1.1rem 1.75rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  background: ${colors.accentPrimary};
  color: ${colors.white};
  box-shadow: ${shadows.medium};
  margin-top: 2rem;

  &:hover:not(:disabled) {
    background: ${colors.accentVibrant};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(52, 152, 219, 0.4);
  }
`;

export const SecurityNotice = styled.p`
  text-align: center;
  font-size: 0.85rem;
  color: ${colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;

  svg {
    color: ${colors.success};
  }
`;
// src/pages/CheckoutPage/CheckoutPage.styles.ts



import styled, { keyframes } from 'styled-components';

import { rgba, lighten } from 'polished';



const fadeIn = keyframes`

  from { opacity: 0; transform: translateY(15px); }

  to { opacity: 1; transform: translateY(0); }

`;



export const CheckoutPageWrapper = styled.div`

  background-color: '#FFFFFF'; // Changed to white
  min-height: 100vh;

  padding-bottom: ${({ theme }) => theme.spacing(12)};

`;



export const CheckoutContentLimiter = styled.div`

  max-width: ${({ theme }) => theme.maxWidth || '1100px'}; // Slightly narrower for a focused feel

  margin: 0 auto;

  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.containerPadding};



  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {

    padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.containerPadding};

  }

`;



export const CheckoutHeader = styled.header`

  display: flex;

  justify-content: space-between;

  align-items: center;

  padding-bottom: ${({ theme }) => theme.spacing(3)};

  margin-bottom: ${({ theme }) => theme.spacing(5)};

  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  

  h1 {

    font-family: ${({ theme }) => theme.typography.heading.fontFamily};

    font-size: clamp(1.8rem, 4vw, 2.2rem);

    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};

    color: ${({ theme }) => theme.colors.textDark};

    margin: 0;

  }

`;



export const BackButton = styled.button`

  // ... (BackButton styles remain the same as previous)

`;



export const MainCheckoutLayout = styled.div`

  display: grid;

  grid-template-columns: 1fr; // Mobile first - single column

  gap: ${({ theme }) => theme.spacing(8)};

  animation: ${fadeIn} 0.6s ease-out 0.1s both;



  @media (min-width: ${({ theme }) => theme.breakpoints.laptop || '992px'}) {

    grid-template-columns: minmax(0, 1.75fr) minmax(0, 1fr); // 1.75fr for content, 1fr for summary

  }

`;



export const CheckoutStepsColumn = styled.main`

  display: flex;

  flex-direction: column;

  gap: ${({ theme }) => theme.spacing(1.5)}; // Small gap between accordion sections

`;



export const OrderSummaryColumn = styled.aside`

  position: sticky;

  top: ${({ theme }) => `calc(${(theme.dimensions as any)?.headerHeight || '90px'} + ${theme.spacing(6)})`};

  // Sticky top position for desktop

  

  @media (max-width: 991px) {

    position: static; // Unset sticky for tablet and mobile

    margin-top: ${({ theme }) => theme.spacing(6)};

    order: -1; // Display summary at the top on mobile

  }

`;



// --- Shared Styles for Accordion-like Sections ---

export const CheckoutSection = styled.section`

  background: ${({ theme }) => theme.colors.backgroundLight};

  border: 1px solid ${({ theme }) => theme.colors.lightGray};

  border-radius: ${({ theme }) => theme.borderRadius.large};

  transition: box-shadow 0.3s ease;



  &.is-active {

    border-color: ${({ theme }) => theme.colors.accent1};

    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.accent1}, ${({ theme }) => theme.shadows.medium};

  }

`;



export const SectionHeader = styled.div<{ $isClickable?: boolean }>`

  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(5)};

  display: flex;

  justify-content: space-between;

  align-items: center;

  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};



  h2 {

    font-family: ${({ theme }) => theme.typography.heading.fontFamily};

    font-size: 1.25rem;

    font-weight: 600;

    color: ${({ theme }) => theme.colors.textDark};

    margin: 0;

    display: flex;

    align-items: center;

    gap: ${({ theme }) => theme.spacing(2.5)};

  }



  svg.icon {

    color: ${({ theme }) => theme.colors.accent1};

    font-size: 1.2em;

  }

`;



export const SectionContent = styled.div<{ isOpen: boolean }>`

  max-height: ${({ isOpen }) => (isOpen ? '2000px' : '0')}; // Large max-height for content

  overflow: hidden;

  transition: max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 

              padding 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  padding: ${({ isOpen, theme }) => (isOpen ? `0 ${theme.spacing(5)} ${theme.spacing(5)}` : `0 ${theme.spacing(5)}`)};

  border-top: ${({ isOpen, theme }) => (isOpen ? `1px solid ${theme.colors.lightGray}` : 'none')};

`;



export const EditLink = styled.button`

  background: none;

  border: none;

  color: ${({ theme }) => theme.colors.accent1};

  font-size: 0.85rem;

  font-weight: 500;

  cursor: pointer;

  text-decoration: underline;

  padding: ${({ theme }) => theme.spacing(1)};

  

  &:hover {

    color: ${({ theme }) => theme.colors.accent1Vibrant};

  }

`;



export const SectionSummary = styled.div`

  color: ${({ theme }) => theme.colors.textMedium};

  font-size: 0.9rem;

`;
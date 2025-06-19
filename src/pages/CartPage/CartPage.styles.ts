// src/pages/CartPage/CartPage.styles.ts
import styled, { keyframes } from "styled-components";
import { lighten, darken, transparentize, rgba } from "polished";

// --- Keyframes for subtle animations ---
const fadeInSmooth = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Page Wrapper ---
export const CartPageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryNeutral || "#F9F9F8"};
  width: 100%;
  min-height: 80vh;
  // Apply generous padding on the top and bottom. The side padding comes from the container.
  padding-top: ${({ theme }) => theme.spacing(10)}; // e.g., 40px
  padding-bottom: ${({ theme }) => theme.spacing(16)}; // e.g., 64px
  animation: ${fadeInSmooth} 0.5s ease-out;
    padding: ${(props) => props.theme.spacing(10)} 0;
`;

// --- Content Limiter (to constrain main content width) ---
export const CartContentLimiter = styled.div`
  max-width: ${({ theme }) => theme.maxWidth || "1200px"};
  margin: 0 auto;
`;

// --- Cart Header ---
export const CartHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing(8)};
  padding-bottom: ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  justify-content: space-between;
  align-items: baseline; // Align baseline of title and link
  flex-wrap: wrap; // Allow wrapping on smaller screens
  gap: ${({ theme }) => theme.spacing(3)};

  h1 {
    /* Page Title: "Your Shopping Bag" */
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: clamp(2rem, 5vw, 3rem); /* Prominent and responsive */
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0;
    line-height: 1.2;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const ItemCountDisplay = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const ContinueShoppingLink = styled.a`
  // Or RouterLink
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.accent1};
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  text-decoration: none;
  transition: color 0.2s ease-out;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};

  &:hover {
    color: ${({ theme }) => darken(0.1, theme.colors.accent1)};
    text-decoration: underline;
  }
  svg {
    font-size: 0.9em;
  }
`;

// --- Main Cart Layout (Items List + Order Summary) ---
export const MainCartLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; /* Items list takes more space */
  gap: ${({ theme }) => theme.spacing(8)};
  align-items: flex-start; /* Align items to the top of their grid cells */

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop || "1024px"}) {
    grid-template-columns: 1.8fr 1fr; /* Slightly adjust ratio */
    gap: ${({ theme }) => theme.spacing(6)};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || "768px"}) {
    grid-template-columns: 1fr; /* Stack on tablet and mobile */
    gap: ${({ theme }) => theme.spacing(8)}; /* Vertical gap when stacked */
  }
`;

// --- Cart Items List Area ---
export const CartItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) =>
    theme.spacing(
      0.5
    )}; /* No large gap, items themselves will have top/bottom borders */
`;

// Styles for Individual Cart Item (will be in CartItem.styles.ts, but defining shell here)
// export const CartItemRow = styled.div` ... `

// --- Order Summary Block ---
export const OrderSummaryWrapper = styled.aside`
  background-color: ${({ theme }) =>
    theme.colors.primaryNeutral}; /* Subtle off-white background */
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing(6)};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky; /* Make summary sticky on scroll for desktop */
  top: calc(
    ${({ theme }) => (theme.dimensions as any)?.headerHeight || "90px"} +
      ${({ theme }) => (theme.dimensions as any)?.secondaryNavHeight || "64px"} +
      ${({ theme }) => theme.spacing(6)}
  ); /* Offset by header height(s) + some margin */
  max-height: calc(
    100vh - ${({ theme }) => (theme.dimensions as any)?.headerHeight || "90px"} -
      ${({ theme }) => (theme.dimensions as any)?.secondaryNavHeight || "64px"} -
      ${({ theme }) => theme.spacing(12)}
  );
  overflow-y: auto; // If summary gets very long with many fees/discounts

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || "768px"}) {
    position: static; /* Unset sticky on smaller screens */
    max-height: none;
    overflow-y: visible;
  }
`;

export const SummaryTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: ${({ theme }) =>
    theme.typography.heading.sizes.h4}; /* e.g., 1.5rem */
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(5)} 0;
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2)} 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textMedium};

  &:not(:last-of-type) {
    /* border-bottom: 1px dashed ${({ theme }) =>
      theme.colors.lightGray}; // Optional dashed separator */
  }

  &.total-row {
    /* For the "Order Total" row */
    padding-top: ${({ theme }) => theme.spacing(4)};
    margin-top: ${({ theme }) => theme.spacing(2)};
    border-top: 1px solid ${({ theme }) => theme.colors.mediumGray};
    font-size: ${({ theme }) => theme.typography.body.sizes.large};
    font-weight: ${({ theme }) => theme.typography.body.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;

export const SummaryLabel = styled.span``;

export const SummaryValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
`;

export const DiscountInputWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing(4)} 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};

  input {
    /* Basic styling, use your global StyledInput if available */
    flex-grow: 1;
    padding: ${({ theme }) => theme.spacing(2.5)};
    border: 1px solid ${({ theme }) => theme.colors.mediumGray};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    &:focus {
      border-color: ${({ theme }) => theme.colors.accent1};
      box-shadow: 0 0 0 2px
        ${({ theme }) => transparentize(0.8, theme.colors.accent1)};
      outline: none;
    }
  }

  button {
    /* Basic styling for Apply button */
    padding: 0 ${({ theme }) => theme.spacing(4)};
    background-color: ${({ theme }) =>
      theme.colors.accent2}; /* Sage green for secondary actions */
    color: ${({ theme }) => theme.colors.textLight};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: ${({ theme }) => darken(0.1, theme.colors.accent2)};
    }
  }
`;

export const CheckoutButtonWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(6)};
  /* PrimaryCtaButton would be used here, taking full width perhaps */
  button {
    width: 100%;
  }
`;

export const SecureCheckoutBadges = styled.div`
  margin-top: ${({ theme }) => theme.spacing(4)};
  text-align: center;
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(3)};
  opacity: 0.7;
  // Add img or svg styles for payment icons here
`;

// --- Empty Cart State ---
export const EmptyCartWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing(15)}
    ${({ theme }) => theme.spacing(6)};
  text-align: center;
  animation: ${fadeInSmooth} 0.5s ease-out;

  svg.empty-cart-icon {
    /* For a large icon */
    font-size: 5rem;
    color: ${({ theme }) => theme.colors.lightGray};
    margin-bottom: ${({ theme }) => theme.spacing(5)};
  }

  h2 {
    /* Empty cart title */
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: ${({ theme }) => theme.typography.heading.sizes.h3};
    color: ${({ theme }) => theme.colors.textDark};
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
  p {
    /* Empty cart message */
    font-size: ${({ theme }) => theme.typography.body.sizes.large};
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: ${({ theme }) => theme.spacing(6)};
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
  }
  /* PrimaryCtaButton would be used here */
`;



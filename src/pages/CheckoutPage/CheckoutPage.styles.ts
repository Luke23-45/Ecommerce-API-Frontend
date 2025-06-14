// src/pages/CheckoutPage/CheckoutPage.styles.ts
import styled, { keyframes, css } from 'styled-components';
import { rgba, lighten } from 'polished';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;


export const CheckoutPageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight}; /* Ensure a light, airy background */
  min-height: 100vh;
  padding-bottom: ${({ theme }) => theme.spacing(12)};
`;

export const CheckoutContentLimiter = styled.div`
  max-width: ${({ theme }) => theme.maxWidth || '1200px'}; /* Slightly wider for the stepper + content */
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
  padding-bottom: ${({ theme }) => theme.spacing(4)}; /* Increased padding */
  margin-bottom: ${({ theme }) => theme.spacing(6)}; /* Increased margin */
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  
  h1 {
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: clamp(2rem, 4.5vw, 2.5rem); /* Slightly larger */
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0;
  }
`;

// BackButton can remain the same or be slightly restyled for more elegance
export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textLink};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing(2)} 0; /* Only vertical for alignment */
  transition: color 0.2s ease-out;

  svg {
    transition: transform 0.2s ease-out;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textLinkHover};
    svg {
      transform: translateX(-3px);
    }
  }
`;

// --- New Layout Structure ---
export const CheckoutMainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; // Mobile first
  gap: ${({ theme }) => theme.spacing(8)};

  @media (min-width: ${({ theme }) => theme.breakpoints.laptop || '992px'}) {
    // Determinefr allocation: ~60-65% for steps, ~35-40% for summary
    grid-template-columns: minmax(0, 1.8fr) minmax(0, 1.2fr); // Example: 1.8fr for steps, 1.2fr for summary
  }
`;

export const CheckoutFlowColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)}; /* Gap between stepper and active section content */
  animation: ${fadeIn} 0.5s ease-out 0.1s both;
`;

export const ActiveSectionWrapper = styled.div`
  /* This will wrap the content of the currently active step */
  /* Add any specific wrapper styles if needed, e.g., animations for content switching */
  /* min-height: 300px; /* Optional: to prevent page jump during content switch */
  
  // Base styling for each section that gets "swapped" in
  & > section { // Targets the direct CheckoutSection, AddressSection etc.
    animation: ${slideInUp} 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
  }
`;

export const OrderSummaryColumn = styled.aside`
  position: sticky;
  // Adjust top based on actual header heights. 65px (GrandMarquee) + 32px (PreHeader) ~ 97px. Plus spacing.
  top: ${({ theme }) => `calc(${ (theme.dimensions as any)?.stickyHeaderHeight || '100px'} + ${theme.spacing(6)})`};
  height: fit-content; // Allow it to size based on its content but be sticky

  @media (max-width: 991px) { // Matches laptop breakpoint above
    position: static;
    margin-top: ${({ theme }) => theme.spacing(6)};
    order: -1; // Display summary at the top on mobile, *below* the Stepper
  }
`;


// --- Section Styles (Slightly Evolved for the new model) ---
export const CheckoutSectionBase = styled.section` // Renamed to avoid direct conflict, sections will extend this
  background: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.xlarge}; /* Softer, larger radius */
  box-shadow: ${({ theme }) => theme.shadows.md}; /* Default subtle shadow */
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
  padding: ${({ theme }) => theme.spacing(6)}; /* Generous padding */

  /* &.is-active from old accordion might not be needed if only one section is rendered at a time in ActiveSectionWrapper */
  /* Or, it could denote focus-within styling */
`;

export const SectionTitle = styled.h2` // More generic title for sections
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: clamp(1.4rem, 3vw, 1.75rem); /* Using Playfair for section titles */
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(5)} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};

  svg.icon { // If icons are used in titles
    color: ${({ theme }) => theme.colors.accent1};
    font-size: 1.1em; // Relative to h2 font size
    margin-top: -${({theme}) => theme.spacing(0.5)}; // Fine-tune alignment
  }
`;

// Completed Section Summary (for display below stepper when not active)
export const CompletedSectionSummaryWrapper = styled.div`
  background: ${({ theme }) => theme.colors.backgroundSubtle};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(3)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${fadeIn} 0.4s ease-out both;

  h3 { // Title of the completed section (e.g., "Shipping Address")
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: 1.1rem;
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2)};
    svg { color: ${({ theme }) => theme.colors.accent1}; }
  }
`;

export const SummaryDetails = styled.div`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.5;
  text-align: left;
  flex-grow: 1;
  padding-left: ${({theme}) => theme.spacing(4)};

  p { margin: 0 0 ${({ theme }) => theme.spacing(0.5)} 0; }
  strong { color: ${({theme}) => theme.colors.textDark}; font-weight: 500;}
`;

export const EditButton = styled.button` // For the "Edit" link on completed summaries
  background: none;
  border: 1px solid transparent; // for consistent spacing
  color: ${({ theme }) => theme.colors.accent1};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none; // Remove underline for button feel
  transition: all 0.2s ease-out;

  &:hover {
    background-color: ${({theme}) => theme.colors.accent1Subtle};
    color: ${({ theme }) => theme.colors.accent1Hover};
    border-color: ${({theme}) => theme.colors.accent1};
  }
`;


// --- Global Continue Button ---
export const GlobalContinueButtonWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing(6)};
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  justify-content: flex-end; /* Align to the right, common for primary CTAs */
  
  /* On mobile, might want it full width or centered */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    justify-content: center;
    button { /* Assuming PrimaryCtaButton is used */
      width: 100%;
      max-width: 350px;
    }
  }
`;

/* The old .CheckoutSection, .SectionHeader, .SectionContent might need to be
   refactored into styles for AddressSection.styles.ts etc. directly,
   or AddressSection's root can extend CheckoutSectionBase */

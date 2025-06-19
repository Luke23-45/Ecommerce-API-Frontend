// src/pages/AccountPages/OrderListPage/OrderListPage.styles.ts
import styled, { keyframes, css } from 'styled-components';
import { rgba, lighten, darken, transparentize } from 'polished';

// --- Keyframes (from your provided styles for Hero) ---
export const auroraBorealis = keyframes`
  0% { background-position: 0% 50%, 0% 50%, 0% 50%; }
  50% { background-position: 100% 50%, 100% 50%, 100% 50%; }
  100% { background-position: 0% 50%, 0% 50%, 0% 50%; }
`;

export const floatingParticles = keyframes`
  0% { transform: translateY(0) translateX(calc(var(--particle-tx) * 1px)) rotate(calc(var(--particle-r) * 1deg)); opacity: 0.5; }
  25% { opacity: 0.75; }
  50% { opacity: 0.5; }
  75% { opacity: 0.25; }
  100% { transform: translateY(-100vh) translateX(calc(var(--particle-tx) * -1px)) rotate(calc(var(--particle-r) * -1deg)); opacity: 0; }
`;

export const subtleTextReveal = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0px); opacity: 1; }
`;

export const fadeInGrow = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// --- Overall Page Wrapper for Order List ---
export const OrderListPageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryNeutral};
  min-height: 100vh;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
`;

// --- Hero Section ---
export const ProfileHeroSection = styled.section`
  min-height: 380px; 
  max-height: 550px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.containerPadding};
  overflow: hidden;
  background-color: #1a2e30; // Dark base

  &::before { // Aurora Layer
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image:
      radial-gradient(ellipse at 70% 75%, ${props => transparentize(0.5, props.theme.colors.accent2Vibrant || props.theme.colors.accent2)} 0%, transparent 40%),
      radial-gradient(ellipse at 30% 25%, ${props => transparentize(0.4, props.theme.colors.accent1Vibrant || props.theme.colors.accent1)} 0%, transparent 35%),
      radial-gradient(ellipse at 55% 45%, ${props => transparentize(0.65, lighten(0.1, props.theme.colors.primaryNeutral))} 0%, transparent 50%);
    background-size: 200% 200%, 250% 250%, 220% 220%;
    animation: ${auroraBorealis} 45s ease-in-out infinite alternate;
    mix-blend-mode: screen; 
    filter: blur(15px) brightness(0.9);
    opacity: 0.7;
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 800px; 
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: clamp(2.2rem, 5.5vw, 4rem);
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    line-height: 1.2;
    letter-spacing: -0.015em;
    margin-bottom: ${({ theme }) => theme.spacing(3)};
    color: ${({ theme }) => theme.colors.textLight};
    text-shadow: 0 2px 8px rgba(0,0,0,0.25);
    animation: ${subtleTextReveal} 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
    opacity: 0;
  }

  p.subtitle {
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: clamp(1rem, 1.8vw, 1.25rem);
    line-height: 1.75;
    color: ${({ theme }) => transparentize(0.1, theme.colors.textLight)};
    margin-bottom: ${({ theme }) => theme.spacing(5)};
    font-weight: ${({ theme }) => theme.typography.body.weights.regular};
    animation: ${subtleTextReveal} 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards;
    opacity: 0;
    max-width: 600px;
  }
`;

export const QuickActionIcons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(4)};
  justify-content: center;
  position: relative;
  z-index: 3;

  button {
    background: ${({ theme }) => transparentize(0.88, theme.colors.textLight)};
    backdrop-filter: blur(5px);
    border: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.textLight)};
    color: ${({ theme }) => theme.colors.textLight};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    width: 90px; 
    height: 90px;
    display: flex;
    flex-direction: column; 
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing(0.5)};
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
    font-weight: ${({ theme }) => theme.typography.body.weights.medium};
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation: ${fadeInGrow} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards;
    opacity:0;
    box-shadow: 0 2px 8px ${rgba(0, 0, 0, 0.1)};
    padding: ${({ theme }) => theme.spacing(1.5)};

    svg {
      font-size: 1.6rem;
      margin-bottom: ${({ theme }) => theme.spacing(0.5)}; 
    }

    &:hover {
      background: ${({ theme }) => transparentize(0.78, theme.colors.textLight)};
      border-color: ${({ theme }) => transparentize(0.6, theme.colors.textLight)};
      transform: translateY(-3px) scale(1.02); 
      box-shadow: 0 4px 12px ${rgba(0, 0, 0, 0.15)};
    }
    
    &:active {
      transform: translateY(-1px) scale(0.99);
    }

    &.active-hero-action {
        background: ${({ theme }) => transparentize(0.7, theme.colors.accent1)};
        border-color: ${({ theme }) => transparentize(0.5, theme.colors.accent1)};
        color: ${({ theme }) => theme.colors.textLight};
         box-shadow: 0 4px 15px ${props => transparentize(0.7, props.theme.colors.accent1)};
    }
  }
`;

// --- Main Content Area (Below Hero) ---
export const OrdersContentWrapper = styled.div`

    width: 100%;
    max-width: 1150px;
    margin: 0 auto; 
    padding: 0 ${(props) => props.theme.containerPadding};
  /* max-width: ${({ theme }) => theme.maxWidth}; */
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.containerPadding};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(6)};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.containerPadding};
  }
`;

export const OrdersSectionCard = styled.section<{ $animationDelay?: string }>`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.xlarge};
  padding: ${({ theme }) => theme.spacing(6)};
  box-shadow: ${({ theme }) => theme.shadows.lg}; 
  animation: ${fadeInGrow} 0.7s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  opacity: 0;
  animation-delay: ${(props) => props.$animationDelay || '0s'};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const OrdersPageTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  padding-bottom: ${({ theme }) => theme.spacing(3)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};

  h2 {
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: clamp(2rem, 5vw, 2.8rem);
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2.5)};

    svg {
      color: ${({ theme }) => theme.colors.accent1};
      font-size: 0.9em;
    }
  }
  .page-action { /* Placeholder for any action button next to title */ }
`;

// --- Styles for Filter and Sort Controls ---
export const FilterSortControlsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap; // Allow controls to wrap on smaller screens
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => lighten(0.02, theme.colors.primaryNeutral)}; // Slightly off-base
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column; // Label above select
  gap: ${({ theme }) => theme.spacing(1.5)};
  flex-grow: 1; // Allow groups to take space
  min-width: 180px; // Minimum width for each filter group

  label {
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
    color: ${({ theme }) => theme.colors.textMedium};
    font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  }
`;

// Elegant Select (can be a custom component later or styled native select)
export const StyledSelect = styled.select`
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(3)};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.textDark};
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.mediumGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  appearance: none; // Remove default browser arrow
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23${({theme}) => theme.colors.textMedium.substring(1)}%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing(3)} center;
  background-size: 0.65em auto;
  cursor: pointer;
  min-width: 200px; // Ensure select is not too squished
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.darkGray};
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent1};
    box-shadow: 0 0 0 2px ${({theme}) => transparentize(0.8, theme.colors.accent1)};
  }
`;


// --- Order List Specific Styles ---
export const OrderListGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing(5)};
`;

export const NoOrdersMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing(10)} ${({ theme }) => theme.spacing(5)};
  font-size: ${({ theme }) => theme.typography.body.sizes.large};
  color: ${({ theme }) => theme.colors.textMedium};
  background-color: ${({theme}) => theme.colors.backgroundSubtle};
  border-radius: ${({theme}) => theme.borderRadius.medium};
  border: 1px dashed ${({theme}) => theme.colors.mediumGray};

  p {
    margin-bottom: ${({ theme }) => theme.spacing(4)};
  }
  // button styles should come from a common button component, or defined here.
`;

export const PaginationControlsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${({ theme }) => theme.spacing(6)} 0;
    gap: ${({ theme }) => theme.spacing(3)};

    button {
        padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
        font-family: ${({ theme }) => theme.typography.body.fontFamily};
        font-weight: ${({ theme }) => theme.typography.body.weights.medium};
        border: 1px solid ${({ theme }) => theme.colors.mediumGray};
        background-color: ${({ theme }) => theme.colors.backgroundLight};
        color: ${({ theme }) => theme.colors.textDark};
        border-radius: ${({ theme }) => theme.borderRadius.medium};
        cursor: pointer;
        transition: all 0.2s ease-out;

        &:hover:not(:disabled) {
            background-color: ${({ theme }) => theme.colors.lightGray};
            border-color: ${({ theme }) => theme.colors.darkGray};
        }
        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    span {
        font-size: ${({ theme }) => theme.typography.body.sizes.small};
        color: ${({ theme }) => theme.colors.textMedium};
    }
`;

export const StatusBadge = styled.span<{ $statusType?: string }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2.5)};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;

  ${({ theme, $statusType }) => {
    switch ($statusType?.toLowerCase()) {
      case 'processing':
      case 'pending':
        return css`
          background-color: ${transparentize(0.85, theme.colors.warning)};
          color: ${darken(0.2, theme.colors.warning)};
        `;
      case 'shipped':
        return css`
          background-color: ${transparentize(0.85, theme.colors.info)};
          color: ${darken(0.1, theme.colors.info)};
        `;
      case 'delivered':
        return css`
          background-color: ${transparentize(0.88, theme.colors.success)};
          color: ${darken(0.1, theme.colors.success)};
        `;
      case 'cancelled':
      case 'refunded':
        return css`
          background-color: ${transparentize(0.88, theme.colors.error)};
          color: ${darken(0.1, theme.colors.error)};
        `;
      default: // Paid, or other neutral status
        return css`
          background-color: ${transparentize(0.9, theme.colors.textMuted)};
          color: ${theme.colors.textMedium};
        `;
    }
  }}
`;
// src/pages/BecomeAPartnerPage/BecomeAPartnerPage.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, lighten, darken, transparentize } from 'polished';

// --- Keyframes for Animations ---
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const cardHoverGrow = keyframes`
  0% { transform: scale(1); box-shadow: ${({ theme }) => theme.shadows.md}; }
  100% { transform: scale(1.03); box-shadow: ${({ theme }) => theme.shadows.lg}; }
`;


// --- Main Page Wrapper ---
export const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight || '#ffffff'}; /* Clean white background */
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  animation: ${fadeIn} 0.5s ease-out;
  overflow-x: hidden; /* Prevent horizontal scroll from wide elements or animations */
`;

// --- General Section Styling ---
// This can be a base for all major sections on this page (Hero, Benefits, Pathways, etc.)
export const SectionContainer = styled.section<{ 
  $bgColor?: keyof DefaultTheme['colors'] | string; // Allow themed color key or custom hex
  $textColor?: keyof DefaultTheme['colors'] | string;
  $topPadding?: number; // Multiplier for theme.spacing
  $bottomPadding?: number; // Multiplier for theme.spacing
}>`
  width: 100%;
  padding-top: ${({ theme, $topPadding }) => theme.spacing($topPadding || 12)}; // Default large top padding
  padding-bottom: ${({ theme, $bottomPadding }) => theme.spacing($bottomPadding || 12)}; // Default large bottom padding
  
  background-color: ${({ theme, $bgColor }) => 
    $bgColor && theme.colors[$bgColor as keyof DefaultTheme['colors']] ? theme.colors[$bgColor as keyof DefaultTheme['colors']] : 
    $bgColor || 'transparent' // Fallback to custom hex or transparent
  };
  
  color: ${({ theme, $textColor }) => 
    $textColor && theme.colors[$textColor as keyof DefaultTheme['colors']] ? theme.colors[$textColor as keyof DefaultTheme['colors']] : 
    $textColor || theme.colors.textDark // Fallback to custom hex or default textDark
  };

  /* Optional: Subtle border between sections */
  /* &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  } */
`;

// Content Limiter (to apply max-width and centering for section content)
export const ContentLimiter = styled.div`
  max-width: ${({ theme }) => theme.maxWidth || '1200px'}; /* More standard content width */
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.containerPadding};
  position: relative; /* For absolutely positioned elements within */

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => `calc(${theme.containerPadding} / 1.5)`}; // Slightly less padding on tablet
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    padding: 0 ${({ theme }) => `calc(${theme.containerPadding} / 2)`}; // Even less on mobile
  }
`;

// --- Common Typography Elements for Sections ---
export const SectionHeadline = styled.h2<{ $textAlign?: 'center' | 'left' | 'right', $isAccented?: boolean }>`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; /* Playfair Display */
  font-size: clamp(2rem, 5vw, 3.2rem); /* Responsive headline size */
  font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
  color: ${({ theme, $isAccented }) => $isAccented ? theme.colors.accent1 : theme.colors.textDark};
  line-height: 1.25;
  text-align: ${({ $textAlign = 'center' }) => $textAlign};
  margin: 0 auto ${({ theme }) => theme.spacing(3)}; /* Default bottom margin */
  max-width: 800px; /* Constrain headline width for readability if centered */
  
  /* Subtle text shadow for depth and elegance */
  text-shadow: 0 1px 2px rgba(0,0,0,0.05);

  /* Optional: Decorative element */
  /* &::after {
    content: '';
    display: block;
    width: 80px;
    height: 3px;
    background-color: ${({ theme, $isAccented }) => $isAccented ? theme.colors.accent1 : theme.colors.accent2};
    margin: ${({ theme }) => theme.spacing(3)} auto 0;
    border-radius: 2px;
    ${({ $textAlign }) => $textAlign === 'left' && css` margin-left: 0; `}
    ${({ $textAlign }) => $textAlign === 'right' && css` margin-right: 0; `}
  } */
`;

export const SectionSubheadline = styled.p<{ $textAlign?: 'center' | 'left' | 'right' }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: clamp(1rem, 2.5vw, 1.25rem); /* Responsive subheadline size */
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.7;
  text-align: ${({ $textAlign = 'center' }) => $textAlign};
  margin: 0 auto ${({ theme }) => theme.spacing(8)}; /* Default bottom margin, creating space before next element */
  max-width: 750px; /* Constrain width for readability */
  
  /* Optional: Add a subtle animation */
  /* animation: ${fadeInUp} 0.6s 0.2s ease-out backwards; */
`;

// Reusable Button Style (if not using a global FrontendButton)
// For CTAs on this page. Should align with Élan's primary button style.
export const PrimaryCtaButton = styled.button<{ $isOutline?: boolean }>`
  /* Using styles similar to FrontendButton from previous components */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(6)};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  letter-spacing: 0.75px;
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  cursor: pointer;
  transition: all 0.25s ease-out;
  border: 1.5px solid;
  min-width: 220px; /* Good default width for CTAs */
  text-decoration: none; /* If used with <RouterLink as={...}> */

  background-color: ${({ theme, $isOutline }) => $isOutline ? 'transparent' : theme.colors.accent1};
  color: ${({ theme, $isOutline }) => $isOutline ? theme.colors.accent1 : theme.colors.textLight};
  border-color: ${({ theme }) => theme.colors.accent1};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  svg {
    margin-right: ${({ theme }) => theme.spacing(2)};
    font-size: 1.1em;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme, $isOutline }) => $isOutline ? transparentize(0.9, theme.colors.accent1) : darken(0.07, theme.colors.accent1)};
    border-color: ${({ theme, $isOutline }) => $isOutline ? theme.colors.accent1 : darken(0.07, theme.colors.accent1)};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: ${({ theme }) => theme.shadows.xs};
  }
  &:disabled { /* ... (standard disabled styles) ... */ }
`;

// Divider Style (Optional, if needed between sections or elements)
export const SubtleDivider = styled.hr`
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, 
    ${({theme}) => transparentize(1, theme.colors.lightGray)}, 
    ${({theme}) => theme.colors.lightGray}, 
    ${({theme}) => transparentize(1, theme.colors.lightGray)}
  );
  margin: ${({theme}) => theme.spacing(8)} 0;
`;


export const BenefitsGrid = styled.div` // Can be reused
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); // Responsive columns
  gap: ${({ theme }) => theme.spacing(6)}; // Generous gap between cards
  margin-top: ${({ theme }) => theme.spacing(10)}; // Increased space from subheadline

  /* Child items (BenefitPillarCard) will attempt to be equal height due to 'height: 100%' in PillarCardWrapper */
  /* and grid's default align-items: stretch */
  align-items: stretch; 
`;


export const PathwaysContainer = styled.div`
  display: grid;
  /* Ensure two columns, responsive. auto-fit ensures they take available space */
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  gap: ${({ theme }) => theme.spacing(7)}; /* Generous gap between the two pathway cards */
  margin-top: ${({ theme }) => theme.spacing(10)}; // Space from section subheadline

  /* On smaller tablets or large mobiles, stack them */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) { 
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing(6)};
  }
`;

export const TestimonialsGrid = styled.div`
  display: grid;
  /* Default to 1 column for mobile-first, then expand */
  grid-template-columns: 1fr; 
  gap: ${({ theme }) => theme.spacing(6)};
  margin-top: ${({ theme }) => theme.spacing(10)}; // Space below section subheadline

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr); // 2 columns on tablet
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.laptopL}) { // Or laptop, depending on card width
    grid-template-columns: repeat(3, 1fr); // 3 columns on larger screens
    gap: ${({ theme }) => theme.spacing(7)};
  }
  
  /* Ensure cards stretch to fill height for visual consistency in a row */
  align-items: stretch; 
`;
export const HowItWorksGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr; // Mobile first: stack panels
  gap: ${({ theme }) => theme.spacing(8)}; // Generous gap when stacked
  margin-top: ${({ theme }) => theme.spacing(10)};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    /* Adjust to fit 2 panels before max number of panels */
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: ${({ theme }) => theme.spacing(6)}; /* Horizontal and vertical gap */
  }
  
  /* Example: If you want max 4 panels in a row on large desktops before wrapping */
  /* @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) { 
    grid-template-columns: repeat(4, 1fr);
    gap: ${({ theme }) => theme.spacing(7)};
  } */
`;

export const FAQSectionWrapper = styled.div`
  max-width: 800px; // Constrain width of FAQ list for readability
  margin: ${({ theme }) => theme.spacing(10)} auto 0 auto; // Centered, with top margin
  
  /* Each FAQItemWrapper will have its own bottom border creating dividers */
  /* border-top: 1px solid ${({ theme }) => theme.colors.lightGray}; // Optional top border for whole list */
`;
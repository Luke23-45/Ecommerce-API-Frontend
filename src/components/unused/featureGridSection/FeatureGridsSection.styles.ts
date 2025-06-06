// src/components/HomePage/FeatureGridsSection/FeatureGridsSection.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes ---
const sectionTitleReveal = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gridItemEntrance = keyframes`
  0% { opacity: 0; transform: translateY(30px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const imageZoomHover = keyframes`
  from { transform: scale(1); }
  to { transform: scale(1.05); }
`;

const overlayFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// --- Main Section Wrapper ---
export const FeatureGridsWrapper = styled.section<{ theme: DefaultTheme }>`
  padding: ${(props) => props.theme.spacing(12)} 0 ${(props) => props.theme.spacing(15)} 0; /* Generous vertical padding */
  background-color: ${(props) => lighten(0.02, props.theme.colors.primaryNeutral)}; /* Slightly off-white than main page for distinction */
  overflow: hidden; /* Contain animations */
`;

export const SectionHeadline = styled.h2<{ theme: DefaultTheme }>`
  font-family: ${(props) => props.theme.typography.heading.fontFamily};
  font-size: ${(props) => props.theme.typography.heading.sizes.h2};
  font-weight: ${(props) => props.theme.typography.heading.weights.bold};
  line-height: 1.6;
  letter-spacing: 0.2px;
  color: ${(props) => props.theme.colors.textDark};
  text-align: center;
  margin-bottom: ${(props) => props.theme.spacing(10)};
  padding: 0 ${(props) => props.theme.containerPadding};
  animation: ${sectionTitleReveal} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
  opacity: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.heading.sizes.h3};
    margin-bottom: ${({ theme }) => theme.spacing(8)};
  }
`;

// --- Grid Row Container ---
// Common styling for each row can go here, or apply directly
export const GridRow = styled.div<{ theme: DefaultTheme }>`
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto ${(props) => props.theme.spacing(10)} auto; /* Space between rows */
  padding: 0 ${(props) => props.theme.containerPadding};
  display: grid;
  gap: ${(props) => props.theme.spacing(6)}; /* Default gap for items within a row */

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing(4)};
    margin-bottom: ${({ theme }) => theme.spacing(8)};
  }
`;

// --- Specific Row Layouts ---
export const RowTwoImages = styled(GridRow)`
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); /* Default responsive 2 columns */
  
  @media (min-width: ${({theme}) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr; /* Force 2 columns on tablet+ */
     /* Or asymmetrical: e.g., 1.2fr 0.8fr; */
  }
`;

export const RowFourImages = styled(GridRow)`
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  @media (min-width: ${({theme}) => theme.breakpoints.mobileL}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: ${({theme}) => theme.breakpoints.laptop}) {
    grid-template-columns: repeat(4, 1fr); /* 4 columns on laptop+ */
  }
`;

export const RowAsymmetrical = styled(GridRow)`
  grid-template-columns: 1fr; /* Mobile: Stack by default */

  @media (min-width: ${({theme}) => theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr 1fr; /* 50%, 25%, 25% on tablet+ */
    /* For true 50/25/25 consider CSS Subgrid or fixed pixel/percentage values if parent has fixed width */
    /* Example with more precise control:
       grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr);
    */
  }
`;

// --- Individual Grid Item (Card-like) ---
export const GridItem = styled.a<{ theme: DefaultTheme; $animationDelay?: string; $aspectRatio?: string }>`
  display: block; /* To make it behave like a block for positioning */
  position: relative;
  border-radius: ${(props) => props.theme.borderRadius.large}; /* Consistent rounding */
  overflow: hidden;
  background-color: ${(props) => props.theme.colors.lightGray}; /* Placeholder */
  box-shadow: ${(props) => props.theme.shadows.subtle};
  text-decoration: none;
  color: inherit;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), 
              box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  
  /* Entrance Animation */
  opacity: 0;
  transform: translateY(25px);
  animation: ${gridItemEntrance} 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: ${(props) => props.$animationDelay || '0s'};

  /* Aspect ratio can be controlled per item or per row type */
  aspect-ratio: ${(props) => props.$aspectRatio || '4 / 3'}; /* Default, adjust as needed */
  min-height: 200px; /* Ensure a minimum display height */

  &:hover {
    transform: translateY(-8px) scale(1.02); /* More significant lift */
    box-shadow: ${(props) => props.theme.shadows.strong}; /* Stronger shadow on hover */

    .grid-item-image {
      transform: scale(1.08); /* Zoom image */
    }
    .grid-item-overlay {
      opacity: 1; /* Show overlay */
      background-color: ${(props) => transparentize(0.2, darken(0.1, props.theme.colors.textDark))};
    }
    .grid-item-content h3, .grid-item-content p, .grid-item-content .cta-icon {
        opacity: 1;
        transform: translateY(0);
    }
  }
`;

export const GridItemImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); /* Slower, smoother image zoom */
  border-radius: inherit; /* Inherit if GridItem has radius and image is direct child */
`;

// Overlay for text and CTA, appears on hover
export const GridItemOverlay = styled.div<{ theme: DefaultTheme }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => transparentize(0.4, darken(0.2, props.theme.colors.textDark))}; /* Darker initial overlay */
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* Align content to bottom */
  align-items: flex-start; /* Align text to left */
  padding: ${(props) => props.theme.spacing(5)};
  opacity: 0; /* Hidden by default, shown on hover */
  transition: opacity 0.35s ease-out, background-color 0.35s ease-out;
  pointer-events: none; /* Allow hover on GridItem itself */
  border-radius: inherit; /* For Row 2 cards with text only on hover */

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    /* Make overlay more prominent/always visible on touch devices if needed, */
    /* or triggered by tap instead of hover (handled in JS) */
    /* opacity: 1; background-color: ...; */ 
     padding: ${(props) => props.theme.spacing(4)};
  }
`;

// Content within GridItem (can be always visible or part of overlay)
export const GridItemContent = styled.div<{ theme: DefaultTheme; $alwaysVisible?: boolean }>`
  color: ${(props) => props.theme.colors.textLight};
  width: 100%;
  
  /* If not always visible, animate entrance from overlay hover */
  ${(props) => !props.$alwaysVisible && css`
    h3, p, .cta-icon {
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.3s ease-out 0.1s, transform 0.3s ease-out 0.1s; /* Stagger entrance after overlay */
    }
  `}


  h3 { /* Item Title */
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: ${({ theme }) => theme.typography.heading.sizes.h5};
    font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
    line-height: 1.25;
    letter-spacing: ${({ theme }) => theme.typography.heading.sizes.h5};
    margin: 0 0 ${({ theme }) => theme.spacing(1.5)} 0;
    color: inherit; /* Inherits from overlay (textLight) or GridItem (if $alwaysVisible and textDark context) */
    text-shadow: 0 1px 3px ${rgba(0,0,0,0.3)};
  }

  p { /* Item Description/Caption */
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    line-height: 1.5;
    margin: 0 0 ${({ theme }) => theme.spacing(3)} 0;
    opacity: 0.9;
    color: inherit;
     /* Clamp description to 2-3 lines */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* For 'View Collection ->' type links, only in overlay or always visible text area */
  .cta-link {
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    color: ${(props) => lighten(0.1, props.theme.colors.accent1Vibrant || props.theme.colors.accent1)}; /* Brighter accent for CTA on dark overlay */
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: color 0.2s ease, transform 0.2s ease;

    .cta-icon { /* Arrow icon */
        margin-left: ${(props) => props.theme.spacing(1.5)};
        transition: transform 0.25s ease-out;
        font-size: 0.9em;
    }

    &:hover {
        color: ${(props) => props.theme.colors.textLight};
        .cta-icon {
            transform: translateX(4px);
        }
    }
  }

  /* Styles for when content is NOT part of an overlay (Row 1) */
  ${(props) => props.$alwaysVisible && css`
    padding: ${props.theme.spacing(4)};
    background-color: ${props.theme.colors.adminSurface}; /* Card background for text */
    color: ${props.theme.colors.textDark}; /* Dark text */
    border-top: 1px solid ${props.theme.colors.lightGray}; /* Separator from image if text is below */
    
    h3 { color: ${props.theme.colors.textDark}; text-shadow: none; }
    p { color: ${props.theme.colors.darkGray}; opacity: 1;}
    .cta-link {
        color: ${props.theme.colors.accent1};
        &:hover { color: ${darken(0.1, props.theme.colors.accent1)}; }
    }
  `}
`;
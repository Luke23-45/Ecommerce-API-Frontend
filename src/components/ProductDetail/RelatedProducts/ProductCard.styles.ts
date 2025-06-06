// src/components/ProductCard/ProductCard.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes ---
const elegantContentFadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); } // Slightly less translation
  to { opacity: 1; transform: translateY(0); }
`;

// QuickActionsOverlay - keep animation as is, changes are to its appearance
export const QuickActionsOverlay = styled.div` // Removed theme prop, not needed if ThemeProvider is used
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  // More subtle background for a classier overlay
  background: ${({ theme }) => transparentize(0.15, lighten(0.02, theme.colors.primaryNeutral))}; 
  backdrop-filter: blur(6px); // Soft blur
  padding: ${({ theme }) => theme.spacing(2.5)}; // Balanced padding
  display: flex;
  justify-content: center; 
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2.5)}; // Balanced gap
  border-top: 1px solid ${({ theme }) => transparentize(0.8, theme.colors.darkGray)}; // Very subtle border

  opacity: 0; 
  visibility: hidden;
  transform: translateY(20px); // Start further down for a nicer slide-up
  transition: opacity 0.25s ease-out,
              visibility 0s linear ${({ theme, opacity }) => (opacity === 0 ? '0.25s' : '0s')}, // Use theme for opacity if needed
              transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94); // Standard ease-out-quad
  z-index: 3;
`;

// Define ProductImageLink before StyledProductCard for targeting
export const ProductImageLink = styled.div` // No theme prop needed here
  display: block;
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5; 
  background-color: ${({ theme }) => lighten(0.04, theme.colors.primaryNeutral)}; // Softer loading bg
  // Top corners should match StyledProductCard's border-radius if any part of ImageLink itself is rounded.
  // Usually, if the image fills the whole container, the container's border-radius handles it.
  // For Élan, image wrapper might be slightly inset with its own radius:
  border-radius: ${({ theme }) => theme.borderRadius.medium}; // Soften corners of image area itself
  margin: ${({ theme }) => theme.spacing(1.5)}; // Create an inset effect for the image
  margin-bottom: 0; // No bottom margin if it's purely inset top/sides

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); // Smoother, slightly slower zoom
    border-radius: inherit; // Inherit radius from ProductImageLink for the image itself
  }
`;

export const StyledProductCard = styled.div<{ $index?: number }>` // Removed theme prop
  background-color: ${({ theme }) => theme.colors.backgroundLight}; // Use pure white or designated card bg from Élan theme
  border-radius: ${({ theme }) => theme.borderRadius.xlarge}; // More prominent, softer Élan rounding
  // width: 20vw; // Keep if intended, otherwise remove for grid-based sizing
  overflow: hidden; 
  position: relative;
  display: flex;
  min-height: 600px;
  width: 385px;
  flex-direction: column; // Ensure it's a column for ProductContent to grow
  height: 600px; 
  box-shadow: ${({ theme }) => theme.shadows.md}; // Slightly more defined base shadow for Élan
  transition: transform 0.35s cubic-bezier(0.165, 0.84, 0.44, 1), // Smoother, spring-like ease-out-expo
              box-shadow 0.35s cubic-bezier(0.165, 0.84, 0.44, 1);
  will-change: transform, box-shadow; // Performance hint

  /* Staggered entrance animation */
  opacity: 0;
  transform: translateY(20px); // Initial state for animation
  animation: ${elegantContentFadeInUp} 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
  animation-delay: ${(props) => (props.$index != null ? props.$index * 0.065 : 0)}s; // Adjusted delay

  &:hover {
    transform: translateY(-6px) scale(1.015); // Subtle lift and scale for 3D feel
    box-shadow: ${({ theme }) => theme.shadows.xl}; // More prominent, diffused shadow for Élan
    
    ${ProductImageLink} img {
      transform: scale(1.05); // Keep image zoom engaging
    }

    ${QuickActionsOverlay} {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }
`;

export const BadgesContainer = styled.div` // Removed theme prop
  position: absolute;
  top: ${({ theme }) => theme.spacing(2.5)}; // Use spacing defined for ImageLink margin if image is inset
  left: ${({ theme }) => theme.spacing(2.5)}; // Same as above
  display: flex;
  flex-direction: column; 
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(1.25)}; // Balanced gap
  z-index: 2;
`;



export const Badge = styled.span<{ $type?: string }>`
  padding: ${({ theme }) => theme.spacing(0.75)} ${({ theme }) => theme.spacing(2)};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  color: ${({ theme }) => theme.colors.textLight};
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  line-height: 1.3;
  text-transform: uppercase;
  letter-spacing: 0.75px;
  box-shadow: ${({ theme }) => theme.shadows.xs};
  text-align: center;
  white-space: nowrap;

  ${({ theme, $type }) => {
    switch ($type) {
      case 'new':
        return css`
          background-color: ${theme.colors.accent2Vibrant || theme.colors.accent2};
        `;
      case 'bestseller':
        return css`
          background-color: ${theme.colors.accent1Vibrant || theme.colors.accent1};
        `;
      case 'promotion':
        return css`
          background-color: ${theme.colors.error || theme.colors.adminStatusError};
        `;
      case 'eco':
        return css`
          background-color: ${lighten(0.1, theme.colors.accent2)};
          color: ${darken(0.2, theme.colors.accent2)};
        `;
      case 'artisan':
        return css`
          background-color: ${lighten(0.1, theme.colors.accent1)};
          color: ${darken(0.2, theme.colors.accent1)};
        `;
      default:
        return css`
          background-color: ${theme.colors.textMedium};
        `;
    }
  }}
`;


export const ProductContent = styled.div` // Removed theme prop
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)}; // Top, H, Bottom padding
  display: flex;
  flex-direction: column;
  flex-grow: 1; // Allows PriceInfo to push to bottom
  text-align: left; 
  background-color: ${({theme}) => theme.colors.backgroundLight}; // Match card background if different from adminSurface
  border-top: 1px solid ${({theme}) => theme.colors.primaryNeutral}; // Subtle separator if image is inset
`;

export const ProductName = styled.h3` // Removed theme prop
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; // Use Playfair for Élan product names
  font-size: ${({ theme }) => theme.typography.heading.sizes.h5}; // Elegant, readable size from theme
  font-weight: ${({ theme }) => theme.typography.heading.weights.regular}; // Regular Playfair
  color: ${({ theme }) => theme.colors.textDark};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  margin: 0 0 ${({ theme }) => theme.spacing(1)} 0; // Reduced bottom margin
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(${({theme}) => theme.typography.heading.sizes.h5} * ${({theme}) => theme.typography.lineHeights.tight} * 2); // Approx height for 2 lines
`;

export const PriceInfo = styled.div` // Removed theme prop
  display: flex;
  align-items: baseline; 
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin-top: auto; // Pushes this block to the bottom of ProductContent
  padding-top: ${({ theme }) => theme.spacing(2)}; // Space above prices
`;

export const CurrentPrice = styled.span<{ $onSale?: boolean }>` // Removed theme prop
  font-family: ${({ theme }) => theme.typography.body.fontFamily}; // Inter for prices
  font-size: ${({ theme }) => theme.typography.body.sizes.large}; // Clear price size
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold}; // SemiBold for current price
  color: ${({ theme, $onSale }) => $onSale ? (theme.colors.accent1 || theme.colors.error) : theme.colors.textDark}; // Sale price color
  line-height: 1;
`;

export const OriginalPrice = styled.span` // Removed theme prop
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small}; // Smaller original price
  color: ${({ theme }) => theme.colors.textMuted}; // Muted color for original price
  text-decoration: line-through;
  opacity: 0.8; 
  line-height: 1;
`;

export const ProductShippingText = styled.div` // Removed theme prop
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall}; // Keep small
  color: ${({ theme }) => theme.colors.textMedium}; // Softer color for shipping info
  font-weight: ${({ theme }) => theme.typography.body.weights.regular};
  margin-top: ${({ theme }) => theme.spacing(1)};
  line-height: 1.3;
  text-align: left;
`;
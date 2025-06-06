// src/components/ProductListing/ProductCard.styles.ts
import styled, { css } from 'styled-components';

// Hardcoded colors based on the skincare image - USE THESE for precision
const COUPANG_TEXT_DARK = '#333333';
const COUPANG_TEXT_MEDIUM = '#555555';
const COUPANG_TEXT_LIGHT = '#888888'; // For original price, unit price, review count
const COUPANG_TEXT_MUTED = '#999999'; // For very subtle text if needed
const COUPANG_PRICE_RED = '#E94444'; // A common e-commerce red, adjust if specific
const COUPANG_ROCKET_BLUE = '#1E82FF';
const COUPANG_DELIVERY_GREEN = '#298A57';
const COUPANG_STAR_GOLD = '#FFB800';
const COUPANG_BORDER_LIGHT = '#E0E0E0'; // For card border and tag borders

const COUPANG_TAG_BLUE_TEXT = '#0073E9';
const COUPANG_TAG_BLUE_BORDER = '#B2DFFC'; // Lighter blue border for card tag
const COUPANG_TAG_BLUE_BG = '#EBF8FF';     // Very light blue bg for card tag

const COUPANG_TAG_YELLOW_TEXT = '#555555'; // Darker text on yellow tag
const COUPANG_TAG_YELLOW_BORDER = '#FFDA6B';
const COUPANG_TAG_YELLOW_BG = '#FFFBE6';
const COUPANG_TAG_YELLOW_ICON_BG = '#FFC000'; // Icon bg for yellow tag

export const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 2px 2px 0 0; // Very subtle top rounding
  padding-top: 0;
  
  img {
    display: block;
    width: 100%;
    height: 250px;
    aspect-ratio: 3 / 4; // Portrait, common for bottles
    object-fit: cover; // Show full bottle
    transition: transform 0.15s ease-out; // Faster, very subtle zoom
    will-change: transform;
  }
`;

export const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Inter';
  background-color: #FFFFFF; 
  border-radius: ${({ theme }) => theme.borderRadius.medium}; // Slightly more noticeable rounding for a softer Élan feel
  // border: 1px solid ${COUPANG_BORDER_LIGHT}; // Removed border, shadow will provide separation

  overflow: visible; // Change to 'visible' to allow shadow to expand without being clipped by CardWrapper itself
                     // The internal ImageWrapper still has overflow:hidden for image clipping.

  // Initial state: subtle or no shadow
  box-shadow: ${({ theme }) => theme.shadows.sm}; // Start with a very subtle shadow from your theme
                                                  // Or 'none' if you prefer no shadow initially: box-shadow: none;

  // Smooth transition for transform and box-shadow
  // Using a slightly longer duration and a more expressive cubic-bezier for "beautiful" feel
  transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1),
              box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  will-change: transform, box-shadow; // Performance hint

  &:hover {
    // --- Beautiful Hover Effects ---

    // 1. Lift & Scale (optional, choose one or combine carefully)
    // transform: translateY(-6px); // Simple lift
    transform: scale(1.02) translateY(-4px); // Slight scale up and lift for a more 3D feel
                                         // Adjust values as needed. scale(1.02) or scale(1.03) is good.

    // 2. Enhanced Box Shadow
    // Use a more prominent, layered shadow from your Élan theme for depth
    box-shadow: ${({ theme }) => theme.shadows.lg}; // Example: '0 10px 30px rgba(0,0,0,0.1)'
                                                  // Or even theme.shadows.xl if you want more pop

    // 3. Image Zoom (can be kept or made more subtle if card scales)
    ${ImageWrapper} img {
      transform: scale(1); // Adjust zoom level if card also scales
    }
  }
`;

export const ImageLink = styled.a`
  display: block;
  text-decoration: none;
`;

export const InfoWrapper = styled.div`
  padding: 10px 12px 12px 12px; // Specific padding based on visual density
  display: flex;
  flex-direction: column;
  gap: 3px; // Very tight gap between info elements
`;

export const ProductNameAndVolume = styled.div`
  // Combines Product Name and Volume/Count line
`;

export const ProductName = styled.h3`
  font-size: 13px; // Matches image
  line-height: 1.45;
  color: #111;
  font-weight: 400; 
  font-family: 'Inter';
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;
  min-height: calc(1.45em * 2); 
`;

export const ProductVolume = styled.span` 
  font-size: 12px;
  color: ${COUPANG_TEXT_LIGHT};
  margin-left: 4px; 
`;


export const DiscountOriginalPrice = styled.div`
  font-size: 11px;
  color: ${COUPANG_TEXT_LIGHT};
  margin-top: 2px;
`;

export const OriginalPriceStriked = styled.span`
  text-decoration: line-through;
  margin-left: 4px;
`;

export const CurrentPriceAndShipping = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 4px;
`;

export const CurrentPriceText = styled.span`
  font-size: 16px; // Matches image
  color: ${COUPANG_PRICE_RED};
  font-weight: 700;

  &::after {
    content: '원';
    font-size: 14px; 
    font-weight: 700;
    margin-left: 1px;
  }
`;

export const RocketShippingText = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 11px; // Smaller text for "로켓배송"
  color: ${COUPANG_ROCKET_BLUE};
  font-weight: 700;
  
  svg {
    color: ${COUPANG_ROCKET_BLUE}; 
    font-size: 1.1em; // Icon size relative to this specific text
    margin-right: 2px;
    vertical-align: text-bottom; // Align icon nicely with text
  }
`;

export const UnitPriceText = styled.p`
  font-size: 10px; // Very small
  color: ${COUPANG_TEXT_LIGHT};
  margin: 2px 0 0 0;
`;

export const DeliveryAssuranceText = styled.p`
  font-size: 11px;
  color: ${COUPANG_DELIVERY_GREEN};
  font-weight: 500;
  margin: 4px 0 0 0;
`;

export const SellerInfoText = styled.p`
  font-size: 11px;
  color: ${COUPANG_TEXT_LIGHT};
  margin: 4px 0 0 0;
  line-height: 1.3;
`;

export const Rating = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px; 
  color: ${COUPANG_TEXT_LIGHT};
  margin-top: 6px;

  .stars {
    color: ${COUPANG_STAR_GOLD};
    margin-right: 3px;
    display: flex;
    align-items: center;
    svg { font-size: 13px; } // Slightly larger stars to be visible
  }
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-direction: column; // Tags are stacked
  gap: 4px;
  margin-top: 6px;
`;

const BaseTag = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 11px; // Very small
  line-height: 1; // For tight vertical alignment
  padding: 3px 6px;
  border-radius: 2px; 
  font-weight: 500; // Tags have medium weight text

  .tag-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 11px; // Icon dimensions
    height: 11px;
    border-radius: 50%;
    color: white;
    font-size: 7px; // Text within icon
    font-weight: bold;
    margin-right: 4px;
    line-height: 11px; // Vertical center text in icon
  }
`;

export const CardDiscountTag = styled(BaseTag)`
  color: ${COUPANG_TAG_BLUE_TEXT};
  border: 1px solid ${COUPANG_TAG_BLUE_BORDER};
  background-color: ${COUPANG_TAG_BLUE_BG};

  .tag-icon { // Blue icon for card discount
    background-color: ${COUPANG_TAG_BLUE_TEXT}; 
    // content: '✓'; /* If using ::before, or use actual icon */
  }
`;

export const PointBenefitTag = styled(BaseTag)`
  color: ${COUPANG_TAG_YELLOW_TEXT};
  width: max-content;

  border: 1px solid ${COUPANG_TAG_YELLOW_BORDER};
  background-color: ${COUPANG_TAG_YELLOW_BG};
  padding: 4px 8px;
  border-radius: 10px;
  .tag-icon { // Yellow icon for points
    background-color: ${COUPANG_TAG_YELLOW_ICON_BG};
    // content: 'P'; /* Example if using ::before, or use actual icon */
  }
`;
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes ---
const subtleEntrance = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Info Block Container ---
export const ProductInfoWrapper = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-direction: column;
  /* Adjusted gap for better rhythm; finer control within sections */
  gap: ${(props) => props.theme.spacing?.(3) || '24px'};
  font-family: ${(props) => props.theme.typography?.body?.fontFamily || 'sans-serif'};
  
  /* Optional animation for the whole block, if desired */
  /* animation: ${subtleEntrance} 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) 0.1s forwards; */
`;

// --- Header Section (Category, Brand, Name) ---
export const ProductHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing?.(1) || '8px'}; /* Small gap between category/brand and name */
`;

// --- Product Category/Brand ---
export const ProductCategoryLink = styled.a<{ theme: DefaultTheme }>`
  font-size: ${(props) => props.theme.typography?.body?.sizes?.xsmall || '0.75rem'};
  font-weight: ${(props) => props.theme.typography?.body?.weights?.medium || 500};
  color: ${(props) => props.theme.colors?.darkGray || '#555'};
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  transition: color 0.2s ease-out;
  opacity: 0.9;

  &:hover {
    color: ${(props) => props.theme.colors?.accent1 || '#007bff'};
    opacity: 1;
  }
`;

// --- Product Name ---
export const ProductName = styled.h1<{ theme: DefaultTheme }>`
  font-family: ${(props) => props.theme.typography?.heading?.fontFamily || 'serif'};
  /* Assuming h1 styles from theme or a specific product title style */
  font-size: ${(props) => props.theme.typography?.heading?.sizes?.h3 || '2.25rem'}; /* Adjusted for prominence */
  font-weight: ${(props) => props.theme.typography?.heading?.weights?.bold || 700};
  line-height: ${(props) => props.theme.typography?.heading?.lineHeights?.h2 || 1.2};
  letter-spacing: ${(props) => props.theme.typography?.heading?.letterSpacings?.h2 || '-0.5px'};
  color: ${(props) => props.theme.colors?.textDark || '#222'};
  margin: 0; /* Reset default h1 margin */
  padding-top: ${(props) => props.theme.spacing?.(0.5) || '4px'}; /* Slight space from category */
`;

// --- Pricing & Reviews Section ---
export const PricingReviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing?.(2.5) || '20px'};
  padding-bottom: ${(props) => props.theme.spacing?.(2) || '16px'};
  /* Optional: add a subtle border bottom to separate from description/variants */
  /* border-bottom: 1px solid ${(props) => props.theme.colors?.lightGray || '#eee'}; */
`;

// --- Price Display ---
export const PriceContainer = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center; /* Align all items vertically centered */
  flex-wrap: wrap; /* Allow wrapping for smaller screens if sale badge makes it too long */
  gap: ${(props) => props.theme.spacing?.(2) || '16px'};
`;

export const CurrentPrice = styled.span<{ theme: DefaultTheme; $onSale?: boolean }>`
  font-family: ${(props) => props.theme.typography?.body?.fontFamily || 'sans-serif'};
  font-size: ${(props) => props.theme.typography?.heading?.sizes?.h3 || '1.75rem'}; /* Prominent price */
  font-weight: ${(props) => props.theme.typography?.heading?.weights?.bold || 700};
  color: ${(props) => props.$onSale ? (props.theme.colors?.accent1Vibrant || props.theme.colors?.accent1 || '#d9534f') : (props.theme.colors?.textDark || '#222')};
  line-height: 1;
  letter-spacing: -0.2px;
`;

export const OriginalPrice = styled.span<{ theme: DefaultTheme }>`
  font-family: ${(props) => props.theme.typography?.body?.fontFamily || 'sans-serif'};
  font-size: ${(props) => props.theme.typography?.body?.sizes?.base || '1rem'};
  color: ${(props) => props.theme.colors?.mediumGray || '#777'}; /* Softened color */
  text-decoration: line-through;
  line-height: 1;
  opacity: 0.9;
`;

export const SaleBadge = styled.span<{ theme: DefaultTheme }>`
  background-color: ${(props) => props.theme.colors?.accent1Vibrant || props.theme.colors?.accent1 || '#d9534f'};
  color: ${(props) => props.theme.colors?.textLight || '#fff'};
  padding: ${(props) => props.theme.spacing?.(1) || '8px'} ${(props) => props.theme.spacing?.(1.5) || '12px'};
  border-radius: ${(props) => props.theme.borderRadius?.small || '4px'};
  font-size: ${(props) => props.theme.typography?.body?.sizes?.xsmall || '0.75rem'};
  font-weight: ${(props) => props.theme.typography?.body?.weights?.bold || 700};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
  white-space: nowrap;
`;

// --- Reviews Summary ---
export const ReviewsSummary = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing?.(1.5) || '12px'}; /* Slightly reduced gap */
  color: ${(props) => props.theme.colors?.darkGray || '#555'};
  font-size: ${(props) => props.theme.typography?.body?.sizes?.small || '0.875rem'};

  .star-rating {
    color: ${(props) => props.theme.colors?.adminStatusWarning || '#ffc107'}; /* Amber/Gold for stars */
    display: flex;
    align-items: center;
    gap: 3px; /* Space between stars */
    font-size: ${(props) => props.theme.typography?.body?.sizes?.base || '1rem'}; /* Slightly larger stars */
  }
  a {
    color: ${(props) => props.theme.colors?.darkGray || '#555'};
    text-decoration: none; /* Removed underline by default for cleaner look */
    border-bottom: 1px solid ${(props) => props.theme.colors?.mediumGray || '#ccc'}; /* Subtle underline */
    padding-bottom: 2px;
    text-underline-offset: 4px; /* Increased offset */
    transition: color 0.2s ease-out, border-bottom-color 0.2s ease-out;
    &:hover {
      color: ${(props) => props.theme.colors?.accent1 || '#007bff'};
      border-bottom-color: ${(props) => props.theme.colors?.accent1 || '#007bff'};
    }
  }
`;

// --- Short Description ---
export const ShortDescription = styled.p<{ theme: DefaultTheme }>`
  font-family: ${(props) => props.theme.typography?.body?.fontFamily || 'sans-serif'};
  font-size: ${(props) => props.theme.typography?.body?.sizes?.base || '1rem'};
  line-height: ${(props) => props.theme.typography?.body?.lineHeights?.base || 1.6}; /* Improved line height */
  color: ${(props) => props.theme.colors?.textMedium || '#444'}; /* Slightly lighter than textDark */
  margin: 0; /* Will rely on ProductInfoWrapper gap or section gap */
  max-width: 600px; /* Slightly increased max-width */
`;

// --- Variant Selection Area ---
export const VariantSection = styled.div<{ theme: DefaultTheme }>`
  /* margin-top is handled by ProductInfoWrapper gap */
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing?.(3) || '24px'}; /* Gap between different variant groups */
`;

export const VariantGroup = styled.div<{ theme: DefaultTheme }>`
  /* margin-bottom removed, relying on VariantSection gap */
`;

export const VariantLabel = styled.p<{ theme: DefaultTheme }>`
  font-family: ${(props) => props.theme.typography?.body?.fontFamily || 'sans-serif'};
  font-size: ${(props) => props.theme.typography?.body?.sizes?.small || '0.875rem'};
  font-weight: ${(props) => props.theme.typography?.body?.weights?.semiBold || 600};
  color: ${(props) => props.theme.colors?.textDark || '#222'};
  margin: 0 0 ${(props) => props.theme.spacing?.(1.5) || '12px'} 0; /* Space before options */
  text-transform: capitalize;

  span.selected-value {
    font-weight: ${(props) => props.theme.typography?.body?.weights?.regular || 400};
    color: ${(props) => props.theme.colors?.darkGray || '#555'};
    margin-left: ${(props) => props.theme.spacing?.(1) || '8px'};
  }
`;

export const VariantOptions = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing?.(1.5) || '12px'}; /* Gap between individual option buttons/swatches */
`;

// --- CTA & Quantity Section ---
export const ActionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing?.(3) || '24px'}; /* Gap between quantity/cart row and wishlist */
  padding-top: ${(props) => props.theme.spacing?.(2) || '16px'};
  /* Optional: border-top: 1px solid ${(props) => props.theme.colors?.lightGray || '#eee'}; */
`;

export const ActionsRow = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-wrap: wrap;
  align-items: stretch; /* Make items in row same height */
  gap: ${(props) => props.theme.spacing?.(2.5) || '20px'}; /* Increased gap */
  
  & > * { /* Target direct children: QuantityInput and AddToCartButton */
    flex-shrink: 0; /* Prevent shrinking, especially for QuantityInput */
  }
  
  /* Assuming QuantityInput is the first child */
  & > *:first-child {
    flex-grow: 0; /* Quantity input should not grow much */
    /* min-width: 120px; /* Ensure quantity input has enough space */
  }

  /* Assuming AddToCartButton is the second child */
  & > *:nth-child(2) {
    flex-grow: 1; /* Add to cart button takes remaining space */
    min-width: 200px; /* Ensure button text is not overly cramped */
  }
`;


export const WishlistButtonWrapper = styled.div<{ theme: DefaultTheme }>`
  /* margin-top removed, handled by ActionsSection gap */
  display: flex;
  align-items: center;
`;

// --- Other Info (Stock, SKU, Shipping Teaser, Tags) ---
export const OtherInfoSection = styled.div`
  padding-top: ${(props) => props.theme.spacing?.(2) || '16px'};
  /* Optional: border-top: 1px solid ${(props) => props.theme.colors?.lightGray || '#eee'}; */
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing?.(2) || '16px'};
`;

export const OtherInfoItem = styled.p<{ theme: DefaultTheme; $statusType?: string }>`
  font-family: ${(props) => props.theme.typography?.body?.fontFamily || 'sans-serif'};
  font-size: ${(props) => props.theme.typography?.body?.sizes?.small || '0.875rem'};
  color: ${(props) => {
    if (props.$statusType === 'in-stock') return darken(0.1, props.theme.colors?.adminStatusSuccess || '#28a745');
    if (props.$statusType === 'low-stock') return props.theme.colors?.adminStatusWarning || '#ffc107';
    if (props.$statusType === 'out-of-stock' || props.$statusType === 'unavailable') return props.theme.colors?.adminStatusError || '#dc3545';
    return props.theme.colors?.darkGray || '#555';
  }};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing?.(1.5) || '12px'};

  svg {
    color: ${(props) => {
    if (props.$statusType === 'in-stock') return props.theme.colors?.adminStatusSuccess || '#28a745';
    if (props.$statusType === 'low-stock') return props.theme.colors?.adminStatusWarning || '#ffc107';
    if (props.$statusType === 'out-of-stock' || props.$statusType === 'unavailable') return props.theme.colors?.adminStatusError || '#dc3545';
    if (props.$statusType === 'select-options') return props.theme.colors?.mediumGray || '#777';
    return props.theme.colors?.accent2 || props.theme.colors?.mediumGray || '#6c757d'; /* Default icon color */
  }};
    font-size: ${(props) => props.theme.typography?.body?.sizes?.base || '1rem'}; /* Slightly larger icons */
    flex-shrink: 0; /* Prevent icon shrinking */
  }
`;

export const TagsContainer = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${(props) => props.theme.spacing?.(1.5) || '12px'};
  align-items: center;
  padding-top: ${(props) => props.theme.spacing?.(0.5) || '4px'}; /* Small space above tags if grouped */
`;

export const TagItem = styled.span<{ theme: DefaultTheme }>`
  background-color: ${(props) => lighten(0.05, props.theme.colors?.primaryNeutral || '#f0f0f0')};
  color: ${(props) => props.theme.colors?.darkGray || '#555'};
  padding: ${(props) => props.theme.spacing?.(0.75) || '6px'} ${(props) => props.theme.spacing?.(1.5) || '12px'};
  border-radius: ${(props) => props.theme.borderRadius?.medium || '6px'}; /* Softer radius */
  font-size: ${(props) => props.theme.typography?.body?.sizes?.xsmall || '0.75rem'};
  font-weight: ${(props) => props.theme.typography?.body?.weights?.medium || 500};
  border: 1px solid ${(props) => transparentize(0.8, props.theme.colors?.mediumGray || '#ccc')}; /* Subtle border */
  transition: all 0.2s ease-out;

  &:hover {
    border-color: ${(props) => transparentize(0.5, props.theme.colors?.mediumGray || '#aaa')};
    background-color: ${(props) => lighten(0.02, props.theme.colors?.primaryNeutral || '#e9e9e9')};
  }
`;

export const OtherInfo = styled.div`
  /* margin-top: ${(props) => props.theme.spacing(4)}; // Rely on ProductInfoWrapper gap */
  font-size: ${(props) => props.theme.typography.body.sizes.small};
  color: ${(props) => props.theme.colors.textMedium}; // Was darkGray

  p {
    margin: ${({theme}) => theme.spacing(1.5)} 0 0 0; // Consistent vertical spacing for these items
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(1)};
    svg { 
      color: ${(props) => props.theme.colors.accent2}; 
      font-size: 1.1em; // Make icons slightly larger
      margin-right: ${({theme}) => theme.spacing(0.5)};
    }
  }

  .stock-in { color: ${({ theme }) => theme.colors.success || darken(0.1, theme.colors.adminStatusSuccess)}; } // Prefer theme.colors.success
  .stock-low { color: ${({ theme }) => theme.colors.warning || theme.colors.adminStatusWarning}; }
  .stock-out { color: ${({ theme }) => theme.colors.error || theme.colors.adminStatusError}; }

  /* Styling for inline product tags */
  .product-tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.spacing(1)};
    align-items: center;
  }

  .product-tag {
    background-color: ${({ theme }) => lighten(0.07, theme.colors.primaryNeutral)};
    padding: ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(1.5)};
    border-radius: ${(props) => props.theme.borderRadius.pill}; // Pills for tags
    font-size: ${(props) => props.theme.typography.body.sizes.xsmall};
    color: ${(props) => props.theme.colors.textMedium};
    line-height: 1.2;
  }
`;
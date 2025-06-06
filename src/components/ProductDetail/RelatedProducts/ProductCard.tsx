// src/components/ProductCard/ProductCard.tsx
import React, { useMemo, useCallback } from 'react'; 
import { Link as RouterLink } from 'react-router-dom'; 
// useTheme is NOT needed here if styled-components are correctly consuming theme from Provider
// import { useTheme, type DefaultTheme } from 'styled-components'; 
import { FaEye, FaHeart, FaShoppingCart, FaRegHeart } from 'react-icons/fa';

import {
  StyledProductCard,
  ProductImageLink,
  BadgesContainer,
  Badge,
  ProductContent,
  ProductName,
  PriceInfo,
  CurrentPrice,
  OriginalPrice,
  ProductShippingText,
  QuickActionsOverlay,
} from './ProductCard.styles';

// Assuming FrontendButton is correctly styled and located
import { FrontendButton } from '../Button.styles'; // Adjust path if needed, or ensure it's globally available/themed

// ProductData interface remains the same as you provided
export interface ProductData {
  id: string; name: string; price: number; image: string; link: string; originalPrice?: number;
  isNew?: boolean; isBestseller?: boolean; shippingInfo?: string;
  badges?: Array<{ text: string; type: string; backgroundColor?: string; textColor?: string; }>;
  brandName?: string;
}

interface ProductCardProps {
  product: ProductData;
  index?: number; // For staggered animation
  onAddToCart?: (productId: string) => void;
  onToggleWishlist?: (productId: string, currentWishlistStatus: boolean) => void; 
  onQuickView?: (productId: string) => void;
  isInWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onAddToCart,
  onToggleWishlist,
  onQuickView,
  isInWishlist = false, 
}) => {
  // theme object is not explicitly needed here if using styled-components <ThemeProvider> correctly
  // const theme = useTheme() as DefaultTheme; 

  const {
    id, name, price, image, link, originalPrice,
    isNew, isBestseller, shippingInfo, badges: customBadgesFromProp, brandName
  } = product;

  const isOnSale = originalPrice != null && originalPrice > price; // Strict check for null/undefined

  const displayBadges = useMemo(() => {
    const combinedBadges: ProductData['badges'] = [];
    // Add 'New Arrival' and 'Bestseller' at the beginning if applicable
    if (isNew) { combinedBadges.push({ text: 'New', type: 'new' }); } // Shortened text
    if (isBestseller) { combinedBadges.push({ text: 'Bestseller', type: 'bestseller' }); }
    if (customBadgesFromProp) { combinedBadges.push(...customBadgesFromProp); }
    // Return up to 2 badges to prevent clutter; prioritize New/Bestseller if custom badges also exist.
    return combinedBadges.slice(0, 2); 
  }, [isNew, isBestseller, customBadgesFromProp]);

  const handleQuickViewClick = useCallback((e: React.MouseEvent) => { /* ... (no change needed) ... */ e.preventDefault(); e.stopPropagation(); onQuickView?.(id); }, [id, onQuickView]);
  const handleAddToCartClick = useCallback((e: React.MouseEvent) => { /* ... (no change needed) ... */ e.preventDefault(); e.stopPropagation(); onAddToCart?.(id); }, [id, onAddToCart]);
  const handleToggleWishlistClick = useCallback((e: React.MouseEvent) => { /* ... (no change needed) ... */ e.preventDefault(); e.stopPropagation(); onToggleWishlist?.(id, isInWishlist); }, [id, onToggleWishlist, isInWishlist]);

  return (
    <StyledProductCard $index={index}> {/* Pass $index for animation */}
      <RouterLink 
        to={link} 
        style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%'}}
        aria-label={`View details for ${name}`} 
        title={name}
      >
        <ProductImageLink className="product-image-display"> {/* No theme prop */}
          {displayBadges.length > 0 && (
            <BadgesContainer> {/* No theme prop */}
              {displayBadges.map((badge, badgeIdx) => ( 
                <Badge 
                  key={`${badge.type}-${badgeIdx}`}  // Use badgeIdx for more stable key if text/type can repeat
                  $type={badge.type}
                  // Custom BG/Text color from data overrides theme-based type styling if present
                  style={{ 
                    backgroundColor: badge.backgroundColor, 
                    color: badge.textColor 
                  }}
                >
                  {badge.text}
                </Badge>
              ))}
            </BadgesContainer>
          )}
          <img src={image} alt={name} loading="lazy" />
        </ProductImageLink>

        <ProductContent> {/* No theme prop */}
          {brandName && (
            // For Élan, brand name should be subtly elegant
            <p style={{
              fontFamily: theme.typography.body.fontFamily, // Access theme via props if needed inside style prop (not ideal)
                                                            // Better to create a styled-component for this if used often
              fontSize: theme.typography.body.sizes.xsmall, // Very subtle brand
              color: theme.colors.textMuted, // Muted brand color
              margin: `0 0 ${theme.spacing(1)} 0`, 
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              opacity: 0.9
            }}>{brandName}</p>
          )}
          <ProductName title={name}>{name}</ProductName> {/* No theme prop */}
          
          {/* PriceInfo pushed to bottom due to flex-grow on ProductContent and margin-top: auto */}
          <PriceInfo> {/* No theme prop */}
            <CurrentPrice $onSale={isOnSale}> {/* No theme prop, pass $onSale */}
              ${price.toFixed(2)}
            </CurrentPrice>
            {isOnSale && originalPrice != null && ( // Check originalPrice not null
              <OriginalPrice>${originalPrice.toFixed(2)}</OriginalPrice> /* No theme prop */
            )}
          </PriceInfo>
          {shippingInfo && ( // Consider if this should be above PriceInfo for Élan style
            <ProductShippingText>{shippingInfo}</ProductShippingText> /* No theme prop */
          )}
        </ProductContent>
      </RouterLink>

      {(onQuickView || onAddToCart || onToggleWishlist) && (
        <QuickActionsOverlay className="quick-actions-overlay"> {/* No theme prop */}
          {onQuickView && (
            <FrontendButton $variant="iconOnly" $size="medium" onClick={handleQuickViewClick} title="Quick View" aria-label={`Quick view ${name}`} > {/* Size medium for easier tap */}
              <FaEye />
            </FrontendButton>
          )}
          {onAddToCart && (
             <FrontendButton $variant="iconOnly" $size="medium" onClick={handleAddToCartClick} title="Add to Cart" aria-label={`Add ${name} to cart`} >
              <FaShoppingCart />
            </FrontendButton>
          )}
          {onToggleWishlist && (
            <FrontendButton $variant="iconOnly" $size="medium" onClick={handleToggleWishlistClick} title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"} aria-label={isInWishlist ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`} aria-pressed={isInWishlist} >
              {/* For Élan, the filled heart could use theme.colors.accent1 or theme.colors.error for a stronger statement */}
              {isInWishlist ? <FaHeart style={{color: theme.colors.accent1Vibrant || theme.colors.accent1}} /> : <FaRegHeart />}
            </FrontendButton>
          )}
        </QuickActionsOverlay>
      )}
    </StyledProductCard>
  );
};

export default ProductCard;
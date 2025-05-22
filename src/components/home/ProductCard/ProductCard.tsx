// src/components/Shared/ProductCard/ProductCard.tsx
import React, { useRef, useState, useEffect, type ReactNode } from 'react';
import {
  StyledProductCard,
  ProductImageWrapper,
  ProductDetails,
  ProductName,
  ProductPrice,
  Badge
} from './ProductCard.styles';

// --- Shared ProductData interface (to be potentially defined globally or in a common types file) ---
export interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  isBestseller?: boolean;
  link: string;
  quickViewLink?: string; // Optional: used in ProductCarousel
}

interface ProductCardProps {
  product: ProductData;
  index?: number; // Optional index for staggered animation
  children?: ReactNode; // Optional: for actions overlay or other custom content passed from parent
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void; // Optional click handler for the entire card
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  children,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the card is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []); // Empty dependency array: observe on mount and clean up on unmount

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e); // Use the provided onClick handler if present
    } else if (!e.defaultPrevented) { // If a child (like a button) already handled click and prevented default
      window.location.href = product.link; // Default navigation for the card itself
    }
  };

  return (
    <StyledProductCard
      ref={cardRef}
      className={isVisible ? "is-visible" : ""}
      style={{ '--animation-delay': `${index * 80}ms` } as React.CSSProperties}
      onClick={handleCardClick}
    >
      <ProductImageWrapper>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.isNew && <Badge $type="new">New Arrival</Badge>}
        {product.isBestseller && <Badge $type="bestseller">Bestseller</Badge>}
      </ProductImageWrapper>
      <ProductDetails>
        <ProductName title={product.name}>{product.name}</ProductName>
        <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
        {children} {/* Renders QuickActionOverlay (and its buttons) or other content */}
      </ProductDetails>
    </StyledProductCard>
  );
};

export default ProductCard;
// src/components/ProductListing/ProductCard.tsx
import React from 'react';
import styled, { css } from 'styled-components';
import { FaStar, FaRegStar, FaStarHalfAlt, FaRocket } from 'react-icons/fa';
import type { Product } from '../../data/mockData'; // Assuming Product interface is here
import { getProductImage } from '../../utils/imageUtils'; // Image utility

// --- Types ---
interface ProductCardProps {
  product: Product;
}

// --- Styled Components ---
const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.typography.fonts.body};
  background-color: ${({ theme }) => theme.colors.backgroundLight}; // usually white
  border-radius: ${({ theme }) => theme.borderRadius.small}; // Slight rounding if any, or none
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.base} all;
  min-width: 0; // for flex items

  // No explicit shadow in the image for individual cards, maybe a subtle one on hover or if cards overlap.
  // box-shadow: ${({ theme }) => theme.shadows.sm};
  // &:hover {
  //   transform: translateY(-2px);
  //   box-shadow: ${({ theme }) => theme.shadows.md};
  // }
`;

const ImageLink = styled.a`
  display: block;
  text-decoration: none;
`;

const ImageWrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.lightGray}; // Placeholder bg
  
  img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 4 / 5; // Matches common e-commerce aspect ratios and visual in image
    object-fit: cover;
  }
`;

const InfoWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(3)};
`;

const BrandSellerText = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(1)};
  display: flex;
  align-items: center;

  svg { // For Rocket icon
    color: #DE3D4B; // Coupang Rocket specific color, not in theme currently
    margin-right: ${({ theme }) => theme.spacing(1)};
    font-size: 0.9rem;
  }
`;

const ProductName = styled.h3`
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.textDark};
  font-weight: ${({ theme }) => theme.typography.body.weights.regular};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  margin: 0 0 ${({ theme }) => theme.spacing(2)};
  height: calc(${({ theme }) => theme.typography.lineHeights.tight} * ${({ theme }) => theme.typography.body.sizes.small} * 2); // Approx 2 lines
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  gap: ${({ theme }) => theme.spacing(2)};
`;

const DiscountPercentage = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sizes.medium};
  color: #FA482D; // Specific discount red from Coupang design
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
`;

const CurrentPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sizes.medium}; // Example had 17,800, which seems a bit larger
  color: ${({ theme }) => theme.colors.textDark};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};

  // Apply a larger font for specific cases if needed via prop
  ${(props: {isEmphasized?: boolean}) => props.isEmphasized && css`
    font-size: ${({ theme }) => theme.typography.body.sizes.large}; /* Match 13,500 / 19,500 size */
  `}

  &::after {
    content: '원';
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    font-weight: ${({ theme }) => theme.typography.body.weights.regular};
    margin-left: 2px;
  }
`;


const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  color: ${({ theme }) => theme.colors.textMuted};
  text-decoration: line-through;
  margin-left: ${({ theme }) => theme.spacing(1)};
`;

const DeliveryInfo = styled.p`
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  color: #0073E9; // Delivery info blue from image - can be theme.colors.info
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  margin: 0 0 ${({ theme }) => theme.spacing(2)};
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0 0 ${({ theme }) => theme.spacing(2)};

  .stars {
    color: #FFC107; // Using admin warning color for gold stars, good match
    margin-right: ${({ theme }) => theme.spacing(1)};
    display: flex;
    align-items: center;

    svg {
      font-size: 0.8rem; // Smaller stars
    }
  }
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const Tag = styled.span`
  font-size: 0.65rem; // Very small text
  color: #795548; // Brownish color - close to theme.colors.accent1 or a derivative
  background-color: #F5F5F5; // Light gray background - theme.colors.adminSecondaryBg
  border: 1px solid #E0E0E0; // theme.colors.lightGray
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1)};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

// Helper for rendering stars
const renderStars = (rating: number = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} />);
  }
  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" />);
  }
  const emptyStarsCount = 5 - stars.length;
  for (let i = 0; i < emptyStarsCount; i++) {
    stars.push(<FaRegStar key={`empty-${i}`} />);
  }
  return stars;
};

// --- Component ---
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Determine if price should be emphasized (like 13,500 and 19,500 in the image)
  const isPriceEmphasized = product.price <= 20000 && product.discountPercentage && product.discountPercentage >= 25;

  return (
    <CardWrapper>
      <ImageLink href="#" title={product.name}> {/* Simple link, replace with router Link */}
        <ImageWrapper>
          <img src={product.imageUrl} alt={product.name} loading="lazy" />
        </ImageWrapper>
      </ImageLink>
      <InfoWrapper>
        {product.brandOrSeller && (
          <BrandSellerText>
            {product.isRocketShipping && <FaRocket />}
            {product.brandOrSeller}
          </BrandSellerText>
        )}
        <ProductName>{product.name}</ProductName>
        <PriceRow>
          {product.discountPercentage && (
            <DiscountPercentage>{product.discountPercentage}%</DiscountPercentage>
          )}
          <CurrentPrice isEmphasized={isPriceEmphasized}>
            {product.price.toLocaleString()}
          </CurrentPrice>
          {product.originalPrice && (
            <OriginalPrice>{product.originalPrice.toLocaleString()}원</OriginalPrice>
          )}
        </PriceRow>
        {product.deliveryInfo && (
            <DeliveryInfo>{product.deliveryInfo}</DeliveryInfo>
        )}
        {product.rating !== undefined && product.reviewCount !== undefined && (
          <RatingWrapper>
            <span className="stars">{renderStars(product.rating)}</span>
            ({product.reviewCount.toLocaleString()})
          </RatingWrapper>
        )}
        {product.tags && product.tags.length > 0 && (
          <TagsWrapper>
            {product.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </TagsWrapper>
        )}
      </InfoWrapper>
    </CardWrapper>
  );
};

export default ProductCard;
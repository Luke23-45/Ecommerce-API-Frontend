// src/components/ProductListing/ProductCard.tsx
import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt, FaRocket, FaCreditCard } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa'; 

import type { Product } from '../../data/mockData'; 

import * as S from './ProductCard.styles';
import { useNavigate } from 'react-router-dom';

const renderStars = (rating: number = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = (rating - fullStars) >= 0.4; 

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`star-full-${i}`} />);
  }
  if (hasHalfStar && stars.length < 5) {
    stars.push(<FaStarHalfAlt key="star-half" />);
  }
  const emptyStarsCount = 5 - stars.length;
  for (let i = 0; i < emptyStarsCount; i++) {
    stars.push(<FaRegStar key={`star-empty-${stars.length + i}`} />);
  }
  return stars;
};


const CardTagIcon: React.FC = () => <FaCreditCard style={{ fontSize: '8px', color: 'white' }} />; 
const PointTagIcon: React.FC = () => <FaCoins style={{ fontSize: '8px', color: 'white' }}/>;   


const ProductCard: React.FC<{ product: Product }> = ({ product }) => {

  const productNameOnly = product.name?.split(',')[0].trim();
  const productVolumeInfo = product.name?.substring(productNameOnly.length)?.replace(/^,/, '').trim();

  const navigate = useNavigate();

  const navigateToDetail = (id:any) =>{
    navigate(`/productid/${id}`)
  }


  return (
    <S.CardWrapper onClick={() => navigateToDetail(product.id)}>
      <S.ImageLink href="#" title={product.name}>
        <S.ImageWrapper>
          <img src={product.imageUrl || `https://picsum.photos/seed/${product.id}/300/400`} alt={product.name} loading="lazy" />
        </S.ImageWrapper>
      </S.ImageLink>

      <S.InfoWrapper>
        <S.ProductNameAndVolume>
            <S.ProductName>{productNameOnly || "Skin/Toner Sample Name"}</S.ProductName>
            {productVolumeInfo && <S.ProductVolume>{productVolumeInfo}</S.ProductVolume>}
        </S.ProductNameAndVolume>

        {(product.discountPercentage && product.originalPrice) && (
          <S.DiscountOriginalPrice>
            {product.discountPercentage}%
            <S.OriginalPriceStriked>{product.originalPrice.toLocaleString()}$</S.OriginalPriceStriked>
          </S.DiscountOriginalPrice>
        )}

        <S.CurrentPriceAndShipping>
          <S.CurrentPriceText>{(product.price || 10000).toLocaleString()}</S.CurrentPriceText>
          {product.isRocketShipping && (
            <S.RocketShippingText>
              <FaRocket />
        Rocket delivery
            </S.RocketShippingText>
          )}
        </S.CurrentPriceAndShipping>
        
        {product.unitPriceInfo && (
            <S.UnitPriceText>({product.unitPriceInfo})</S.UnitPriceText>
        )}

        {product.deliveryAssurance && (
            <S.DeliveryAssuranceText>{product.deliveryAssurance}</S.DeliveryAssuranceText>
        )}
        
        {product.sellerInfo && (
            <S.SellerInfoText>{product.sellerInfo}</S.SellerInfoText>
        )}

        {product.rating !== undefined && product.reviewCount !== undefined && product.reviewCount > 0 && (
          <S.Rating>
            <span className="stars">{renderStars(product.rating)}</span>
            ({product.reviewCount.toLocaleString()})
          </S.Rating>
        )}


        {product.tags && product.tags.length > 0 && (
          <S.TagsWrapper>
            {product.tags.map((tag, index) => {
              if (tag.toLowerCase().includes('카드')) {
                return (
                  <S.CardDiscountTag key={`tag-${index}`}>
                    <span className="tag-icon">
                        <CardTagIcon />
                    </span>
                    {tag}
                  </S.CardDiscountTag>
                );
              } else if (tag.toLowerCase().includes('적립')) {
                return (
                  <S.PointBenefitTag key={`tag-${index}`}>
                     <span className="tag-icon">
                        <PointTagIcon />
                     </span>
                    {tag}
                  </S.PointBenefitTag>
                );
              }
           
              return null;
            })}
          </S.TagsWrapper>
        )}
      </S.InfoWrapper>
    </S.CardWrapper>
  );
};

export default ProductCard;
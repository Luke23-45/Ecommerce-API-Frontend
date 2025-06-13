import React, { useMemo, useCallback } from "react";
import { useTheme } from "styled-components";
import {
  FaShoppingCart,
  FaRegHeart,
  FaStar,
  FaTags,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

import {
  ProductInfoWrapper,
  ProductCategoryLink,
  ProductName,
  PriceContainer,
  CurrentPrice,
  OriginalPrice,
  SaleBadge,
  ReviewsSummary,
  ShortDescription,
  VariantSection,
  VariantGroup,
  VariantLabel,
  VariantOptions,
  ActionsRow,
  WishlistButtonWrapper,
  OtherInfo,
  StockStatus,
} from "./ProductInfo.styles";
import { FrontendButton } from "./Button.styles";
import QuantityInput from "./QuantityInput";
import ColorSwatch from "./ColorSwatch";
import SizeButton from "./SizeButton";

export interface ProductVariantOptionValue {
  id: string;
  value: string;
  swatch?: string;
}

export interface ProductVariantOption {
  id: string;
  name: string;
  displayType: "swatch" | "button";
  values: ProductVariantOptionValue[];
}

export interface ProductVariant {
  id: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isAvailable: boolean;
  imageUrls: string[];
  options: Record<string, string>;
  sku?: string;
}

export interface ProductReviewSummary {
  averageRating: number;
  reviewCount: number;
}

export interface ProductInfoData {
  id: string;
  name: string;
  shortDescription: string;
  reviewSummary?: ProductReviewSummary;
  options: ProductVariantOption[];
  variants: ProductVariant[];
  tags?: string[];
  shippingTeaser?: string;
  fullDescriptionHTML?: string;
}

interface ProductInfoProps {
  productData: ProductInfoData;
  selectedOptions: Record<string, string>;
  currentVariant: ProductVariant | null;
  quantity: number;
  onVariantChange: (optionName: string, optionValue: string) => void;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
  isAddingToCart: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productData,
  selectedOptions,
  currentVariant,
  quantity,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  isAddingToCart,
}) => {
  const theme = useTheme();

  const displayPrice = useMemo(() => {
    if (currentVariant) {
      return currentVariant.price;
    }

    const prices = productData.variants
      .map((v) => v.price)
      .filter((p) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  }, [currentVariant, productData.variants]);

  const originalDisplayPrice = useMemo(() => {
    return currentVariant?.originalPrice;
  }, [currentVariant]);

  const { statusText, isAvailable } = useMemo(() => {
    if (currentVariant) {
      return {
        statusText: currentVariant.isAvailable ? "In Stock" : "Out of Stock",
        isAvailable: currentVariant.isAvailable,
      };
    }
    return {
      statusText: "Select options to check availability",
      isAvailable: false,
    };
  }, [currentVariant]);

  return (
    <ProductInfoWrapper>
      {/* Category and Brand links can be added here if needed */}
      <ProductName>{productData.name}</ProductName>

      {productData.reviewSummary &&
        productData.reviewSummary.reviewCount > 0 && (
          <ReviewsSummary>
            <FaStar />
            <span>{productData.reviewSummary.averageRating.toFixed(1)}</span>
            <a href="#reviews">
              ({productData.reviewSummary.reviewCount} Reviews)
            </a>
          </ReviewsSummary>
        )}

      <PriceContainer>
        <CurrentPrice
          $onSale={
            !!originalDisplayPrice && originalDisplayPrice > displayPrice
          }
        >
          ${displayPrice.toFixed(2)}
        </CurrentPrice>
        {originalDisplayPrice && originalDisplayPrice > displayPrice && (
          <>
            <OriginalPrice>${originalDisplayPrice.toFixed(2)}</OriginalPrice>
            <SaleBadge>
              SAVE{" "}
              {Math.round(
                ((originalDisplayPrice - displayPrice) / originalDisplayPrice) *
                  100
              )}
              %
            </SaleBadge>
          </>
        )}
      </PriceContainer>

      <ShortDescription>{productData.shortDescription}</ShortDescription>

      {productData.options.map((option) => (
        <VariantSection key={option.id}>
          <VariantGroup>
            <VariantLabel>
              {option.name}: <span>{selectedOptions[option.name]}</span>
            </VariantLabel>
            <VariantOptions>
              {option.values.map((value) => {
                if (option.displayType === "swatch") {
                  return (
                    <ColorSwatch
                      key={value.id}
                      color={value.swatch || "#ccc"}
                      label={value.value}
                      isSelected={selectedOptions[option.name] === value.id}
                      onClick={() => onVariantChange(option.name, value.id)}
                    />
                  );
                }
                if (option.displayType === "button") {
                  return (
                    <SizeButton
                      key={value.id}
                      label={value.value}
                      isSelected={selectedOptions[option.name] === value.id}
                      onClick={() => onVariantChange(option.name, value.id)}
                    />
                  );
                }
                return null;
              })}
            </VariantOptions>
          </VariantGroup>
        </VariantSection>
      ))}

      <StockStatus $isAvailable={isAvailable}>
        {isAvailable ? <FaCheckCircle /> : <FaTimesCircle />}
        {statusText}
      </StockStatus>

      <ActionsRow>
        <QuantityInput
          currentQuantity={quantity}
          onQuantityChange={onQuantityChange}
          maxQuantity={currentVariant?.stock ?? 0}
          disabled={!isAvailable}
        />

        <FrontendButton
          as="button"
          $variant="primary"
          $size="large"
          onClick={onAddToCart}
          disabled={!isAvailable || isAddingToCart}
          style={{ flexGrow: 1.5 }}
        >
          <FaShoppingCart />
          {isAddingToCart
            ? "Adding..."
            : isAvailable
            ? "Add to Cart"
            : "Unavailable"}
        </FrontendButton>
      </ActionsRow>

      <WishlistButtonWrapper>
        <FrontendButton $variant="secondary">
          <FaRegHeart /> Add to Wishlist
        </FrontendButton>
      </WishlistButtonWrapper>

      <OtherInfo>
        {currentVariant?.sku && (
          <p>
            <FaTags /> SKU: {currentVariant.sku}
          </p>
        )}
        {productData.tags && productData.tags.length > 0 && (
          <p className="tags-container">
            <FaTags />
            {productData.tags.map((tag) => (
              <span key={tag} className="tag-item">
                {tag}
              </span>
            ))}
          </p>
        )}
      </OtherInfo>
    </ProductInfoWrapper>
  );
};

export default ProductInfo;

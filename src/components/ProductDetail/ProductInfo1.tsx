import React, { useMemo, useCallback, useEffect } from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaRegHeart,
  FaHeart,
  FaStar,
  FaTags,
  FaCheckCircle,
  FaTimesCircle,
  FaRulerCombined,
  FaWeightHanging,
  FaInfoCircle,
  FaTruck,
  FaQuestionCircle,
  FaRegStar,
  FaStarHalfAlt,
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
  ProductSpecifications,
} from "./ProductInfo.styles";
import { FrontendButton } from "./Button.styles";
import QuantityInput from "./QuantityInput";
import ColorSwatch from "./ColorSwatch";
import SizeButton from "./SizeButton";

export interface ProductDimensionsFE {
  length?: number;
  width?: number;
  height?: number;
  unit?: string;
}
export interface ProductWeightFE {
  value?: number;
  unit?: string;
}

export interface ProductVariantOptionValue {
  id: string;
  value: string;
  swatch?: string;
}

export interface ProductDisplayOption {
  id: string;
  name: string;
  displayType: "swatch" | "button" | "dropdown";
  values: ProductVariantOptionValue[];
}

export interface ProductVariant {
  id: string;
  sku?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isAvailable: boolean;
  imageUrls: string[];
  options: Record<string, string>;

  weight?: number;
  weightUnit?: string;
  dimensions?: ProductDimensionsFE;
}

export interface ProductReviewSummary {
  averageRating: number;
  reviewCount: number;
}

export interface ProductInfoData {
  id: string;
  name: string;
  shortDescription: string;
  category?: { name: string; link?: string };
  brand?: { name: string; link?: string };
  reviewSummary?: ProductReviewSummary;

  options: ProductDisplayOption[];
  variants: ProductVariant[];

  price?: number;
  originalPrice?: number;
  sku?: string;
  stockStatus?: string;
  tags?: string[];

  defaultWeight?: number;
  defaultWeightUnit?: string;
  defaultDimensions?: ProductDimensionsFE;
  isShippingRequired?: boolean;
  material?: string;
  origin?: string;
}

interface ProductInfoProps {
  productData: ProductInfoData | null;
  selectedOptions: Record<string, string | null>;
  currentVariant: ProductVariant | null;
  quantity: number;
  onOptionSelect: (optionName: string, optionValueId: string) => void;
  onQuantityChange: (newQuantity: number) => void;
  onAddToCart: () => void;
  isAddingToCart: boolean;

  isInWishlist?: boolean;
  onAddToWishlist?: () => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productData,
  selectedOptions,
  currentVariant,
  quantity,
  onOptionSelect,
  onQuantityChange,
  onAddToCart,
  isAddingToCart,
  isInWishlist = false,
  onAddToWishlist,
}) => {
  const theme = useTheme() as DefaultTheme;
  const navigate = useNavigate();

  if (!productData) {
    return (
      <ProductInfoWrapper style={{ minHeight: "300px" }}>
        {/* Basic Loading/Empty State */}
      </ProductInfoWrapper>
    );
  }

  const displayPrice = useMemo(() => {
    if (currentVariant) return currentVariant.price;
    if (productData.options.length === 0 && productData.variants.length > 0)
      return productData.variants[0].price;
    return productData.price ?? 0;
  }, [
    currentVariant,
    productData.price,
    productData.options,
    productData.variants,
  ]);

  const displayOriginalPrice = useMemo(() => {
    if (currentVariant) return currentVariant.originalPrice;
    if (productData.options.length === 0 && productData.variants.length > 0)
      return productData.variants[0].originalPrice;
    return productData.originalPrice;
  }, [
    currentVariant,
    productData.originalPrice,
    productData.options,
    productData.variants,
  ]);

  const { statusText, isActuallyAvailable, stockLevelText } = useMemo(() => {
    if (!productData.options || productData.options.length === 0) {
      const baseStock = productData.variants[0]?.stock ?? 0;
      const baseIsAvailable = productData.variants[0]?.isAvailable ?? false;
      let text = baseIsAvailable ? "In Stock" : "Out of Stock";
      let stockLvl = "";
      if (baseIsAvailable && baseStock > 0 && baseStock <= 5)
        stockLvl = `Only ${baseStock} left!`;

      return {
        statusText: text,
        isActuallyAvailable: baseIsAvailable,
        stockLevelText: stockLvl,
      };
    }

    const allOptionsSelectedByUser = productData.options.every(
      (option) =>
        selectedOptions[option.id] !== null &&
        selectedOptions[option.id] !== undefined
    );

    if (!allOptionsSelectedByUser) {
      return {
        statusText: "Please select options",
        isActuallyAvailable: false,
        stockLevelText: "",
      };
    }

    if (currentVariant) {
      let text = "In Stock";
      let stockLvl = "";
      if (!currentVariant.isAvailable || currentVariant.stock <= 0) {
        text = "Out of Stock";
      } else if (currentVariant.stock <= 5) {
        text = "Low Stock";
        stockLvl = `Only ${currentVariant.stock} left!`;
      }
      return {
        statusText: text,
        isActuallyAvailable:
          currentVariant.isAvailable && currentVariant.stock > 0,
        stockLevelText: stockLvl,
      };
    }

    return {
      statusText: "Combination Unavailable",
      isActuallyAvailable: false,
      stockLevelText: "",
    };
  }, [
    currentVariant,
    productData.options,
    productData.variants,
    selectedOptions,
  ]);

  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) stars.push(<FaStar key={`star-full-${i}`} />);
      else if (i - 0.5 <= rating)
        stars.push(<FaStarHalfAlt key={`star-half-${i}`} />);
      else stars.push(<FaRegStar key={`star-empty-${i}`} />);
    }
    return (
      <span
        className="star-icons"
        aria-label={`Rating: ${rating} out of 5 stars`}
      >
        {stars}
      </span>
    );
  };

  const getSelectedOptionDisplayValue = (optionId: string): string => {
    const selectedValueId = selectedOptions[optionId];
    if (!selectedValueId) return "Select";
    const optionGroup = productData.options.find((opt) => opt.id === optionId);
    const valueObj = optionGroup?.values.find(
      (val) => val.id === selectedValueId
    );
    return valueObj?.value || "Selected";
  };

  const isOptionValueDisabled = (
    optionGroupId: string,
    optionValueId: string
  ): boolean => {
    if (!productData.options || productData.options.length === 0) return false;

    const tempSelectedOptions = {
      ...selectedOptions,
      [optionGroupId]: optionValueId,
    };

    const allOptionGroupsWouldBeSelected = productData.options.every(
      (opt) =>
        tempSelectedOptions[opt.id] !== null &&
        tempSelectedOptions[opt.id] !== undefined
    );

    if (allOptionGroupsWouldBeSelected) {
      const wouldMatchAvailableVariant = productData.variants.some(
        (variant) =>
          variant.isAvailable &&
          productData.options.every(
            (opt) => variant.options[opt.id] === tempSelectedOptions[opt.id]
          )
      );
      return !wouldMatchAvailableVariant;
    }

    return false;
  };

  const formatDimensions = (dimensions?: ProductDimensionsFE) => {
    if (
      !dimensions ||
      (!dimensions.length && !dimensions.width && !dimensions.height) ||
      !dimensions.unit
    )
      return null;
    return `${dimensions.length || "-"}${dimensions.unit} L x ${
      dimensions.width || "-"
    }${dimensions.unit} W x ${dimensions.height || "-"}${
      dimensions.unit
    } H`.replace(/-undefined L x -undefined W x -undefined H/g, "N/A");
  };

  const formatWeight = (value?: number, unit?: string) => {
    if (value === undefined || !unit) return null;
    return `${value} ${unit}`;
  };

  const displayedDimensions = formatDimensions(
    currentVariant?.dimensions || productData.defaultDimensions
  );
  const displayedWeight = formatWeight(
    currentVariant?.weight ?? productData.defaultWeight,
    currentVariant?.weightUnit ?? productData.defaultWeightUnit
  );

  let addToCartButtonText = "Add to Cart";
  if (!isActuallyAvailable) addToCartButtonText = "Out of Stock";
  else if (productData.options.length > 0 && !currentVariant)
    addToCartButtonText = "Select Options";
  if (isAddingToCart) addToCartButtonText = "Adding...";

  return (
    <ProductInfoWrapper>
      {(productData.category || productData.brand) && (
        <ProductCategoryLink
          onClick={() =>
            productData.category?.link && navigate(productData.category.link)
          }
          title={`View all ${productData.category?.name}`}
        >
          {productData.category?.name || "Uncategorized"}
          {productData.brand?.name && productData.category?.name && " / "}
          {productData.brand?.name && (
            <span
              className="brand-link"
              onClick={(e) => {
                e.stopPropagation();
                productData.brand?.link && navigate(productData.brand.link);
              }}
              title={`Explore brand: ${productData.brand.name}`}
            >
              {productData.brand.name}
            </span>
          )}
        </ProductCategoryLink>
      )}

      <ProductName>{productData.name}</ProductName>

      {productData.reviewSummary &&
        productData.reviewSummary.reviewCount > 0 && (
          <ReviewsSummary href={`#product-details-tabs`}>
            {renderStars(productData.reviewSummary.averageRating)}
            <span className="review-count-text">
              ({productData.reviewSummary.reviewCount} Reviews)
            </span>
          </ReviewsSummary>
        )}

      <PriceContainer>
        <CurrentPrice
          $onSale={
            !!displayOriginalPrice && displayOriginalPrice > displayPrice
          }
        >
          {theme.currencySymbol || "$"}
          {displayPrice.toFixed(2)}
        </CurrentPrice>
        {displayOriginalPrice && displayOriginalPrice > displayPrice && (
          <>
            <OriginalPrice>
              {theme.currencySymbol || "$"}
              {displayOriginalPrice.toFixed(2)}
            </OriginalPrice>
            <SaleBadge>
              SAVE{" "}
              {Math.round(
                ((displayOriginalPrice - displayPrice) / displayOriginalPrice) *
                  100
              )}
              %
            </SaleBadge>
          </>
        )}
      </PriceContainer>

      <ShortDescription>{productData.shortDescription}</ShortDescription>

      {productData.options.map((optionGroup) => (
        <VariantSection key={optionGroup.id}>
          <VariantGroup>
            <VariantLabel>
              {optionGroup.name}:{" "}
              <span className="selected-value">
                {getSelectedOptionDisplayValue(optionGroup.id)}
              </span>
            </VariantLabel>
            <VariantOptions>
              {optionGroup.values.map((value) => {
                const isDisabled = isOptionValueDisabled(
                  optionGroup.id,
                  value.id
                );
                if (optionGroup.displayType === "swatch") {
                  return (
                    <ColorSwatch
                      key={value.id}
                      color={value.swatch || "#ccc"}
                      label={value.value}
                      isSelected={selectedOptions[optionGroup.id] === value.id}
                      onClick={() =>
                        !isDisabled && onOptionSelect(optionGroup.id, value.id)
                      }
                      disabled={isDisabled}
                      title={
                        value.value +
                        (isDisabled
                          ? " (Unavailable with current selections)"
                          : "")
                      }
                    />
                  );
                }
                if (optionGroup.displayType === "button") {
                  return (
                    <SizeButton
                      key={value.id}
                      label={value.value}
                      isSelected={selectedOptions[optionGroup.id] === value.id}
                      onClick={() =>
                        !isDisabled && onOptionSelect(optionGroup.id, value.id)
                      }
                      disabled={isDisabled}
                      title={
                        value.value +
                        (isDisabled
                          ? " (Unavailable with current selections)"
                          : "")
                      }
                    />
                  );
                }

                return null;
              })}
            </VariantOptions>
          </VariantGroup>
        </VariantSection>
      ))}

      <StockStatus
        $isAvailable={isActuallyAvailable}
        $isLowStock={statusText === "Low Stock"}
      >
        {isActuallyAvailable ? (
          <FaCheckCircle />
        ) : statusText === "Please select options" ? (
          <FaQuestionCircle />
        ) : (
          <FaTimesCircle />
        )}
        {statusText}{" "}
        {isActuallyAvailable && stockLevelText && (
          <span className="low-stock-emphasis">{stockLevelText}</span>
        )}
      </StockStatus>

      <ActionsRow>
        <QuantityInput
          currentQuantity={quantity}
          onQuantityChange={onQuantityChange}
          maxQuantity={
            currentVariant?.stock ??
            (productData.options.length === 0 && productData.variants[0]
              ? productData.variants[0].stock
              : 0)
          }
          disabled={
            !isActuallyAvailable ||
            (productData.options.length > 0 && !currentVariant)
          }
        />
        <FrontendButton
          as="button"
          $variant="primary"
          $size="large"
          onClick={onAddToCart}
          disabled={
            !isActuallyAvailable ||
            isAddingToCart ||
            (productData.options.length > 0 && !currentVariant)
          }
          style={{ flexGrow: 1.5 }}
          title={
            !isActuallyAvailable
              ? statusText
              : isAddingToCart
              ? "Processing..."
              : "Add to Cart"
          }
        >
          <FaShoppingCart /> {addToCartButtonText}
        </FrontendButton>
      </ActionsRow>

      {onAddToWishlist && (
        <WishlistButtonWrapper>
          <FrontendButton
            $variant="secondary"
            $size="medium"
            $fullWidth
            onClick={onAddToWishlist}
          >
            {isInWishlist ? (
              <FaHeart style={{ color: theme.colors.accent1 }} />
            ) : (
              <FaRegHeart />
            )}
            {isInWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
          </FrontendButton>
        </WishlistButtonWrapper>
      )}

      {/* --- NEW SPECIFICATIONS DISPLAY --- */}
      {(displayedDimensions ||
        displayedWeight ||
        productData.material ||
        productData.origin) && (
        <ProductSpecifications>
          <span className="spec-title">Key Specifications</span>{" "}
          {/* Changed from h4 to span with class for styling */}
          <ul>
            {displayedDimensions && (
              <li>
                <span className="spec-label">
                  <FaRulerCombined style={{ marginRight: theme.spacing(1) }} />{" "}
                  Dimensions:
                </span>
                <span className="spec-value">{displayedDimensions}</span>
              </li>
            )}
            {displayedWeight && (
              <li>
                <span className="spec-label">
                  <FaWeightHanging style={{ marginRight: theme.spacing(1) }} />{" "}
                  Weight:
                </span>
                <span className="spec-value">{displayedWeight}</span>
              </li>
            )}
            {productData.material && (
              <li>
                <span className="spec-label">
                  <FaInfoCircle style={{ marginRight: theme.spacing(1) }} />{" "}
                  Material:
                </span>
                <span className="spec-value">{productData.material}</span>
              </li>
            )}
            {productData.origin && (
              <li>
                <span className="spec-label">
                  <FaInfoCircle style={{ marginRight: theme.spacing(1) }} />{" "}
                  Origin:
                </span>
                <span className="spec-value">{productData.origin}</span>
              </li>
            )}
            {productData.isShippingRequired !== undefined && (
              <li>
                <span className="spec-label">
                  <FaTruck style={{ marginRight: theme.spacing(1) }} />{" "}
                  Shipping:
                </span>
                <span className="spec-value">
                  {productData.isShippingRequired
                    ? "Standard Shipping Applies"
                    : "Digital/No Shipping"}
                </span>
              </li>
            )}
          </ul>
          <a
            href="#product-details-tabs-specifications"
            className="view-all-specs-link"
            onClick={(e) => {
              e.preventDefault();
              const tabsComponent = document.getElementById(
                "product-details-tabs"
              );
              const specTabTrigger = tabsComponent?.querySelector(
                '[data-tab-target="specifications"]'
              );
              (specTabTrigger as HTMLElement)?.click();
              tabsComponent?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            View All Details & Specifications
          </a>
        </ProductSpecifications>
      )}

      <OtherInfo>
        {(currentVariant?.sku ||
          (productData.options.length === 0 && productData.sku)) && (
          <p>
            <FaTags /> SKU: {currentVariant?.sku || productData.sku}
          </p>
        )}
        {productData.tags && productData.tags.length > 0 && (
          <p className="tags-container">
            <FaTags /> Tags:
            {productData.tags.map((tag, index) => (
              <span key={tag} className="tag-item">
                {tag}
                {index < productData.tags!.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        )}
        {/* Removed productData.shippingTeaser as it's less common to show here now with dedicated spec section */}
      </OtherInfo>
    </ProductInfoWrapper>
  );
};

export default ProductInfo;

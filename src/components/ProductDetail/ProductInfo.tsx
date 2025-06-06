// src/components/ProductPage/ProductInfo/ProductInfo.tsx
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaHeart,
  FaRegHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
  FaTags,
  FaInfoCircle,
} from "react-icons/fa";

// Import all necessary styled components
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
} from "./ProductInfo.styles";

import { FrontendButton } from "./Button.styles";
import { lighten } from "polished";
import QuantityInput from "./QuantityInput";
import ColorSwatch from "./ColorSwatch";
import SizeButton from "./SizeButton";
// --- Type Definitions (Keep consistent with your project's types) ---
export interface ProductVariantOptionValue {
  id: string;
  value: string;
  name?: string;
  swatch?: string;
  isAvailable?: boolean;
}
export interface ProductVariantOption {
  id: string;
  name: string;
  displayType: "swatch" | "button" | "dropdown";
  values: ProductVariantOptionValue[];
}
export interface ProductVariant {
  id: string;
  price: number;
  originalPrice?: number;
  stock: number;
  imageIds?: string[];
  options: { [optionId: string]: string };
  sku?: string;
}
export interface ProductReviewSummary {
  averageRating: number;
  reviewCount: number;
}
export interface ProductInfoData {
  id: string;
  name: string;
  brand?: { name: string; link?: string };
  category?: { name: string; link?: string };
  shortDescription: string;
  price: number;
  originalPrice?: number;
  sku?: string;
  stockStatus?: "in_stock" | "low_stock" | "out_of_stock" | "pre_order";
  options?: ProductVariantOption[];
  variants?: ProductVariant[];
  reviewSummary?: ProductReviewSummary;
  shippingTeaser?: string;
  tags?: string[];
}
// --- End Type Definitions ---

// --- MOCK PRODUCT DATA (Ensure this reflects the types above perfectly) ---
const mockProductForInfo: ProductInfoData = {
  /* ... Your detailed mockProductForInfo ... */ id: "prod_elan_001",
  name: "Élan Artisanal Linen Throw",
  category: {
    name: "Living Room Textiles",
    link: "/collections/living-room-textiles",
  },
  brand: { name: "Élan Signature", link: "/brands/elan-signature" },
  shortDescription:
    "Indulge in the anmutig comfort of our 100% organic linen throw, meticulously handcrafted for a touch of understated elegance. Perfect for cozy evenings or as a sophisticated accent piece.",
  price: 129.99,
  originalPrice: 160.0,
  reviewSummary: { averageRating: 4.7, reviewCount: 73 },
  options: [
    {
      id: "color",
      name: "Available Color",
      displayType: "swatch",
      values: [
        {
          id: "cl_natural",
          value: "Natural Beige",
          swatch: "#EAE0D5",
          isAvailable: true,
        },
        {
          id: "cl_sage",
          value: "Sage Green",
          swatch: "#B2C8A8",
          isAvailable: true,
        },
        {
          id: "cl_terracotta",
          value: "Muted Terracotta",
          swatch: "#C38A70",
          isAvailable: false,
        },
        {
          id: "cl_charcoal",
          value: "Deep Charcoal",
          swatch: "#595959",
          isAvailable: true,
        },
      ],
    },
    {
      id: "size",
      name: "Available Size",
      displayType: "button",
      values: [
        { id: "sz_std", value: "Standard (130x170cm)", isAvailable: true },
        { id: "sz_lge", value: "Large (150x200cm)", isAvailable: true },
        { id: "sz_xl", value: "Extra Large (170x220cm)", isAvailable: false },
      ],
    },
  ],
  variants: [
    {
      id: "variant_001",
      price: 129.99,
      originalPrice: 160.0,
      stock: 15,
      options: { color: "cl_natural", size: "sz_std" },
      imageIds: ["img_natural_1"],
    },
    {
      id: "variant_002",
      price: 129.99,
      originalPrice: 160.0,
      stock: 10,
      options: { color: "cl_sage", size: "sz_std" },
      imageIds: ["img_sage_1"],
    },
    {
      id: "variant_003",
      price: 149.99,
      originalPrice: 180.0,
      stock: 5,
      options: { color: "cl_natural", size: "sz_lge" },
      imageIds: ["img_natural_2"],
    },
    {
      id: "variant_004",
      price: 0,
      stock: 0,
      options: { color: "cl_terracotta", size: "sz_std" },
      imageIds: ["img_terracotta_1"],
    },
  ],
  sku: "ELN-LT-001",
  stockStatus: "in_stock",
  shippingTeaser: "Complimentary shipping on orders over $150.",
  tags: ["Handcrafted", "Organic Linen", "Luxury Throw"],
};
// --- End Mock Product Data ---

// Props ProductInfo will receive from ProductDetailPage
interface ProductInfoProps {
  productData: ProductInfoData; // Non-optional now, parent must provide
  // Callbacks provided by parent (ProductDetailPage)
  onVariantChange: (
    selectedVariant: ProductVariant | null,
    allSelectedOptions: Record<string, string | null>
  ) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: (details: {
    productId: string;
    variantId?: string;
    quantity: number;
  }) => void;
  onAddToWishlist: (productId: string, variantId?: string) => void;
  // State potentially managed by parent and passed down
  initialSelectedOptions?: Record<string, string | null>;
  initialQuantity?: number;
  initialIsInWishlist?: boolean;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  productData,
  onVariantChange,
  onQuantityChange,
  onAddToCart,
  onAddToWishlist,
  initialSelectedOptions,
  initialQuantity = 1,
  initialIsInWishlist = false,
}) => {
  const theme = useTheme() as DefaultTheme;
  const navigate = useNavigate();

  // --- State for Selections ---
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | null>
  >(() => {
    if (initialSelectedOptions) return initialSelectedOptions;
    const defaultSelections: Record<string, string | null> = {};
    productData.options?.forEach((opt) => {
      const firstAvailable = opt.values.find((v) => v.isAvailable !== false);
      defaultSelections[opt.id] = firstAvailable
        ? firstAvailable.id
        : opt.values[0]?.id || null;
    });
    return defaultSelections;
  });

  const [quantity, setQuantity] = useState(initialQuantity);
  const [currentVariant, setCurrentVariant] = useState<
    ProductVariant | null | undefined
  >(null);
  const [isInWishlist, setIsInWishlist] = useState(initialIsInWishlist);

  // --- Effects ---
  // Recalculate currentVariant when selectedOptions or productData.variants change
  useEffect(() => {
    let matched: ProductVariant | undefined = undefined;
    if (
      productData.variants &&
      productData.options &&
      Object.keys(selectedOptions).length > 0
    ) {
      // Check if all defined options have a selection by the user
      const allOptionsSelected = productData.options.every(
        (opt) => !!selectedOptions[opt.id]
      );

      if (allOptionsSelected) {
        matched = productData.variants.find((variant) =>
          productData.options!.every(
            (opt) => variant.options[opt.id] === selectedOptions[opt.id]
          )
        );
      }
    }
    setCurrentVariant(matched || null); // Set to null if no match or not all options selected
    if (onVariantChange) {
      onVariantChange(matched || null, selectedOptions);
    }
  }, [
    selectedOptions,
    productData.variants,
    productData.options,
    onVariantChange,
  ]);

  // Sync with parent-controlled initial states
  useEffect(() => {
    if (initialSelectedOptions) setSelectedOptions(initialSelectedOptions);
  }, [initialSelectedOptions]);
  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);
  useEffect(() => {
    setIsInWishlist(initialIsInWishlist);
  }, [initialIsInWishlist]);

  // --- Derived values based on current state ---
  const displayPrice = currentVariant?.price ?? productData.price;
  const displayOriginalPrice =
    currentVariant?.originalPrice ?? productData.originalPrice;

  const getStockInfo = useMemo(() => {
    if (
      productData.options &&
      productData.options.length > 0 &&
      !currentVariant
    ) {
      // If options exist, but no variant is fully selected or matched
      if (productData.options.some((opt) => !selectedOptions[opt.id])) {
        return { status: "select_options", stock: 0 }; // Special status
      }
      return { status: "out_of_stock" as const, stock: 0 }; // Invalid combination
    }
    const stock =
      currentVariant?.stock ?? (productData.variants?.length === 0 ? 10 : 0); // Default if no variants
    let status = productData.stockStatus || "out_of_stock";
    if (currentVariant) {
      status =
        currentVariant.stock > 5
          ? "in_stock"
          : currentVariant.stock > 0
            ? "low_stock"
            : "out_of_stock";
    } else if (productData.variants?.length === 0) {
      // Product has no variants
      status =
        stock > 5 ? "in_stock" : stock > 0 ? "low_stock" : "out_of_stock";
    }
    return { status: status as ProductInfoData["stockStatus"], stock };
  }, [currentVariant, productData, selectedOptions]);

  const { status: effectiveStockStatus, stock: currentStock } = getStockInfo;
  const isOutOfStock = effectiveStockStatus === "out_of_stock";
  const mustSelectOptions = effectiveStockStatus === "select_options";

  // --- Event Handlers ---
  const handleOptionSelect = useCallback(
    (optionId: string, valueId: string) => {
      setSelectedOptions((prev) => {
        const newSelections = { ...prev, [optionId]: valueId };
        // Optional: Logic to reset dependent options if a primary option changes (e.g., size resets if color changes availability)
        return newSelections;
      });
      setQuantity(1); // Reset quantity when any variant option changes
      onQuantityChange(1); // Notify parent
    },
    [onQuantityChange]
  );

  const handleLocalQuantityChange = useCallback(
    (newQuantity: number) => {
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    },
    [onQuantityChange]
  );

  const handleAddToCartClick = useCallback(() => {
    if (isOutOfStock) {
      alert("This item/combination is currently out of stock.");
      return;
    }
    if (mustSelectOptions) {
      alert("Please select all product options to continue.");
      return;
    }
    onAddToCart({
      productId: productData.id,
      variantId: currentVariant?.id,
      quantity,
    });
  }, [
    productData.id,
    currentVariant,
    quantity,
    isOutOfStock,
    mustSelectOptions,
    onAddToCart,
  ]);

  const handleToggleWishlistClick = useCallback(() => {
    const newWishlistStatus = !isInWishlist;
    setIsInWishlist(newWishlistStatus); // Optimistic UI update
    onAddToWishlist(productData.id, currentVariant?.id); // Parent handles actual API call & global state
    // In a real app, onAddToWishlist might return a promise to confirm and roll back if needed
  }, [productData.id, currentVariant, isInWishlist, onAddToWishlist]);

  // --- Render Helpers ---
  const renderStars = (rating: number = 0) => {
    /* ... same as before ... */
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));
    const stars = [];
    for (let i = 0; i < fullStars; i++)
      stars.push(<FaStar key={`full-${i}-${Math.random()}`} />);
    if (halfStar) stars.push(<FaStarHalfAlt key={`half-${Math.random()}`} />);
    for (let i = 0; i < emptyStars; i++)
      stars.push(<FaRegStar key={`empty-${i}-${Math.random()}`} />);
    return stars;
  };

  const getSelectedOptionValueDisplay = (optionId: string): string => {
    const selectedValueId = selectedOptions[optionId];
    if (!selectedValueId) return "Select"; // Prompt to select
    const option = productData.options?.find((opt) => opt.id === optionId);
    const valueObj = option?.values.find((val) => val.id === selectedValueId);
    return valueObj?.value || "Selected"; // Display the 'value' field (e.g., "Natural Beige")
  };

  if (!productData) return null; // Should be handled by parent, but good check

  let addToCartText = "Add to Cart";
  if (isOutOfStock) addToCartText = "Out of Stock";
  else if (mustSelectOptions) addToCartText = "Select Options";

  return (
    <ProductInfoWrapper theme={theme}>
      {(productData.category || productData.brand) && (
        <ProductCategoryLink
          theme={theme}
          onClick={() =>
            productData.category?.link && navigate(productData.category.link)
          }
          title={`View all ${productData.category?.name}`}
        >
          {productData.category?.name}
          {productData.brand?.name && productData.category?.name && " / "}
          {productData.brand?.name && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                productData.brand?.link && navigate(productData.brand.link);
              }}
              style={{
                fontWeight: theme.typography.body.weights.regular,
                cursor: productData.brand?.link ? "pointer" : "default",
              }}
              title={`Explore brand ${productData.brand.name}`}
            >
              {productData.brand.name}
            </span>
          )}
        </ProductCategoryLink>
      )}

      <ProductName theme={theme}>{productData.name}</ProductName>

      <PriceContainer theme={theme}>
        <CurrentPrice
          theme={theme}
          $onSale={
            !!displayOriginalPrice && displayOriginalPrice > displayPrice
          }
        >
          ${displayPrice.toFixed(2)}
        </CurrentPrice>
        {displayOriginalPrice && displayOriginalPrice > displayPrice && (
          <>
            <OriginalPrice theme={theme}>
              ${displayOriginalPrice.toFixed(2)}
            </OriginalPrice>
            <SaleBadge theme={theme}>
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

      {productData.reviewSummary &&
        productData.reviewSummary.reviewCount > 0 && (
          <ReviewsSummary theme={theme}>
            <span className="star-rating">
              {renderStars(productData.reviewSummary.averageRating)}
            </span>
            <a
              href={`#product-reviews-${productData.id}`}
              onClick={(e) => {
                e.preventDefault(); /* TODO: Implement scroll to reviews section */
              }}
            >
              ({productData.reviewSummary.reviewCount} Customer Reviews)
            </a>
          </ReviewsSummary>
        )}

      <ShortDescription theme={theme}>
        {productData.shortDescription}
      </ShortDescription>

      {productData.options && productData.options.length > 0 && (
        <VariantSection theme={theme}>
          {productData.options.map((option) => (
            <VariantGroup theme={theme} key={option.id}>
              <VariantLabel theme={theme}>
                {option.name}:{" "}
                <span className="selected-value">
                  {getSelectedOptionValueDisplay(option.id)}
                </span>
              </VariantLabel>
              <VariantOptions theme={theme}>
                {option.values.map((val) => {
                  const isSelected = selectedOptions[option.id] === val.id;
                  // Determine true availability of this specific option value considering current selections
                  // This is a complex part if variants depend on each other.
                  // For simplicity, using val.isAvailable directly for now.
                  const isActuallyAvailable = val.isAvailable !== false;

                  if (option.displayType === "swatch") {
                    return (
                      <ColorSwatch
                        key={val.id}
                        color={val.swatch || "#ccc"}
                        label={val.value}
                        isSelected={isSelected}
                        isAvailable={isActuallyAvailable}
                        onClick={() =>
                          isActuallyAvailable &&
                          handleOptionSelect(option.id, val.id)
                        }
                      />
                    );
                  }
                  if (option.displayType === "button") {
                    return (
                      <SizeButton
                        key={val.id}
                        label={val.value}
                        isSelected={isSelected}
                        isAvailable={isActuallyAvailable}
                        onClick={() =>
                          isActuallyAvailable &&
                          handleOptionSelect(option.id, val.id)
                        }
                      />
                    );
                  }
                  return null;
                })}
              </VariantOptions>
            </VariantGroup>
          ))}
        </VariantSection>
      )}

      <ActionsRow theme={theme}>
        <QuantityInput
          currentQuantity={quantity}
          onQuantityChange={handleLocalQuantityChange}
          maxQuantity={currentStock}
          disabled={isOutOfStock || mustSelectOptions}
          ariaLabel={`Quantity for ${productData.name}`}
        />
        <FrontendButton
          theme={theme}
          $variant="primary"
          $size="large"
          onClick={handleAddToCartClick}
          disabled={isOutOfStock || mustSelectOptions}
          style={{ flexGrow: 1.5 }}
          title={
            isOutOfStock
              ? "This item is unavailable"
              : mustSelectOptions
                ? "Please select all options"
                : "Add to your shopping cart"
          }
        >
          <FaShoppingCart /> {addToCartText}
        </FrontendButton>
      </ActionsRow>

      <WishlistButtonWrapper theme={theme}>
        <FrontendButton
          theme={theme}
          $variant="secondary" // Changed to secondary for a distinct outline look
          $size="medium"
          $fullWidth
          onClick={handleToggleWishlistClick}
        >
          {isInWishlist ? (
            <FaHeart style={{ color: theme.colors.accent1 }} />
          ) : (
            <FaRegHeart />
          )}
          {isInWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
        </FrontendButton>
      </WishlistButtonWrapper>

      <OtherInfo theme={theme}>
        {currentVariant?.sku ? (
          <p>
            <FaTags /> SKU: {currentVariant.sku}
          </p>
        ) : productData.sku ? (
          <p>
            <FaTags /> SKU: {productData.sku}
          </p>
        ) : null}

        {effectiveStockStatus && (
          <p className={`stock-${effectiveStockStatus.replace("_", "-")}`}>
            {effectiveStockStatus === "in_stock" && (
              <>
                <FaCheckCircle /> In Stock & Ready to Ship
              </>
            )}
            {effectiveStockStatus === "low_stock" && (
              <>
                <FaInfoCircle /> Low Stock – Only {currentStock} left!
              </>
            )}
            {effectiveStockStatus === "out_of_stock" && (
              <>
                <FaTimesCircle /> Currently Unavailable
              </>
            )}
            {effectiveStockStatus === "pre_order" && (
              <>
                <FaCalendarAlt /> Available for Pre-Order
              </>
            )}
            {effectiveStockStatus === "select_options" && (
              <>
                <FaQuestionCircle /> Please select options to check availability
              </>
            )}
          </p>
        )}
        {productData.shippingTeaser && (
          <p>
            <FaTruck /> {productData.shippingTeaser}
          </p>
        )}
        {productData.tags && productData.tags.length > 0 && (
          <p
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: theme.spacing(1.5),
              alignItems: "center",
            }}
          >
            <FaTags
              style={{
                color: theme.colors.darkGray,
                marginRight: theme.spacing(0.5),
              }}
            />
            {productData.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  /* ... tag styling ... */
                  backgroundColor: lighten(0.07, theme.colors.primaryNeutral),
                  padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
                  borderRadius: theme.borderRadius.small,
                  fontSize: theme.typography.body.sizes.xsmall,
                  color: theme.colors.darkGray,
                }}
              >
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

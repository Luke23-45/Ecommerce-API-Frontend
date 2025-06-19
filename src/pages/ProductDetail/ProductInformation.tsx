// src/pages/ProductDetailPage/ProductDetailPage.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Removed useLocation as keying by productId is sufficient
import { useTheme, type DefaultTheme } from "styled-components";
import { FaRegSadCry, FaSpinner, FaArrowLeft } from "react-icons/fa";

// --- Page Layout Styles ---
import {
  ProductDetailPageWrapper,
  ProductDetailContainer,
  BreadcrumbsArea,
  TopSectionGrid,
  GalleryColumn,
  InfoColumn,
  BottomSection,
} from "./ProductDetailPage.styles";

// --- Child Components (Ensure paths are correct for your project) ---
import Breadcrumbs, {
  type BreadcrumbLink,
} from "@/components/ProductDetail/Breadcrumbs";
import ProductGallery, {
  type ProductImage,
} from "@/components/ProductDetail/ProductGallery";
import ProductInfo, {
  type ProductInfoData, // This type definition in ProductInfo.tsx MUST be updated
  type ProductVariant, // This type definition in ProductInfo.tsx MUST be updated
  type ProductDisplayOption,
} from "@/components/ProductDetail/ProductInfo"; // Assuming this is the target ProductInfo.tsx

import ProductDetailsTabs from "@/components/ProductDetail/ProductDetailsTabs/ProductDetailsTabs";
import RelatedProducts from "@/components/ProductDetail/RelatedProducts/RelatedProducts";
import { FrontendButton } from "@/components/ProductDetail/Button.styles";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { ErrorMessage } from "@/components/auth/AuthForms";

// --- Hooks, Types, and Utils ---
import { useGetProductById } from "@/hooks/admin/product/product/useProduct";
import { useAddItemToCart, useGetCart } from "@/hooks/cart/useCart";
import {
  type IProductDocument,
  type IProductVariation,
  type IProductAttributeOption,
  type IDimensions, // Make sure this is exported from your backend types
} from "@/types/product";
import { useNotification } from "@/contexts/NotificationContext";
import { setCartCount } from "@/store/slices/cartSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/store/types";
import { useSelector } from "react-redux";

// Frontend type for dimensions and weight to be passed to ProductInfo
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

// --- Data Transformation Function (UPDATED with dimensions/weight) ---
const transformApiProductToPageData = (
  product: IProductDocument
): {
  productInfoForChild: ProductInfoData; // ProductInfoData type definition MUST be updated
  allGalleryImagesForChild: ProductImage[];
  breadcrumbItemsForChild: BreadcrumbLink[];
} => {
  const variants: ProductVariant[] = product.variations.map(
    (v: IProductVariation) => ({
      id: v._id!.toString(),
      sku: v.sku,
      price: v.salePrice ?? v.price,
      originalPrice: v.salePrice && v.salePrice < v.price ? v.price : undefined,
      stock: v.inventory,
      isAvailable:
        ["in_stock", "pre_order", "backorder"].includes(v.stockStatus) &&
        v.inventory > 0,
      imageUrls: v.imageUrls || [],
      options: (v.attributeOptions || []).reduce(
        (acc, attrOpt: IProductAttributeOption) => {
          acc[attrOpt.attributeName] = attrOpt.optionId.toString();
          return acc;
        },
        {} as Record<string, string>
      ),
      weight: v.weight,
      weightUnit: v.weightUnit,
      dimensions: v.dimensions
        ? {
            length: v.dimensions.length,
            width: v.dimensions.width,
            height: v.dimensions.height,
            unit: v.dimensions.unit,
          }
        : undefined,
    })
  );

  const displayOptionsMap = new Map<
    string,
    {
      id: string;
      name: string;
      displayType: "swatch" | "button" | "dropdown";
      valuesMap: Map<string, { id: string; value: string; swatch?: string }>;
    }
  >();
  product.variations.forEach((variant) => {
    (variant.attributeOptions || []).forEach(
      (attrOpt: IProductAttributeOption) => {
        if (!displayOptionsMap.has(attrOpt.attributeName)) {
          let determinedDisplayType: "swatch" | "button" | "dropdown" =
            "button";
          if (
            product.variations.some((v_inner) =>
              v_inner.attributeOptions.some(
                (ao_inner) =>
                  ao_inner.attributeName === attrOpt.attributeName &&
                  !!ao_inner.optionSwatchValue
              )
            )
          ) {
            determinedDisplayType = "swatch";
          }
          displayOptionsMap.set(attrOpt.attributeName, {
            id: attrOpt.attributeName,
            name: attrOpt.attributeName,
            displayType: determinedDisplayType,
            valuesMap: new Map(),
          });
        }
        const optionGroup = displayOptionsMap.get(attrOpt.attributeName)!;
        if (!optionGroup.valuesMap.has(attrOpt.optionId.toString())) {
          optionGroup.valuesMap.set(attrOpt.optionId.toString(), {
            id: attrOpt.optionId.toString(),
            value: attrOpt.optionValue,
            swatch: attrOpt.optionSwatchValue,
          });
        }
      }
    );
  });
  const displayOptions: ProductDisplayOption[] = Array.from(
    displayOptionsMap.values()
  ).map((opt) => ({
    ...opt,
    values: Array.from(opt.valuesMap.values()),
  }));

  // Ensure the ProductInfoData type definition (likely in ProductInfo.tsx or a shared types file)
  // includes all these new fields.
  const productInfoForChild: ProductInfoData = {
    id: product._id.toString(),
    name: product.name,
    shortDescription: product.shortDescription || "No description available.",
    category: product.categoryId
      ? {
          name: (product.categoryId as any)?.name || "Category",
          link: `/category/${
            (product.categoryId as any)?.slug || product.categoryId
          }`,
        }
      : undefined,
    brand: product.brandId
      ? {
          name: (product.brandId as any)?.name || "Brand",
          link: `/brand/${(product.brandId as any)?.slug || product.brandId}`,
        }
      : undefined,
    reviewSummary: {
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
    },
    options: displayOptions,
    variants: variants, // This now includes weight/dimensions per variant
    price: product.basePrice,
    originalPrice:
      product.baseSalePrice && product.baseSalePrice < product.basePrice
        ? product.basePrice
        : undefined,
    sku: product.sku,
    stockStatus: product.stockStatus,
    tags: product.tags,
    // New default/base product specifications
    defaultWeight: product.defaultWeight,
    defaultWeightUnit: product.defaultWeightUnit,
    defaultDimensions: product.defaultDimensions
      ? {
          length: product.defaultDimensions.length,
          width: product.defaultDimensions.width,
          height: product.defaultDimensions.height,
          unit: product.defaultDimensions.unit,
        }
      : undefined,
    isShippingRequired: product.isShippingRequired,
    // Example additional fields from IProductDocument:
    material: (product as any).material, // Cast to any if not directly on IProductDocument type
    origin: (product as any).origin,
  };

  const uniqueImageUrls = new Set<string>();
  (product.imageUrls || []).forEach((url) => uniqueImageUrls.add(url));
  product.variations.forEach((v) =>
    (v.imageUrls || []).forEach((url) => uniqueImageUrls.add(url))
  );
  const allGalleryImagesForChild: ProductImage[] = Array.from(
    uniqueImageUrls
  ).map((url, index) => ({
    id: `${product._id.toString()}-gallery-${index}`,
    src: url,
    alt: `${product.name} - image ${index + 1}`,
    thumbnailSrc: url,
  }));

  const breadcrumbItemsForChild: BreadcrumbLink[] = [
    { label: "Home", link: "/" },
    {
      label: productInfoForChild.category?.name || "Products",
      link: productInfoForChild.category?.link || "/products",
    },
    { label: product.name },
  ];

  return {
    productInfoForChild,
    allGalleryImagesForChild,
    breadcrumbItemsForChild,
  };
};

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const theme = useTheme() as DefaultTheme;
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const dispatch = useDispatch<AppDispatch>();

  const {
    data: apiProductData,
    isLoading,
    isError,
    error: fetchError,
  } = useGetProductById(productId);

  const {
    productInfoForChild,
    allGalleryImagesForChild,
    breadcrumbItemsForChild,
  } = useMemo(() => {
    if (!apiProductData)
      return {
        productInfoForChild: null,
        allGalleryImagesForChild: [],
        breadcrumbItemsForChild: [],
      };
    return transformApiProductToPageData(apiProductData);
  }, [apiProductData]);
  const cartItemCount = useSelector((state: RootState) => state.cart.count);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | null>
  >({});
  const [sliceCart, setSliceCart] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const { data: cartData, isLoading: isCartLoading, refetch } = useGetCart();
  useEffect(() => {
    if (productInfoForChild && productInfoForChild.options.length > 0) {
      const initialSelections: Record<string, string | null> = {};
      const firstAvailableAndFullyOptionedVariant =
        productInfoForChild.variants.find(
          (v) =>
            v.isAvailable &&
            productInfoForChild.options.every(
              (opt) => v.options[opt.id] !== undefined
            )
        ) ||
        productInfoForChild.variants.find((v) => v.isAvailable) ||
        productInfoForChild.variants[0];

      if (firstAvailableAndFullyOptionedVariant) {
        productInfoForChild.options.forEach((opt) => {
          initialSelections[opt.id] =
            firstAvailableAndFullyOptionedVariant.options[opt.id] ||
            opt.values[0]?.id ||
            null;
        });
      } else {
        productInfoForChild.options.forEach((opt) => {
          initialSelections[opt.id] = opt.values[0]?.id || null;
        });
      }
      setSelectedOptions(initialSelections);
    } else if (
      productInfoForChild &&
      productInfoForChild.options.length === 0
    ) {
      setSelectedOptions({});
    }
    setCurrentQuantity(1);
  }, [productInfoForChild]);

  const currentVariant = useMemo((): ProductVariant | null => {
    if (!productInfoForChild || !productInfoForChild.variants) return null;
    if (productInfoForChild.options.length === 0)
      return productInfoForChild.variants[0] || null;

    const allRequiredOptionsAreSelected = productInfoForChild.options.every(
      (opt) =>
        selectedOptions[opt.id] !== null &&
        selectedOptions[opt.id] !== undefined
    );
    if (!allRequiredOptionsAreSelected) return null;

    return (
      productInfoForChild.variants.find((variant) =>
        productInfoForChild.options.every(
          (displayOption) =>
            variant.options[displayOption.id] ===
            selectedOptions[displayOption.id]
        )
      ) || null
    );
  }, [selectedOptions, productInfoForChild]);

  const handleOptionSelect = useCallback(
    (optionName: string, optionValueId: string) => {
      setSelectedOptions((prev) => ({ ...prev, [optionName]: optionValueId }));
      setCurrentQuantity(1);
    },
    []
  );

  const handleQuantityChange = useCallback((newQuantity: number) => {
    setCurrentQuantity(newQuantity);
  }, []);

  const { mutate: addItemToCartMutation, isPending: isAddingToCart } =
    useAddItemToCart();
  function getTotalQuantity(cart) {
    if (!cart?.items || !Array.isArray(cart.items)) {
      return 0;
    }

    return cart.items.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  const handleAddToCart = useCallback(() => {
    if (!productInfoForChild) {
      showNotification({ message: "Product data not loaded.", type: "error" });
      return;
    }
    let targetVariantId: string | undefined;
    let variantIsAvailable = false;
    let variantStock = 0;

    if (productInfoForChild.options.length > 0) {
      if (!currentVariant) {
        showNotification({
          message: "Please select all product options.",
          type: "warning",
        });
        return;
      }
      targetVariantId = currentVariant.id;
      variantIsAvailable = currentVariant.isAvailable;
      variantStock = currentVariant.stock;
    } else if (productInfoForChild.variants.length > 0) {
      targetVariantId = productInfoForChild.variants[0].id;
      variantIsAvailable = productInfoForChild.variants[0].isAvailable;
      variantStock = productInfoForChild.variants[0].stock;
    } else {
      showNotification({
        message: "Product configuration error.",
        type: "error",
      });
      return;
    }

    if (!variantIsAvailable) {
      showNotification({
        message: "This item is currently out of stock.",
        type: "error",
      });
      return;
    }
    if (variantStock < currentQuantity) {
      showNotification({
        message: `Only ${variantStock} left in stock. Please reduce quantity.`,
        type: "warning",
      });
      return;
    }

    addItemToCartMutation(
      {
        productId: productInfoForChild.id,
        variationId: targetVariantId!,
        quantity: currentQuantity,
      },
      {
        onSuccess: (data) => {
          const dat1 = parseInt(getTotalQuantity(data));
          if (dat1 > 0 && typeof dat1 === "number") {
            if (dat1 > sliceCart) {
              dispatch(setCartCount(dat1));
            }
          }
        },
      }
    );

    //           const dat1 = getTotalQuantity(data);

    // setSliceCart(false);
  }, [
    productInfoForChild,
    currentVariant,
    currentQuantity,
    addItemToCartMutation,
    showNotification,
  ]);

  const galleryImagesToDisplay = useMemo((): ProductImage[] => {
    const defaultPlaceholder: ProductImage[] = [
      {
        id: "placeholder_gallery",
        src: `https://picsum.photos/seed/${productId || "product"}/800/1000`,
        alt: "Product image placeholder",
        thumbnailSrc: `https://picsum.photos/seed/${
          productId || "product"
        }/150/150`,
      },
    ];

    if (
      !apiProductData ||
      !allGalleryImagesForChild ||
      allGalleryImagesForChild.length === 0
    ) {
      return defaultPlaceholder;
    }

    if (
      currentVariant &&
      currentVariant.imageUrls &&
      currentVariant.imageUrls.length > 0
    ) {
      const variantImages = currentVariant.imageUrls
        .map((url) => allGalleryImagesForChild.find((gi) => gi.src === url))
        .filter((img) => !!img) as ProductImage[];
      if (variantImages.length > 0) return variantImages;
    }
    if (apiProductData.imageUrls && apiProductData.imageUrls.length > 0) {
      const baseImages = apiProductData.imageUrls
        .map((url) => allGalleryImagesForChild.find((gi) => gi.src === url))
        .filter((img) => !!img) as ProductImage[];
      if (baseImages.length > 0) return baseImages;
    }

    // If specific variant or base images aren't found, but allGalleryImages has some, use the first from there.
    // This could happen if image URLs in variant/base don't perfectly match those in allGalleryImages for some reason.
    return allGalleryImagesForChild.length > 0
      ? allGalleryImagesForChild
      : defaultPlaceholder;
  }, [currentVariant, allGalleryImagesForChild, apiProductData, productId]);

  if (isLoading) {
    return (
      <ProductDetailPageWrapper>
        <ProductDetailContainer
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 200px)",
          }}
        >
          <LoadingSpinner
            message="Loading Exquisite Details..."
            size="2.5rem"
          />
        </ProductDetailContainer>
      </ProductDetailPageWrapper>
    );
  }
  if (isError || !apiProductData || !productInfoForChild) {
    const errorMessage =
      (fetchError as any)?.response?.data?.message ||
      (fetchError as any)?.message ||
      "We couldn't fetch the product details.";
    return (
      <ProductDetailPageWrapper>
        <ProductDetailContainer
          style={{ textAlign: "center", paddingTop: theme.spacing(10) }}
        >
          <ErrorMessage>
            <div
              style={{
                fontSize: "3.5rem",
                color: theme.colors.error || "#D32F2F",
                marginBottom: theme.spacing(3),
              }}
            >
              {" "}
              <FaRegSadCry />{" "}
            </div>
            <h2>Oops! Product Not Found</h2>
            <p
              style={{
                maxWidth: "500px",
                margin: `0 auto ${theme.spacing(5)} auto`,
              }}
            >
              {errorMessage}
            </p>
            <FrontendButton
              $variant="secondary"
              $size="medium"
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft /> Go Back
            </FrontendButton>
          </ErrorMessage>
        </ProductDetailContainer>
      </ProductDetailPageWrapper>
    );
  }

  return (
    <ProductDetailPageWrapper key={productId}>
      <ProductDetailContainer>
        <BreadcrumbsArea>
          <Breadcrumbs items={breadcrumbItemsForChild} />
        </BreadcrumbsArea>

        <TopSectionGrid>
          <GalleryColumn>
            <ProductGallery
              images={galleryImagesToDisplay}
              productName={productInfoForChild.name}
            />
          </GalleryColumn>
          <InfoColumn>
            <ProductInfo
              productData={productInfoForChild}
              selectedOptions={selectedOptions}
              currentVariant={currentVariant}
              quantity={currentQuantity}
              onOptionSelect={handleOptionSelect}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
            />
          </InfoColumn>
        </TopSectionGrid>

        <BottomSection>
          <ProductDetailsTabs product={apiProductData} />
          <RelatedProducts
            currentProductId={apiProductData._id.toString()}
            categoryId={apiProductData.categoryId.toString()}
            title="You Might Also Adore"
          />
        </BottomSection>
      </ProductDetailContainer>
    </ProductDetailPageWrapper>
  );
};

export default ProductDetailPage;

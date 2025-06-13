// src/pages/ProductDetailPage/ProductDetailPage.tsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "styled-components";
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

// --- Child Components ---
import Breadcrumbs, {
  type BreadcrumbLink,
} from "@/components/ProductDetail/Breadcrumbs";
import ProductGallery, {
  type ProductImage,
} from "@/components/ProductDetail/ProductGallery";
import ProductInfo, {
  type ProductInfoData,
  type ProductVariant,
} from "@/components/ProductDetail/ProductInfo1";
import ProductDetailsTabs from "@/components/ProductDetail/ProductDetailsTabs/ProductDetailsTabs";
import RelatedProducts from "@/components/ProductDetail/RelatedProducts/RelatedProducts";
import { FrontendButton } from "@/components/ProductDetail/Button.styles";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { ErrorMessage } from "@/components/auth/AuthForms";

// --- Hooks, Types, and Utils ---
import { useGetProductById } from "@/hooks/admin/product/product/useProduct";
import { useAddItemToCart } from "@/hooks/cart/useCart";
import {type IProductDocument } from "@/types/product";
import { useNotification } from "@/contexts/NotificationContext";

// --- Data Transformation Function ---
const transformApiProductToPageData = (
  product: IProductDocument
): {
  allGalleryImages: ProductImage[];
  productInfoData: ProductInfoData;
  breadcrumbItems: BreadcrumbLink[];
} => {
  const productInfoData: ProductInfoData = {
    id: product._id,
    name: product.name,
    shortDescription: product.shortDescription || "",
    reviewSummary: {
      averageRating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
    },
    tags: product.tags || [],
    options: [],
    variants: product.variations.map((v) => ({
      id: v._id!,
      sku: v.sku,
      price: v.salePrice ?? v.price,
      originalPrice: v.salePrice ? v.price : undefined,
      stock: v.inventory,
      isAvailable: ["in_stock", "backorder", "pre_order"].includes(
        v.stockStatus
      ),
      imageUrls: v.imageUrls || [],
      options: v.attributeOptions.reduce((acc, opt) => {
        acc[opt.attributeName] = opt.optionValue;
        return acc;
      }, {} as Record<string, string>),
    })),
    fullDescriptionHTML: product.description,
  };

  const optionsMap = new Map<
    string,
    {
      id: string;
      name: string;
      values: Map<string, { id: string; value: string; swatch?: string }>;
    }
  >();
  product.variations.forEach((variant) => {
    variant.attributeOptions.forEach((attrOpt) => {
      if (!optionsMap.has(attrOpt.attributeName)) {
        optionsMap.set(attrOpt.attributeName, {
          id: attrOpt.attributeName,
          name: attrOpt.attributeName,
          values: new Map(),
        });
      }
      const optionGroup = optionsMap.get(attrOpt.attributeName)!;
      if (!optionGroup.values.has(attrOpt.optionValue)) {
        optionGroup.values.set(attrOpt.optionValue, {
          id: attrOpt.optionValue,
          value: attrOpt.optionValue,
          swatch: attrOpt.optionSwatchValue,
        });
      }
    });
  });
  productInfoData.options = Array.from(optionsMap.values()).map((opt) => ({
    ...opt,
    displayType: opt.values.values().next().value?.swatch ? "swatch" : "button",
    values: Array.from(opt.values.values()),
  }));

  const allImageUrls = new Set<string>();
  product.imageUrls.forEach((url) => allImageUrls.add(url));
  product.variations.forEach((v) => {
    v.imageUrls?.forEach((url) => allImageUrls.add(url));
  });
  const allGalleryImages: ProductImage[] = Array.from(allImageUrls).map(
    (url, index) => ({
      id: `${product._id}-gallery-${index}`,
      src: url,
      alt: `${product.name} - image ${index + 1}`,
      thumbnailSrc: url,
    })
  );

  const breadcrumbItems: BreadcrumbLink[] = [
    { label: "Home", link: "/" },
    { label: "Products", link: "/products" },
    { label: product.name },
  ];

  return { allGalleryImages, productInfoData, breadcrumbItems };
};

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const {
    data: productData,
    isLoading,
    isError,
    error: fetchError,
  } = useGetProductById(productId);
  const { mutate: addItemToCart, isPending: isAddingToCart } =
    useAddItemToCart();

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(
    null
  );
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const { allGalleryImages, productInfoData, breadcrumbItems } = useMemo(() => {
    if (!productData) {
      return {
        allGalleryImages: [],
        productInfoData: null,
        breadcrumbItems: [],
      };
    }
    return transformApiProductToPageData(productData);
  }, [productData]);

  useEffect(() => {
    if (productInfoData && productInfoData.variants.length > 0) {
      setSelectedOptions(productInfoData.variants[0].options);
    }
  }, [productInfoData]);

  useEffect(() => {
    if (productInfoData) {
      const matchedVariant = productInfoData.variants.find((variant) =>
        Object.entries(selectedOptions).every(
          ([optionName, optionValue]) =>
            variant.options[optionName] === optionValue
        )
      );
      setCurrentVariant(matchedVariant || null);
    }
  }, [selectedOptions, productInfoData]);

  const handleVariantChange = useCallback(
    (optionName: string, optionValue: string) => {
      setSelectedOptions((prev) => ({ ...prev, [optionName]: optionValue }));
      setCurrentQuantity(1);
    },
    []
  );

  const handleQuantityChange = useCallback((newQuantity: number) => {
    setCurrentQuantity(newQuantity);
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!productData || !currentVariant) {
      showNotification("Please select a valid product combination.", "warning");
      return;
    }
    if (!currentVariant.isAvailable) {
      showNotification("This item is currently out of stock.", "error");
      return;
    }

    addItemToCart({
      productId: productData._id,
      variationId: currentVariant.id,
      quantity: currentQuantity,
    });
  }, [
    productData,
    currentVariant,
    currentQuantity,
    addItemToCart,
    showNotification,
  ]);

  const galleryImagesToDisplay = useMemo((): ProductImage[] => {
    if (currentVariant?.imageUrls && currentVariant.imageUrls.length > 0) {
      return allGalleryImages.filter((img) =>
        currentVariant.imageUrls!.includes(img.src)
      );
    }
    return allGalleryImages.filter((img) =>
      productData?.imageUrls.includes(img.src)
    );
  }, [currentVariant, allGalleryImages, productData?.imageUrls]);

  if (isLoading) {
    return (
      <ProductDetailPageWrapper>
        <ProductDetailContainer>
          <LoadingSpinner message="Loading Product..." fullscreen />
        </ProductDetailContainer>
      </ProductDetailPageWrapper>
    );
  }

  if (isError || !productData || !productInfoData) {
    return (
      <ProductDetailPageWrapper>
        <ProductDetailContainer>
          <ErrorMessage>
            <FaRegSadCry />
            <h2>Oops! Product Not Found</h2>
            <p>
              {(fetchError as any)?.message ||
                "We couldn't find the product you were looking for."}
            </p>
            <FrontendButton $variant="secondary" onClick={() => navigate(-1)}>
              <FaArrowLeft /> Go Back
            </FrontendButton>
          </ErrorMessage>
        </ProductDetailContainer>
      </ProductDetailPageWrapper>
    );
  }

  return (
    <ProductDetailPageWrapper key={location.key + productId}>
      <ProductDetailContainer>
        <BreadcrumbsArea>
          <Breadcrumbs items={breadcrumbItems} />
        </BreadcrumbsArea>
        <TopSectionGrid>
          <GalleryColumn>
            <ProductGallery
              images={galleryImagesToDisplay}
              productName={productData!.name}
            />
          </GalleryColumn>
          <InfoColumn>
            <ProductInfo
              productData={productInfoData!}
              selectedOptions={selectedOptions}
              currentVariant={currentVariant}
              onVariantChange={handleVariantChange}
              quantity={currentQuantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
            />
          </InfoColumn>
        </TopSectionGrid>
        <BottomSection>
          <ProductDetailsTabs product={productData!} />
          <RelatedProducts title="You Might Also Adore" />
        </BottomSection>
      </ProductDetailContainer>
    </ProductDetailPageWrapper>
  );
};

export default ProductDetailPage;

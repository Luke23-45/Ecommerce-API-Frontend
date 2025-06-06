// src/pages/ProductDetailPage/ProductDetailPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useTheme, type DefaultTheme } from "styled-components";
import { FaRegSadCry, FaSpinner, FaArrowLeft } from "react-icons/fa";

// Import main page layout styles
import {
  ProductDetailPageWrapper,
  ProductDetailContainer,
  BreadcrumbsArea,
  TopSectionGrid,
  GalleryColumn,
  InfoColumn,
  BottomSection,
} from "./ProductDetailPage.styles";

// --- IMPORT ACTUAL CHILD COMPONENTS (Ensure paths are correct) ---

import Breadcrumbs, {
  type BreadcrumbLink,
} from "@/components/ProductDetail/Breadcrumbs";
import ProductGallery, {
  type ProductImage,
} from "@/components/ProductDetail/ProductGallery";

import ProductInfo, {
  type ProductInfoData,
  type ProductVariant,
  type ProductVariantOption, // Make sure all necessary sub-types for ProductInfoData are exported by ProductInfo or a shared types file
} from "@/components/ProductDetail/ProductInfo";

import ProductDetailsTabs from "@/components/ProductDetail/ProductDetailsTabs/ProductDetailsTabs";
import RelatedProducts from "@/components/ProductDetail/RelatedProducts/RelatedProducts";

import { FrontendButton } from "@/components/ProductDetail/Button.styles";

// --- Type Definitions ---
// Ensure ProductInfoData and its constituent types are correctly defined and imported
// by ProductInfo.tsx itself. FullProductData will extend it.
export interface FullProductData extends ProductInfoData {
  _id: string; // Usually matches 'id' but can be MongoDB _id
  // id: string; // Already in ProductInfoData
  // name: string; // Already in ProductInfoData
  category: { name: string; link: string }; // Make 'link' non-optional for breadcrumbs if always needed
  brand?: { name: string; link?: string };
  // shortDescription: string; // Already in ProductInfoData
  fullDescriptionHTML?: string;
  descriptionMarkdown?: string;
  specifications?: { [key: string]: string | string[] | boolean | number };
  images: ProductImage[]; // Gallery requires this
  relatedProductIds?: string[];
  // Additional product-level fields required by child components can be added here
  // e.g., reviews for ReviewsPanel if not fetched by ReviewsPanel itself
  // reviews?: Review[];
}
// --- End Type Definitions ---

// --- Mock Theme (for standalone testing if ThemeProvider isn't wrapping story/test) ---
const mockThemeForDemo: DefaultTheme = {
  colors: {
    primaryNeutral: "#F8F5F2",
    accent1: "#A46E4A",
    accent2: "#8DA382",
    accent1Vibrant: "#C07F56",
    accent2Vibrant: "#B8D69A",
    textDark: "#302D2A",
    textLight: "#FFFFFF",
    lightGray: "#E0E0DB",
    darkGray: "#666666",
    adminSurface: "#FFFFFF",
    adminBorder: "#D1D1D1",
    adminPrimaryBg: "#FCFBF9",
    adminText: "#3F3F3F",
    adminTextSecondary: "#6B6B6B",
    adminStatusSuccess: "#388E3C",
    adminStatusError: "#D32F2F",
    adminStatusWarning: "#FFC107",
    lightBlue: "#E0F2F7",
    calmBlueWave1: "#A0D2DB",
    calmBlueWave2: "#74B9C7",
    gradients: {
      accent1Gradient: `linear-gradient(135deg, #A46E4A 0%, #C07F56 100%)`,
      accent2Gradient: `linear-gradient(135deg, #9EB78A 0%, #B8D69A 100%)`,
    },
  },
  typography: {
    heading: {
      fontFamily: "'Playfair Display', serif",
      h1: {
        fontSize: "clamp(2.75rem, 6vw, 4.25rem)",
        fontWeight: 800,
        lineHeight: 1.15,
        letterSpacing: "-0.025em",
      },
      h2: {
        fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
      },
      h3: {
        fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
        fontWeight: 700,
        lineHeight: 1.25,
        letterSpacing: "-0.015em",
      },
      h4: {
        fontSize: "clamp(1.25rem, 2.8vw, 1.8rem)",
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: "0em",
      },
      h5: {
        fontSize: "clamp(1.1rem, 2.2vw, 1.4rem)",
        fontWeight: 600,
        lineHeight: 1.35,
        letterSpacing: "0.01em",
      },
      h6: {
        fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "0.015em",
      },
      weights: {
        regular: 400,
        medium: 500,
        semiBold: 600,
        bold: 700,
        extraBold: 800,
      },
    },
    body: {
      fontFamily: "'Inter', sans-serif",
      pLarge: {
        fontSize: "1.125rem",
        fontWeight: 400,
        lineHeight: 1.7,
        letterSpacing: "0.005em",
      },
      pMedium: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.65,
        letterSpacing: "0.005em",
      },
      pBase: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.65,
        letterSpacing: "0.005em",
      },
      pSmall: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.6,
        letterSpacing: "0.01em",
      },
      pXSmall: {
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 1.55,
        letterSpacing: "0.015em",
      },
      link: {
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.65,
        letterSpacing: "0.005em",
      },
      button: {
        fontSize: "0.9375rem",
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
      },
      weights: { regular: 400, medium: 500, semiBold: 600, bold: 700 },
    },
    admin: {
      fontFamily: "'Inter', sans-serif",
      moduleTitle: {
        fontSize: "1.6rem",
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
      },
      sectionTitle: {
        fontSize: "1.15rem",
        fontWeight: 600,
        lineHeight: 1.35,
        letterSpacing: "0em",
      },
      bodyBase: {
        fontSize: "0.9rem",
        fontWeight: 400,
        lineHeight: 1.6,
        letterSpacing: "0.005em",
      },
      dataCell: {
        fontSize: "0.85rem",
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: "0.005em",
      },
      label: {
        fontSize: "0.75rem",
        fontWeight: 500,
        lineHeight: 1.4,
        letterSpacing: "0.02em",
        textTransform: "uppercase",
      },
      smallText: {
        fontSize: "0.7rem",
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: "0.01em",
      },
      weights: { regular: 400, medium: 500, semiBold: 600, bold: 700 },
    },
  },
  breakpoints: {
    mobileS: "320px",
    mobileM: "375px",
    mobileL: "425px",
    tablet: "768px",
    laptop: "1024px",
    laptopL: "1440px",
    desktop: "1920px",
    desktopL: "2560px",
  },
  spacing: (value: number) => `${value * 0.25}rem`,
  maxWidth: "1700px",
  containerPadding: "clamp(1.25rem, 5vw, 4rem)",
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    xlarge: "16px",
    pill: "999px",
    circle: "50%",
  },
  shadows: {
    subtle: "0 2px 8px rgba(0,0,0,0.06)",
    medium: "0 5px 15px rgba(0,0,0,0.1)",
    strong: "0 10px 30px rgba(0,0,0,0.12)",
  },
  transitions: {
    fast: "0.15s ease-out",
    base: "0.25s ease-out",
    medium: "0.3s ease-out",
    slow: "0.5s ease-out",
  },
  zIndex: {
    dropdown: 100,
    stickyNav: 990,
    modalOverlay: 1000,
    modalContent: 1010,
    notification: 2000,
  },
};

// --- MOCK API & DATA ---
const allProductsMock: FullProductData[] = [
  /* ... Your full `allProductsMock` array from previous messages ... */
  {
    _id: "prod_elan_001",
    id: "prod_elan_001",
    name: "Élan Signature Linen Throw",
    category: {
      name: "Living Room Textiles",
      link: "/collections/living-room-textiles",
    },
    brand: { name: "Élan Signature", link: "/brands/elan-signature" },
    shortDescription:
      "Indulge in the anmutig comfort of our 100% organic linen throw...",
    fullDescriptionHTML:
      "<p>Crafted from the finest Belgian flax...</p><h3>Key Features:</h3><ul><li>100% Pure Organic...</li></ul>",
    descriptionMarkdown:
      "## Product Story\nCrafted from the finest Belgian flax...",
    price: 129.99,
    originalPrice: 160.0,
    reviewSummary: { averageRating: 4.7, reviewCount: 73 },
    options: [
      {
        id: "color",
        name: "Color",
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
        name: "Size",
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
        sku: "ELN-LT-001-NAT-STD",
        price: 129.99,
        originalPrice: 160.0,
        stock: 15,
        options: { color: "cl_natural", size: "sz_std" },
        imageIds: ["img_main", "img_detail"],
      },
      {
        id: "variant_002",
        sku: "ELN-LT-001-SGE-STD",
        price: 129.99,
        originalPrice: 160.0,
        stock: 10,
        options: { color: "cl_sage", size: "sz_std" },
        imageIds: ["img_color_sage"],
      },
      {
        id: "variant_003",
        sku: "ELN-LT-001-NAT-LGE",
        price: 149.99,
        originalPrice: 180.0,
        stock: 5,
        options: { color: "cl_natural", size: "sz_lge" },
        imageIds: ["img_main", "img_lifestyle"],
      },
      {
        id: "variant_004",
        sku: "ELN-LT-001-TER-STD",
        price: 129.99,
        stock: 0,
        options: { color: "cl_terracotta", size: "sz_std" },
        imageIds: ["img_main"] /* placeholder if no terracotta image */,
      },
    ],
    sku: "ELN-LT-001",
    stockStatus: "in_stock",
    shippingTeaser: "Complimentary carbon-neutral shipping.",
    tags: ["Linen", "Throw", "Organic", "Handcrafted"],
    specifications: {
      Dimensions: "130cm x 170cm (Standard)",
      Material: "100% Organic Belgian Linen",
      Origin: "Woven in Portugal",
      Care: "Machine wash cold, gentle cycle. Tumble dry low or line dry.",
      isEthicallySourced: true,
    },
    images: [
      {
        id: "img_main",
        src: "https://picsum.photos/seed/linenmain/800/1000",
        alt: "Linen throw main",
        thumbnailSrc: "https://picsum.photos/seed/linenmain/150/150",
      },
      {
        id: "img_detail",
        src: "https://picsum.photos/seed/linendetail/800/1000",
        alt: "Linen throw texture detail",
        thumbnailSrc: "https://picsum.photos/seed/linendetail/150/150",
      },
      {
        id: "img_lifestyle",
        src: "https://picsum.photos/seed/lifestyle001/800/1000",
        alt: "Linen throw in room",
        thumbnailSrc: "https://picsum.photos/seed/lifestyle001/150/150",
      },
      {
        id: "img_color_sage",
        src: "https://picsum.photos/seed/linensage/800/1000",
        alt: "Sage green linen throw",
        thumbnailSrc: "https://picsum.photos/seed/linensage/150/150",
      },
    ],
    relatedProductIds: ["prod_elan_002"],
  },
  {
    _id: "prod_elan_002",
    id: "prod_elan_002",
    name: "Artisan Hand-Poured Candle",
    category: { name: "Home Fragrance", link: "/collections/home-fragrance" },
    shortDescription:
      "A beautifully scented candle, crafted to create a serene and inviting ambiance in any space.",
    price: 45.0,
    images: [
      {
        id: "candle_main",
        src: "https://picsum.photos/seed/candle002/800/1000",
        alt: "Artisan Candle",
        thumbnailSrc: "https://picsum.photos/seed/candle002/150/150",
      },
    ],
    specifications: {
      Scent: "Lavender & Cedarwood",
      BurnTime: "Approx. 50 hours",
      WaxType: "100% Soy Wax",
    },
    fullDescriptionHTML:
      "<p>Our artisan candle is hand-poured with all-natural soy wax and infused with a calming blend of pure lavender and cedarwood essential oils. Features a natural cotton wick for a clean, long-lasting burn.</p>",
    stockStatus: "in_stock",
    sku: "ELN-CND-LC-01",
  },
];

// Simulated hook for fetching a single product
const useGetProductById = (
  productId?: string
): {
  data: FullProductData | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
} => {
  const [data, setData] = useState<FullProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log(`useGetProductById: Fetching for productId: ${productId}`);
    setIsLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      const foundProduct = allProductsMock.find((p) => p._id === productId);
      if (foundProduct) {
        setData(foundProduct);
        console.log(`useGetProductById: Found product:`, foundProduct.name);
      } else {
        setError(new Error(`Product with ID "${productId}" not found.`));
        console.error(
          `useGetProductById: Product not found for ID: ${productId}`
        );
      }
      setIsLoading(false);
    }, 600); // Slightly shorter delay for faster testing
    return () => clearTimeout(timer);
  }, [productId]);

  return { data, isLoading, isError: !!error, error };
};
// --- End Mock API & Data ---

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const location = useLocation(); // For key prop on ProductDetailPageWrapper
  const theme = useTheme() || mockThemeForDemo; // Fallback for safety in isolated dev
  const navigate = useNavigate();

  // --- Data Fetching State ---
  const {
    data: productData,
    isLoading,
    isError,
    error: fetchError,
  } = useGetProductById(productId);

  // --- PDP Managed State for Product Interactions ---
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | null>
  >({});
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(
    null
  ); // This stores the *matched* variant object
  const [currentQuantity, setCurrentQuantity] = useState(1);
  // const [isInWishlist, setIsInWishlist] = useState(false); // Example, would sync with API/Context
  const handleVariantChange = useCallback(
    (
      // ProductInfo might determine the fully resolved variant internally based on its state,
      // or it might just pass the raw selected option IDs.
      // Let's assume ProductInfo has logic to find `resolvedVariant` and passes it,
      // along with the `allCurrentlySelectedOptions` from its own state.
      resolvedVariantFromChild: ProductVariant | null,
      allCurrentlySelectedOptions: Record<string, string | null>
    ) => {
      console.log("PDP: handleVariantChange called by ProductInfo.");
      console.log(
        "   -> Resolved Variant from Child:",
        resolvedVariantFromChild
      );
      console.log(
        "   -> All Selected Options from Child:",
        allCurrentlySelectedOptions
      );

      // The primary source of truth for selectedOptions is now what ProductInfo tells us.
      setSelectedOptions(allCurrentlySelectedOptions);

      // The `currentVariant` state in PDP will automatically update due to the `useEffect`
      // that watches `selectedOptions` and `productData`.
      // So, we don't strictly need to `setCurrentVariant(resolvedVariantFromChild)` here
      // if the useEffect is robust, but doing so ensures immediate sync if the child's logic is trusted.
      // However, it's cleaner to let the useEffect handle deriving currentVariant from selectedOptions.
      // For now, we'll just update selectedOptions and let the effect do its work.

      setCurrentQuantity(1); // Always reset quantity to 1 when variant combination changes
    },
    []
  );
  // --- Effect to Initialize/Reset State when productData or productId changes ---
  useEffect(() => {
    if (productData) {
      console.log(
        "PDP: productData loaded, initializing selections for",
        productData.name
      );
      const initialSelections: Record<string, string | null> = {};
      if (productData.options && productData.options.length > 0) {
        productData.options.forEach((opt) => {
          // Default to first available option value, or first option if none explicitly available, or null
          const firstAvailable = opt.values.find(
            (v) => v.isAvailable !== false
          );
          initialSelections[opt.id] = firstAvailable
            ? firstAvailable.id
            : opt.values[0]?.id || null;
        });
      }
      setSelectedOptions(initialSelections);
      setCurrentQuantity(1); // Reset quantity for new product
      // setCurrentVariant will be updated by its own useEffect reacting to selectedOptions change
    } else {
      // Product data is not available (e.g., initial load, or not found)
      setSelectedOptions({});
      setCurrentVariant(null);
      setCurrentQuantity(1);
    }
  }, [productData]); // Only re-run if productData itself changes

  // --- Effect to derive currentVariant when selectedOptions or productData.variants change ---
  useEffect(() => {
    if (
      productData?.variants &&
      productData.options &&
      Object.keys(selectedOptions).length > 0
    ) {
      const allOptionsDefinedInProductAreSelected = productData.options.every(
        (opt) => !!selectedOptions[opt.id]
      );

      let matched: ProductVariant | undefined = undefined;
      if (allOptionsDefinedInProductAreSelected) {
        matched = productData.variants.find((variant) =>
          productData.options!.every(
            (opt) => variant.options[opt.id] === selectedOptions[opt.id]
          )
        );
      }
      setCurrentVariant(matched || null); // Set to null if no match or not all options selected
      // console.log("PDP: Current variant derived:", matched, "Based on selections:", selectedOptions);
    } else if (!productData?.variants || productData?.variants.length === 0) {
      setCurrentVariant(null); // No variants defined for this product
    }
  }, [selectedOptions, productData?.variants, productData?.options]);

  // --- Callbacks passed to ProductInfo ---
  const handleVariantSelectionChange = useCallback(
    (
      newlySelectedOptions: Record<string, string | null>
      // The newlySelectedVariant object itself will be derived by the useEffect above
    ) => {
      console.log(
        "PDP: Variant options selected in ProductInfo:",
        newlySelectedOptions
      );
      setSelectedOptions(newlySelectedOptions); // Update PDP's selectedOptions state
      setCurrentQuantity(1); // Reset quantity when variant options change
    },
    []
  );

  const handleQuantityChange = useCallback((newQuantity: number) => {
    console.log("PDP: Quantity changed to:", newQuantity);
    setCurrentQuantity(newQuantity);
  }, []);

  const handleAddToCart = useCallback(
    (details: { productId: string; variantId?: string; quantity: number }) => {
      console.log("PDP: Add to Cart Clicked by ProductInfo", details);
      // TODO: Implement actual global cart logic (e.g., dispatch to Redux, call context method)
      alert(
        `PDP Confirmed: Added ${details.quantity} x "${productData?.name}" (Variant: ${details.variantId || "Base Product"}) to cart!`
      );
    },
    [productData]
  );

  const handleAddToWishlist = useCallback(
    (productIdParam: string, variantId?: string) => {
      console.log("PDP: Add to Wishlist Clicked by ProductInfo", {
        productId: productIdParam,
        variantId,
      });
      // TODO: Implement global wishlist logic & update isInWishlist state
      alert(
        `"${productData?.name}" (Variant: ${variantId || "Base Product"}) toggled in wishlist!`
      );
    },
    [productData]
  );


  const breadcrumbItems = useMemo((): BreadcrumbLink[] => {
    if (!productData || !productData.category)
      return [{ label: "Home", link: "/" }];
    return [
      { label: "Home", link: "/" },
      {
        label: productData.category.name,
        link:
          productData.category.link ||
          `/collections/${productData.category.name.toLowerCase().replace(/\s+/g, "-")}`,
      },
      { label: productData.name },
    ];
  }, [productData]);

  const galleryImagesToDisplay = useMemo((): ProductImage[] => {
    if (!productData) return [];

    if (
      currentVariant &&
      currentVariant.imageIds &&
      currentVariant.imageIds.length > 0
    ) {
      const variantImages = currentVariant.imageIds
        .map((id) => productData.images.find((img) => img.id === id))
        .filter((img) => img !== undefined) as ProductImage[];
      if (variantImages.length > 0) return variantImages;
    }
    // Fallback to all product images if no specific variant images or no variant matched
    return productData.images || [];
  }, [productData, currentVariant]);

  const relatedProductsData = useMemo(() => {
    if (!productData || !productData.relatedProductIds) return [];
    return allProductsMock.filter(
      (p) =>
        productData.relatedProductIds!.includes(p._id) &&
        p._id !== productData._id
    );
  }, [productData]);

  // --- Render Logic ---
  if (isLoading) {
    return (
      <ProductDetailPageWrapper theme={theme}>
        <ProductDetailContainer
          theme={theme}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 150px)",
            textAlign: "center",
          }}
        >
          <div
            className="fa-spin"
            style={{
              fontSize: "3rem",
              color: theme.colors.accent1,
              marginBottom: theme.spacing(4),
            }}
          >
            {" "}
            <FaSpinner />{" "}
          </div>
          <p
            style={{
              fontFamily: theme.typography.body.fontFamily,
              fontSize: theme.typography.body.sizes.large,
              color: theme.colors.darkGray,
            }}
          >
            {" "}
            Loading Exquisite Details...{" "}
          </p>
        </ProductDetailContainer>
      </ProductDetailPageWrapper>
    );
  }

  if (isError || !productData) {
    return (
      <ProductDetailPageWrapper theme={theme}>
        <ProductDetailContainer
          theme={theme}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 150px)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3.5rem",
              color: theme.colors.adminStatusError,
              marginBottom: theme.spacing(3),
            }}
          >
            {" "}
            <FaRegSadCry />{" "}
          </div>
          <h2
            style={{
              fontFamily: theme.typography.heading.fontFamily,
              fontSize: theme.typography.heading.sizes.h3.fontSize,
              color: theme.colors.textDark,
              marginBottom: theme.spacing(2),
            }}
          >
            {" "}
            Oops! Product Not Found{" "}
          </h2>
          <p
            style={{
              fontFamily: theme.typography.body.fontFamily,
              fontSize: theme.typography.body.sizes.medium,
              color: theme.colors.darkGray,
              maxWidth: "480px",
              lineHeight: 1.65,
              marginBottom: theme.spacing(5),
            }}
          >
            {" "}
            We couldn't find the page you were looking for. It might have been
            moved or doesn't exist.{" "}
            {fetchError && (
              <>
                <br />
                Error: {(fetchError as any).message}
              </>
            )}{" "}
          </p>
          <FrontendButton
            theme={theme}
            $variant="secondary"
            onClick={() => navigate(-1)}
            $size="medium"
          >
            {" "}
            <FaArrowLeft /> Go Back{" "}
          </FrontendButton>
        </ProductDetailContainer>
      </ProductDetailPageWrapper>
    );
  }

  // All data is loaded and available
  return (
    <ProductDetailPageWrapper theme={theme} key={location.key + productId}>
      {" "}

      <ProductDetailContainer theme={theme}>
        <BreadcrumbsArea theme={theme}>
          <Breadcrumbs items={breadcrumbItems} />
        </BreadcrumbsArea>

        <TopSectionGrid theme={theme}>
          <GalleryColumn theme={theme}>
            <ProductGallery
              images={galleryImagesToDisplay}
              productName={productData.name}
            
            />
          </GalleryColumn>
          <InfoColumn theme={theme}>
            <ProductInfo
              productData={productData} // Full product data with all options and variants
              onVariantChange={handleVariantChange} // ProductInfo will call this with all selected option IDs
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              // These props help ProductInfo initialize its internal state if needed,
              // but the source of truth for these interactions remains in ProductDetailPage
              initialSelectedOptions={selectedOptions}
              initialQuantity={currentQuantity}
              // initialIsInWishlist={isInWishlistFromUserData}
            />
          </InfoColumn>
        </TopSectionGrid>

        <BottomSection theme={theme}>
          <ProductDetailsTabs product={productData} />
          {relatedProductsData.length > 0 && (
            <RelatedProducts
              title="You Might Also Adore" // More evocative title
              itemsPerViewDesktop={4}
            />
          )}

        </BottomSection>
      </ProductDetailContainer>
    </ProductDetailPageWrapper>
  );
};

export default ProductDetailPage;

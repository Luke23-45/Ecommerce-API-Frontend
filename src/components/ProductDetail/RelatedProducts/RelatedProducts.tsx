// src/components/ProductPage/RelatedProducts/RelatedProducts.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import {
  RelatedProductsWrapper,
  RelatedProductsTitle,
  ProductSliderWrapper,
  ProductSlidesContainer,
  ProductSlide,
  ProductSliderArrow,
  // We will use SliderDots and Dot styles defined in RelatedProducts.styles.ts for clarity
  // If you have them in a shared file, import from there. For this example, assuming they are in RelatedProducts.styles.ts
  SliderDots, 
  Dot         
} from './RelatedProducts.styles';

// --- CRITICAL: Correctly import ProductCard and its ProductData type ---
// Adjust this path to where your ProductCard component and its types are actually located.
// import ProductCard, { type ProductData } from '@/components/ProductCard/ProductCard'; 
// Using ProductData directly from ProductCard's export for type consistency.
export interface ProductData { // Ensure this matches your BaseProductData
  id: string;
  name: string;
  price: number;
  image: string;
  link: string;
  originalPrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  shippingInfo?: string;
  badges?: Array<{text: string, type: string, backgroundColor?: string, textColor?: string}>;
}
import ProductCard from './ProductCard';
// The ExtendedProductData for this component *must* satisfy ProductData.
// If it needs more fields, it should extend ProductData. For now, assume it's the same.
interface ExtendedProductData extends ProductData {}


// --- MOCK DATA GENERATION (Ensuring it produces valid ExtendedProductData) ---
const getRelatedImageForCard = (seed: string, i: number) => `https://picsum.photos/seed/rp-${seed}-${i}/400/550?${Math.random()}&elegant,home,decor`;

const generateMockRelatedItems = (count: number = 12, currentProductIdToExclude?: string): ExtendedProductData[] => {
  const items: ExtendedProductData[] = [];
  for (let i = 0; i < count; i++) {
    const randomIdSuffix = Math.random().toString(36).substring(2, 8); // Shorter random part
    const id = `related_item_${i + 1}_${randomIdSuffix}`;
    
    if (id === currentProductIdToExclude) continue;

    items.push({
      id: id,
      name: `Élan Complementary Piece ${i + 1}`,
      price: parseFloat((Math.random() * (350 - 25) + 25).toFixed(2)),
      image: getRelatedImageForCard('style', i), // This IS the primary image for the card
      link: `/product/${id}`,                  // This IS the link for the card
      originalPrice: i % 3 === 0 ? parseFloat((Math.random() * (450 - 350) + 350).toFixed(2)) : undefined,
      isNew: i % 4 === 1,
      isBestseller: i % 2 === 0,
      shippingInfo: i % 3 === 0 ? "Eligible for Free Shipping" : undefined,
      badges: i % 4 === 2 ? [{ text: "Trending", type: "custom", backgroundColor: "#7E57C2", textColor: "#FFFFFF" }] : undefined,
    });
  }
  // Ensure we return the requested count, even if one item (current product) was excluded
  const finalCount = currentProductIdToExclude && items.length >= count ? count : items.length;
  return items.slice(0, finalCount > count ? count : finalCount);
};
// --- END MOCK DATA GENERATION ---


interface RelatedProductsProps {
  currentProductId?: string;
  categoryId?: string;      // For actual data fetching
  brandName?: string;       // For actual data fetching
  tags?: string[];          // For actual data fetching
  products?: ExtendedProductData[]; // Allow pre-fetched products
  title?: string;
  itemsPerViewDesktop?: number;
  itemsPerViewTablet?: number;
  itemsPerViewMobile?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  categoryId, // These would be used if fetching data internally
  brandName,
  tags,
  products: initialProducts, 
  title = "You Might Also Adore",
  itemsPerViewDesktop = 4,
  itemsPerViewTablet = 3,
  itemsPerViewMobile = 2, 
}) => {
  const theme = useTheme() as DefaultTheme; // Ensure DefaultTheme from styled-components
  const [displayedProducts, setDisplayedProducts] = useState<ExtendedProductData[]>([]);
  const [currentLogicalSlide, setCurrentLogicalSlide] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(itemsPerViewDesktop);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Preparation Effect ---
  useEffect(() => {
    setIsLoading(true);
    let productsToDisplay: ExtendedProductData[] = [];

    if (initialProducts && initialProducts.length > 0) {
        productsToDisplay = initialProducts.filter(p => p.id !== currentProductId);
    } else {
        // Placeholder: In a real app, trigger fetch here based on categoryId, brandName, tags, etc.
        // For now, generating mock if no initialProducts.
        console.log("RelatedProducts: No initial products provided, generating mock based on currentProductId:", currentProductId);
        productsToDisplay = generateMockRelatedItems(12, currentProductId); 
    }
    
    // Ensure we have some products to show before attempting to calculate slidesToShow
    if (productsToDisplay.length > 0) {
        setDisplayedProducts(productsToDisplay.slice(0, 12)); // Limit mock data for sanity
    } else {
        setDisplayedProducts([]); // Set to empty if nothing to show
    }
    setIsLoading(false);
  }, [currentProductId, categoryId, brandName, tags, initialProducts]); // Re-run if criteria change


  // --- Responsive Slides to Show Effect ---
  useEffect(() => {
    const handleResize = () => {
      if (!theme?.breakpoints) return; // Guard if theme is not ready (e.g. initial SSR or test)

      const mobileLWidth = parseInt(theme.breakpoints.mobileL.replace('px', ''));
      const tabletWidth = parseInt(theme.breakpoints.tablet.replace('px', ''));
      const laptopWidth = parseInt(theme.breakpoints.laptop.replace('px', ''));
      let newSlidesToShow = itemsPerViewDesktop;

      if (window.innerWidth <= mobileLWidth) {
        newSlidesToShow = itemsPerViewMobile;
      } else if (window.innerWidth <= tabletWidth) {
        newSlidesToShow = itemsPerViewMobile; // Using itemsPerViewMobile for typical tablet portrait
      } else if (window.innerWidth <= laptopWidth) {
        newSlidesToShow = itemsPerViewTablet;
      }
      
      // Ensure slidesToShow is at least 1 and not more than available products
      const maxPossibleSlides = displayedProducts.length > 0 ? displayedProducts.length : 1;
      newSlidesToShow = Math.max(1, Math.min(newSlidesToShow, maxPossibleSlides));
      
      setSlidesToShow(newSlidesToShow);
      if (currentLogicalSlide !== 0) setCurrentLogicalSlide(0); // Reset on resize for simplicity
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [theme, itemsPerViewDesktop, itemsPerViewTablet, itemsPerViewMobile, displayedProducts.length]);


  // --- Slider Navigation Logic ---
  const totalProductCards = displayedProducts.length;
  const totalLogicalSlides = slidesToShow > 0 ? Math.ceil(totalProductCards / slidesToShow) : 0;

  const nextLogicalSlide = useCallback(() => {
    if (totalLogicalSlides > 0) { // Guard against division by zero if no slides
        setCurrentLogicalSlide(prev => Math.min(prev + 1, totalLogicalSlides - 1));
    }
  }, [totalLogicalSlides]);

  const prevLogicalSlide = useCallback(() => {
    setCurrentLogicalSlide(prev => Math.max(0, prev - 1));
  }, []);


  // --- Render ---
  if (isLoading) {
    return (
      <RelatedProductsWrapper style={{ minHeight: '250px', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <RelatedProductsTitle>{title}</RelatedProductsTitle>
        {/* Basic text loader is fine, or a small spinner */}
        <p style={{fontFamily: theme.typography.body.fontFamily, color: theme.colors.darkGray}}>Loading suggestions...</p>
      </RelatedProductsWrapper>
    );
  }

  if (!displayedProducts || displayedProducts.length === 0) {
    return null; // Render nothing if no related products found or to display
  }
  
  // Calculate props for ProductSlidesContainer CSS transform
  const totalWidthPercentForTrack = totalLogicalSlides * 100;
  const translateXPercentForTrack = currentLogicalSlide * 100;

  return (
    <RelatedProductsWrapper> 
      <RelatedProductsTitle>{title}</RelatedProductsTitle>
      <ProductSliderWrapper>
        <ProductSlidesContainer 
            $totalWidthPercent={totalWidthPercentForTrack} 
            $translateXPercent={translateXPercentForTrack}
        >
          {displayedProducts.map((product, index) => (
            <ProductSlide 
              key={product.id || `related-card-${index}`} 
              $slideWidthPercent={100 / slidesToShow} 
            >
              {/* ProductCard now receives correctly shaped 'product' prop */}
              <ProductCard product={product} index={index} />
            </ProductSlide>
          ))}
        </ProductSlidesContainer>
        {totalLogicalSlides > 1 && (
          <>
            <ProductSliderArrow 
              $direction="left" 
              onClick={prevLogicalSlide} 
              aria-label="Previous related products"
              disabled={currentLogicalSlide === 0}
              $isHidden={currentLogicalSlide === 0}
            >
              <FaChevronLeft />
            </ProductSliderArrow>
            <ProductSliderArrow 
              $direction="right" 
              onClick={nextLogicalSlide} 
              aria-label="Next related products"
              disabled={currentLogicalSlide >= totalLogicalSlides - 1}
              $isHidden={currentLogicalSlide >= totalLogicalSlides - 1}
            >
              <FaChevronRight />
            </ProductSliderArrow>
            
            <SliderDots> {/* Assumes SliderDots & Dot are correctly styled */}
              {Array.from({ length: totalLogicalSlides }).map((_, index) => (
                <Dot 
                  key={`related-dot-${index}`} 
                  $isActive={currentLogicalSlide === index}
                  onClick={() => setCurrentLogicalSlide(index)}
                  aria-label={`Go to related products page ${index + 1}`}
                />
              ))}
            </SliderDots>
          </>
        )}
      </ProductSliderWrapper>
    </RelatedProductsWrapper>
  );
};

export default RelatedProducts;
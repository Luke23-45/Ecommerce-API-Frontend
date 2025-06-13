// src/components/CategoryExplorer/ContentCanvas.tsx
// (This ContentCanvas is for the NEW 3-column "Hot Trend" / "Élan Edit" layout)
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Link as RouterLink, useNavigate } from "react-router-dom"; // For navigation

// Import ALL necessary styled components from the updated styles file
import {
  ContentCanvasContainer,
  SectionHeader, // For the overall "HOT! TREND" title
  ThreeColumnGrid,
  // Column 1: Keywords
  KeywordsColumn,
  KeywordsList,
  KeywordTag,
  // Column 2: Image Slider
  ImageSliderColumn,
  ImageSlidesTrack,
  PromoImageSlide,
  ImageDescriptionBox,
  // Column 3: Product Grid & Its Slider
  ProductGridColumn,
  ProductGridTitle,
  ProductGridSliderWrapper, // Specific wrapper for product grid slider
  ProductGridSlidesTrack,
  ProductItemsDisplayPage,
  // Product Cell specific styles (replaces external ProductCard)
  ProductCellStyled,
  ProductCellImageContainer,
  ProductCellContent,
  ProductCellName,
  ProductCellPrice,
  ProductPromoBadge, // For badges on product cells
  ProductShippingInfo, // For shipping text on product cells
  // Shared Slider Controls
  SliderNavArrowButton,
  SliderDotsContainer,
  DotButton,
  ProductGridPagination, // Uses SliderDotsContainer with different styling
  ColumnContainerTop,
  ColumnContainerBottom,
  ColumnTopTitle,
} from "./ContentCanvas.styles"; // ENSURE this path points to your 3-column styles file

// --- Data Structures (Align with your detailed description) ---
// This is the data for ONE product item in the Column 3 grid
interface ProductCellData {
  id: string;
  name: string; // e.g., "옆트임 남녀공용 메쉬$단 와이드 트임 팬츠 2p 세트 MDIP121LJ"
  price: number; // e.g., 19800
  originalPrice?: number;
  image: string; // Product image URL
  link: string; // Link to product detail page
  shippingInfo?: string; // e.g., "무료배송"
  badges?: Array<{
    text: string;
    type: "onePlusOne" | "custom" | "bestseller" | "new" | string;
  }>;
}

interface PromoSlideData {
  imageUrl: string;
  title: string;
  description?: string;
  link?: string;
}

interface KeywordData {
  id: string;
  label: string; // e.g., "#$피스"
  link: string;
  displayText: string; // e.g., "$피스"
}

interface CanvasTrendData {
  id: string;
  sectionTitle?: string;
  sectionTitleHighlight?: string;
  sectionSubtitle?: string;
  keywordsSectionTitle: string;
  keywords: KeywordData[];
  imageSlides: PromoSlideData[];
  productGridTitle: string;
  products: ProductCellData[];
}
// --- End Data Structures ---

// --- MOCK DATA for "HOT! TREND" (as defined meticulously before) ---
const getPicsumImage = (
  seed: string,
  width: number,
  height: number,
  tags: string = ""
) =>
  `https://picsum.photos/seed/${seed.replace(/\s/g, "-")}/${width}/${height}/?${tags},fashion,trend,${Math.random()}`;

const mockHotTrendData: CanvasTrendData = {
  id: "hot-trend-womens-fashion-2024-summer",
  sectionTitle: "TREND",
  sectionTitleHighlight: "HOT!",
  sectionSubtitle: "Recommended Advertised Products by Category",
  keywordsSectionTitle: "HOT Keywords",
  keywords: [
    {
      id: "onepiece",
      label: "#Dress",
      displayText: "Dress",
      link: "/search?q=dress",
    },
    {
      id: "blouse",
      label: "#Blouse",
      displayText: "Blouse",
      link: "/search?q=blouse",
    },
    {
      id: "tshirt",
      label: "#T-shirt",
      displayText: "T-shirt",
      link: "/search?q=t-shirt",
    },
    {
      id: "skirt",
      label: "#Skirt",
      displayText: "Skirt",
      link: "/search?q=skirt",
    },
    {
      id: "sneakers",
      label: "#Sneakers",
      displayText: "Sneakers",
      link: "/search?q=sneakers",
    },
  ],
  imageSlides: [
    {
      imageUrl: getPicsumImage("summer-model-1", 700, 900, "model,summer"),
      title: "Summer Essentials",
      description: "Full of freshness! Styling for summer",
      link: "/promo/summer-essentials",
    },
    {
      imageUrl: getPicsumImage("accessories-promo", 700, 900, "jewelry,bag"),
      title: "Point Accessories",
      description: "The final touch to complete your style",
      link: "/collections/accessories",
    },
  ],
  productGridTitle: "MD's Recommended Popular Items ✨",
  products: Array.from({ length: 12 }, (_, i) => {
    const basePrice = parseFloat(
      (Math.random() * (50000 - 5000) + 5000).toFixed(0)
    );
    return {
      id: `ht_prod_${i + 1}`,
      name: `Stylish ${["Blouse", "Dress", "Skirt", "Pants", "Accessory"][i % 5]} #${i + 1} (MDIP${100 + i}LJ)`,
      price: basePrice,
      originalPrice: i % 3 === 0 ? basePrice * 1.25 : undefined,
      image: getPicsumImage(
        `product-item-${i}`,
        300,
        300,
        ["clothing", "fashion-item"][i % 2]
      ),
      link: `/product/ht_prod_${i + 1}`,
      shippingInfo: i % 2 === 0 ? "Free Shipping" : undefined,
      badges:
        i % 4 === 0
          ? [{ text: "BEST", type: "bestseller" }]
          : i % 5 === 2
          ? [{ text: "1+1 EVENT", type: "onePlusOne" }]
          : undefined,
    };
  }),
};

interface ContentCanvasProps {
  sectionDataProp?: CanvasTrendData;
}

const PRODUCTS_PER_GRID_PAGE = 6; // 2 rows x 3 columns

const ContentCanvas: React.FC<ContentCanvasProps> = (sectionDataProps) => {
  const theme = useTheme() as DefaultTheme;

  console.log(sectionDataProps);
  const navigate = useNavigate(); 
  const sectionDataProp = mockHotTrendData;
  
  const sectionData = useMemo(
    () => sectionDataProp || mockHotTrendData,
    [sectionDataProp]
  );

  const [activeKeywords, setActiveKeywords] = useState<string[]>([]);


  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const totalImageSlides = sectionData.imageSlides.length;
  const imageSliderTrackRef = useRef<HTMLDivElement>(null); 


  const productGridSlides = useMemo(
    () => chunkArray(sectionData.products, PRODUCTS_PER_GRID_PAGE),
    [sectionData.products]
  );
  const [currentProductGridSlide, setCurrentProductGridSlide] = useState(0);
  const totalProductGridSlides = productGridSlides.length;
  const productSliderTrackRef = useRef<HTMLDivElement>(null); 


  const goToSlide = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<number>>,
      index: number,
      total: number
    ) => {
      if (index >= 0 && index < total) setter(index);
    },
    []
  );
  const nextSlide = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<number>>,
      current: number,
      total: number
    ) => {
      if (total > 0) setter((current + 1) % total);
    },
    []
  );
  const prevSlide = useCallback(
    (
      setter: React.Dispatch<React.SetStateAction<number>>,
      current: number,
      total: number
    ) => {
      if (total > 0) setter((current - 1 + total) % total);
    },
    []
  );


  useEffect(() => {
    if (totalImageSlides > 1) {
      const timer = setInterval(() => {
        nextSlide(
          setCurrentImageSlide,
          currentImageSlideRef.current,
          totalImageSlides
        );
      }, 5500); 
      return () => clearInterval(timer);
    }
  }, [totalImageSlides, nextSlide]);

  const currentImageSlideRef = useRef(currentImageSlide);
  useEffect(() => {
    currentImageSlideRef.current = currentImageSlide;
  }, [currentImageSlide]);

  useEffect(() => {
    if (totalProductGridSlides > 1) {
      const productTimer = setInterval(() => {
        nextSlide(
          setCurrentProductGridSlide,
          currentProductGridSlideRef.current,
          totalProductGridSlides
        );
      }, 7500);
      return () => clearInterval(productTimer);
    }
  }, [totalProductGridSlides, nextSlide]);
  const currentProductGridSlideRef = useRef(currentProductGridSlide);
  useEffect(() => {
    currentProductGridSlideRef.current = currentProductGridSlide;
  }, [currentProductGridSlide]);

  const handleKeywordClick = (keywordLink: string, keywordId: string) => {
    // Toggle active state for UI, actual navigation would be to keyword.link
    setActiveKeywords((prev) =>
      prev.includes(keywordId)
        ? prev.filter((id) => id !== keywordId)
        : [keywordId]
    );
    console.log("Keyword link clicked:", keywordLink);
  
  };


  if (!sectionData) {
    return (
      <ContentCanvasContainer theme={theme}>
        <p>Loading featured content...</p>
      </ContentCanvasContainer>
    );
  }

  const MarginAdd = sectionDataProp.index == 0 ? true : false
console.log("sectionDataProp.index ",sectionDataProp.index )
  const activeImageSlideData = sectionData.imageSlides[currentImageSlide]; // For description box

  console.log(MarginAdd)

  return (
    <ContentCanvasContainer style={{ marginBottom:"150px" }} theme={theme} key={sectionData.id}>
      {sectionDataProps.index === 0 && sectionData.sectionTitle && (
        <SectionHeader theme={theme}>
          <h2 className="main-title">
            {sectionData.sectionTitleHighlight && (
              <span className="highlight">
                {sectionData.sectionTitleHighlight}
              </span>
            )}
            {sectionData.sectionTitle}
          </h2>
          {sectionData.sectionSubtitle && (
            <p className="subtitle">{sectionData.sectionSubtitle}</p>
          )}
        </SectionHeader>
      )}

      <ThreeColumnGrid  theme={theme}>
        <KeywordsColumn theme={theme}>
          <ColumnContainerTop>
            <ColumnTopTitle>Living</ColumnTopTitle>
          </ColumnContainerTop>
          <ColumnContainerBottom>
            <h4 className="keywords-title">
              {sectionData.keywordsSectionTitle}
            </h4>
            <KeywordsList theme={theme}>
              {sectionData.keywords.map((keyword, index) => (
                <KeywordTag
                  theme={theme}
                  key={keyword.id}
                  $isActive={activeKeywords.includes(keyword.id)}
                  style={
                    {
                      "--stagger-delay": `${0.2 + index * 0.06}s`,
                    } as React.CSSProperties
                  }
                  onClick={(e) => {
                    handleKeywordClick(keyword.link, keyword.id);
                  }}
                  title={`Explore ${keyword.displayText}`}
                >
            
                  <span>{keyword.label}</span>
                </KeywordTag>
              ))}
            </KeywordsList>
          </ColumnContainerBottom>
        </KeywordsColumn>

        <ImageSliderColumn theme={theme}>
          <ImageSlidesTrack
            theme={theme}
            ref={imageSliderTrackRef}
            $slideCount={totalImageSlides}
            $currentSlide={currentImageSlide}
          >
            {sectionData.imageSlides.map((slide, index) => (
              <PromoImageSlide
                theme={theme}
                key={`promo-img-slide-${index}`}
                $imageUrl={slide.imageUrl}
              />
              
            ))}
              {activeImageSlideData && (
            <ImageDescriptionBox
              theme={theme}
              className={
                activeImageSlideData ===
                sectionData.imageSlides[currentImageSlide]
                  ? "active"
                  : "aaaaaaaaaaaaaaaaa"
              }
              style={{ animationDelay: "0.3s" }} // Delay after slide transition
            >
              <h4>{activeImageSlideData.title}</h4>
              {activeImageSlideData.description && (
                <p>{activeImageSlideData.description}</p>
              )}
            
              {/* {activeImageSlideData.link && <PromoCTAButton href={activeImageSlideData.link}>Shop Now</PromoCTAButton>} */}
            </ImageDescriptionBox>
          )}

          </ImageSlidesTrack>

    

          {totalImageSlides > 1 && (
            <>
              <SliderNavArrowButton
                theme={theme}
                $direction="left"
                onClick={() =>
                  prevSlide(
                    setCurrentImageSlide,
                    currentImageSlide,
                    totalImageSlides
                  )
                }
                aria-label="Previous feature"
                $isHidden={currentImageSlide === 0}
              >
                <FaChevronLeft />
              </SliderNavArrowButton>
              <SliderNavArrowButton
                theme={theme}
                $direction="right"
                onClick={() =>
                  nextSlide(
                    setCurrentImageSlide,
                    currentImageSlide,
                    totalImageSlides
                  )
                }
                aria-label="Next feature"
                $isHidden={currentImageSlide === totalImageSlides - 1}
              >
                <FaChevronRight />
              </SliderNavArrowButton>
              <SliderDotsContainer theme={theme}>
                {sectionData.imageSlides.map((_, index) => (
                  <DotButton
                    theme={theme}
                    key={`img-dot-${index}`}
                    $isActive={currentImageSlide === index}
                    onClick={() =>
                      goToSlide(setCurrentImageSlide, index, totalImageSlides)
                    }
                    aria-label={`Go to feature ${index + 1}`}
                  />
                ))}
              </SliderDotsContainer>
            </>
          )}
        </ImageSliderColumn>

        {/* Column 3: Product Grid Slider */}
        <ProductGridColumn theme={theme}>
          <ProductGridTitle theme={theme}>
            {sectionData.productGridTitle}
          </ProductGridTitle>
          <ProductGridSliderWrapper theme={theme}>
            {" "}
            {/* This wraps the track and provides overflow:hidden */}
            <ProductGridSlidesTrack
              theme={theme}
              ref={productSliderTrackRef}
              $slideCount={totalProductGridSlides}
              $currentSlide={currentProductGridSlide}
            >
              {productGridSlides.map((productPageItems, pageIndex) => (
                // This div acts as a single slide/page in the product grid track
                <div
                  style={{ flex: "0 0 100%", width: "100%" }}
                  key={`prod-grid-slide-${pageIndex}`}
                >
                  <ProductItemsDisplayPage theme={theme}>
                    {" "}
                    {/* This is the 2x3 CSS Grid */}
                    {productPageItems.map((product) => (
                      <ProductCellStyled
                        theme={theme}
                        key={product.id}
                        href={product.link} // Simple link for now
                        title={product.name}
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default if using RouterLink or navigate
                          navigate(product.link);
                          console.log("Navigate to product:", product.link);
                        }}
                      >
                        <ProductCellImageContainer theme={theme}>
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                          />
                          {/* Render Badges */}
                          {product.badges?.map((badge, badgeIdx) => (
                            <ProductPromoBadge
                              theme={theme}
                              key={`${product.id}-badge-${badgeIdx}`}
                              $type={badge.type}
                            >
                              {badge.text}
                            </ProductPromoBadge>
                          ))}
                        </ProductCellImageContainer>
                        <ProductCellContent theme={theme}>
                          <ProductCellName theme={theme}>
                            {product.name}
                          </ProductCellName>
                          <ProductCellPrice theme={theme}>
                            {product.originalPrice && (
                              <s
                                style={{
                                  color: theme.colors.darkGray,
                                  marginRight: theme.spacing(1.5),
                                  fontSize: "0.85em",
                                  opacity: 0.7,
                                }}
                              >
                                ${product.originalPrice.toLocaleString()}
                              </s>
                            )}
                            ${product.price.toLocaleString()}${" "}
                            {/* Assuming price is in Won */}
                          </ProductCellPrice>
                          {product.shippingInfo && (
                            <ProductShippingInfo theme={theme}>
                              {product.shippingInfo}
                            </ProductShippingInfo>
                          )}
                        </ProductCellContent>
                      </ProductCellStyled>
                    ))}
                  </ProductItemsDisplayPage>
                </div>
              ))}
            </ProductGridSlidesTrack>
            {totalProductGridSlides > 1 && (
              <>
                <SliderNavArrowButton
                  theme={theme}
                  $direction="left"
                  onClick={() =>
                    prevSlide(
                      setCurrentProductGridSlide,
                      currentProductGridSlide,
                      totalProductGridSlides
                    )
                  }
                  aria-label="Previous products"
                  $isHidden={currentProductGridSlide === 0}
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  <FaChevronLeft />
                </SliderNavArrowButton>
                <SliderNavArrowButton
                  theme={theme}
                  $direction="right"
                  onClick={() =>
                    nextSlide(
                      setCurrentProductGridSlide,
                      currentProductGridSlide,
                      totalProductGridSlides
                    )
                  }
                  aria-label="Next products"
                  $isHidden={
                    currentProductGridSlide >= totalProductGridSlides - 1
                  }
                  style={{ top: "50%", transform: "translateY(-50%)" }}
                >
                  <FaChevronRight />
                </SliderNavArrowButton>
                <ProductGridPagination theme={theme}>
                  {Array.from({ length: totalProductGridSlides }).map(
                    (_, index) => (
                      <DotButton
                        theme={theme}
                        key={`prod-grid-dot-${index}`}
                        $isActive={currentProductGridSlide === index}
                        onClick={() =>
                          goToSlide(
                            setCurrentProductGridSlide,
                            index,
                            totalProductGridSlides
                          )
                        }
                        aria-label={`Go to product set ${index + 1}`}
                      />
                    )
                  )}
                </ProductGridPagination>
              </>
            )}
          </ProductGridSliderWrapper>
        </ProductGridColumn>
      </ThreeColumnGrid>
    </ContentCanvasContainer>
  );
};

// Helper to chunk array (keep this at the bottom or in a utils file)
function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  if (!array || size <= 0) return result;
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export default ContentCanvas;

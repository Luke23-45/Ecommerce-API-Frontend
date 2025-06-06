
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTheme, type DefaultTheme } from "styled-components";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom"; 

import {
  SectionWrapper,
  SectionContentLimiter,
  SectionHeader,
  CarouselNavigation,
  PaginationIndicator,
  CarouselNavArrow,
  CarouselViewport,
  CarouselTrack,
  CarouselItemSlot,
  
  ProductCellStyled,
  ProductCellImageContainer,
  ProductCellBadge,
  ProductCellContent,
  ProductCellName,
  ProductCellPriceInfo,
  ProductCellCurrentPrice,
  ProductCellOriginalPrice,
  ProductCellSpecialTag,
  ProductCellShippingText,
  ProductCellReviewInfo,
  ProductCellStars,
  ProductCellReviewCount,
} from "./CuratedFindsSection.styles";
import { useNavigate } from "react-router-dom";

interface CuratedProductItemData {
  id: string;
  name: string; 
  price: number; 
  originalPrice?: number; 
  image: string; 
  link: string; 
  discountPercentage?: number; 
  shippingInfo?: string; 
  specialTag?: string; 
  averageRating?: number; 
  reviewCount?: number; 
  badges?: Array<{
    text: string;
    type: "onePlusOne" | "customPromotion" | string;
  }>; 
}


const getCuratedImage = (seed: string, i: number) =>
  `https://picsum.photos/seed/curated-${seed}-${i}/300/300?${Math.random()}&product,item`;

const generateCuratedItems = (
  count: number = 15,
  currentProductIdToExclude?: string
): CuratedProductItemData[] => {
  const items: CuratedProductItemData[] = [];
  for (let i = 0; i < count; i++) {
    const id = `curated_item_${i + 1}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    if (id === currentProductIdToExclude) continue;

    const basePrice = parseFloat(
      (Math.random() * (60000 - 5000) + 5000).toFixed(0)
    );
    const hasDiscount = i % 2 === 0;
    const discountPercentage = hasDiscount
      ? Math.floor(Math.random() * (90 - 50) + 50)
      : undefined;
    const currentPrice = hasDiscount
      ? parseFloat((basePrice * (1 - discountPercentage! / 100)).toFixed(0))
      : basePrice;

    items.push({
      id: id,
      name: `[Sample] ${["Elegance", "Mora", "Unique", "Burnley", "Hanriri"][i % 5]} ${["Lilith", "BTS", "minidress", "Jinder Bag", "Sseuseuteu"][i % 5]} (Product No. ${1001 + i})`,
      price: currentPrice,
      originalPrice: hasDiscount ? basePrice : undefined,
      image: getCuratedImage("product", i),
      link: `/product/${id}`,
      discountPercentage: discountPercentage,
      shippingInfo:
        i % 3 === 0 ? "Free Shipping" : i % 3 === 1 ? "Seller Bears Cost" : undefined,
      specialTag: i % 4 === 0 ? "🚀 ROCKET" : undefined,
      averageRating: parseFloat((Math.random() * (5 - 3.8) + 3.8).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 3000) + 200,
      badges:
        i % 5 === 0 && !hasDiscount
          ? [{ text: "BEST", type: "customPromotion" }]
          : i % 7 === 0
          ? [{ text: "1+1", type: "onePlusOne" }]
          : undefined,
    });
  }
  return items.slice(0, Math.min(count, items.length));
};

interface CuratedFindsSectionProps {
  products?: CuratedProductItemData[];
  title?: string;
  subtitle?:string;
  itemsPerViewDesktop?: number;
  itemsPerViewTablet?: number;
  itemsPerViewMobile?: number;
}

const CuratedFindsSection: React.FC<CuratedFindsSectionProps> = ({
  products: initialProducts,
  title = "Worldwide Hot Deal", 
  subtitle = "Global Special Price",
  itemsPerViewDesktop = 5, 
  itemsPerViewTablet = 3,
  itemsPerViewMobile = 2,
}) => {
  const theme = useTheme() as DefaultTheme;
  const navigate = useNavigate(); 
  const [currentProducts, setCurrentProducts] = useState<
    CuratedProductItemData[]
  >([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerViewDesktop);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const productsToUse = initialProducts || generateCuratedItems(20);
    setCurrentProducts(productsToUse);
    setIsLoading(false);
  }, [initialProducts]);

  const totalItems = currentProducts.length;
  const totalPages =
    itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;
  const nextPage = useCallback(() => {
    if (totalPages > 0)
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);
  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  }, []);

  const renderStars = (rating: number = 0) => {
    const stars = [];
    const full = Math.floor(rating);
    const half =
      parseFloat((rating % 1).toFixed(1)) >= 0.4 &&
      parseFloat((rating % 1).toFixed(1)) < 0.9;
    const empty = Math.max(0, 5 - full - (half ? 1 : 0));
    for (let i = 0; i < full; i++)
      stars.push(<FaStar key={`fs-${i}-${Math.random()}`} />);
    if (half) stars.push(<FaStarHalfAlt key={`hs-${Math.random()}`} />);
    for (let i = 0; i < empty; i++)
      stars.push(<FaRegStar key={`es-${i}-${Math.random()}`} />);
    return stars;
  };
  if (isLoading) {
    return (
      <SectionWrapper
        theme={theme}
        style={{
          minHeight: "300px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Loading deals...</p>
      </SectionWrapper>
    );
  }
  if (!currentProducts || currentProducts.length === 0) return null;

  const trackWidthPercent = totalPages * 100;
  const trackTranslateXPercent = currentPage * 100;
  console.log("currentPage:", currentPage, "totalPages:", totalPages);
  console.log("Transform value:", -currentPage * 100);
  return (
    <SectionWrapper theme={theme}>
      <SectionContentLimiter theme={theme}>
        <SectionHeader theme={theme}>
          <h2 className="section-title ">{title}
          &nbsp;  <span className="highlight">{subtitle}</span>
          </h2>

          {totalPages > 1 && (
            <CarouselNavigation theme={theme}>
              <CarouselNavArrow
                theme={theme}
                onClick={prevPage}
                disabled={currentPage === 0}
                $isHidden={currentPage === 0}
              >
                <FaChevronLeft />
              </CarouselNavArrow>
              <PaginationIndicator theme={theme}>
                {currentPage + 1} / {totalPages}
              </PaginationIndicator>
              <CarouselNavArrow
                theme={theme}
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                $isHidden={currentPage >= totalPages - 1}
              >
                <FaChevronRight />
              </CarouselNavArrow>
            </CarouselNavigation>
          )}
        </SectionHeader>

        <CarouselViewport theme={theme}>
          <CarouselTrack
            theme={theme}
            $itemCount={totalItems} 
            $itemsPerPage={itemsPerPage} 
            $currentGroupIndex={currentPage} 
            style={{ width: `${trackWidthPercent}%` }}
          >
            {}
            {currentProducts.map((product, index) => (
              <CarouselItemSlot
                theme={theme}
                key={product.id || `curated-slot-${index}`}
                $itemsPerPage={itemsPerPage}
              >
                <ProductCellStyled
                  theme={theme}
                  href={product.link}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(product.link);
                  }}
                  title={product.name}
                >
                  <ProductCellImageContainer theme={theme}>
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                    {/* Render dynamic badges from product.badges */}
                    {product.badges?.map((badge, badgeIdx) => (
                      <ProductCellBadge
                        theme={theme}
                        key={badgeIdx}
                        $type={badge.type}
                      >
                        {badge.text}
                      </ProductCellBadge>
                    ))}
                    {product.discountPercentage &&
                      !product.badges?.some((b) => b.type === "onePlusOne") && (
                        <ProductCellBadge theme={theme} $isDiscount>
                          <span className="percentage-symbol">%</span> now{" "}
                          {product.discountPercentage}% On sale
                        </ProductCellBadge>
                      )}
                  </ProductCellImageContainer>
                  <ProductCellContent theme={theme}>
                    <ProductCellName theme={theme}>
                      {product.name}
                    </ProductCellName>
                    <ProductCellPriceInfo theme={theme}>
                      <ProductCellCurrentPrice theme={theme}>
                        {product.price.toLocaleString()}
                        <span className="currency-symbol">$</span>
                      </ProductCellCurrentPrice>
                      {product.originalPrice && (
                        <ProductCellOriginalPrice theme={theme}>
                          {product.originalPrice.toLocaleString()}$
                        </ProductCellOriginalPrice>
                      )}
                      {product.specialTag && (
                        <ProductCellSpecialTag theme={theme}>
                          {product.specialTag}
                        </ProductCellSpecialTag>
                      )}
                    </ProductCellPriceInfo>
                    {product.shippingInfo && (
                      <ProductCellShippingText theme={theme}>
                        {product.shippingInfo}
                      </ProductCellShippingText>
                    )}
                    {product.averageRating !== undefined &&
                      product.reviewCount !== undefined &&
                      product.reviewCount > 0 && (
                        <ProductCellReviewInfo theme={theme}>
                          <ProductCellStars theme={theme}>
                            {renderStars(product.averageRating)}
                          </ProductCellStars>
                          <ProductCellReviewCount theme={theme}>
                            ({product.reviewCount.toLocaleString()})
                          </ProductCellReviewCount>
                        </ProductCellReviewInfo>
                      )}
                  </ProductCellContent>
                </ProductCellStyled>
              </CarouselItemSlot>
            ))}
          </CarouselTrack>
        </CarouselViewport>
      </SectionContentLimiter>
    </SectionWrapper>
  );
};

export default CuratedFindsSection;

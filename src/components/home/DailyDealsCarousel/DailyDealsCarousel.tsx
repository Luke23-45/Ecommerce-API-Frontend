import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import { FaChevronLeft, FaChevronRight, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Using RouterLink for semantic links

import {
  DealsSectionWrapper,
  DealsContentLimiter,
  DealsHeader,
  CarouselNavigationControls,
  PageIndicator,
  DealCarouselArrow,
  DealsCarouselViewport,
  DealsCarouselTrack,
  DealItemSlot,
  DealProductCell,
  DealProductImageContainer,
  OfferTag,
  DealProductContent,
  DealProductName,
  DealPriceInfo,
  DealCurrentPrice,
  DealDiscountText,
  DealReviewInfo,
  DealStars,
  DealReviewCount,
} from './DailyDealsCarousel.styles';

// --- Data Interface ---
interface DailyDealItemData {
  id: string;
  name: string;
  image: string;
  link: string;
  offerTag?: string; // e.g., "특가진행중"
  price: number; // Current selling price
  originalPrice?: number; // For strikethrough if applicable
  discountText?: string; // e.g., "와우할인가 66%"
  averageRating?: number;
  reviewCount?: number;
}
const getCuratedImage = (seed: string, i: number) =>
  `https://picsum.photos/seed/curated-${seed}-${i}/300/300?${Math.random()}&product,item`;

const generateDailyDealItems = (count: number): DailyDealItemData[] => {
  const items: DailyDealItemData[] = [];
  const baseNames = [
    "Sangrip Premium Mini Yakgwa",
    "Tools Steady Non-Irritating",
    "Alicia Metal Cooling Air Conditioner",
    "Victoria Sparkling Water 500ml",
    "Coke Black Sapphire",
    "Wireless Charging Earphones",
    "Eco-friendly Multi-purpose Cleaner",
    "High-performance Gaming Mouse",
    "Smart LED Lighting",
    "Portable Mini Fan",
    "Automatic Foam Hand Sanitizer",
    "Ultra-fast USB-C Charger"
  ];
  const imageUrls = [];

  for (let i = 0; i < 15; i++) {
    imageUrls.push(getCuratedImage("product", i));
  }

  for (let i = 0; i < count; i++) {
    const randomName = baseNames[i % baseNames.length] + ` (${i + 1} pcs)`;
    const randomImage = imageUrls[i % imageUrls.length];
    const original = Math.floor(Math.random() * 50000) + 10000;
    const discount = Math.floor(Math.random() * 70) + 10;
    const current = Math.floor(original * (100 - discount) / 100);

    items.push({
      id: `daily-deal-${i}`,
      name: randomName,
      image: randomImage,
      link: `/product/${i}`,
      offerTag: "Special Price in Progress",
      price: current,
      originalPrice: original,
      discountText: `Wow Discount Price ${discount}%`,
      averageRating: parseFloat((Math.random() * 4 + 1).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 10000) + 50,
    });
  }
  return items;
};

interface DailyDealsCarouselProps {
  products?: DailyDealItemData[];
}

const DailyDealsCarousel: React.FC<DailyDealsCarouselProps> = ({ products: initialProducts }) => {
  const theme = useTheme() as DefaultTheme;
  const navigate = useNavigate();

  const [dailyDeals, setDailyDeals] = useState<DailyDealItemData[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const itemsPerPage = 5;

  useEffect(() => {
    setIsLoading(true);
    const dealsToUse = initialProducts || generateDailyDealItems(25); 
    setDailyDeals(dealsToUse);
    setIsLoading(false);
  }, [initialProducts]);

  const totalItems = dailyDeals.length;

  const totalPages = itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;


  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  }, []);


  const renderStars = (rating: number = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.4 && (rating % 1) < 0.9; 
    const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} />);
    if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" />);
    for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} />);
    return stars;
  };

  if (isLoading) {
    return <DealsSectionWrapper theme={theme} style={{ minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}><p>Loading daily deals...</p></DealsSectionWrapper>
  }

  if (!dailyDeals || dailyDeals.length === 0) return null;

  return (
    <DealsSectionWrapper theme={theme}>
      <DealsContentLimiter theme={theme}>
        <DealsHeader theme={theme}>
          <h2 className="section-title">Today's <span className="highlight">Seller Specials</span></h2>
          {totalPages > 1 && ( 
            <CarouselNavigationControls theme={theme}>
              <PageIndicator theme={theme}>
                {currentPage + 1} / {totalPages}
              </PageIndicator>
              <DealCarouselArrow
                theme={theme}
                onClick={prevPage}
                disabled={currentPage === 0}
                $isHidden={currentPage === 0}
                aria-label="Previous daily deals"
              >
                <FaChevronLeft />
              </DealCarouselArrow>
              <DealCarouselArrow
                theme={theme}
                onClick={nextPage}
                disabled={currentPage >= totalPages - 1}
                $isHidden={currentPage >= totalPages - 1}
                aria-label="Next daily deals"
              >
                <FaChevronRight />
              </DealCarouselArrow>
            </CarouselNavigationControls>
          )}
        </DealsHeader>

        <DealsCarouselViewport theme={theme}>
          <DealsCarouselTrack
            theme={theme}
            $itemCount={totalItems}
              $itemsPerPage={5}
            $totalPages={totalPages}
            $currentPage={currentPage}
          >
            {dailyDeals.map((deal, index) => (
              <DealItemSlot
                theme={theme}
                key={deal.id || `daily-deal-slot-${index}`}
                $itemsPerPage={itemsPerPage} 
              >
                <DealProductCell
                  theme={theme}
                  href={deal.link}
                  onClick={(e) => { e.preventDefault(); navigate(deal.link); }}
                  title={deal.name}
                >
                  <DealProductImageContainer theme={theme} className="deal-product-image">
                    <img src={deal.image} alt={deal.name} loading="lazy" />
                  </DealProductImageContainer>
                  <DealProductContent theme={theme}>
      <div>
                      {deal.offerTag && (
                      <OfferTag theme={theme}>{deal.offerTag}</OfferTag>
                    )}
      </div>
                    <DealProductName theme={theme}>{deal.name}</DealProductName>
                    <DealPriceInfo theme={theme}>
                      <DealCurrentPrice theme={theme}>
                        {deal.price.toLocaleString()}
                        <span className="currency">$</span>
                      </DealCurrentPrice>
                      {deal.discountText && (
                        <DealDiscountText theme={theme}>{deal.discountText}</DealDiscountText>
                      )}
                    </DealPriceInfo>
                    {(deal.averageRating !== undefined && deal.reviewCount !== undefined) && (
                      <DealReviewInfo theme={theme}>
                        <DealStars theme={theme}>{renderStars(deal.averageRating)}</DealStars>
                        <DealReviewCount theme={theme}>({deal.reviewCount.toLocaleString()})</DealReviewCount>
                      </DealReviewInfo>
                    )}
                  </DealProductContent>
                </DealProductCell>
              </DealItemSlot>
            ))}
          </DealsCarouselTrack>
        </DealsCarouselViewport>
      </DealsContentLimiter>
    </DealsSectionWrapper>
  );
};

export default DailyDealsCarousel;
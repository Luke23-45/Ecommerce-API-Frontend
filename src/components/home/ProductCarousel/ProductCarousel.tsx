// src/components/ProductCarousel/ProductCarousel.tsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard,{ type ProductData } from "../ProductCard/ProductCard";
import {
  ProductCarouselSection,
  SectionHeadline,
  CarouselContainer,
  CarouselWrapper,
  NavArrow,
  CardActionsOverlay,
  QuickActionButton,
  AddToCartButton,
} from "./ProductCarousel.styles";

// Dummy data for products (use the shared ProductData interface)
const getProductImage = (seed: string, width: number, height: number) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

const dummyProducts: ProductData[] = [
  {
    id: "p1",
    name: "Élan Linen Throw & Cushion Set Deluxe",
    price: 85.0,
    image: getProductImage("linen-throw-1", 400, 560),
    isNew: true,
    link: "#product-linen-throw",
    quickViewLink: "#quick-view-linen-throw",
  },
  {
    id: "p2",
    name: "Sculptural Ceramic Vase Trio Collection",
    price: 120.0,
    image: getProductImage("ceramic-vase-2", 400, 560),
    isBestseller: true,
    link: "#product-ceramic-vase",
    quickViewLink: "#quick-view-ceramic-vase",
  },
  {
    id: "p3",
    name: "Minimalist Oak Coffee Table with Storage",
    price: 450.0,
    image: getProductImage("coffee-table-3", 400, 560),
    link: "#product-coffee-table",
    quickViewLink: "#quick-view-coffee-table",
  },
  {
    id: "p4",
    name: "Velvet Dining Chair - Emerald Green Edition",
    price: 180.0,
    image: getProductImage("dining-chair-4", 400, 560),
    isNew: true,
    link: "#product-dining-chair",
    quickViewLink: "#quick-view-dining-chair",
  },
  {
    id: "p5",
    name: "Artisan Handcrafted Wooden Serving Tray",
    price: 65.0,
    image: getProductImage("wooden-tray-5", 400, 560),
    link: "#product-wooden-tray",
    quickViewLink: "#quick-view-wooden-tray",
  },
  {
    id: "p6",
    name: "Eco-Friendly Self-Watering Planter Pot",
    price: 40.0,
    image: getProductImage("planter-6", 400, 560),
    isBestseller: true,
    link: "#product-planter",
    quickViewLink: "#quick-view-planter",
  },
  {
    id: "p7",
    name: "Hand-Tufted Abstract Wool Area Rug Design",
    price: 320.0,
    image: getProductImage("wool-rug-7", 400, 560),
    link: "#product-wool-rug",
    quickViewLink: "#quick-view-wool-rug",
  },
  {
    id: "p8",
    name: "Luminous Glow Serum - Organic Skincare",
    price: 55.0,
    image: getProductImage("serum-8", 400, 560),
    isNew: true,
    link: "#product-serum",
  },
  {
    id: "p9",
    name: "Retro Bluetooth Speaker - Walnut Finish",
    price: 150.0,
    image: getProductImage("speaker-9", 400, 560),
    isBestseller: true,
    link: "#product-speaker",
  },
];


const ProductCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const SCROLL_AMOUNT_PERCENTAGE = 0.8;

  const updateArrowStates = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    updateArrowStates();
    window.addEventListener("resize", updateArrowStates);
    const currentRef = carouselRef.current;
    if (currentRef) {
        currentRef.addEventListener("scroll", updateArrowStates);
    }
    return () => {
      window.removeEventListener("resize", updateArrowStates);
      if (currentRef) {
        currentRef.removeEventListener("scroll", updateArrowStates);
      }
    };
  }, [updateArrowStates]);

  useEffect(() => {
    if (!carouselRef.current) return;
    const observer = new MutationObserver(updateArrowStates);
    observer.observe(carouselRef.current, { childList: true });
    return () => observer.disconnect();
  }, [updateArrowStates]);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * SCROLL_AMOUNT_PERCENTAGE;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const [showArrows, setShowArrows] = useState(false);
  useEffect(() => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      const overflows = scrollWidth > clientWidth;
      setShowArrows(overflows);

      if (overflows) {
          updateArrowStates();
      } else {
          setCanScrollLeft(false);
          setCanScrollRight(false);
      }
    }
  }, [dummyProducts.length, updateArrowStates]);

  return (
    <ProductCarouselSection>
      <SectionHeadline>
        Seasonal Inspirations: New Arrivals & Bestsellers
      </SectionHeadline>
      <CarouselContainer>
        <CarouselWrapper ref={carouselRef}>
          {dummyProducts.map((product, index) => (
            <ProductCard product={product} index={index} key={product.id} onClick={(e) => {
                // Default click behavior, but can be overridden by buttons inside children
                if (!e.defaultPrevented) {
                  window.location.href = product.link;
                }
            }}>
              <CardActionsOverlay> {/* This component is children of ProductCard */}
                {product.quickViewLink && (
                  <QuickActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      console.log(
                        "Quick View clicked for",
                        product.name,
                        product.quickViewLink
                      );
                    }}
                  >
                    Quick View
                  </QuickActionButton>
                )}
                <AddToCartButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    console.log("Add to Cart clicked for", product.name);
                  }}
                >
                  Add to Cart
                </AddToCartButton>
              </CardActionsOverlay>
            </ProductCard>
          ))}
        </CarouselWrapper>
        {showArrows && (
          <>
            <NavArrow
              $direction="left"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              disabled={!canScrollLeft}
            >
              <FaChevronLeft />
            </NavArrow>
            <NavArrow
              $direction="right"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              disabled={!canScrollRight}
            >
              <FaChevronRight />
            </NavArrow>
          </>
        )}
      </CarouselContainer>
    </ProductCarouselSection>
  );
};

export default ProductCarousel;
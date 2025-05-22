// src/components/ProductCarousel/ProductCarousel.tsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Icons for navigation
import {
  ProductCarouselSection,
  SectionHeadline,
  CarouselContainer,
  CarouselWrapper,
  NavArrow,
  ProductCard,
  ProductImageWrapper,
  ProductDetails,
  ProductName,
  ProductPrice,
  Badge,
  CardActionsOverlay,
  QuickActionButton,
  AddToCartButton,
} from "./ProductCarousel.styles";

// Dummy data for products
interface ProductData {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  isBestseller?: boolean;
  link: string;
  quickViewLink?: string;
}

// High-quality dummy image generator (using Picsum for simplicity here)
const getProductImage = (seed: string, width: number, height: number) =>
  `https://picsum.photos/seed/${seed}/${width}/${height}`;

const dummyProducts: ProductData[] = [
  {
    id: "p1",
    name: "Élan Linen Throw & Cushion Set Deluxe",
    price: 85.0,
    image: getProductImage("linen-throw-1", 400, 560), // Adjusted height for 0.7 aspect ratio (400 / 0.7 = ~571.4, use 560 for clean values)
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

// --- ProductItemCard Sub-component ---
interface ProductItemCardProps {
  product: ProductData;
  index: number; // For staggered animation
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  product,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // It's good practice to disconnect once observed if you only need it to appear once
          if (cardRef.current) { // Use ref.current here for safety and consistency
            observer.unobserve(cardRef.current);
          }
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the card is visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      // Ensure observer is always disconnected if it was initialized
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []); // Empty dependency array: observe on mount and clean up on unmount

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent card navigation if an action button was clicked within the card
    if ((e.target as HTMLElement).closest("button")) {
      e.preventDefault(); // Stop default navigation/event propagation for the card itself
      return; // Stop function execution
    }
    // Perform navigation if no button was clicked
    window.location.href = product.link;
  };

  return (
    <ProductCard
      ref={cardRef}
      className={isVisible ? "is-visible" : ""}
      // Pass animation delay as CSS variable for styles to pick up, controlled by `isVisible`
      style={{ '--animation-delay': `${index * 80}ms` } as React.CSSProperties}
      onClick={handleCardClick}
    >
      <ProductImageWrapper>
        <img src={product.image} alt={product.name} loading="lazy" />
        {/* Render badges conditionally */}
        {product.isNew && <Badge $type="new">New Arrival</Badge>}
        {product.isBestseller && <Badge $type="bestseller">Bestseller</Badge>}
      </ProductImageWrapper>
      <ProductDetails>
        <ProductName title={product.name}>{product.name}</ProductName>
        <ProductPrice>${product.price.toFixed(2)}</ProductPrice>
        {/* CardActionsOverlay now lives inside ProductDetails in JSX */}
        <CardActionsOverlay>
          {/* Render Quick View button only if link exists */}
          {product.quickViewLink && (
            <QuickActionButton
              onClick={(e) => {
                e.stopPropagation(); // Prevent card navigation
                console.log(
                  "Quick View clicked for",
                  product.name,
                  product.quickViewLink
                );
                // Example: openQuickViewModal(product);
              }}
            >
              Quick View
            </QuickActionButton>
          )}
          <AddToCartButton
            onClick={(e) => {
              e.stopPropagation(); // Prevent card navigation
              console.log("Add to Cart clicked for", product.name);
              // Example: addToCart(product.id);
            }}
          >
            Add to Cart
          </AddToCartButton>
        </CardActionsOverlay>
      </ProductDetails>
    </ProductCard>
  );
};

// --- Main ProductCarousel Component ---
const ProductCarousel: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const SCROLL_AMOUNT_PERCENTAGE = 0.8; // Scroll by 80% of container width

  const updateArrowStates = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 5); // Allow a small tolerance from left edge
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Allow a small tolerance from right edge
    }
  }, []); // useCallback memoizes the function

  // Effect to update arrows on mount and resize
  useEffect(() => {
    updateArrowStates(); // Initial check
    window.addEventListener("resize", updateArrowStates); // On window resize
    const currentRef = carouselRef.current; // Capture for cleanup
    if (currentRef) {
        // Also update on scroll for continuous tracking (debounce in styles if needed)
        currentRef.addEventListener("scroll", updateArrowStates);
    }
    return () => {
      window.removeEventListener("resize", updateArrowStates);
      if (currentRef) {
        currentRef.removeEventListener("scroll", updateArrowStates);
      }
    };
  }, [updateArrowStates]); // Depends on updateArrowStates, which is memoized

  // MutationObserver for dynamically added/removed carousel items (less common for static data)
  useEffect(() => {
    if (!carouselRef.current) return;

    const observer = new MutationObserver(updateArrowStates);
    // Observe changes to the carousel wrapper's children
    observer.observe(carouselRef.current, { childList: true });

    return () => observer.disconnect(); // Clean up observer
  }, [updateArrowStates]); // Depends on updateArrowStates

  // Function to scroll the carousel
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount =
        carouselRef.current.clientWidth * SCROLL_AMOUNT_PERCENTAGE;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      // updateArrowStates will be implicitly called by the `scroll` event listener
      // added in the `useEffect` above.
    }
  };

  // Determine if arrows should be shown at all (only if content overflows)
  const [showArrows, setShowArrows] = useState(false);
  useEffect(() => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      const overflows = scrollWidth > clientWidth;
      setShowArrows(overflows); // Set state based on overflow

      // Update scrollability states if content overflows or not
      if (overflows) {
          updateArrowStates(); // Check actual scroll positions
      } else {
          setCanScrollLeft(false);
          setCanScrollRight(false);
      }
    }
  }, [dummyProducts.length, updateArrowStates]); // Recalculate if products change or updateArrowStates memo changes

  return (
    <ProductCarouselSection>
      <SectionHeadline>
        Seasonal Inspirations: New Arrivals & Bestsellers
      </SectionHeadline>
      <CarouselContainer>
        <CarouselWrapper ref={carouselRef}> {/* Removed onScroll directly from here as it's in useEffect */}
          {dummyProducts.map((product, index) => (
            <ProductItemCard product={product} index={index} key={product.id} />
          ))}
        </CarouselWrapper>
        {showArrows && ( // Only render arrows if content overflows to begin with
          <>
            <NavArrow
              $direction="left"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              disabled={!canScrollLeft} // Disabled based on scroll state
            >
              <FaChevronLeft />
            </NavArrow>
            <NavArrow
              $direction="right"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              disabled={!canScrollRight} // Disabled based on scroll state
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
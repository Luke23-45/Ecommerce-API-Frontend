// src/components/CategoryExplorer/ContentCanvas.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import ProductCard, { type ProductData } from '../ProductCard/ProductCard';
import {
  ContentCanvasContainer,
  CategoryIntro,
  CategoryName,
  GoToLink,
  HotTagsContainer,
  HotTag,
  SliderWrapper,
  SlidesContainer,
  Slide,
  SliderNavArrow,
  SliderDots,
  Dot,
  HeroImageSlide,
  ProductGridContainer,
  ProductGridWrapper,
} from './ContentCanvas.styles';


// --- Demo Data for Categories and Products ---
interface CategoryContentData {
  id: string;
  categoryName: string;
  categoryLink: string;
  hotTags: string[];
  heroImages: string[];
  productGrid: ProductData[];
}

const getDemoImage = (seed: string, width: number, height: number, tags: string = '') =>
  `https://picsum.photos/seed/${seed.replace(/\s/g, '-')}/${width}/${height}/?${tags},home,interior,style,lifestyle`;

const demoCategoriesContent: CategoryContentData[] = [
  {
    id: 'living',
    categoryName: 'The Living Sanctuary',
    categoryLink: '#shop-living',
    hotTags: ['Comfort First', 'Sustainable Seating', 'Ambient Lighting', 'Organic Fabrics'],
    heroImages: [
      getDemoImage('living-hero-1', 1200, 400, 'living-room'),
      getDemoImage('living-hero-2', 1200, 400, 'sofa'),
      getDemoImage('living-hero-3', 1200, 400, 'fireplace'),
    ],
    productGrid: [
      { id: 'lv1', name: 'Cloud Comfort Sofa', price: 1800, image: getDemoImage('lv1', 400, 560, 'sofa'), link: '#p_lv1', isNew: true },
      { id: 'lv2', name: 'Marble Side Table', price: 350, image: getDemoImage('lv2', 400, 560, 'side-table'), link: '#p_lv2' },
      { id: 'lv3', name: 'Abstract Area Rug', price: 290, image: getDemoImage('lv3', 400, 560, 'rug'), link: '#p_lv3', isBestseller: true },
      { id: 'lv4', name: 'Velvet Lounge Chair', price: 680, image: getDemoImage('lv4', 400, 560, 'lounge-chair'), link: '#p_lv4', isNew: true },
      { id: 'lv5', name: 'Floor Lamp', price: 190, image: getDemoImage('lv5', 400, 560, 'floor-lamp'), link: '#p_lv5' },
      { id: 'lv6', name: 'Throw Pillow Set', price: 75, image: getDemoImage('lv6', 400, 560, 'pillow'), link: '#p_lv6', isBestseller: true },
      { id: 'lv7', name: 'Sculptural Bookshelf', price: 420, image: getDemoImage('lv7', 400, 560, 'bookshelf'), link: '#p_lv7' },
      { id: 'lv8', name: 'Soft Wool Blanket', price: 95, image: getDemoImage('lv8', 400, 560, 'blanket'), link: '#p_lv8', isNew: true },
      { id: 'lv9', name: 'Modern Console Table', price: 280, image: getDemoImage('lv9', 400, 560, 'console-table'), link: '#p_lv9' },
    ],
  },
  {
    id: 'dining',
    categoryName: 'Dining & Entertaining',
    categoryLink: '#shop-dining',
    hotTags: ['Host with Elegance', 'Solid Wood Tables', 'Artisanal Serveware', 'Minimalist Seating'],
    heroImages: [
      getDemoImage('dining-hero-1', 1200, 400, 'dining-room'),
      getDemoImage('dining-hero-2', 1200, 400, 'dining-table'),
      getDemoImage('dining-hero-3', 1200, 400, 'serveware'),
    ],
    productGrid: [
        { id: 'd1', name: 'Solid Oak Dining Table', price: 1200, image: getDemoImage('d1', 400, 560, 'oak-table'), link: '#p_d1' },
        { id: 'd2', name: 'Velvet Dining Chair (Set of 2)', price: 350, image: getDemoImage('d2', 400, 560, 'dining-chair'), link: '#p_d2' },
        { id: 'd3', name: 'Ceramic Dinnerware Set', price: 180, image: getDemoImage('d3', 400, 560, 'dinnerware'), link: '#p_d3', isNew: true },
        { id: 'd4', name: 'Glass Tumbler Set', price: 50, image: getDemoImage('d4', 400, 560, 'tumbler'), link: '#p_d4' },
        { id: 'd5', name: 'Linen Napkin Set', price: 40, image: getDemoImage('d5', 400, 560, 'napkin'), link: '#p_d5' },
        { id: 'd6', name: 'Wine Glasses (Set of 4)', price: 60, image: getDemoImage('d6', 400, 560, 'wine-glasses'), link: '#p_d6', isBestseller: true },
    ],
  },
  {
    id: 'bedroom',
    categoryName: 'Bedroom Serenity',
    categoryLink: '#shop-bedroom',
    hotTags: ['Pillow Top Mattresses', 'Calming Colors', 'Blackout Curtains', 'Plush Rugs'],
    heroImages: [
      getDemoImage('bedroom-hero-1', 1200, 400, 'bedroom'),
      getDemoImage('bedroom-hero-2', 1200, 400, 'bed'),
      getDemoImage('bedroom-hero-3', 1200, 400, 'minimalist-bedroom'),
    ],
    productGrid: [
        { id: 'b1', name: 'Organic Cotton Bedding', price: 280, image: getDemoImage('b1', 400, 560, 'bedding'), link: '#p_b1', isNew: true },
        { id: 'b2', name: 'Memory Foam Mattress', price: 900, image: getDemoImage('b2', 400, 560, 'mattress'), link: '#p_b2' },
        { id: 'b3', name: 'Minimalist Nightstand', price: 180, image: getDemoImage('b3', 400, 560, 'nightstand'), link: '#p_b3' },
        { id: 'b4', name: 'Soft Linen Duvet Cover', price: 150, image: getDemoImage('b4', 400, 560, 'duvet'), link: '#p_b4' },
        { id: 'b5', name: 'Aromatherapy Diffuser', price: 60, image: getDemoImage('b5', 400, 560, 'diffuser'), link: '#p_b5' },
        { id: 'b6', name: 'Velvet Pillowcases (Set of 2)', price: 45, image: getDemoImage('b6', 400, 560, 'pillowcase'), link: '#p_b6', isBestseller: true },
    ],
  },
  {
    id: 'lighting',
    categoryName: 'Ambient Lighting',
    categoryLink: '#shop-lighting',
    hotTags: ['Mood Setting', 'Modern Designs', 'Energy Efficient'],
    heroImages: [
      getDemoImage('lighting-hero-1', 1200, 400, 'lamps'),
      getDemoImage('lighting-hero-2', 1200, 400, 'chandeliers'),
    ],
    productGrid: [
        { id: 'l1', name: 'Sculptural Floor Lamp', price: 220, image: getDemoImage('l1', 400, 560, 'floor-lamp'), link: '#p_l1', isNew: true },
        { id: 'l2', name: 'Minimalist Table Lamp', price: 90, image: getDemoImage('l2', 400, 560, 'table-lamp'), link: '#p_l2' },
        { id: 'l3', name: 'Smart LED Bulb (Set of 2)', price: 40, image: getDemoImage('l3', 400, 560, 'bulb'), link: '#p_l3', isBestseller: true },
    ],
  },
  {
    id: 'art',
    categoryName: 'Art & Decor Collection',
    categoryLink: '#shop-art',
    hotTags: ['Unique Finds', 'Handcrafted', 'Conversation Pieces'],
    heroImages: [
      getDemoImage('art-hero-1', 1200, 400, 'art'),
      getDemoImage('art-hero-2', 1200, 400, 'decor'),
    ],
    productGrid: [
        { id: 'a1', name: 'Abstract Ceramic Sculpture', price: 150, image: getDemoImage('a1', 400, 560, 'sculpture'), link: '#p_a1', isNew: true },
        { id: 'a2', name: 'Hand-Painted Wall Art', price: 280, image: getDemoImage('a2', 400, 560, 'wall-art'), link: '#p_a2' },
        { id: 'a3', name: 'Textured Throw Pillow', price: 55, image: getDemoImage('a3', 400, 560, 'throw-pillow'), link: '#p_a3' },
    ],
  },
  {
    id: 'office',
    categoryName: 'Home Office Essentials',
    categoryLink: '#shop-office',
    hotTags: ['Ergonomic', 'Productive Spaces', 'Stylish Desks'],
    heroImages: [
      getDemoImage('office-hero-1', 1200, 400, 'home-office'),
      getDemoImage('office-hero-2', 1200, 400, 'desk-chair'),
    ],
    productGrid: [
        { id: 'o1', name: 'Ergonomic Desk Chair', price: 320, image: getDemoImage('o1', 400, 560, 'desk-chair'), link: '#p_o1', isBestseller: true },
        { id: 'o2', name: 'Minimalist Writing Desk', price: 550, image: getDemoImage('o2', 400, 560, 'writing-desk'), link: '#p_o2' },
        { id: 'o3', name: 'Desk Organizer Set', price: 70, image: getDemoImage('o3', 400, 560, 'organizer'), link: '#p_o3', isNew: true },
    ],
  },
  {
    id: 'outdoor',
    categoryName: 'Outdoor Living Redefined',
    categoryLink: '#shop-outdoor',
    hotTags: ['Durable Designs', 'Patio Furniture', 'Garden Accents'],
    heroImages: [
      getDemoImage('outdoor-hero-1', 1200, 400, 'outdoor-patio'),
      getDemoImage('outdoor-hero-2', 1200, 400, 'garden-furniture'),
    ],
    productGrid: [
        { id: 'ot1', name: 'All-Weather Patio Sofa', price: 900, image: getDemoImage('ot1', 400, 560, 'patio-sofa'), link: '#p_ot1' },
        { id: 'ot2', name: 'Outdoor Coffee Table', price: 280, image: getDemoImage('ot2', 400, 560, 'outdoor-table'), link: '#p_ot2', isBestseller: true },
        { id: 'ot3', name: 'Decorative Outdoor Planter', price: 80, image: getDemoImage('ot3', 400, 560, 'outdoor-planter'), link: '#p_ot3', isNew: true },
    ],
  },
  {
    id: 'wellness',
    categoryName: 'Wellness & Comfort',
    categoryLink: '#shop-wellness',
    hotTags: ['Self-Care', 'Aromatherapy', 'Cozy Spaces'],
    heroImages: [
      getDemoImage('wellness-hero-1', 1200, 400, 'spa-home'),
      getDemoImage('wellness-hero-2', 1200, 400, 'candle-relax'),
    ],
    productGrid: [
        { id: 'w1', name: 'Aromatherapy Diffuser Pro', price: 75, image: getDemoImage('w1', 400, 560, 'diffuser'), link: '#p_w1', isNew: true },
        { id: 'w2', name: 'Organic Bath Towel Set', price: 90, image: getDemoImage('w2', 400, 560, 'bath-towel'), link: '#p_w2' },
        { id: 'w3', name: 'Silk Sleep Mask', price: 35, image: getDemoImage('w3', 400, 560, 'sleep-mask'), link: '#p_w3', isBestseller: true },
    ],
  },
];


// --- Generic Slider Component (Reusable) ---
// This component needs to be separate to work as a generic slider
// It takes slides (either image URLs for hero or arrays of ProductData for grid pages)
interface GenericSliderProps {
  slides: (string | ProductData[])[]; // Can be string URLs or arrays of ProductData (for grid)
  interval?: number; // Auto-slide interval in ms, 0 for no auto-slide
  sliderHeight?: string; // Optional fixed height for image sliders
  ProductCardComponent?: React.ComponentType<{ product: ProductData; index?: number }>; // Pass ProductCard from Shared or custom
}

const GenericSlider: React.FC<GenericSliderProps> = ({
  slides,
  interval = 0,
  sliderHeight,
  ProductCardComponent = ProductCard, // Default to the shared ProductCard
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesRef = useRef<HTMLDivElement>(null);
  const totalSlides = slides.length;

  // Auto-slide functionality
  useEffect(() => {
    if (interval > 0 && totalSlides > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [interval, totalSlides]);

  // Sync scroll position with currentSlide state
  useEffect(() => {
    if (slidesRef.current) {
      // Ensure smooth scroll to target position
      slidesRef.current.scrollTo({
        left: currentSlide * slidesRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Update slide index on manual scroll (e.g., drag)
  const handleScroll = useCallback(() => {
    if (slidesRef.current) {
        const scrollLeft = slidesRef.current.scrollLeft;
        const slideWidth = slidesRef.current.clientWidth;
        // Calculate the closest slide index based on scroll position
        // Only update if it's a significant change, not on every tiny scroll event
        const newIndex = Math.round(scrollLeft / slideWidth);
        if (newIndex !== currentSlide) {
            setCurrentSlide(newIndex);
        }
    }
  }, [currentSlide]);

  return (
    <SliderWrapper style={{ height: sliderHeight, animationDelay: `0.3s` } as React.CSSProperties}> {/* Initial slide-in animation */}
      <SlidesContainer ref={slidesRef} onScroll={handleScroll}>
        {slides.map((slideItem, slideIndex) => (
          <Slide key={slideIndex}>
            {typeof slideItem === 'string' ? ( // If it's a string, render as HeroImageSlide
              <HeroImageSlide>
                <img src={slideItem} alt={`Category slide ${slideIndex + 1}`} loading="lazy" />
              </HeroImageSlide>
            ) : ( // If it's an array of ProductData (for grid)
                <ProductGridWrapper>
                  {(slideItem as ProductData[]).map((product, productIndex) => (
                      <ProductCardComponent product={product} key={product.id} index={productIndex} />
                  ))}
                </ProductGridWrapper>
            )}
          </Slide>
        ))}
      </SlidesContainer>
      
      {totalSlides > 1 && (
        <>
          <SliderNavArrow $direction="left" onClick={prevSlide} aria-label="Previous slide">
            <FaChevronLeft />
          </SliderNavArrow>
          <SliderNavArrow $direction="right" onClick={nextSlide} aria-label="Next slide">
            <FaChevronRight />
          </SliderNavArrow>
        </>
      )}

      {totalSlides > 1 && (
        <SliderDots>
          {slides.map((_, index) => (
            <Dot
              key={index}
              $isActive={currentSlide === index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </SliderDots>
      )}
    </SliderWrapper>
  );
};


// --- Content Canvas Component (Main Right Column) ---
interface ContentCanvasProps {
  activeCategory: string; // ID of the currently selected category
}

const ContentCanvas: React.FC<ContentCanvasProps> = ({ activeCategory }) => {
  const currentCategoryData = demoCategoriesContent.find(cat => cat.id === activeCategory);

  if (!currentCategoryData) {
    return (
        <ContentCanvasContainer key={activeCategory} style={{animationDelay: '0s'} as React.CSSProperties}>
            <p style={{textAlign: 'center', padding: '20px'}}>Select a category from the left.</p>
        </ContentCanvasContainer>
    ); // Fallback
  }

  // Slice productGrid into groups of 6 for 2x3 grid slides
  const productGridSlides: ProductData[][] = [];
  for (let i = 0; i < currentCategoryData.productGrid.length; i += 6) {
    productGridSlides.push(currentCategoryData.productGrid.slice(i, i + 6));
  }

  return (
    <ContentCanvasContainer key={currentCategoryData.id}> {/* Key forces re-render/animation on category change */}
      <CategoryIntro>
        <CategoryName style={{ '--animation-delay': '0s' } as React.CSSProperties}>
            {currentCategoryData.categoryName}
        </CategoryName>
        <GoToLink href={currentCategoryData.categoryLink} style={{ '--animation-delay': '0.1s' } as React.CSSProperties}>
            Explore All in {currentCategoryData.categoryName}
        </GoToLink>
        <HotTagsContainer>
          {currentCategoryData.hotTags.map((tag, index) => (
            <HotTag key={index} style={{ '--animation-delay': `${0.2 + index * 0.05}s` } as React.CSSProperties}>
              {tag}
            </HotTag>
          ))}
        </HotTagsContainer>
      </CategoryIntro>

      {/* Hero Image Slider Section */}
      <GenericSlider slides={currentCategoryData.heroImages} interval={5000} sliderHeight="400px" />

      {/* Product Grid Slider Section */}
      <ProductGridContainer>
        <GenericSlider slides={productGridSlides} interval={0} sliderHeight="auto" />
      </ProductGridContainer>
    </ContentCanvasContainer>
  );
};

export default ContentCanvas;
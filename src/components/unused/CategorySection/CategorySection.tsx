// src/components/CategorySection/CategorySection.tsx
import React, { useRef, useState, useEffect, forwardRef } from 'react'; // Import forwardRef
// import ProductCard, { ProductData } from '../../Shared/ProductCard/ProductCard';
import ProductCard, { type ProductData } from '../../home/ProductCard/ProductCard';
import {
  StyledCategorySection,
  CategoryTitle,
  ProductsGrid,
  ViewAllLink,
} from './CategorySection.styles';

interface CategorySectionProps {
  id: string;
  title: string;
  link: string;
  products: ProductData[];
  isIntersecting: boolean; // Prop from Intersection Observer
  animationDelay: number; // For staggered section appearance
}

// Wrap CategorySection in forwardRef to allow parent to pass refs
const CategorySection = forwardRef<HTMLDivElement, CategorySectionProps>(
  ({ id, title, link, products, isIntersecting, animationDelay }, ref) => {
    
    // For products' individual staggered animation on section entry
    const [sectionIsVisible, setSectionIsVisible] = useState(false);

    useEffect(() => {
        if (isIntersecting && !sectionIsVisible) {
            setSectionIsVisible(true);
        }
    }, [isIntersecting, sectionIsVisible]);


    return (
      <StyledCategorySection
          id={id}
          ref={ref} // Assign the forwarded ref here
          $isIntersecting={isIntersecting} // Passed to styles for section level animation
          style={{ '--section-animation-delay': `${animationDelay}ms` } as React.CSSProperties}
      >
        <CategoryTitle $isIntersecting={isIntersecting}>
          {title}
        </CategoryTitle>
        <ProductsGrid $isIntersecting={isIntersecting}> {/* Pass isIntersecting down to trigger product grid animations */}
          {products.slice(0, 3).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              style={{ '--card-animation-delay': `${animationDelay + (index * 100)}ms` } as React.CSSProperties} // Combined delay
              // No onClick here, as ProductCard has its own. If you want to customize it, pass it.
            />
          ))}
        </ProductsGrid>
        <ViewAllLink href={link} $isIntersecting={isIntersecting}>
          View All {title} Products
        </ViewAllLink>
      </StyledCategorySection>
    );
  }
);

export default CategorySection;
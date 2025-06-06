// src/components/BecomeAPartnerPage/TestimonialCard/TestimonialCard.tsx
import React from 'react';

// Import styled components
import {
  TestimonialCardWrapper,
  QuotationMark,
  TestimonialQuote,
  Attribution,
  PartnerImage,
  PartnerInfo,
  PartnerName,
  PartnerBrand,
} from './TestimonialCard.styles'; 

export interface TestimonialData {
  id: string; // Or number
  quote: string;
  authorName: string;
  authorRoleOrBrand: string;
  imageUrl?: string; // Optional image for the author/brand
}

interface TestimonialCardProps {
  testimonial: TestimonialData;
  animationDelay?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, animationDelay }) => {
  return (
    <TestimonialCardWrapper $animationDelay={animationDelay}>
      <QuotationMark>“</QuotationMark>
      <TestimonialQuote>
        <p>{testimonial.quote}</p>
      </TestimonialQuote>
      <Attribution>
        {testimonial.imageUrl && (
          <PartnerImage src={testimonial.imageUrl} alt={`Photo of ${testimonial.authorName}`} />
        )}
        <PartnerInfo>
          <PartnerName>{testimonial.authorName}</PartnerName>
          <PartnerBrand>{testimonial.authorRoleOrBrand}</PartnerBrand>
        </PartnerInfo>
      </Attribution>
    </TestimonialCardWrapper>
  );
};

export default TestimonialCard;
// src/components/BecomeAPartnerPage/PathwayCard/PathwayCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation on CTA click

// Import styled components
import {
  PathwayCardWrapper,
  PathwayIconAndTitle,
  PathwayIconContainer,
  PathwayTitle,
  PathwayDescription,
  SectionSubHeading,
  HighlightsList,
  FeesList,
  PathwayCtaButtonWrapper,
} from './PathwayCard.styles';

// Assuming PrimaryCtaButton is a shared component or defined in BecomeAPartnerPage.styles.ts
// If it's from page styles, you might need to import it or re-style button here.
// For this example, assuming a generic button can be styled or it uses theme.
import { PrimaryCtaButton } from '../../../pages/BecomeAPartnerPage/BecomeAPartnerPage.styles'; // Adjust path to main page styles or your common button

interface PathwayCardProps {
  pathway: {
    title: string;
    iconComponent: React.ElementType; // Expecting the icon component itself, e.g., FaPalette
    description: string;
    highlights: string[];
    fees: {
      subscription: string;
      commission: string;
      listing?: string;     // Optional for individual
      benefits?: string;    // Optional for vendor
    };
    cta: string;
    link: string;
  };
  isFeatured?: boolean; // To give one card slightly different styling if desiredTestimonialCard
  animationDelay?: string;
}

const PathwayCard: React.FC<PathwayCardProps> = ({ pathway, isFeatured, animationDelay }) => {
  const navigate = useNavigate();
  const Icon = pathway.iconComponent; // Icon component to render

  const handleNavigate = () => {
    navigate(pathway.link);
  };

  return (
    <PathwayCardWrapper $isFeatured={isFeatured} $animationDelay={animationDelay}>
      <PathwayIconAndTitle>
        <PathwayIconContainer $isFeatured={isFeatured}>
          <Icon />
        </PathwayIconContainer>
        <PathwayTitle>{pathway.title}</PathwayTitle>
      </PathwayIconAndTitle>

      <PathwayDescription>{pathway.description}</PathwayDescription>

      <SectionSubHeading>Key Features</SectionSubHeading>
      <HighlightsList>
        {pathway.highlights.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </HighlightsList>

      <SectionSubHeading>Fees & Terms (Example)</SectionSubHeading>
      <FeesList>
        <p><em>Subscription:</em> {pathway.fees.subscription}</p>
        <p><em>Commission:</em> {pathway.fees.commission}</p>
        {pathway.fees.listing && <p><em>Listing:</em> {pathway.fees.listing}</p>}
        {pathway.fees.benefits && <p><em>Benefits:</em> {pathway.fees.benefits}</p>}
      </FeesList>
      
      <PathwayCtaButtonWrapper>
        <PrimaryCtaButton 
            onClick={handleNavigate} 
            style={{width: '100%'}}
            $isOutline={!isFeatured} // Example: featured card gets solid button, other is outline
        >
          {pathway.cta}
        </PrimaryCtaButton>
      </PathwayCtaButtonWrapper>
    </PathwayCardWrapper>
  );
};

export default PathwayCard;
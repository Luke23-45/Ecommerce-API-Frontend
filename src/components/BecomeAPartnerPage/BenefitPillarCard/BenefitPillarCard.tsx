// src/components/BecomeAPartnerPage/BenefitPillarCard/BenefitPillarCard.tsx
import React from 'react';
import {
  PillarCardWrapper,
  PillarIconContainer,
  PillarTitle,
  PillarDescription,
} from './BenefitPillarCard.styles'; // Adjust path as needed

interface BenefitPillarCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  animationDelay?: string; // For staggered entrance of the card
}

const BenefitPillarCard: React.FC<BenefitPillarCardProps> = ({ 
  icon, 
  title, 
  description, 
  animationDelay 
}) => {
  return (
    <PillarCardWrapper $animationDelay={animationDelay}>
      <PillarIconContainer className="pillar-icon-container">
        {icon}
      </PillarIconContainer>
      <PillarTitle>{title}</PillarTitle>
      <PillarDescription>{description}</PillarDescription>
    </PillarCardWrapper>
  );
};

export default BenefitPillarCard;
// src/components/BecomeAPartnerPage/HeroPartnerSection/HeroPartnerSection.tsx
import React, { useMemo } from 'react';
import { useTheme } from 'styled-components'; // For accessing theme vars if needed in logic (rare for this)
import {
  HeroWrapper,
  HeroTextContent,
  HeroHeadline,
  HeroSubheadline,
  HeroCtaButton,
  // ParticlesOverlay, Particle, // If implementing JS based particles
} from './HeroPartnerSection.styles';

interface HeroPartnerSectionProps {
  headlineMain: string;
  headlineEmphasis?: string; // For a highlighted word like "Élan"
  tagline?: string; // Your previous "subheadlineAddition"
  description: string;
  ctaText: string;
  onCtaClick: () => void; // Callback for CTA button
  backgroundImageUrl?: string; // Optional background image
}

const HeroPartnerSection: React.FC<HeroPartnerSectionProps> = ({
  headlineMain,
  headlineEmphasis,
  tagline,
  description,
  ctaText,
  onCtaClick,
  backgroundImageUrl,
}) => {
  const theme = useTheme(); // Access theme if needed for dynamic styles or logic

  // For the optional particle effect - this would be more complex in a real implementation
  const particles = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    duration: Math.random() * 20 + 20, // 20-40s
    delay: Math.random() * -20,       // Stagger start times
    left: Math.random() * 100,        // %
    drift: Math.random() * 10 - 5,    // vw
    rotate: Math.random() * 180 -90,  // deg
    size: Math.random() * 1.5 + 0.5,    // px
  })), []);

  return (
    <HeroWrapper $bgImage={backgroundImageUrl}>
      {/* Optional: Particle Overlay Div if rendering particles via JS/React */}
      <div className="particles-overlay">
        {particles.map(p => (
          <div 
            key={p.id}
            className="particle"
            style={{
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              // @ts-ignore
              '--particle-drift': `${p.drift}`,
              '--particle-rotate': `${p.rotate}`
            }}
          />
        ))}
      </div>
      <HeroTextContent>
        <HeroHeadline>
          {headlineEmphasis ? <span className="highlight">{headlineEmphasis}</span> : ''}
          {headlineMain}
          {tagline && (
            <span style={{ // Style for the tagline part of the headline
              display: 'block',
              fontSize: '0.6em', // Relative to main headline
              fontWeight: theme.typography.heading.weights.regular,
              letterSpacing: '0.01em',
              opacity: 0.85,
              marginTop: theme.spacing(1.5),
            }}>
              {tagline}
            </span>
          )}
        </HeroHeadline>
        <HeroSubheadline>{description}</HeroSubheadline>
        <HeroCtaButton onClick={onCtaClick}>
          {ctaText}
        </HeroCtaButton>
      </HeroTextContent>
    </HeroWrapper>
  );
};

export default HeroPartnerSection;
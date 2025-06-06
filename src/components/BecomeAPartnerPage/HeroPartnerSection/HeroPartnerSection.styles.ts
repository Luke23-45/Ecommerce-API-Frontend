// src/components/BecomeAPartnerPage/HeroPartnerSection/HeroPartnerSection.styles.ts
import styled, { keyframes, css } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes for Animations ---
const gradientMeshAnimation = keyframes`
  0% { background-position: 0% 50%, 10% 30%, 20% 70%; }
  25% { background-position: 100% 50%, 70% 10%, 50% 40%; }
  50% { background-position: 50% 100%, 30% 60%, 0% 20%; }
  75% { background-position: 100% 0%, 70% 80%, 50% 50%; }
  100% { background-position: 0% 50%, 10% 40%, 20% 30%; }
`;

const heroTextFadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const subtleParticleFloat = keyframes`
  0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
  20% { opacity: 0.03; } /* Very subtle initial opacity */
  80% { opacity: 0.03; }
  100% { transform: translateY(-100vh) rotate(var(--particle-rotate, 45deg)) translateX(var(--particle-drift, 0px)); opacity: 0; }
`;

// --- Hero Section Wrapper ---
export const HeroWrapper = styled.section<{ $bgImage?: string }>`
  min-height: 75vh; // Ensure substantial height
  max-height: 900px; // Cap height on very large screens
  padding: ${({ theme }) => theme.spacing(12)} ${({ theme }) => theme.containerPadding};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden; // Crucial for pseudo-elements and layers
  color: ${({ theme }) => theme.colors.textLight}; // Default text color for hero content

  /* Layer 1: Base Image (Optional, can be just dark color if mesh is prominent) */
  ${({ $bgImage }) => $bgImage && css`
    background-image: url(${$bgImage});
    background-size: cover;
    background-position: center center; // Or center 30% as before
    &::after { /* Darkening tint directly on image if mesh is semi-transparent */
      content: '';
      position: absolute;
      inset: 0;
      background-color: ${rgba(0,0,0, 0.3)}; // Adjust tint opacity
      z-index: 0;
    }
  `}
  /* Fallback base color if no image */
  background-color: ${({ theme }) => darken(0.45, theme.colors.primaryNeutral)}; // Dark, warm base

  /* Layer 2: Animated Gradient Mesh (Inspired by your VisualColumn) */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1; // Above base image/color, below text contrast overlay

    /* Using subtle, thematic colors for the mesh for Élan */
    background-image: 
      linear-gradient(315deg,
        ${({ theme }) => transparentize(0.6, lighten(0.1, theme.colors.accent1 || '#A46E4A'))}, /* Lighter terracotta */
        ${({ theme }) => transparentize(0.7, theme.colors.accent2 || '#8DA382')}, /* Muted sage */
        ${({ theme }) => transparentize(0.85, theme.colors.primaryNeutral || '#F8F5F2')}  /* Warm off-white hint */
      ),
      linear-gradient(45deg,
        ${({ theme }) => transparentize(0.65, theme.colors.accent2 || '#8DA382')},
        ${({ theme }) => transparentize(0.75, darken(0.05, theme.colors.accent1 || '#A46E4A'))}, /* Slightly darker terracotta */
        ${({ theme }) => transparentize(0.8, theme.colors.lightGray || '#E9E9E9')} /* Subtle grey hint */
      ),
      linear-gradient(135deg,
        ${({ theme }) => transparentize(0.7, theme.colors.accent1Vibrant || '#C38A70')}, /* More vibrant terracotta if available */
        ${({ theme }) => transparentize(0.8, theme.colors.accent2Vibrant || '#B2C8A8')}, /* More vibrant sage if available */
        ${({ theme }) => transparentize(0.9, darken(0.2, theme.colors.textDark || '#302D2A'))} /* Deep subtle anchor */
      );
              
    background-blend-mode: overlay; // 'overlay' or 'soft-light' for ethereal mesh
    background-size: 280% 280%, 240% 240%, 300% 300%;
    animation: ${gradientMeshAnimation} 30s ease-in-out infinite alternate;
    filter: blur(10px) brightness(1.1); // Adjust brightness/blur for desired effect
    opacity: 0.55; // Adjust mesh opacity
  }

  /* Optional Particle Layer (if desired and performant) */
  /* For many distinct particles, render SVGs or divs in TSX. For CSS only: */
  .particles-overlay { /* This would be an empty div positioned absolutely */
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    z-index: 2; /* Above mesh, below text contrast overlay */
  }

  .particle { /* Individual particle (multiple would be rendered in TSX) */
    position: absolute;
    bottom: -20px; /* Start off-screen */
    background-color: ${({ theme }) => transparentize(0.7, theme.colors.textLight)};
    border-radius: 50%;
    animation: ${subtleParticleFloat} linear infinite;
    /* Size and animation duration/delay set in TSX */
  }
`;

// --- Hero Content Wrapper (Text & CTA) ---
export const HeroTextContent = styled.div`
  position: relative;
  z-index: 3; // Ensures text is above all background layers
  max-width: 850px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const HeroHeadline = styled.h1`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; /* Playfair Display */
  font-size: clamp(2.8rem, 7vw, 5.2rem); /* Impactful and responsive */
  font-weight: ${({ theme }) => theme.typography.heading.weights.extraBold};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  text-shadow: 0 3px 15px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.5); /* Stronger text shadow */
  
  opacity: 0; // Initial state for animation
  animation: ${heroTextFadeInUp} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;

  .highlight { /* For "Élan" or key parts of the headline */
    color: ${({ theme }) => theme.colors.accent1Vibrant || theme.colors.accent1}; // Or a distinct light accent
    /* filter: brightness(1.2); */ // Optional highlight effect
  }
`;

export const HeroSubheadline = styled.h2` // Changed to h2 for better semantics than p.subtitle
  font-family: ${({ theme }) => theme.typography.body.fontFamily}; /* Inter */
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  line-height: 1.7;
  color: ${({ theme }) => transparentize(0.1, theme.colors.textLight)};
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  font-weight: ${({ theme }) => theme.typography.body.weights.regular};
  max-width: 700px; // Constrain width of subheadline

  opacity: 0; // Initial state for animation
  animation: ${heroTextFadeInUp} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards;
`;

// CTA Button - can reuse PrimaryCtaButton from BecomeAPartnerPage.styles if imported, or style uniquely
export const HeroCtaButton = styled.button`
  /* Using PrimaryCtaButton styles from BecomeAPartnerPage for consistency */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(3.5)} ${({ theme }) => theme.spacing(7)}; /* Larger CTA padding */
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.medium}; /* Larger text */
  font-weight: ${({ theme }) => theme.typography.body.weights.bold}; /* Bolder for CTA */
  letter-spacing: 0.8px;
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 2px solid transparent; /* Increased border thickness for prominence */
  min-width: 260px; 
  text-decoration: none;

  /* Style for primary button appearance, using light text on darker Élan accent */
  background-color: ${({ theme }) => theme.colors.accent1Vibrant || theme.colors.accent1};
  color: ${({ theme }) => theme.colors.textLight};
  border-color: ${({ theme }) => theme.colors.accent1Vibrant || theme.colors.accent1};
  box-shadow: ${({ theme }) => theme.shadows.md}, 0 0 20px ${({theme}) => transparentize(0.7, theme.colors.accent1Vibrant || theme.colors.accent1)}; // Added glow

  opacity: 0; // Initial state for animation
  animation: ${heroTextFadeInUp} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.7s forwards;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => darken(0.08, theme.colors.accent1Vibrant || theme.colors.accent1)};
    border-color: ${({ theme }) => darken(0.08, theme.colors.accent1Vibrant || theme.colors.accent1)};
    transform: translateY(-3px) scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows.lg}, 0 0 30px ${({theme}) => transparentize(0.6, theme.colors.accent1Vibrant || theme.colors.accent1)};
  }
  &:active:not(:disabled) {
    transform: translateY(-1px) scale(1);
  }
  &:disabled { /* Standard disabled styles */ 
      opacity: 0.6; cursor: not-allowed; 
      background-color: ${({theme}) => theme.colors.mediumGray};
      border-color: ${({theme}) => theme.colors.mediumGray};
      box-shadow: none;
  }
   &:focus-visible {
    outline: none;
    border-color: ${({theme}) => theme.colors.textLight}; // Contrasting focus border on dark button
    box-shadow: 0 0 0 3px ${({theme}) => theme.colors.accent1Vibrant || theme.colors.accent1};
  }
`;
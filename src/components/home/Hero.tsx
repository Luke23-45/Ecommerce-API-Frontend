// src/components/Hero.js
import React from "react";
import styled, { keyframes } from "styled-components";

// Placeholder image - replace with your own or use a local one from src/assets
const HeroImage =
  "https://images.unsplash.com/photo-1517457210878-a28a34b2f4f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1ODU2MjN8MHwxfHNlYXJjaHw1Nnx8bHV4dXJ5JTIwZWMvb21tZXJjZSUyMGZhc2hpb258ZW58MHx8fHwxNzA5NjM2OTYwfDA&ixlib=rb-4.0.3&q=80&w=1920";
// Or use local: import HeroImage from '../assets/hero-image.jpg';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroContainer = styled.section`
  position: relative;
  width: 100%;
  height: 600px; /* Adjust height as needed for aesthetic impact */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* Ensure content doesn't spill out */

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    height: 500px;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 400px;
  }
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-position: center;
  filter: brightness(
    0.85
  ); /* Slightly dim the background for text readability */
  transition: transform ${(props) => props.theme.transitions.slow}; /* Smooth parallax effect on scroll */

  /* Optional: Parallax-like effect (requires JS to update transform based on scroll) */
  /* For now, just a static background */
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 10; /* Ensure content is above background */
  color: ${(props) =>
    props.theme.colors.textLight}; /* White text for contrast */
  text-align: center;
  padding: ${(props) => props.theme.spacing.xl};
  max-width: 800px; /* Constrain text width */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); /* Add subtle text shadow for readability */
`;

const Headline = styled.h1`
  font-size: 3.8rem;
  font-weight: 700;
  margin-bottom: ${(props) => props.theme.spacing.md};
  color: ${(props) => props.theme.colors.textLight};
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.3s;
  opacity: 0; /* Start hidden for animation */

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: 3rem;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 2.2rem;
  }
`;

const SubHeadline = styled.p`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 1.3rem;
  margin-bottom: ${(props) => props.theme.spacing.xl};
  color: ${(props) => props.theme.colors.textLight};
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.6s;
  opacity: 0;

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: 1.1rem;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const PrimaryButton = styled.a`
  display: inline-block;
  background-color: ${(props) =>
    props.theme.colors.primary}; /* Deep Teal button */
  color: ${(props) => props.theme.colors.textLight};
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 1.1rem;
  font-weight: 700;
  padding: ${(props) => props.theme.spacing.md}
    ${(props) => props.theme.spacing.xxl};
  border-radius: 50px; /* Pill shape */
  box-shadow: ${(props) => props.theme.shadows.medium};
  transition: all ${(props) => props.theme.transitions.medium};
  animation: ${fadeIn} 1s ease-out forwards;
  animation-delay: 0.9s;
  opacity: 0;

  &:hover {
    background-color: ${(props) =>
      props.theme.colors.tertiary}; /* Warm gold on hover */
    transform: translateY(-3px);
    box-shadow: ${(props) => props.theme.shadows.large};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    font-size: 1rem;
    padding: ${(props) => props.theme.spacing.sm}
      ${(props) => props.theme.spacing.xl};
  }
`;

const Hero = () => {
  return (
    <HeroContainer>
      <HeroBackground backgroundImage={HeroImage} />
      <HeroContent>
        <Headline>Discover Unrivaled Elegance</Headline>
        <SubHeadline>
          Curated collections designed to elevate your everyday and celebrate
          your unique style.
        </SubHeadline>
        <PrimaryButton href="/shop-new-arrivals">
          Shop the New Collection
        </PrimaryButton>
      </HeroContent>
    </HeroContainer>
  );
};

export default Hero;

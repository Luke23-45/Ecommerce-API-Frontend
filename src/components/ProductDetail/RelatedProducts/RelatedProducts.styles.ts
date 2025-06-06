// src/components/ProductPage/RelatedProducts/RelatedProducts.styles.ts
import styled, { type DefaultTheme, keyframes } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes ---
const sectionFadeInSlightUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Wrapper ---
export const RelatedProductsWrapper = styled.section<{ theme: DefaultTheme }>`
  margin-top: ${(props) => props.theme.spacing(12)}; 
  padding-top: ${(props) => props.theme.spacing(8)};
  border-top: 1px solid ${(props) => props.theme.colors.lightGray};
  animation: ${sectionFadeInSlightUp} 0.7s ease-out 0.2s forwards;
  opacity: 0;

`;

// --- Section Title ---
export const RelatedProductsTitle = styled.h2<{ theme: DefaultTheme }>`
  font-family: ${(props) => props.theme.typography.heading.fontFamily};
  font-size: ${(props) => props.theme.typography.heading.sizes.h3}; 
  font-weight: 800;
  line-height: 1.5;
  letter-spacing: 0.2px;
  color: ${(props) => props.theme.colors.textDark};
  text-align: center; 
  margin-bottom: ${(props) => props.theme.spacing(8)}; /* Increased space for better visual break */

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    font-size: ${(props) => props.theme.typography.heading.sizes.h4}; 
    margin-bottom: ${(props) => props.theme.spacing(6)};
  }
`;

// --- Product Slider/Carousel Container ---
export const ProductSliderWrapper = styled.div<{ theme: DefaultTheme }>`

  position: relative;
  overflow: hidden;
  margin-left: -${(props) => props.theme.containerPadding}; 
  margin-right: -${(props) => props.theme.containerPadding};
  padding-left: ${(props) => props.theme.containerPadding}; 
  padding-right: ${(props) => props.theme.containerPadding};
  padding-bottom: ${(props) => props.theme.spacing(8)}; 
`;

export const ProductSlidesContainer = styled.div<{ 
  theme: DefaultTheme; 
  $totalWidthPercent: number; // Total width of the track (e.g., 300% for 3 pages)
  $translateXPercent: number; // Current X translation percentage
}>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  transform: translateX(-${(props) => props.$translateXPercent}%);
  transition: transform 0.65s cubic-bezier(0.455, 0.030, 0.515, 0.955); 
  margin-left: -65px;

`;

export const ProductSlide = styled.div<{ theme: DefaultTheme; $slideWidthPercent: number }>`
  flex: 0 0 ${(props) => props.$slideWidthPercent}%; 
  width: ${(props) => props.$slideWidthPercent}%;
  padding: 0 ${(props) => props.theme.spacing(2.5)}; /* Gap between product cards */
  box-sizing: border-box;

  & > * { /* Assuming direct child is ProductCard */
    height: 100%; /* Make ProductCard take full height of slide if needed for alignment */
  }
`;

// Navigation Arrows for Product Slider
export const ProductSliderArrow = styled.button<{ 
  theme: DefaultTheme; 
  $direction: 'left' | 'right'; 
  $isHidden?: boolean 
}>`
  position: absolute;
  top: 45%; /* Adjust to vertically center with product cards, may need JS if card height is dynamic */
  transform: translateY(-50%);
  
  /* Position arrows within the container padding but outside the card track */
  ${props => props.$direction === 'left' ? 
    `left: calc(${props.theme.containerPadding} - ${props.theme.spacing(8)});` : // Move further out
    `right: calc(${props.theme.containerPadding} - ${props.theme.spacing(8)});`}

  background-color: ${(props) => transparentize(0.15, props.theme.colors.adminSurface)};
  backdrop-filter: blur(5px);
  border: 1px solid ${(props) => props.theme.colors.lightGray};
  border-radius: 50%;
  width: 46px; 
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.textDark};
  font-size: 17px;
  cursor: pointer;
  z-index: 10;
  opacity: ${(props) => props.$isHidden ? 0 : 0}; /* Start hidden, show on wrapper hover */
  pointer-events: ${(props) => props.$isHidden ? 'none' : 'auto'};
  transition: all 0.2s ease-out;
  box-shadow: ${(props) => props.theme.shadows.subtle};

  ${ProductSliderWrapper}:hover & {
      opacity: 0.9; /* More visible on hover */
  }
  
  &:hover:not(:disabled) {
    background-color: ${(props) => props.theme.colors.accent1};
    color: ${(props) => props.theme.colors.textLight};
    border-color: transparent;
    transform: translateY(-50%) scale(1.03);
  }
  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.98);
  }
  &:disabled { 
    opacity: 0 !important; 
    cursor: default; 
  }

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    width: 40px; height: 40px; font-size: 15px;
    ${props => props.$direction === 'left' ? `left: ${props.theme.spacing(1)};` : `right: ${props.theme.spacing(1)};`}
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
     display: none; 
  }
`;

export const SliderDots = styled.div<{ theme: DefaultTheme }>`
    display: flex;
    justify-content: center;
    align-items: center; 
    gap: ${(props) => props.theme.spacing(1.5)};
    /* Position dots below the slider, relative to ProductSliderWrapper */
    position: absolute; /* Changed from relative if inside wrapper that isn't full width */
    bottom: ${(props) => props.theme.spacing(1.5)}; /* Position at bottom of ProductSliderWrapper */
    left: 50%;
    transform: translateX(-50%);
    z-index: 5; /* Below arrows if arrows overlap dots */
    padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(2)};
    background-color: ${(props) => transparentize(0.3, props.theme.colors.textDark)};
    border-radius: ${(props) => props.theme.borderRadius.pill};
    opacity: 0; /* Show on SliderWrapper hover only if desired, or always visible */
    transition: opacity 0.3s ease-out;

    ${ProductSliderWrapper}:hover & {
        opacity: 0.85;
    }
`;

export const Dot = styled.button<{ theme: DefaultTheme; $isActive: boolean }>`
    width: 9px; /* Slightly larger dots */
    height: 9px;
    border-radius: 50%;
    background-color: ${(props) => props.$isActive ? props.theme.colors.textLight : transparentize(0.6, props.theme.colors.textLight)};
    border: 1px solid ${(props) => props.$isActive ? props.theme.colors.textLight : 'transparent'};
    cursor: pointer;
    transition: background-color 0.25s ease-out, transform 0.2s ease-out, border-color 0.25s ease-out;
    padding: 0;

    &:hover {
      transform: scale(1.2);
      background-color: ${(props) => props.$isActive ? props.theme.colors.textLight : transparentize(0.4, props.theme.colors.textLight)};
    }
`;
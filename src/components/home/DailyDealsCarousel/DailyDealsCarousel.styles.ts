// src/components/HomePage/DailyDealsCarousel/DailyDealsCarousel.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

const fadeInSlight = keyframes`
  from { opacity: 0.8; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;


export const DealsSectionWrapper = styled.section<{ theme: DefaultTheme }>`
  padding: ${(props) => props.theme.spacing(8)} 0 ${(props) => props.theme.spacing(10)} 0;
  background-color: ${(props) => props.theme.colors.primaryNeutral}; 
`;

export const DealsContentLimiter = styled.div<{ theme: DefaultTheme }>`
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.containerPadding};
`;


export const DealsHeader = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing(5)};

  h2.section-title { 
    font-family: ${({ theme }) => theme.typography.body.fontFamily}; 
    font-size: clamp(1.5rem, 3.5vw, 2.2rem); 
    font-weight: ${({ theme }) => theme.typography.body.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0;
    line-height: 1.2;
    
    .highlight {
      color: ${(props) => props.theme.colors.accent1}; 
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    h2.section-title { font-size: clamp(1.3rem, 4vw, 1.8rem); }
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${(props) => props.theme.spacing(3)};
    margin-bottom: ${(props) => props.theme.spacing(4)};
  }
`;


export const CarouselNavigationControls = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing(2)};
`;

export const PageIndicator = styled.span<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.typography.body.weights.regular}; 
  min-width: 30px; 
  text-align: right; 
`;

export const DealCarouselArrow = styled.button<{ theme: DefaultTheme; $isHidden?: boolean }>`
  background-color: ${(props) => props.theme.colors.adminSurface}; 
  border: 1px solid ${(props) => props.theme.colors.lightGray};
  color: ${(props) => props.theme.colors.darkGray};
  width: 34px; 
  height: 34px;
  border-radius: ${({theme}) => theme.borderRadius.medium}; 
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-out;
  font-size: 0.8rem;
  opacity: ${(props) => (props.$isHidden ? 0.3 : 1)};
  pointer-events: ${(props) => (props.$isHidden ? 'none' : 'auto')};
  box-shadow: 0 1px 2px ${rgba(0,0,0,0.05)};

  &:hover:not(:disabled) {
    border-color: ${(props) => props.theme.colors.darkGray};
    background-color: ${(props) => lighten(0.05, props.theme.colors.primaryNeutral)};
    color: ${(props) => props.theme.colors.textDark};
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  &:focus-visible { outline: 2px solid ${(props) => props.theme.colors.accent1}; outline-offset: 1px; }
`;


export const DealsCarouselViewport = styled.div<{ theme: DefaultTheme }>`
  overflow: hidden;
  width: 100%;
  height: 100%;
  position: relative;
`;

export const DealsCarouselTrack = styled.div<{
  theme: DefaultTheme;
  $itemCount:number;
  $itemsPerPage:number;
  $totalPages: number;
  $currentPage: number;
}>`

  display: flex;
  width: ${({$itemCount,$itemsPerPage}) =>Math.ceil($itemCount/$itemsPerPage)*100}%;
  transform: translateX(-${({ $currentPage }) => $currentPage * 25}%);
  transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
  gap: ${({ theme }) => theme.spacing(2)};
`;



export const DealItemSlot = styled.div<{ theme: DefaultTheme; $itemsPerPage: number }>`
  width: 25%;
  box-sizing: border-box;


  & > * { 
    width: 100%;
    height: 100%; 
  }
`;


export const DealProductCell = styled.a<{ theme: DefaultTheme }>` 
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.adminSurface}; 
  border-radius: ${({ theme }) => theme.borderRadius.small}; 
  border: 1px solid transparent; 
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  transition: box-shadow 0.2s ease-out, transform 0.2s ease-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.subtle};
    transform: translateY(-2px);
    .deal-product-image img { transform: scale(1.025); }
  }
`;

export const DealProductImageContainer = styled.div<{ theme: DefaultTheme }>`
  position: relative;
  aspect-ratio: 1 / 1; 
  overflow: hidden;
  background-color: ${({theme}) => lighten(0.06, theme.colors.primaryNeutral)}; 
  border-bottom: 1px solid ${({theme}) => theme.colors.lightGray};

  img {
    display: block; width: 100%; height: 100%;
    object-fit: cover; 
    transition: transform 0.3s ease-out;
  }
`;


export const OfferTag = styled.span<{ theme: DefaultTheme }>`
  display: inline-block; 
  border: 1px solid ${(props) => props.theme.colors.adminStatusError}; 
  color: ${(props) => props.theme.colors.adminStatusError};
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1.25)};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  text-align: center;
  line-height: 1;
`;

export const DealProductContent = styled.div<{ theme: DefaultTheme }>`
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  flex-grow: 1; 
  text-align: left;
`;

export const DealProductName = styled.h5<{ theme: DefaultTheme }>` 
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.regular};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.4;
  margin: 0 0 ${({ theme }) => theme.spacing(1.5)} 0;
  display: -webkit-box;
  margin-top: 2px;

  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(${({theme}) => theme.typography.body.sizes.xsmall} * 1.4 * 2);
`;

export const DealPriceInfo = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-direction: column; 
  align-items: flex-start;
  margin-top: -20px;
`;

export const DealCurrentPrice = styled.span<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base}; 
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  color: ${(props) => props.theme.colors.adminStatusError}; 
  line-height: 1.2;

  .currency { 
    font-size: 0.9em;
    font-weight: ${({ theme }) => theme.typography.body.weights.regular};
    margin-left: 1px;
  }
`;

export const DealDiscountText = styled.span<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  color: ${(props) => props.theme.colors.adminStatusError};
  font-weight: ${({ theme }) => theme.typography.body.weights.regular};
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`;

export const DealReviewInfo = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(0.75)};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

export const DealStars = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  gap: 1px; 
  color: #FFB300;
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall}; /* Small stars */
`;

export const DealReviewCount = styled.span<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 0.65rem; /* Very small review count text */
  color: ${({ theme }) => theme.colors.darkGray};
`;
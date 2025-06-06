
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';


const sectionEntrance = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;


export const SectionWrapper = styled.section<{ theme: DefaultTheme }>`
margin-top: 40px;
  padding: ${(props) => props.theme.spacing(10)} 0;
  background-color: ${(props) => lighten(0.01, props.theme.colors.primaryNeutral)};
  overflow: hidden;
  animation: ${sectionEntrance} 0.7s ease-out 0.2s forwards;
  opacity: 0;
`;

export const SectionContentLimiter = styled.div<{ theme: DefaultTheme }>`
    max-width: ${(props) => props.theme.maxWidth};
    margin: 0 auto;
    padding: 0 ${(props) => props.theme.containerPadding};
`;


export const SectionHeader = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props) => props.theme.spacing(6)};

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
    margin-bottom: ${(props) => props.theme.spacing(5)};
    h2 { font-size: ${({ theme }) => theme.typography.heading.sizes.h4}; }
  }
   @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${(props) => props.theme.spacing(3)};
  }
`;

export const CarouselNavigation = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing(2.5)};
`;

export const PaginationIndicator = styled.span<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.darkGray};
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  min-width: 40px;
  text-align: center;
`;

export const CarouselNavArrow = styled.button<{ theme: DefaultTheme; $isHidden?: boolean }>`
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.colors.lightGray};
  color: ${(props) => props.theme.colors.darkGray};
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease-out;
  font-size: 0.9rem;
  opacity: ${(props) => (props.$isHidden ? 0.3 : 1)};
  pointer-events: ${(props) => (props.$isHidden ? 'none' : 'auto')};

  &:hover:not(:disabled) {
    border-color: ${(props) => props.theme.colors.accent1};
    background-color: ${(props) => transparentize(0.9, props.theme.colors.accent1)};
    color: ${(props) => props.theme.colors.accent1};
    transform: scale(1.05);
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.accent1};
    outline-offset: 1px;
  }
`;

export const CarouselViewport = styled.div<{ theme: DefaultTheme }>`
  overflow: hidden;
  width: 100%;
  position: relative;
`;

export const CarouselTrack = styled.div<{
  theme: DefaultTheme;
  $itemCount: number;
  $itemsPerPage: number;
  $currentGroupIndex: number;
}>`
  display: flex;
  width: ${({ $itemCount, $itemsPerPage }) =>
    Math.ceil($itemCount / $itemsPerPage) * 100}%;
  transform: translateX(-${({ $currentGroupIndex }) => $currentGroupIndex * 25}%);
  transition: transform 0.7s cubic-bezier(0.455, 0.030, 0.515, 0.955);
  will-change: transform;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const CarouselItemSlot = styled.div<{ theme: DefaultTheme }>`
  box-sizing: border-box;
    width: 25%;

  & > * {
    height: 100%;
    width: 100%;
  }
 
`;

export const ProductDiscountBadge = styled.span<{ theme: DefaultTheme }>`
    background-color: ${(props) => props.theme.colors.adminStatusError};
    color: ${(props) => props.theme.colors.textLight};
    padding: ${(props) => props.theme.spacing(0.5)} ${(props) => props.theme.spacing(1.5)};
    border-radius: ${(props) => props.theme.borderRadius.small};
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
    font-weight: ${({ theme }) => theme.typography.body.weights.bold};
    margin-right: ${({ theme }) => theme.spacing(1.5)};
    line-height: 1;
`;

export const ProductPriceOriginal = styled.s<{ theme: DefaultTheme }>`
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    color: ${({ theme }) => theme.colors.darkGray};
    opacity: 0.8;
    margin-left: ${({ theme }) => theme.spacing(1)};
`;

export const ProductSpecialTag = styled.span<{ theme: DefaultTheme }>`
    color: #A100FF;
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    font-weight: ${({ theme }) => theme.typography.body.weights.bold};
    margin-left: ${({ theme }) => theme.spacing(1.5)};
`;

export const ProductReviewStars = styled.div<{ theme: DefaultTheme }>`
    display: flex;
    align-items: center;
    gap: 2px;
    color: #FFB300;
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    margin-top: ${({ theme }) => theme.spacing(1)};
`;

export const ProductReviewCount = styled.span<{ theme: DefaultTheme }>`
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
    color: ${({ theme }) => theme.colors.darkGray};
    margin-left: ${({ theme }) => theme.spacing(1)};
`;

export const CuratedProductCell = styled.a<{ theme: DefaultTheme }>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.adminSurface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  transition: box-shadow 0.25s ease-out, transform 0.25s ease-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-4px);
    
    .product-cell-image img {
      transform: scale(1.04);
    }
  }
`;

export const ProductCellImageContainer = styled.div<{ theme: DefaultTheme }>`
  position: relative;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-color: ${({theme}) => lighten(0.05, theme.colors.primaryNeutral)};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover; 
    transition: transform 0.3s ease-out;
  }
`;


export const ProductCellBadge = styled.span<{ theme: DefaultTheme; $isDiscount?: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing(2)};
  left: ${({ theme }) => theme.spacing(2)};
  z-index: 2;
  padding: ${({ theme }) => theme.spacing(0.75)} ${({ theme }) => theme.spacing(1.5)};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 0.68rem;
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  color: ${({ theme }) => theme.colors.textLight};
  line-height: 1;
  text-align: center;
  
  background-color: ${(props) => props.$isDiscount 
    ? (props.theme.colors.adminStatusError)
    : (props.theme.colors.accent1)
  };
  
  span.percentage-symbol {
    font-size: 0.9em;
    margin-right: 1px;
  }
`;


export const ProductCellContent = styled.div<{ theme: DefaultTheme }>`
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-align: left;
`;

export const ProductCellName = styled.h4<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  font-weight: ${({ theme }) => theme.typography.body.weights.regular};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.45;
  margin: 0 0 ${({ theme }) => theme.spacing(1)} 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(${({theme}) => theme.typography.body.sizes.small} * 1.45 * 2);
`;

export const ProductCellPriceInfo = styled.div<{ theme: DefaultTheme }>`
  display: flex;

  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin: auto 0 ${({ theme }) => theme.spacing(1.5)} 0;
  padding-top: ${({theme}) => theme.spacing(1)};
`;

export const ProductCellCurrentPrice = styled.span<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.medium};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1;

  .currency-symbol {
    font-size: 0.9em;
    font-weight: ${({ theme }) => theme.typography.body.weights.regular};
    margin-left: 1px;
  }
`;


export const ProductCellOriginalPrice = styled.s<{ theme: DefaultTheme }>`
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  color: ${({ theme }) => theme.colors.darkGray};
  opacity: 0.9;
  line-height: 1;
  align-self: flex-end;
  margin-bottom: 1px;
`;


export const ProductCellSpecialTag = styled.span<{ theme: DefaultTheme }>`
 
 
  color: #7E38B7;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  line-height: 1;
  padding: 2px 0;
`;

export const ProductCellShippingText = styled.div<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 0.68rem;
 
  color: ${(props) => props.theme.colors.accent1Vibrant || props.theme.colors.accent1}; 
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
 
  margin-top: ${({ theme }) => theme.spacing(0.5)};
`;


export const ProductCellReviewInfo = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1.5)};
`;

export const ProductCellStars = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  gap: 1px;
  color: #FFB300;
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
`;

export const ProductCellReviewCount = styled.span<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  color: ${({ theme }) => theme.colors.darkGray};
`;


const subtleCardEntrance = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;



export const ProductCellStyled = styled.a<{
  theme: DefaultTheme;
  $animationDelay?: string;
}>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  background-color: ${({ theme }) => theme.colors.adminSurface};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  position: relative;

  text-decoration: none;
  color: inherit;

  transition:
    box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease-out;

  opacity: 0;
  transform: translateY(15px);
  animation: ${subtleCardEntrance} 0.5s ease-out forwards;
  animation-delay: ${({ $animationDelay }) => $animationDelay || "0s"};

  &:hover,
  &:focus-within {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
    border-color: ${({ theme }) => transparentize(0.5, theme.colors.accent1)};

    & > div:first-child img {
      transform: scale(1.04);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent1};
    outline-offset: 2px;
    border-color: ${({ theme }) => theme.colors.accent1};
  }
`;

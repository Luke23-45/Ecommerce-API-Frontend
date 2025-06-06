// src/components/ProductCarousel/ProductCarousel.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { darken, lighten, rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// --- Keyframes specific to ProductCarousel (excluding card ones now) ---

// Button slide up for quick actions
const buttonSlideUp = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// Navigation arrow subtle glow and pulse
const arrowPulseShine = keyframes`
  0%, 100% {
    transform: translateY(-50%) scale(1);
    box-shadow: 0 4px 15px ${props => rgba(getTheme(props).colors.accent1, 0.2)};
  }
  50% {
    transform: translateY(-50%) scale(1.05);
    box-shadow: 0 6px 25px ${props => rgba(getTheme(props).colors.accent1, 0.4)};
  }
`;

export const ProductCarouselSection = styled.section`
    padding: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(12)} 0 ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(16)} 0;
    background: linear-gradient(180deg, ${props => lighten(0.03, getTheme(props).colors.primaryNeutral)} 0%, ${props => darken(0.02, getTheme(props).colors.primaryNeutral)} 100%);
    overflow: hidden;
    position: relative;

    @media (max-width: ${(props: { theme: DefaultTheme }) => getTheme(props).breakpoints.tablet}) {
        padding: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(8)} 0 ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(12)} 0;
    }
`;

export const SectionHeadline = styled.h2`
    font-family: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.heading.fontFamily};
    font-size: clamp(2rem, 5vw, ${(props: { theme: DefaultTheme }) => getTheme(props).typography.heading.sizes.h2});
    font-weight: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.heading.weights.bold};
    color: ${(props: { theme: DefaultTheme }) => getTheme(props).colors.textDark};
    margin-bottom: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(10)};
    text-align: center;
    line-height: 1.25;
    padding: 0 ${(props: { theme: DefaultTheme }) => getTheme(props).containerPadding};
    letter-spacing: -0.5px;
    text-shadow: 1px 1px 2px ${props => rgba(getTheme(props).colors.textDark, 0.1)};

    @media (max-width: ${(props: { theme: DefaultTheme }) => getTheme(props).breakpoints.tablet}) {
        font-size: clamp(1.8rem, 6vw, ${(props: { theme: DefaultTheme }) => getTheme(props).typography.heading.sizes.h3});
        margin-bottom: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(6)};
    }
`;

export const CarouselContainer = styled.div`
    position: relative;
    max-width: ${(props: { theme: DefaultTheme }) => getTheme(props).maxWidth};
    margin: 0 auto;
    padding: 0 ${(props: { theme: DefaultTheme }) => getTheme(props).containerPadding};
`;

export const CarouselWrapper = styled.div`
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(2)} ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(1)} ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(6)} ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(1)};
    margin: 0 -${(props: { theme: DefaultTheme }) => getTheme(props).spacing(1)};
    gap: ${(props) => getTheme(props).spacing(6)};

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const NavArrow = styled.button<{ $direction: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    ${props => props.$direction === 'left' ?
        css`left: calc(${props.theme.containerPadding} - ${props.theme.spacing(10)});` :
        css`right: calc(${props.theme.containerPadding} - ${props.theme.spacing(10)});`}

    background-color: ${(props: { theme: DefaultTheme }) => rgba(props.theme.colors.textLight, 0.85)};
    backdrop-filter: blur(5px);
    border: 1px solid ${(props: { theme: DefaultTheme }) => rgba(props.theme.colors.accent1, 0.3)};
    border-radius: 50%;
    width: 55px;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px ${props => rgba(props.theme.colors.accent1, 0.15)};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1};
    font-size: 24px;
    cursor: pointer;
    z-index: 10;
    opacity: 0.85;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &:hover {
        background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1};
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};
        box-shadow: 0 8px 28px ${props => rgba(props.theme.colors.accent1, 0.3)};
        transform: translateY(-50%) scale(1.1);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.lightGray};
      border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.darkGray};
      color: ${(props: { theme: DefaultTheme }) => props.theme.colors.darkGray};
      box-shadow: none;
      transform: translateY(-50%) scale(1);
    }

    @media (max-width: ${(props: { theme: DefaultTheme }) => getTheme(props).breakpoints.laptop}) {
        width: 48px;
        height: 48px;
        font-size: 20px;
        ${props => props.$direction === 'left' ?
        css`left: calc(${props.theme.containerPadding} - ${props.theme.spacing(6)});` :
        css`right: calc(${props.theme.containerPadding} - ${props.theme.spacing(6)});`}
    }
    @media (max-width: ${(props: { theme: DefaultTheme }) => getTheme(props).breakpoints.tablet}) {
        display: none;
    }
`;

// --- Actions Overlay for Product Card (Remains specific to ProductCarousel) ---
export const CardActionsOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    padding: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(3)};

    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: opacity 0.35s ease-out, visibility 0.35s ease-out, transform 0.35s ease-out;
    pointer-events: none;
    will-change: opacity, transform;
    z-index: 4;


    ${(props) => css`
        ${(props as any).StyledProductCard}:hover & {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
            pointer-events: auto;
        }
    `}

    @media (hover: none) {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
      position: static;
      padding: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(2)} 0 0 0;
      flex-direction: row;
      justify-content: space-between;
      height: auto;
      background: none;
    }
`;

const ActionButtonBase = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(3)} ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(2)};
    border-radius: 8px;
    font-size: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.body.sizes.small};
    font-weight: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.body.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 0.7px;
    box-shadow: 0 4px 12px ${props => rgba(getTheme(props).colors.textDark, 0.1)};
    transition: all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
    pointer-events: auto;
    cursor: pointer;
    border: none;
    will-change: transform, background-color, box-shadow;

    &:hover {
        transform: translateY(-3px) scale(1.03);
        box-shadow: 0 6px 18px ${props => rgba(getTheme(props).colors.textDark, 0.15)};
    }

    ${(props) => css`
        ${(props as any).StyledProductCard}:hover & {
            animation: ${buttonSlideUp} 0.4s forwards cubic-bezier(0.165, 0.84, 0.44, 1);
        }
    `}

    @media (hover: none) {
      animation: none;
      box-shadow: 0 2px 6px ${props => rgba(getTheme(props).colors.textDark, 0.08)};
      width: calc(50% - ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(1.5)});
      padding: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(2.5)};
    }
`;

export const QuickActionButton = styled.button`
    ${ActionButtonBase}
    background-color: ${(props: { theme: DefaultTheme }) => rgba(props.theme.colors.textLight, 0.9)};
    backdrop-filter: blur(3px);
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent2};
    border: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.accent2};
    margin-bottom: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(2.5)};

    &:hover {
        background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent2};
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};
        border-color: transparent;
    }

    ${(props) => css`${(props as any).StyledProductCard}:hover & { animation-delay: 0.05s; }`}
    @media (hover: none) {
      margin-bottom: 0;
    }
`;

export const AddToCartButton = styled.button`
    ${ActionButtonBase}
    background: ${(props: { theme: DefaultTheme }) => props.theme.colors.gradients?.accent1Vibrant || props.theme.colors.accent1};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};

    &:hover {
        background: ${(props) => {
            const currentBg = props.theme.colors.gradients?.accent1Vibrant || props.theme.colors.accent1;
            if (typeof currentBg === 'string' && currentBg.includes('gradient')) {
                 return darken(0.15, props.theme.colors.accent1);
            }
            return darken(0.1, currentBg);
        }};
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};
    }

    ${(props) => css`${(props as any).StyledProductCard}:hover & { animation-delay: 0.1s; }`}
`;
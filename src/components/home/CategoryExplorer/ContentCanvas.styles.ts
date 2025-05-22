// src/components/CategoryExplorer/ContentCanvas.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken } from 'polished';
import { StyledProductCard } from '../ProductCard/ProductCard.styles';
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// --- Keyframes for Content Canvas animations ---
const contentSlideIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const HotTagPop = keyframes`
  0% { transform: scale(0); opacity: 0; }
  70% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
`;

export const ContentCanvasContainer = styled.div`
    flex: 1; /* Take remaining space */
    padding: ${(props) => getTheme(props).spacing(8)} ${(props) => getTheme(props).spacing(10)};
    background-color: ${(props) => getTheme(props).colors.textLight}; /* Clean white background */
    border-radius: 0 16px 16px 0; /* Rounded only on right */

    /* Initial state for ContentCanvas content. This will re-trigger on category change. */
    opacity: 0;
    transform: translateY(15px);
    animation: ${contentSlideIn} 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        padding: ${(props) => getTheme(props).spacing(6)} ${(props) => getTheme(props).containerPadding};
        border-radius: 0 0 16px 16px; /* Rounded on bottom corners on mobile */
    }
`;

export const CategoryIntro = styled.div`
    margin-bottom: ${(props) => getTheme(props).spacing(8)}; /* Space below intro text */
    /* Nested animation for a smoother reveal of text */
    & > * {
        opacity: 0;
        animation: ${contentSlideIn} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        animation-delay: var(--animation-delay, 0s);
    }
`;

export const CategoryName = styled.h3`
    font-family: ${(props) => getTheme(props).typography.heading.fontFamily};
    font-size: ${(props) => getTheme(props).typography.heading.sizes.h3};
    font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
    color: ${(props) => getTheme(props).colors.textDark};
    margin-bottom: ${(props) => getTheme(props).spacing(2)};
    line-height: 1.2;
    letter-spacing: -0.3px;
`;

export const GoToLink = styled.a`
    font-family: ${(props) => getTheme(props).typography.body.fontFamily};
    font-size: ${(props) => getTheme(props).typography.body.sizes.small};
    font-weight: ${(props) => getTheme(props).typography.body.weights.semiBold};
    color: ${(props) => getTheme(props).colors.accent1};
    text-decoration: none;
    transition: color 0.2s ease-out;

    &:hover {
        color: ${(props) => darken(0.1, getTheme(props).colors.accent1)};
    }
`;

export const HotTagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => getTheme(props).spacing(2)}; /* Smaller gap for tags */
    margin-top: ${(props) => getTheme(props).spacing(4)};
`;

export const HotTag = styled.span`
    background-color: ${(props) => rgba(getTheme(props).colors.accent2, 0.15)}; /* Subtle sage green background */
    color: ${(props) => getTheme(props).colors.accent2};
    font-family: ${(props) => getTheme(props).typography.body.fontFamily};
    font-size: ${(props) => getTheme(props).typography.body.sizes.xsmall};
    font-weight: ${(props) => getTheme(props).typography.body.weights.medium};
    padding: 6px 12px;
    border-radius: 20px; /* Pill shape */
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: background-color 0.2s ease-out, transform 0.2s ease-out;
    cursor: pointer;

    &:hover {
        background-color: ${(props) => getTheme(props).colors.accent2};
        color: ${(props) => getTheme(props).colors.textLight};
        transform: translateY(-2px);
    }
    /* Animation needs to be applied directly in JSX via styled props for staggered effect */
    /* animation: ${HotTagPop} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards var(--animation-delay, 0s); */
    /* opacity: 0; /* Handled by CategoryIntro for its children */
    /* transform-origin: bottom center; /* This part is only necessary if applied with a transform on a global level for pop effect */
`;

// --- Shared Slider Styles (for Hero and Product Grid) ---
export const SliderWrapper = styled.div`
    position: relative;
    overflow: hidden;
    margin-bottom: ${(props) => getTheme(props).spacing(10)}; /* Space below slider */

    opacity: 0; /* Hidden for initial animation */
    animation: ${contentSlideIn} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    animation-delay: var(--animation-delay, 0s); /* To be controlled by JSX */

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        margin-bottom: ${(props) => getTheme(props).spacing(6)};
    }
`;

export const SlidesContainer = styled.div`
    display: flex;
    transition: transform 0.5s ease-in-out; /* Smooth slide transition */
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
    overflow-x: auto; /* Allow manual scrolling */
    scrollbar-width: none; /* Hide scrollbar for Firefox */
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, Opera */
    }
`;

export const Slide = styled.div`
    flex: 0 0 100%; /* Each slide takes full width */
    scroll-snap-align: center; /* Snap to center of slide */
`;

export const SliderNavArrow = styled.button<{ $direction: 'left' | 'right' }>`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    ${props => props.$direction === 'left' ? 'left: 10px;' : 'right: 10px;'}
    background-color: ${(props) => rgba(getTheme(props).colors.textLight, 0.85)};
    backdrop-filter: blur(5px);
    border: 1px solid ${(props) => rgba(getTheme(props).colors.textDark, 0.2)};
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => getTheme(props).colors.textDark};
    font-size: 18px;
    cursor: pointer;
    z-index: 5;
    opacity: 0; /* Hidden by default */
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;

    ${SliderWrapper}:hover & { /* Show on hover of parent wrapper */
        opacity: 1;
    }
    &:hover {
        transform: translateY(-50%) scale(1.1);
        background-color: ${(props) => getTheme(props).colors.accent1};
        color: ${(props) => getTheme(props).colors.textLight};
    }
    &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

export const SliderDots = styled.div`
    display: flex;
    justify-content: center;
    gap: ${(props) => getTheme(props).spacing(2)};
    margin-top: ${(props) => getTheme(props).spacing(4)};

    opacity: 0; /* Hidden by default */
    transition: opacity 0.3s ease-out;

    ${SliderWrapper}:hover & {
        opacity: 1; /* Show on hover of parent wrapper */
    }
`;

export const Dot = styled.button<{ $isActive: boolean }>`
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${(props) => props.$isActive ? getTheme(props).colors.accent1 : getTheme(props).colors.lightGray};
    border: 1px solid ${(props) => props.$isActive ? getTheme(props).colors.accent1 : getTheme(props).colors.darkGray};
    cursor: pointer;
    transition: background-color 0.3s ease-out, border-color 0.3s ease-out;

    &:hover {
        background-color: ${(props) => props.$isActive ? darken(0.1, getTheme(props).colors.accent1) : getTheme(props).colors.accent2};
    }
`;

// --- Hero Image Slider ---
export const HeroImageSlide = styled.div`
    position: relative;
    height: 400px; /* Consistent height for the hero slider */
    border-radius: 12px;
    overflow: hidden;
    background-color: ${(props) => getTheme(props).colors.lightGray};

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        height: 300px;
    }
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        height: 250px;
    }
`;

// --- Product Grid Slider ---
export const ProductGridContainer = styled.div`
    margin-top: ${(props) => getTheme(props).spacing(8)}; /* Space above product grid */
`;

export const ProductGridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 columns */
    grid-template-rows: repeat(2, auto); /* 2 rows */
    gap: ${(props) => getTheme(props).spacing(5)}; /* Consistent gap between products */
    
    ${StyledProductCard} { /* Target shared product card style for grid context */
        width: 100%;
        height: auto;
        aspect-ratio: 0.7; /* Use aspect ratio for consistent card height */
        /* Animation will be handled by the GenericSlider's content update,
           so ProductCard's is-visible animation might need to be reset */
        animation: none !important; /* Reset existing animations if present for a clean reveal within slider */
        opacity: 1 !important; /* Always visible once loaded */
        transform: none !important;
        
        &:hover {
          /* Maintain standard hover effect */
        }
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        grid-template-columns: repeat(2, 1fr); /* 2 columns on laptop */
        grid-template-rows: repeat(3, auto); /* 3 rows on laptop */
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        grid-template-columns: 1fr; /* Single column on mobile */
        grid-template-rows: repeat(6, auto); /* 6 rows for 6 products */
        gap: ${(props) => getTheme(props).spacing(4)};
    }
`;
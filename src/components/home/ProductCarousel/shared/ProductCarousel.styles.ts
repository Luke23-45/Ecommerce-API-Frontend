// src/components/ProductCarousel/ProductCarousel.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { darken, lighten, rgba } from 'polished';

// Accessing theme from props directly (essential for consistency)
const getTheme = (props: any) => props.theme;

// --- Keyframes for Dynamic & Stunning Animations ---

// Card entrance animation for staggered appearance
const cardEntrance = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

// Enhanced Card Image Hover - More vibrancy and depth
const cardImageHover = keyframes`
  from {
    transform: scale(1.05); /* Start slightly zoomed from ProductImageWrapper hover */
    filter: brightness(1) saturate(1);
  }
  to {
    transform: scale(1.15); /* More pronounced zoom */
    filter: brightness(0.8) saturate(1.3) contrast(1.1); /* Deeper blacks, richer colors */
  }
`;

// Overlay fade/slide in on hover - smoother easing
const overlayReveal = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Button slide up - slightly more dynamic
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

// Badge entrance/pop
const badgePop = keyframes`
  0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;


export const ProductCarouselSection = styled.section`
    padding: ${(props) => getTheme(props).spacing(12)} 0 ${(props) => getTheme(props).spacing(16)} 0; /* More bottom padding for dots/space */
    /* Using background property that supports linear-gradient */
    background: linear-gradient(180deg, ${props => lighten(0.03, getTheme(props).colors.primaryNeutral)} 0%, ${props => darken(0.02, getTheme(props).colors.primaryNeutral)} 100%);
    overflow: hidden;
    position: relative;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        padding: ${(props) => getTheme(props).spacing(8)} 0 ${(props) => getTheme(props).spacing(12)} 0;
    }
`;

export const SectionHeadline = styled.h2`
    font-family: ${(props) => getTheme(props).typography.heading.fontFamily};
    font-size: clamp(2rem, 5vw, ${(props) => getTheme(props).typography.heading.sizes.h2}); /* Responsive font size */
    font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
    color: ${(props) => getTheme(props).colors.textDark};
    margin-bottom: ${(props) => getTheme(props).spacing(10)};
    text-align: center;
    line-height: 1.25;
    padding: 0 ${(props) => getTheme(props).containerPadding};
    letter-spacing: -0.5px; /* Slightly tighter for large headings */

    /* Subtle text shadow for depth */
    text-shadow: 1px 1px 2px ${props => rgba(getTheme(props).colors.textDark, 0.1)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        font-size: clamp(1.8rem, 6vw, ${(props) => getTheme(props).typography.heading.sizes.h3});
        margin-bottom: ${(props) => getTheme(props).spacing(6)};
    }
`;

export const CarouselContainer = styled.div`
    position: relative;
    max-width: ${(props) => getTheme(props).maxWidth};
    margin: 0 auto;
    padding: 0 ${(props) => getTheme(props).containerPadding};

    /* For Slick Slider: if you were to use it, you might need negative margins
       to allow arrows to sit outside visually but still be within the padded container.
       Since this is a custom scroller, the current padding is fine. */
`;

export const CarouselWrapper = styled.div`
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    /* Increased padding for shadow visibility and aesthetics */
    padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(1)} ${(props) => getTheme(props).spacing(6)} ${(props) => getTheme(props).spacing(1)};
    margin: 0 -${(props) => getTheme(props).spacing(1)}; /* Counteract card margins for edge alignment */
    gap: ${(props) => getTheme(props).spacing(6)}; /* Increased gap for a more luxurious feel */

    &::-webkit-scrollbar {
        display: none;
    }
`;

export const NavArrow = styled.button<{ $direction: 'left' | 'right' }>`
    position: absolute;
    top: 50%; /* Adjust if cards have varying heights or if image wrapper is target */
    transform: translateY(-50%); /* Keeps arrow vertically centered */

    ${props => props.$direction === 'left' ?
        css`left: calc(${getTheme(props).containerPadding} - ${getTheme(props).spacing(10)});` : // Further out
        css`right: calc(${getTheme(props).containerPadding} - ${getTheme(props).spacing(10)});`} // Further out

    background-color: ${(props) => rgba(getTheme(props).colors.textLight, 0.85)}; /* Using textLight for white background */
    backdrop-filter: blur(5px); /* Frosted glass effect */
    border: 1px solid ${(props) => rgba(getTheme(props).colors.accent1, 0.3)};
    border-radius: 50%;
    width: 55px; /* Slightly larger */
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6px 20px ${props => rgba(getTheme(props).colors.accent1, 0.15)};
    color: ${(props) => getTheme(props).colors.accent1}; /* Vibrant arrow color */
    font-size: 24px;
    cursor: pointer;
    z-index: 10;
    opacity: 0.85;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &:hover {
        background-color: ${(props) => getTheme(props).colors.accent1};
        color: ${(props) => getTheme(props).colors.textLight};
        box-shadow: 0 8px 28px ${props => rgba(getTheme(props).colors.accent1, 0.3)};
        transform: translateY(-50%) scale(1.1); /* More reactive hover */
        /* animation: ${arrowPulseShine} 1.5s infinite ease-in-out; Remove if too distracting, use only transform */
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      background-color: ${(props) => getTheme(props).colors.lightGray};
      border-color: ${(props) => getTheme(props).colors.darkGray};
      color: ${(props) => getTheme(props).colors.darkGray};
      box-shadow: none;
      transform: translateY(-50%) scale(1);
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        /* Still display on tablets, but slightly smaller */
        width: 48px;
        height: 48px;
        font-size: 20px;
        ${props => props.$direction === 'left' ?
        css`left: calc(${getTheme(props).containerPadding} - ${getTheme(props).spacing(6)});` :
        css`right: calc(${getTheme(props).containerPadding} - ${getTheme(props).spacing(6)});`}
    }
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        display: none; /* Hide on smaller mobile devices */
    }
`;

export const ProductCard = styled.div`
    flex: 0 0 auto;
    width: clamp(270px, 22vw, 340px); /* Slightly adjusted clamp for new gap */
    aspect-ratio: 0.7; /* e.g., 7:10 - Taller cards can feel more elegant */
    background-color: ${(props) => getTheme(props).colors.textLight}; /* Ensure white background for the card */
    border-radius: 16px; /* Softer, more premium radius */
    overflow: hidden;
    box-shadow: 0 8px 25px ${props => rgba(getTheme(props).colors.textDark, 0.06)}; /* Softer initial shadow */
    position: relative;
    cursor: pointer;
    scroll-snap-align: center; /* Center align snapped items */
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); /* Smoother, more sophisticated bezier */
    will-change: transform, box-shadow;

    /* For controlled entrance animation from ProductItemCard component: */
    &.is-visible {
      animation: ${cardEntrance} 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards var(--animation-delay, 0s); /* Use --animation-delay */
    }
    opacity: 0; /* Initial state for animation before is-visible class is applied */

    &:hover {
        transform: translateY(-10px) scale(1.02); /* More noticeable lift */
        box-shadow: 0 15px 40px ${props => rgba(getTheme(props).colors.textDark, 0.12)};
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        width: clamp(240px, 60vw, 280px); /* Wider on mobile for better touch */
        aspect-ratio: 0.75;
    }
    @media (max-width: ${(props) => getTheme(props).breakpoints.mobileL}) {
        width: clamp(220px, 75vw, 260px);
    }
`;

export const ProductImageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 65%; /* Adjust ratio for content below */
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        /* Initial slight zoom to make hover effect more seamless */
        transform: scale(1.05);
        transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), filter 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        will-change: transform, filter;

        ${ProductCard}:hover & {
            animation: ${cardImageHover} 0.6s forwards cubic-bezier(0.165, 0.84, 0.44, 1);
        }
    }
`;

export const ProductDetails = styled.div`
    height: 35%; /* Remaining height */
    padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(4)};
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Pushes price to bottom if space allows */
    text-align: left;
    position: relative;
    z-index: 2; /* Above image hover effects if any bleed */
    background-color: ${(props) => getTheme(props).colors.textLight}; /* Ensure it's opaque for content */
`;

export const ProductName = styled.h3`
    font-family: ${(props) => getTheme(props).typography.body.fontFamily}; /* Using body for more modern feel */
    font-size: ${(props) => getTheme(props).typography.body.sizes.medium};
    font-weight: ${(props) => getTheme(props).typography.body.weights.semiBold};
    color: ${(props) => getTheme(props).colors.textDark};
    line-height: 1.4; /* Improved readability */
    margin-bottom: ${(props) => getTheme(props).spacing(1)};
    /* Clamp text to 2 lines with ellipsis */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Calculate min-height dynamically based on theme font size and line height */
    min-height: calc(2 * 1.4 * ${(props) => parseFloat(getTheme(props).typography.body.sizes.medium)});
    /* Ensure getTheme(props).typography.body.sizes.medium yields a value like '1rem' so parseFloat can work or convert directly */
`;

export const ProductPrice = styled.p`
    font-family: ${(props) => getTheme(props).typography.heading.fontFamily}; /* Distinct font for price */
    font-size: ${(props) => getTheme(props).typography.body.sizes.medium}; /* Make price prominent */
    color: ${(props) => getTheme(props).colors.accent1}; /* Use a vibrant accent for price */
    font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
    margin-top: ${(props) => getTheme(props).spacing(1)}; /* Space above price */
`;

export const Badge = styled.span<{ $type: 'new' | 'bestseller' }>`
    position: absolute;
    top: ${(props) => getTheme(props).spacing(3)};
    left: ${(props) => getTheme(props).spacing(3)}; /* Consistent left positioning */
    /* Accessing gradients directly from theme */
    background: ${props => props.$type === 'new' ?
        (getTheme(props).colors.gradients?.accent1Vibrant || getTheme(props).colors.accent1) :
        (getTheme(props).colors.gradients?.accent2Vibrant || getTheme(props).colors.accent2)};
    color: ${(props) => getTheme(props).colors.textLight};
    font-size: ${(props) => getTheme(props).typography.body.sizes.xsmall};
    font-weight: ${(props) => getTheme(props).typography.body.weights.semiBold};
    padding: 7px 14px; /* Slightly larger padding */
    border-radius: 20px; /* Pill shape */
    text-transform: uppercase;
    letter-spacing: 0.8px; /* More spacing for uppercase */
    z-index: 3; /* Above image */
    box-shadow: 0 3px 10px ${props => {
        const theme = getTheme(props);
        const colorValue = props.$type === 'new' ? theme.colors.accent1 : theme.colors.accent2;
        return rgba(colorValue, 0.3); /* Ensure colorValue is directly passed. */
    }};
    animation: ${badgePop} 0.5s 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; /* Pop animation with delay */
    transform-origin: bottom left;
`;

export const CardActionsOverlay = styled.div`
    /* This component is now INSIDE ProductDetails in JSX.
       It will appear at the bottom of ProductDetails. */
    position: absolute; /* Kept absolute relative to ProductDetails */
    bottom: 0;
    left: 0;
    width: 100%;
    /* No background on desktop, handled by buttons directly */
    height: auto; /* Let content define height */
    padding: ${(props) => getTheme(props).spacing(3)}; /* Padding for buttons within overlay */

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

    /* When ProductCard is hovered, this overlay becomes visible and interactive */
    ${ProductCard}:hover & {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        pointer-events: auto; /* Enable interaction only on hover */
    }

    /* Touch device specific styles: always visible, horizontal layout for buttons */
    @media (hover: none) {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
      pointer-events: auto;
      position: static; /* Takes space within ProductDetails flex flow */
      padding: ${(props) => getTheme(props).spacing(2)} 0 0 0; /* Add some top padding */
      flex-direction: row; /* Arrange buttons side-by-side */
      justify-content: space-between;
      height: auto; /* Content defined height */
      background: none; /* No overlay background on touch */
    }
`;

const ActionButtonBase = css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%; /* Default for column layout */
    padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(2)};
    border-radius: 8px;
    font-size: ${(props) => getTheme(props).typography.body.sizes.small};
    font-weight: ${(props) => getTheme(props).typography.body.weights.semiBold};
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

    ${ProductCard}:hover & {
        /* Staggered animation for buttons (only on hover) */
        animation: ${buttonSlideUp} 0.4s forwards cubic-bezier(0.165, 0.84, 0.44, 1);
    }

    /* Styles specifically for touch devices (where hover is not applicable) */
    @media (hover: none) {
      animation: none; /* No reveal animation */
      box-shadow: 0 2px 6px ${props => rgba(getTheme(props).colors.textDark, 0.08)};
      /* For side-by-side layout on touch: */
      width: calc(50% - ${props => getTheme(props).spacing(1.5)});
      padding: ${(props) => getTheme(props).spacing(2.5)};
    }
`;

export const QuickActionButton = styled.button`
    ${ActionButtonBase}
    background-color: ${(props) => rgba(getTheme(props).colors.textLight, 0.9)}; /* Near white for clarity */
    backdrop-filter: blur(3px); /* Subtle frosted glass */
    color: ${(props) => getTheme(props).colors.accent2}; /* Sage green for text/icon */
    border: 1px solid ${(props) => getTheme(props).colors.accent2};
    margin-bottom: ${(props) => getTheme(props).spacing(2.5)}; /* Space for column layout */

    &:hover {
        background-color: ${(props) => getTheme(props).colors.accent2};
        color: ${(props) => getTheme(props).colors.textLight};
        border-color: transparent; /* No border on hover */
    }

    ${ProductCard}:hover & {
        animation-delay: 0.05s; /* Stagger */
    }

    @media (hover: none) {
      margin-bottom: 0; /* No bottom margin when row layout */
    }
`;

export const AddToCartButton = styled.button`
    ${ActionButtonBase}
    /* Assuming a gradient exists in theme.colors.gradients.accent1Vibrant */
    background: ${(props) => getTheme(props).colors.gradients?.accent1Vibrant || getTheme(props).colors.accent1};
    color: ${(props) => getTheme(props).colors.textLight};

    &:hover {
        /* Correct way to darken a potential gradient or single color */
        background: ${(props) => {
            const currentBg = getTheme(props).colors.gradients?.accent1Vibrant || getTheme(props).colors.accent1;
            // If currentBg is a linear-gradient string, create a new darkened gradient.
            if (typeof currentBg === 'string' && currentBg.includes('gradient')) {
                 // This is a placeholder for a more robust gradient darkening logic
                 // For now, let's just make it a darker solid color on hover if it's a gradient
                 return darken(0.15, getTheme(props).colors.accent1); // Default to darken the base accent color
            }
            // If it's a solid color, simply darken it
            return darken(0.1, currentBg);
        }};
        color: ${(props) => getTheme(props).colors.textLight};
    }

    ${ProductCard}:hover & {
        animation-delay: 0.1s; /* Stagger */
    }
`;
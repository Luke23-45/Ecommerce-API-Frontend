import styled, { css, keyframes } from 'styled-components';
import { darken, rgba } from 'polished';

// Theme definition (assuming this would be part of a global theme provider)
// For standalone use, this 'getTheme' provides the necessary values.
const getTheme = (props: any) => props.theme || {
    colors: {
        primaryNeutral: '#F8F5F1', // Soft off-white, warm background
        textDark: '#2C3E50',       // Deep charcoal for headlines
        textLight: '#FFFFFF',      // Pure white for card content
        accent1: '#B15F38',        // Muted Terracotta/Rust (Main Brand Accent)
        accent2: '#E0A86E',        // Lighter complementary accent
        lightGray: '#ECECEC',      // Used for card background before image loads
    },
    spacing: (multiplier: number) => `${multiplier * 4}px`, // 4px baseline grid
    maxWidth: '1440px',
    containerPadding: 'clamp(20px, 3vw, 40px)', // Responsive padding
    breakpoints: {
        tablet: '768px',
        laptop: '1200px',
        desktop: '1600px',
    },
    typography: {
        heading: {
            fontFamily: "'Playfair Display', serif",
            sizes: { h2: 'clamp(2.8rem, 4.5vw, 3.5rem)', h3: 'clamp(1.8rem, 2.8vw, 2.2rem)' },
            weights: { bold: 700, semiBold: 600 },
        },
        body: {
            fontFamily: "'Inter', sans-serif",
            sizes: { large: '1.2rem', medium: '1rem', small: '0.9rem', xsmall: '0.75rem' },
            weights: { regular: 400, semiBold: 600 },
        },
    },
};


// --- Keyframes for Fluid & Dynamic Animations ---

const cardLift = keyframes`
  from {
    transform: translateY(0) scale(1) translateZ(0px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  }
  to {
    transform: translateY(-20px) scale(1.02) translateZ(50px);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  }
`;

const imageZoom = keyframes`
  from {
    transform: scale(1);
    filter: brightness(1) saturate(1);
  }
  to {
    transform: scale(1.15);
    filter: brightness(0.7) saturate(1.3);
  }
`;

const contentReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glowPulse = keyframes`
    0% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.7; }
    50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.7; }
`;

const lightBleedEffect = keyframes`
    from {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 0;
    }
    to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
`;

// --- Section Container ---

export const FeaturedCategoriesSection = styled.section`
    padding: ${(props) => getTheme(props).spacing(24)} 0;
    background-color: ${(props) => getTheme(props).colors.primaryNeutral};
    text-align: center;
    overflow: hidden;
    position: relative;
    isolation: isolate;
    perspective: 1000px;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        padding: ${(props) => getTheme(props).spacing(12)} 0;
    }
`;

export const SectionHeadline = styled.h2`
    font-family: ${(props) => getTheme(props).typography.heading.fontFamily};
    font-size: ${(props) => getTheme(props).typography.heading.sizes.h2};
    font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
    color: ${(props) => getTheme(props).colors.textDark};
    margin-bottom: ${(props) => getTheme(props).spacing(16)};
    line-height: 1.1;
    text-align: center;
    position: relative;
    z-index: 1;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        font-size: ${(props) => getTheme(props).typography.heading.sizes.h3};
        margin-bottom: ${(props) => getTheme(props).spacing(10)};
        padding: 0 ${(props) => getTheme(props).containerPadding};
    }
`;

// --- Category Grid Layout ---

export const CategoryGrid = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 1fr 1fr 1fr;
    grid-auto-rows: minmax(380px, auto);
    gap: ${(props) => getTheme(props).spacing(6)};
    max-width: ${(props) => getTheme(props).maxWidth};
    margin: 0 auto;
    padding: 0 ${(props) => getTheme(props).containerPadding};
    position: relative;
    z-index: 1;

    grid-template-areas:
        "hero-card hero-card dining-card bedroom-card"
        "hero-card hero-card art-card outdoor-card";

    /* Apply grid-area using the data attribute */
    & > div[data-grid-area="hero-card"] {
        grid-area: hero-card;
        height: 700px;
    }
    & > div[data-grid-area="dining-card"] { grid-area: dining-card; }
    & > div[data-grid-area="bedroom-card"] { grid-area: bedroom-card; }
    & > div[data-grid-area="art-card"] { grid-area: art-card; }
    & > div[data-grid-area="outdoor-card"] { grid-area: outdoor-card; }

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        grid-template-columns: repeat(2, 1fr);
        grid-template-areas:
            "hero-card hero-card"
            "dining-card bedroom-card"
            "art-card outdoor-card";
        grid-auto-rows: minmax(320px, auto);

        & > div[data-grid-area="hero-card"] {
            height: 550px;
        }
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        grid-template-columns: 1fr;
        grid-auto-rows: minmax(300px, auto);
        gap: ${(props) => getTheme(props).spacing(4)};
        grid-template-areas: unset; /* Reset areas for single column */

        & > div[data-grid-area] { /* Target all cards */
            grid-area: unset; /* Explicitly unset for stacking */
            height: 300px; /* Or a more appropriate mobile height */
        }
         /* Ensure hero card specific height is also reset or adjusted if needed */
        & > div[data-grid-area="hero-card"] {
            height: 350px; /* Example: slightly taller hero on mobile */
        }
    }
`;

// --- Individual Category Card ---

export const CategoryCard = styled.div`
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border-radius: 20px;
    background-color: ${(props) => getTheme(props).colors.lightGray}; /* Fallback/initial bg */
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.0);
    will-change: transform, box-shadow, z-index;
    transform-style: preserve-3d;

    /* CSS variables for mouse tracking, default to center */
    --mouse-x: 50%;
    --mouse-y: 50%;

    &:hover {
        animation: ${cardLift} 0.6s forwards ease-out;
        z-index: 2;
         /* Ensure hero card can come above others even if not the last one hovered in sequence */
        &[data-grid-area="hero-card"] {
            z-index: 3;
        }
    }

    @media (hover: none) {
        &:hover {
            animation: none;
            transform: none;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
            z-index: 1;
        }
    }
`;

export const ImageBackgroundGlow = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 95%;
    height: 95%;
    border-radius: 50%;
    background: radial-gradient(
        circle,
        ${(props) => rgba(getTheme(props).colors.accent1, 0.7)} 0%,
        ${(props) => rgba(getTheme(props).colors.accent2, 0.4)} 40%,
        transparent 80%
    );
    filter: blur(70px);
    opacity: 0;
    transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.8s ease-out;
    z-index: -1; /* Behind the image wrapper */

    ${CategoryCard}:hover & {
        transform: translate(-50%, -50%) scale(1.15);
        opacity: 0.9;
        animation: ${glowPulse} 2.5s infinite alternate ease-in-out;
    }
`;

export const CardImageWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 20px; /* Match card border-radius */

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        will-change: transform, filter;
        transition: transform 0.6s ease-out, filter 0.6s ease-out;

        ${CategoryCard}:hover & {
            animation: ${imageZoom} 0.6s forwards ease-out;
        }
    }
`;

export const ImageLightOverlay = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.1);
    width: 110%;
    height: 110%;
    border-radius: 50%;
    background: radial-gradient(
        circle closest-corner at var(--mouse-x, 50%) var(--mouse-y, 50%), /* Uses CSS vars */
        ${(props) => rgba(getTheme(props).colors.textLight, 0.3)} 0%,
        ${(props) => rgba(getTheme(props).colors.accent1, 0.05)} 50%,
        transparent 100%
    );
    mix-blend-mode: overlay;
    filter: blur(80px);
    opacity: 0;
    transition: opacity 0.5s ease-out, transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 2; /* Above image but below content */
    pointer-events: none;

    ${CategoryCard}:hover & {
        /* Use animation for smoother entry if scale changes */
        animation: ${lightBleedEffect} 0.8s forwards ease-out;
        opacity: 1;
    }
`;


export const CardOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: linear-gradient(
        to top,
        ${(props) => rgba(darken(0.4, getTheme(props).colors.textDark), 0.9)} 0%,
        ${(props) => rgba(darken(0.4, getTheme(props).colors.textDark), 0.6)} 50%,
        ${(props) => rgba(darken(0.4, getTheme(props).colors.textDark), 0)} 100%
    );
    transition: background 0.6s ease-out, backdrop-filter 0.6s ease-out;
    pointer-events: none;
    backdrop-filter: blur(3px);

    ${CategoryCard}:hover & {
        background: linear-gradient(
            to top,
            ${(props) => rgba(darken(0.5, getTheme(props).colors.textDark), 0.98)} 0%,
            ${(props) => rgba(darken(0.5, getTheme(props).colors.textDark), 0.8)} 50%,
            ${(props) => rgba(darken(0.5, getTheme(props).colors.textDark), 0)} 100%
        );
        backdrop-filter: blur(6px);
    }
`;

export const CardContent = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: ${(props) => getTheme(props).spacing(10)};
    color: ${(props) => getTheme(props).colors.textLight};
    text-align: left;
    display: flex;
    flex-direction: column;
    pointer-events: none;
    z-index: 3;
    transform-origin: bottom;

    p, a {
        opacity: 0;
        transform: translateY(20px);
        will-change: opacity, transform;
        transition: opacity 0.5s ease-out, transform 0.5s ease-out; /* Fallback for non-animation */
    }

    ${CategoryCard}:hover & p {
        animation: ${contentReveal} 0.7s forwards cubic-bezier(0.25, 0.8, 0.25, 1);
        animation-delay: 0.2s;
    }
    ${CategoryCard}:hover & a {
        animation: ${contentReveal} 0.7s forwards cubic-bezier(0.25, 0.8, 0.25, 1);
        animation-delay: 0.4s;
    }
`;

export const CardTitle = styled.h3`
    font-family: ${(props) => getTheme(props).typography.heading.fontFamily};
    font-size: ${(props) => getTheme(props).typography.heading.sizes.h3};
    font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
    line-height: 1.1;
    text-shadow: 0 3px 12px rgba(0, 0, 0, 0.8);
    color: ${(props) => getTheme(props).colors.textLight};
    transition: transform 0.3s ease-out; /* Keep title transition separate */

    ${CategoryCard}:hover & {
        transform: scale(1.02);
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        font-size: ${(props) => getTheme(props).typography.body.sizes.large}; /* Adjust for smaller cards */
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    }
`;

export const CardDescription = styled.p`
    font-family: ${(props) => getTheme(props).typography.body.fontFamily};
    font-size: ${(props) => getTheme(props).typography.body.sizes.small};
    line-height: 1.7;
    margin-bottom: ${(props) => getTheme(props).spacing(6)}; /* CORRECTED LINE */
    text-shadow: 0 1px 6px rgba(0, 0, 0, 0.6);
    flex-grow: 1; /* Allows button to stay at bottom if content varies */
    color: ${(props) => rgba(getTheme(props).colors.textLight, 0.98)};
`;

export const CardCtaButton = styled.a`
    display: inline-block;
    align-self: flex-start; /* Align to the left */
    background-color: ${(props) => getTheme(props).colors.accent1};
    color: ${(props) => getTheme(props).colors.textLight};
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(8)};
    border-radius: 50px;
    font-family: ${(props) => getTheme(props).typography.body.fontFamily};
    font-size: ${(props) => getTheme(props).typography.body.sizes.xsmall};
    font-weight: ${(props) => getTheme(props).typography.body.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 1.2px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.4s ease-out, box-shadow 0.4s ease-out, letter-spacing 0.4s ease-out;
    pointer-events: auto; /* Make button clickable */
    text-decoration: none;

    &:hover {
        transform: translateY(-10px);
        background-color: ${(props) => darken(0.15, getTheme(props).colors.accent1)};
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
        letter-spacing: 1.5px;
    }
`;
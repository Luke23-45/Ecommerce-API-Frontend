// src/components/LookbookCollections/LookbookCollections.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten } from 'polished';

// --- Keyframes for Fluid Entrance & Interactions ---

// Spring-like animation for text and cards
const springUp = keyframes`
    0% {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
        filter: blur(8px);
    }
    60% {
        opacity: 1;
        transform: translateY(-5px) scale(1.01);
        filter: blur(0);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
`;

// Subtle ambient float for elements
const floatEffect = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
    100% { transform: translateY(0px); }
`;

// Image zoom and subtle light shift on hover
const imageZoomShift = keyframes`
    from {
        transform: scale(1);
        filter: brightness(0.9) grayscale(0.1);
    }
    to {
        transform: scale(1.05); /* Slightly more zoom */
        filter: brightness(1.1) grayscale(0); /* Brighter and fully colored */
    }
`;

// Text content slide-up on card hover (more pronounced)
const contentSlideUpOnHover = keyframes`
    from { transform: translateY(0); opacity: 0.8; }
    to { transform: translateY(-10px); opacity: 1; }
`;

// CTA button glow/pulse on hover
const buttonPulse = keyframes`
    0% { box-shadow: 0 5px 15px ${props => rgba(props.theme.colors.accent1, 0.3)}; }
    50% { box-shadow: 0 8px 25px ${props => rgba(props.theme.colors.accent1, 0.6)}; }
    100% { box-shadow: 0 5px 15px ${props => rgba(props.theme.colors.accent1, 0.3)}; }
`;


// --- Section Container ---
export const LookbookCollectionsSection = styled.section`
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(28)} 0;
    background: linear-gradient(180deg, ${props => lighten(0.01, props.theme.colors.primaryNeutral)} 0%, ${props => props.theme.colors.primaryNeutral} 100%);
    position: relative;
    overflow: hidden;
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textDark};

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(14)} 0;
    }
`;

// --- Section Headline & Subheading ---
export const SectionHeadline = styled.h2`
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.fontFamily};
    font-size: clamp(3rem, 7vw, ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.sizes.h1});
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.weights.bold};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textDark};
    text-align: center;
    margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)};
    line-height: 1.05;
    letter-spacing: -1.2px;
    text-shadow: 2px 2px 5px ${props => rgba(props.theme.colors.textDark, 0.15)};

    opacity: 0;
    animation: ${springUp} 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: 0.4s;

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        font-size: clamp(2.2rem, 8vw, ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.sizes.h2});
    }
`;

export const SectionSubheading = styled.p`
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.large};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.darkGray};
    max-width: 900px;
    margin: 0 auto ${(props: { theme: DefaultTheme }) => props.theme.spacing(20)}; /* Generous margin below subheading */
    text-align: center;
    line-height: 1.8;

    opacity: 0;
    animation: ${springUp} 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: 0.7s;

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.medium};
        margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(12)};
    }
`;

// --- Featured Banner ---
export const FeaturedBannerContainer = styled.div<{ $yOffset: number }>`
    position: relative;
    width: 100%;
    max-width: ${(props: { theme: DefaultTheme }) => props.theme.maxWidth};
    margin: 0 auto ${(props: { theme: DefaultTheme }) => props.theme.spacing(24)}; /* Spacing below banner */
    height: 60vh; /* Consistent height for impact */
    min-height: 400px;
    border-radius: 20px; /* More rounded corners */
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25); /* Deeper shadow */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transform: translateY(${props => props.$yOffset * 0.08}px); /* More pronounced parallax */
    transition: transform 0s; /* No transition for real-time parallax */

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.laptop}) {
        height: 50vh;
        margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(16)};
        border-radius: 16px;
    }
    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        height: 40vh;
        margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(10)};
        border-radius: 12px;
    }
`;

export const BannerImage = styled.img<{ $yOffset: number }>`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: brightness(0.9) grayscale(0.1); /* Initial subtle filter */
    transform: scale(1.05); /* Slightly zoomed in initially */
    transition: filter 0.8s ease-out, transform 0.8s ease-out; /* Smooth transition */

    ${FeaturedBannerContainer}:hover & {
        transform: scale(1.1); /* More aggressive zoom on hover */
        filter: brightness(1.1) grayscale(0); /* More vibrant on hover */
    }
`;

export const BannerOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        180deg,
        ${props => rgba(props.theme.colors.textDark, 0.2)} 0%,
        ${props => rgba(props.theme.colors.textDark, 0.6)} 100%
    ); /* Darker gradient for text contrast */
    border-radius: 20px; /* Match container */
    z-index: 1;
    transition: background 0.5s ease-out;

    ${FeaturedBannerContainer}:hover & {
        background: linear-gradient(
            180deg,
            ${props => rgba(props.theme.colors.textDark, 0.1)} 0%,
            ${props => rgba(props.theme.colors.textDark, 0.5)} 100%
        ); /* Slightly lighter on hover */
    }

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.laptop}) {
        border-radius: 16px;
    }
    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        border-radius: 12px;
    }
`;

export const BannerContent = styled.div`
    position: absolute;
    z-index: 2;
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};
    max-width: 800px;
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(8)};

    h3 {
        font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.fontFamily};
        font-size: clamp(2.5rem, 5vw, ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.sizes.h2});
        font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.weights.extraBold};
        margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)};
        line-height: 1.1;
        text-shadow: 2px 2px 8px rgba(0,0,0,0.4);

        opacity: 0;
        animation: ${springUp} 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        animation-delay: 1s; /* Delayed entrance for banner content */
    }

    p {
        font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.fontFamily};
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.large};
        line-height: 1.7;
        margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(8)};
        text-shadow: 1px 1px 5px rgba(0,0,0,0.3);

        opacity: 0;
        animation: ${springUp} 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        animation-delay: 1.2s;
    }

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        h3 { font-size: clamp(2rem, 7vw, ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.sizes.h3}); }
        p { font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.base}; }
    }
`;

export const BannerCtaButton = styled.a`
    display: inline-block;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent2}; /* A different accent color for differentiation */
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)} ${(props: { theme: DefaultTheme }) => props.theme.spacing(10)};
    border-radius: 50px;
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.small};
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 1.5px;
    box-shadow: 0 8px 20px ${props => rgba(props.theme.colors.accent2, 0.3)};
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.4s ease-out, box-shadow 0.4s ease-out;
    text-decoration: none;
    outline: none;
    cursor: pointer;

    opacity: 0;
    animation: ${springUp} 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    animation-delay: 1.4s;

    &:hover {
        transform: translateY(-8px);
        background-color: ${(props: { theme: DefaultTheme }) => darken(0.15, props.theme.colors.accent2)};
        box-shadow: 0 12px 30px ${props => rgba(props.theme.colors.accent2, 0.45)};
        animation: ${buttonPulse} 1.5s infinite ease-in-out; /* Pulsing effect on hover */
    }
`;

// --- Collections Grid ---
export const CollectionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Flexible grid */
    gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(10)}; /* Moderate gap */
    max-width: ${(props: { theme: DefaultTheme }) => props.theme.maxWidth};
    margin: 0 auto;
    padding: 0 ${(props: { theme: DefaultTheme }) => props.theme.containerPadding};

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)};
    }
`;

export const CollectionCard = styled.div<{ $isIntersecting: boolean }>`
    position: relative;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.background};
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s ease-out; /* Smooth transform */
    cursor: pointer;
    will-change: transform, box-shadow;

    /* Initial hidden state for staggered animation */
    opacity: 0;
    transform: translateY(30px) scale(0.98);
    filter: blur(5px);
    transition: opacity 0.8s ease-out, transform 0.8s ease-out, filter 0.8s ease-out;
    transition-delay: var(--animation-delay, 0s);

    ${props => props.$isIntersecting && css`
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
        animation: ${floatEffect} 3s infinite ease-in-out alternate; /* Subtle floating effect */
    `}

    &:hover {
        transform: translateY(-5px) scale(1.02); /* Lift and slight scale on hover */
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
`;

export const CollectionImageWrapper = styled.div`
    width: 100%;
    aspect-ratio: 3/4; /* Portrait orientation for cards */
    overflow: hidden;
    position: relative;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        filter: brightness(0.95) grayscale(0.05); /* Very subtle initial filter */
        transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), filter 0.6s ease-out; /* Fluid image transition */
        will-change: transform, filter;
    }

    ${CollectionCard}:hover & img {
        animation: ${imageZoomShift} 0.6s forwards cubic-bezier(0.25, 0.8, 0.25, 1); /* Apply fluid zoom on hover */
    }
`;

export const CollectionOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        180deg,
        ${props => rgba(props.theme.colors.textDark, 0)} 0%,
        ${props => rgba(props.theme.colors.textDark, 0.1)} 50%,
        ${props => rgba(props.theme.colors.textDark, 0.3)} 100%
    ); /* Gradient for subtle overlay */
    transition: background 0.4s ease-out;
    z-index: 1;

    ${CollectionCard}:hover & {
        background: linear-gradient(
            180deg,
            ${props => rgba(props.theme.colors.textDark, 0.05)} 0%,
            ${props => rgba(props.theme.colors.textDark, 0.2)} 50%,
            ${props => rgba(props.theme.colors.textDark, 0.45)} 100%
        ); /* Darker on hover */
    }
`;

export const CollectionContent = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};
    text-align: center;
    z-index: 2;
    transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* Smooth content slide */
    will-change: transform;

    ${CollectionCard}:hover & {
        animation: ${contentSlideUpOnHover} 0.4s forwards cubic-bezier(0.25, 0.8, 0.25, 1); /* Slide up on hover */
    }
`;

export const CollectionTitle = styled.h3`
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.sizes.h4}; /* h4 for card titles */
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.weights.bold};
    margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(2)};
    line-height: 1.2;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.3);
`;

export const CollectionDescription = styled.p`
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.small};
    line-height: 1.6;
    margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)};
    opacity: 0.9; /* Slightly faded */
    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.xSmall};
    }
`;

export const CollectionCtaButton = styled.a`
    display: inline-block;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1}; /* Terracotta button */
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(2.5)} ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)};
    border-radius: 50px;
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.xSmall}; /* Smaller button for cards */
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 0.8px;
    box-shadow: 0 4px 10px ${props => rgba(props.theme.colors.accent1, 0.2)};
    transition: transform 0.3s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out;
    text-decoration: none;
    outline: none;
    cursor: pointer;

    &:hover {
        transform: translateY(-3px);
        background-color: ${(props: { theme: DefaultTheme }) => darken(0.1, props.theme.colors.accent1)};
        box-shadow: 0 6px 15px ${props => rgba(props.theme.colors.accent1, 0.3)};
    }
`;
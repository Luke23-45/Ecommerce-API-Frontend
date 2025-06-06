// src/components/BrandEthos/BrandEthos.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components'; // Import DefaultTheme
import { rgba, darken, lighten } from 'polished';

// --- Keyframes for specific animations ---

// Physics-like bounce for text entrance
const springUp = keyframes`
    0% {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
        filter: blur(8px);
    }
    60% {
        opacity: 1;
        transform: translateY(-5px) scale(1.02);
        filter: blur(0);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
`;

// Subtle float for elements when idle
const floatEffect = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
    100% { transform: translateY(0px); }
`;


// Headline / Section Intro text slide-up & fade-in (now uses springUp)
const textSlideUpFadeIn = springUp; // Re-using springUp for a bouncier feel

// Story block text entrance (now uses springUp, with less bounce)
const storyTextEntrance = keyframes`
    0% {
        opacity: 0;
        transform: translateY(25px) scale(0.98);
        filter: blur(5px);
    }
    70% {
        opacity: 1;
        transform: translateY(-2px) scale(1.01);
        filter: blur(0);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
        filter: blur(0);
    }
`;

// Image/Video filter shift on hover (smoother, more defined transition)
const imageFilterShift = keyframes`
    from { filter: grayscale(0.25) brightness(0.9); }
    to { filter: grayscale(0) brightness(1.15); } /* Brighter, more vibrant on hover */
`;

// Subtle shimmer effect on the CTA button
const shimmer = keyframes`
    0% { background-position: 0% 0; }
    100% { background-position: 0% 0; }
`;


// --- Main Section Container ---
export const BrandEthosSection = styled.section`
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(28)} 0; /* Very generous vertical padding for a grand feel */
    background: linear-gradient(180deg, ${props => darken(0.005, props.theme.colors.primaryNeutral)} 0%, ${props => lighten(0.005, props.theme.colors.primaryNeutral)} 100%); /* Subtle, soft gradient */
    position: relative;
    overflow: hidden;
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textDark}; /* Default text color */
    
    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(14)} 0;
    }
`;

// --- Section Intro Headline & Description ---
export const IntroContainer = styled.div`
    max-width: ${(props: { theme: DefaultTheme }) => props.theme.maxWidth};
    margin: 0 auto ${(props: { theme: DefaultTheme }) => props.theme.spacing(20)}; /* Increased margin below intro for separation */
    padding: 0 ${(props: { theme: DefaultTheme }) => props.theme.containerPadding};
    text-align: center;

    h2 {
        font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.fontFamily};
        font-size: clamp(3rem, 7vw, ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.sizes.h1}); 
        font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.weights.bold};
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textDark};
        margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(5)};
        line-height: 1.05;
        letter-spacing: -1px;
        text-shadow: 2px 2px 5px ${props => rgba(props.theme.colors.textDark, 0.15)};
        
        opacity: 0; /* Initial hidden state for animation */
        animation: ${textSlideUpFadeIn} 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; /* More pronounced spring */
        animation-delay: 0.4s;
    }

    p {
        font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.fontFamily};
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.large};
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.darkGray};
        max-width: 900px;
        margin: 0 auto;
        line-height: 1.8;
        
        opacity: 0;
        animation: ${textSlideUpFadeIn} 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        animation-delay: 0.7s;
    }

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(12)};
        h2 { font-size: clamp(2.2rem, 8vw, ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.sizes.h2}); }
        p { font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.medium}; }
    }
`;

// --- Storytelling Blocks ---
export const StoryBlocksContainer = styled.div`
    display: flex;
    flex-direction: column; /* Stack vertically by default */
    gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(24)}; /* Very generous gap between blocks for clear separation */
    max-width: ${(props: { theme: DefaultTheme }) => props.theme.maxWidth};
    margin: 0 auto;
    padding: 0 ${(props: { theme: DefaultTheme }) => props.theme.containerPadding};

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.laptop}) {
        gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(16)}; /* Reduced gap for laptops */
    }
`;

export const StoryBlock = styled.div<{ $reverse?: boolean; $yOffset: number; $isIntersecting: boolean }>`
    display: flex;
    align-items: center;
    gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(12)}; /* Increased gap between image/video and text */
    flex-direction: ${(props) => (props.$reverse ? 'row-reverse' : 'row')};
    
    /* Parallax effect for the entire block relative to scroll (subtle) */
    transform: translateY(${props => props.$yOffset * 0.02}px); /* Reduced parallax intensity for smoother feel */
    transition: transform 0s; /* No transition for real-time parallax */

    /* Initial hidden state for the whole block for staggered animation */
    opacity: 0;
    transform: translateY(50px); /* Larger initial displacement for a stronger entrance */
    transition: opacity 1s cubic-bezier(0.2, 0.8, 0.2, 1), transform 1s cubic-bezier(0.2, 0.8, 0.2, 1);
    
    ${props => props.$isIntersecting && css`
        opacity: 1;
        transform: translateY(0);
        transition-delay: var(--block-animation-delay, 0s); /* Staggered entry for blocks */
    `}

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.laptop}) {
        flex-direction: column; /* Stack on laptop */
        text-align: center;
        gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(10)};
    }
`;

export const VisualWrapper = styled.div`
    position: relative;
    flex: 1; /* Takes equal space */
    aspect-ratio: 16/10; /* Landscape orientation */
    min-width: 50%; /* Ensure it's large enough to dominate */
    border-radius: 16px; /* More rounded corners for a softer look */
    overflow: hidden;
    box-shadow: 0 15px 60px rgba(0, 0, 0, 0.15); /* More pronounced shadow */
    transition: box-shadow 0.5s ease-out; /* Smooth shadow transition */
    transform-style: preserve-3d; /* For inner 3D effects */

    img, video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        border-radius: 16px;
        /* Initial filter for aesthetic */
        filter: grayscale(0.25) brightness(0.9); /* Slightly more muted, warm */
        transition: filter 0.7s cubic-bezier(0.25, 0.8, 0.25, 1); /* Smoother filter transition */
        will-change: filter;
    }

    ${StoryBlock}:hover & img,
    ${StoryBlock}:hover & video {
        animation: ${imageFilterShift} 0.7s forwards cubic-bezier(0.25, 0.8, 0.25, 1); /* Apply filter shift on hover */
    }

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.laptop}) {
        width: 100%;
        flex: auto;
        aspect-ratio: 16/9; /* Slightly wider on mobile for better fit */
    }
`;

// NEW: Light Wash Overlay for Visuals (subtler, more atmospheric)
export const LightWashOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 16px; /* Match VisualWrapper */
    background: radial-gradient(
        circle at 50% 50%,
        ${(props: { theme: DefaultTheme }) => rgba(props.theme.colors.textLight, 0.03)} 0%, /* Even more subtle inner glow */
        ${(props: { theme: DefaultTheme }) => rgba(props.theme.colors.textLight, 0)} 60%
    );
    opacity: 1; /* Always present, but very subtle */
    pointer-events: none; /* Allows clicks to pass through */
    z-index: 1; /* Above image/video, below text */
    backdrop-filter: blur(1.5px); /* Slightly more blur for atmospheric depth */
    transition: backdrop-filter 0.5s ease-out;

    ${StoryBlock}:hover & {
        backdrop-filter: blur(2.5px); /* Slightly more blur on hover */
    }
`;

export const TextContent = styled.div<{ $isIntersecting: boolean }>`
    flex: 1; /* Takes equal space */
    max-width: 550px; /* Constrain text width for readability, slightly wider */
    
    h3 {
        font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.fontFamily};
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.sizes.h3};
        font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.heading.weights.bold};
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textDark};
        margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)};
        line-height: 1.15;
        letter-spacing: -0.5px;
        text-shadow: 1px 1px 3px ${props => rgba(props.theme.colors.textDark, 0.1)};
        
        opacity: 0; /* Initial hidden state for animation */
        transform: translateY(15px);
        filter: blur(5px); /* Initial blur for fluid entrance */
        transition: opacity 0.7s ease-out, transform 0.7s ease-out, filter 0.7s ease-out;
        transition-delay: var(--animation-delay, 0s); /* Controlled by JS */
    }

    p {
        font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.fontFamily};
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.medium};
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.darkGray};
        line-height: 1.8;
        margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(10)};

        opacity: 0;
        transform: translateY(15px);
        filter: blur(5px); /* Initial blur */
        transition: opacity 0.7s ease-out, transform 0.7s ease-out, filter 0.7s ease-out;
        transition-delay: calc(var(--animation-delay, 0s) + 0.15s);
    }

    ${props => props.$isIntersecting && css`
        h3 {
            animation: ${storyTextEntrance} 1.2s cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards var(--animation-delay, 0s); /* Smooth, slight bounce */
        }
        p {
            animation: ${storyTextEntrance} 1.2s cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards calc(var(--animation-delay, 0s) + 0.2s);
        }
    `}

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.laptop}) {
        max-width: 100%;
        text-align: center;
        margin-top: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)};
        p { font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.base}; }
    }
`;

export const ReadMoreButton = styled.a<{ $isIntersecting: boolean }>`
    display: inline-block;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)} ${(props: { theme: DefaultTheme }) => props.theme.spacing(9)};
    border-radius: 50px;
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.small};
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 1.2px;
    box-shadow: 0 8px 20px ${props => rgba(props.theme.colors.accent1, 0.3)};
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.4s ease-out, box-shadow 0.4s ease-out, letter-spacing 0.3s ease-out;
    pointer-events: auto;
    text-decoration: none;
    outline: none;
    cursor: pointer;

    /* Adding subtle shimmer background */
    background-image: linear-gradient(120deg, ${props => rgba(props.theme.colors.accent1, 0.8)} 0%, ${props => props.theme.colors.accent1} 20%, ${props => rgba(props.theme.colors.accent1, 0.8)} 40%, ${props => rgba(props.theme.colors.accent1, 0.9)} 60%, ${props => props.theme.colors.accent1} 80%, ${props => rgba(props.theme.colors.accent1, 0.8)} 100%);
    background-size: 200% auto; /* Make background larger than button to allow shimmer */
    background-position: 0% 0; /* Initial position */
    transition: all 1.s linear;
    
    /* &:hover {
        transform: translateY(-8px);
        background-color: ${(props: { theme: DefaultTheme }) => darken(0.15, props.theme.colors.accent1)};
        box-shadow: 0 12px 30px ${props => rgba(props.theme.colors.accent1, 0.45)};
        letter-spacing: 1.6px;
        /* animation: ${shimmer} 1.5s infinite linear;  
    } */
    
    /* Animation for initial load if parent is intersecting */
    opacity: 0;
    transform: translateY(15px);
    filter: blur(5px); /* Initial blur for fluid entrance */
    transition: opacity 0.7s ease-out, transform 0.7s ease-out, filter 0.7s ease-out;
    transition-delay: calc(var(--animation-delay, 0s) + 0.3s);

    ${props => props.$isIntersecting && css`
        animation: ${storyTextEntrance} 1.2s cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards calc(var(--animation-delay, 0s) + 0.3s);
    `}
`;
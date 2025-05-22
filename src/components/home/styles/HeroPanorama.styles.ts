// src/components/HeroPanorama/HeroPanorama.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { darken, rgba } from 'polished'; // Ensure 'polished' is installed

// Keyframes for text animations
const textSlideUp = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const pulseRing = keyframes`
    0% {
        transform: scale(0.3);
        opacity: 0.7;
    }
    100% {
        transform: scale(1.8);
        opacity: 0;
    }
`;

const scrollArrowBounce = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
`;

export const StyledHeroPanorama = styled.section<{ $yOffset: number }>`
    position: relative;
    width: 100%;
    height: 90vh; /* Increased height for more drama */
    min-height: 550px; /* Minimum height for smaller screens */
    overflow: hidden; /* Crucial for parallax and containing visuals */
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.colors.textLight}; /* Default text color on dark background */

    /* Responsive adjustments */
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        height: 75vh;
        min-height: 450px;
        align-items: flex-end; /* Text bottom left on mobile */
        justify-content: flex-start;
        padding-bottom: 40px;
        text-align: left;
    }
`;

// Shared styles for video and image backgrounds
const BackgroundVisuals = css<{ $yOffset: number }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -2; /* Below content and overlay */
    filter: brightness(0.7) saturate(1.1); /* Deeper, richer colors */
    transform: translateY(${props => props.$yOffset * 0.3}px); /* Subtle parallax effect */
    transition: transform 0s; /* No transition for real-time parallax */
`;

export const HeroVideo = styled.video`
    ${BackgroundVisuals}
    opacity: ${props => props.$yOffset === 0 ? 0 : 1}; /* Initial fade in on component mount */
    transition: opacity 1s ease-out; /* Smooth fade-in once video loads */
`;

export const HeroImage = styled.img`
    ${BackgroundVisuals}
    opacity: 1; /* Always visible if video not loaded */
`;

export const HeroOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1; /* Above video/image, below content */
    /* Subtle gradient to enhance vibrancy and text contrast */
    background: linear-gradient(
        to top,
        ${(props) => rgba(props.theme.colors.textDark, 0.4)} 0%,
        ${(props) => rgba(props.theme.colors.textDark, 0.1)} 50%,
        ${(props) => rgba(props.theme.colors.textDark, 0.0)} 100%
    );

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        background: linear-gradient(
            to top,
            ${(props) => rgba(props.theme.colors.textDark, 0.6)} 0%,
            ${(props) => rgba(props.theme.colors.textDark, 0.3)} 70%,
            ${(props) => rgba(props.theme.colors.textDark, 0.0)} 100%
        );
    }
`;


export const HeroContent = styled.div<{ $yOffset: number }>`
    z-index: 1;
    max-width: 1100px; /* Increased max width for more expansive text */
    padding: 0 ${(props) => props.theme.containerPadding};
    text-align: center;
    transform: translateY(${props => props.$yOffset * -0.1}px); /* Subtle opposing parallax for text */
    transition: transform 0s;

    /* Initial animation for content elements */
    & > * {
        opacity: 0;
        animation: ${textSlideUp} 0.8s ease-out forwards;
        animation-delay: var(--animation-delay); /* Controlled by JS */
    }

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        text-align: left;
        padding: 0 30px;
        /* Animation adjustments for mobile */
        & > * {
            animation: ${fadeIn} 0.8s ease-out forwards;
        }
    }
`;

export const HeroHeadline = styled.h2`
    font-family: ${(props) => props.theme.typography.heading.fontFamily};
    font-size: ${(props) => props.theme.typography.heading.sizes.h1};
    font-weight: ${(props) => props.theme.typography.heading.weights.extraBold};
    line-height: 1.15; /* Slightly tighter for impact */
    margin-bottom: 25px;
    color: ${(props) => props.theme.colors.textLight}; /* White text for vibrancy against overlay */
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3); /* Stronger, more artistic shadow */

    span {
        display: block; /* Force new line for each phrase */
    }

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        font-size: ${(props) => props.theme.typography.heading.sizes.h2};
        margin-bottom: 15px;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    }
`;

export const HeroSubheadline = styled.p`
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    font-size: ${(props) => props.theme.typography.body.sizes.large};
    font-weight: ${(props) => props.theme.typography.body.weights.regular};
    margin-bottom: 40px;
    color: ${(props) => props.theme.colors.textLight}; /* White text */
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        font-size: ${(props) => props.theme.typography.body.sizes.base};
        margin-bottom: 25px;
    }
`;

export const HeroCtaButton = styled.a`
    display: inline-block;
    background-color: ${(props) => props.theme.colors.accent1}; /* Terracotta */
    color: ${(props) => props.theme.colors.textLight};
    padding: 20px 45px; /* Larger padding */
    border-radius: 50px; /* Fully rounded for a softer, inviting look */
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    font-size: ${(props) => props.theme.typography.body.sizes.base};
    font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
    text-transform: uppercase;
    letter-spacing: 1.8px; /* More prominent letter spacing */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out;

    &:hover {
        transform: translateY(-8px); /* More pronounced lift */
        background-color: ${props => darken(0.1, props.theme.colors.accent1)};
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
    }

    &:active {
        transform: translateY(-3px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        padding: 15px 30px;
        font-size: ${(props) => props.theme.typography.body.sizes.small};
        letter-spacing: 1.2px;
        border-radius: 40px;
        transform: translateY(0); /* Disable on mobile */
        &:hover {
            transform: translateY(0);
        }
    }
`;

// Hotspot Reworked for Beauty
export const Hotspot = styled.div<{ $left: number; $top: number; $visible: boolean }>`
    position: absolute;
    left: ${props => props.$left}%;
    top: ${props => props.$top}%;
    width: 28px; /* Slightly larger */
    height: 28px;
    background-color: ${(props) => rgba(props.theme.colors.accent1, 0.9)}; /* More opaque terracotta */
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid ${(props) => props.theme.colors.textLight}; /* Stronger white border */
    transform: translate(-50%, -50%);
    transition: transform 0.2s ease-out, background-color 0.2s ease-out;
    z-index: 5; /* Above content */
    opacity: 0; /* Hidden by default */
    animation: ${fadeIn} 0.5s ease-out forwards var(--animation-delay, 0s); /* Fade in with delay */

    &::before { /* Inner pulsating ring */
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid ${(props) => rgba(props.theme.colors.textLight, 0.7)};
        border-radius: 50%;
        animation: ${pulseRing} 2s infinite cubic-bezier(0.24, 0, 0.38, 1);
    }

    &:hover {
        transform: translate(-50%, -50%) scale(1.1); /* Enlargen on hover */
        background-color: ${props => darken(0.1, rgba(props.theme.colors.accent1, 0.9))};
        &::before {
            animation-play-state: paused; /* Pause inner pulse */
        }
    }

    /* Hotspot on active state (for tooltip visibility management) */
    ${props => props.$visible && css`
        opacity: 1; /* Keep visible when tooltip is open */
        transform: translate(-50%, -50%) scale(1.1);
        &::before { animation-play-state: paused; }
    `}

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        display: none; /* Hide hotspots on mobile for cleaner look */
    }
`;

export const HotspotTooltip = styled.div<{ $left: number; $top: number; }>`
    position: absolute;
    background-color: ${(props) => rgba(props.theme.colors.textLight, 0.95)}; /* Semi-transparent white */
    backdrop-filter: blur(5px); /* Frosted glass effect */
    color: ${(props) => props.theme.colors.textDark};
    padding: 18px 25px;
    border-radius: 10px; /* Softer corners */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18); /* Stronger shadow for depth */
    min-width: 220px;
    max-width: 300px;
    text-align: left;
    z-index: 10;
    top: calc(100% + 20px); /* More space from hotspot */
    left: 50%;
    transform: translateX(-50%) translateY(10px); /* Initial slide down */
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;

    ${Hotspot}:hover & {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0); /* Slide up on hover */
    }

    h4 {
        font-family: ${(props) => props.theme.typography.heading.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.base};
        font-weight: ${(props) => props.theme.typography.heading.weights.bold};
        margin-bottom: 8px;
        line-height: 1.3;
        color: ${(props) => props.theme.colors.accent1}; /* Terracotta for product names */
    }

    p {
        font-size: ${(props) => props.theme.typography.body.sizes.small};
        margin-bottom: 15px;
        color: ${(props) => props.theme.colors.darkGray};
    }

    button {
        background-color: ${(props) => props.theme.colors.accent2}; /* Sage green for Quick Shop */
        color: ${(props) => props.theme.colors.textLight};
        padding: 10px 18px;
        border-radius: 5px;
        font-size: ${(props) => props.theme.typography.body.sizes.xsmall};
        font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: background-color 0.2s ease-out, transform 0.2s ease-out;

        &:hover {
            background-color: ${props => darken(0.1, props.theme.colors.accent2)};
            transform: translateY(-2px);
        }
    }
`;

export const ScrollIndicator = styled.div`
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: ${(props) => props.theme.colors.textLight};
    font-size: ${(props) => props.theme.typography.body.sizes.xsmall};
    font-weight: ${(props) => props.theme.typography.body.weights.medium};
    letter-spacing: 1px;
    text-transform: uppercase;
    z-index: 1; /* Above video/overlay */
    animation: ${fadeIn} 1s ease-out forwards 2s; /* Fade in after hero content */

    span {
        margin-bottom: 8px;
    }

    svg {
        font-size: 24px;
        animation: ${scrollArrowBounce} 1.5s infinite;
        color: ${(props) => props.theme.colors.accent1}; /* Terracotta arrow */
    }

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        display: none; /* Hide scroll indicator on mobile */
    }
`;
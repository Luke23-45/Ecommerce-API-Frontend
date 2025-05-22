// src/components/GrandMarquee/PrimaryNav/PrimaryNav.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { darken } from 'polished'; // <-- HERE IS THE IMPORT!

// Keyframes for smooth transitions
const slideDownFadeIn = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const PrimaryNavContainer = styled.div`
    grid-column: 1 / 2;
    justify-self: start;
    height: 100%; /* Important for MegaMenu positioning */
    display: flex; /* For consistent nav list centering */
    align-items: center;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        grid-column: auto;
        justify-self: center;
        /* Mobile menu button will typically replace this desktop nav here */
        display: none;
    }
`;

export const NavList = styled.ul`
    display: flex;
    gap: 45px; /* Increased space for more breathability */
    align-items: center;
    height: 100%; /* Inherit from container */
`;

export const NavItem = styled.li`
    position: relative; /* For absolute positioning of MegaMenu */
    height: 100%;
    display: flex; /* To center the link text vertically */
    align-items: center;

    a {
        padding: 0; /* Remove vertical padding as height is managed by parent */
        position: relative;
        font-family: ${(props) => props.theme.typography.body.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.small};
        font-weight: ${(props) => props.theme.typography.body.weights.medium};
        text-transform: uppercase;
        letter-spacing: 1px;
        color: ${(props) => props.theme.colors.textDark};
        transition: color 0.2s ease-in-out; /* Only color transition initially */
        
        &::after {
            content: '';
            position: absolute;
            bottom: -5px; /* Position slightly below text */
            left: 0;
            width: 0;
            height: 2px;
            background-color: ${(props) => props.theme.colors.accent1}; /* Terracotta underline */
            transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Smoother width transition */
        }
    }

    &:hover > a {
        color: ${(props) => props.theme.colors.accent1}; /* Change color on hover */
        
        &::after {
            width: 100%; /* Expand underline */
        }
    }
`;

// --- Mega Menu Specific Styles ---
export const MegaMenuOverlay = styled.div<{ $isVisible: boolean }>`
    position: fixed; /* Fixed position for immersive, full-width effect */
    top: 112px; /* GrandMarquee (80px) + SpotlightBanner (32px) height */
    left: 0;
    width: 100vw;
    height: calc(100vh - 112px); /* Fill remaining viewport height */
    background-color: ${props => darken(0.01, props.theme.colors.primaryNeutral)}; /* Slightly darker neutral for distinction */
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    padding: 40px ${props => props.theme.containerPadding};
    opacity: 0;
    visibility: hidden;
    transform: translateY(-20px); /* Initial upward shift */
    transition: opacity 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), visibility 0.4s;
    z-index: 90; /* Below fixed headers, above main content */
    display: grid;
    grid-template-columns: repeat(5, 1fr); /* More columns for rich content */
    gap: 40px; /* Ample spacing between columns */
    overflow-y: auto; /* Enable scrolling if content overflows on smaller screens */

    ${(props) =>
        props.$isVisible &&
        css`
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        `}
    
    @media (max-width: ${(props) => props.theme.breakpoints.laptop}) {
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
        padding: 30px ${props => props.theme.containerPadding};
    }

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        grid-template-columns: 1fr; /* Stack on mobile */
        padding: 20px ${props => props.theme.containerPadding};
        height: auto; /* Content-driven height on mobile */
        position: static; /* No fixed overlay behavior */
        box-shadow: none;
        transform: none;
        animation: none;
        display: ${props => props.$isVisible ? 'grid' : 'none'};
    }
`;

export const MegaMenuSection = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 180px; /* Ensure content columns don't shrink too much */

    h3 {
        font-family: ${(props) => props.theme.typography.heading.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.medium}; /* E.g., 18px */
        font-weight: ${(props) => props.theme.typography.heading.weights.bold};
        color: ${(props) => props.theme.colors.textDark};
        margin-bottom: 20px;
        padding-bottom: 5px;
        border-bottom: 1px solid ${(props) => props.theme.colors.lightGray};
        text-transform: uppercase;
        letter-spacing: 0.8px;
    }

    a {
        font-size: ${(props) => props.theme.typography.body.sizes.small}; /* 14px */
        color: ${(props) => props.theme.colors.darkGray};
        margin-bottom: 12px; /* More space between links */
        transition: color 0.2s ease-in-out;
        
        &:hover {
            color: ${(props) => props.theme.colors.accent1};
        }
    }
`;

export const MegaMenuVisualSpotlight = styled.div`
    grid-column: span 2; /* Span two columns for larger visual impact */
    display: flex;
    flex-direction: column;
    background-color: ${props => darken(0.015, props.theme.colors.lightGray)};
    border-radius: 8px;
    overflow: hidden; /* For rounded image corners */
    transition: box-shadow 0.3s ease-out;

    &:hover {
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    @media (max-width: ${(props) => props.theme.breakpoints.laptop}) {
        grid-column: span 1; /* Go back to 1 column for smaller screens */
    }

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        grid-column: auto;
    }
`;

export const SpotlightImage = styled.img`
    width: 100%;
    height: 250px; /* Fixed height for consistency */
    object-fit: cover;
    display: block;
    filter: brightness(0.9); /* Subtle dimming for text readability if overlayed */
    transition: transform 0.3s ease-out; /* Zoom on hover */

    ${MegaMenuVisualSpotlight}:hover & {
        transform: scale(1.05);
    }

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        height: 180px;
    }
`;

export const SpotlightContent = styled.div`
    padding: 25px;
    display: flex;
    flex-direction: column;
    flex-grow: 1; /* Take up remaining space if image is fixed height */

    h4 {
        font-family: ${(props) => props.theme.typography.heading.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.large};
        font-weight: ${(props) => props.theme.typography.heading.weights.bold};
        color: ${(props) => props.theme.colors.textDark};
        margin-bottom: 10px;
        line-height: 1.3;
    }

    p {
        font-family: ${(props) => props.theme.typography.body.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.small};
        color: ${(props) => props.theme.colors.darkGray};
        margin-bottom: 20px;
        line-height: 1.5;
    }

    a {
        margin-top: auto; /* Push CTA to bottom */
        display: inline-block;
        background-color: ${(props) => props.theme.colors.accent2}; /* Sage green for visual spotlights */
        color: ${(props) => props.theme.colors.textLight};
        padding: 10px 20px;
        border-radius: 5px;
        font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
        text-transform: uppercase;
        letter-spacing: 0.8px;
        transition: background-color 0.2s ease-out, transform 0.2s ease-out;

        &:hover {
            background-color: ${props => darken(0.1, props.theme.colors.accent2)};
            transform: translateY(-2px);
        }
    }
`;
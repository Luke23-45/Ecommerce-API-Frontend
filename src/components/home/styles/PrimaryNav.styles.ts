// src/components/home/PrimaryNav/PrimaryNav.styles.ts
import styled, { css, keyframes,type DefaultTheme } from 'styled-components';
import { darken, rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const slideInFromLeft = keyframes`
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
`;

const slideOutToLeft = keyframes`
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(-100%); opacity: 0; }
`;

const fadeInOverlay = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;


export const FullscreenMenuOverlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${rgba('black', 0.6)}; /* Dim overlay */
  z-index: 999999 !important;
    display: flex;
    justify-content: flex-start;
    align-items: stretch; /* Stretch sidebar height */
    opacity: 0;
    visibility: hidden;
    /* Controlled animation for the overlay itself */
    transition: opacity 0.3s ease, visibility 0.3s ease; 

    ${(props) => props.$isOpen && css`
        opacity: 1;
        visibility: visible;
        transition: opacity 0.3s ease, visibility 0s; /* Make visible immediately for menu animation to run */
    `}
    
    @media (hover: none) { /* For touch devices, sometimes full-width background opacity should be less jarring */
        background-color: ${rgba('black', 0.4)};
    }
`;

export const MenuContent = styled.nav<{ $isOpen: boolean }>`
    width: 320px; /* FIX: Slightly wider menu drawer for comfortable tapping */
    background-color: ${(props) => getTheme(props).colors.textLight}; /* FIX: Pure white for pristine menu background */
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    padding: ${(props) => getTheme(props).spacing(8)} ${(props) => getTheme(props).spacing(6)};
    display: flex;
    flex-direction: column;
    overflow-y: auto; /* Scrollable menu content */
    
    transform: translateX(-100%); /* Start off-screen */
    /* FIX: Controlled animation for the menu content */
    transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); 

    ${(props) => props.$isOpen && css`
        transform: translateX(0); /* Slide in */
    `}
    /* Ensure it disappears instantly but fades back in if closed to prevent flicker */
    ${(props) => !props.$isOpen && css`
        transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        transform: translateX(-100%);
    `}

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        width: 85%; /* Wider on smaller screens for mobile ergonomics */
        max-width: 400px; /* Cap width for larger tablets in portrait */
    }
`;

export const CloseButton = styled.button`
    position: absolute;
    top: ${(props) => getTheme(props).spacing(4)}; /* Standard position */
    right: ${(props) => getTheme(props).spacing(4)};
    background: none;
    border: none;
    font-size: ${(props) => getTheme(props).typography.body.sizes.large}; /* Standard icon size */
    color: ${(props) => getTheme(props).colors.darkGray}; /* FIX: Muted color normally */
    cursor: pointer;
    z-index: 10;
    padding: ${(props) => getTheme(props).spacing(2)}; /* FIX: Make clickable area larger with padding */
    border-radius: 50%; /* FIX: Circle clickable area */
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1); /* FIX: Smooth transition */

    &:hover {
        color: ${(props) => getTheme(props).colors.accent1}; /* FIX: Vibrant accent on hover */
        background-color: ${(props) => rgba(getTheme(props).colors.accent1, 0.1)}; /* FIX: Subtle background highlight */
        transform: rotate(90deg); /* FIX: Engaging hover animation */
    }
`;

export const NavSectionList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    margin-bottom: ${(props) => getTheme(props).spacing(6)}; /* Space between sections */
    
    &:first-child { /* Fix: No top margin for first section */
        margin-top: ${(props) => getTheme(props).spacing(4)};
    }
`;

export const NavSectionTitle = styled.h3`
    font-family: ${(props) => getTheme(props).typography.heading.fontFamily}; /* FIX: Use heading font for aesthetic */
    font-size: ${(props) => getTheme(props).typography.body.sizes.large};
    font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
    color: ${(props) => getTheme(props).colors.textDark};
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
    text-transform: uppercase;
    letter-spacing: 0.8px; /* FIX: More pronounced letter spacing */
    border-bottom: 1px solid ${(props) => getTheme(props).colors.lightGray}; /* FIX: Consistent separator color */
    padding-bottom: ${(props) => getTheme(props).spacing(2)};
`;

export const NavLinkItem = styled.li`
    margin-bottom: ${(props) => getTheme(props).spacing(2)}; /* Consistent spacing between items */
    a {
        font-family: ${(props) => getTheme(props).typography.body.fontFamily};
        font-size: ${(props) => getTheme(props).typography.body.sizes.medium};
        color: ${(props) => getTheme(props).colors.textDark};
        text-decoration: none;
        display: block;
        padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(3)}; /* FIX: More padding for tapping comfort */
        border-radius: 4px;
        transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        
        &:hover {
            background-color: ${(props) => rgba(getTheme(props).colors.accent1, 0.08)};
            color: ${(props) => getTheme(props).colors.accent1};
            transform: translateX(5px); /* Gentle slide on hover */
        }
    }
    /* Sub-category link styling */
    &.sub-category a {
        padding-left: ${(props) => getTheme(props).spacing(6)}; /* FIX: Increased indentation for sub-items */
        font-size: ${(props) => getTheme(props).typography.body.sizes.small};
        color: ${(props) => getTheme(props).colors.darkGray};
        font-weight: ${(props) => getTheme(props).typography.body.weights.regular}; /* Reset font weight for sub-links */
        &:hover {
            color: ${(props) => getTheme(props).colors.textDark}; /* Darker text on hover */
        }
    }
`;
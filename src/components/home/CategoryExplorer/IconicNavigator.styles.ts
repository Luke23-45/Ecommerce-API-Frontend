// src/components/CategoryExplorer/IconicNavigator.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const iconScalePulse = keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
`;

export const NavigatorContainer = styled.nav`
    flex: 0 0 180px; /* Fixed width for desktop Iconic Navigator */
    background-color: ${(props) => getTheme(props).colors.primaryNeutral};
    border-radius: 16px 0 0 16px; /* Rounded only on left */
    padding: ${(props) => getTheme(props).spacing(8)} 0;
    overflow-y: auto; /* Enable scrolling for many categories */
    scrollbar-width: none; /* Hide scrollbar for Firefox */
    -ms-overflow-style: none;  /* Hide scrollbar for IE and Edge */
    
    &::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, Opera */
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex: 1 1 auto; /* Take full width on mobile */
        height: auto;
        border-radius: 16px 16px 0 0; /* Rounded on top corners on mobile */
        padding: ${(props) => getTheme(props).spacing(4)} 0;
        overflow-y: hidden;
        overflow-x: auto; /* Horizontal scroll for icons */
        white-space: nowrap; /* Prevent icons from wrapping */
        box-shadow: 0 5px 15px rgba(0,0,0,0.05); /* Subtle shadow on mobile */
    }
`;

export const IconList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column; /* Vertical on desktop */

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: row; /* Horizontal on mobile */
        padding: 0 ${(props) => getTheme(props).spacing(4)}; /* Padding for mobile horizontal scroll */
        gap: ${(props) => getTheme(props).spacing(4)}; /* Space between items on mobile */
    }
`;

export const IconCell = styled.li<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(6)}; /* Ample padding */
    cursor: pointer;
    position: relative; /* For active indicator */
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    color: ${(props) => props.$isActive ? getTheme(props).colors.accent1 : getTheme(props).colors.darkGray}; /* Icon/text color */
    background-color: ${(props) => props.$isActive ? rgba(getTheme(props).colors.accent1, 0.08) : 'transparent'};
    
    /* Active indicator bar */
    &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 4px;
        background-color: ${(props) => props.$isActive ? getTheme(props).colors.accent1 : 'transparent'};
        transition: background-color 0.3s ease-out;
    }

    &:hover {
        background-color: ${(props) => rgba(getTheme(props).colors.accent1, 0.05)};
        color: ${(props) => getTheme(props).colors.accent1};
        transform: translateX(5px); /* Subtle slide on hover */

        svg {
            animation: ${iconScalePulse} 0.5s ease-out;
        }
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column; /* Icon above text */
        justify-content: center;
        align-items: center;
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(3)}; /* Smaller padding for mobile */
        min-width: 80px; /* Minimum width for icon cell on mobile */
        border-radius: 8px; /* Rounded corners for mobile cells */

        &::before { /* Horizontal indicator for mobile */
            height: 4px;
            width: 100%;
            bottom: 0;
            top: auto;
            left: 0;
            border-radius: 0 0 8px 8px;
        }
        &:hover {
            transform: translateY(0); /* Disable horizontal slide on mobile */
            background-color: ${(props) => rgba(getTheme(props).colors.accent1, 0.1)};
        }
        svg { margin-bottom: ${(props) => getTheme(props).spacing(1)}; } /* Space below icon */
    }
`;

export const IconPlaceholder = styled.div`
    font-size: 28px; /* Larger icon size */
    margin-right: ${(props) => getTheme(props).spacing(3)}; /* Space between icon and text */
    min-width: 28px; /* Reserve space */
    min-height: 28px; /* Reserve space */
    color: inherit; /* Inherit color from parent IconCell */

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        margin-right: 0;
        font-size: 24px;
        min-width: 24px;
        min-height: 24px;
    }
`;

export const IconLabel = styled.span<{ $isActive: boolean }>`
    font-family: ${(props) => getTheme(props).typography.body.fontFamily};
    font-size: ${(props) => getTheme(props).typography.body.sizes.small};
    font-weight: ${(props) => getTheme(props).typography.body.weights.medium};
    white-space: nowrap; /* Prevent wrapping for concise labels */
    letter-spacing: 0.5px;
    color: inherit; /* Inherit color from parent IconCell */

    /* Subtly visible by default, full opacity for active/hover */
    opacity: 0.7;
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;

    ${IconCell}:hover & {
        opacity: 1;
    }
    ${props => props.$isActive && css`
        opacity: 1; /* Always visible for active state */
        font-weight: ${getTheme(props).typography.body.weights.semiBold};
    `}
`;
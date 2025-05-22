// src/components/CategoryNavigator/CategoryNavigator.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const iconScalePulse = keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
`;

export const NavigatorContainer = styled.nav`
    flex: 0 0 180px; /* Fixed width for desktop Iconic Navigator */
    
    position: sticky;
    top: 155px; /* Sticks right below the fixed headers (approx. total fixed header height) */
    // REMOVED: bottom: ${(props) => getTheme(props).spacing(8)}; /* This line was preventing indefinite stickiness */
    
    align-self: flex-start; /* Aligns to top of flex container, crucial for its positioning flow */
    
    background-color: ${(props) => props.theme.colors.primaryNeutral};
    border-radius: 16px; /* Rounded corners for the whole navigator panel */
    padding: ${(props) => getTheme(props).spacing(8)} 0;
    overflow-y: auto; /* Enable scrolling for many categories within the panel */
    scrollbar-width: none; /* Hide scrollbar for Firefox */
    -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
    box-shadow: 0 5px 15px rgba(0,0,0,0.05); /* Subtle shadow for floating effect */
    
    &::-webkit-scrollbar {
        display: none; /* Hide scrollbar for Chrome, Safari, Opera */
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        position: static; /* Disable sticky on smaller screens, revert to static */
        flex: 1 1 auto; /* Allows it to take full width when stacked */
        border-radius: 16px 16px 0 0;
        padding: ${(props) => getTheme(props).spacing(4)} 0;
        overflow-y: hidden;
        overflow-x: auto; /* Enable horizontal scroll for icon list on mobile */
        white-space: nowrap; /* Prevent icon items from wrapping in horizontal scroll */
        box-shadow: none;
        width: 100%;
        margin-bottom: ${(props) => getTheme(props).spacing(4)}; /* Space before content areas on mobile */
    }
`;

export const IconList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        flex-direction: row;
        padding: 0 ${(props) => getTheme(props).spacing(4)};
        gap: ${(props) => getTheme(props).spacing(4)};
    }
`;

export const IconCell = styled.li<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(6)};
    cursor: pointer;
    position: relative;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    color: ${(props) => props.$isActive ? getTheme(props).colors.accent1 : getTheme(props).colors.darkGray};
    background-color: ${(props) => props.$isActive ? rgba(getTheme(props).colors.accent1, 0.08) : 'transparent'};
    
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
        transform: translateX(5px);

        svg {
            animation: ${iconScalePulse} 0.5s ease-out;
        }
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(3)};
        min-width: 80px;
        border-radius: 8px;

        &::before {
            height: 4px;
            width: 100%;
            bottom: 0;
            top: auto;
            left: 0;
            border-radius: 0 0 8px 8px;
        }
        &:hover {
            transform: translateY(0);
            background-color: ${(props) => rgba(getTheme(props).colors.accent1, 0.1)};
        }
        svg { margin-bottom: ${(props) => getTheme(props).spacing(1)}; }
    }
`;

export const IconPlaceholder = styled.div`
    font-size: 28px;
    margin-right: ${(props) => getTheme(props).spacing(3)};
    min-width: 28px;
    min-height: 28px;
    color: inherit;

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
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
    white-space: nowrap;
    letter-spacing: 0.5px;
    color: inherit;

    opacity: 0.7;
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;

    ${IconCell}:hover & {
        opacity: 1;
    }
    ${props => props.$isActive && css`
        opacity: 1;
        font-weight: ${getTheme(props).typography.body.weights.semiBold};
    `}
`;
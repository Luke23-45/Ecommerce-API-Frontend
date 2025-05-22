// src/components/CategorySection/CategorySection.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken } from 'polished';
import { StyledProductCard } from '../ProductCard/ProductCard.styles';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const textEntrance = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const StyledCategorySection = styled.section<{ $isIntersecting: boolean }>`
    padding: ${(props) => getTheme(props).spacing(10)} ${(props) => getTheme(props).containerPadding};
    background-color: ${(props) => getTheme(props).colors.textLight};
    border-radius: 16px;
    /* margin-bottom is handled by ScrollableContent gap property now */
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
    position: relative;
    
    /* Ensure flex item behavior (it's inside ScrollableContent which is a flex-column) */
    flex-shrink: 0; /* Prevents it from shrinking below its content */

    /* Animation for the whole section to come into view */
    opacity: 0;
    transform: translateY(30px);
    ${props => props.$isIntersecting && css`
        animation: ${textEntrance} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        animation-delay: var(--section-animation-delay, 0s);
    `}

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        padding: ${(props) => getTheme(props).spacing(8)} ${(props) => getTheme(props).containerPadding};
        /* mobile borders/shadows */
        border-radius: 16px; /* Each section gets rounded corners */
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        /* Remove explicit top/bottom margin and use flex gap on parent ScrollableContent */
        margin-top: ${(props) => getTheme(props).spacing(4)}; 
        &:first-child { margin-top: 0; }
        &:last-child { margin-bottom: 0; }
    }
`;

export const CategoryTitle = styled.h3<{ $isIntersecting: boolean }>`
    font-family: ${(props) => getTheme(props).typography.heading.fontFamily};
    font-size: ${(props) => getTheme(props).typography.heading.sizes.h3};
    font-weight: ${(props) => getTheme(props).typography.heading.weights.bold};
    color: ${(props) => getTheme(props).colors.textDark};
    margin-bottom: ${(props) => getTheme(props).spacing(8)};
    text-align: left;
    line-height: 1.2;
    letter-spacing: -0.5px;
    padding-bottom: ${(props) => getTheme(props).spacing(2)};
    border-bottom: 1px solid ${(props) => getTheme(props).colors.lightGray};

    opacity: 0;
    transform: translateY(10px);
    ${props => props.$isIntersecting && css`
        animation: ${textEntrance} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        animation-delay: calc(var(--section-animation-delay, 0s) + 0.2s);
    `}

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        font-size: ${(props) => getTheme(props).typography.body.sizes.large};
        margin-bottom: ${(props) => getTheme(props).spacing(6)};
    }
`;

export const ProductsGrid = styled.div<{ $isIntersecting: boolean }>`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${(props) => getTheme(props).spacing(6)};

    ${StyledProductCard} {
        width: 100%;
        height: auto;
        aspect-ratio: 0.7;

        ${props => props.$isIntersecting && css`
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            animation: ${keyframes`
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            `} 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards var(--card-animation-delay, 0s);
        `}
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        grid-template-columns: repeat(2, 1fr);
        gap: ${(props) => getTheme(props).spacing(5)};
    }
    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        grid-template-columns: 1fr;
        gap: ${(props) => getTheme(props).spacing(4)};
    }
`;

export const ViewAllLink = styled.a<{ $isIntersecting: boolean }>`
    display: inline-block;
    margin-top: ${(props) => getTheme(props).spacing(8)};
    font-family: ${(props) => getTheme(props).typography.body.fontFamily};
    font-size: ${(props) => getTheme(props).typography.body.sizes.small};
    font-weight: ${(props) => getTheme(props).typography.body.weights.semiBold};
    color: ${(props) => getTheme(props).colors.accent1};
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding-bottom: 2px;
    border-bottom: 1px solid ${(props) => getTheme(props).colors.accent1};
    transition: all 0.3s ease-out;

    opacity: 0;
    transform: translateY(10px);
    ${props => props.$isIntersecting && css`
        animation: ${textEntrance} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        animation-delay: calc(var(--section-animation-delay, 0s) + 0.4s);
    `}

    &:hover {
        color: ${(props) => darken(0.1, getTheme(props).colors.accent1)};
        border-bottom-color: ${(props) => darken(0.1, getTheme(props).colors.accent1)};
        transform: translateY(-2px);
    }
    
    @media (max-width: ${(props) => getTheme(props).breakpoints.laptop}) {
        text-align: center;
        width: 100%;
        margin-top: ${(props) => getTheme(props).spacing(6)};
        margin-bottom: ${(props) => getTheme(props).spacing(4)};
    }
`;
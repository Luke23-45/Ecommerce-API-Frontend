// src/components/Shared/ProductCard/ProductCard.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// --- Keyframes for basic card interaction ---
const cardHoverEffect = keyframes`
  from { transform: translateY(0); box-shadow: 0 8px 25px ${props => rgba(getTheme(props).colors.textDark, 0.06)}; }
  to { transform: translateY(-10px) scale(1.02); box-shadow: 0 15px 40px ${props => rgba(getTheme(props).colors.textDark, 0.12)}; }
`;

const imageHoverEffect = keyframes`
  from { transform: scale(1.05); filter: brightness(1) saturate(1); }
  to { transform: scale(1.15); filter: brightness(0.8) saturate(1.3) contrast(1.1); }
`;

const badgePop = keyframes`
  0% { transform: scale(0.8) rotate(-10deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(5deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`;


export const StyledProductCard = styled.div`
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight}; /* White card background */
    border-radius: 16px; /* Softer, more premium radius */
    overflow: hidden;
    box-shadow: 0 8px 25px ${props => rgba(getTheme(props).colors.textDark, 0.06)}; /* Initial softer shadow */
    position: relative;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); /* Smoother overall transition */
    will-change: transform, box-shadow;

    &:hover {
        animation: ${cardHoverEffect} 0.4s forwards ease-out; /* Apply lift and shadow */
    }

    /* Initial state for cards appearing (to be used with Intersection Observer) */
    opacity: 0;
    transform: translateY(30px) scale(0.95);

    &.is-visible {
        animation: ${keyframes`
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        `} 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards var(--animation-delay, 0s);
    }
`;

export const ProductImageWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 65%; /* Consistent ratio for product image area */
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: scale(1.05); /* Initial slight zoom */
        transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1), filter 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
        will-change: transform, filter;

        ${StyledProductCard}:hover & {
            animation: ${imageHoverEffect} 0.6s forwards cubic-bezier(0.165, 0.84, 0.44, 1);
        }
    }
`;

export const ProductDetails = styled.div`
    height: 35%; /* Remaining height for details */
    padding: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(3)} ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(4)};
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Space out content */
    text-align: left;
    position: relative;
    z-index: 2; /* Above image hover effects */
`;

export const ProductName = styled.h3`
    font-family: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.body.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.body.sizes.medium};
    font-weight: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.body.weights.semiBold};
    color: ${(props: { theme: DefaultTheme }) => getTheme(props).colors.textDark};
    line-height: 1.4;
    margin-bottom: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(1)};
    /* Clamp text to 2 lines with ellipsis */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Correct way to parse rem value for calc: */
    min-height: calc(2 * 1.4 * ${(props: { theme: DefaultTheme }) => parseFloat(getTheme(props).typography.body.sizes.medium.replace('rem', ''))}rem);
`;

export const ProductPrice = styled.p`
    font-family: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.heading.fontFamily}; /* Distinct font for price */
    font-size: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.body.sizes.medium}; /* Make price prominent */
    color: ${(props: { theme: DefaultTheme }) => getTheme(props).colors.accent1}; /* Use vibrant accent for price */
    font-weight: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.heading.weights.bold};
    margin-top: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(1)};
`;

export const Badge = styled.span<{ $type: 'new' | 'bestseller' }>`
    position: absolute;
    top: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(3)};
    left: ${(props: { theme: DefaultTheme }) => getTheme(props).spacing(3)}; /* Consistent left positioning */
    background: ${props => props.$type === 'new' ?
        (getTheme(props).colors.gradients?.accent1Vibrant || getTheme(props).colors.accent1) :
        (getTheme(props).colors.gradients?.accent2Vibrant || getTheme(props).colors.accent2)};
    color: ${(props: { theme: DefaultTheme }) => getTheme(props).colors.textLight};
    font-size: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.body.sizes.xsmall};
    font-weight: ${(props: { theme: DefaultTheme }) => getTheme(props).typography.body.weights.semiBold};
    padding: 7px 14px;
    border-radius: 20px; /* Pill shape */
    text-transform: uppercase;
    letter-spacing: 0.8px;
    z-index: 3; /* Above image */
    box-shadow: 0 3px 10px ${props => {
        const colorValue = props.$type === 'new' ? getTheme(props).colors.accent1 : getTheme(props).colors.accent2;
        return rgba(colorValue, 0.3);
    }};
    animation: ${badgePop} 0.5s 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; /* Pop animation with delay */
    transform-origin: bottom left;
`;
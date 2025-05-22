// src/components/GrandMarquee/UtilityNav.styles.ts
import styled, { css } from 'styled-components';

export const UtilityNavContainer = styled.div`
    grid-column: 3 / 4;
    justify-self: end;
    display: flex;
    align-items: center;
    gap: 25px; /* Space between search, user, cart */

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        grid-column: auto;
        justify-self: center;
        margin-top: 15px; /* Add some space below logo on mobile */
    }
`;

export const SearchContainer = styled.div<{ $isExpanded: boolean }>`
    position: relative;
    display: flex;
    align-items: center;
    background-color: transparent;
    border-radius: 5px;
    transition: all 0.3s ease-out;

    input {
        width: ${(props) => (props.$isExpanded ? '200px' : '0')}; /* Expands from 0 to 200px */
        border: 1px solid ${(props) => props.theme.colors.lightGray};
        padding: 8px 15px;
        border-radius: 5px;
        font-size: ${(props) => props.theme.typography.body.sizes.small};
        color: ${(props) => props.theme.colors.textDark};
        opacity: ${(props) => (props.$isExpanded ? 1 : 0)};
        visibility: ${(props) => (props.$isExpanded ? 'visible' : 'hidden')};
        transition: width 0.3s ease-out, opacity 0.2s ease-in, visibility 0.2s ease-in;

        &:focus {
            outline: none;
            border-color: ${(props) => props.theme.colors.accent1};
        }

        @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
            width: ${(props) => (props.$isExpanded ? 'calc(100vw - 60px)' : '0')};
        }
    }

    button {
        color: ${(props) => props.theme.colors.textDark};
        font-size: ${(props) => props.theme.typography.body.sizes.large};
        padding: 0;
        display: flex;
        align-items: center;
        z-index: 1; /* Keep button clickable */

        &:hover {
            color: ${(props) => props.theme.colors.accent1};
            transform: scale(1.05);
        }
    }
`;

export const UserCartIcons = styled.div`
    display: flex;
    gap: 25px;

    svg {
        font-size: ${(props) => props.theme.typography.body.sizes.large};
        color: ${(props) => props.theme.colors.textDark};
        transition: color 0.2s ease-out, transform 0.2s ease-out;

        &:hover {
            color: ${(props) => props.theme.colors.accent1};
            transform: scale(1.05);
        }
    }
`;

export const CartIconContainer = styled.span`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
`;

export const CartCount = styled.span`
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: ${(props) => props.theme.colors.accent1};
    color: ${(props) => props.theme.colors.textLight};
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    transition: transform 0.2s ease-out;
    pointer-events: none; /* Make sure it doesn't block cart icon clicks */
`;

export const MiniCartOverlay = styled.div<{ $isOpen: boolean }>`
    position: fixed;
    top: 0;
    right: 0;
    width: 350px;
    height: 100vh;
    background-color: ${(props) => props.theme.colors.textLight};
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
    transform: translateX(${(props) => (props.$isOpen ? '0' : '100%')});
    transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
    z-index: 1000;
    display: flex;
    flex-direction: column;

    @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
        width: 90%;
    }
`;

export const MiniCartHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid ${(props) => props.theme.colors.lightGray};

    h3 {
        font-family: ${(props) => props.theme.typography.heading.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.large};
        font-weight: ${(props) => props.theme.typography.heading.weights.bold};
        color: ${(props) => props.theme.colors.textDark};
    }

    button {
        font-size: ${(props) => props.theme.typography.body.sizes.large};
        color: ${(props) => props.theme.colors.textDark};

        &:hover {
            color: ${(props) => props.theme.colors.accent1};
        }
    }
`;

export const MiniCartItems = styled.div`
    flex-grow: 1;
    padding: 20px;
    overflow-y: auto; /* Scrollable if many items */
`;

export const MiniCartItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    border-bottom: 1px dashed ${(props) => props.theme.colors.lightGray};
    padding-bottom: 15px;

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    img {
        width: 70px;
        height: 70px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 15px;
    }

    div {
        flex-grow: 1;
    }

    .item-name {
        font-size: ${(props) => props.theme.typography.body.sizes.small};
        font-weight: ${(props) => props.theme.typography.body.weights.medium};
        color: ${(props) => props.theme.colors.textDark};
    }

    .item-qty-price {
        font-size: ${(props) => props.theme.typography.body.sizes.xsmall};
        color: ${(props) => props.theme.colors.darkGray};
        margin-top: 5px;
    }
`;

export const MiniCartFooter = styled.div`
    padding: 20px;
    border-top: 1px solid ${(props) => props.theme.colors.lightGray};
    display: flex;
    flex-direction: column;
    gap: 15px;

    .subtotal {
        display: flex;
        justify-content: space-between;
        font-size: ${(props) => props.theme.typography.body.sizes.base};
        font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
        color: ${(props) => props.theme.colors.textDark};
    }

    button {
        width: 100%;
        background-color: ${(props) => props.theme.colors.accent1};
        color: ${(props) => props.theme.colors.textLight};
        padding: 12px 0;
        border-radius: 5px;
        font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
        text-transform: uppercase;
        letter-spacing: 1px;

        &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        }
    }
`;
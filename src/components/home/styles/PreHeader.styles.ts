// src/components/PreHeader/PreHeader.styles.ts
import styled from 'styled-components';

export const StyledPreHeader = styled.header`
    background-color: ${(props) => props.theme.colors.primaryNeutral};
    color: ${(props) => props.theme.colors.textDark};
    font-size: ${(props) => props.theme.typography.body.sizes.xsmall};
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 ${(props) => props.theme.containerPadding};
    border-bottom: 1px solid ${(props) => props.theme.colors.lightGray};
    position: relative;
    z-index: 100; // Above other elements

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        justify-content: center;
        height: auto;
        padding: 8px ${(props) => props.theme.containerPadding};
    }
`;

export const PreHeaderContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: ${(props) => props.theme.maxWidth};
    margin: 0 auto;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        gap: 5px;
    }
`;

export const NavSection = styled.div`
    display: flex;
    gap: 20px;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        gap: 15px;
    }
`;

export const NavLink = styled.a`
    display: flex;
    align-items: center;
    gap: 6px; /* Space between icon and text */
    color: ${(props) => props.theme.colors.textDark};
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &:hover {
        color: ${(props) => props.theme.colors.lightGray};
        transform: scale(1.01); /* Subtle effect */

        svg {
            transform: scale(1.05); /* Subtle icon grow */
        }
    }

    svg {
        font-size: ${(props) => props.theme.typography.body.sizes.small}; /* Slightly larger icon */
        color: ${(props) => props.theme.colors.textDark};
        transition: transform 0.2s ease-in-out, color 0.2s ease-in-out;
    }

    /* Separator styling (optional, done via pseudo-elements or specific styling if needed) */
    &:not(:last-child)::after {
        content: '';
        display: inline-block;
        width: 1px;
        height: 12px;
        background-color: ${(props) => props.theme.colors.lightGray};
        margin-left: 20px;

        @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
            display: none; /* Hide separators on smaller screens */
        }
    }
`;

export const WishlistIconContainer = styled.span`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    svg {
        font-size: ${(props) => props.theme.typography.body.sizes.small};
        color: ${(props) => props.theme.colors.textDark};
    }
`;

export const WishlistCount = styled.span`
    position: absolute;
    top: -6px;
    right: -6px;
    background-color: ${(props) => props.theme.colors.accent1};
    color: ${(props) => props.theme.colors.textLight};
    border-radius: 50%;
    padding: 2px 5px;
    font-size: 8px;
    font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    height: 16px;
    transform: scale(1);
    transition: transform 0.2s ease-out;

    ${NavLink}:hover & {
        transform: scale(1.1);
    }
`;
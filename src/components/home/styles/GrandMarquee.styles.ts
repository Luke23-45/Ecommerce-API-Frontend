// src/components/GrandMarquee/GrandMarquee.styles.ts
import styled from 'styled-components';

export const StyledGrandMarquee = styled.nav`
    background-color: ${(props) => props.theme.colors.primaryNeutral};
    height: 80px;
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 99; // Below pre-header
    width: 100%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03); // Subtle shadow for depth

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        height: auto;
        padding: 15px 0;
    }
`;

export const MarqueeContent = styled.div`
    display: grid;
    grid-template-columns: 1fr auto 1fr; /* Left links, Center logo, Right utility */
    align-items: center;
    width: 100%;
    max-width: ${(props) => props.theme.maxWidth};
    margin: 0 auto;
    padding: 0 ${(props) => props.theme.containerPadding};

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        grid-template-columns: 1fr;
        gap: 15px;
        text-align: center;
    }
`;

export const ElanLogo = styled.h1`
    font-family: ${(props) => props.theme.typography.heading.fontFamily};
    font-size: ${(props) => props.theme.typography.heading.sizes.h3};
    font-weight: ${(props) => props.theme.typography.heading.weights.extraBold};
    color: ${(props) => props.theme.colors.textDark};
    text-align: center;
    letter-spacing: 2px;
    position: relative;
    padding: 0 10px; /* To prevent collision with other items */

    a {
        display: block;
        color: inherit;
    }

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        order: 1; /* Place logo first on mobile */
    }
`;
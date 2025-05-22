// src/components/SpotlightBanner/SpotlightBanner.styles.ts
import styled from 'styled-components';

export const StyledSpotlightBanner = styled.div`
    background-color: ${(props) => props.theme.colors.accent2}; /* Sage green */
    color: ${(props) => props.theme.colors.textLight}; /* White text for contrast */
    padding: 12px 20px;
    text-align: center;
    font-size: ${(props) => props.theme.typography.body.sizes.small};
    font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
    position: relative;
    z-index: 95; /* Below GrandMarquee, above hero */
    box-shadow: inset 0 -2px 5px rgba(0, 0, 0, 0.05); /* Subtle inner shadow */
    letter-spacing: 0.5px;
`;
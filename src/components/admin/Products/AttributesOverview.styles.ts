// src/components/Admin/Products/AttributesOverview.styles.ts
import styled, { type DefaultTheme, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const OverviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(6)}; /* Space between header and content box */

    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;
`;

export const OverviewHeader = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        align-items: flex-start;
        padding: ${(props) => getTheme(props).spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const HeaderTitle = styled.h2`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
`;

export const ContentBox = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px; /* Placeholder height */
    text-align: center;
    gap: ${(props) => getTheme(props).spacing(4)};

    p {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        max-width: 500px;
        line-height: 1.6;
    }

    svg { /* Icon for the center of the box */
        font-size: 3em;
        color: ${(props) => getTheme(props).colors.adminBorder};
    }
`;
// src/components/Admin/Dashboard/DashboardCard/DashboardCard.styles.ts
import styled, { type DefaultTheme } from 'styled-components';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const DashboardCardContainer = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    padding: ${(props) => getTheme(props).spacing(6)};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    height: 100%; /* Important for grid alignment */
    display: flex;
    flex-direction: column;
    
    /* Animation needs to be applied when the DashboardGrid or containing section gets animated */
    opacity: 0;
    transform: translateY(10px);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out; /* Basic fade-in if not handled by parent */
    /* If parent container applies staggered animation via :nth-child or similar, animation here might be overridden */
`;

export const CardHeader = styled.div`
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
`;

export const CardTitle = styled.h3`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
`;

export const CardContent = styled.div`
    flex-grow: 1; /* Allow content to take available height */
    overflow-y: auto; /* If content overflows, enable scroll */
    scrollbar-width: thin;
    scrollbar-color: ${(props) => getTheme(props).colors.lightGray} transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props) => getTheme(props).colors.lightGray};
        border-radius: 10px;
    }

    p, ul, ol {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
        color: ${(props) => getTheme(props).colors.adminText};
        line-height: 1.6;
    }
`;
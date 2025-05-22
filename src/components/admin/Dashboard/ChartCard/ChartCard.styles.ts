// src/components/Admin/Dashboard/ChartCard/ChartCard.styles.ts
import styled, { type DefaultTheme } from 'styled-components';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const ChartCardContainer = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    padding: ${(props) => getTheme(props).spacing(6)};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    height: 100%; /* Fill parent grid cell */
    display: flex;
    flex-direction: column;
`;

export const ChartHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
`;

export const ChartTitle = styled.h3`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
`;

export const ChartPeriodSelect = styled.select`
    padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(3)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
    color: ${(props) => getTheme(props).colors.adminText};
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease-out;

    &:focus {
        border-color: ${(props) => getTheme(props).colors.accent1};
    }
`;

export const ChartContent = styled.div`
    flex-grow: 1; /* Chart content takes available space */
    display: flex; /* For centering placeholder */
    align-items: center;
    justify-content: center;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    border: 1px dashed ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    padding: ${(props) => getTheme(props).spacing(4)};
    text-align: center;
`;
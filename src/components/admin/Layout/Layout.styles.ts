// src/components/Admin/Layout/Layout.styles.ts
import styled, { type DefaultTheme } from 'styled-components';

// REMOVED: const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const AdminLayoutContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: ${(props) => props.theme.colors.adminPrimaryBg}; /* DIRECT ACCESS */
    font-family: ${(props) => props.theme.typography.admin.fontFamily}; /* DIRECT ACCESS */
    color: ${(props) => props.theme.colors.adminText}; /* DIRECT ACCESS */
`;

export const AdminMainContent = styled.div`
    display: flex;
    flex: 1;
    overflow: hidden; /* This correctly clips content horizontally */

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { /* DIRECT ACCESS */
        flex-direction: column;
    }
`;

export const PageContentWrapper = styled.main`
    flex: 1;
    padding: ${(props) => props.theme.spacing(6)} ${(props) => props.theme.spacing(8)}; /* DIRECT ACCESS */
    background-color: ${(props) => props.theme.colors.adminPrimaryBg}; /* DIRECT ACCESS */
    overflow-y: auto;
    height: calc(100vh - 60px); /* Fill remaining viewport height after header */

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { /* DIRECT ACCESS */
        padding: ${(props) => props.theme.spacing(4)}; /* DIRECT ACCESS */
        height: auto;
    }
`;

export const PageTitle = styled.h1`
    font-family: ${(props) => props.theme.typography.admin.fontFamily}; /* DIRECT ACCESS */
    font-size: ${(props) => props.theme.typography.admin.sizes.moduleTitle}; /* DIRECT ACCESS */
    font-weight: ${(props) => props.theme.typography.admin.weights.bold}; /* DIRECT ACCESS */
    color: ${(props) => props.theme.colors.adminText}; /* DIRECT ACCESS */
    margin-bottom: ${(props) => props.theme.spacing(6)}; /* DIRECT ACCESS */
`;
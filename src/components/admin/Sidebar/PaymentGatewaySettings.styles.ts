// src/components/Admin/Settings/PaymentGatewaySettings.styles.ts
import styled, {type DefaultTheme, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const SettingsModuleContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props) => props.theme.colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => props.theme.spacing(6)};
    min-height: 50vh; /* Consistent height for a placeholder overview */
    
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        padding: ${(props) => props.theme.spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const SettingsModuleHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => props.theme.spacing(6)};

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        align-items: flex-start;
        gap: ${(props) => props.theme.spacing(3)};
    }
`;

export const HeaderTitle = styled.h2`
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => props.theme.typography.admin.weights.bold};
    color: ${(props) => props.theme.colors.adminText};
`;

export const ContentBox = styled.div`
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

export const ActionsContainer = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(3)};
    flex-wrap: wrap;
    margin-top: auto; /* Push actions to the bottom */
`;
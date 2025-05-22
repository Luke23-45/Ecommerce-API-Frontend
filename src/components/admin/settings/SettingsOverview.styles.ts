// src/components/Admin/Settings/SettingsOverview.styles.ts
import styled, { type DefaultTheme, keyframes } from 'styled-components';
import { rgba } from 'polished';
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const SettingsOverviewContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${(props) => props.theme.spacing(0)}; 
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;
`;

export const SettingsHeader = styled.div`
    background-color: ${(props) => props.theme.colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => props.theme.spacing(6)};
    margin-bottom: ${(props) => props.theme.spacing(8)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.spacing(4)};
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        align-items: flex-start;
        padding: ${(props) => props.theme.spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const HeaderTitle = styled.h2`
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => props.theme.typography.admin.weights.bold};
    color: ${(props) => props.theme.colors.adminText};
    margin-bottom: 0;
`;

export const SettingSectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(8)}; 
`;
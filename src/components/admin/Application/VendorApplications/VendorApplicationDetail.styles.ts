import styled, { type DefaultTheme, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

// const getTheme = (props: { theme: DefaultTheme }) => props.theme; // Direct access

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(6)};
    opacity: 0;
    animation: ${fadeIn} 0.5s ease-out forwards;
`;

export const DetailHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: ${(props) => props.theme.spacing(4)};
    padding-bottom: ${(props) => props.theme.spacing(4)};
    border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder};
    margin-bottom: ${(props) => props.theme.spacing(2)};

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        align-items: stretch;
    }
`;

export const HeaderInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(1)};
    
    h2 {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.moduleTitle};
        font-weight: ${(props) => props.theme.typography.admin.weights.bold};
        color: ${(props) => props.theme.colors.adminText};
        margin: 0;
        display: flex;
        align-items: center;
        gap: ${(props) => props.theme.spacing(2)};
    }

    .applicant-id {
        font-size: ${(props) => props.theme.typography.admin.sizes.small};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        font-family: monospace;
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: ${(props) => props.theme.spacing(3)};
    flex-shrink: 0;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        width: 100%;
        justify-content: flex-start;
    }
`;

export const DetailLayout = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr; /* Main content | Sidebar */
    gap: ${(props) => props.theme.spacing(6)};

    @media (max-width: ${(props) => props.theme.breakpoints.laptop}) {
        grid-template-columns: 1fr; /* Stack columns */
    }
`;

export const MainContentColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(5)};
`;

export const SidebarContentColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(5)};
`;

export const InfoBox = styled.div`
    background-color: ${(props) => props.theme.colors.adminSurface};
    border-radius: 12px;
    padding: ${(props) => props.theme.spacing(5)};
    box-shadow: 0 3px 10px rgba(0,0,0,0.04);
`;

export const InfoSectionTitle = styled.h3`
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    color: ${(props) => props.theme.colors.adminText};
    margin-bottom: ${(props) => props.theme.spacing(4)};
    padding-bottom: ${(props) => props.theme.spacing(2)};
    border-bottom: 1px solid ${(props) => props.theme.colors.adminBorderLight || props.theme.colors.adminBorder};
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(2)};
`;

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${(props) => props.theme.spacing(4)} ${(props) => props.theme.spacing(5)};
`;

export const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(1)};

    label {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.label};
        font-weight: ${(props) => props.theme.typography.admin.weights.medium};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }

    p, span, a {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
        color: ${(props) => props.theme.colors.adminText};
        word-break: break-word;
    }

    a {
        color: ${(props) => props.theme.colors.accent1};
        text-decoration: none;
        &:hover { text-decoration: underline; }
    }
    
    .boolean-true {
        color: ${(props) => props.theme.colors.adminStatusSuccess};
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    }
    .boolean-false {
        color: ${(props) => props.theme.colors.adminStatusError};
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    }
`;

export const DocumentLink = styled.a`
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(1.5)};
    color: ${(props) => props.theme.colors.accent1};
    text-decoration: none;
    font-weight: ${(props) => props.theme.typography.admin.weights.medium};
    padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(2.5)};
    border: 1px solid ${(props) => props.theme.colors.adminBorder};
    border-radius: 6px;
    background-color: ${(props) => props.theme.colors.adminSecondaryBg};
    transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
    
    &:hover {
        text-decoration: none;
        border-color: ${(props) => props.theme.colors.accent1};
        background-color: ${(props) => rgba(props.theme.colors.accent1, 0.05)};
        color: ${(props) => darken(0.05, props.theme.colors.accent1)};
    }

    img { // For styling a document icon image if present
        width: 20px;
        height: 20px;
        object-fit: contain;
    }
`;

export const CurrentStatusDisplay = styled.div`
    margin-bottom: ${(props) => props.theme.spacing(4)};
    padding: ${(props) => props.theme.spacing(3)};
    background-color: ${(props) => rgba(props.theme.colors.adminSecondaryBg, 0.5)};
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.colors.adminBorder};
    
    strong {
        margin-right: ${(props) => props.theme.spacing(2)};
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    }
`;

export const ActionPanel = styled.div`
    margin-top: ${(props) => props.theme.spacing(3)};
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(3)};

    select {
        margin-bottom: ${(props) => props.theme.spacing(2)};
    }
`;

export const MemberList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(2.5)};
`;

export const MemberItem = styled.li`
    background-color: ${(props) => props.theme.colors.adminSecondaryBg};
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(3)};
    border-radius: 6px;
    border: 1px solid ${(props) => props.theme.colors.adminBorder};
    font-size: ${(props) => props.theme.typography.admin.sizes.small};
    
    .member-id { font-family: monospace; color: ${(props) => props.theme.colors.adminTextSecondary};}
    .member-roles { 
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold}; 
        color: ${(props) => props.theme.colors.accent1};
        margin-left: ${(props) => props.theme.spacing(1)};
    }
    .added-info {
        display: block;
        font-size: ${(props) => props.theme.typography.admin.sizes.xsmall};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        margin-top: ${(props) => props.theme.spacing(0.5)};
    }
`;
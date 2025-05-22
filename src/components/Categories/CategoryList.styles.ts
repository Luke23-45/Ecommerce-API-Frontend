// src/components/Admin/Categories/CategoryList.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const CategoryListContainer = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)};
    min-height: 70vh;

    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const CategoryListHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)};

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        align-items: flex-start;
        gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)};
    }
`;

export const HeaderTitle = styled.h2`
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.sectionTitle};
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.weights.bold};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminText};
`;

export const CategorySearchInput = styled.input`
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(2.5)} ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)};
    border: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.dataCell};
    background-color: ${props => props.theme.colors.adminSecondaryBg};
    color: ${props => props.theme.colors.adminText};
    width: 250px;
    transition: all 0.2s ease-out;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 2px ${props => rgba(props.theme.colors.accent1, 0.15)};
    }
    &::placeholder {
        color: ${props => props.theme.colors.adminTextSecondary};
    }

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        width: 100%;
        margin-top: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)};
    }
`;

export const CategoryTreeContainer = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder} transparent;
    max-height: calc(100vh - 350px);
    
    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder};
        border-radius: 10px;
        &:hover { background-color: ${(props) => darken(0.1, props.theme.colors.adminBorder)}; }
    }
`;

export const CategoryTreeNode = styled.li<{ $level: number }>`
    display: flex;
    flex-direction: column;
    position: relative;
    padding-left: ${(props: { theme: DefaultTheme }) => props.theme.spacing(props.$level * 8)};
    border-bottom: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder};
    
    &:last-child { border-bottom: none; }
    
    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        padding-left: ${(props: { theme: DefaultTheme }) => props.theme.spacing(props.$level * 4)};
    }
`;

export const CategoryRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)} 0;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminSurface};
    transition: background-color 0.2s ease-out;
    min-height: 50px;

    &:hover {
        background-color: ${(props: { theme: DefaultTheme }) => rgba(props.theme.colors.accent1, 0.05)};
    }
`;

export const CategoryDetails = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(2)};
    cursor: pointer;
`;

export const ExpandCollapseButton = styled.button`
    background: none;
    border: none;
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminTextSecondary};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.bodyBase};
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    transition: color 0.2s ease-out, background-color 0.2s ease-out;
    &:hover {
        background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminSecondaryBg};
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminText};
    }
`;

export const CategoryNameDisplay = styled.span`
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.bodyBase};
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.weights.medium};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminText};
`;

export const CategoryStatusBadge = styled.span<{ $status: 'active' | 'inactive' }>`
    padding: 4px 8px;
    border-radius: 6px;
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.xsmall};
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.weights.semiBold};
    text-transform: uppercase;
    white-space: nowrap;
    margin-left: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)};

    ${(props) => props.$status === 'active' && css`
        background-color: ${rgba(props.theme.colors.adminStatusSuccess, 0.15)};
        color: ${props.theme.colors.adminStatusSuccess};
    `}
    ${(props) => props.$status === 'inactive' && css`
        background-color: ${rgba(props.theme.colors.adminTextSecondary, 0.1)};
        color: ${props.theme.colors.adminTextSecondary};
    `}
`;

export const CategoryActions = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(1.5)};

    button {
        background: none;
        border: none;
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminTextSecondary};
        cursor: pointer;
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.bodyBase};
        transition: color 0.2s ease-out;

        &:hover {
            color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1};
        }
    }
`;

export const CategoryChildrenList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const NoCategoryMessage = styled.p`
    font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.fontFamily};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.admin.sizes.bodyBase};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminTextSecondary};
    text-align: center;
    padding: ${(props: { theme: DefaultTheme }) => props.theme.spacing(6)};
    border: 1px dashed ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder};
    border-radius: 8px;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.adminSecondaryBg}; /* Directly using props.theme */
`;
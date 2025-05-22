// src/components/Admin/Sidebar/Sidebar.styles.ts
import styled, { type DefaultTheme, css } from 'styled-components';
import { rgba } from 'polished';

// REMOVED: const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const AdminSidebarContainer = styled.nav`
    width: 250px;
    background-color: ${(props) => props.theme.colors.adminSecondaryBg}; /* DIRECT ACCESS */
    padding: ${(props) => props.theme.spacing(8)} 0; /* DIRECT ACCESS */
    border-right: 1px solid ${(props) => props.theme.colors.adminBorder}; /* DIRECT ACCESS */
    flex-shrink: 0;
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { /* DIRECT ACCESS */
        width: 100%;
        height: auto;
        padding: ${(props) => props.theme.spacing(4)} 0; /* DIRECT ACCESS */
        border-right: none;
        border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder}; /* DIRECT ACCESS */
    }
`;

export const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

export const NavItem = styled.li<{ $isActive?: boolean; $hasSubItems?: boolean; }>`
    display: flex;
    flex-direction: column;
    
    a {
        display: flex;
        align-items: center;
        gap: ${(props) => props.theme.spacing(3)}; /* DIRECT ACCESS */
        padding: ${(props) => props.theme.spacing(3)} ${(props) => props.theme.spacing(6)}; /* DIRECT ACCESS */
        font-family: ${(props) => props.theme.typography.admin.fontFamily}; /* DIRECT ACCESS */
        font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase}; /* DIRECT ACCESS */
        font-weight: ${(props) => props.theme.typography.admin.weights.medium}; /* DIRECT ACCESS */
        color: ${(props) => props.$isActive ? props.theme.colors.accent1 : props.theme.colors.adminText}; /* DIRECT ACCESS */
        text-decoration: none;
        transition: all 0.2s ease-out;
        background-color: ${(props) => props.$isActive ? rgba(props.theme.colors.accent1, 0.08) : 'transparent'}; /* DIRECT ACCESS */
        
        &:hover {
            color: ${(props) => props.theme.colors.accent1}; /* DIRECT ACCESS */
            background-color: ${(props) => rgba(props.theme.colors.accent1, 0.05)}; /* DIRECT ACCESS */
        }
        
        svg {
            font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle}; /* DIRECT ACCESS */
        }
    }

    ${(props) => props.$isActive && css`
        border-left: 4px solid ${props.theme.colors.accent1}; /* DIRECT ACCESS */
        a {
            font-weight: ${props.theme.typography.admin.weights.semiBold}; /* DIRECT ACCESS */
        }
    `}

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { /* DIRECT ACCESS */
        a {
            justify-content: center;
            padding: ${(props) => props.theme.spacing(3)}; /* DIRECT ACCESS */
        }
        border-left: none;
        ${(props) => props.$isActive && css`
            border-bottom: 4px solid ${props.theme.colors.accent1}; /* DIRECT ACCESS */
            a {
                font-weight: ${props.theme.typography.admin.weights.semiBold}; /* DIRECT ACCESS */
                background-color: ${rgba(props.theme.colors.accent1, 0.08)}; /* DIRECT ACCESS */
            }
        `}
    }
`;

export const SubNavList = styled.ul<{ $isOpen?: boolean }>`
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: ${(props) => props.$isOpen ? '500px' : '0'};
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    background-color: ${(props) => props.theme.colors.adminSecondaryBg}; /* DIRECT ACCESS */
    
    a {
        padding-left: ${(props) => props.theme.spacing(9)}; /* DIRECT ACCESS */
        font-size: ${(props) => props.theme.typography.admin.sizes.small}; /* DIRECT ACCESS */
        color: ${props => props.theme.colors.adminTextSecondary}; /* DIRECT ACCESS */
        &:hover {
            color: ${props => props.theme.colors.adminText}; /* DIRECT ACCESS */
        }
    }
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { /* DIRECT ACCESS */
        a {
            padding-left: ${(props) => props.theme.spacing(4)}; /* DIRECT ACCESS */
        }
    }
`;
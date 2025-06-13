
import styled, { type DefaultTheme, css } from 'styled-components';
import { rgba } from 'polished';
import { Link } from 'react-router-dom'; 

export const AdminSidebarContainer = styled.nav<{ $isCollapsed?: boolean }>`
    width: ${(props) => (props.$isCollapsed ? '80px' : '250px')};
    transition: width 0.3s ease-in-out;
    background-color: ${(props) => props.theme.colors.adminSecondaryBg};
    padding: ${(props) => props.theme.spacing(4)} 0;
    border-right: 1px solid ${(props) => props.theme.colors.adminBorder};
    flex-shrink: 0;
    overflow-x: hidden;
    overflow-y: auto; 

    ${(props) =>
    props.$isCollapsed &&
    css`
        
        ${NavLinkStyled} span, ${NavLinkStyled} .submenu-indicator { 
            display: none;
        }
        ${NavLinkStyled} {
            justify-content: center; 
            padding: ${props.theme.spacing(3)};
        }
        ${SubNavList} {
            display: none; 
        }
    `}
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder};
        
        
        ${(props) =>
        props.$isCollapsed &&
        css`
            
            
            
            
        `}
    }
`;

export const NavList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;



const navLinkSharedStyles = css<{ $isActive?: boolean; theme: DefaultTheme }>`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(3)};
    padding: ${(props) => props.theme.spacing(3)} ${(props) => props.theme.spacing(6)};
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
    font-weight: ${(props) => props.theme.typography.admin.weights.medium};
    color: ${(props) => (props.$isActive ? props.theme.colors.accent1 : props.theme.colors.adminText)};
    text-decoration: none;
    transition: all 0.2s ease-out;
    background-color: ${(props) => (props.$isActive ? rgba(props.theme.colors.accent1, 0.08) : 'transparent')};
    cursor: pointer; 

    &:hover {
        color: ${(props) => props.theme.colors.accent1};
        background-color: ${(props) => rgba(props.theme.colors.accent1, 0.05)};
    }
    
    svg:first-child { 
        font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
        flex-shrink: 0; 
    }

    
    .submenu-indicator {
        margin-left: auto;
        font-size: 0.9em; 
    }
`;

interface NavLinkProps {
  $isActive?: boolean;
  $isSubItem?: boolean; 
  $hasSubItems?: boolean; 
}


export const NavLinkStyled = styled(Link).withConfig({
  shouldForwardProp: (prop) => !['$isActive', '$isSubItem', '$hasSubItems'].includes(prop),
})<NavLinkProps>`
    ${navLinkSharedStyles} 

    
    ${(props) => props.$isSubItem && css`
        padding-left: ${props.theme.spacing(9)}; 
        font-size: ${props.theme.typography.admin.sizes.small};
        color: ${props.$isActive ? props.theme.colors.accent1 : props.theme.colors.adminTextSecondary};

        &:hover {
            color: ${props.$isActive ? props.theme.colors.accent1 : props.theme.colors.adminText};
        }
        svg:first-child {
             font-size: ${props.theme.typography.admin.sizes.bodyBase}; 
        }
    `}
`;



export const NavAnchorStyled = styled.a.withConfig({
  shouldForwardProp: (prop) => !['$isActive', '$isSubItem', '$hasSubItems'].includes(prop),
})<NavLinkProps>`
    ${navLinkSharedStyles} 

    ${(props) => props.$isSubItem && css` 
        padding-left: ${props.theme.spacing(9)};
        font-size: ${props.theme.typography.admin.sizes.small};
        color: ${props.$isActive ? props.theme.colors.accent1 : props.theme.colors.adminTextSecondary};
        
        &:hover {
            color: ${props.$isActive ? props.theme.colors.accent1 : props.theme.colors.adminText};
        }
        svg:first-child {
             font-size: ${props.theme.typography.admin.sizes.bodyBase};
        }
    `}
`;


export const NavItemStyled = styled.li<{ $isActive?: boolean; $hasSubItems?: boolean }>`
    display: flex; 
    flex-direction: column; 
    position: relative; 

    
    ${(props) => props.$isActive && !props.$hasSubItems && css` 
        border-left: 4px solid ${props.theme.colors.accent1};
        ${NavLinkStyled}, ${NavAnchorStyled} { 
            font-weight: ${props.theme.typography.admin.weights.semiBold};
        }
    `}
    
    ${(props) => props.$isActive && props.$hasSubItems && css`
        
        
         ${NavLinkStyled}, ${NavAnchorStyled} {
            
        }
    `}


    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        border-left: none;
        ${(props) => props.$isActive && !props.$hasSubItems && css`
            border-bottom: 4px solid ${props.theme.colors.accent1};
            ${NavLinkStyled}, ${NavAnchorStyled} {
                font-weight: ${props.theme.typography.admin.weights.semiBold};
            }
        `}
    }
`;

export const SubNavList = styled.ul<{ $isOpen?: boolean }>`
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: ${(props) => (props.$isOpen ? '500px' : '0')}; 
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    background-color: ${(props) => rgba(props.theme.colors.adminSecondaryBg, 0.5)}; 

    
    li {
      
    }
`;
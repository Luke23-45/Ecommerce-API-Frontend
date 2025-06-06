// src/components/Admin/Sidebar/Sidebar.styles.ts
import styled, { type DefaultTheme, css } from 'styled-components';
import { rgba } from 'polished';

// REMOVED: const getTheme = (props: { theme: DefaultTheme }) => props.theme;



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

export const AdminSidebarContainer = styled.nav<{ $isCollapsed?: boolean }>`
    width: ${(props) => (props.$isCollapsed ? '80px' : '250px')}; // Example widths
    transition: width 0.3s ease-in-out; // Smooth transition for width
    background-color: ${(props) => props.theme.colors.adminSecondaryBg};
    padding: ${(props) => props.theme.spacing(4)} 0; // Consistent top/bottom padding
    border-right: 1px solid ${(props) => props.theme.colors.adminBorder};
    flex-shrink: 0;
    overflow-x: hidden; // Hide horizontal overflow when collapsing

    // Styles for when collapsed
    ${(props) =>
    props.$isCollapsed &&
    css`
        // You might adjust padding for collapsed state if top/bottom buttons/logo area needs it
        // padding: ${props.theme.spacing(4)} ${props.theme.spacing(2)}; 
        
        // Hide text in NavItem > a > span:not(.icon-class-if-any)
        // This is a general approach, you might need more specific selectors
        ${NavItem} a span:not([class*="icon"]) { // A bit hacky, better to have specific class on icon span
            display: none;
        }
        ${NavItem} a svg + span { // Hides label span if it's next to an svg icon
             display: none;
        }
        ${NavItem} a {
            justify-content: center; // Center the icon
            padding: ${props.theme.spacing(3)}; // Adjust padding for icon only
        }
        ${SubNavList} {
            display: none; // Submenus are always hidden when sidebar is collapsed
        }
    `}
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        width: 100%; // Full width on tablet
        height: auto;
        // ... other tablet styles ...
        // Collapse functionality might be disabled or behave differently on mobile
        ${(props) =>
        props.$isCollapsed &&
        css`
            // Override collapsed styles if needed for mobile
            // e.g. width: 100%; display: flex; justify-content: space-around; 
            // Or simply don't allow collapse on mobile.
        `}
    }
`;
// src/components/admin/Sidebar/adminSidebar.tsx
import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "styled-components";
// Removed useLocation as activePath is passed directly
import { Link as RouterLink, useLocation } from "react-router-dom"; 
import { FaAngleDown, FaAngleRight } from "react-icons/fa"; // Keep only necessary icons here

import {
  AdminSidebarContainer,
  NavList,
  NavItemStyled,
  SubNavList,
  NavLinkStyled, // Use for internal links
  NavAnchorStyled, // Use for external links or button-like anchors
} from "./Sidebar.styles";

import {
  type NavItem as NavItemConfigType,
  type UserRole,
} from "@/config/rolesConfig";
import { getFilteredNavItems } from "@/utils/navigationUtils";

interface AdminSidebarProps {
  activePath: string; // Current location.pathname from AdminRouter
  userRole: UserRole;
  onNavLinkClick?: (path: string) => void; // Keep for potential non-link actions
  isCollapsed?: boolean; // For collapsibility
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activePath,
  userRole,
  onNavLinkClick, 
  isCollapsed = false, 
}) => {
  const theme = useTheme();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  const navItemsToDisplay: NavItemConfigType[] = useMemo(() => {
    try {
      return getFilteredNavItems(userRole);
    } catch (error) {
      console.error("[AdminSidebar] Error fetching nav items:", error);
      return [];
    }
  }, [userRole]);

  useEffect(() => {
    const initiallyOpen: Record<string, boolean> = {};
    // This function now correctly identifies if any child (recursively) matches the activePath.
    // If so, it ensures all its parents in the path are marked to be open.
    const findAndMarkParentsToOpen = (items: NavItemConfigType[], currentPath: string): boolean => {
      let isActiveBranch = false;
      for (const item of items) {
        let currentItemIsOrHasActiveChild = false;
        if (item.path === currentPath) {
          currentItemIsOrHasActiveChild = true; // Exact match
        } else if (item.children && currentPath.startsWith(item.path + (item.path.endsWith('/') ? '' : '/'))) {
          // If currentPath starts with item.path, it's a potential parent.
          // Recursively check if any child in this branch is active.
          if (findAndMarkParentsToOpen(item.children, currentPath)) {
            initiallyOpen[item.sectionId] = true; // Mark this parent to be open
            currentItemIsOrHasActiveChild = true;
          }
        }
        if (currentItemIsOrHasActiveChild) isActiveBranch = true;
      }
      return isActiveBranch;
    };

    if (navItemsToDisplay.length > 0 && !isCollapsed) { // Don't auto-open if collapsed
      findAndMarkParentsToOpen(navItemsToDisplay, activePath);
      setOpenSubMenus(initiallyOpen);
    } else {
      setOpenSubMenus({}); // Reset if collapsed or no items
    }
  }, [activePath, navItemsToDisplay, isCollapsed]);


  const handleToggleSubMenu = (
    itemSectionId: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault(); // Important to prevent navigation if it's an anchor
    if (isCollapsed) return; // Don't toggle if collapsed

    setOpenSubMenus((prevState) => ({
      ...prevState,
      [itemSectionId]: !prevState[itemSectionId],
    }));
  };

  // Determines if the NavItemStyled (<li>) should have an "active" appearance
  // (e.g., border). It's active if its own path matches or if one of its children matches.
  const isNavItemLiActive = (item: NavItemConfigType, currentPath: string): boolean => {
    if (item.path === currentPath) return true;
    if (item.children) {
      return item.children.some(child => isNavItemLiActive(child, currentPath));
    }
    return false;
  };

  const renderNavItem = (item: NavItemConfigType): React.ReactNode => {
    const IconToRender = item.icon as React.ElementType | undefined;
    const hasSubItems = item.children && item.children.length > 0;

    // For the <li> element's active state (e.g. left border)
    const liIsActive = isNavItemLiActive(item, activePath);

    // For the link/anchor's active state (e.g. text color, background)
    // A link is directly active only if its path matches the current path exactly.
    const linkIsDirectlyActive = item.path === activePath;

    // Determine if submenu should be open (only if not collapsed)
    const isSubMenuOpen = !isCollapsed && (openSubMenus[item.sectionId] === true);


    // Content common to both Link and Anchor
    const linkContent = (
      <>
        {IconToRender && <IconToRender />}
        {!isCollapsed && <span>{item.label}</span>} {/* Hide label text when collapsed */}
        {!isCollapsed && hasSubItems && ( /* Hide indicator when collapsed */
          <span className="submenu-indicator">
            {isSubMenuOpen ? <FaAngleDown /> : <FaAngleRight />}
          </span>
        )}
      </>
    );

    return (
      <NavItemStyled
        key={item.sectionId}
        $isActive={liIsActive} // For the <li>'s own active styling (e.g., border)
        $hasSubItems={hasSubItems}
      >
        {item.isExternal ? (
          <NavAnchorStyled
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            $isActive={linkIsDirectlyActive} // Anchor's own active state
          >
            {linkContent}
          </NavAnchorStyled>
        ) : hasSubItems ? (
          // Parent item with submenu - acts as a toggle
          <NavAnchorStyled
            href={item.path} // Keep href for semantics/SEO, but click is overridden
            onClick={(e) => handleToggleSubMenu(item.sectionId, e)}
            $isActive={linkIsDirectlyActive} // Can be active if its path is the target
            $hasSubItems={true}
          >
            {linkContent}
          </NavAnchorStyled>
        ) : (
          // Regular internal navigation item
          <NavLinkStyled
            to={item.path}
            $isActive={linkIsDirectlyActive}
            onClick={() => { // Close all submenus when a top-level direct link is clicked
              if (onNavLinkClick) onNavLinkClick(item.path); // If specific action needed
              // if (!isCollapsed) setOpenSubMenus({}); // Optional: close other menus
            }}
          >
            {linkContent}
          </NavLinkStyled>
        )}

        {!isCollapsed && hasSubItems && (
          <SubNavList $isOpen={isSubMenuOpen}>
            {item.children?.map((subItem) => {
              const SubItemIconToRender = subItem.icon as React.ElementType | undefined;
              const subItemLinkIsDirectlyActive = subItem.path === activePath;
              const subItemContent = (
                  <>
                    {SubItemIconToRender && <SubItemIconToRender />}
                    <span>{subItem.label}</span>
                  </>
              );

              return (
                <li key={subItem.sectionId}>
                  {subItem.isExternal ? (
                    <NavAnchorStyled
                      href={subItem.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      $isSubItem={true}
                      $isActive={subItemLinkIsDirectlyActive}
                    >
                     {subItemContent}
                    </NavAnchorStyled>
                  ) : (
                    <NavLinkStyled
                      to={subItem.path}
                      $isSubItem={true}
                      $isActive={subItemLinkIsDirectlyActive}
                      onClick={() => {
                         if (onNavLinkClick) onNavLinkClick(subItem.path);
                      }}
                    >
                      {subItemContent}
                    </NavLinkStyled>
                  )}
                </li>
              );
            })}
          </SubNavList>
        )}
      </NavItemStyled>
    );
  };

  if (navItemsToDisplay.length === 0 && userRole) {
    return (
      <AdminSidebarContainer $isCollapsed={isCollapsed}>
        <NavList>
          <li
            style={{
              padding: "20px",
              color: theme?.colors?.adminTextSecondary || "#ccc",
              textAlign: "center",
              display: isCollapsed ? 'none' : 'block', // Hide text if collapsed
            }}
          >
            No items for role: {userRole}.
          </li>
        </NavList>
      </AdminSidebarContainer>
    );
  }

  return (
    <AdminSidebarContainer $isCollapsed={isCollapsed}>
      <NavList>{navItemsToDisplay.map(renderNavItem)}</NavList>
    </AdminSidebarContainer>
  );
};

export default AdminSidebar;
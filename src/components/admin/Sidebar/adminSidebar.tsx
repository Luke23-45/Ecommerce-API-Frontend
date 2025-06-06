import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "styled-components";

import {
  FaTachometerAlt,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaChartLine,
  FaPaintBrush,
  FaCog,
  FaAngleDown,
  FaAngleRight,
  FaFileAlt,
  FaFileContract,
} from "react-icons/fa";

import {
  AdminSidebarContainer,
  NavList,
  NavItem,
  SubNavList,
} from "./Sidebar.styles";

import {
  type NavItem as NavItemConfigType,
  type UserRole,
} from "@/config/rolesConfig";
import { getFilteredNavItems } from "@/utils/navigationUtils";

interface AdminSidebarProps {
  activePath: string;
  userRole: UserRole;
  onNavLinkClick: (path: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activePath,
  userRole,
  onNavLinkClick,
}) => {
  const theme = useTheme();
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const navItemsToDisplay: NavItemConfigType[] = useMemo(() => {
    try {
      return getFilteredNavItems(userRole);
    } catch (error) {
      console.error("[AdminSidebar] Error fetching filtered nav items:", error);
      return [];
    }
  }, [userRole]);

  useEffect(() => {
    const initiallyOpen: Record<string, boolean> = {};
    const findAndOpenParents = (
      items: NavItemConfigType[],
      currentActivePath: string
    ): void => {
      for (const item of items) {
        if (
          item.children &&
          item.children.length > 0 &&
          currentActivePath.startsWith(item.path)
        ) {
          initiallyOpen[item.sectionId] = true;
          if (
            item.children.some(
              (child) =>
                currentActivePath.startsWith(child.path) &&
                currentActivePath !== item.path
            )
          ) {
            findAndOpenParents(item.children, currentActivePath);
          }
        }
      }
    };
    if (navItemsToDisplay.length > 0) {
      findAndOpenParents(navItemsToDisplay, activePath);
      setOpenSubMenus(initiallyOpen);
    } else {
      setOpenSubMenus({});
    }
  }, [activePath, navItemsToDisplay]);

  const handleToggleSubMenu = (
    itemSectionId: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    setOpenSubMenus((prevState) => ({
      ...prevState,
      [itemSectionId]: !prevState[itemSectionId],
    }));
  };

  const isActive = (item: NavItemConfigType) => {
    return (
      activePath === item.path ||
      (item.children &&
        activePath.startsWith(item.path) &&
        activePath !== item.path)
    );
  };

  const isSubMenuActive = (subItem: NavItemConfigType) =>
    activePath === subItem.path;

  const renderNavItem = (item: NavItemConfigType) => {
    const hasSubItems = item.children && item.children.length > 0;
    const isItemActive = isActive(item);
    const isSubMenuOpen =
      openSubMenus[item.sectionId] === true ||
      (hasSubItems &&
        isItemActive &&
        item.children?.some((child) => activePath.startsWith(child.path)));

    const IconToRender = item.icon as React.ElementType | undefined;

    return (
      <NavItem
        key={item.sectionId}
        $isActive={isItemActive}
        $hasSubItems={hasSubItems}
      >
        <a
          href={item.path}
          onClick={(e) => {
            if (item.isExternal) {
              return;
            }

            if (hasSubItems) {
              handleToggleSubMenu(item.sectionId, e);
            } else {
              e.preventDefault();
              onNavLinkClick(item.path);
            }
          }}
          target={item.isExternal ? "_blank" : undefined}
          rel={item.isExternal ? "noopener noreferrer" : undefined}
        >
          {IconToRender && <IconToRender />} {/* <<<< ICON IS RENDERED HERE */}
          {item.label}
          {hasSubItems && (isSubMenuOpen ? <FaAngleDown /> : <FaAngleRight />)}
        </a>
        {hasSubItems && (
          <SubNavList $isOpen={isSubMenuOpen}>
            {item.children?.map((subItem) => {
              return (
                <li key={subItem.sectionId}>
                  <a
                    href={subItem.path}
                    onClick={(e) => {
                      if (subItem.isExternal) return;
                      e.preventDefault();
                      onNavLinkClick(subItem.path);
                    }}
                    target={subItem.isExternal ? "_blank" : undefined}
                    rel={subItem.isExternal ? "noopener noreferrer" : undefined}
                    style={
                      isSubMenuActive(subItem)
                        ? {
                            fontWeight: theme.typography.admin.weights.semiBold,
                            color: theme.colors.accent1,
                          }
                        : {}
                    }
                  >
                    {/* {SubItemIconToRender && <SubItemIconToRender />} You can add icon rendering for subitems */}
                    {subItem.label}
                  </a>
                </li>
              );
            })}
          </SubNavList>
        )}
      </NavItem>
    );
  };

  if (navItemsToDisplay.length === 0 && userRole) {
    return (
      <AdminSidebarContainer>
        <NavList>
          <li
            style={{
              padding: "20px",
              color: theme.colors.adminTextSecondary || "#ccc",
              textAlign: "center",
            }}
          >
            No items for role: {userRole}.
          </li>
        </NavList>
      </AdminSidebarContainer>
    );
  }

  return (
    <AdminSidebarContainer>
      <NavList>{navItemsToDisplay.map(renderNavItem)}</NavList>
    </AdminSidebarContainer>
  );
};

export default AdminSidebar;

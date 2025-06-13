// src/components/admin/Header/Header.tsx
import React, { useState, useEffect, useRef } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import styled from "styled-components"; // Keep if PrimaryActionButton is here
import { darken } from "polished"; // Keep if PrimaryActionButton is here
import {
  FaBell,
  FaCog,
  FaStore,
  FaUserCircle,
  FaPlusSquare,
  FaSearch,
  FaUserPlus,
  FaBoxOpen,
  FaTags,
  FaBars, // FaBars for sidebar toggle
} from "react-icons/fa";

// Assuming these are correctly defined in Header.styles.ts
// You might need to adjust them to properly wrap/style RouterLink or buttons
import {
  AdminHeaderContainer,
  HeaderLeft,
  AdminLogo, // This might be styled(RouterLink) or wrap a RouterLink
  HeaderRight,
  IconLink, // This might be styled.button or styled(RouterLink)
  UserProfile, // This might be styled.button or styled.div
  SearchInputContainer,
} from "./Header.styles";

import type { UserRole } from "@/config/rolesConfig";
import { ROLES_CONFIG } from "@/config/rolesConfig";
import { Types } from "mongoose"; // For ObjectId.isValid if used in breadcrumbs

// PrimaryActionButton (if still defined in this file)
const PrimaryActionButton = styled.button`
  // ... (your existing styles for PrimaryActionButton) ...
  background-color: #a97c50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: ${darken(0.05, "#A97C50")};
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0px);
    background-color: ${darken(0.1, "#A97C50")};
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
`;

interface AdminHeaderProps {
  userRole: UserRole;
  userDisplayName?: string;
  userAvatarSrc?: string;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onQuickActionClick?: (actionType: string) => void;
  onLogout?: () => void;
  onViewStore?: () => void;
  onToggleSidebar?: () => void; // NEW: For sidebar collapse toggle
  isSidebarCollapsed?: boolean; // NEW: To show different icon based on state
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  userRole,
  userDisplayName = "Admin User",
  userAvatarSrc,
  onSearch,
  onNotificationsClick,
  onQuickActionClick,
  onLogout,
  onViewStore,
  onToggleSidebar,
  isSidebarCollapsed,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  let displayedTitle = "Élan Admin";
  let fullDefaultDashboardPath = "/admin/dashboard"; // The complete path

  const roleConfig = ROLES_CONFIG[userRole];
  if (roleConfig) {
    fullDefaultDashboardPath = roleConfig.defaultDashboardPath;
    switch (userRole) {
      case "admin":
        displayedTitle = "Élan Platform";
        break;
      case "vendor":
        displayedTitle = "Vendor Portal";
        break;
      case "individual_seller":
        displayedTitle = "Seller Central";
        break;
    }
  }

  // Determine the 'to' prop for RouterLink, assuming basename="/admin" in BrowserRouter
  const routerLinkDefaultPath = fullDefaultDashboardPath.startsWith("/admin/")
    ? fullDefaultDashboardPath.substring("/admin".length) || "/" // Ensures it's at least '/' if path was just '/admin'
    : fullDefaultDashboardPath;

  const handleSearchIconClick = () => {
    /* ... same ... */
    setIsSearchExpanded((prev) => {
      const nextState = !prev;
      if (nextState && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      return nextState;
    });
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      // setIsSearchExpanded(false); // Optionally close search on submit
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        if (isSearchExpanded && !searchQuery) setIsSearchExpanded(false); // Close only if empty
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchExpanded, searchQuery]);

  const renderPrimaryAction = () => {
    let actionText = "";
    let ActionIcon = FaPlusSquare;
    let actionType = "";
    let navigationPath: string | null = null; // Path relative to /admin

    switch (userRole) {
      case "admin":
        actionText = "Add Platform User";
        ActionIcon = FaUserPlus;
        actionType = "platform:addUser";
        navigationPath = "/settings/users";
        break;
      case "vendor":
        actionText = "New Product";
        ActionIcon = FaBoxOpen;
        actionType = "vendor:addProduct";
        navigationPath = "/products/new";
        break;
      case "individual_seller":
        actionText = "List New Item";
        ActionIcon = FaTags;
        actionType = "seller:listItem";
        navigationPath = "/products/new";
        break;
      default:
        return null;
    }

    return (
      <PrimaryActionButton
        onClick={() => {
          if (onQuickActionClick) onQuickActionClick(actionType);
          if (navigationPath) navigate(navigationPath);
        }}
      >
        <ActionIcon />
        <span>{actionText}</span>
      </PrimaryActionButton>
    );
  };

  // A more robust breadcrumb solution often uses useMatches (RR 6.4+) or a custom hook
  // that traverses the `adminRoutes` config based on `location.pathname`.
  // For now, this is a placeholder if you want simple breadcrumbs.
  const getBreadcrumbDisplay = () => {
    const pathParts = location.pathname
      .replace(/^\/admin\/?/, "")
      .split("/")
      .filter(Boolean);
    if (pathParts.length > 0 && pathParts[0] !== "dashboard") {
      return pathParts
        .map((part) =>
          part
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        )
        .join(" / ");
    }
    return null;
  };
  const breadcrumbText = getBreadcrumbDisplay();

  return (
    <AdminHeaderContainer>
      <HeaderLeft>
        {onToggleSidebar && (
          <IconLink // Assuming IconLink can render as a button
            as="button"
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{ marginRight: "15px" }} // Basic styling
          >
            <FaBars /> {/* Or a different icon for "expanded" state */}
          </IconLink>
        )}
        <AdminLogo>
          {" "}
          {/* Ensure AdminLogo is or wraps RouterLink */}
          <RouterLink
            to={routerLinkDefaultPath}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {displayedTitle}
          </RouterLink>
        </AdminLogo>
        {breadcrumbText && (
          <span
            style={{
              fontSize: "0.9rem",
              color: "#777",
              marginLeft: "20px",
              userSelect: "none",
            }}
          >
            {breadcrumbText}
          </span>
        )}
      </HeaderLeft>

      <HeaderRight>
        <SearchInputContainer
          ref={searchContainerRef}
          $isExpanded={isSearchExpanded}
        >
          <FaSearch
            onClick={
              isSearchExpanded && searchQuery.trim()
                ? () => handleSearchSubmit()
                : handleSearchIconClick
            }
          />
          <form onSubmit={handleSearchSubmit} style={{ width: "100%" }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={isSearchExpanded ? "Search..." : ""}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>
        </SearchInputContainer>

        {renderPrimaryAction()}

        {userRole === "admin" && ( // Example: Settings cog only for Admin
          <IconLink
            as="button"
            title="Platform Settings"
            onClick={() => navigate("/settings/general")} // Path relative to /admin base
          >
            <FaCog />
          </IconLink>
        )}

        <IconLink as="button" title="View Storefront" onClick={onViewStore}>
          <FaStore />
        </IconLink>

        <IconLink
          as="button"
          title="Notifications"
          onClick={onNotificationsClick}
        >
          <FaBell />
          {/* Potential notification badge */}
        </IconLink>

        <UserProfile
          as="button" // Assuming UserProfile can render as a button
          title="My Account & Options"
          onClick={() => {
            // Determine profile path relative to /admin base
            const fullProfilePath =
              ROLES_CONFIG[userRole]?.profilePath || "/admin/settings/profile";
            const routerProfilePath = fullProfilePath.startsWith("/admin/")
              ? fullProfilePath.substring("/admin".length)
              : fullProfilePath;
            navigate(routerProfilePath || "/settings/profile"); // Fallback just in case
          }}
        >
          <img
            src={
              userAvatarSrc ||
              `https://i.pravatar.cc/38?u=${userDisplayName.replace(/\s/g, "")}`
            }
            alt={`${userDisplayName} avatar`}
          />
          <span>{userDisplayName}</span>
        </UserProfile>
      </HeaderRight>
    </AdminHeaderContainer>
  );
};

export default AdminHeader;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { darken } from 'polished';
import {
  FaBell, FaCog, FaStore, FaUserCircle, FaPlusSquare, FaSearch,
  FaUserPlus, // For Super Admin "New User"
  FaBoxOpen, // For Vendor "Add Product"
  FaTags,    // For Seller "List Item"
  FaEllipsisV, // For a potential "More Actions" mobile button
} from 'react-icons/fa';

// --- Your Styled Components ---
import {
  AdminHeaderContainer,
  HeaderLeft,
  AdminLogo,
  HeaderRight,
  IconLink,
  UserProfile,
  SearchInputContainer,
} from './Header.styles';
// Assuming AdminButton might still be used or we create a new styled button.
// For this iteration, let's try to use IconLink for quick actions if possible,
// or introduce a new styled button specifically for "primary" header actions.

// --- Import UserRole and ROLES_CONFIG ---
import type { UserRole } from '@/config/rolesConfig';
import { ROLES_CONFIG } from '@/config/rolesConfig';

// --- Updated AdminHeaderProps ---
interface AdminHeaderProps {
  // adminName prop might be less relevant if role dictates title, but can be a fallback.
  // We'll use userRole to derive the main displayed name/title.
  userRole: UserRole;
  userDisplayName?: string; // e.g., "Jane Doe" - for the UserProfile
  userAvatarSrc?: string;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onQuickActionClick?: (actionType: string) => void; // Action type is now mandatory
  onLogout?: () => void;
  onViewStore?: () => void;
  currentPath?: string; // <<<< NEW: To potentially show breadcrumbs or context
  onNavigate?: (path: string) => void; // <<<< NEW: For actions that navigate
}

// New Styled Component (Example, or add to Header.styles.ts)
// This is for a more prominent "Primary Action" button, distinct from IconLink
const PrimaryActionButton = styled.button`
  background-color: #A97C50; /* Your existing Élan brown accent */
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 25px; /* Pill shape */
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  &:hover {
    background-color: ${darken(0.05, '#A97C50')};
    transform: translateY(-1px);
  }
  &:active {
    transform: translateY(0px);
    background-color: ${darken(0.1, '#A97C50')};
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
    padding: 8px 12px;
    font-size: 0.8rem;
    /* Optionally hide text and show only icon on very small screens */
    /* span { display: none; } */
    /* min-width: 40px; // To maintain size for icon */
  }
`;


const AdminHeader: React.FC<AdminHeaderProps> = ({
  userRole,
  userDisplayName = "Admin User", // Default if not provided
  userAvatarSrc, // Can be undefined, we'll use a fallback
  onSearch,
  onNotificationsClick,
  onQuickActionClick, // Expect this to be called with an actionType
  onLogout,
  onViewStore,
  currentPath,
  onNavigate,
}) => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // --- Determine Role-Specific Title and Default Dashboard Path ---
  let displayedTitle = "Élan Admin";
  let defaultDashboardPath = "/admin/dashboard";
  const roleConfig = ROLES_CONFIG[userRole];

  if (roleConfig) {
    defaultDashboardPath = roleConfig.defaultDashboardPath;
    switch (userRole) {
      case 'superAdmin': displayedTitle = "Élan Platform"; break;
      case 'vendor': displayedTitle = "Vendor Portal"; break;
      case 'seller': displayedTitle = "Seller Central"; break;
    }
  }

  const handleSearchIconClick = () => {
    setIsSearchExpanded(prev => {
      const nextState = !prev;
      if (nextState && searchInputRef.current) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      return nextState;
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        if (isSearchExpanded) setIsSearchExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchExpanded]);


  // --- Role-Specific Primary "Quick Action" Button ---
  const renderPrimaryAction = () => {
    let actionText = "";
    let ActionIcon = FaPlusSquare; // Default icon
    let actionType = "";

    switch (userRole) {
      case 'superAdmin':
        actionText = "Add Platform User";
        ActionIcon = FaUserPlus;
        actionType = 'platform:addUser';
        break;
      case 'vendor':
        actionText = "New Product"; // For their store
        ActionIcon = FaBoxOpen;
        actionType = 'vendor:addProduct';
        break;
      case 'seller':
        actionText = "List New Item";
        ActionIcon = FaTags;
        actionType = 'seller:listItem';
        break;
      default:
        return null; // No primary action for unknown roles or if not desired
    }

    return (
      <PrimaryActionButton onClick={() => onQuickActionClick?.(actionType)}>
        <ActionIcon />
        <span>{actionText}</span>
      </PrimaryActionButton>
    );
  };

  const getBreadcrumb = () => {
    if (!currentPath) return null;
    // Simple breadcrumb, can be made more sophisticated
    // This requires 'findNavItemByPath' if we want to use labels from config.
    // For simplicity, we'll just show the path or a part of it.
    const pathSegments = currentPath.split('/').filter(Boolean);
    if (pathSegments.length > 1 && pathSegments[1] !== 'dashboard') {
        const currentPageName = pathSegments.pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const parentPathName = pathSegments.pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return (
            <span style={{ fontSize: '0.9rem', color: '#777', marginLeft: '20px' }}>
                 {parentPathName && `${parentPathName} / `}{currentPageName}
            </span>
        );
    }
    return null;
  };


  return (
    <AdminHeaderContainer>
      <HeaderLeft>
        <AdminLogo>
          <Link href={defaultDashboardPath}> {/* Simpler Link for Next.js 13+ */}
            {displayedTitle}
          </Link>
        </AdminLogo>
        {getBreadcrumb()} {/* Display breadcrumb */}
      </HeaderLeft>

      <HeaderRight>
        <SearchInputContainer ref={searchContainerRef} $isExpanded={isSearchExpanded}>
          <FaSearch onClick={isSearchExpanded && searchQuery.trim() ? () => handleSearchSubmit() : handleSearchIconClick} />
          <form onSubmit={handleSearchSubmit} style={{ width: '100%'}}> {/* Removed display:none, relying on opacity/visibility from styles */}
            <input
              ref={searchInputRef}
              type="text"
              placeholder={isSearchExpanded ? "Search..." : ""}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </form>
        </SearchInputContainer>

        {renderPrimaryAction()} {/* Render the role-specific primary action button */}

        {/* Regular Icon Links for common actions */}
        {userRole === 'superAdmin' && ( // Example: Settings cog only for Super Admin
             <IconLink as="button" title="Platform Settings" onClick={() => onNavigate?.('/admin/settings/general')}>
                <FaCog />
            </IconLink>
        )}

        <IconLink as="button" title="View Storefront" onClick={onViewStore}>
          <FaStore />
        </IconLink>

        <IconLink as="button" title="Notifications" onClick={onNotificationsClick}>
          <FaBell />
          {/* Potential notification badge */}
        </IconLink>

        <UserProfile
          title="My Account & Options"
          onClick={() => {
            // TODO: Implement user dropdown menu here
            // For now, could navigate to profile or logout
            // onNavigate?.(ROLES_CONFIG[userRole]?.profilePath || '/admin/settings/profile');
            console.log('UserProfile clicked - to implement dropdown (e.g., profile, logout)');
            onLogout?.(); // Temp: Direct logout
          }}
        >
          <img src={userAvatarSrc || `https://i.pravatar.cc/38?u=${userDisplayName.replace(/\s/g, "")}`} alt={`${userDisplayName} avatar`} />
          <span>{userDisplayName}</span> {/* Display actual user name */}
        </UserProfile>
      </HeaderRight>
    </AdminHeaderContainer>
  );
};

export default AdminHeader;
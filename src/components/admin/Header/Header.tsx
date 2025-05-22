// src/components/Admin/Header/Header.tsx
import React, { useState } from 'react'; // React, useState
import { FaBell, FaCog, FaSignOutAlt, FaSearch, FaPlus, FaStore } from 'react-icons/fa'; 

import { 
  AdminHeaderContainer,
  HeaderLeft,
  AdminLogo,
  HeaderRight,
  IconLink,
  UserProfile,
  SearchInputContainer,
} from './Header.styles';
import { AdminButton } from '../Dashboard/Common/Common.styles';

interface AdminHeaderProps {
    adminName: string;
    userAvatarSrc?: string;
    onSearch?: (query: string) => void;
    onNotificationsClick?: () => void; 
    onQuickActionClick?: () => void;   
    onLogout?: () => void;
    onViewStore?: () => void;
}



const AdminHeader: React.FC<AdminHeaderProps> = ({
    adminName,
    userAvatarSrc = 'https://picsum.photos/seed/admin-avatar/100/100',
    onSearch,
    onNotificationsClick, // VERIFY: This prop is destructured
    onQuickActionClick,   // VERIFY: This prop is destructured
    onLogout,
    onViewStore,
}) => {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const handleSearchIconClick = () => {
        setIsSearchExpanded(prev => !prev);
    };

    return (
        <AdminHeaderContainer>
            <HeaderLeft>
                <AdminLogo><a href="/admin">Élan Admin</a></AdminLogo>
                <SearchInputContainer $isExpanded={isSearchExpanded}>
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => onSearch?.(e.target.value)}
                        onFocus={() => setIsSearchExpanded(true)}
                        onBlur={() => setIsSearchExpanded(false)}
                    />
                    <FaSearch onClick={handleSearchIconClick} />
                </SearchInputContainer>
            </HeaderLeft>

            <HeaderRight>
                <AdminButton $variant="primary" onClick={onQuickActionClick} aria-label="Add New Item">
                    <FaPlus /> Quick Action
                </AdminButton>
                
                <IconLink href="#" onClick={onNotificationsClick} aria-label="Notifications">
                    <FaBell /> {/* This is the bell icon */}
                </IconLink>
                
                <IconLink href="#" onClick={onViewStore} aria-label="View Store Front">
                    <FaStore />
                </IconLink>
                
                <UserProfile onClick={onLogout} aria-label="Admin Profile & Logout">
                    <img src={userAvatarSrc} alt={`${adminName} avatar`} />
                    <span>{adminName}</span>
                </UserProfile>
            </HeaderRight>
        </AdminHeaderContainer>
    );
};

export default AdminHeader;
// src/components/Admin/Sidebar/Sidebar.tsx
import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaChartLine, FaPaintBrush, FaCog, FaAngleDown, FaAngleRight, FaFileAlt } from 'react-icons/fa';

import {
  AdminSidebarContainer,
  NavList,
  NavItem,
  SubNavList,
} from './Sidebar.styles';

// Dummy Navigation Data
interface NavItemData {
  id: string;
  label: string;
  icon?: React.ElementType; // Icon is optional for sub-items
  path: string;
  subItems?: NavItemData[];
}

const adminNavItems: NavItemData[] = [
  { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt, path: '/admin/dashboard' },
  { id: 'products', label: 'Products', icon: FaBox, path: '/admin/products',
    subItems: [
      { id: 'all-products', label: 'All Products', icon: FaFileAlt, path: '/admin/products' },
      { id: 'categories', label: 'Categories', icon: FaFileAlt, path: '/admin/products/categories' },
      { id: 'attributes', label: 'Attributes', icon: FaFileAlt, path: '/admin/products/attributes' },
      { id: 'inventory', label: 'Inventory', icon: FaFileAlt, path: '/admin/products/inventory' },
    ]
  },
  { id: 'orders', label: 'Orders', icon: FaShoppingCart, path: '/admin/orders' },
  { id: 'customers', label: 'Customers', icon: FaUsers, path: '/admin/customers' },
  { id: 'reports', label: 'Reports', icon: FaChartLine, path: '/admin/reports' },
  { id: 'marketing', label: 'Marketing', icon: FaPaintBrush, path: '/admin/marketing' },
  { id: 'settings', label: 'Settings', icon: FaCog, path: '/admin/settings', // Main settings path (will show initial overview)
    subItems: [
      { id: 'settings-general', label: 'General', path: '/admin/settings/general' }, // Main settings link (will show initial overview)
      { id: 'settings-users', label: 'Users', path: '/admin/settings/users' },
      { id: 'settings-payment-gateways', label: 'Payment Gateways', path: '/admin/settings/payment-gateways' }, // <--- NEW SUB-ITEM
      { id: 'settings-shipping-tax', label: 'Shipping & Tax', path: '/admin/settings/shipping-tax' },       // <--- NEW SUB-ITEM
      { id: 'settings-branding', label: 'Branding', path: '/admin/settings/branding' },                       // <--- NEW SUB-ITEM
    ]
  },
];

interface AdminSidebarProps {
  activePath: string;
  onNavLinkClick?: (path: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePath, onNavLinkClick }) => {
  const theme = useTheme();
  const [openSubMenus, setOpenSubMenus] = useState<{[key: string]: boolean}>({});

  const handleToggleSubMenu = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    setOpenSubMenus(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const isActive = (item: NavItemData) => {
    // An item is active if its path matches directly, OR if its parent path matches a prefix of activePath
    return activePath === item.path || (item.subItems && activePath.startsWith(item.path));
  };

  const isSubMenuActive = (subItem: NavItemData) => activePath === subItem.path;

  const renderNavItem = (item: NavItemData) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isItemActive = isActive(item);
    // If it's a parent item and any of its children's paths start with activePath, expand it
    const isSubMenuOpen = openSubMenus[item.id] || (hasSubItems && activePath.startsWith(item.path));


    return (
      <NavItem key={item.id} $isActive={isItemActive} $hasSubItems={hasSubItems}>
        <a
          href={item.path}
          onClick={(e) => {
            if (hasSubItems) {
                // If it's a parent link with sub-items, toggle sub-menu visibility
                handleToggleSubMenu(item.id, e);
            } else {
                // For actual navigation links, prevent default and call handler
                e.preventDefault();
                onNavLinkClick?.(item.path);
            }
          }}
        >
          {item.icon && React.createElement(item.icon)}
          {item.label}
          {hasSubItems && (isSubMenuOpen ? <FaAngleDown /> : <FaAngleRight />)}
        </a>
        {hasSubItems && (
          <SubNavList $isOpen={isSubMenuOpen}>
            {item.subItems?.map(subItem => (
              <li key={subItem.id}>
                <a
                  href={subItem.path}
                  onClick={(e) => {
                      e.preventDefault();
                      onNavLinkClick?.(subItem.path);
                  }}
                  style={isSubMenuActive(subItem) ? { fontWeight: theme.typography.admin.weights.semiBold, color: theme.colors.accent1 } : {}}
                >
                  {subItem.label}
                </a>
              </li>
            ))}
          </SubNavList>
        )}
      </NavItem>
    );
  };

  return (
    <AdminSidebarContainer>
      <NavList>
        {adminNavItems.map(renderNavItem)}
      </NavList>
    </AdminSidebarContainer>
  );
};

export default AdminSidebar;
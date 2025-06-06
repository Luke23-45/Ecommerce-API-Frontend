
import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useMemo,
} from "react";
import { useTheme, type DefaultTheme } from "styled-components"; 
import {
  FaRegUser, FaRegHeart, FaShoppingCart, FaSearch, FaUserCircle,
  FaTachometerAlt, FaBuilding, FaStore, FaListOl, FaHeartbeat, FaCog, FaSignOutAlt,
} from "react-icons/fa";
import ElanLogoImage from "@/assets/logo1.png"; 
import { Link as RouterLink, useNavigate } from "react-router-dom";

import {
  StyledGrandMarquee, MarqueeContent, HeaderLeftSection, BrandLogoContainer,
  HeaderCenterSearch, SearchInputContainer, HeaderRightUtility, UtilityIconWrapper,
  CartCountBadge, SearchSectionIcon, CustomSelectWrapper, CustomSelectTrigger,
  CustomDropdownList, CustomDropdownItem, AccountDropdownContainer, AccountDropdownHeader,
  AccountDropdownList, AccountDropdownItem, AccountDropdownSeparator,
} from "./styles/GrandMarquee.styles";


interface SearchCategory {
  value: string;
  label: string;
}

interface DropdownMenuItem {
  id: string;
  label: string;
  path?: string;
  action?: () => void;
  icon?: React.ReactNode;
  isSeparator?: boolean;
  isDestructive?: boolean;
}

interface UserDataForMarquee {
  isAuthenticated: boolean;
  roles: string[];
  firstName?: string;
  avatarUrl?: string;
}

interface GrandMarqueeProps {
  onSearch?: (query: string, category: string) => void;
  onViewCart?: () => void;
  cartItemCount?: number;
  userData?: UserDataForMarquee; 
  onLogout?: () => void;        
  
}


const dummySearchCategories: SearchCategory[] = [
    { value: "all", label: "All Categories" }, { value: "living-room", label: "Living Room" },
    { value: "dining", label: "Dining" }, { value: "bedroom", label: "Bedroom" },
    { value: "lighting", label: "Lighting" }, { value: "decor", label: "Decor" },
    { value: "kitchen", label: "Kitchen" }, { value: "outdoor", label: "Outdoor" },
    { value: "office", label: "Home Office" }, { value: "bath", label: "Bathroom" },
];
const loggedOutUserData: UserDataForMarquee = { isAuthenticated: false, roles: [] };
const consumerUserData: UserDataForMarquee = { isAuthenticated: true, roles: ["consumer"], firstName: "Elara"};

export const individualSellerUserData: UserDataForMarquee = {
  isAuthenticated: true,
  roles: ["consumer", "individual_seller"], 
  firstName: "Artisan",

};

export const vendorUserData: UserDataForMarquee = {
  isAuthenticated: true,
  roles: ["consumer", "vendor"], 
  firstName: "BrandCo",
  
};

export const adminUserData: UserDataForMarquee = {
  isAuthenticated: true,
  roles: ["admin"],
  firstName: "Admin",
  
};
const GrandMarquee: React.FC<GrandMarqueeProps> = ({
  onSearch,
  onViewCart,
  cartItemCount = 0,
  userData = adminUserData, 
  onLogout,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false); 
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const theme = useTheme() as DefaultTheme; 
  const navigate = useNavigate();

  const [selectTriggerWidth, setSelectTriggerWidth] = useState("auto");
  const measurementSpanRef = useRef<HTMLSpanElement | null>(null);

  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const accountIconRef = useRef<HTMLButtonElement>(null);

  
  useEffect(() => {
    const span = document.createElement("span");
    span.style.position = "absolute";
    span.style.visibility = "hidden";
    span.style.height = "auto";
    span.style.width = "auto";
    span.style.whiteSpace = "nowrap";
    
    span.style.fontFamily = theme?.typography?.body?.fontFamily || 'Inter, sans-serif';
    span.style.fontSize = theme?.typography?.body?.sizes?.base || '16px'; 
    document.body.appendChild(span);
    measurementSpanRef.current = span;
    return () => {
      measurementSpanRef.current?.remove();
      measurementSpanRef.current = null;
    };
  }, [theme]);

  
  const calculateWidth = useCallback(() => {
    if (!measurementSpanRef.current || !searchDropdownRef.current?.firstChild || !theme) return;

    const currentLabel = dummySearchCategories.find(cat => cat.value === selectedCategory)?.label || 'All Categories';
    const triggerElement = searchDropdownRef.current.firstChild as HTMLElement; 
    const computedStyle = getComputedStyle(triggerElement);

    const span = measurementSpanRef.current;
    span.style.fontFamily = computedStyle.fontFamily;
    span.style.fontSize = computedStyle.fontSize;
    span.style.fontWeight = computedStyle.fontWeight;
    span.style.letterSpacing = computedStyle.letterSpacing;
    span.style.paddingLeft = computedStyle.paddingLeft;
    span.style.paddingRight = computedStyle.paddingRight;
    
    const arrowSpace = 30; 
    span.textContent = currentLabel;
    
    const measuredWidth = span.offsetWidth + arrowSpace;
    const minTriggerWidth = parseFloat(computedStyle.minWidth) || 110; 

    setSelectTriggerWidth(`${Math.max(minTriggerWidth, measuredWidth)}px`);
    
    searchDropdownRef.current.style.setProperty('--dropdown-width', `${Math.max(minTriggerWidth, measuredWidth)}px`);
  }, [selectedCategory, theme]);

  useLayoutEffect(() => {
    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, [calculateWidth]);


  
  useEffect(() => {
    const handleClickOutsideSearchDropdown = (event: MouseEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    if (isSearchDropdownOpen) {
        document.addEventListener("mousedown", handleClickOutsideSearchDropdown);
    }
    return () => document.removeEventListener("mousedown", handleClickOutsideSearchDropdown);
  }, [isSearchDropdownOpen]);

  
  useEffect(() => {
    const handleClickOutsideAccountDropdown = (event: MouseEvent) => {
      if (
        accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node) &&
        accountIconRef.current && !accountIconRef.current.contains(event.target as Node)
      ) {
        setIsAccountDropdownOpen(false);
      }
    };
    if (isAccountDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutsideAccountDropdown);
    }
    return () => document.removeEventListener("mousedown", handleClickOutsideAccountDropdown);
  }, [isAccountDropdownOpen]);

  const selectedCategoryLabel = dummySearchCategories.find(cat => cat.value === selectedCategory)?.label || "All Categories";
  const handleSearchSubmit = useCallback(() => { onSearch?.(searchTerm, selectedCategory); }, [searchTerm, selectedCategory, onSearch]);
  const handleSearchKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter") handleSearchSubmit(); }, [handleSearchSubmit]);
  const toggleSearchDropdown = useCallback(() => setIsSearchDropdownOpen(prev => !prev), []); 
  const handleCategorySelect = useCallback((value: string) => { setSelectedCategory(value); setIsSearchDropdownOpen(false); }, []);

  
  const toggleAccountDropdown = useCallback(() => {
    setIsAccountDropdownOpen(prev => !prev);
    
    if (!isAccountDropdownOpen) setIsSearchDropdownOpen(false);
  }, [isAccountDropdownOpen]);


  const accountMenuItems = useMemo((): DropdownMenuItem[] => {
    if (!userData?.isAuthenticated) return [];
    const items: DropdownMenuItem[] = [];
    items.push({ id: "profile", label: "My Profile", path: "/profile/dashboard", icon: <FaUserCircle /> });
    if (userData.roles.includes("admin")) items.push({ id: "admin_dashboard", label: "Admin Dashboard", path: "/admin/dashboard", icon: <FaTachometerAlt /> });
    else if (userData.roles.includes("individual_seller")) items.push({ id: "seller_dashboard", label: "Seller Dashboard", path: "/seller/dashboard", icon: <FaStore /> });
    else if (userData.roles.includes("vendor")) items.push({ id: "vendor_dashboard", label: "Vendor Dashboard", path: "/vendor/dashboard", icon: <FaBuilding /> });
    if (!userData.roles.includes("admin")) {
      items.push({ id: "orders", label: "My Orders", path: "/profile/orders", icon: <FaListOl /> });
      items.push({ id: "wishlist", label: "Wishlist", path: "/profile/wishlist", icon: <FaHeartbeat /> });
    }
    items.push({ id: "settings", label: "Account Settings", path: "/profile/settings", icon: <FaCog /> });
    items.push({ id: "separator1", label: "", isSeparator: true });
    items.push({ id: "logout", label: "Logout", action: () => { onLogout?.(); setIsAccountDropdownOpen(false); navigate('/'); }, icon: <FaSignOutAlt />, isDestructive: true });
    return items;
  }, [userData, onLogout, navigate]);


  return (
    <StyledGrandMarquee>
      <MarqueeContent>
        <HeaderLeftSection>
          <BrandLogoContainer href="/">
            <img src={ElanLogoImage as string} alt="Élan Homewares Logo" />
          </BrandLogoContainer>
        </HeaderLeftSection>

        <HeaderCenterSearch>
          <CustomSelectWrapper style={{position:"relative"}} ref={searchDropdownRef}>
            <CustomSelectTrigger
              onClick={toggleSearchDropdown}
              className={isSearchDropdownOpen ? "open" : ""}
              aria-expanded={isSearchDropdownOpen}
              aria-haspopup="listbox"
              aria-label="Select search category"
              $width={selectTriggerWidth}
            >
              {selectedCategoryLabel}
            </CustomSelectTrigger>
            <CustomDropdownList $isOpen={isSearchDropdownOpen} role="listbox">
              {dummySearchCategories.map((cat) => (
                <CustomDropdownItem
                  key={cat.value}
                  onClick={() => handleCategorySelect(cat.value)}
                  $isSelected={selectedCategory === cat.value}
                  role="option"
                  aria-selected={selectedCategory === cat.value}
                >
                  {cat.label}
                </CustomDropdownItem>
              ))}
            </CustomDropdownList>
          </CustomSelectWrapper>

          <SearchInputContainer>
            <input
              type="text"
              placeholder="Search Élan Homewares..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              aria-label="Search products"
            />
          </SearchInputContainer>
          <SearchSectionIcon type="button" onClick={handleSearchSubmit} aria-label="Submit search">
            <FaSearch />
          </SearchSectionIcon>
        </HeaderCenterSearch>

        <HeaderRightUtility>
          {/* Wishlist Icon - shows if user is NOT authenticated */}
          {!userData?.isAuthenticated && (
            <UtilityIconWrapper type="button" onClick={() => navigate("/auth/login")} aria-label="View wishlist - Login required">
              <FaRegHeart />
            </UtilityIconWrapper>
          )}

          <UtilityIconWrapper
            ref={accountIconRef}
            type="button"
            onClick={userData?.isAuthenticated ? toggleAccountDropdown : () => navigate("/auth/login")}
            aria-label={userData?.isAuthenticated ? "Open account menu" : "Sign in or register"}
            aria-haspopup={userData?.isAuthenticated ? "true" : "false"}
            aria-expanded={userData?.isAuthenticated ? isAccountDropdownOpen : undefined}
          >
            {userData?.avatarUrl ? ( <img src={userData.avatarUrl} alt="User avatar" style={{width:"26px", height:"26px", borderRadius:"50%"}}/> ) 
             : userData?.isAuthenticated ? <FaUserCircle /> 
             : <FaRegUser />}
          </UtilityIconWrapper>
          {userData?.isAuthenticated && isAccountDropdownOpen && ( 
            <AccountDropdownContainer style={{}} $isOpen={isAccountDropdownOpen} ref={accountDropdownRef}>
              {userData.firstName && (
                <AccountDropdownHeader>
                  {userData.avatarUrl && <img src={userData.avatarUrl} alt={`${userData.firstName}'s avatar`} className="user-avatar"/>}
                  <div className="user-info">
                    <span className="user-name">Hello, {userData.firstName}</span>
                  </div>
                </AccountDropdownHeader>
              )}
              <AccountDropdownList role="menu" aria-label="Account actions">
                {accountMenuItems.map((item) =>
                  item.isSeparator ? (
                    <AccountDropdownSeparator key={item.id} role="separator" />
                  ) : (
                    <AccountDropdownItem key={item.id} $isDestructive={item.isDestructive} role="menuitem">
                      {item.path ? (
                        <RouterLink className="itemListName" to={item.path} onClick={() => setIsAccountDropdownOpen(false)}>
                          {item.icon && <span style={{display:'inline-flex', alignItems:'center', marginRight: theme.spacing(2)}}>{item.icon}</span>}
                          {item.label}
                        </RouterLink>
                      ) : (
                        <button type="button" onClick={() => { item.action?.(); }}>
                           {item.icon && <span style={{display:'inline-flex', alignItems:'center', marginRight: theme.spacing(2)}}>{item.icon}</span>}
                           {item.label}
                        </button>
                      )}
                    </AccountDropdownItem>
                  )
                )}
              </AccountDropdownList>
            </AccountDropdownContainer>
          )}

          <UtilityIconWrapper type="button" onClick={onViewCart} aria-label="View shopping cart">
            <FaShoppingCart />
            {cartItemCount != null && cartItemCount > 0 && <CartCountBadge>{cartItemCount}</CartCountBadge>}
          </UtilityIconWrapper>
        </HeaderRightUtility>
      </MarqueeContent>
    </StyledGrandMarquee>
  );
};

export default GrandMarquee;
// src/components/Header.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSearch, FaShoppingCart, FaUserCircle } from 'react-icons/fa'; // Example icons

// Placeholder for logo
import logo from "../../assets/logo.png"
const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.textLight};
  box-shadow: ${props => props.theme.shadows.small};
  position: sticky;
  top: 0;
  z-index: 1000; /* Ensure it stays above other content */
`;

const MainNavWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xxl}; /* Generous padding */

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-wrap: wrap; /* Allow elements to wrap on mobile */
    padding: ${props => props.theme.spacing.sm};
  }
`;

const Logo = styled.img`
  height: 40px; /* Adjust as needed */
  width: auto;
  object-fit: contain;
  margin-right: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    height: 30px;
    margin-right: 0;
    flex-basis: 50%; /* Take half width on mobile */
  }
`;

// 2a. Primary Navigation (The Mega-Menu Powerhouse placeholder)
const PrimaryNav = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.xl}; /* Wide spacing for elegance */

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: ${props => props.theme.spacing.lg};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none; /* Hide on mobile, will be replaced by a hamburger menu */
  }
`;

const NavLink = styled.a`
  font-family: ${props => props.theme.fonts.heading}; /* Playfair Display for main links */
  font-size: 1.1rem;
  font-weight: 400;
  color: ${props => props.theme.colors.textDark};
  position: relative;
  padding: ${props => props.theme.spacing.xs} 0; /* Add some vertical padding */
  transition: color ${props => props.theme.transitions.fast};

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background-color: ${props => props.theme.colors.primary};
    transition: width ${props => props.theme.transitions.fast}, left ${props => props.theme.transitions.fast};
  }

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  &:hover::after {
    width: 100%;
    left: 0;
  }
`;

// 2b. "Spotlight" Secondary Navigation/Promotional Banner
const SpotlightBanner = styled.div`
  background-color: ${props => props.theme.colors.primary}; /* Deep Teal */
  color: ${props => props.theme.colors.textLight};
  text-align: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.md};
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeInDown 0.5s ease-out;

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 0.8rem;
    padding: ${props => props.theme.spacing.xs};
  }
`;

// 2c. "Utility & Search" Tertiary Navigation
const UtilityNav = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    gap: ${props => props.theme.spacing.md};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-basis: 50%; /* Take half width on mobile */
    justify-content: flex-end;
    gap: ${props => props.theme.spacing.sm};
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textDark};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: ${props => props.theme.spacing.xs}; /* Make clickable area larger */
  transition: color ${props => props.theme.transitions.fast};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    font-size: 1.2rem;
    padding: ${props => props.theme.spacing.xs / 2};
  }
`;

const CartCounter = styled.span`
  background-color: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.textLight};
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 50%;
  padding: 2px 6px;
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: popIn 0.3s ease-out; /* Re-using animation from PreHeader */

  @keyframes popIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: ${props => (props.$isOpen ? '250px' : '0')}; /* Use $ for transient props */
  overflow: hidden;
  transition: width ${props => props.theme.transitions.medium};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 0; /* Hide search input on mobile */
  }
`;

const SearchInput = styled.input`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 5px;
  padding: ${props => props.theme.spacing.sm};
  font-size: 1rem;
  width: 100%;
  color: ${props => props.theme.colors.textDark};
  background-color: ${props => props.theme.colors.backgroundLight};
  transition: border-color ${props => props.theme.transitions.fast};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const Header = () => {
  const [cartCount, setCartCount] = useState(2); // Mock cart count
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <HeaderContainer>
      <MainNavWrapper>
        <Logo src={logo} alt="Your Brand Logo" /> {/* Make sure to add a logo.png in src/assets */}

        <PrimaryNav>
          <NavLink href="/new-arrivals">New Arrivals</NavLink>
          <NavLink href="/shop">Shop</NavLink>
          {/* Placeholder for Mega-Menu, would be a complex component */}
          <NavLink href="/collections">Collections</NavLink>
          <NavLink href="/about">Our Story</NavLink>
          <NavLink href="/sustainability">Sustainability</NavLink>
        </PrimaryNav>

        <UtilityNav>
          {/* Search Bar */}
          <SearchInputContainer $isOpen={isSearchOpen}>
            <SearchInput type="text" placeholder="Search..." />
          </SearchInputContainer>
          <IconButton onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search">
            <FaSearch />
          </IconButton>

          <IconButton aria-label="User Account">
            <FaUserCircle />
          </IconButton>

          <IconButton aria-label="Shopping Cart">
            <FaShoppingCart />
            {cartCount > 0 && <CartCounter>{cartCount}</CartCounter>}
          </IconButton>
        </UtilityNav>
      </MainNavWrapper>
      <SpotlightBanner>
        ✨ Limited Time Offer: Free Shipping on all orders over $99! ✨
      </SpotlightBanner>
    </HeaderContainer>
  );
};

export default Header;
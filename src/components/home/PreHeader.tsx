import React from "react";
import { useSelector } from "react-redux";
import { type RootState } from "@/store";
import { Link } from "react-router-dom";
import {
  StyledPreHeader,
  PreHeaderContent,
  NavSection,
  NavLink,
  WishlistIconContainer,
  WishlistCount,
} from "./styles/PreHeader.styles";
import {
  FaRegUser,
  FaRegHeart,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaTruck,
  FaRedoAlt,
  FaStore,
  FaUserTie,
} from "react-icons/fa";

interface PreHeaderProps {
  wishlistCount?: number;
}

const PreHeader: React.FC<PreHeaderProps> = ({ wishlistCount = 0 }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const isIndividualSeller = user?.roles?.includes("individual_seller");
  const isVendor = user?.roles?.includes("vendor");

  return (
    <StyledPreHeader>
      <PreHeaderContent>
        <NavSection>
          <NavLink as={Link} to="/support">
            <FaQuestionCircle />
            Customer Support
          </NavLink>
          <NavLink as={Link} to="/track-order">
            <FaTruck />
            Track Order
          </NavLink>
          <NavLink as={Link} to="/store-locator">
            <FaMapMarkerAlt />
            Store Locator
          </NavLink>
        </NavSection>

        <NavSection>
          {isAuthenticated ? (
            <>
              <NavLink as={Link} to="/account">
                <FaRegUser />
                My Account
              </NavLink>
              {isIndividualSeller && (
                <NavLink as={Link} to="/seller-dashboard">
                  <FaStore />
                  Seller Dashboard
                </NavLink>
              )}
              {isVendor && (
                <NavLink as={Link} to="/vendor-dashboard">
                  <FaUserTie />
                  Vendor Dashboard
                </NavLink>
              )}
            </>
          ) : (
            <NavLink as={Link} to="/auth/login">
              <FaRegUser />
              Sign In / Register
            </NavLink>
          )}
          <NavLink as={Link} to="/wishlist">
            <WishlistIconContainer>
              <FaRegHeart />
              {wishlistCount > 0 && (
                <WishlistCount>{wishlistCount}</WishlistCount>
              )}
            </WishlistIconContainer>
            Wishlist
          </NavLink>
          <NavLink as={Link} to="/recently-viewed">
            <FaRedoAlt />
            Recently Viewed
          </NavLink>
        </NavSection>
      </PreHeaderContent>
    </StyledPreHeader>
  );
};

export default PreHeader;

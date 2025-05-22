// src/components/PreHeader/PreHeader.tsx
import React from 'react';
import { StyledPreHeader, PreHeaderContent, NavSection, NavLink, WishlistIconContainer, WishlistCount } from './styles/PreHeader.styles';
import { FaRegUser, FaRegHeart, FaMapMarkerAlt, FaQuestionCircle, FaTruck, FaRedoAlt } from 'react-icons/fa'; // Example icons from react-icons

interface PreHeaderProps {
    wishlistCount?: number;
}

const PreHeader: React.FC<PreHeaderProps> = ({ wishlistCount = 0 }) => {
    return (
        <StyledPreHeader>
            <PreHeaderContent>
                <NavSection>
                    <NavLink href="#">
                        <FaQuestionCircle />
                        Customer Support
                    </NavLink>
                    <NavLink href="#">
                        <FaTruck />
                        Track Order
                    </NavLink>
                    <NavLink href="#">
                        <FaMapMarkerAlt />
                        Store Locator
                    </NavLink>
                </NavSection>

                <NavSection>
                    <NavLink href="#">
                        <FaRegUser />
                        Sign In / Register
                    </NavLink>
                    <NavLink href="#">
                        <WishlistIconContainer>
                            <FaRegHeart />
                            {wishlistCount > 0 && <WishlistCount>{wishlistCount}</WishlistCount>}
                        </WishlistIconContainer>
                        Wishlist
                    </NavLink>
                    <NavLink href="#">
                        <FaRedoAlt />
                        Recently Viewed
                    </NavLink>
                </NavSection>
            </PreHeaderContent>
        </StyledPreHeader>
    );
};

export default PreHeader;
// src/components/GrandMarquee/PrimaryNav/PrimaryNav.tsx
import React, { useState } from 'react';
import {
    PrimaryNavContainer,
    NavList,
    NavItem,
    MegaMenuOverlay, // Renamed from MegaMenuContainer for clarity
    MegaMenuSection, // Renamed from MegaMenuColumn for clarity
    MegaMenuVisualSpotlight,
    SpotlightImage,
    SpotlightContent,
} from './styles/PrimaryNav.styles'; // Corrected import path

const PrimaryNav: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleMouseEnter = (menuName: string) => {
        setActiveMenu(menuName);
    };

    const handleMouseLeave = () => {
        setActiveMenu(null);
    };

    // Helper for dummy images - use actual image paths in a real app
    const getImage = (text: string) => `https://via.placeholder.com/400x250/F8F8F0/A46E4A?text=${text.replace(/\s/g, '+')}`;
    const getSquareImage = (text: string) => `https://via.placeholder.com/250x250/F8F8F0/9EB78A?text=${text.replace(/\s/g, '+')}`;

    return (
        <PrimaryNavContainer onMouseLeave={handleMouseLeave}>
            <NavList>
                <NavItem onMouseEnter={() => handleMouseEnter('collections')}>
                    <a href="#">Collections</a>
                    <MegaMenuOverlay $isVisible={activeMenu === 'collections'}>
                        {/* Column 1: Core Categories */}
                        <MegaMenuSection>
                            <h3>Shop By Room</h3>
                            <a href="#">Living Room</a>
                            <a href="#">Dining Room</a>
                            <a href="#">Bedroom</a>
                            <a href="#">Kitchen & Bar</a>
                            <a href="#">Home Office</a>
                            <a href="#">Outdoor</a>
                            <a href="#">Bath</a>
                        </MegaMenuSection>

                        {/* Column 2: Specific Product Types */}
                        <MegaMenuSection>
                            <h3>Furniture</h3>
                            <a href="#">Sofas & Seating</a>
                            <a href="#">Tables & Desks</a>
                            <a href="#">Storage & Shelving</a>
                            <a href="#">Beds & Headboards</a>
                            <a href="#">Outdoor Furniture</a>
                            <h3>Decor & Accents</h3>
                            <a href="#">Vases & Bowls</a>
                            <a href="#">Candle Holders</a>
                        </MegaMenuSection>

                        {/* Column 3 & 4: Visual Spotlight 1 (Lifestyle Focus) */}
                        <MegaMenuVisualSpotlight>
                            <SpotlightImage src={getImage("Artisan Ceramics")} alt="Artisan Ceramic Collection" />
                            <SpotlightContent>
                                <h4>Discover Our Artisan Ceramic Collection</h4>
                                <p>Handcrafted by master potters, each piece tells a story of form, function, and enduring beauty.</p>
                                <a href="#">Shop Ceramics</a>
                            </SpotlightContent>
                        </MegaMenuVisualSpotlight>

                        {/* Column 5: Services & Inspirations */}
                        <MegaMenuSection>
                            <h3>Services & Advice</h3>
                            <a href="#">Design Consultations</a>
                            <a href="#">Installation Guides</a>
                            <a href="#">Care & Maintenance</a>
                            <h3>Inspiration</h3>
                            <a href="#">The Élan Journal</a>
                            <a href="#">Room Guides</a>
                            <a href="#">Customer Stories</a>
                        </MegaMenuSection>
                    </MegaMenuOverlay>
                </NavItem>

                <NavItem onMouseEnter={() => handleMouseEnter('new')}>
                    <a href="#">New Arrivals</a>
                    {/* Simplified but still visual Mega Menu for New Arrivals */}
                    <MegaMenuOverlay $isVisible={activeMenu === 'new'}>
                        <MegaMenuSection>
                            <h3>Just In!</h3>
                            <a href="#">All New Season</a>
                            <a href="#">Limited Editions</a>
                            <a href="#">Spring/Summer '24 Lookbook</a>
                            <a href="#">Exclusive Pre-orders</a>
                        </MegaMenuSection>
                        <MegaMenuVisualSpotlight>
                            <SpotlightImage src={getSquareImage("New+Textile+Collection")} alt="New Textile Collection" />
                            <SpotlightContent>
                                <h4>Introducing: The Luma Textile Collection</h4>
                                <p>Sustainable fabrics, serene patterns – elevate your space with our latest arrivals.</p>
                                <a href="#">Shop Textiles</a>
                            </SpotlightContent>
                        </MegaMenuVisualSpotlight>
                        <MegaMenuVisualSpotlight>
                            <SpotlightImage src={getSquareImage("Elan+New+Furniture")} alt="New Furniture Collection" />
                            <SpotlightContent>
                                <h4>The Oslo Dining Chair: New Silhouette</h4>
                                <p>Modern design meets classic comfort. Redefine your dining experience.</p>
                                <a href="#">Explore Chairs</a>
                            </SpotlightContent>
                        </MegaMenuVisualSpotlight>
                        <MegaMenuSection>
                            <h3>Our Craft</h3>
                            <a href="#">Meet the Makers</a>
                            <a href="#">Our Sustainable Journey</a>
                            <a href="#">Élan's Vision</a>
                        </MegaMenuSection>
                    </MegaMenuOverlay>
                </NavItem>

                <NavItem>
                    <a href="#">Bestsellers</a>
                </NavItem>
                <NavItem>
                    <a href="#">Sale</a>
                </NavItem>
                <NavItem>
                    <a href="#">About Élan</a>
                </NavItem>
            </NavList>
        </PrimaryNavContainer>
    );
};

export default PrimaryNav;
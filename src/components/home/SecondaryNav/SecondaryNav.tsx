import React, { useState, useRef, useEffect } from "react";
import { FaBars } from "react-icons/fa";

import {
  SecondaryNavContainer,
  HamburgerWrapper,
  MainNavLinkList,
  MainNavLinkItem,
  MegaMenuContainer,
  MegaMenuColumn,
  PromoBlock,
  SecondaryNavWapper,
} from "./SecondaryNav.styles";

import PrimaryNav from "../PrimaryNav";
import { getProductImage } from "@/utils/imageUtils";

export interface MegaMenuLink {
  id: string;
  label: string;
  path: string;
}
export interface MegaMenuPromo {
  image: string;
  title: string;
  text: string;
  link: string;
  altText?: string;
}
export interface MegaMenuColumnData {
  title?: string;
  links?: MegaMenuLink[];
  promo?: MegaMenuPromo;
}
export interface MegaMenuData {
  columns: MegaMenuColumnData[];
}
export interface NavLinkData {
  id: string;
  label: string;
  path: string;
  megaMenu?: MegaMenuData;
}

const dummyMainNavLinks: NavLinkData[] = [
  {
    id: "collections",
    label: "Collections",
    path: "/collections",
    megaMenu: {
      columns: [
        {
          title: "Shop by Room",
          links: [
            { id: "lr", label: "Living Room", path: "/collections/living" },
            { id: "dr", label: "Dining Room", path: "/collections/dining" },
            { id: "br", label: "Bedroom", path: "/collections/bedroom" },
            { id: "kb", label: "Kitchen & Bar", path: "/collections/kitchen" },
          ],
        },
        {
          title: "Furniture",
          links: [
            {
              id: "fs",
              label: "Sofas & Seating",
              path: "/collections/furniture/seating",
            },
            {
              id: "ttd",
              label: "Tables & Desks",
              path: "/collections/furniture/tables",
            },
            {
              id: "ss",
              label: "Storage",
              path: "/collections/furniture/storage",
            },
          ],
        },
        {
          title: "Decor & More",
          links: [
            {
              id: "va",
              label: "Vases & Sculptures",
              path: "/collections/decor/vases",
            },
            {
              id: "tr",
              label: "Textiles & Rugs",
              path: "/collections/decor/textiles",
            },
            { id: "li", label: "Lighting", path: "/collections/lighting" },
          ],
        },
        {
          promo: {
            image: getProductImage("200", 200, 200),
            altText: "Elegant vase with spring flowers",
            title: "Spring Collection Preview",
            text: "Discover fresh designs inspired by the beauty of nature.",
            link: "/collections/spring-2024",
          },
        },
      ],
    },
  },
  {
    id: "new-arrivals",
    label: "New Arrivals",
    path: "/new-arrivals",
    megaMenu: {
      columns: [
        {
          title: "Latest in Élan",
          links: [
            {
              id: "nf",
              label: "New Furniture",
              path: "/new-arrivals/furniture",
            },
            { id: "nd", label: "New Decor", path: "/new-arrivals/decor" },
            {
              id: "sl",
              label: "Sustainable Lines",
              path: "/new-arrivals/sustainable",
            },
            {
              id: "na-lighting",
              label: "New Lighting Pieces",
              path: "/new-arrivals/lighting",
            },
          ],
        },
        {
          title: "Featured",
          links: [
            {
              id: "limited",
              label: "Limited Editions",
              path: "/new-arrivals/limited",
            },
            {
              id: "collabs",
              label: "Designer Collaborations",
              path: "/new-arrivals/collaborations",
            },
          ],
        },
        {
          promo: {
            image: getProductImage("200", 200, 200),
            altText: "Handcrafted ceramic bowl",
            title: "Artisan Craftsmanship",
            text: "Explore unique, handcrafted pieces from skilled artisans.",
            link: "/collections/artisan",
          },
        },
      ],
    },
  },
  { id: "bestsellers", label: "Bestsellers", path: "/bestsellers" },
  { id: "seller", label: "Sell with Us", path: "/becomeseller" },
];

interface SecondaryNavProps {}
const SecondaryNav: React.FC<SecondaryNavProps> = () => {
  const [isPrimaryMenuOpen, setIsPrimaryMenuOpen] = useState(false);
  const [activeMegaMenuId, setActiveMegaMenuId] = useState<string | null>(null);
  const [isMegaMenuHovered, setIsMegaMenuHovered] = useState(false);

  const navListRef = useRef<HTMLUListElement>(null);
  const megaMenuTimeoutRef = useRef<number | null>(null);

  const handleMenuToggle = () => {
    setIsPrimaryMenuOpen((prev) => !prev);
    if (!isPrimaryMenuOpen) {
      setActiveMegaMenuId(null);
    }
  };

  const handleNavItemMouseEnter = (navItemId: string | undefined) => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    if (navItemId) {
      const navItemData = dummyMainNavLinks.find(
        (link) => link.id === navItemId
      );
      if (navItemData?.megaMenu) {
        setActiveMegaMenuId(navItemId);
      } else {
        setActiveMegaMenuId(null);
      }
    } else {
      setActiveMegaMenuId(null);
    }
  };

  const handleNavItemMouseLeave = () => {
    megaMenuTimeoutRef.current = window.setTimeout(() => {
      if (!isMegaMenuHovered) {
        setActiveMegaMenuId(null);
      }
    }, 150);
  };

  const handleMegaMenuMouseEnter = () => {
    setIsMegaMenuHovered(true);
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
  };

  const handleMegaMenuMouseLeave = () => {
    setIsMegaMenuHovered(false);

    megaMenuTimeoutRef.current = window.setTimeout(() => {
      setActiveMegaMenuId(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (megaMenuTimeoutRef.current) {
        clearTimeout(megaMenuTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPrimaryMenuOpen && activeMegaMenuId) {
      setActiveMegaMenuId(null);
    }
  }, [isPrimaryMenuOpen, activeMegaMenuId]);

  return (
    <SecondaryNavContainer>
      <SecondaryNavWapper>
        <div>
          <HamburgerWrapper
            onClick={handleMenuToggle}
            aria-label="Toggle main navigation"
            aria-expanded={isPrimaryMenuOpen}
          >
            <FaBars />
          </HamburgerWrapper>
        </div>
        <div>
          <MainNavLinkList
            ref={navListRef}
            onMouseLeave={handleNavItemMouseLeave}
          >
            {dummyMainNavLinks.map((navItem) => (
              <MainNavLinkItem
                key={navItem.id}
                onMouseEnter={() => handleNavItemMouseEnter(navItem.id)}
                onMouseLeave={handleNavItemMouseLeave}
                className={
                  activeMegaMenuId === navItem.id ? "active-parent-link" : ""
                }
                              

              >
                <a href={navItem.path}>{navItem.label}</a>

                {navItem.megaMenu && (
                  <MegaMenuContainer
                    $isVisible={activeMegaMenuId === navItem.id}
                    onMouseEnter={handleMegaMenuMouseEnter}
                    onMouseLeave={handleMegaMenuMouseLeave}
                    aria-hidden={!(activeMegaMenuId === navItem.id)}
                  >
                    {navItem.megaMenu.columns.map((column, colIndex) => (
                      <MegaMenuColumn key={`col-${navItem.id}-${colIndex}`}>
                        {column.title && <h3>{column.title}</h3>}
                        {column.links &&
                          column.links.map((link) => (
                            <a key={link.id} href={link.path}>
                              {link.label}
                            </a>
                          ))}
                        {column.promo && (
                          <PromoBlock>
                            <img
                              src={column.promo.image}
                              alt={column.promo.altText || column.promo.title}
                            />
                            <h4>{column.promo.title}</h4>
                            <p>{column.promo.text}</p>
                            <a href={column.promo.link} className="promo-link">
                              Shop Now
                            </a>
                          </PromoBlock>
                        )}
                      </MegaMenuColumn>
                    ))}
                  </MegaMenuContainer>
                )}
              </MainNavLinkItem>
            ))}
          </MainNavLinkList>
          <PrimaryNav
            isOpen={isPrimaryMenuOpen}
            onClose={handleMenuToggle}
            navLinks={dummyMainNavLinks}
          />
        </div>
      </SecondaryNavWapper>
    </SecondaryNavContainer>
  );
};

export default SecondaryNav;

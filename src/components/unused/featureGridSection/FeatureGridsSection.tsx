// src/components/HomePage/FeatureGridsSection/FeatureGridsSection.tsx
import React, { useMemo } from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom'; // For navigation
import { FaArrowRight } from 'react-icons/fa'; // Example for CTA link

// Import all styled components
import {
  FeatureGridsWrapper,
  SectionHeadline,
  GridRow, // Base, might not be used directly if specific rows are always used
  RowTwoImages,
  RowFourImages,
  RowAsymmetrical,
  GridItem,
  GridItemImage,
  GridItemOverlay,
  GridItemContent,
} from './FeatureGridsSection.styles';

// --- Data Structure Definitions ---
interface GridItemData {
  id: string;
  imageUrl: string;
  altText: string;
  title?: string; // Optional: For items in Row 2 & 3 where title is in overlay
  description?: string; // Optional
  link: string;
  ctaText?: string; // e.g., "Shop Collection", "View Details"
  aspectRatio?: string; // e.g., '1/1', '3/4', '16/9' - for specific items
  contentAlwaysVisible?: boolean; // For Row 1 items
}

interface FeatureRowData {
  type: 'two-images' | 'four-images' | 'asymmetrical-50-25-25';
  items: GridItemData[];
}

interface FeatureGridsSectionData {
  headline: string;
  rows: FeatureRowData[];
}
// --- End Data Structures ---

// --- MOCK DATA (Rich and Detailed) ---
const getPicsumImage = (seed: string, width: number, height: number, tags: string = '') =>
  `https://picsum.photos/seed/${seed.replace(/\s+/g, '-')}/${width}/${height}/?${tags},elan,home,lifestyle,decor,${Math.random()}`;

const mockFeatureData: FeatureGridsSectionData = {
  headline: "Élan Inspirations: Curated For You",
  rows: [
    // ROW 1: Two Images with Description
    {
      type: 'two-images',
      items: [
        {
          id: 'feature_r1_1',
          imageUrl: getPicsumImage('serene-bedroom-large', 900, 600, 'bedroom,calm'),
          altText: 'A beautifully styled serene bedroom with natural light',
          title: 'The Art of Restful Living',
          description: 'Discover our collection of luxurious bedding, calming aromatherapy, and soft lighting to transform your bedroom into a true sanctuary.',
          link: '/collections/bedroom-sanctuary',
          ctaText: 'Explore Bedroom Serenity',
          aspectRatio: '3/2', // Landscape for this item
          contentAlwaysVisible: true,
        },
        {
          id: 'feature_r1_2',
          imageUrl: getPicsumImage('artisan-kitchen-detail', 700, 900, 'kitchen,artisan,ceramics'),
          altText: 'Close-up of artisanal ceramic dinnerware on a rustic wooden table',
          title: 'Handcrafted Kitchen Essentials',
          description: 'Elevate your culinary experiences with unique, handcrafted dinnerware, serveware, and kitchen tools that blend beauty with function.',
          link: '/collections/artisan-kitchen',
          ctaText: 'Shop Artisan Kitchen',
          aspectRatio: '3/4', // Portrait
          contentAlwaysVisible: true,
        },
      ],
    },
    // ROW 2: Four Images (more image-focused, text on hover overlay)
    {
      type: 'four-images',
      items: [
        { id: 'feature_r2_1', imageUrl: getPicsumImage('modern-living-accent', 600, 600, 'living,accent,sculpture'), altText: 'Modern sculptural accent piece', title: 'Sculptural Accents', link: '/products/modern-sculpture', aspectRatio: '1/1', ctaText: 'View Item'},
        { id: 'feature_r2_2', imageUrl: getPicsumImage('cozy-reading-nook', 600, 600, 'reading,cozy,chair'), altText: 'Cozy reading nook with a plush armchair', title: 'Comfort Reading', link: '/products/plush-armchair', aspectRatio: '1/1', ctaText: 'View Item' },
        { id: 'feature_r2_3', imageUrl: getPicsumImage('minimalist-lighting', 600, 600, 'lighting,minimalist,lamp'), altText: 'Sleek minimalist pendant light', title: 'Ambient Glow', link: '/products/minimal-pendant', aspectRatio: '1/1', ctaText: 'View Item' },
        { id: 'feature_r2_4', imageUrl: getPicsumImage('outdoor-lounge-set', 600, 600, 'outdoor,lounge,patio'), altText: 'Stylish outdoor lounge seating', title: 'Alfresco Living', link: '/collections/outdoor-living', aspectRatio: '1/1', ctaText: 'Shop Outdoor' },
      ],
    },
    // ROW 3: Asymmetrical (50%, 25%, 25%)
    {
      type: 'asymmetrical-50-25-25',
      items: [
        { // 50% width item
          id: 'feature_r3_1_large',
          imageUrl: getPicsumImage('grand-dining-scene', 1200, 700, 'dining,elegant,hosting'),
          altText: 'An elegantly set dining table ready for a gathering',
          title: 'The Entertainer’s Dream',
          description: 'Host memorable gatherings with our exquisite dining collections, designed for effortless elegance and joyful celebrations.',
          link: '/collections/entertaining-dining',
          ctaText: 'Discover Dining',
          aspectRatio: '16/9', // More landscape for the large item
          // contentAlwaysVisible: false, // Let overlay handle text or make some part visible
        },
        { // 25% width item
          id: 'feature_r3_2_small',
          imageUrl: getPicsumImage('textile-detail-macro', 600, 750, 'textile,fabric,detail'),
          altText: 'Close-up detail of a luxurious textured textile',
          title: 'Rich Textures',
          link: '/collections/textiles',
          aspectRatio: '4/5',
          ctaText: 'Explore Textiles',
        },
        { // 25% width item
          id: 'feature_r3_3_small',
          imageUrl: getPicsumImage('small-decor-object', 600, 750, 'decor,objet,ceramic'),
          altText: 'A small, unique decorative ceramic object',
          title: 'Objet d\'Art',
          link: '/products/ceramic-objet',
          aspectRatio: '4/5',
          ctaText: 'View Detail',
        },
      ],
    },
  ],
};
// --- End Mock Data ---


interface FeatureGridsSectionProps {
  data?: FeatureGridsSectionData; // Allow passing data, or use mock
  // Add other props as needed, e.g., callbacks for clicks if GridItem is not a direct link
}

const FeatureGridsSection: React.FC<FeatureGridsSectionProps> = ({
  data = mockFeatureData,
}) => {
  const theme = useTheme() as DefaultTheme;

  const renderGridItem = (item: GridItemData, index: number, isOverlayPrimary: boolean = true) => {
    // For Row 1, content is always visible. For others, it's in overlay.
    // The $alwaysVisible prop on GridItemContent is for text that's NOT in an overlay.
    const contentIsAlwaysVisible = item.contentAlwaysVisible === true;

    return (
      <GridItem
        theme={theme}
        key={item.id}
        href={item.link} // Assuming GridItem is an 'a' tag
        as={RouterLink} // Use react-router-dom Link
        to={item.link}
        $animationDelay={`${0.1 + index * 0.1}s`} // Stagger animation for each item
        $aspectRatio={item.aspectRatio} // Pass aspect ratio
        aria-label={`View ${item.title || item.altText}`}
      >
        <GridItemImage className="grid-item-image" src={item.imageUrl} alt={item.altText} loading="lazy" />
        
        {/* Overlay - content shown here if not $alwaysVisible */}
        {(!contentIsAlwaysVisible && (item.title || item.description || item.ctaText)) && (
          <GridItemOverlay theme={theme} className="grid-item-overlay">
            <GridItemContent theme={theme}>
              {item.title && <h3>{item.title}</h3>}
              {item.description && <p>{item.description}</p>}
              {item.ctaText && (
                <span className="cta-link"> {/* Changed from 'a' to 'span' as parent is link */}
                  {item.ctaText} <FaArrowRight className="cta-icon"/>
                </span>
              )}
            </GridItemContent>
          </GridItemOverlay>
        )}

        {/* Always Visible Content - For Row 1 primarily */}
        {(contentIsAlwaysVisible && (item.title || item.description || item.ctaText)) && (
          <GridItemContent theme={theme} $alwaysVisible={true}>
            {item.title && <h3>{item.title}</h3>}
            {item.description && <p>{item.description}</p>}
            {item.ctaText && (
              <span className="cta-link">
                {item.ctaText} <FaArrowRight className="cta-icon"/>
              </span>
            )}
          </GridItemContent>
        )}
      </GridItem>
    );
  };

  return (
    <FeatureGridsWrapper theme={theme}>
      <SectionHeadline theme={theme}>{data.headline}</SectionHeadline>
      {data.rows.map((row, rowIndex) => {
        let RowComponent = GridRow; // Default
        if (row.type === 'two-images') RowComponent = RowTwoImages;
        else if (row.type === 'four-images') RowComponent = RowFourImages;
        else if (row.type === 'asymmetrical-50-25-25') RowComponent = RowAsymmetrical;

        return (
          <RowComponent theme={theme} key={`row-${rowIndex}`}>
            {row.items.map((item, itemIndex) => 
                renderGridItem(item, itemIndex, !item.contentAlwaysVisible)
            )}
          </RowComponent>
        );
      })}
    </FeatureGridsWrapper>
  );
};

export default FeatureGridsSection;
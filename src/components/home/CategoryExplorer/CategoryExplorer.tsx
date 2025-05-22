// src/components/CategoryExplorer/CategoryExplorer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CategoryExplorerSection,
  ExplorerHeadline,
  MainContentArea,
  ScrollableContent,
  ThinSeparator,
} from './CategoryExplorer.styles';
import CategoryNavigator from '../CategoryNavigator/CategoryNavigator';
import CategorySection from '../CategorySection/CategorySection';
import { type ProductData } from '../ProductCard/ProductCard';
// Dummy Category Data (as in previous commit - ensures data consistency)
interface CategoryContent {
  id: string;
  name: string;
  link: string;
  products: ProductData[];
}

const getProductImage = (seed: string, width: number, height: number, tags: string = '') =>
  `https://picsum.photos/seed/${seed.replace(/\s/g, '-')}/${width}/${height}/?${tags}`;

const dummyCategoriesData: CategoryContent[] = [
    {
        id: 'living',
        name: 'Living Room Collection',
        link: '#shop-living',
        products: [
            { id: 'lv1', name: 'Cloud Comfort Sofa', price: 1800, image: getProductImage('lv1-sofa', 400, 560, 'modern-sofa'), link: '#p_lv1', isNew: true },
            { id: 'lv2', name: 'Marble Side Table', price: 350, image: getProductImage('lv2-table', 400, 560, 'marble-table'), link: '#p_lv2' },
            { id: 'lv3', name: 'Abstract Area Rug', price: 290, image: getProductImage('lv3-rug', 400, 560, 'modern-rug'), link: '#p_lv3', isBestseller: true },
            { id: 'lv4', name: 'Sculptural Bookshelf', price: 420, image: getProductImage('lv4-bookshelf', 400, 560, 'bookshelf'), link: '#p_lv4' }, // Add more products if you want more sections of 3 for demo, but typically slice(0,3) in CategorySection for compactness)
            { id: 'lv5', name: 'Soft Wool Blanket', price: 95, image: getProductImage('lv5-blanket', 400, 560, 'blanket'), link: '#p_lv5', isNew: true },
            { id: 'lv6', name: 'Modern Floor Lamp', price: 190, image: getProductImage('lv6-lamp', 400, 560, 'floor-lamp'), link: '#p_lv6' },
        ],
    },
    {
        id: 'dining',
        name: 'Dining & Entertaining',
        link: '#shop-dining',
        products: [
            { id: 'd1', name: 'Solid Oak Dining Table', price: 1200, image: getProductImage('d1-table', 400, 560, 'oak-dining-table'), link: '#p_d1' },
            { id: 'd2', name: 'Velvet Dining Chair (Set of 2)', price: 350, image: getProductImage('d2-chair', 400, 560, 'velvet-chair'), link: '#p_d2' },
            { id: 'd3', name: 'Ceramic Dinnerware Set', price: 180, image: getProductImage('d3-dinnerware', 400, 560, 'ceramic-dishes'), link: '#p_d3', isNew: true },
            { id: 'd4', name: 'Elegant Glass Tumblers', price: 50, image: getProductImage('d4-tumbler', 400, 560, 'glass-tumbler'), link: '#p_d4' },
            { id: 'd5', name: 'Linen Tablecloth & Napkin Set', price: 80, image: getProductImage('d5-linen', 400, 560, 'linen-tablecloth'), link: '#p_d5' },
            { id: 'd6', name: 'Sculptural Candelabra', price: 90, image: getProductImage('d6-candelabra', 400, 560, 'candelabra'), link: '#p_d6', isBestseller: true },
        ],
    },
    {
        id: 'bedroom',
        name: 'Bedroom Serenity',
        link: '#shop-bedroom',
        products: [
            { id: 'b1', name: 'Organic Cotton Percale Bedding', price: 280, image: getProductImage('b1-bedding', 400, 560, 'organic-bedding'), link: '#p_b1', isNew: true },
            { id: 'b2', name: 'Orthopedic Memory Foam Mattress', price: 900, image: getProductImage('b2-mattress', 400, 560, 'memory-foam-mattress'), link: '#p_b2' },
            { id: 'b3', name: 'Floating Minimalist Nightstand', price: 180, image: getProductImage('b3-nightstand', 400, 560, 'floating-nightstand'), link: '#p_b3' },
            { id: 'b4', name: 'Plush Faux Fur Throw', price: 120, image: getProductImage('b4-throw', 400, 560, 'faux-fur-throw'), link: '#p_b4' },
            { id: 'b5', name: 'Aromatic Essential Oil Diffuser', price: 75, image: getProductImage('b5-diffuser', 400, 560, 'essential-oil-diffuser'), link: '#p_b5' },
            { id: 'b6', name: 'Blackout Linen Curtains', price: 150, image: getProductImage('b6-curtains', 400, 560, 'blackout-curtains'), link: '#p_b6', isBestseller: true },
        ],
    },
    {
        id: 'lighting',
        name: 'Ambient Lighting',
        link: '#shop-lighting',
        products: [
            { id: 'l1', name: 'Modern Arch Floor Lamp', price: 220, image: getProductImage('l1-lamp', 400, 560, 'modern-arch-lamp'), link: '#p_l1', isNew: true },
            { id: 'l2', name: 'Textured Ceramic Table Lamp', price: 90, image: getProductImage('l2-tablelamp', 400, 560, 'ceramic-table-lamp'), link: '#p_l2' },
            { id: 'l3', name: 'Dimmable Smart LED Bulbs (Set of 2)', price: 40, image: getProductImage('l3-bulbs', 400, 560, 'smart-led-bulbs'), link: '#p_l3', isBestseller: true },
            { id: 'l4', name: 'Sleek Pendant Light', price: 150, image: getProductImage('l4-pendant', 400, 560, 'pendant-light'), link: '#p_l4' },
            { id: 'l5', name: 'Portable Ambient Lantern', price: 60, image: getProductImage('l5-lantern', 400, 560, 'ambient-lantern'), link: '#p_l5' },
            { id: 'l6', name: 'Vintage Edison Style Bulb', price: 25, image: getProductImage('l6-edison', 400, 560, 'edison-bulb'), link: '#p_l6', isNew: true },
        ],
    },
    {
        id: 'art',
        name: 'Art & Decor Collection',
        link: '#shop-art',
        products: [
            { id: 'a1', name: 'Hand-Painted Abstract Canvas', price: 150, image: getProductImage('a1-canvas', 400, 560, 'abstract-canvas'), link: '#p_a1', isNew: true },
            { id: 'a2', name: 'Ceramic Sculptural Vase', price: 280, image: getProductImage('a2-vase', 400, 560, 'sculptural-vase'), link: '#p_a2' },
            { id: 'a3', name: 'Minimalist Iron Candle Holder', price: 55, image: getProductImage('a3-candle', 400, 560, 'iron-candle-holder'), link: '#p_a3' },
            { id: 'a4', name: 'Framed Botanical Print', price: 70, image: getProductImage('a4-print', 400, 560, 'botanical-print'), link: '#p_a4', isBestseller: true },
            { id: 'a5', name: 'Artisan Crafted Ceramic Bowl', price: 45, image: getProductImage('a5-bowl', 400, 560, 'ceramic-bowl'), link: '#p_a5' },
            { id: 'a6', name: 'Geo Metallic Wall Art', price: 110, image: getProductImage('a6-wallart', 400, 560, 'metallic-wall-art'), link: '#p_a6' },
        ],
    },
    {
        id: 'office',
        name: 'Home Office Essentials',
        link: '#shop-office',
        products: [
            { id: 'o1', name: 'Ergonomic Mesh Task Chair', price: 320, image: getProductImage('o1-chair', 400, 560, 'ergonomic-chair'), link: '#p_o1', isBestseller: true },
            { id: 'o2', name: 'Solid Walnut Writing Desk', price: 550, image: getProductImage('o2-desk', 400, 560, 'walnut-desk'), link: '#p_o2' },
            { id: 'o3', name: 'Minimalist Desk Organizer Set', price: 70, image: getProductImage('o3-organizer', 400, 560, 'desk-organizer'), link: '#p_o3', isNew: true },
            { id: 'o4', name: 'Magnetic Desk Lamp', price: 95, image: getProductImage('o4-lamp', 400, 560, 'magnetic-lamp'), link: '#p_o4' },
            { id: 'o5', name: 'Cork & Leather Mousepad', price: 30, image: getProductImage('o5-mousepad', 400, 560, 'leather-mousepad'), link: '#p_o5' },
            { id: 'o6', name: 'Smart Storage Credenza', price: 400, image: getProductImage('o6-credenza', 400, 560, 'storage-credenza'), link: '#p_o6' },
        ],
    },
    {
        id: 'outdoor',
        name: 'Outdoor Living Redefined',
        link: '#shop-outdoor',
        products: [
            { id: 'ot1', name: 'Modular All-Weather Patio Sofa', price: 900, image: getProductImage('ot1-sofa', 400, 560, 'patio-sofa'), link: '#p_ot1' },
            { id: 'ot2', name: 'Concrete Outdoor Coffee Table', price: 280, image: getProductImage('ot2-table', 400, 560, 'concrete-table'), link: '#p_ot2', isBestseller: true },
            { id: 'ot3', name: 'Terracotta Planter Collection (Set of 3)', price: 80, image: getProductImage('ot3-planters', 400, 560, 'terracotta-planters'), link: '#p_ot3', isNew: true },
            { id: 'ot4', name: 'Waterproof Outdoor Rug', price: 130, image: getProductImage('ot4-rug', 400, 560, 'outdoor-rug'), link: '#p_ot4' },
            { id: 'ot5', name: 'Solar Powered Pathway Lights (4-pack)', price: 65, image: getProductImage('ot5-lights', 400, 560, 'solar-lights'), link: '#p_ot5' },
            { id: 'ot6', name: 'Folding Bistro Set (2 chairs + table)', price: 350, image: getProductImage('ot6-bistro', 400, 560, 'bistro-set'), link: '#p_ot6' },
        ],
    },
    {
        id: 'wellness',
        name: 'Wellness & Comfort',
        link: '#shop-wellness',
        products: [
            { id: 'w1', name: 'Aromatherapy Diffuser Pro', price: 75, image: getProductImage('w1-diffuser', 400, 560, 'diffuser'), link: '#p_w1', isNew: true },
            { id: 'w2', name: 'Organic Spa Bath Towel Set', price: 90, image: getProductImage('w2-towel', 400, 560, 'spa-towel'), link: '#p_w2' },
            { id: 'w3', name: 'Pure Silk Sleep Mask', price: 35, image: getProductImage('w3-mask', 400, 560, 'silk-mask'), link: '#p_w3', isBestseller: true },
            { id: 'w4', name: 'Weighted Anti-Anxiety Blanket', price: 140, image: getProductImage('w4-weighted', 400, 560, 'weighted-blanket'), link: '#p_w4' },
            { id: 'w5', name: 'Ergonomic Bath Pillow', price: 40, image: getProductImage('w5-pillow', 400, 560, 'bath-pillow'), link: '#p_w5' },
            { id: 'w6', name: 'Natural Loofah Body Brush', price: 20, image: getProductImage('w6-brush', 400, 560, 'loofah-brush'), link: '#p_w6', isNew: true },
        ],
    },
];

const CategoryExplorer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(dummyCategoriesData[0].id);
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const observerOptions = {
      root: null,
      // rootMargin should define the "active" zone for the section.
      // -30% from top means 30% of viewport height is ignored from top
      // -40% from bottom means 40% of viewport height is ignored from bottom
      // So, the middle 30% of the viewport (100-30-40 = 30) is the "active zone".
      rootMargin: '-30% 0px -40% 0px', // Tune these values for desired active zone
      threshold: 0,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Check if this section is the primary one in the "hot zone"
          // We assume the first intersecting entry is the "most" intersecting/central one
          // This ensures that as you scroll, only one category remains active.
          // For more precise activation (e.g., center of section vs. center of viewport):
          // You might check entry.boundingClientRect.top relative to viewport height.
          setActiveCategory(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    dummyCategoriesData.forEach(category => {
      const ref = sectionRefs.current[category.id];
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => {
      dummyCategoriesData.forEach(category => {
        const ref = sectionRefs.current[category.id];
        if (ref) {
          observer.unobserve(ref);
        }
      });
      observer.disconnect(); // Ensure observer is fully cleaned up
    };
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    // Manually set active category and scroll to it
    setActiveCategory(categoryId);
    const sectionElement = sectionRefs.current[categoryId];
    if (sectionElement) {
      const headerOffset = 120; // Adjust for your sticky header height (PreHeader + GrandMarquee + SpotlightBanner)
      // Use window.scrollY (pageYOffset) for current scroll position
      const elementPosition = sectionElement.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <CategoryExplorerSection>
      <ExplorerHeadline>Explore Collections by Category</ExplorerHeadline>
      <MainContentArea>
        <CategoryNavigator
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
        />
        <ThinSeparator />
        <ScrollableContent>
          {dummyCategoriesData.map((category, index) => (
            <CategorySection
              key={category.id}
              id={category.id}
              title={category.name}
              link={category.link}
              products={category.products}
              isIntersecting={activeCategory === category.id} // This links animation to active category state
              animationDelay={index * 100} // Stagger initial section animations for beautiful reveal
              ref={el => sectionRefs.current[category.id] = el}
            />
          ))}
        </ScrollableContent>
      </MainContentArea>
    </CategoryExplorerSection>
  );
};

export default CategoryExplorer;
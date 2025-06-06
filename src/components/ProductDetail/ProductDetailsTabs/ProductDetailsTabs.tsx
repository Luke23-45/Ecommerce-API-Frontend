// src/components/ProductPage/ProductDetailsTabs/ProductDetailsTabs.tsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa'; // For a generic info icon

import {
  TabsWrapper,
  TabList,
  TabButton,
  TabPanel,
} from './ProductDetailsTabs.styles';

// --- IMPORT ACTUAL PANEL COMPONENTS ---
import DescriptionPanel from './DescriptionPanel';
import SpecificationsPanel, { type SpecificationsData } from './SpecificationsPanel';
// import ReviewsPanel, { 
//     type Review, 
//     type RatingDistribution,
//     type ProductReviewSummaryData,
// } from '../ReviewsPanel/ReviewsPane';
import ReviewsPanel from '../ReviewsPanel/ReviewsPanel';
import type { Review } from '../ReviewsPanel/ReviewsPanel';
import { transparentize } from 'polished';

// Assuming NewReviewData is defined something like this, or import from WriteReviewForm:
export interface NewReviewData { rating: number; title?: string; comment: string; }


// --- Type for the main product data this component expects ---
export interface ProductDetailsTabData {
  id: string;
  name: string;
  // For DescriptionPanel
  descriptionMarkdown?: string; // Preferred for rich text
  fullDescriptionHTML?: string; // Fallback
  // For SpecificationsPanel
  specifications?: SpecificationsData;
  // For ReviewsPanel
  reviewSummary?: any;
  initialReviews?: Review[]; // Initial batch of reviews
  totalReviewCountFromBackend?: number; // Total available for pagination
  // For Shipping & Returns Panel (Example)
  shippingPolicy?: string; // Could be Markdown or HTML
  // Other data for potential future tabs
  // careInstructionsMarkdown?: string;
  // sizeGuideId?: string;
}

// --- Define the structure for each tab ---
interface TabDefinition {
  key: string;
  title: (product: ProductDetailsTabData) => string;
  content: (product: ProductDetailsTabData) => React.ReactNode;
  isHidden?: (product: ProductDetailsTabData) => boolean;
}

// --- Rich Mock Data for a Single Product (to be passed as `product` prop) ---
const mockProductForTabs: ProductDetailsTabData = {
  id: "prod_elan_001",
  name: "Élan Signature Cashmere Throw",
  descriptionMarkdown: `
## Indulge in Unparalleled Softness

Experience the epitome of luxury and comfort with our Élan Signature Cashmere Throw. Meticulously crafted from the finest 100% Mongolian cashmere, this throw is designed to envelop you in an embrace of unparalleled softness and warmth. Its generous size makes it perfect for draping over your favorite armchair, adding an elegant layer to your bed, or snuggling up with on a cool evening.

### Key Highlights:
*   **Pure Mongolian Cashmere:** Sourced responsibly for exceptional fineness and a cloud-like feel.
*   **Artisanal Craftsmanship:** Each throw features a delicate, hand-finished fringed edge, showcasing the skill of our artisans.
*   **Timeless Design:** A classic weave and a palette of serene, nature-inspired hues ensure it complements any interior style, from modern minimalist to classic contemporary.
*   **Lightweight Warmth:** Cashmere provides exceptional warmth without bulk, making it ideal for year-round comfort.

### The Élan Difference
At Élan Homewares, we believe that true luxury lies in the details – the quality of materials, the integrity of craftsmanship, and the thoughtful design that enhances everyday living. This cashmere throw is more than an accessory; it's an heirloom piece designed to be cherished for years to come.

> "This is, without a doubt, the most beautiful and soft throw I have ever owned. It's a true indulgence." - A Happy Customer

Choose Élan, and bring a touch of curated elegance into your home.
  `,
  specifications: {
    Material: "100% Grade-A Mongolian Cashmere",
    Dimensions: "140cm x 190cm (55in x 75in)",
    Weight: "Approximately 450g",
    Origin: "Mongolia (Cashmere), Crafted in Scotland",
    CareInstructions: "Dry clean only recommended. Store folded in a cool, dry place. Avoid direct sunlight.",
    AvailableColors: ["Heather Grey", "Oatmeal Beige", "Dusty Rose", "Charcoal"],
    Features: ["Hand-finished Fringed Edges", "Hypoallergenic", "Naturally Breathable"],
  },
  reviewSummary: {
    averageRating: 4.8,
    totalReviews: 42,
    distribution: { _5star: 80, _4star: 15, _3star: 3, _2star: 1, _1star: 1 },
  },
  initialReviews: [
    { id: 'tr1', authorName: 'Isabelle R.', rating: 5, title: "Absolute Heaven!", comment: "This cashmere throw is the definition of luxury. So soft, so warm, and the color (Heather Grey) is perfect. Worth every penny!", date: new Date("2024-04-15T00:00:00.000Z"), isVerifiedPurchase: true, helpfulVotes: 18 },
    { id: 'tr2', authorName: 'James P.', rating: 4.5, title: "Wonderful Gift", comment: "Bought this as a gift for my wife, and she adores it. The quality is outstanding. Slightly lighter than I imagined from photos, but still very warm.", date: new Date("2024-03-20T00:00:00.000Z"), isVerifiedPurchase: true, helpfulVotes: 11 },
  ],
  totalReviewCountFromBackend: 42, // Matches summary
  shippingPolicy: "Enjoy complimentary express shipping on all Signature Collection items. Items are typically dispatched within 1-2 business days. Returns are accepted within 30 days of receipt, provided the item is in its original, unused condition. Please refer to our full shipping and returns policy for detailed information."
};
// --- End Mock Data ---


// --- Main Tabs Component ---
interface ProductDetailsTabsProps {
  product: ProductDetailsTabData;
  // These would be passed from ProductDetailPage for actual API interactions
  onWriteReview?: (productId: string, reviewData: NewReviewData) => Promise<boolean | Review>;
  onLoadMoreReviews?: (productId: string, nextPage: number, reviewsPerPage: number) => Promise<Review[] | null>;
  currentUserCanReview?: boolean; // Example: assume user can review
}

const ProductDetailsTabs: React.FC<ProductDetailsTabsProps> = ({
  product = mockProductForTabs, // Fallback to mock if product prop is undefined during dev
  onWriteReview,
  onLoadMoreReviews,
  currentUserCanReview = true, // For demo purposes
}) => {
  const theme = useTheme() as DefaultTheme;
  
  const tabs: TabDefinition[] = [
    {
      key: 'description',
      title: () => 'Product Story & Details',
      content: (p) => <DescriptionPanel 
                          productName={p.name} 
                          descriptionMarkdown={p.descriptionMarkdown}
                          descriptionHtml={p.fullDescriptionHTML}
                       />
    },
    {
      key: 'specifications',
      title: () => 'Specifications & Care',
      content: (p) => <SpecificationsPanel 
                          productName={p.name}
                          specifications={p.specifications} 
                       />,
      isHidden: (p) => !p.specifications || Object.keys(p.specifications).length === 0,
    },
    {
      key: 'reviews',
      title: (p) => `Customer Reviews (${p.reviewSummary?.totalReviews || 0})`,
      content: (p) => <ReviewsPanel 
                          productId={p.id} 
                          productName={p.name}
                          reviewSummaryDataProp={p.reviewSummary} // Use Prop suffix for clarity
                          initialReviewsProp={p.initialReviews}
                          totalReviewCountFromBackend={p.totalReviewCountFromBackend}
                          currentUserCanReview={currentUserCanReview} // Pass down
                          onWriteReviewSubmit={onWriteReview ? (data) => onWriteReview(p.id, data) : undefined}
                          onLoadMoreReviews={onLoadMoreReviews ? (page, rpp) => onLoadMoreReviews(p.id, page, rpp) : undefined}
                       />,
      isHidden: (p) => (!p.reviewSummary || p.reviewSummary.totalReviews === 0) && (!p.initialReviews || p.initialReviews.length === 0) && !currentUserCanReview, // Hide if no reviews AND user cannot add one
    },
    {
      key: 'shipping',
      title: () => 'Shipping & Returns',
      content: (p) => (
        <div style={{
          fontFamily: theme.typography.body.fontFamily,
          fontSize: theme.typography.body.sizes.medium,
          lineHeight: 1.5,
          color: theme.colors.textDark,
        }}>
            {p.shippingPolicy ? (
                // If shippingPolicy is Markdown, use ReactMarkdown here too
                <p>{p.shippingPolicy}</p> 
            ) : (
                <>
                    <h4 style={{fontFamily: theme.typography.heading.fontFamily, fontSize: theme.typography.heading.sizes.h5, fontWeight: theme.typography.heading.weights.semiBold, color: theme.colors.textDark, marginTop: theme.spacing(1), marginBottom: theme.spacing(2)}}>Standard Shipping</h4>
                    <p>Élan Homewares offers complimentary standard shipping on all orders over $100 within the contiguous United States. For orders under $100, a flat rate of $7.95 applies. Please allow 3-7 business days for delivery after your order has been processed.</p>
                    <h4 style={{fontFamily: theme.typography.heading.fontFamily, fontSize: theme.typography.heading.sizes.h5, fontWeight: theme.typography.heading.weights.semiBold, color: theme.colors.textDark, marginTop: theme.spacing(5), marginBottom: theme.spacing(2)}}>Returns & Exchanges</h4>
                    <p>We want you to love your Élan pieces. If you're not completely satisfied, you may return most new, unopened items within 30 days of delivery for a full refund. Some exclusions apply. Please visit our <a href="/returns-policy" style={{color: theme.colors.accent1, fontWeight: theme.typography.body.weights.medium, textDecoration:'none', borderBottom: `1px dashed ${transparentize(0.5,theme.colors.accent1)}`}}>full returns policy page</a> for details.</p>
                </>
            )}
        </div>
      ),
      // isHidden: (p) => !p.shippingPolicy, // Always show generic policy if specific one is missing
    },
  ];
  
  const visibleTabs = useMemo(() => tabs.filter(tab => !(tab.isHidden?.(product))), [tabs, product]);
  const [activeTabKey, setActiveTabKey] = useState<string>(() => {
      // Initialize with the first *visible* tab's key
      return visibleTabs[0]?.key || (tabs[0]?.key || '');
  });

  useEffect(() => {
    // Ensure activeTabKey is always valid among visibleTabs
    const firstVisibleTabKey = visibleTabs[0]?.key;
    if (visibleTabs.length > 0 && !visibleTabs.find(tab => tab.key === activeTabKey)) {
        setActiveTabKey(firstVisibleTabKey);
    } else if (visibleTabs.length === 0 && activeTabKey !== '') {
        setActiveTabKey('');
    }
  }, [activeTabKey, visibleTabs]);


  const handleTabClick = useCallback((tabKey: string) => {
    setActiveTabKey(tabKey);
  }, []);

  if (!product || Object.keys(product).length === 0) { 
    return <div style={{padding: theme.spacing(5), textAlign:'center', color: theme.colors.darkGray}}>Product details are currently unavailable.</div>; 
  }
  if (visibleTabs.length === 0) {
    return <div style={{padding: theme.spacing(5), textAlign:'center', color: theme.colors.darkGray}}>No information sections to display for this product.</div>; 
  }

  return (
    <TabsWrapper theme={theme}>
      <TabList theme={theme} role="tablist" aria-label={`More information about ${product.name}`}>
        {visibleTabs.map(tab => (
          <TabButton
            theme={theme}
            key={tab.key}
            $isActive={activeTabKey === tab.key}
            onClick={() => handleTabClick(tab.key)}
            role="tab"
            aria-selected={activeTabKey === tab.key}
            aria-controls={`tabpanel-${product.id}-${tab.key}`}
            id={`tab-${product.id}-${tab.key}`}
          >
            {tab.title(product)} {/* Call function to get title */}
          </TabButton>
        ))}
      </TabList>

      {visibleTabs.map(tab => (
        // Render only the active tab's panel for better performance and to ensure animations trigger correctly on switch
        activeTabKey === tab.key && (
          <TabPanel
            theme={theme}
            key={`panel-${product.id}-${tab.key}`} // Ensure key is unique and stable
            $isActive={true} // This will always be true for the rendered panel
            role="tabpanel"
            aria-labelledby={`tab-${product.id}-${tab.key}`}
            id={`tabpanel-${product.id}-${tab.key}`}
            // `hidden` attribute not strictly needed if only active is rendered, but doesn't hurt
          >
            {tab.content(product)}
          </TabPanel>
        )
      ))}
    </TabsWrapper>
  );
};

export default ProductDetailsTabs;
// src/components/ProductPage/ProductDetailsTabs/DescriptionPanel.tsx
import React from 'react';
import { useTheme, type DefaultTheme } from 'styled-components';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import remarkGfm from 'remark-gfm';       // Import remark-gfm for extended Markdown features

// Import refined styles (assuming they are in a sibling .styles.ts file)
import { DescriptionPanelWrapper } from './DescriptionPanel.styles';
import { transparentize } from 'polished';

// --- Component Props ---
interface DescriptionPanelProps {
  descriptionMarkdown?: string; // Prioritize Markdown for content
  descriptionHtml?: string;     // Fallback if only HTML is available (use with caution)
  productName: string;         // Used in fallback message
}

const DescriptionPanel: React.FC<DescriptionPanelProps> = ({
  descriptionMarkdown,
  descriptionHtml,
  productName,
}) => {
  const theme = useTheme() as DefaultTheme; // Access the theme for potential custom renderers

  // --- Custom Renderers for ReactMarkdown (Optional but Recommended for Theme Consistency) ---
  // This allows you to map Markdown elements to your styled components or apply theme styles
  const markdownComponents: React.ComponentProps<typeof ReactMarkdown>['components'] = {
    // Example: Ensure paragraphs use your theme's body typography for margins, etc.
    // The base font-family, size, line-height from DescriptionPanelWrapper p will apply by default.
    // This is more for overriding specific things or using full styled components.
    // p: ({node, ...props}) => <p style={{ marginBottom: theme.spacing(4) }} {...props} />,

    // Example: Style headings rendered from Markdown
    h1: ({node, ...props}) => <h2 style={{ // Markdown h1 often becomes page sub-title like h2/h3
        fontFamily: theme.typography.heading.fontFamily,
        fontSize: theme.typography.heading.sizes.h3, // Use appropriate heading level from theme
        fontWeight: 500,
        lineHeight: 1.6,

        color: theme.colors.textDark,
        marginTop: theme.spacing(7),
        marginBottom: theme.spacing(3),
    }} {...props} />,
    h2: ({node, ...props}) => <h3 style={{ // Markdown h2 becomes theme h3/h4
        fontFamily: theme.typography.heading.fontFamily,
        fontSize: theme.typography.heading.sizes.h4,
        fontWeight: 500,
        lineHeight: 1.6,
      
        color: theme.colors.textDark,
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(2.5),
    }} {...props} />,
    // Add h3, h4, h5, h6 if needed, mapping them to your theme.typography.heading styles

    // Example: Styling for images rendered from Markdown
    img: ({node, ...props}) => (
      <img 
        className="embedded-description-image" // Use class from DescriptionPanel.styles.ts
        {...props} 
        alt={props.alt || "Product description image"} 
        style={{maxWidth: '100%', height: 'auto'}} // Ensure responsiveness
      />
    ),

    // Example: Styling for links within Markdown
    a: ({node, ...props}) => (
      <a 
        href={props.href} 
        target="_blank" 
        rel="noopener noreferrer"
        // Inline style here, or better, make DescriptionPanelWrapper a > span {...} apply to Markdown links
        // The DescriptionPanelWrapper a { ... } style will apply if direct <a> tag is rendered
        style={{
            color: theme.colors.accent1,
            textDecoration: 'none',
            fontWeight: theme.typography.body.weights.medium,
            borderBottom: `1px dashed ${transparentize(0.5, theme.colors.accent1)}`,
        }}
        {...props} 
      />
    ),
    
    // Add custom renderers for ul, ol, li, blockquote, table, etc., if the default
    // rendering (styled by DescriptionPanelWrapper) is not sufficient.
    // For tables (from remarkGfm), you might want to wrap them for responsiveness
    // or apply specific table styling.
    // table: ({node, ...props}) => <div style={{overflowX: 'auto'}}><table {...props} /></div>,
  };
  // --- End Custom Renderers ---


  const renderContent = () => {
    // Priority 1: Render Markdown if provided
    if (descriptionMarkdown) {
      return (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]} // Enable GitHub Flavored Markdown (tables, etc.)
          components={markdownComponents} // Apply custom renderers for themed elements
          // Example: unwrapImages to prevent <p> around <img>
          // unwrapImages={true} 
        >
          {descriptionMarkdown}
        </ReactMarkdown>
      );
    }

    // Priority 2: Render sanitized HTML if only HTML is provided (use with caution)
    if (descriptionHtml) {
      // WARNING: Only use if descriptionHtml is from a TRUSTED source or has been SANITIZED.
      return <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />;
    }

    // Priority 3: Fallback content
    return (
      <>
        <p>
          Immerse yourself in the story of the <strong>{productName}</strong>. At Élan Homewares, we believe every piece
          is more than just an object; it's a chapter in your home's narrative, a testament to fine craftsmanship
          and enduring style.
        </p>
        <p>
          This particular creation has been thoughtfully designed, drawing inspiration from [<em>placeholder: general Élan brand value like "the harmony of natural elements and minimalist design"</em>].
          Crafted using [<em>placeholder: key material type like "the finest sustainably-sourced hardwoods"</em>],
          it promises not only aesthetic delight but also quality that lasts.
        </p>
        <p>
          Explore its unique characteristics, material provenance, and care instructions below to fully
          appreciate its place within the Élan collection and, ultimately, within your home.
        </p>
      </>
    );
  };

  return (
    // DescriptionPanelWrapper applies base styling to p, h3, h4, ul, ol, etc.
    // The custom renderers for ReactMarkdown can further refine or override these.
    <DescriptionPanelWrapper theme={theme}> 
      {renderContent()}
    </DescriptionPanelWrapper>
  );
};

export default DescriptionPanel;
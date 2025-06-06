// src/components/ProductPage/ProductDetailsTabs/DescriptionPanel.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

export const DescriptionPanelWrapper = styled.div<{ theme: DefaultTheme }>`
  /* Base typography (font-family, base color, base line-height) 
     is inherited from TabPanel. These styles refine elements *within* the description. 
  */
  padding: ${(props) => props.theme.spacing(1)} 0; /* Add some vertical padding if needed */

  /* Paragraphs */
  p {
    font-family: ${({ theme }) => theme.typography.body.fontFamily}; /* Ensure Inter */
    font-size: ${({ theme }) => theme.typography.body.sizes.medium};
    line-height: 1.5;
    letter-spacing: 0.2px;
    color: ${({ theme }) => theme.colors.textDark};
    margin-bottom: ${({ theme }) => theme.spacing(4)};
    max-width: 70ch; /* Optimal readability line length */

    &:last-child {
      margin-bottom: 0;
    }
  }

  /* Headings within the description content */
  h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.heading.fontFamily}; /* Playfair Display */
    color: ${({ theme }) => darken(0.05, theme.colors.textDark)}; /* Slightly darker for emphasis */
    margin-top: ${({ theme }) => theme.spacing(6)};
    margin-bottom: ${({ theme }) => theme.spacing(2.5)};
    line-height: 1.3;
  }

  h3 { /* Example: For major feature sections within description */
    font-size: ${({ theme }) => theme.typography.heading.sizes.h5}; /* Using h5 from main theme */
    font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
  }

  h4 { /* Example: For sub-features */
    font-size: ${({ theme }) => theme.typography.body.sizes.large}; /* Using body.large for a softer heading */
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    letter-spacing: 0.01em;
  }

  /* Lists */
  ul, ol {
    margin-bottom: ${({ theme }) => theme.spacing(4)};
    padding-left: ${({ theme }) => theme.spacing(6)}; /* Standard list indent */
    color: ${({ theme }) => theme.colors.textDark}; /* Match paragraph color */

    li {
      margin-bottom: ${({ theme }) => theme.spacing(1.5)};
      line-height: 1.5;
      font-size: ${({ theme }) => theme.typography.body.sizes.medium};
      padding-left: ${({ theme }) => theme.spacing(1)}; /* Space after bullet/number */
      
      &::marker { /* Style list markers if needed */
        color: ${({ theme }) => theme.colors.accent1};
      }
    }
  }
  ul { list-style-type: disc; }
  ol { list-style-type: decimal; }


  /* Blockquotes */
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.accent1}; /* Themed border */
    padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
    margin: ${({ theme }) => theme.spacing(5)} 0;
    background-color: ${({ theme }) => lighten(0.05, theme.colors.primaryNeutral)}; /* Subtle bg */
    border-radius: 0 ${({ theme }) => theme.borderRadius.small} ${({ theme }) => theme.borderRadius.small} 0;
    
    p { /* Paragraphs inside blockquote */
      font-style: italic;
      color: ${({ theme }) => darken(0.1,theme.colors.darkGray)};
      font-size: ${({ theme }) => theme.typography.body.sizes.base}; /* Match pMedium or pBase */
      margin-bottom: ${({ theme }) => theme.spacing(2)};
      &:last-child { margin-bottom: 0; }
    }
  }

  /* Links within description */
  a {
    color: ${({ theme }) => theme.colors.accent1};
    text-decoration: none;
    font-weight: ${({ theme }) => theme.typography.body.weights.medium};
    border-bottom: 1px dashed ${({ theme }) => transparentize(0.5, theme.colors.accent1)};
    transition: color 0.2s ease, border-bottom-color 0.2s ease;

    &:hover {
      color: ${({ theme }) => darken(0.1, theme.colors.accent1)};
      border-bottom-color: ${({ theme }) => darken(0.1, theme.colors.accent1)};
    }
  }

  /* Images embedded within the description */
  img.embedded-description-image {
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    margin: ${({ theme }) => theme.spacing(5)} auto; /* Center block images */
    display: block; /* For centering with auto margins */
    box-shadow: ${({ theme }) => theme.shadows.subtle};
  }

  /* Horizontal Rule */
  hr {
    border: 0;
    height: 1px;
    background-color: ${({theme}) => theme.colors.lightGray};
    margin: ${({theme}) => theme.spacing(6)} 0;
  }

  /* Code blocks or preformatted text */
  pre, code {
    font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
    font-size: ${({theme}) => theme.typography.body.sizes.small};
    background-color: ${({ theme }) => lighten(0.05, theme.colors.primaryNeutral)};
    padding: ${({theme}) => theme.spacing(0.5)} ${({theme}) => theme.spacing(1.5)};
    border-radius: ${({theme}) => theme.borderRadius.small};
    border: 1px solid ${({theme}) => theme.colors.lightGray};
  }
  pre {
    padding: ${({theme}) => theme.spacing(3)};
    overflow-x: auto;
  }
`;
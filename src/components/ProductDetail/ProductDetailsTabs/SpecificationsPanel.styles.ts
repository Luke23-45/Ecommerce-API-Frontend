// src/components/ProductPage/ProductDetailsTabs/SpecificationsPanel.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// Main wrapper for the panel content if needed, though TabPanel often suffices
export const SpecificationsPanelWrapper = styled.div<{ theme: DefaultTheme }>`
  padding-top: ${(props) => props.theme.spacing(1)}; /* Align with other tab panel content */
  /* Base typography inherited from TabPanel */
`;

export const SpecsTable = styled.table<{ theme: DefaultTheme }>`
  width: 100%;
  max-width: 700px; /* Optimal width for a specs table for readability */
  /* margin: 0 auto; // Center the table if it's narrower than content area */
  border-collapse: separate; /* Allows for border-spacing and better border control */
  border-spacing: 0;
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base}; /* Readable base size */
  
  /* Add a subtle border around the whole table */
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden; /* To ensure border-radius clips th/td backgrounds */
  margin-bottom: ${({ theme }) => theme.spacing(4)}; /* Space after table */

  th, td {
    text-align: left;
    padding: ${({ theme }) => theme.spacing(3.5)} ${({ theme }) => theme.spacing(4)};
    vertical-align: top; /* Align content to top, especially for multi-line values */
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  }

  th { /* Specification Label Cell */
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    background-color: ${({ theme }) => lighten(0.05, theme.colors.primaryNeutral)}; /* Subtle bg */
    width: 30%; /* Consistent width for labels, adjust as needed */
    border-right: 1px solid ${({ theme }) => theme.colors.lightGray}; /* Separator */
    white-space: nowrap; /* Prevent labels from wrapping if possible */
  }

  td { /* Specification Value Cell */
    color: ${({ theme }) => darken(0.05, theme.colors.darkGray)}; /* Slightly softer than main text */
    line-height: 1.65; /* Good for readability of potentially longer values */
    word-break: break-word; /* Prevent long values from breaking layout */
    
    ul, ol { /* Styling for lists within a spec value */
      padding-left: ${({ theme }) => theme.spacing(5)};
      margin: ${({ theme }) => theme.spacing(1)} 0 0 0;
      li {
        margin-bottom: ${({ theme }) => theme.spacing(0.5)};
        font-size: inherit; /* Inherit from td */
      }
    }
  }
  
  /* Remove bottom border from last row's cells */
  tr:last-child th,
  tr:last-child td {
    border-bottom: none;
  }

  /* Zebra striping for better readability in long tables (optional) */
   tbody tr:nth-child(odd) {
    background-color: ${({ theme }) => transparentize(0.97, theme.colors.primaryNeutral)};
  } 

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    th, td {
        padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(3)};
    }
    th {
        width: 35%; /* May need more space for labels on mobile */
    }
  }
`;

export const NoSpecsMessage = styled.p<{ theme: DefaultTheme }>`
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.base};
    color: ${({ theme }) => theme.colors.darkGray};
    font-style: italic;
    text-align: center;
    padding: ${({ theme }) => theme.spacing(8)} 0; /* More padding if it's the only content */
`;
// src/components/ProductPage/ProductDetailsTabs/ProductDetailsTabs.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten } from 'polished';

// --- Keyframes ---
const tabContentFadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Tabs Wrapper ---
export const TabsWrapper = styled.div<{ theme: DefaultTheme }>`
  width: 100%;
  margin-top: ${(props) => props.theme.spacing(70)}; /* Space above the tabs section */
  font-family: ${(props) => props.theme.typography.body.fontFamily};
`;

// --- Tab Navigation Bar ---
export const TabList = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  border-bottom: 2px solid ${(props) => props.theme.colors.lightGray}; /* Main underline for the bar */
  margin-bottom: ${(props) => props.theme.spacing(6)}; /* Space between tabs and content */
  overflow-x: auto; /* Allow horizontal scroll on mobile if many tabs */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar { display: none; } /* Chrome, Safari, Opera */

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    margin-bottom: ${(props) => props.theme.spacing(5)};
  }
`;

export const TabButton = styled.button<{ theme: DefaultTheme; $isActive: boolean }>`
  background: none;
  border: none;
  padding: ${(props) => props.theme.spacing(3)} ${(props) => props.theme.spacing(5)}; /* Generous padding */
  font-family: ${(props) => props.theme.typography.body.fontFamily};
  font-size: ${(props) => props.theme.typography.body.sizes.base}; /* Good readable size for tab titles */
  font-weight: ${(props) => props.$isActive ? props.theme.typography.body.weights.semiBold : props.theme.typography.body.weights.medium};
  color: ${(props) => props.$isActive ? props.theme.colors.accent1 : props.theme.colors.darkGray};
  cursor: pointer;
  position: relative; /* For the active indicator underline */
  transition: color 0.25s ease-out, border-bottom-color 0.25s ease-out;
  white-space: nowrap; /* Prevent tab titles from wrapping */
  margin-bottom: -2px; /* To make the active border overlap the TabList border */

  &::after { /* Active indicator underline */
    content: '';
    position: absolute;
    bottom: -2px; /* Position correctly over the TabList border */
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${(props) => props.$isActive ? props.theme.colors.accent1 : 'transparent'};
    transition: background-color 0.25s ease-out;
  }

  &:hover:not(:disabled) {
    color: ${(props) => props.theme.colors.accent1};
  }
  
  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors.accent1};
    outline-offset: -3px; /* Inset outline a bit */
    border-radius: ${(props) => props.theme.borderRadius.small} ${(props) => props.theme.borderRadius.small} 0 0;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
    font-size: ${(props) => props.theme.typography.body.sizes.small};
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(3.5)};
  }
`;

// --- Tab Content Panel ---
export const TabPanel = styled.div<{ theme: DefaultTheme; $isActive: boolean }>`
  display: ${(props) => (props.$isActive ? 'block' : 'none')};
  animation: ${tabContentFadeIn} 0.45s ease-out;
  color: ${(props) => props.theme.colors.textDark};
  line-height:  1.7; /* Readable line height */
  font-size: ${(props) => props.theme.typography.body.sizes.medium || '1rem'};

  /* Styles for content within tabs */
  h3, h4 { /* Subheadings within tab content */
    font-family: ${(props) => props.theme.typography.heading.fontFamily};
    color: ${(props) => props.theme.colors.textDark};
    margin-top: ${(props) => props.theme.spacing(5)};
    margin-bottom: ${(props) => props.theme.spacing(3)};
  }
  h3 { /* Example for slightly larger subheadings */
    font-size: ${(props) => props.theme.typography.heading.sizes.h5};
    font-weight: ${(props) => props.theme.typography.heading.weights.semiBold};
  }
  h4 { /* Example for smaller subheadings */
    font-size: ${(props) => props.theme.typography.body.sizes.large}; /* Use body.large for subtle headings */
    font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
  }

  p {
    margin-bottom: ${(props) => props.theme.spacing(4)};
    &:last-child {
      margin-bottom: 0;
    }
  }

  ul, ol {
    margin-left: ${(props) => props.theme.spacing(5)};
    margin-bottom: ${(props) => props.theme.spacing(4)};
    padding-left: ${(props) => props.theme.spacing(2)}; /* Indent list items */
    li {
      margin-bottom: ${(props) => props.theme.spacing(1.5)};
      line-height: 1.65;
    }
  }

  strong {
    font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
  }

  table { /* Basic styling for spec tables */
    width: 100%;
    border-collapse: collapse;
    margin-bottom: ${(props) => props.theme.spacing(4)};
    font-size: ${(props) => props.theme.typography.body.sizes.small};
    th, td {
      text-align: left;
      padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(3)};
      border-bottom: 1px solid ${(props) => props.theme.colors.lightGray};
    }
    th {
      font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
      color: ${(props) => props.theme.colors.darkGray};
      background-color: ${(props) => lighten(0.045, props.theme.colors.primaryNeutral)};
    }
  }
`;

// --- Styles specific to ReviewsPanel ---
export const ReviewsPanelWrapper = styled.div` /* Additional wrapper if needed */ `;
export const RatingSummaryContainer = styled.div` /* Styles for overall rating breakdown */ `;
export const ReviewList = styled.ul` /* list of individual reviews */ `;
export const ReviewItem = styled.li` /* single review item */ `;
export const WriteReviewFormWrapper = styled.div` /* wrapper for write review form */ `;
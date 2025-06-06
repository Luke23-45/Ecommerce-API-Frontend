// src/pages/ProductDetailPage/ProductDetailPage.styles.ts
import styled, { type DefaultTheme, keyframes } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes ---
const pageEntrance = keyframes`
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const sectionEntrance = keyframes`
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// --- Main Page Wrapper ---
export const ProductDetailPageWrapper = styled.div<{ theme: DefaultTheme }>`
  background-color: ${({ theme }) => theme.colors.primaryNeutral}; 
  padding-bottom: ${({ theme }) => theme.spacing(15)}; /* Generous bottom padding */
  animation: ${pageEntrance} 0.6s cubic-bezier(0.215, 0.610, 0.355, 1.000); /* Smooth easeOutCubic */
  min-height: 100vh; 
`;

// --- Main Content Container (Constrains width) ---
export const ProductDetailContainer = styled.div<{ theme: DefaultTheme }>`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth}; 
  margin: 0 auto;
  padding-top: ${({ theme }) => theme.spacing(4)}; /* Slightly reduced, breadcrumbs has its own space */
`;

// --- Breadcrumbs Area Styling ---
export const BreadcrumbsArea = styled.div<{ theme: DefaultTheme }>`
  padding: 0 ${({ theme }) => theme.containerPadding}; 
  margin-bottom: ${({ theme }) => theme.spacing(6)}; 
  animation: ${sectionEntrance} 0.5s ease-out 0.1s forwards; /* Staggered animation */
  opacity: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-bottom: ${({ theme }) => theme.spacing(5)};
  }
`;

// --- Top Section Grid (Gallery + Info) ---
export const TopSectionGrid = styled.div<{ theme: DefaultTheme }>`
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); /* Gallery ~55%, Info ~45% */
  gap: ${({ theme }) => theme.spacing(12)}; /* Increased gap for more luxurious feel */
  margin-bottom: ${({ theme }) => theme.spacing(12)}; /* Increased space before tabs */
  padding: 0 ${({ theme }) => theme.containerPadding}; 
  animation: ${sectionEntrance} 0.5s ease-out 0.2s forwards;
  opacity: 0;

  @media (max-width: 1200px) { /* Start adjusting layout slightly earlier */
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); /* Gallery slightly less dominant */
    gap: ${({ theme }) => theme.spacing(8)};
  }
  @media (max-width: ${(props) => props.theme.breakpoints.laptop}) { /* Stack point for tablet sizes */
    grid-template-columns: 1fr; 
    gap: ${({ theme }) => theme.spacing(7)};
    margin-bottom: ${({ theme }) => theme.spacing(9)};
  }
`;

export const GalleryColumn = styled.aside<{ theme: DefaultTheme }>`
  position: sticky; 
  top: calc(${(props) => props.theme.spacing(4)} + 88px); /* Example: 88px for GrandMarquee + theme.spacing(4) page top padding */
  /* Max height should be less than viewport minus top offset and some bottom breathing room */
  max-height: calc(100vh - (88px + ${(props) => props.theme.spacing(13)})); 
  align-self: flex-start; 
  min-width: 0;
  
  /* Scrollbar styling if ProductGallery itself overflows its max-height */
  /* Typically ProductGallery might handle internal image scroll/fitting better */
  /* overflow-y: auto;
    &::-webkit-scrollbar { width: 5px; }
    &::-webkit-scrollbar-thumb { background: ${props => props.theme.colors.lightGray}; border-radius: 3px; }
    &::-webkit-scrollbar-track { background: transparent; } */

  @media (max-width: ${(props) => props.theme.breakpoints.laptop}) { /* Unstick earlier than tablet if desired */
    position: relative; 
    top: auto;
    max-height: none;
    /* overflow-y: visible; // Let content flow */
  }
`;

export const InfoColumn = styled.article<{ theme: DefaultTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing(3)}; /* Refined gap between info elements */
  min-width: 0;
`;


// --- Bottom Section (Full Width relative to ProductDetailContainer: Tabs, Related Products etc.) ---
export const BottomSection = styled.div<{ theme: DefaultTheme }>`
  margin-top: ${({ theme }) => theme.spacing(6)}; /* Space above tabs/related products after TopSectionGrid */
  padding: 0 ${({ theme }) => theme.containerPadding}; 
  animation: ${sectionEntrance} 0.5s ease-out 0.3s forwards;
  opacity: 0;
`;
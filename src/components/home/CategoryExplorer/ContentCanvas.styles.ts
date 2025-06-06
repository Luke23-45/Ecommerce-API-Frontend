// src/components/CategoryExplorer/ContentCanvas.styles.ts
// (This ContentCanvas is for the NEW 3-column "Hot Trend" / "Élan Edit" layout)
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes ---
const contentEnter = keyframes`
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
`;

const tagPopIn = keyframes` /* For individual keyword tags */
  0% { opacity: 0; transform: scale(0.7) rotate(-5deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`;

const slideImageBackgroundIn = keyframes` /* For PromoImageSlide background */
  from { opacity: 0.3; transform: scale(1.05); }
  to { opacity: 1; transform: scale(1); }
`;

const descriptionBoxSlideUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Content Canvas Container for the 3-Column Layout ---
export const ContentCanvasContainer = styled.div<{ theme: DefaultTheme }>`
  /* This container holds the 3 columns and potentially an overall section header */
  padding: ${(props) => props.theme.spacing(1)} 0; /* Add some vertical padding to overall section */
  /* Background color for the entire ContentCanvas area (can be primaryNeutral or a distinct section bg) */
  background-color: ${(props) => lighten(0.02, props.theme.colors.primaryNeutral)}; 
  /* border-radius: ${(props) => props.theme.borderRadius.xlarge}; // Optional: if section itself is a card */
  /* margin: ${(props) => props.theme.spacing(8)} 0; // Optional: margin if it's a standalone section */
    padding-top: 20px;


  animation: ${contentEnter} 0.5s ease-out forwards;
  opacity: 0;
    height: 800px;
        padding-left: -700px;

`;

// Optional: Overall Header for "HOT! TREND"
export const SectionHeader = styled.div<{ theme: DefaultTheme }>`
    text-align: left;
    margin-bottom: ${(props) => props.theme.spacing(6)};
    padding: 0 ${(props) => props.theme.containerPadding}; /* Align with page content */

    h2.main-title {
        font-family: ${(props) => props.theme.typography.body.fontFamily}; /* Bold Sans-serif */
        font-size: clamp(1.8rem, 4vw, 2.6rem); /* Large and prominent */
        font-weight: ${(props) => props.theme.typography.body.weights.bold};
        color: ${(props) => props.theme.colors.textDark};
        margin: 0 0 ${(props) => props.theme.spacing(0.5)} 0;
        line-height: 1.2;
        
        span.highlight { /* For "HOT!" */
            /* Pink color - define this in your theme or use an accent */
            color: ${(props) => props.theme.colors.accent1Vibrant || props.theme.colors.accent1}; 
        }
    }
    p.subtitle { /* "카테고리별 추천 광고상품" */
        font-family: ${(props) => props.theme.typography.body.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.base};
        color: ${(props) => props.theme.colors.darkGray};
        margin: 0;
    }
`;


// --- Three-Column Grid Layout ---
export const ThreeColumnGrid = styled.div<{ theme: DefaultTheme }>`
  display: grid;
  
  /* Column sizes: Keywords (fixed-ish narrow) | Image Slider (flexible) | Products (more flexible) */
  /* Using percentages for more fluid adaptation, or fr units */
  grid-template-columns: 18% 30% 55%; /* TOTAL 100% - ADJUST THESE RATIOS AS NEEDED */
  /* A common split might be 240px 1fr 1.5fr for fixed first column */
  /* grid-template-columns: 240px minmax(0, 1fr) minmax(0, 1.5fr); */

  gap: ${(props) => props.theme.spacing(5)}; /* Gap between columns */

  align-items: flex-start; /* Align columns to the top */
  height: 86.5%;



  @media (max-width: 1200px) { 
    /* Example: Keywords | Merged Image & Products (Products below image) */
    grid-template-columns: 220px 1fr; 
    gap: ${(props) => props.theme.spacing(4)};
  }
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { 
    grid-template-columns: 1fr; /* Stack all columns */
    gap: ${(props) => props.theme.spacing(6)};
    padding: 0 ${(props) => props.theme.containerPadding}; /* Ensure padding on stacked view */
  }

  padding-left: 18px;
  padding-top: 0;
`;

export const ColumnTopTitle = styled.p `

        font-family: ${(props) => props.theme.typography.body.fontFamily}; /* Bold Sans-serif */
        font-size: clamp(1.8rem, 4vw, 2.6rem); /* Large and prominent */
        font-weight: ${(props) => props.theme.typography.body.weights.bold};
            color: ${(props) => props.theme.colors.accent1Vibrant || props.theme.colors.accent1}; 
        margin: 0 0 ${(props) => props.theme.spacing(0.5)} 0;
        line-height: 1.2;
`
export const ColumnContainerTop = styled.div ``
export const ColumnContainerBottom = styled.div ``
// --- Column 1: Hot Keywords ---
export const KeywordsColumn = styled.aside<{ theme: DefaultTheme }>`
  /* Background matches the "medium-to-dark grey" from description */
  background-color: white; 
  border-radius: ${(props) => props.theme.borderRadius.medium}; /* 8px */
  padding: ${(props) => props.theme.spacing(5)};
  color:#1992df; 
  display: flex;
  flex-direction: column;
  align-self: stretch; 
  justify-content: space-between;

  animation: ${contentEnter} 0.6s ease-out 0.1s forwards;
  opacity:0;
  height: 90.5%;

  h4.keywords-title { 
    font-family: ${({ theme }) => theme.typography.body.fontFamily}; 
    font-size: ${({ theme }) => theme.typography.body.sizes.medium}; 
    font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  color:#1992df; 
    margin: 0 0 ${(props) => props.theme.spacing(3.5)} 0;
    padding-bottom: ${(props) => props.theme.spacing(2)};
    border-bottom: 1px solid ${(props) => lighten(0.1, props.theme.colors.darkGray)};
  }
  
  @media (max-width: 1200px) and (min-width: ${(props) => parseInt(props.theme.breakpoints.tablet.replace('px','')) + 1}px) {
    /* Still full height when next to merged column */
  }
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { 
     /* When stacked, use theme colors suitable for a light page background */
     background-color: ${(props) => lighten(0.04, props.theme.colors.primaryNeutral)};
     padding: ${(props) => props.theme.spacing(4)};
     border: 1px solid ${(props) => props.theme.colors.lightGray};
     h4.keywords-title { 
         color: ${(props) => props.theme.colors.textDark}; 
         border-bottom-color: ${(props) => props.theme.colors.lightGray}; 
     }
   }
`;

export const KeywordsList = styled.ul<{ theme: DefaultTheme }>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${(props) => props.theme.spacing(1.25)}; 
`;

export const KeywordTag = styled.li<{ theme: DefaultTheme; $isActive?: boolean }>`
  a, button { 
    display: block;
    text-decoration: none;
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    color: ${(props) => props.$isActive ? props.theme.colors.accent1Vibrant || props.theme.colors.accent1 : lighten(0.55, props.theme.colors.textLight)}; /* Light grey/off-white text */
    background-color: ${(props) => props.$isActive 
        ? transparentize(0.8, props.theme.colors.accent1Vibrant || props.theme.colors.accent1) 
        : lighten(0.08, props.theme.colors.darkGray)}; /* Lighter grey bg for tag */

    transition: all 0.15s ease-out;
    text-align: left; 
    opacity: 0;
    animation: ${tagPopIn} 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: var(--stagger-delay, 0s); /* Stagger from JS */
    cursor: pointer;


  }
  width: max-content;
      padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(4)};
    border-radius: ${(props) => props.theme.borderRadius.small}; /* Less rounded than pill for a tag feel */

      border: 1px solid ${(props) => props.$isActive && lighten(0.15, props.theme.colors.dataVisBlue) };
          &:hover {
      color: ${(props) => props.theme.colors.textLight};
      background-color: ${(props) => lighten(0.1, props.theme.colors.dataVisBlue)};
      border-color: ${(props) => lighten(0.3, props.theme.colors.darkGray)};
      cursor: pointer;
    }
   @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { 
    a, button {
        color: ${(props) => props.$isActive ? props.theme.colors.accent1 : props.theme.colors.darkGray}; 
        background-color: ${(props) => props.$isActive ? transparentize(0.85, props.theme.colors.accent1) : props.theme.colors.adminSurface};
        border: 1px solid ${(props) => props.$isActive ? props.theme.colors.accent1 : props.theme.colors.lightGray};
        &:hover {
            color: ${(props) => props.theme.colors.accent1};
            background-color: ${(props) => transparentize(0.9, props.theme.colors.accent1)};
            border-color: ${(props) => props.theme.colors.accent1};
        }
    }
  }
`;

// --- Column 2: Image Background Slider with Description Box ---
export const ImageSliderColumn = styled.div<{ theme: DefaultTheme }>`
  position: relative; 
  overflow: hidden; 
  background-color: ${(props) => props.theme.colors.lightGray}; 
  aspect-ratio: 3 / 4; 
  /* min-height: 720px;  */
  min-height: 90.5%;
  width: 100%;
  box-shadow: ${({theme}) => theme.shadows.medium};
  display: flex; /* To make the track take full height if needed, though track usually dictates */
  animation: ${contentEnter /* Ensure contentEnter keyframe is defined */} 0.7s ease-out 0.2s forwards;
  opacity:0;

  @media (max-width: 1200px) and (min-width: ${(props) => parseInt(props.theme.breakpoints.tablet.replace('px','')) + 1}px) {
     aspect-ratio: 16 / 10;
     min-height: 350px;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { 
     aspect-ratio: 16/9;
     min-height: 300px;
     border-radius: ${(props) => props.theme.borderRadius.medium};
  }
`;

// Track for image slides (Column 2)
export const ImageSlidesTrack = styled.div<{ theme: DefaultTheme; $slideCount: number; $currentSlide: number }>`
  display: flex;
  position: relative;
  height: 100%; /* Take full height of ImageSliderColumn */
  /* Total width is number of slides * 100% (because each slide is 100% of viewport) */
  width: ${(props) => props.$slideCount * 100}%; 
transform: translateX(-${(props) => (props.$currentSlide * 200) / props.$slideCount}%);

  transition: transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1); 
`;

export const PromoImageSlide = styled.div<{ $imageUrl: string; $totalSlides: number }>`
  flex: 0 0 calc(100% / ${(props) => props.$totalSlides || 1});
  max-width: calc(100% / ${(props) => props.$totalSlides || 1});
  height: 100%;
  background-image: url(${(props) => props.$imageUrl});
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  animation: ${slideImageBackgroundIn} 0.8s ease-out;
`;

export const ImageDescriptionBox = styled.div<{ theme: DefaultTheme }>`
position: absolute;
z-index: 99;

bottom: 10%;
left: 12%;
  background-color: ${(props) => transparentize(0.1, darken(0.15, props.theme.colors.dataVisBlue))}; 
  backdrop-filter: blur(10px); 
  color: ${(props) => props.theme.colors.textLight};
  padding: ${(props) => props.theme.spacing(4)} ${(props) => props.theme.spacing(4.5)};
  margin: ${(props) => props.theme.spacing(4)}; 
  border-radius: ${(props) => props.theme.borderRadius.medium}; 
  box-shadow: 0 5px 20px ${rgba(0,0,0,0.3)};
  /* animation: ${descriptionBoxSlideUp} 0.7s ease-out 0.4s forwards; // Animation triggered by slide change */
  opacity: 0; /* For JS-controlled animation on active slide */
  transform: translateY(15px);
  transition: opacity 0.4s ease-out, transform 0.4s ease-out;

  &.active { /* Class added by JS for active slide's description */
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.2s; /* Slight delay after image appears */
  }

  h4 { /* Info title like "Summer Styling" */
    font-family: ${({ theme }) => theme.typography.body.fontFamily}; /* Sans-serif for UI */
    font-size: ${({ theme }) => theme.typography.body.sizes.large}; 
    font-weight: ${({ theme }) => theme.typography.body.weights.bold}; 
    color: ${(props) => props.theme.colors.textLight};
    margin: 0 0 ${(props) => props.theme.spacing(1)} 0;
    line-height: 1.3;
  }
  p { /* Info description like "여름의 시작..." */
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    line-height: 1.55;
    margin: 0;
    opacity: 0.9;
  }
  @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
    padding: ${(props) => props.theme.spacing(3)}; margin: ${(props) => props.theme.spacing(2.5)};
    h4 {font-size: ${({ theme }) => theme.typography.body.sizes.base};}
    p {font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};}
  }
`;
export const ProductGridColumn = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-direction: column;
  animation: ${contentEnter} 0.9s ease-out 0.3s forwards;
  opacity:0;
  position: relative; /* For slider arrows if this becomes a slider */
`;
// --- Reusable Slider Navigation Styles ---
export const SliderNavArrowButton = styled.button<{ theme: DefaultTheme; $direction: 'left' | 'right'; $isHidden?: boolean }>`
  /* ... same elegant SliderNavArrowButton styles from previous "RelatedProducts" or "ContentCanvas" ... */
    position: absolute; top: 50%; transform: translateY(-50%);
    ${props => props.$direction === 'left' ? `left: ${props.theme.spacing(2.5)};` : `right: ${props.theme.spacing(2.5)};`}
    background-color: ${(props) => transparentize(0.2, props.theme.colors.adminSurface)}; 
    backdrop-filter: blur(5px); border: 1px solid ${(props) => transparentize(0.75, props.theme.colors.darkGray)};
    border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
    color: ${(props) => props.theme.colors.textDark}; font-size: 15px; cursor: pointer; z-index: 5;
    opacity: ${(props) => props.$isHidden ? 0 : 0.7}; /* Adjusted default opacity */
    pointer-events: ${(props) => props.$isHidden ? 'none' : 'auto'}; transition: all 0.25s ease-out;

    ${ImageSliderColumn}:hover &, ${ProductGridColumn}:hover & { opacity: 0.9; } /* Show on relevant parent hover */
    
    &:hover:not(:disabled) {
        background-color: ${(props) => props.theme.colors.accent1}; color: ${(props) => props.theme.colors.textLight};
        transform: translateY(-50%) scale(1.08); border-color: transparent;
        box-shadow: 0 2px 8px ${props => rgba(props.theme.colors.accent1, 0.25)};
    }
    &:disabled { opacity: 0.2 !important; cursor: not-allowed; }
`;

export const SliderDotsContainer = styled.div<{ theme: DefaultTheme }>`
  /* ... same elegant SliderDotsContainer styles ... */
    position: absolute; bottom: ${(props) => props.theme.spacing(3)}; left: 50%; transform: translateX(-50%);
    display: flex; gap: ${(props) => props.theme.spacing(1.5)}; z-index: 5;
    padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(2)};
    background-color: ${(props) => transparentize(0.4, darken(0.05, props.theme.colors.textDark))};
    border-radius: ${(props) => props.theme.borderRadius.pill};
`;

export const DotButton = styled.button<{ theme: DefaultTheme; $isActive: boolean }>`
  /* ... same elegant DotButton styles ... */
    width: 8px; height: 8px; border-radius: 50%;
    background-color: ${(props) => props.$isActive ? props.theme.colors.textLight : transparentize(0.6, props.theme.colors.textLight)};
    border: 1px solid ${(props) => props.$isActive ? props.theme.colors.textLight : 'transparent'};
    cursor: pointer; transition: all 0.25s ease-out; padding: 0;
    &:hover { transform: scale(1.2); background-color: ${(props) => props.$isActive ? props.theme.colors.textLight : transparentize(0.4, props.theme.colors.textLight)};}
`;

// --- Column 3: Product Grid (2x3) ---






// This is ONE SLIDE in Column 3, containing a 2x3 grid of products


// Wrapper for each ProductCard + its specific badges/shipping
export const ProductListingWrapper = styled.div<{ theme: DefaultTheme }>`
  position: relative;
  background-color: ${({theme}) => theme.colors.adminSurface};
  border-radius: ${({theme}) => theme.borderRadius.medium}; /* Match other cards */
  overflow: visible; /* Allow badges to peek if absolutely positioned from image */
  border: 1px solid transparent;
  box-shadow: ${({theme}) => theme.shadows.inset};
  transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out, transform 0.2s ease-out;
  
  display: flex; 
  flex-direction: column;
  height: 100%;

  &:hover {
      /* border-color: ${({theme}) => theme.colors.lightGray}; */
      box-shadow: ${({theme}) => theme.shadows.medium};
      transform: translateY(-4px);
  }
  /* Your ProductCard component will be a child */
`;

// Colors for promo badges based on your description
const getPromoBadgeColor = (theme: DefaultTheme, type?: string) => {
    // "Orange or reddish-orange" maps well to accent1 or accent1Vibrant
    // "Distinctive red and white badge" - Red for background, white for text
    if (type === 'onePlusOne') return theme.colors.adminStatusError; // Or a dedicated promoRed
    return theme.colors.accent1Vibrant || theme.colors.accent1; // Default "orange/reddish-orange"
};

export const ProductPromoBadge = styled.span<{ theme: DefaultTheme; $type?: string }>`
  position: absolute;
  top: ${(props) => props.theme.spacing(2)};
  right: ${(props) => props.theme.spacing(2)};
  z-index: 3;
  padding: ${(props) => props.theme.spacing(1)} ${(props) => props.theme.spacing(1.75)};
  border-radius: ${(props) => props.theme.borderRadius.small};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 0.7rem; /* Smaller for badges */
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  color: ${({ theme }) => theme.colors.textLight};
  background-color: ${(props) => getPromoBadgeColor(props.theme, props.$type)};
  text-transform: uppercase; /* Can be omitted if text is specific like "1+1" */
  letter-spacing: 0.3px;
  line-height: 1;
  box-shadow: 0 1px 2px ${rgba(0,0,0,0.2)};
`;

export const ProductShippingInfo = styled.div<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: 0.8rem; /* Small for shipping info */
  color: ${(props) => getPromoBadgeColor(props.theme)}; /* Using same "orange/red-orange" logic */
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  margin-top: ${(props) => props.theme.spacing(1.5)};
  padding: 0 ${(props) => props.theme.spacing(0.5)};
  text-align: left; /* Example alignment */
  padding-bottom: 35px;
`;



// src/components/CategoryExplorer/ContentCanvas.styles.ts
// ... (All existing keyframes and styles for ContentCanvasContainer, SectionHeader, 
//      ThreeColumnGrid, KeywordsColumn, ImageSliderColumn, sliders, etc., remain THE SAME)



export const ProductGridTitle = styled.h3<{ theme: DefaultTheme }>` 
    font-family: ${({ theme }) => theme.typography.body.fontFamily}; /* Changed to body font for a less formal feel like description */
    font-size: ${({ theme }) => theme.typography.body.sizes.large}; 
    font-weight: ${({ theme }) => theme.typography.body.weights.bold}; 
    color: ${(props) => props.theme.colors.textDark};
    margin: 0 0 ${(props) => props.theme.spacing(4)} 0;
    text-align: left;
    padding-bottom: ${(props) => props.theme.spacing(2)};
    border-bottom: 1px solid ${(props) => props.theme.colors.lightGray};
`;

// Track for product grid slides (Column 3)
export const ProductGridSlidesTrack = styled.div<{ theme: DefaultTheme; $slideCount: number; $currentSlide: number }>`
  display: flex;
  /* If each slide (page of items) is 100% width of its parent (ProductGridColumn or SliderWrapper) */
  width: ${(props) => props.$slideCount * 86.5}%; 
  transform: translateX(-${(props) => props.$currentSlide * 100}%); 
  transition: transform 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
  /* overflow: hidden; // Handled by SliderWrapper if one is used */
`;

// This is ONE SLIDE in Column 3, containing a 2xN (e.g. 2x3 for 6 products) grid
export const ProductItemsDisplayPage = styled.div<{ theme: DefaultTheme }>` 
    width: 50%;
    height: 90%;
    display: grid;
    /* As per spec: 2 rows, 3 columns typically, for a total of 6 products per "page" */
    grid-template-columns: repeat(3, 1fr); 
    grid-template-rows: repeat(2, auto);    
    gap: ${(props) => props.theme.spacing(4)}; 
    padding: ${(props) => props.theme.spacing(0.5)}; 
    box-sizing: border-box;

    @media (max-width: 1350px) { 
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(3, auto); 
    }
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) { 
       /* On tablet, show 2 products per row, let rows flow */
       grid-template-columns: repeat(2, 1fr); 
       grid-template-rows: auto; 
       gap: ${(props) => props.theme.spacing(3)};
    }
    @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
        /* On small mobile, can stack to 1 column */
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); 
        gap: ${(props) => props.theme.spacing(2.5)};
    }
`;

// --- STYLES FOR INDIVIDUAL PRODUCT CELL (replaces external ProductCard for this specific context) ---
export const ProductCellStyled = styled.a<{ theme: DefaultTheme }>` /* Styled as an 'a' for clickability */

width: 100%;
  display: flex;
  flex-direction: column;
  
  background-color: ${({ theme }) => theme.colors.adminSurface}; /* White background for the cell */
  border-radius: ${({ theme }) => theme.borderRadius.medium}; /* Soft rounded corners */
  /* Using a more subtle border or relying on shadow */
  border: 1px solid ${({ theme }) => theme.colors.lightGray}; 
  /* box-shadow: ${({ theme }) => theme.shadows.subtle}; */ /* Can be too much if grid is dense */
  text-decoration: none;
  color: inherit;
  overflow: hidden; /* To clip image and badges */
  position: relative; /* For absolute positioned badges */
  transition: box-shadow 0.25s ease-out, transform 0.25s ease-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
    transform: translateY(-3px);
    img { /* Subtle zoom on image within the cell */
        transform: scale(1.03);
    }
  }
`;

export const ProductCellImageContainer = styled.div<{ theme: DefaultTheme }>`
  aspect-ratio: 1 / 1; /* Square images, or use 4/5 for portrait etc. */
  overflow: hidden;
  background-color: ${({theme}) => lighten(0.05, theme.colors.primaryNeutral)}; /* Placeholder BG */
  background-color: red;
    min-height: 210px;
    max-height: 210px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 210px;
    object-fit: cover; /* Or 'contain' */
    transition: transform 0.3s ease-out;
  }
`;

export const ProductCellContent = styled.div<{ theme: DefaultTheme }>`
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(3)};
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Pushes price to bottom */
`;

export const ProductCellName = styled.h4<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily}; /* Sans-serif for readability */
  font-size: ${({ theme }) => theme.typography.body.sizes.small}; /* Compact name size */
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.4;
  margin: 0 0 ${({ theme }) => theme.spacing(1)} 0;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: calc(${({theme}) => theme.typography.body.sizes.small} * 1.4 * 2); /* Reserve space for 2 lines */
`;

export const ProductCellPrice = styled.p<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base}; /* Price can be slightly larger */
  font-weight: ${({ theme }) => theme.typography.body.weights.bold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: auto 0 ${({ theme }) => theme.spacing(1)} 0; /* Push to bottom, space before shipping */
  line-height: 1;
`;
// --- END STYLES FOR INDIVIDUAL PRODUCT CELL ---




// Pagination for Product Grid (Column 3)
export const ProductGridPagination = styled(SliderDotsContainer)<{ theme: DefaultTheme }>`
  position: static; 
  transform: none;

  background-color: transparent; 
  opacity: 1; 
  margin-top: -20px;

  ${DotButton} { 
    background-color: ${(props) => props.$isActive ? props.theme.colors.accent1 : props.theme.colors.lightGray};
    border-color: ${(props) => props.$isActive ? props.theme.colors.accent1 : darken(0.1, props.theme.colors.lightGray)};
    width: 9px; height: 9px;
    &:hover {
      background-color: ${(props) => props.$isActive ? darken(0.1, props.theme.colors.accent1) : props.theme.colors.darkGray};
    }
  }
`;

export const ProductGridSliderWrapper = styled.div<{ theme: DefaultTheme }>`
  position: relative; /* Establishes a positioning context for absolute children like arrows/dots */
  overflow: hidden;   /* CRITICAL: This clips the ProductGridSlidesTrack to create the slider effect. */
  
  /* Visual Styling (Optional - can be very subtle or match the column background) */
  /* If ProductGridColumn provides the visual "card" or background, this can be simpler. */
  /* border-radius: ${({ theme }) => theme.borderRadius.medium}; */ /* e.g., 8px or 10px */
  /* background-color: ${({ theme }) => theme.colors.adminSurface}; */ /* Or transparent if ProductGridColumn handles bg */
  /* box-shadow: ${({ theme }) => theme.shadows.subtle}; */ /* Optional subtle shadow if it's a distinct visual block */

  /* Ensures it takes up available width if its parent (ProductGridColumn) is flex */
  width: 100%; 
  
  /* 
    Height: This is tricky. 
    - If all your ProductCard/ProductCellStyled have a fixed height or aspect-ratio, 
      and ProductItemsDisplayPage has a fixed number of rows, height can be calculated or be 'auto'.
    - If using aspect-ratio on cards within a grid, the grid row height will adapt.
    - For now, let's assume 'auto' and let content (ProductItemsDisplayPage) define the height.
  */
  height: auto;

  /* Optional entrance animation for the slider wrapper itself, if ProductGridColumn doesn't animate its children */
  /* opacity: 0;
  animation: ${contentEnter} 0.5s ease-out 0.1s forwards;
  animation-delay: var(--animation-delay-product-slider, 0.5s);  */
`;
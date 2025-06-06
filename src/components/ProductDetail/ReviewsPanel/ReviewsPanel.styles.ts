// src/components/ProductPage/ReviewsPanel/ReviewsPanel.styles.ts
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';
// We will use FrontendButton for "Write a Review" and "Load More"

// --- Keyframes ---
const reviewItemAppear = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Panel Wrapper ---
export const ReviewsPanelWrapper = styled.div<{ theme: DefaultTheme }>`
  padding-top: ${({ theme }) => theme.spacing(1)}; /* Consistent with other tab panels */
`;

// --- Rating Summary Section ---
export const RatingSummaryContainer = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-wrap: wrap; 
  align-items: flex-start; /* Align items to start if breakdown is taller */
  gap: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(5)};
  background-color: ${({ theme }) => lighten(0.04, theme.colors.primaryNeutral)}; 
  border-radius: ${({ theme }) => theme.borderRadius.large};
  margin-bottom: ${({ theme }) => theme.spacing(7)};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: stretch; /* Stretch items to full width */
    gap: ${({ theme }) => theme.spacing(4)};
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

export const OverallRating = styled.div<{ theme: DefaultTheme }>`
  text-align: center;
  padding-right: ${({ theme }) => theme.spacing(6)};
  margin-right: ${({ theme }) => theme.spacing(6)}; /* Ensures space before border */
  border-right: 1px solid ${({ theme }) => theme.colors.lightGray};
  flex-shrink: 0; /* Prevent this from shrinking too much */

  .average-score {
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: ${({ theme }) => theme.typography.heading.sizes.h2}; 
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    color: ${({ theme }) => theme.colors.textDark};
    line-height: 1; /* Tight for large numbers */
  }
  .star-display { 
    color: ${({ theme }) => theme.colors.adminStatusWarning}; /* Amber for stars */
    font-size: 1.3rem; /* Prominent stars */
    margin: ${({ theme }) => theme.spacing(1)} 0 ${({ theme }) => theme.spacing(1.5)} 0;
    display: flex;
    justify-content: center;
    gap: 2px;
  }
  .total-reviews {
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    color: ${({ theme }) => theme.colors.darkGray};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-right: 0;
    margin-right: 0;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
    padding-bottom: ${({ theme }) => theme.spacing(4)};
    width: 100%;
    text-align: left; 
    .star-display { justify-content: flex-start; }
    .average-score { font-size: ${({ theme }) => theme.typography.heading.sizes.h3};}
  }
`;

export const RatingBreakdown = styled.div<{ theme: DefaultTheme }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1.25)}; /* Tighter gap for bars */
  min-width: 250px; /* Ensure it has some width */
`;

export const RatingBarRow = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2.5)};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.darkGray};

  .star-label {
    width: 60px; /* Consistent width for "5 stars" */
    text-align: right;
    white-space: nowrap;
    font-weight: ${({theme}) => theme.typography.body.weights.medium};
  }
  .bar-container {
    flex-grow: 1;
    height: 10px; /* Thicker, more visible bars */
    background-color: ${({ theme }) => theme.colors.lightGray};
    border-radius: ${({theme}) => theme.borderRadius.pill};
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    background-color: ${({ theme }) => theme.colors.adminStatusWarning}; /* Amber */
    border-radius: ${({theme}) => theme.borderRadius.pill};
    transition: width 0.6s ease-out;
  }
  .percentage {
    min-width: 40px; /* Space for "100%" */
    text-align: left;
    font-weight: ${({theme}) => theme.typography.body.weights.medium};
  }
`;

// --- Write Review Section ---
export const WriteReviewSection = styled.div<{ theme: DefaultTheme }>`
  margin-bottom: ${({ theme }) => theme.spacing(7)};
  padding: ${({ theme }) => theme.spacing(5)} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({theme}) => theme.spacing(4)};

  p { 
    font-family: ${({theme}) => theme.typography.body.fontFamily};
    font-size: ${({theme}) => theme.typography.body.sizes.medium}; /* Use medium for more emphasis */
    color: ${({theme}) => theme.colors.textDark};
    margin: 0;
    flex-grow: 1; /* Allow text to take space */
  }

  /* FrontendButton will be used here */
`;

// Placeholder for the actual form area (might be modal or inline)
export const WriteReviewFormArea = styled.div<{ theme: DefaultTheme }>`
    background-color: ${({ theme }) => lighten(0.05, theme.colors.primaryNeutral)};
    padding: ${({ theme }) => theme.spacing(6)};
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    margin-bottom: ${({ theme }) => theme.spacing(7)};
    box-shadow: inset 0 2px 4px ${rgba(0,0,0,0.03)};

`;


// --- Review List ---
export const ReviewListContainer = styled.ul<{ theme: DefaultTheme }>`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ReviewItem = styled.li<{ theme: DefaultTheme }>`
  padding: ${({ theme }) => theme.spacing(5)} 0;
  border-bottom: 1px solid ${({ theme }) => lighten(0.05, theme.colors.lightGray)}; /* Lighter separator */
  opacity: 0; 
  animation: ${reviewItemAppear} 0.5s ease-out forwards;
  animation-delay: var(--review-item-delay, 0s); /* For staggering */

  &:last-child { border-bottom: none; padding-bottom: 0; }
  &:first-child { padding-top: ${({theme}) => theme.spacing(1)}; } /* Less padding for first after WriteReview */
`;

export const ReviewHeader = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const ReviewAvatar = styled.img<{ theme: DefaultTheme }>`
  width: 48px; /* Slightly larger avatar */
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border: 2px solid ${({theme}) => theme.colors.primaryNeutral}; /* Subtle border */
`;

export const ReviewAuthorInfo = styled.div<{ theme: DefaultTheme }>`
  .author-name {
    font-family: ${({theme}) => theme.typography.body.fontFamily};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    font-size: ${({ theme }) => theme.typography.body.sizes.base};
  }
  .review-date {
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
    color: ${({ theme }) => theme.colors.darkGray};
    margin-top: 3px; /* Precise spacing */
  }
`;

export const ReviewRating = styled.div<{ theme: DefaultTheme }>`
  color: ${({ theme }) => theme.colors.adminStatusWarning}; 
  font-size: 1rem; /* Clean star size */
  display: flex;
  gap: 3px; /* Tighter gap between stars */
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const ReviewTitle = styled.h5<{ theme: DefaultTheme }>`
  font-family: ${({theme}) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.medium}; /* Or base, for a slightly less prominent title */
  font-weight: ${({ theme }) => theme.typography.body.weights.bold}; /* Bolder review titles */
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(1.5)} 0;
  line-height: 1.4;
`;

export const ReviewText = styled.div<{ theme: DefaultTheme }>` /* Changed to div for more complex content */
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  line-height:  1.7; /* Use defined pMedium line height */
  color: ${({ theme }) => theme.colors.darkGray};
  margin: 0;
  white-space: pre-wrap; /* Preserve user-entered line breaks */
  
  p { /* Ensure paragraphs within review text also get good line height */
      margin-bottom: ${({ theme }) => theme.spacing(2.5)};
      line-height: inherit;
      &:last-child { margin-bottom: 0; }
  }
`;

export const ReviewActions = styled.div<{ theme: DefaultTheme }>`
  margin-top: ${({theme}) => theme.spacing(3.5)};
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing(4)}; /* More space between actions */

  button { 
    font-size: ${({theme}) => theme.typography.body.sizes.small}; /* Larger action text */
    color: ${({theme}) => theme.colors.darkGray};
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${({theme}) => theme.spacing(1.5)};
    padding: ${({theme}) => theme.spacing(1)};
    border-radius: ${({theme}) => theme.borderRadius.small};
    transition: color 0.2s ease-out, background-color 0.2s ease-out;

    &:hover {
        color: ${({theme}) => theme.colors.accent1};
        background-color: ${({theme}) => transparentize(0.9, theme.colors.accent1)};
    }
    &.active svg, &.active { 
        color: ${({theme}) => theme.colors.accent1};
        font-weight: ${({theme}) => theme.typography.body.weights.medium};
    }
    svg {
        font-size: 1.1em; /* Make icon slightly larger than text */
    }
  }
`;

// --- Pagination Container ---
export const ReviewsPaginationContainer = styled.nav` /* Use nav for semantic pagination */
  margin-top: ${({theme}) => theme.spacing(7)};
  display: flex;
  justify-content: center;
  /* Button styles will come from FrontendButton or a specific PaginationButton component */
`;
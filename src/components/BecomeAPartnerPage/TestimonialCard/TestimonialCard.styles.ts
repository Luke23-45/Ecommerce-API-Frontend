// src/components/BecomeAPartnerPage/TestimonialCard/TestimonialCard.styles.ts
import styled, { css, keyframes } from 'styled-components';
import { transparentize, lighten, darken, rgba } from 'polished';

const cardEntrance = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

// --- Testimonial Card Wrapper ---
export const TestimonialCardWrapper = styled.article<{ $animationDelay?: string }>`
  background-color: ${({ theme }) => theme.colors.backgroundLight}; /* Clean white or very light neutral */
  border-radius: ${({ theme }) => theme.borderRadius.xlarge}; /* Soft, elegant rounding */
  padding: ${({ theme }) => theme.spacing(6)};
  /* Use a more subtle border or rely on shadow for separation */
  border: 1px solid ${({ theme }) => transparentize(0.85, theme.colors.textMedium)};
  box-shadow: ${({ theme }) => theme.shadows.md}; /* Default Élan medium shadow */
  display: flex;
  flex-direction: column;
  height: 100%; /* For equal height cards in a grid row */
  position: relative;
  
  opacity: 0;
  animation: ${cardEntrance} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: ${(props) => props.$animationDelay || '0s'};

  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;

  &:hover {
    transform: translateY(-6px);
    box-shadow: ${({ theme }) => theme.shadows.large};
  }
`;

// --- Quotation Mark Styling ---
export const QuotationMark = styled.div`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; /* Playfair for elegant quote mark */
  font-size: 4.5rem; /* Large, statement quote mark */
  color: ${({ theme }) => theme.colors.accent1}; /* Élan accent color */
  line-height: 0.5; /* Pulls it tight */
  opacity: 0.8;
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  text-align: left; // Or center if preferred for the quote mark position
`;

// --- Testimonial Quote Text ---
export const TestimonialQuote = styled.blockquote`
  font-family: ${({ theme }) => theme.typography.body.fontFamily}; // Inter, or a slightly more expressive serif for quotes
  font-size: ${({ theme }) => theme.typography.body.sizes.medium}; // Clear, readable size
  font-style: italic; // Common for quotes
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.7; // Good readability
  margin: 0 0 ${({ theme }) => theme.spacing(5)} 0; /* Reset blockquote margin */
  padding: 0;
  border-left: 3px solid ${({ theme }) => theme.colors.accent1Subtle || transparentize(0.8, theme.colors.accent1)}; // Subtle accent line
  padding-left: ${({ theme }) => theme.spacing(4)};
  flex-grow: 1; /* Allows quote to take available space if card heights are equalized */

  p { /* If quote is wrapped in <p> */
    margin: 0;
  }
`;

// --- Attribution Section (Image, Name, Brand) ---
export const Attribution = styled.div`
  margin-top: auto; /* Pushes attribution to the bottom */
  padding-top: ${({ theme }) => theme.spacing(4)};
  border-top: 1px solid ${({ theme }) => theme.colors.lightGray}; // Separator line
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

export const PartnerImage = styled.img`
  width: 60px; // Size of the circular image
  height: 60px;
  border-radius: 50%; // Circular image
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.backgroundLight}; // Inner border to lift from card BG
  box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent2}; // Themed outer ring (Sage)
`;

export const PartnerInfo = styled.div`
  text-align: left;
`;

export const PartnerName = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0 0 ${({ theme }) => theme.spacing(0.5)} 0;
`;

export const PartnerBrand = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
`;
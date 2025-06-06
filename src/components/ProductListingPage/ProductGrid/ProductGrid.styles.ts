// src/components/ProductListing/ProductGrid.styles.ts
import styled from 'styled-components';

export const GridContainer = styled.div`
  display: grid;
  /* The image shows 4 columns. */
  grid-template-columns: repeat(4, 1fr); 
  gap: ${({ theme }) => theme.spacing(6)}; // Spacing between cards. Image suggests about 20px. theme.spacing(5) = 20px.

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop}) {
    grid-template-columns: repeat(3, 1fr); // 3 columns for smaller laptops/large tablets
    gap: ${({ theme }) => theme.spacing(4)};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr); // 2 columns for tablets
    gap: ${({ theme }) => theme.spacing(3)};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
  grid-template-columns: 1fr; // 1 column for mobile. Image doesn't show mobile, but good practice.
                                 // Or repeat(2,1fr) can also work if cards are small enough
    gap: ${({ theme }) => theme.spacing(4)};
  }
`;

export const RowDivider = styled.div`
  grid-column: 1 / -1; /* CRITICAL: Makes the divider span all columns of its parent GridContainer */
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lightGray}; /* Color of the faint line */
  /* The 'gap' from GridContainer will provide vertical spacing naturally.
     If the gap is too large, you might need negative margins or adjust the gap.
     If gap is 0 or too small, you might need:
     margin-top: ${({ theme }) => theme.spacing(4)}; 
     margin-bottom: ${({ theme }) => theme.spacing(4)}; 
     This would add space specifically around the divider.
     But usually, the grid-gap is preferred for consistent spacing.
  */
`;

export const NoProductsMessage = styled.div`
  grid-column: 1 / -1; // Span all columns
  text-align: center;
  padding: ${({ theme }) => theme.spacing(10)} ${({ theme }) => theme.spacing(4)};
  color: ${({ theme }) => theme.colors.textMedium};
  font-size: ${({ theme }) => theme.typography.body.sizes.large};
`;
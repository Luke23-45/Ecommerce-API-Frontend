// src/components/Admin/Products/ProductForm/ProductFormHeader.styles.ts

import styled, { type DefaultTheme } from 'styled-components';

// Helper to get theme properties with fallbacks
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${(props) => getTheme(props).spacing(3)};
  padding-bottom: ${(props) => getTheme(props).spacing(4)};
  margin-bottom: ${(props) => getTheme(props).spacing(4)};
  border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#eee'};
`;

export const FormTitle = styled.h2`
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'Inter, sans-serif'};
  font-size: 1.875rem; // ~30px
  font-weight: ${(props) => getTheme(props).typography.admin?.weights?.bold || 700};
  color: ${(props) => getTheme(props).colors.adminTextHeading || '#1a202c'};
  margin: 0;
  line-height: 1.3;

  // Truncate long product names with an ellipsis for a clean look
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  // Let the container's flex properties manage the width instead of a fixed max-width
  // This is more flexible.
  flex: 1 1 auto; 

  @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
    font-size: 1.5rem; // ~24px
    order: 1; // On mobile, force title to the first "row"
    width: 100%; // Take full width on its own line
    flex-basis: 100%;
  }
`;

export const BackButtonWrapper = styled.div`
  @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
    order: 2; // On mobile, the back button appears below the title
  }
`;
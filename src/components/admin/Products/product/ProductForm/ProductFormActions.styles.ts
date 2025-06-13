// src/components/Admin/Products/ProductForm/ProductFormActions.styles.ts

import styled, { type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const StickyActionBarContainer = styled.div`
  position: fixed;
  bottom: 0;

  right: 0;
  width: auto;

  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${(props) => getTheme(props).spacing(3)};

  padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(5)};
  background-color: ${(props) => rgba(getTheme(props).colors.adminSurface || '#ffffff', 0.85)};
  
  // The modern "glass" effect
  backdrop-filter: saturate(180%) blur(10px);
  -webkit-backdrop-filter: saturate(180%) blur(10px);

  border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#e2e8f0'};
  box-shadow: 0 -4px 20px -5px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: ${(props) => getTheme(props).breakpoints.laptop || '1024px'}) {
    // On laptops, often the sidebar is always collapsed, so we can adjust.
    // If your app doesn't do this, you can remove this media query.
    left: ${(props) => props.theme.sidebar?.widthCollapsed || '80px'};
    padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(4)};
  }

  @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
    left: 0; // Full width on mobile
    padding: ${(props) => getTheme(props).spacing(2.5)};
    
    // Spread buttons to fill the space for a better mobile tap area
    & > button {
      flex: 1;
    }
  }
`;
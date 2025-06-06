// src/components/Common/VariantSelector/ColorSwatch.styles.ts
import styled, { css, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

export const SwatchButton = styled.button<{
  theme: DefaultTheme;
  $colorValue: string; // The actual color hex/name for the swatch background
  $isSelected: boolean;
  $isAvailable: boolean;
}>`
  width: 36px;  /* Or theme.spacing(9) */
  height: 36px; /* Or theme.spacing(9) */
  border-radius: 50%; /* Circular swatch */
  border: 2px solid ${({ theme, $isSelected, $isAvailable }) => 
    $isSelected ? theme.colors.accent1 : 
    $isAvailable ? theme.colors.lightGray : transparentize(0.5, theme.colors.lightGray)
  };
  background-color: ${(props) => props.$colorValue};
  cursor: ${(props) => (props.$isAvailable ? 'pointer' : 'not-allowed')};
  opacity: ${(props) => (props.$isAvailable ? 1 : 0.4)};
  transition: all 0.2s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative; /* For potential checkmark or unavailability indicator */
  padding: 2px; /* Small padding inside the border */

  /* Subtle shadow to lift it */
  box-shadow: 0 1px 3px ${props => rgba(props.theme.colors.textDark, 0.1)};

  /* Image swatch for patterns/textures */
  ${(props) => props.$colorValue && props.$colorValue.startsWith('url(') && css`
    background-image: ${props.$colorValue};
    background-size: cover;
    background-position: center;
    background-color: ${props.theme.colors.lightGray}; /* Fallback */
  `}

  /* Optional: Inner ring for selected state for better visibility on similar colors */
  ${(props) => props.$isSelected && css`
    box-shadow: 0 0 0 2px ${props.theme.colors.adminSurface}, 0 0 0 4px ${props.theme.colors.accent1};
    /* Or use a checkmark icon: */
    /* &::after {
      content: '✔';
      color: ${props.theme.colors.textLight}; // If swatch is dark
      font-size: 12px;
      position: absolute;
    } */
  `}

  &:hover:not(:disabled):not([aria-disabled="true"]) {
    transform: scale(1.1);
    border-color: ${({ theme, $isSelected }) => $isSelected ? darken(0.1, theme.colors.accent1) : theme.colors.accent1};
    box-shadow: 0 2px 6px ${props => rgba(props.theme.colors.textDark, 0.15)};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.colors.adminSurface}, 0 0 0 4px ${props => props.theme.colors.accent1};
  }

  /* Style for unavailable swatch */
  ${(props) => !props.$isAvailable && css`
    &::after { /* Strikethrough line for unavailable colors */
      content: '';
      position: absolute;
      top: 50%;
      left: 15%;
      right: 15%;
      height: 1.5px;
      background-color: ${rgba(props.theme.colors.darkGray, 0.7)};
      transform: translateY(-50%) rotate(-30deg);
      pointer-events: none;
    }
  `}

  @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
    width: 32px;
    height: 32px;
  }
`;
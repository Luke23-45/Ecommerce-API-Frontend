// src/components/Common/Button.styles.ts (or wherever FrontendButton is defined)
import styled, { css, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

export const FrontendButton = styled.button<{ 
  theme: DefaultTheme; 
  $variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'iconOnly'; // Added 'tertiary' & 'iconOnly'
  $size?: 'small' | 'medium' | 'large';
  $fullWidth?: boolean;
}>`
  padding: ${({ theme, $size }) => 
    $size === 'small' ? `${theme.spacing(1.5)} ${theme.spacing(3.5)}` : 
    $size === 'large' ? `${theme.spacing(3.5)} ${theme.spacing(7)}` : 
    `${theme.spacing(2.75)} ${theme.spacing(5.5)}` // Default to medium
  };
  border-radius: ${({ theme }) => theme.borderRadius.medium}; 
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  font-size: ${({ theme, $size }) => 
    $size === 'small' ? theme.typography.body.sizes.xsmall : 
    $size === 'large' ? theme.typography.body.sizes.medium :
    theme.typography.body.sizes.small}; // Default to small/base for buttons
  
  /* Use button text style from theme for consistency if available */
  font-size: ${({ theme }) => theme.typography.body.sizes.medium}; 
   line-height: 1.5; 
   letter-spacing: 0.2px; 



  cursor: pointer;
  transition: all 0.2s ease-out; /* Faster, more responsive transitions */
  border: 1.5px solid transparent;
  text-align: center;
  line-height: 1.4; 
  display: inline-flex; 
  align-items: center;
  justify-content: center;
  text-decoration: none; /* For 'as' prop usage with <a> */
  width: ${(props) => props.$fullWidth ? '100%' : 'auto'};

  svg {
    /* Default margin for icon + text */
    margin-right: ${(props) => props.$variant === 'iconOnly' ? '0' : props.theme.spacing(1.75)};
    font-size: ${(props) => props.$variant === 'iconOnly' ? '1.3em' : '1.15em'}; 
    transition: transform 0.2s ease-out;
  }

  /* PRIMARY (e.g., Add to Cart) */
  ${(props) => (props.$variant === 'primary' || !props.$variant) && css`
    background-color: ${props.theme.colors.accent1};
    color: ${props.theme.colors.textLight};
    border-color: ${props.theme.colors.accent1};
    box-shadow: 0 2px 5px ${rgba(darken(0.1, props.theme.colors.accent1), 0.2)};

    &:hover:not(:disabled) { 
      background-color: ${darken(0.08, props.theme.colors.accent1)};
      border-color: ${darken(0.12, props.theme.colors.accent1)};
      transform: translateY(-1px);
      box-shadow: 0 4px 10px ${rgba(darken(0.1, props.theme.colors.accent1), 0.3)};
    }
    &:active:not(:disabled) {
      transform: translateY(0px);
      box-shadow: 0 1px 3px ${rgba(darken(0.1, props.theme.colors.accent1), 0.2)};
    }
  `}

  /* SECONDARY (e.g., Outline / Less emphasis) */
  ${(props) => props.$variant === 'secondary' && css`
    background-color: transparent; 
    color: ${props.theme.colors.accent1};
    border-color: ${props.theme.colors.accent1};
     box-shadow: 0 1px 2px ${rgba(darken(0.1, props.theme.colors.primaryNeutral), 0.05)};

    &:hover:not(:disabled) { 
      background-color: ${transparentize(0.92, props.theme.colors.accent1)};
      border-color: ${darken(0.05, props.theme.colors.accent1)};
      transform: translateY(-1px);
       box-shadow: 0 3px 8px ${rgba(props.theme.colors.accent1, 0.15)};
    }
    &:active:not(:disabled) {
        transform: translateY(0px);
        background-color: ${transparentize(0.88, props.theme.colors.accent1)};
    }
  `}

  /* TERTIARY / GHOST (e.g., Wishlist Text Button) */
  ${(props) => props.$variant === 'tertiary' && css`
    background-color: transparent;
    color: ${props.theme.colors.darkGray}; /* Softer text color */
    border-color: transparent; /* No border initially */
    padding-left: ${(props) => props.theme.spacing(2)}; /* Less padding for text buttons */
    padding-right: ${(props) => props.theme.spacing(2)};
    box-shadow: none;

    &:hover:not(:disabled) { 
      color: ${props.theme.colors.accent1};
      background-color: ${transparentize(0.95, props.theme.colors.accent1)};
      transform: none; /* No lift typically for ghost buttons */
      box-shadow: none;
    }
    svg {
        color: ${props.theme.colors.darkGray}; /* Default icon color */
        transition: color 0.2s ease-out;
    }
     &:hover:not(:disabled) svg {
        color: ${props.theme.colors.accent1};
     }
  `}
  
  /* ICON ONLY (e.g., Wishlist Heart Icon Button) */
  ${(props) => props.$variant === 'iconOnly' && css`
    background-color: transparent;
    color: ${props.theme.colors.darkGray};
    border: 1px solid transparent; // Initially no border or very light
    padding: ${props.theme.spacing(1.5)}; // Square padding for icons
    border-radius: ${props.theme.borderRadius.circle};
    min-width: auto; // Override min-width for icon buttons
    box-shadow: none;

    svg { margin-right: 0; font-size: 1.25rem; /* Control icon size directly */ }

    &:hover:not(:disabled) {
      color: ${props.theme.colors.accent1};
      background-color: ${transparentize(0.9, props.theme.colors.accent1)};
      border-color: ${transparentize(0.8, props.theme.colors.accent1)};
      transform: scale(1.05);
    }
  `}

  /* DANGER (e.g., Remove from cart/wishlist - though less common on PDP directly) */
  ${(props) => props.$variant === 'danger' && css` 
    background-color: ${transparentize(0.9, props.theme.colors.adminStatusError)};
    color: ${props.theme.colors.adminStatusError};
    border-color: ${transparentize(0.7,props.theme.colors.adminStatusError)};
     &:hover:not(:disabled) { 
            background-color: ${transparentize(0.8, props.theme.colors.adminStatusError)};
            border-color: ${props.theme.colors.adminStatusError};
            color: ${darken(0.05, props.theme.colors.adminStatusError)};
            transform: translateY(-1px);
        }
  `}

  &:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
    transform: none; 
    box-shadow: none;
    background-color: ${(props) => {
        if (props.$variant === 'primary') return lighten(0.1, props.theme.colors.accent1);
        if (props.$variant === 'secondary' || props.$variant === 'tertiary' || props.$variant === 'iconOnly') return 'transparent';
        return lighten(0.1, props.theme.colors.lightGray); // Default disabled bg
    }};
     border-color: ${(props) => props.$variant === 'primary' ? lighten(0.1, props.theme.colors.accent1) : props.theme.colors.lightGray};
  }
`;
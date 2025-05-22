// src/components/Admin/Common/Common.styles.ts
import styled, { type DefaultTheme, css } from 'styled-components';
import { rgba, darken } from 'polished';

// REMOVED: const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// --- Basic Admin Button ---
export const AdminButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger';
  $fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing(3)} ${theme.spacing(6)}`};
  border-radius: 8px;
  font-family: ${({ theme }) => theme.typography.admin.fontFamily};
  font-size: ${({ theme }) => theme.typography.admin.sizes.dataCell};
  font-weight: ${({ theme }) => theme.typography.admin.weights.semiBold};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease-out;
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background-color: ${theme.colors.accent1};
          color: ${theme.colors.textLight};
          border: 1px solid ${theme.colors.accent1};
          &:hover {
            background-color: ${darken(0.1, theme.colors.accent1)};
            border-color: ${darken(0.1, theme.colors.accent1)};
          }
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.adminSurface};
          color: ${theme.colors.adminTextSecondary};
          border: 1px solid ${theme.colors.adminBorder};
          &:hover {
            background-color: ${theme.colors.adminSecondaryBg};
            color: ${theme.colors.adminText};
          }
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.adminStatusError};
          color: ${theme.colors.textLight};
          border: 1px solid ${theme.colors.adminStatusError};
          &:hover {
            background-color: ${darken(0.1, theme.colors.adminStatusError)};
          }
        `;
      default:
        return '';
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    margin-right: ${({ theme }) => theme.spacing(1)};
    font-size: ${({ theme }) => theme.typography.admin.sizes.dataCell};
  }
`;
// --- Basic Admin Input Field ---
export const AdminInput = styled.input`
    width: 100%;
    padding: ${(props) => props.theme.spacing(3)}; /* DIRECT ACCESS */
    border: 1px solid ${(props) => props.theme.colors.adminBorder}; /* DIRECT ACCESS */
    border-radius: 8px;
    font-family: ${(props) => props.theme.typography.admin.fontFamily}; /* DIRECT ACCESS */
    font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase}; /* DIRECT ACCESS */
    color: ${(props) => props.theme.colors.adminText}; /* DIRECT ACCESS */
    background-color: ${props => props.theme.colors.adminSurface}; /* DIRECT ACCESS */
    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1}; /* DIRECT ACCESS */
        box-shadow: 0 0 0 3px ${props => rgba(props.theme.colors.accent1, 0.2)}; /* DIRECT ACCESS */
    }

    &::placeholder {
        color: ${props => props.theme.colors.adminTextSecondary}; /* DIRECT ACCESS */
    }

    &:disabled {
        background-color: ${props => props.theme.colors.adminSecondaryBg}; /* DIRECT ACCESS */
        cursor: not-allowed;
    }
`;

// AdminNotification Styling FIX
export const AdminNotification = styled.div<{ $type?: 'success' | 'error' | 'warning' | 'info' }>`
    padding: ${(props) => props.theme.spacing(4)};
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); /* Make shadow stronger for visibility */
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(2)};
    min-width: 200px;
    max-width: 350px;
    word-break: break-word;

    ${(props) => props.$type === 'success' && css`
        background-color: ${props.theme.colors.adminStatusSuccess};
        color: ${props.theme.colors.textLight}; /* Ensure white text for success */
    `}
    ${(props) => props.$type === 'error' && css`
        background-color: ${props.theme.colors.adminStatusError};
        color: ${props.theme.colors.textLight}; /* Ensure white text for error */
    `}
    ${(props) => props.$type === 'warning' && css`
        background-color: ${props.theme.colors.adminStatusWarning};
        color: ${props.theme.colors.adminText}; /* Use adminText for warning if bg is light amber */
    `}
    ${(props) => props.$type === 'info' && css`
        // FIX: Ensure 'info' has a strong background and contrasting text
        background-color: ${props.theme.colors.adminSecondaryBg}; /* Use a distinct, slightly darker background for info */
        color: ${props.theme.colors.adminText}; /* Use dark text for info on light background */
        border: 1px solid ${props.theme.colors.adminBorder}; /* Add a border for extra definition */
    `}
    
    button {
        flex-shrink: 0; 
        color: ${(props) => props.$type === 'info' ? props.theme.colors.adminTextSecondary : props.theme.colors.textLight};
    }
`;
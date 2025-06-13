// src/components/Admin/Products/ProductForm/ProductForm.styles.ts

import styled, { keyframes, css, type DefaultTheme } from 'styled-components';
import { rgba, darken } from 'polished';

// Helper to get theme properties with fallbacks
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// --- Animations ---
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// --- Main Container for the entire Form Page ---
export const ProductFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative; // For positioning child elements if needed
  
  // Apply a subtle fade-in animation to the whole container for a smooth entry
  opacity: 0;
  animation: ${fadeIn} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.1s;

  // Add generous padding at the bottom to ensure the content doesn't get hidden
  // behind the fixed action bar. 120px is a safe value.
  padding-bottom: 120px; 
`;

// --- The <form> element wrapping all sections ---
export const ActualProductForm = styled.form`
  display: flex;
  flex-direction: column;
  
  gap: ${(props) => getTheme(props).spacing(6)}; // e.g., 2rem or 32px

  @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
    gap: ${(props) => getTheme(props).spacing(4)}; // Reduce gap on smaller screens
  }
`;


// --- Reusable Alert Component for Server/Validation Errors ---
export const FormAlert = styled.div<{ $type: 'error' | 'success' | 'info' | 'warning' }>`
  display: flex;
  align-items: flex-start; // Aligns icon with the top of the text
  padding: ${(props) => getTheme(props).spacing(3)}; // e.g., 1rem or 16px
  border-radius: 8px;
  border: 1px solid transparent;
  margin-bottom: ${(props) => getTheme(props).spacing(4)}; // Space below the alert
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'Inter, sans-serif'};
  font-size: 0.9rem;
  line-height: 1.5;
  
  // Style for the icon inside the alert
  svg {
    flex-shrink: 0; // Prevents the icon from shrinking on small screens
    font-size: 1.25em; // Makes the icon slightly larger than the text
    margin-right: ${(props) => getTheme(props).spacing(2.5)}; // Space between icon and text
    margin-top: 2px; // Fine-tune vertical alignment
  }

  // Define color themes based on the alert type
  ${(props) => props.$type === 'error' && css`
    background-color: ${rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.08)};
    border-color: ${rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.3)};
    color: ${darken(0.1, getTheme(props).colors.adminStatusError || '#dc3545')};
  `}
  
  ${(props) => props.$type === 'success' && css`
    background-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.08)};
    border-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.3)};
    color: ${darken(0.1, getTheme(props).colors.adminStatusSuccess || '#28a745')};
  `}

  ${(props) => props.$type === 'warning' && css`
    background-color: ${rgba(getTheme(props).colors.adminStatusWarning || '#ffc107', 0.12)};
    border-color: ${rgba(getTheme(props).colors.adminStatusWarning || '#ffc107', 0.4)};
    color: ${darken(0.2, getTheme(props).colors.adminStatusWarning || '#ffc107')};
  `}
  
  ${(props) => props.$type === 'info' && css`
    background-color: ${rgba(getTheme(props).colors.adminStatusInfo || getTheme(props).colors.accent1 || '#17a2b8', 0.08)};
    border-color: ${rgba(getTheme(props).colors.adminStatusInfo || getTheme(props).colors.accent1 || '#17a2b8', 0.3)};
    color: ${darken(0.1, getTheme(props).colors.adminStatusInfo || getTheme(props).colors.accent1 || '#17a2b8')};
  `}
`;
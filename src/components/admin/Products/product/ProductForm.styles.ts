import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten } from 'polished';

// Helper to get theme
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// FadeIn animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Main Container for the Product Form Page ---
export const ProductFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(5)}; /* Space between header and main form area */
    
    opacity: 0;
    animation: ${fadeIn} 0.5s ease-out forwards;
    animation-delay: 0.1s;
    padding-bottom: 140px; /* Generous space for fixed action bar at the bottom */
`;

// --- Header for the Product Form Page ---
export const FormHeader = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface || '#FFFFFF'};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(6)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${(props) => getTheme(props).spacing(3)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

// --- Title for the Product Form Page ---
export const FormTitle = styled.h2`
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.sectionTitle || '1.75rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.bold || 700};
    color: ${(props) => getTheme(props).colors.adminText || '#333333'};
    margin: 0;
    line-height: 1.3;
`;

// --- The Actual <form> Element ---
export const ActualProductForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(7)}; /* Space between major FormSectionWrappers */
`;

// --- Sticky Action Bar (copied/adapted from your ProductDetail.styles.ts / AttributeForm.styles.ts) ---
export const StickyActionBar = styled.div`
    position: fixed;
    bottom: 0;
    /* Dynamic left margin based on sidebar state - this needs to be handled by your theme or a global context */
    left: ${(props) => (props.theme.sidebar?.isCollapsed ? props.theme.sidebar.widthCollapsed : props.theme.sidebar.widthExpanded) || (props.theme.sidebar?.isCollapsed ? '80px' : '260px')};
    right: 0;
    width: auto; /* It will fill space right of sidebar */
    
    background-color: ${(props) => rgba(getTheme(props).colors.adminPrimaryBg || '#FAFAFB', 0.97)};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(6)};
    box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.07);
    z-index: 100; /* Ensure it's above other content but below modals */
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(3)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        /* On mobile, sticky might be better to avoid keyboard overlap, or fixed with adjustments */
        position: sticky; 
        margin-left: 0; /* Full width */
        flex-direction: column-reverse; /* Stack buttons, primary action on top for mobile */
        gap: ${(props) => getTheme(props).spacing(2.5)};
        padding: ${(props) => getTheme(props).spacing(3)};
        border-radius: 0; /* No radius if it spans full width */
    }
`;

// --- Form Alert Styling (copied/adapted from AttributeForm.styles.ts) ---
export const FormAlert = styled.div<{ $type: 'error' | 'success' | 'info' | 'warning' }>`
    padding: ${(props) => getTheme(props).spacing(3)};
    border-radius: 8px;
    margin-bottom: ${(props) => getTheme(props).spacing(4)}; /* Or use gap in form container */
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.bodyBase || '0.9rem'};
    border: 1px solid transparent;
    display: flex;
    align-items: flex-start;
    gap: ${(props) => getTheme(props).spacing(2)};

    svg {
        flex-shrink: 0;
        margin-top: 3px; /* Align icon with first line */
        font-size: 1.25em;
    }

    ul { /* For displaying list of validation errors */
        margin: 0;
        padding-left: ${(props) => getTheme(props).spacing(3)};
        list-style-position: outside;
        li { margin-bottom: ${(props) => getTheme(props).spacing(0.5)}; }
    }

    ${(props) => props.$type === 'error' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.1)};
        border-color: ${rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.4)};
        color: ${darken(0.1, getTheme(props).colors.adminStatusError || '#dc3545')};
    `}
    ${(props) => props.$type === 'success' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.1)};
        border-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.4)};
        color: ${darken(0.1, getTheme(props).colors.adminStatusSuccess || '#28a745')};
    `}
    ${(props) => props.$type === 'info' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusInfo || getTheme(props).colors.accent1 || '#17a2b8', 0.1)};
        border-color: ${rgba(getTheme(props).colors.adminStatusInfo || getTheme(props).colors.accent1 || '#17a2b8', 0.4)};
        color: ${darken(0.1, getTheme(props).colors.adminStatusInfo || getTheme(props).colors.accent1 || '#17a2b8')};
    `}
    ${(props) => props.$type === 'warning' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusWarning || '#ffc107', 0.15)};
        border-color: ${rgba(getTheme(props).colors.adminStatusWarning || '#ffc107', 0.5)};
        color: ${darken(0.2, getTheme(props).colors.adminStatusWarning || '#ffc107')};
    `}
`;

// --- Field Helper Text (Can be common) ---
export const FieldHelperText = styled.small`
  display: block;
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
  font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.75rem'};
  color: ${(props) => getTheme(props).colors.adminTextMuted || '#6c757d'};
  margin-top: ${(props) => getTheme(props).spacing(1)};
  line-height: 1.5;
  padding-left: ${(props) => getTheme(props).spacing(0.5)}; /* Slight indent if under label */
`;

// --- Image Preview (if showing URL previews from text input, ImageUploader might handle its own) ---
export const ImagePreviewWrapper = styled.div`
    margin-top: ${(props) => getTheme(props).spacing(2)};
    max-width: 200px;
`;

export const ProductImagePreview = styled.img`
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEEEEE'};
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

// Add any other specific styles needed for ProductForm.tsx elements here.
// For example, if you have a special layout for the tags input or compliance checkboxes.

export const InputWithSuffix = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    
    input { /* Target AdminInput if it's a direct child */
        padding-right: ${(props) => getTheme(props).spacing(10)}; /* Space for suffix */
    }
`;

export const SuffixAdornment = styled.span`
    position: absolute;
    right: ${(props) => getTheme(props).spacing(3)};
    color: ${(props) => getTheme(props).colors.adminTextMuted || '#6c757d'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.small || '0.875rem'};
    pointer-events: none; /* So it doesn't interfere with input focus */
`;
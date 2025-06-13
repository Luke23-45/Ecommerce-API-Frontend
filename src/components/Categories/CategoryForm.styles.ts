// src/components/Admin/Categories/CategoryForm.styles.ts
import styled, { type DefaultTheme, keyframes, css } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const CategoryFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(5)};
    
    opacity: 0;
    animation: ${fadeIn} 0.5s ease-out forwards;
    animation-delay: 0.1s;
    padding-bottom: 130px; /* Space for fixed action bar */
`;

export const FormHeader = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface || '#FFFFFF'};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(6)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap; /* Allow items to wrap */
    gap: ${(props) => getTheme(props).spacing(3)}; /* Gap between title and button */

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const FormTitle = styled.h2`
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.sectionTitle || '1.75rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.bold || 700};
    color: ${(props) => getTheme(props).colors.adminText || '#333333'};
    margin: 0;
`;

export const ActualForm = styled.form` /* Renamed to avoid conflict if importing from other files */
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(6)};
`;

// --- Re-exporting or defining common styles ---
// Assuming FormStickyActionBar and FormAlert might be common.
// If you created a common/Form.styles.ts, import from there.
// Otherwise, if they were in AttributeForm.styles.ts:

// Copied from AttributeForm.styles.ts for completeness - ideally, make these common
export const FormStickyActionBar = styled.div`
    position: fixed;
    bottom: 0;
    left: 0; 
    right: 0;
    width: auto; 
    margin-left: ${(props) => (props.theme.sidebar?.isCollapsed ) || (props.theme.sidebar?.isCollapsed ? '80px' : '260px')}; 
    background-color: ${(props) => rgba(getTheme(props).colors.adminPrimaryBg || '#FAFAFB', 0.97)};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(6)};
    box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.07);
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    gap: ${(props) => getTheme(props).spacing(3)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        flex-direction: column-reverse; /* Save button on top for mobile */
        gap: ${(props) => getTheme(props).spacing(2)};
        padding: ${(props) => getTheme(props).spacing(2.5)};
        margin-left: 0; /* Full width on mobile */
        position: sticky; /* On mobile, sticky might be better than fixed to avoid keyboard issues */
    }
`;

export const FormAlert = styled.div<{ $type: 'error' | 'success' | 'info' | 'warning' }>`
    padding: ${(props) => getTheme(props).spacing(3)};
    border-radius: 8px;
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.bodyBase || '0.9rem'};
    border: 1px solid transparent;
    display: flex;
    align-items: flex-start; /* Align icon with first line of text */
    gap: ${(props) => getTheme(props).spacing(2)};

    svg {
        flex-shrink: 0;
        margin-top: 2px; /* Align icon nicely with text */
        font-size: 1.2em;
    }

    ul {
        margin: 0;
        padding-left: ${(props) => getTheme(props).spacing(3)};
        list-style-position: outside;
    }

    ${(props) => props.$type === 'error' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.1)};
        border-color: ${rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.3)};
        color: ${darken(0.1, getTheme(props).colors.adminStatusError || '#dc3545')};
    `}
    ${(props) => props.$type === 'success' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.1)};
        border-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.3)};
        color: ${darken(0.1, getTheme(props).colors.adminStatusSuccess || '#28a745')};
    `}
     ${(props) => props.$type === 'info' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusInfo || getTheme(props).colors.accent1 || '#17a2b8', 0.1)};
        border-color: ${rgba(getTheme(props).colors.adminStatusInfo || getTheme(props).colors.accent1 || '#17a2b8', 0.3)};
        color: ${darken(0.1, getTheme(props).colors.adminStatusInfo || getTheme(props).colors.accent1 || '#17a2b8')};
    `}
    ${(props) => props.$type === 'warning' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusWarning || '#ffc107', 0.15)};
        border-color: ${rgba(getTheme(props).colors.adminStatusWarning || '#ffc107', 0.4)};
        color: ${darken(0.2, getTheme(props).colors.adminStatusWarning || '#ffc107')};
    `}
`;

export const FieldHelperText = styled.small`
  display: block;
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
  font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.75rem'};
  color: ${(props) => getTheme(props).colors.adminTextMuted || '#6c757d'};
  margin-top: ${(props) => getTheme(props).spacing(1)};
  line-height: 1.4;
`;

// Styles for Image Preview if an imageUrl is provided
export const ImagePreviewWrapper = styled.div`
    margin-top: ${(props) => getTheme(props).spacing(2)};
    max-width: 200px; /* Limit preview size */
`;

export const CategoryImagePreview = styled.img`
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEEEEE'};
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;
// src/components/Admin/Shipping/Zones/ShippingZoneForm.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ZoneFormContainer = styled.div`
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
    flex-wrap: wrap;
    gap: ${(props) => getTheme(props).spacing(3)};

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

export const ActualForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(6)};
`;

// Reusing StickyActionBar and FormAlert from other form styles (e.g., AttributeForm.styles.ts)
// Ensure these are either common or copy their definitions.
// For this example, we assume they are available and imported correctly in the .tsx file.
// If defined in, for example, src/components/Admin/common/Form.styles.ts:
// export { FormStickyActionBar, FormAlert, FieldHelperText } from '../../common/Form.styles';

// For this file, let's copy them to ensure completeness if they aren't common yet.
// Ideally, abstract these to a shared style file.

export const FormStickyActionBar = styled.div`
    position: fixed;
    bottom: 0;

    right: 0;
    width: auto;
    background-color: ${(props) => rgba(getTheme(props).colors.adminPrimaryBg || '#FAFAFB', 0.97)};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(6)};
    box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.07);
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(3)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        position: sticky;
        margin-left: 0;
        flex-direction: column-reverse;
        gap: ${(props) => getTheme(props).spacing(2.5)};
        padding: ${(props) => getTheme(props).spacing(3)};
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
    align-items: flex-start;
    gap: ${(props) => getTheme(props).spacing(2)};

    svg { flex-shrink: 0; margin-top: 3px; font-size: 1.25em; }
    ul { margin: 0; padding-left: ${(props) => getTheme(props).spacing(3)}; list-style-position: outside; li { margin-bottom: ${(props) => getTheme(props).spacing(0.5)}; } }

    ${(props) => props.$type === 'error' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.1)};
        border-color: ${rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.4)};
        color: ${darken(0.1, getTheme(props).colors.adminStatusError || '#dc3545')};
    `}
    /* ... other types: success, info, warning (copy from previous examples if needed) ... */
     ${(props) => props.$type === 'success' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.1)};
        border-color: ${rgba(getTheme(props).colors.adminStatusSuccess || '#28a745', 0.4)};
        color: ${darken(0.1, getTheme(props).colors.adminStatusSuccess || '#28a745')};
    `}
    ${(props) => props.$type === 'warning' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusWarning || '#ffc107', 0.15)};
        border-color: ${rgba(getTheme(props).colors.adminStatusWarning || '#ffc107', 0.5)};
        color: ${darken(0.2, getTheme(props).colors.adminStatusWarning || '#ffc107')};
    `}
`;

export const FieldHelperText = styled.small`
  display: block;
  font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
  font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.75rem'};
  color: ${(props) => getTheme(props).colors.adminTextMuted || '#6c757d'};
  margin-top: ${(props) => getTheme(props).spacing(1)};
  line-height: 1.5;
  padding-left: ${(props) => getTheme(props).spacing(0.5)};
`;

// Styles for react-select or similar multi-select components
export const SelectWrapper = styled.div`
    /* Wrapper for react-select or other custom select components to control their overall block */
    .react-select__control {
        border-color: ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'} !important;
        border-radius: 8px !important;
        background-color: ${props => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'} !important;
        min-height: calc(${(props) => getTheme(props).spacing(2.5)} * 2 + 18px + 2px); /* Match AdminInput height */
        box-shadow: none !important;
        &:hover {
            border-color: ${(props) => getTheme(props).colors.adminBorderDark || '#BDBDBD'} !important;
        }
    }
    .react-select__control--is-focused {
        border-color: ${props => getTheme(props).colors.accent1 || '#007BFF'} !important;
        box-shadow: 0 0 0 1px ${props => getTheme(props).colors.accent1 || '#007BFF'} !important; /* Mimic focus */
    }
    .react-select__multi-value {
        background-color: ${(props) => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.15)} !important;
        color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'} !important;
        border-radius: 4px !important;
    }
    .react-select__multi-value__label {
        color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'} !important;
        font-size: 0.85em !important;
    }
    .react-select__multi-value__remove {
        color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'} !important;
        &:hover {
            background-color: ${(props) => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.3)} !important;
            color: white !important;
        }
    }
    .react-select__menu {
        background-color: ${props => getTheme(props).colors.adminSurface || '#FFFFFF'} !important;
        border: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'} !important;
        border-radius: 8px !important;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
        z-index: 10; /* Ensure dropdown is above other form elements */
    }
    .react-select__option--is-selected {
        background-color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'} !important;
        color: white !important;
    }
    .react-select__option--is-focused {
        background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'} !important;
    }
    .react-select__placeholder, .react-select__input-container, .react-select__single-value {
        color: ${props => getTheme(props).colors.adminText || '#333'} !important;
        font-size: ${(props) => getTheme(props).typography.admin?.sizes?.dataCell || '0.9rem'};
    }
`;
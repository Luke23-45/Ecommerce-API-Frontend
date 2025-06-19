import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const DiscountFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(5)};
    opacity: 0;
    animation: ${fadeIn} 0.5s ease-out forwards;
    animation-delay: 0.1s;
    padding-bottom: 130px; /* Space for sticky action bar */
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

// --- Sub-section for Rules (e.g., Buy X Get Y) ---
export const RulesSection = styled.div`
    margin-top: ${(props) => getTheme(props).spacing(3)};
    padding: ${(props) => getTheme(props).spacing(4)};
    border: 1px dashed ${(props) => getTheme(props).colors.adminBorderLight || '#DDD'};
    border-radius: 8px;
    background-color: ${(props) => lighten(0.03, getTheme(props).colors.adminSecondaryBg || '#F8F9FA')};
`;

export const RuleItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(3)};
    padding-bottom: ${(props) => getTheme(props).spacing(3)};
    margin-bottom: ${(props) => getTheme(props).spacing(3)};
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
    &:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
`;

export const RuleHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    h5 {
        margin: 0;
        font-size: ${(props) => getTheme(props).typography.admin?.sizes?.bodyBase || '0.95rem'};
        font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
        color: ${(props) => getTheme(props).colors.adminText || '#333'};
    }
    /* Add button to remove a rule item if multiple rules are allowed */
`;


// --- Selection Display (for applicable products/categories/users) ---
export const SelectedItemsPreview = styled.div`
    margin-top: ${(props) => getTheme(props).spacing(2)};
    padding: ${(props) => getTheme(props).spacing(2)};
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
    border-radius: 6px;
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.small || '0.875rem'};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#555'};
    max-height: 150px;
    overflow-y: auto;

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    li {
        padding: ${(props) => getTheme(props).spacing(1)} 0;
        border-bottom: 1px dotted ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
        &:last-child { border-bottom: none; }
    }
`;

// --- Re-exporting common styles from a shared location or previous files ---
// It's better to have these in a truly common file, e.g., src/components/Admin/common/Form.styles.ts
// For now, re-exporting from AttributeForm.styles assuming they are suitable.
// export {
//     FormStickyActionBar,
//     FormAlert,
//     FieldHelperText,
// } from '../../Attributes/AttributeForm.styles'; // VERIFY PATH
export { FormStickyActionBar,FormAlert,FieldHelperText } from '@/components/Categories/CategoryForm.styles';
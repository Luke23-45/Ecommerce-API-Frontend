// src/components/Admin/Shipping/Rates/ShippingRateForm.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const RateFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(5)};
    opacity: 0;
    animation: ${fadeIn} 0.5s ease-out forwards;
    animation-delay: 0.1s;
    padding-bottom: 130px; /* Space for fixed action bar */
`;

export const FormHeader = styled.div`
    /* ... similar to ShippingZoneForm.styles.ts FormHeader ... */
    background-color: ${(props) => getTheme(props).colors.adminSurface || '#FFFFFF'};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(6)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: ${(props) => getTheme(props).spacing(3)};
`;

export const FormTitle = styled.h2`
    /* ... similar to ShippingZoneForm.styles.ts FormTitle ... */
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.sectionTitle || '1.75rem'};
    color: ${(props) => getTheme(props).colors.adminText || '#333333'};
    margin: 0;
`;

export const ParentZoneContextDisplay = styled.p`
    /* ... similar to ParentAttributeContext from AttributeOptionForm.styles.ts ... */
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.bodyBase || '0.95rem'};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
    border-radius: 8px;
    margin: -${(props) => getTheme(props).spacing(3)} 0 ${(props) => getTheme(props).spacing(5)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEEEEE'};

    strong {
        font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
        color: ${(props) => getTheme(props).colors.accent2 || getTheme(props).colors.accent1 || '#007BFF'};
    }
`;

export const ActualForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(6)};
`;

// --- Rule Management for Tiered Rates ---
export const RulesSection = styled.div`
    margin-top: ${(props) => getTheme(props).spacing(3)};
    padding-top: ${(props) => getTheme(props).spacing(3)};
    border-top: 1px dashed ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
`;

export const RuleRow = styled.div`
    display: flex;
    align-items: flex-end; /* Align button with bottom of inputs */
    gap: ${(props) => getTheme(props).spacing(2.5)};
    margin-bottom: ${(props) => getTheme(props).spacing(3)};
    padding: ${(props) => getTheme(props).spacing(3)};
    background-color: ${(props) => lighten(0.03, getTheme(props).colors.adminSecondaryBg || '#F8F9FA')};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
    border-radius: 8px;

    /* Adjust FieldGroup if nested here for tighter spacing */
    & > div { /* Targeting FieldGroup presumably */
        margin-bottom: 0; 
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.mobile || '576px'}) {
        flex-direction: column;
        align-items: stretch;
        & > button { /* Make delete button full width on mobile */
            margin-top: ${(props) => getTheme(props).spacing(2)};
        }
    }
`;

export const RuleInput = styled.input` /* Can use AdminInput with style overrides */
    /* Styles for inputs within a rule row */
    width: 100%;
    padding: ${(props) => getTheme(props).spacing(1.5)} ${(props) => getTheme(props).spacing(2)};
    /* ... other AdminInput like styles ... */
`;

export const AddRuleButton = styled.button`
    /* Similar to AdminButton but maybe secondary or neutral, with an icon */
    /* For example, re-style AdminButton with $variant="neutral" or $variant="outline" */
    /* This example uses a more direct styling */
    display: inline-flex;
    align-items: flex-end;
    gap: ${(props) => getTheme(props).spacing(1.5)};
    padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(3)};
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.small || '0.875rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.medium || 500};
    color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
    background-color: transparent;
    border: 1px dashed ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
    border-radius: 6px;
    cursor: pointer;
    height: max-content;
    transition: all 0.2s ease-out;

    &:hover {
        background-color: ${(props) => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.05)};
        color: ${(props) => darken(0.05, getTheme(props).colors.accent1 || '#007BFF')};
    }
    &:disabled { /* ... standard disabled styles ... */ }
`;


// Re-exporting common form styles or define them here
export {
    FormStickyActionBar,
    FormAlert,
    FieldHelperText
} from '@/components/Categories/CategoryForm.styles'; // Adjust path to your common or AttributeForm styles


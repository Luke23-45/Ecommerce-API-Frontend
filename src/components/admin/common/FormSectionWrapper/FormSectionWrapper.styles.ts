// src/components/Admin/Common/FormSectionWrapper/FormSectionWrapper.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { css } from 'styled-components';
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const FormSectionContainer = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(6)};
    margin-bottom: ${(props) => getTheme(props).spacing(8)}; /* Space between sections */
    
    &:last-child {
        margin-bottom: 0;
    }
`;

export const SectionHeader = styled.div`
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    padding-bottom: ${(props) => getTheme(props).spacing(4)};
    margin-bottom: ${(props) => getTheme(props).spacing(6)};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const SectionTitle = styled.h3`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
`;

export const SectionContent = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Default grid for form fields */
    gap: ${(props) => getTheme(props).spacing(5)}; /* Spacing between form fields */

    /* Generic wrapper for form labels and inputs */
    & > div {
        display: flex;
        flex-direction: column;
        gap: ${(props) => getTheme(props).spacing(1.5)};
    }
`;

export const FormLabel = styled.label`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.label};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.medium};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    text-transform: uppercase;
    letter-spacing: 0.3px;
    cursor: pointer;
`;

export const FieldGroup = styled.div<{ $fullWidth?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(1.5)}; /* Consistent inner spacing */
    ${(props) => props.$fullWidth && css`
        grid-column: 1 / -1; /* Spans full width of the grid */
    `}
`;

export const MultiFieldRow = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(4)};
    align-items: center;

    /* Styles for nested inputs/selects in a row */
    ${(props) => FieldGroup},
    ${(props) => props.theme.spacing(0) ? '' : 'input, select, textarea'} { /* Check for proper spacing, then apply directly */
        flex: 1; /* Distribute space evenly */
        min-width: 0; /* Allow shrinking */
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        align-items: stretch;
        gap: ${(props) => getTheme(props).spacing(3)};
    }
`;
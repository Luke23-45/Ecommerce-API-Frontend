// src/components/Admin/Common/FormSectionWrapper/FormSectionWrapper.styles.ts
import styled, { type DefaultTheme, css } from 'styled-components'; // Ensure css is imported
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

// FieldGroup needs to be defined BEFORE SectionContent so SectionContent can reference it
export const FieldGroup = styled.div<{ $fullWidth?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(1.5)}; /* Consistent inner spacing */
    ${(props) => props.$fullWidth && css`
        grid-column: 1 / -1; /* Spans full width of the grid */
    `}
`;






export const SectionContent = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Default grid for form fields */
    gap: ${(props) => getTheme(props).spacing(5)}; /* Spacing between form fields */

    /* **FIX 1:** Target ONLY FieldGroup components as direct children of SectionContent.
       This prevents MultiFieldRow from inheriting flex-direction: column. */
    & > ${FieldGroup} { 
        // This 'display: flex; flex-direction: column;' is already defined in FieldGroup,
        // so it's technically redundant here, but harmless as it ensures the base styling is applied if FieldGroup somehow changes.
        display: flex; 
        flex-direction: column;
        gap: ${(props) => getTheme(props).spacing(1.5)};
    }
`;

export const FormLabel = styled.label`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.formLabel}; /* Using formLabel size from theme */
    font-weight: ${(props) => getTheme(props).typography.admin.weights.medium};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    text-transform: uppercase;
    letter-spacing: 0.3px;
    cursor: pointer;
`;

export const MultiFieldRow = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(4)};
    // **IMPROVEMENT:** Change align-items for better vertical alignment of varying field heights
    align-items: flex-start; 

    /* **FIX 2:** Correctly target direct FieldGroup children within MultiFieldRow
       and apply flex properties for even space distribution. */
    & > ${FieldGroup} {
        flex: 1; /* Distribute space evenly */
        min-width: 0; /* Allow shrinking */
    }

    /* Also apply to raw inputs/selects if they are ever direct children of MultiFieldRow */
    & > input, 
    & > select, 
    & > textarea { 
        flex: 1; 
        min-width: 0; 
    }

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        align-items: stretch;
        gap: ${(props) => getTheme(props).spacing(3)};
    }
`;


export const FormControl = styled.input`
    width: 100%; /* Ensure inputs take full width of their container */
    padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorderInteractive}; /* Use interactive border for inputs */
    border-radius: ${(props) => getTheme(props).borderRadius.small}; /* Use a small border radius */
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase}; /* Base text size for input content */
    color: ${(props) => getTheme(props).colors.adminText};
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg}; /* White background for inputs */
    line-height: ${(props) => getTheme(props).typography.admin.lineHeight}; /* Ensure consistent line height */

    // Placeholder text style
    &::placeholder {
        color: ${(props) => getTheme(props).colors.adminTextMuted};
    }

    // Focus state
    &:focus {
        outline: none;
        border-color: ${(props) => getTheme(props).colors.adminAccent}; /* Accent color on focus */
        box-shadow: ${(props) => getTheme(props).shadows.focusRing}; /* Add a subtle focus ring */
    }

    // Disabled state
    &:disabled {
        background-color: ${(props) => getTheme(props).colors.lightGray};
        color: ${(props) => getTheme(props).colors.adminTextDisabled};
        cursor: not-allowed;
    }
`;

export const FormTextarea = styled(FormControl).attrs({ as: 'textarea' })`
    min-height: ${(props) => getTheme(props).spacing(20)}; /* Example min-height for textarea */
    resize: vertical; /* Allow vertical resizing */
`;

export const FormSelect = styled(FormControl).attrs({ as: 'select' })`
    appearance: none; /* Remove default select arrow for custom styling */
    padding-right: ${(props) => getTheme(props).spacing(7)}; /* Make space for a custom arrow */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%236B7280'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right ${(props) => getTheme(props).spacing(4)} center;
    background-size: 1.25rem;
    cursor: pointer; // Indicate it's clickable
`;
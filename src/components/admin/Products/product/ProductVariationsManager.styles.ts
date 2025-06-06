import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken, lighten } from 'polished';

// Helper to get theme
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// Animation for sections or elements appearing
const subtleSlideIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ManagerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(5)};
    padding: ${(props) => getTheme(props).spacing(1)} 0; /* Minimal top/bottom padding */
`;

// --- Section for selecting attributes and their values ---
export const AttributeSelectionArea = styled.div`
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
    border-radius: 10px;
    background-color: ${(props) => lighten(0.02, getTheme(props).colors.adminSecondaryBg || '#F8F9FA')};
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(4)};
`;

export const SectionTitle = styled.h4`
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.bodyLarge || '1.1rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.semiBold || 600};
    color: ${(props) => getTheme(props).colors.adminText || '#333'};
    margin: 0 0 ${(props) => getTheme(props).spacing(1)} 0;
    padding-bottom: ${(props) => getTheme(props).spacing(2)};
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
`;

export const AttributePickerGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(3)};
`;

export const AttributeRow = styled.div`
    display: flex;
    align-items: flex-start; /* Align items to the top for multi-line tags */
    gap: ${(props) => getTheme(props).spacing(3)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet || '768px'}) {
        flex-direction: column;
    }
`;

export const AttributeNameLabel = styled.span`
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.bodyBase || '0.95rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.medium || 500};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#555'};
    min-width: 120px; /* Ensure consistent width for labels */
    padding-top: ${(props) => getTheme(props).spacing(2)}; /* Align with input-like elements */
`;

export const ValuesInputContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(2)};
`;

export const SelectedValuesTags = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => getTheme(props).spacing(1.5)};
    margin-bottom: ${(props) => getTheme(props).spacing(1)};
`;

export const ValueTag = styled.span`
    background-color: ${(props) => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.12)};
    color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.small || '0.8rem'};
    font-weight: ${(props) => getTheme(props).typography.admin?.weights?.medium || 500};
    padding: ${(props) => getTheme(props).spacing(1)} ${(props) => getTheme(props).spacing(2)};
    border-radius: 16px; /* Pill shape */
    display: inline-flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(1)};
    animation: ${subtleSlideIn} 0.3s ease-out;

    button { /* Remove button */
        background: none;
        border: none;
        color: inherit;
        opacity: 0.7;
        cursor: pointer;
        padding: 0;
        margin-left: ${(props) => getTheme(props).spacing(0.5)};
        font-size: 0.9em;
        line-height: 1;
        &:hover {
            opacity: 1;
            color: ${(props) => getTheme(props).colors.adminStatusError || '#dc3545'};
        }
    }
`;

// Input for adding new attribute values (can reuse AdminInput if suitable or define specifically)
// Assuming a TagInput-like component or a simple input for comma-separated values
export const NewValueInput = styled.input`
    /* Similar to AttributeSearchInput or AdminInput */
    padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(3)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
    border-radius: 6px;
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.dataCell || '0.9rem'};
    background-color: ${props => getTheme(props).colors.adminSurface || '#FFFFFF'};
    color: ${props => getTheme(props).colors.adminText || '#333333'};
    width: 100%;
    transition: all 0.2s ease-out;

    &:focus {
        outline: none;
        border-color: ${props => getTheme(props).colors.accent1 || '#007BFF'};
        box-shadow: 0 0 0 2px ${props => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.1)};
    }
`;

export const VariationActionsBar = styled.div`
    display: flex;
    justify-content: flex-start; /* Or center/flex-end based on preference */
    gap: ${(props) => getTheme(props).spacing(3)};
    padding: ${(props) => getTheme(props).spacing(3)} 0;
    margin-top: ${(props) => getTheme(props).spacing(2)};
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
`;


// --- Variations Table / List Section ---
export const VariationsListWrapper = styled.div`
    margin-top: ${(props) => getTheme(props).spacing(2)}; /* Space above the table if attributes were defined */
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(2)};
`;

// Reusing AdminTableWrapper and AdminTable from ProductList/AttributeList for consistency
// If specific styles are needed, define VariationsTable here
export const VariationsTable = styled.table`
    width: 100%;
    border-collapse: separate; /* Use separate for border-radius on cells with background */
    border-spacing: 0;
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.small || '0.875rem'}; /* Slightly smaller font for dense table */
    
    thead th {
        text-align: left;
        padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(2.5)};
        font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
        font-size: ${(props) => getTheme(props).typography.admin?.sizes?.xsmall || '0.75rem'};
        font-weight: ${(props) => getTheme(props).typography.admin?.weights?.bold || 700};
        color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
        border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder || '#E0E0E0'};
        position: sticky; /* Make headers sticky if table scrolls vertically */
        top: 0;
        z-index: 10;
    }

    tbody tr {
        border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#EEEEEE'};
        transition: background-color 0.1s ease-out;

        &:last-child { border-bottom: none; }
        /* &:hover { background-color: ${props => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.02)}; } */
    }

    tbody td {
        padding: ${(props) => getTheme(props).spacing(2)};
        vertical-align: middle; /* Changed from top to middle for better alignment with inputs */
        
        /* Style for inputs within table cells */
        input[type="text"], input[type="number"], select {
            width: 100%;
            padding: ${(props) => getTheme(props).spacing(1.5)} ${(props) => getTheme(props).spacing(2)};
            border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#DDD'};
            border-radius: 6px;
            font-size: inherit; /* Inherit from td */
            font-family: inherit;
            background-color: ${(props) => getTheme(props).colors.adminSurface || '#FFFFFF'};
            transition: border-color 0.2s, box-shadow 0.2s;

            &:focus {
                outline: none;
                border-color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
                box-shadow: 0 0 0 2px ${props => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.15)};
            }
             &:disabled {
                background-color: ${(props) => getTheme(props).colors.adminBorderLight || '#F0F0F0'};
                cursor: not-allowed;
            }
        }
        select {
            appearance: none; /* Custom dropdown arrow might be needed via Select component */
            cursor: pointer;
        }
    }
`;

export const VariationAttributeCell = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(0.5)};
    font-size: 0.85em;

    span {
        white-space: nowrap;
    }
`;

export const VariationImageColumn = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(2)};
    position: relative; /* For positioning delete icon over image */

    .image-preview-wrapper {
        position: relative;
        width: 48px; /* Slightly larger preview */
        height: 48px;
    }

    img.variation-preview-image {
        width: 48px;
        height: 48px;
        object-fit: cover;
        border-radius: 6px;
        border: 1px solid ${(props) => getTheme(props).colors.adminBorderLight || '#DDD'};
        cursor: pointer; /* Indicate it can be clicked to change */
        transition: opacity 0.2s;
        &:hover { opacity: 0.8; }
    }

    .delete-var-image-btn {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: ${(props) => getTheme(props).colors.adminStatusError || '#dc3545'};
        color: white;
        border: none;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 0.7em;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0; /* Hidden by default */
        transition: opacity 0.2s;
        z-index: 1;
    }

    .image-preview-wrapper:hover .delete-var-image-btn {
        opacity: 1;
    }
    
    input[type="file"].variation-image-input {
        display: none; /* Hide actual input */
    }

    .image-upload-trigger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border: 1px dashed ${(props) => getTheme(props).colors.adminBorder || '#CCC'};
        border-radius: 6px;
        color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
        background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
        cursor: pointer;
        transition: all 0.2s ease-out;
        svg { font-size: 1.3em; }
        &:hover {
            border-color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
            color: ${(props) => getTheme(props).colors.accent1 || '#007BFF'};
            background-color: ${(props) => rgba(getTheme(props).colors.accent1 || '#007BFF', 0.05)};
        }
    }
`;

export const DeleteVariationButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => getTheme(props).colors.adminStatusError || '#dc3545'};
    cursor: pointer;
    font-size: 1.1em;
    padding: ${(props) => getTheme(props).spacing(1)};
    border-radius: 50%;
    line-height: 1;
    transition: all 0.2s ease-out;
    &:hover {
        color: ${props => darken(0.1, getTheme(props).colors.adminStatusError || '#dc3545')};
        background-color: ${props => rgba(getTheme(props).colors.adminStatusError || '#dc3545', 0.1)};
    }
`;

export const NoVariationsMessage = styled.div`
    /* Same as other No...Message components, can be common */
    font-family: ${(props) => getTheme(props).typography.admin?.fontFamily || 'sans-serif'};
    font-size: ${(props) => getTheme(props).typography.admin?.sizes?.bodyBase || '0.95rem'};
    color: ${(props) => getTheme(props).colors.adminTextSecondary || '#6c757d'};
    text-align: center;
    padding: ${(props) => getTheme(props).spacing(6)} ${(props) => getTheme(props).spacing(3)};
    border: 1px dashed ${(props) => getTheme(props).colors.adminBorderLight || '#EEE'};
    border-radius: 8px;
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg || '#F8F9FA'};
    margin-top: ${(props) => getTheme(props).spacing(3)};
`;
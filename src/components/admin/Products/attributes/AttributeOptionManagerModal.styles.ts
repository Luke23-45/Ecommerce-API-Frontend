// src/components/Admin/Attributes/Options/AttributeOptionManagerModal.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;



export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${rgba('black', 0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050; // Higher than attribute form's sticky bar if it's a page
`;

export const ManagerModalContent = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: ${(props) => getTheme(props).spacing(5)};
    width: 90%;
    max-width: 700px; /* Wider for table of options */
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(4)};
`;

export const ManagerModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: ${(props) => getTheme(props).spacing(3)};
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder};

    h3 { /* Changed from h2 to h3 for semantic hierarchy if this modal is "inside" another view */
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.modalTitle}; /* New theme size */
        font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
        color: ${(props) => getTheme(props).colors.adminText};
        
        span { /* For the attribute name */
            color: ${props => getTheme(props).colors.accent1};
            font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
        }
    }

    > button { /* Close button */
        background: none;
        border: none;
        font-size: 1.2rem; /* Larger close icon */
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        cursor: pointer;
        padding: ${(props) => getTheme(props).spacing(1)};
        line-height: 1;
        &:hover { color: ${(props) => getTheme(props).colors.adminStatusError}; }
    }
`;

export const OptionsListContainer = styled.div`
    flex-grow: 1;
    overflow-y: auto; /* Scroll for options list if it exceeds modal height */
    min-height: 200px; /* Ensure some space for the list/empty message */
    padding-right: ${(props) => getTheme(props).spacing(1)}; // Space for scrollbar

    /* Scrollbar customization (reusable from other lists) */
    scrollbar-width: thin;
    scrollbar-color: ${(props) => getTheme(props).colors.adminBorder} transparent;

    &::-webkit-scrollbar { width: 6px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
        background-color: ${(props) => getTheme(props).colors.adminBorder};
        border-radius: 10px;
        &:hover { background-color: ${(props) => darken(0.1, getTheme(props).colors.adminBorder)}; }
    }
`;



export const NoOptionsMessage = styled.div`
    /* Similar to NoAttributesMessage */
    text-align: center;
    padding: ${(props) => getTheme(props).spacing(8)} ${(props) => getTheme(props).spacing(4)};
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    border: 1px dashed ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};
    
    svg {
        font-size: 2em;
        margin-bottom: ${(props) => getTheme(props).spacing(2)};
        color: ${(props) => getTheme(props).colors.adminBorder};
    }
`;

export const ManagerModalActions = styled.div`
    /* Similar to CategoryEditModal ModalActions */
    display: flex;
    justify-content: flex-end; /* Or space-between if "Add New Option" is here */
    padding-top: ${(props) => getTheme(props).spacing(3)};
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    gap: ${(props) => getTheme(props).spacing(2)};
`;

export const OptionSearchInput = styled.input`
    /* Same as AttributeSearchInput or ProductSearchInput */
    padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(3)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 6px;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodySmall}; /* Slightly smaller for modal context */
    background-color: ${props => props.theme.colors.adminSecondaryBg};
    color: ${props => props.theme.colors.adminText};
    width: 100%; /* Full width within its container in the modal */
    margin-bottom: ${(props) => getTheme(props).spacing(3)};
    transition: all 0.2s ease-out;

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 2px ${props => rgba(props.theme.colors.accent1, 0.15)};
    }
    &::placeholder {
        color: ${props => props.theme.colors.adminTextSecondary};
    }
`;

// Styles for individual option items if not using a full table:
export const OptionItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(2)};
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorderLight}; /* Lighter border */
    &:last-child {
        border-bottom: none;
    }
    &:hover {
        background-color: ${(props) => rgba(getTheme(props).colors.accent1, 0.03)};
    }
`;

export const OptionInfo = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(2)};
`;

export const OptionValue = styled.span`
    font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
`;

export const OptionDisplayName = styled.span`
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
`;

export const SwatchPreview = styled.div<{ $color?: string; $imageUrl?: string }>`
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 1px solid ${props => getTheme(props).colors.adminBorder};
    background-color: ${props => props.$color || 'transparent'};
    background-image: ${props => props.$imageUrl ? `url(${props.$imageUrl})` : 'none'};
    background-size: cover;
    background-position: center;
    display: inline-block;
`;


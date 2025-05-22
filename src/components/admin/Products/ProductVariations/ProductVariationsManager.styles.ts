// src/components/Admin/Products/ProductVariations/ProductVariationsManager.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const slideDown = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
`;

export const ManagerContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

// --- Attribute Management Section ---
export const AttributeControls = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${(props) => getTheme(props).spacing(4)};
    border: 1px dashed ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    margin-bottom: ${(props) => getTheme(props).spacing(6)};
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};

    h4 {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
        font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
        color: ${(props) => getTheme(props).colors.adminText};
        margin-bottom: ${(props) => getTheme(props).spacing(3)};
    }
`;

export const AttributeList = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => getTheme(props).spacing(2)};
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
`;

export const AttributeTag = styled.div`
    background-color: ${(props) => rgba(getTheme(props).colors.accent2, 0.15)};
    color: ${(props) => getTheme(props).colors.accent2};
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
    padding: 6px 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(1)};

    button {
        background: none;
        border: none;
        color: inherit;
        font-size: 0.8em;
        cursor: pointer;
        opacity: 0.8;
        &:hover { opacity: 1; }
    }
`;

export const NewAttributeInput = styled.div`
    display: flex;
    gap: ${(props) => getTheme(props).spacing(2)};
    align-items: center;
    margin-bottom: ${(props) => getTheme(props).spacing(3)};

    input {
        flex: 1;
    }
`;

export const AttributeButton = styled.button`
    background-color: ${(props) => getTheme(props).colors.accent2};
    color: ${(props) => getTheme(props).colors.textLight};
    padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(4)};
    border-radius: 8px;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.small};
    cursor: pointer;
    transition: all 0.2s ease-out;

    &:hover {
        background-color: ${props => darken(0.1, getTheme(props).colors.accent2)};
    }
`;

// --- Variation Table / List ---
export const VariationsTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: ${(props) => getTheme(props).spacing(4)};

    thead th {
        text-align: left;
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(2)};
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.label};
        font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    }

    tbody tr {
        border-bottom: 1px dashed ${(props) => getTheme(props).colors.adminBorder};
        transition: background-color 0.1s ease-out;

        &:last-child { border-bottom: none; }
        &:hover { background-color: ${props => rgba(getTheme(props).colors.accent1, 0.02)}; } /* Very subtle hover */
    }

    tbody td {
        padding: ${(props) => getTheme(props).spacing(2)} ${(props) => getTheme(props).spacing(2)};
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
        color: ${(props) => getTheme(props).colors.adminText};
        vertical-align: middle;

        input[type="text"], input[type="number"] {
            width: 100%;
            padding: 5px 8px;
            border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
            border-radius: 4px;
            font-size: inherit;
            font-family: inherit;
            background-color: ${(props) => getTheme(props).colors.adminSurface};
            &:focus {
                outline: none;
                border-color: ${(props) => getTheme(props).colors.accent1};
                box-shadow: 0 0 0 2px ${props => rgba(getTheme(props).colors.accent1, 0.1)};
            }
        }
    }
`;

export const VariationImageColumn = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(2)};
    img {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 4px;
        border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    }
    input[type="file"] {
        display: none; /* Hide actual input */
    }
    .image-upload-trigger { /* A clickable element for file input */
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        border-radius: 4px;
        width: 40px; /* Make it square like image preview */
        height: 40px;
        cursor: pointer;
        transition: all 0.2s ease-out;
        &:hover {
            background-color: ${(props) => getTheme(props).colors.accent2};
            color: ${(props) => getTheme(props).colors.textLight};
        }
        svg { font-size: 1.1em; }
    }
`;

export const DeleteVariationButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => getTheme(props).colors.adminStatusError};
    cursor: pointer;
    font-size: 1.1em;
    padding: 0;
    transition: color 0.2s ease-out;
    &:hover { color: ${props => darken(0.1, getTheme(props).colors.adminStatusError)}; }
`;

export const NoVariationsMessage = styled.p`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    text-align: center;
    padding: ${(props) => getTheme(props).spacing(6)};
    border: 1px dashed ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};
`;
// src/components/Admin/Common/ImageUploader/ImageUploader.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { rgba, darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const ImageUploaderContainer = styled.div`
    border: 2px dashed ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    padding: ${(props) => getTheme(props).spacing(6)};
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-out;
    background-color: ${(props) => getTheme(props).colors.adminSecondaryBg};

    &:hover {
        background-color: ${props => rgba(getTheme(props).colors.accent1, 0.05)};
        border-color: ${(props) => getTheme(props).colors.accent1};
    }
`;

export const UploadInput = styled.input`
    display: none; /* Hide native file input */
`;

export const UploadText = styled.p`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    margin-top: ${(props) => getTheme(props).spacing(2)};
    svg {
        margin-right: ${(props) => getTheme(props).spacing(1)};
        color: ${(props) => getTheme(props).colors.accent1};
        font-size: 1.2em;
    }
`;

export const ImagePreviewGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: ${(props) => getTheme(props).spacing(3)};
    margin-top: ${(props) => getTheme(props).spacing(6)};
`;

export const ImagePreview = styled.div`
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* Delete button */
    button {
        position: absolute;
        top: ${(props) => getTheme(props).spacing(1)};
        right: ${(props) => getTheme(props).spacing(1)};
        background-color: ${rgba('black', 0.6)};
        color: white;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0; /* Hidden by default */
        transition: opacity 0.2s ease-out;

        &:hover & {
            opacity: 1; /* Show on hover */
        }

        &:hover {
            background-color: ${darken(0.1, rgba('black', 0.6))};
        }
    }
`;
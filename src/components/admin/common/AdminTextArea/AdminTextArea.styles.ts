// src/components/Admin/Common/AdminTextArea/AdminTextArea.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const StyledTextArea = styled.textarea`
    width: 100%;
    min-height: 120px; /* Default height */
    padding: ${(props) => getTheme(props).spacing(3)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    color: ${(props) => getTheme(props).colors.adminText};
    background-color: ${props => props.theme.colors.adminSurface};
    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
    resize: vertical; /* Allow only vertical resizing */

    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 3px ${props => rgba(props.theme.colors.accent1, 0.2)};
    }

    &::placeholder {
        color: ${props => props.theme.colors.adminTextSecondary};
    }

    &:disabled {
        background-color: ${props => props.theme.colors.adminSecondaryBg};
        cursor: not-allowed;
    }
`;
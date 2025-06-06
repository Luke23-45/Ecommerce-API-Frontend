import styled, { type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const ColorPickerWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => getTheme(props).spacing(2)};
    padding: ${(props) => getTheme(props).spacing(1.5)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    background-color: ${props => props.theme.colors.adminSecondaryBg};
    width: fit-content; /* Adjust as needed, or make it full width */

    &:focus-within {
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 2px ${props => rgba(props.theme.colors.accent1, 0.15)};
    }
`;

export const NativeColorInput = styled.input.attrs({ type: 'color' })`
    -webkit-appearance: none; /* Removes default chrome styling */
    -moz-appearance: none;
    appearance: none;
    width: 36px; /* Size of the color swatch */
    height: 36px;
    border: none;
    padding: 0;
    border-radius: 6px; /* Slightly rounded swatch */
    cursor: pointer;
    background-color: transparent; /* Important for some browsers */
    outline: none;

    /* Styling the color picker "button" (the swatch itself) */
    &::-webkit-color-swatch-wrapper {
        padding: 0;
        border-radius: 6px;
    }
    &::-webkit-color-swatch {
        border: 1px solid ${props => getTheme(props).colors.adminBorder};
        border-radius: 6px;
    }

    /* Firefox */
    &::-moz-color-swatch {
        border: 1px solid ${props => getTheme(props).colors.adminBorder};
        border-radius: 6px;
    }
    
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const HexInput = styled.input.attrs({ type: 'text' })`
    /* Using AdminInput styles as a base or similar */
    padding: ${(props) => getTheme(props).spacing(1.5)} ${(props) => getTheme(props).spacing(2)};
    border: none; /* Removed border as wrapper has it */
    border-radius: 4px;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.dataCell};
    background-color: transparent; /* Match wrapper or be slightly different */
    color: ${props => props.theme.colors.adminText};
    width: 100px; /* Adjust width as needed */
    outline: none;

    &:disabled {
        background-color: ${props => getTheme(props).colors.adminBorder};
        color: ${props => getTheme(props).colors.adminTextSecondary};
    }
`;
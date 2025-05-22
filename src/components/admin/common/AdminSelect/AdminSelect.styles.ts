// src/components/Admin/Common/AdminSelect/AdminSelect.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

export const StyledSelect = styled.select`
    width: 100%;
    padding: ${(props) => getTheme(props).spacing(2.5)} ${(props) => getTheme(props).spacing(4)};
    border: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    color: ${(props) => getTheme(props).colors.adminText};
    background-color: ${props => props.theme.colors.adminSurface};
    appearance: none; /* Remove default arrow */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M7.293%204.293a1%201%200%20011.414%200L11%206.586V10a1%201%200%2001-2%200V7.414L5.293%209.707a1%201%200%2001-1.414-1.414L6.586%206%203.879%203.293a1%201%200%20011.414-1.414L8%204.586V2a1%201%200%20012%200v3.414l2.707%202.707a1%201%200%20010%201.414z%22%20transform%3D%22rotate(90%206%206)%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E"); /* Custom SVG arrow */
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 12px;
    cursor: pointer;
    outline: none;
    transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;

    &:focus {
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 3px ${props => rgba(props.theme.colors.accent1, 0.2)};
    }

    &:disabled {
        background-color: ${props => props.theme.colors.adminSecondaryBg};
        cursor: not-allowed;
    }
`;
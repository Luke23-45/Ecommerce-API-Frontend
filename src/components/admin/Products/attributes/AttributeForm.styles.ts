
import styled, {css, type DefaultTheme, keyframes } from 'styled-components';
import { rgba,darken } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const AttributeFormContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(6)};
    
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.1s;
`;

export const FormHeader = styled.div`
   
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(6)};
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(4)};
        border-radius: 0;
        box-shadow: none;
    }
`;

export const FormTitle = styled.h2`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
    color: ${(props) => getTheme(props).colors.adminText};
`;

export const AttributeActualForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(6)};
    
   
   
   

    margin-bottom: 120px;
`;











export const FormStickyActionBar = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: auto;
    margin-left:
        ${(props) => (props.theme.sidebar?.isCollapsed ? '80px' : '260px')};
    
    background-color: ${(props) => rgba(getTheme(props).colors.adminPrimaryBg, 0.95)};
    backdrop-filter: blur(8px);
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    padding: ${(props) => getTheme(props).spacing(3)} ${(props) => getTheme(props).spacing(6)};
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.05);
    z-index: 100;
    display: flex;
    justify-content: flex-end;
    gap: ${(props) => getTheme(props).spacing(3)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column;
        gap: ${(props) => getTheme(props).spacing(2)};
        padding: ${(props) => getTheme(props).spacing(2.5)};
        margin-left: 0;
    }
`;

export const FormAlert = styled.div<{ $type: 'error' | 'success' | 'info' }>`
    padding: ${(props) => getTheme(props).spacing(3)};
    border-radius: 8px;
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    border: 1px solid transparent;

    ${(props) => props.$type === 'error' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusError, 0.1)};
        border-color: ${getTheme(props).colors.adminStatusError};
        color: ${darken(0.1, getTheme(props).colors.adminStatusError)};
    `}
    ${(props) => props.$type === 'success' && css`
        background-color: ${rgba(getTheme(props).colors.adminStatusSuccess, 0.1)};
        border-color: ${getTheme(props).colors.adminStatusSuccess};
        color: ${darken(0.1, getTheme(props).colors.adminStatusSuccess)};
    `}
     ${(props) => props.$type === 'info' && css`
        background-color: ${rgba(getTheme(props).colors.accent1, 0.1)};
        border-color: ${getTheme(props).colors.accent1};
        color: ${darken(0.1, getTheme(props).colors.accent1)};
    `}
`;
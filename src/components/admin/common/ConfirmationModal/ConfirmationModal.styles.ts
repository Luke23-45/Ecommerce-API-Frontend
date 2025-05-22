// src/components/Admin/Common/ConfirmationModal/ConfirmationModal.styles.ts
import styled, { type DefaultTheme, css } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// Reusing general modal overlay and content styles from CategoryEditModal
// Ideally, these would be in a truly shared/common 'Modal' folder.
export const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${rgba('black', 0.4)}; /* Dark transparent overlay */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001; /* Higher than BannerEditModal's 1000 */
`;

export const ModalContent = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    padding: ${(props) => getTheme(props).spacing(6)};
    width: 90%;
    max-width: 450px; /* Slightly narrower for confirmation */
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(4)};
`;

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    padding-bottom: ${(props) => getTheme(props).spacing(3)};

    h2 {
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.sectionTitle};
        font-weight: ${(props) => getTheme(props).typography.admin.weights.bold};
        color: ${(props) => getTheme(props).colors.adminText};
    }

    button {
        background: none;
        border: none;
        font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        cursor: pointer;
        &:hover { color: ${(props) => getTheme(props).colors.adminStatusError}; }
    }
`;

export const ModalBody = styled.div`
    font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
    font-size: ${(props) => getTheme(props).typography.admin.sizes.bodyBase};
    color: ${(props) => getTheme(props).colors.adminTextSecondary};
    line-height: 1.6;
    margin-bottom: ${(props) => getTheme(props).spacing(6)};
`;

export const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: ${(props) => getTheme(props).spacing(2)};
    margin-top: ${(props) => getTheme(props).spacing(4)};
`;
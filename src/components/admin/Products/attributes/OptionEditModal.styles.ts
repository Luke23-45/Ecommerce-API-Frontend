// src/components/Admin/Attributes/Options/OptionEditModal.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

// Using common modal styles. If not using common ones, define here:
// export const ModalOverlay = styled.div`...`; (as in AttributeOptionManagerModal.styles.ts but with z-index +1)
export const OptionModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: ${rgba('black', 0.3)}; /* Slightly lighter if nested */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1100; /* Higher than Manager Modal */
`;


export const OptionModalContent = styled.div`
    background-color: ${(props) => getTheme(props).colors.adminSurface};
    border-radius: 10px; /* Slightly smaller radius */
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    padding: ${(props) => getTheme(props).spacing(5)};
    width: 90%;
    max-width: 450px; /* Smaller max-width for option form */
    display: flex;
    flex-direction: column;
`;

export const OptionModalHeader = styled.div`
    /* Similar to ManagerModalHeader or CategoryEditModal ModalHeader */
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => getTheme(props).spacing(3)};
    padding-bottom: ${(props) => getTheme(props).spacing(2.5)};
    border-bottom: 1px solid ${(props) => getTheme(props).colors.adminBorderLight};

    h4 { /* Using h4 for sub-modal */
        font-family: ${(props) => getTheme(props).typography.admin.fontFamily};
        font-size: ${(props) => getTheme(props).typography.admin.sizes.h5}; /* Smaller title */
        font-weight: ${(props) => getTheme(props).typography.admin.weights.semiBold};
        color: ${(props) => getTheme(props).colors.adminText};
    }

    > button { /* Close button */
        background: none;
        border: none;
        font-size: 1rem;
        color: ${(props) => getTheme(props).colors.adminTextSecondary};
        cursor: pointer;
        padding: ${(props) => getTheme(props).spacing(0.5)};
        &:hover { color: ${(props) => getTheme(props).colors.adminStatusError}; }
    }
`;

export const OptionModalForm = styled.form`
    /* Similar to CategoryEditModal ModalForm */
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(3.5)};
    margin-bottom: ${(props) => getTheme(props).spacing(4)};
`;

// Re-use FieldGroup, FormLabel from common form styles

export const OptionModalActions = styled.div`
    /* Similar to CategoryEditModal ModalActions */
    display: flex;
    justify-content: flex-end;
    gap: ${(props) => getTheme(props).spacing(2)};
`;
// src/components/Admin/Products/ProductDetail.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba } from 'polished';

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ProductDetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    /* No explicit background-color here, rely on FormSectionWrapper for cards */
    padding: ${(props) => getTheme(props).spacing(0)}; /* Padding handled by internal sections */
    
    /* Animation for the whole detail page panel entry */
    opacity: 0;
    animation: ${fadeIn} 0.6s ease-out forwards;
    animation-delay: 0.2s;

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        padding: ${(props) => getTheme(props).spacing(0)};
    }
`;

export const ProductDetailForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => getTheme(props).spacing(8)}; /* Space between form sections */
    margin-bottom: ${(props) => getTheme(props).spacing(10)}; /* Space before floating action bar */
`;

export const StickyActionBar = styled.div`
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: ${(props) => rgba(getTheme(props).colors.adminPrimaryBg, 0.95)}; /* Frosted effect matching header */
    backdrop-filter: blur(8px);
    border-top: 1px solid ${(props) => getTheme(props).colors.adminBorder};
    padding: ${(props) => getTheme(props).spacing(4)} ${(props) => getTheme(props).spacing(6)};
    box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.03); /* Soft shadow on top */
    z-index: 50; /* Above regular content but below modals */
    display: flex;
    justify-content: flex-end; /* Align buttons to the right */
    gap: ${(props) => getTheme(props).spacing(3)};

    @media (max-width: ${(props) => getTheme(props).breakpoints.tablet}) {
        flex-direction: column; /* Stack buttons on mobile */
        gap: ${(props) => getTheme(props).spacing(2)};
        padding: ${(props) => getTheme(props).spacing(3)};
    }
`;
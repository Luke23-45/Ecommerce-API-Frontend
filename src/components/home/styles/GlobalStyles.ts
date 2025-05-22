// src/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';
import { theme } from './Theme';
const GlobalStyles = createGlobalStyle`
    /* Font Imports from Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&family=Inter:wght@400;500;600&display=swap');

    *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        scroll-behavior: smooth;
    }

    body {
        font-family: ${theme.typography.body.fontFamily};
        line-height: 1.6;
        color: ${theme.colors.textDark};
        background-color: ${theme.colors.primaryNeutral};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden; /* Prevent horizontal scroll from minor layout shifts */
    }

    a {
        text-decoration: none;
        color: inherit;
        transition: color 0.2s ease-in-out, text-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
    }

    button {
        border: none;
        background: transparent;
        cursor: pointer;
        font-family: ${theme.typography.body.fontFamily};
        padding: 0;
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    ul, ol {
        list-style: none;
    }

    img {
        max-width: 100%;
        display: block;
        height: auto;
    }

    /* General containers for consistent padding */
    .content-max-width {
        max-width: ${theme.maxWidth};
        margin-left: auto;
        margin-right: auto;
        padding-left: ${theme.containerPadding};
        padding-right: ${theme.containerPadding};
    }
`;

export default GlobalStyles;
// src/theme.ts
import { type DefaultTheme } from 'styled-components'; // Correct type import

export const theme = { // Removed ': any' to let TypeScript infer and catch structure mismatches
    colors: {
        primaryNeutral: '#F8F8F0', // Existing frontend base
        accent1: '#A46E4A',      // Élan's Terracotta (for actions, active states)
        accent2: '#9EB78A',      // Élan's Sage Green (for secondary actions/accents)
        textDark: '#333333',     // Élan's Rich deep charcoal (main text)
        textLight: '#FFFFFF',    // Pure white
        lightGray: '#E0E0DB',    // Light stone gray (borders, muted separators)
        darkGray: '#666666',     // Medium gray (secondary text, muted elements)

        // Admin Specific Colors - ADDED THESE HERE
        adminPrimaryBg: '#FDFDFB', // Admin main background (very subtle warm off-white)
        adminSecondaryBg: '#F0F0EE', // Admin sidebar/alternate background (subtle light gray)
        adminSurface: '#FFFFFF', // Admin card/panel/input background (pure white)
        adminBorder: '#E0E0DB', // Admin border/separator color (Élan's light gray)
        adminText: '#333333', // Admin primary text (Élan's deep charcoal)
        adminTextSecondary: '#666666', // Admin secondary text (Élan's dark gray)

        // Admin Status Colors - ADDED THESE HERE
        adminStatusSuccess: '#4CAF50', // Green for success
        adminStatusError: '#F44336', // Red for error
        adminStatusWarning: '#FFC107', // Amber for warning

        // Gradients (from previous usage in buttons, if any) - ADDED THESE HERE
        gradients: {
            accent1Vibrant: 'linear-gradient(45deg, #A46E4A 0%, #C07F56 100%)', // Terracotta gradient
            accent2Vibrant: 'linear-gradient(45deg, #9EB78A 0%, #B8D69A 100%)', // Sage green gradient
        }
    },
    // The 'components' property is valid but was not in the `DefaultTheme` interface.
    // If you plan to use it, you'll need to add it to the interface as well.
    // For now, removing it if not used by any component (it's often unused once CSS uses dynamic props.theme.spacing etc)
    /*
    components: {
        grandMarquee: {
            height: '80px',
        },
        spotlightBanner: {
            height: '32px',
        },
    },
    */
    typography: {
        heading: { // Frontend headings (Playfair Display)
            fontFamily: "'Playfair Display', serif",
            sizes: {
                h1: 'clamp(3rem, 6vw, 5.5rem)',
                h2: 'clamp(2rem, 4vw, 3.5rem)',
                h3: 'clamp(1.5rem, 3vw, 2.5rem)',
            },
            weights: {
                regular: 400,
                bold: 700,
                extraBold: 800,
            },
        },
        body: { // Frontend body text (Inter)
            fontFamily: "'Inter', sans-serif",
            sizes: {
                large: '1.25rem',
                medium: '1.125rem',
                base: '1rem',
                small: '0.875rem',
                xsmall: '0.75rem',
            },
            weights: {
                regular: 400,
                medium: 500,
                semiBold: 600,
            },
        },
        // ADMIN SPECIFIC TYPOGRAPHY - MOVED INSIDE 'typography' object
        admin: {
            fontFamily: "'Inter', sans-serif",
            sizes: {
                moduleTitle: '1.8rem',
                sectionTitle: '1.25rem',
                bodyBase: '1rem',
                dataCell: '0.95rem',
                label: '0.875rem',
                small: '0.75rem',
                xsmall: '0.625rem',
            },
            weights: {
                regular: 400,
                medium: 500,
                semiBold: 600,
                bold: 700,
            },
        },
    },

    breakpoints: {
        mobileS: '320px', mobileM: '375px', mobileL: '425px',
        tablet: '768px', laptop: '1024px', laptopL: '1440px', desktop: '2560px',
    },

    spacing: (value: number) => `${value * 0.25}rem`,
    maxWidth: '1600px',
    containerPadding: 'clamp(1rem, 4vw, 4rem)',
};

// Ensure `DefaultTheme` interface matches the `theme` object structure
declare module 'styled-components' {
    export interface DefaultTheme {
        colors: {
            primaryNeutral: string; accent1: string; accent2: string; textDark: string; textLight: string;
            lightGray: string; darkGray: string;
            adminPrimaryBg: string; adminSecondaryBg: string; adminSurface: string;
            adminBorder: string; adminText: string; adminTextSecondary: string;
            adminStatusSuccess: string; adminStatusError: string; adminStatusWarning: string;
            gradients?: { [key: string]: string };
        };
        // If 'components' was used, add it here:
        // components?: { // Made optional just in case it wasn't fully defined previously
        //     grandMarquee: { height: string; };
        //     spotlightBanner: { height: string; };
        // };
        typography: {
            heading: { fontFamily: string; sizes: { [key: string]: string }; weights: { [key: string]: number }; };
            body: { fontFamily: string; sizes: { [key: string]: string }; weights: { [key: string]: number }; };
            admin: { fontFamily: string; sizes: { [key: string]: string }; weights: { [key: string]: number }; }; // <-- HERE IS THE 'admin' IN THE INTERFACE
        };
        breakpoints: { [key: string]: string };
        spacing: (value: number) => string;
        maxWidth: string;
        containerPadding: string;
    }
}
// src/pages/AuthPage/AuthPage.styles.ts
import styled, { css, type DefaultTheme, keyframes } from "styled-components";
import { rgba, lighten, darken } from "polished";
import { Link as RouterDomLink } from "react-router-dom";

// --- Consolidated Keyframes ---
const subtleBgAnimate = keyframes` // For general background animations if needed elsewhere
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
`;

const contentEnter = keyframes` // General content entrance
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Keyframes specific to the VisualColumn's new design
const gradientMeshAnimation = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 100% 50%; }
  50% { background-position: 50% 0%; }
  75% { background-position: 50% 100%; }
  100% { background-position: 0% 50%; }
`;

const contentTextEnter = keyframes` // For text within VisualContent
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const logoEnter = keyframes` // For logo within VisualContent
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

// --- Main Page Structure ---
export const AuthPageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    color: ${(props) => props.theme.colors.textDark};
    background-color: ${(props) => props.theme.colors.primaryNeutral};
    overflow: hidden; /* Prevent scrollbars from animations */
`;

// --- Stunning Left Visual Column (NEW DESIGN) ---

// --- Refined Left Visual Column with Curated Gradient Colors ---
export const VisualColumn = styled.aside`
    flex: 0 0 45%; 
    max-width: 42vw; 
    min-width: 400px; 
    position: relative;
    display: grid; 
    place-items: center;
    padding: ${(props) => props.theme.spacing(8)} ${(props) => props.theme.spacing(6)};
    color: ${(props) => props.theme.colors.textLight}; // Text on this column will be light
    text-align: center;
    overflow: hidden;

    /* --- Curated Gradient Mesh Background --- */
    /* 
       We'll use specific hex codes for more control here, but ideally, 
       these could be derived from or added to your theme if you use them elsewhere.
       For now, direct hex codes allow for precise artistic choice.
    */
    --color-mesh-1: #D8BFB0; /* Soft, dusty rose/light terracotta */
    --color-mesh-2: #A8B0A2; /* Muted sage/olive green */
    --color-mesh-3: #F5F1ED; /* Warm off-white/cream (like primaryNeutral) */
    --color-mesh-4: #C0987C; /* A richer, warm terracotta/copper */
    --color-mesh-5: #6E6862; /* Softened charcoal/bronze for depth */
background: linear-gradient(315deg,
  rgba(215, 205, 195, 0.65), /* Warm Greige */
  rgba(190, 190, 180, 0.55), /* Soft Stone Grey */
  rgba(245, 240, 235, 0.25)  /* Creamy Off-White */
),
linear-gradient(45deg,
  rgba(190, 190, 180, 0.75), /* Soft Stone Grey */
  rgba(200, 175, 160, 0.5),  /* Muted Terracotta */
  rgba(245, 240, 235, 0.45)  /* Creamy Off-White */
),
linear-gradient(135deg,
  rgba(200, 175, 160, 0.6),  /* Muted Terracotta */
  rgba(215, 205, 195, 0.45), /* Warm Greige */
  rgba(105, 100, 95, 0.15)   /* Deep Earthy Brown (for subtle depth) */
);

            
    background-blend-mode: multiply; 
    background-size: 280% 280%, 220% 220%, 320% 320%;
    animation: ${gradientMeshAnimation} 35s ease-in-out infinite alternate; /* Slower, easing animation */

    /* Overlay for subtle vignetting and additional depth (optional) */
    &::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
background: ${(props) => `
  radial-gradient(
    ellipse at center,
    ${rgba(props.theme.colors.textLight, 0)} 0%,
    ${rgba(props.theme.colors.textDark, 0.03)} 70%,
    ${rgba(darken(0.1, '#6E6862'), 0.15)} 100%
  )
`};
        z-index: 1;
        pointer-events: none;
    }

    /* Subtle noise overlay for texture */
    &::after {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        opacity: 0.015; /* EXTREMELY subtle noise */
        pointer-events: none;
        z-index: 0; /* Behind the vignette, above the main gradient */
        mix-blend-mode: screen;
    }


    @media (max-width: 1024px) {
        display: none;
    }
`;
export const VisualContent = styled.div`
    position: relative; 
    z-index: 2; 
    max-width: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: auto;
    min-height: 60%;

    img.brand-logo {
        display: block; 
        width:clamp(100px, 15vw, 140px);
        height: auto;
        margin-bottom: ${(props) => props.theme.spacing(7)};
        /* Ensuring logo is light/white if background is darkish */
        filter: brightness(0) invert(1) drop-shadow(0 2px 5px rgba(0,0,0,0.3)); 
        opacity: 0;
        transform: scale(0.8);
        animation: ${logoEnter} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.5s forwards;
    }

    h1 { 
        font-family: ${(props) => props.theme.typography.heading.fontFamily};
        font-size: clamp(2rem, 3.8vw, 2.8rem);
        font-weight: ${(props) => props.theme.typography.heading.weights.bold};
        line-height: 1.25;
        letter-spacing: 0.01em;
        margin-bottom: ${(props) => props.theme.spacing(3)};
        color: ${(props) => props.theme.colors.textLight}; // Ensure light text
        text-shadow: 0 2px 3px rgba(0,0,0,0.25), 0 5px 15px rgba(0,0,0,0.3); // More defined shadow
        opacity: 0;
        animation: ${contentTextEnter} 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.7s forwards;
    }
    p.description { 
        font-family: ${(props) => props.theme.typography.body.fontFamily};
        font-size: clamp(0.95rem, 1.5vw, 1.1rem); 
        line-height: 1.7;
        color: ${(props) => lighten(0.15, props.theme.colors.textLight)}; // Slightly off-white for description
        opacity: 0.9; // Let it be slightly less opaque than H1
        margin-bottom: ${(props) => props.theme.spacing(5)};
        font-weight: ${(props) => props.theme.typography.body.weights.regular};
        max-width: 100%;
        text-shadow: 0 1px 2px rgba(0,0,0,0.2); // Subtle shadow for readability
        opacity: 0;
        animation: ${contentTextEnter} 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 0.9s forwards;
    }

    .footer-text { 
        font-family: ${(props) => props.theme.typography.body.fontFamily};
        font-size: 0.85rem;
        color: ${(props) => lighten(0.3, props.theme.colors.textLight)}; // Even lighter for footer
        opacity: 0.7; // Make it less prominent
        margin-top: ${(props) => props.theme.spacing(10)};
        animation: ${contentTextEnter} 0.9s cubic-bezier(0.2, 0.8, 0.2, 1) 1.1s forwards;
        opacity: 0;
    }
`;

// --- End of Stunning Left Visual Column ---


// --- Right Form Column / Content Wrapper (styles from your provided version) ---
export const AuthContentWrapper = styled.main` 
    flex: 1 1 auto; 
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${(props) => props.theme.spacing(6)}; 
    background-color: ${(props) => props.theme.colors.adminPrimaryBg};
    
    @media (max-width: 1024px) { // Matched breakpoint with VisualColumn
        padding: ${(props) => props.theme.spacing(4)};
        /* flex: 1 1 100%; // Implicitly full width when VisualColumn is hidden */
    }
`;
const contentFadeInSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
export const AuthFormContainer = styled.div`
    width: 100%;
    max-width: 450px; 
    padding: ${(props) => props.theme.spacing(7)}; 
    background-color: ${(props) => props.theme.colors.adminSurface};
    border-radius: 12px;
 box-shadow: ${(props) => 
    `0 10px 40px ${rgba(darken(0.2, props.theme.colors.primaryNeutral), 0.15)}`};    opacity: 0;
    animation: ${contentFadeInSlideUp} 0.7s ease-out 0.2s forwards;
    animation: ${contentEnter} 0.8s ease-out 0.2s forwards; // Using general contentEnter
    opacity: 0;
    
    @media (max-width: 600px) { 
        padding: ${(props) => props.theme.spacing(5)};
        box-shadow: none;
        border-radius: 0; 
        background-color: transparent;
    }
`;

export const AuthHeader = styled.div`
    margin-bottom: ${(props) => props.theme.spacing(6)};
    text-align: center;
    
    h1 {
        font-family: ${(props) => props.theme.typography.heading.fontFamily};
        font-size: clamp(1.8rem, 4vw, 2.3rem);
        font-weight: ${(props) => props.theme.typography.heading.weights.bold};
        color: ${props => props.theme.colors.textDark}; 
        line-height: 1.25;
        margin-bottom: ${(props) => props.theme.spacing(1.5)};
    }
    p { 
        font-family: ${(props) => props.theme.typography.body.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.base};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        line-height: 1.6;
    }
`;

// --- Form Element Styling (from your provided version) ---
export const AuthForm = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: ${(props) => props.theme.spacing(4.5)};
`;

export const AuthFormField = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(1.25)};
    text-align: left;
    position: relative;
`;

export const AuthFormLabel = styled.label`
    font-family: ${(props) => props.theme.typography.admin.fontFamily}; 
    font-size: ${(props) => props.theme.typography.admin.sizes.label};
    font-weight: ${(props) => props.theme.typography.admin.weights.medium};
    color: ${(props) => props.theme.colors.adminTextSecondary};
    cursor: pointer;
`;

export const AuthFormInput = styled.input`
    width: 100%;
    padding: ${(props) => props.theme.spacing(3)} ${(props) => props.theme.spacing(3.5)};
    border: 1px solid ${props => props.theme.colors.adminBorder};
    border-radius: 8px;
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    font-size: ${(props) => props.theme.typography.body.sizes.base};
    color: ${(props) => props.theme.colors.textDark};
    background-color: ${props => lighten(0.02, props.theme.colors.adminPrimaryBg)}; 
    transition: all 0.2s ease-out;
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 3px ${props => rgba(props.theme.colors.accent1, 0.2)};
        background-color: ${props => props.theme.colors.adminSurface};
    }

    &::placeholder {
        color: ${props => props.theme.colors.adminTextSecondary};
        opacity: 0.8;
    }
`;

export const AuthMessage = styled.p<{ $type?: 'success' | 'error' | 'info' }>`
    padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(3)};
    border-radius: 8px;
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    font-size: ${(props) => props.theme.typography.body.sizes.small};
    font-weight: ${(props) => props.theme.typography.body.weights.medium};
    text-align: center;
    line-height: 1.5;
    margin: ${(props) => props.theme.spacing(1)} 0 ${(props) => props.theme.spacing(3)} 0;
    
    ${(props) => props.$type === 'success' && css`
        background-color: ${rgba(props.theme.colors.adminStatusSuccess, 0.12)};
        color: ${darken(0.05, props.theme.colors.adminStatusSuccess)};
        border: 1px solid ${rgba(props.theme.colors.adminStatusSuccess, 0.3)};
    `}
    ${(props) => props.$type === 'error' && css`
        background-color: ${rgba(props.theme.colors.adminStatusError, 0.12)};
        color: ${darken(0.05, props.theme.colors.adminStatusError)};
        border: 1px solid ${rgba(props.theme.colors.adminStatusError, 0.3)};
    `}
     ${(props) => props.$type === 'info' && css`
        background-color: ${rgba(props.theme.colors.accent2, 0.12)}; /* Using accent2 for info */
        color: ${darken(0.05, props.theme.colors.accent2)};
        border: 1px solid ${rgba(props.theme.colors.accent2, 0.3)};
    `}
`;

export const AuthSubmitButton = styled.button`
    width: 100%;
    padding: ${(props) => props.theme.spacing(3.5)};
    margin-top: ${(props) => props.theme.spacing(2)};
    background: ${(props) => `linear-gradient(135deg, ${props.theme.colors.accent1 || props.theme.colors.accent1} 0%, ${props.theme.colors.accent1} 100%)`};
    color: ${(props) => props.theme.colors.textLight};
    border: none;
    border-radius: 8px;
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    font-size: ${(props) => props.theme.typography.body.sizes.base};
    font-weight: ${(props) => props.theme.typography.admin.weights.bold};
    text-transform: uppercase;
    letter-spacing: 0.75px;
    cursor: pointer;
    transition: all 0.25s ease-out;
    box-shadow: 0 4px 12px ${props => rgba(props.theme.colors.accent1, 0.3)};

    &:hover:not(:disabled) {
        background: ${(props) => `linear-gradient(135deg, ${darken(0.05, props.theme.colors.accent1 || props.theme.colors.accent1)} 0%, ${darken(0.05, props.theme.colors.accent1)} 100%)`};
        box-shadow: 0 6px 15px ${props => rgba(props.theme.colors.accent1, 0.4)};
        transform: translateY(-2px);
    }
    &:active:not(:disabled) {
        transform: translateY(0px);
        box-shadow: 0 2px 8px ${props => rgba(props.theme.colors.accent1, 0.25)};
    }
    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
        transform: none;
        background: ${props => lighten(0.1, props.theme.colors.accent1)};
    }
`;

export const AuthSwitchLinkContainer = styled.div`
    margin-top: ${(props) => props.theme.spacing(5)};
    text-align: center;
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    font-size: ${(props) => props.theme.typography.body.sizes.base};
    color: ${(props) => props.theme.colors.adminTextSecondary};

    a { /* Targeting RouterDomLink from react-router-dom */
        color: ${(props) => props.theme.colors.accent1};
        font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
        text-decoration: none;
        margin-left: ${(props) => props.theme.spacing(1)};
        transition: color 0.2s ease-out;

        &:hover {
            text-decoration: underline;
            color: ${(props) => darken(0.1, props.theme.colors.accent1)};
        }
    }
`;

export const AuthSecondaryActions = styled.div`
    margin-top: ${(props) => props.theme.spacing(4)};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${(props) => props.theme.spacing(2.5)};
`;

export const AuthSecondaryLinkButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.colors.accent1};
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    font-size: ${(props) => props.theme.typography.body.sizes.base};
    font-weight: ${(props) => props.theme.typography.body.weights.medium};
    cursor: pointer;
    padding: ${(props) => props.theme.spacing(1)};
    text-decoration: none;
    transition: color 0.2s ease-out;

    &:hover {
        text-decoration: underline;
        color: ${(props) => darken(0.1, props.theme.colors.accent1)};
    }
    &:disabled {
        color: ${(props) => props.theme.colors.adminTextSecondary};
        opacity: 0.7;
        cursor: not-allowed;
        text-decoration: none;
    }
`;
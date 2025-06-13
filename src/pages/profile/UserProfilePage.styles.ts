// src/pages/UserProfilePage/UserProfilePage.styles.ts
import { ActionButton } from '@/components/seller/ViewSellerApplication.styles';
import styled, { css, keyframes, type DefaultTheme } from 'styled-components';
import { rgba, darken, lighten, transparentize } from 'polished';

// --- Keyframes (Make sure these are defined as you need them) ---
const fadeInGrow = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(15px) scale(0.99);
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
`;

const auroraBorealis = keyframes`
  0% { background-position: 0% 50%, 10% 40%, 20% 30%, 30% 20%; }
  25% { background-position: 5% 55%, 15% 45%, 25% 35%, 35% 25%; }
  50% { background-position: 10% 60%, 20% 50%, 30% 40%, 40% 30%; }
  75% { background-position: 5% 55%, 15% 45%, 25% 35%, 35% 25%; }
  100% { background-position: 0% 50%, 10% 40%, 20% 30%, 30% 20%; }
`;

const floatingParticles = keyframes`
  0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0; }
  20% { opacity: 0.6; }
  80% { opacity: 0.6; }
  100% { transform: translateY(-100vh) translateX(calc(var(--particle-tx, 0) * 1vw)) rotate(calc(var(--particle-r, 0) * 1deg)); opacity: 0; }
`;

const subtleTextReveal = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

// iconHoverGrow was defined but not used, keep if needed for future icon animations
// const iconHoverGrow = keyframes` /* ... */ `;

// --- Main Page Layout ---
export const UserProfilePageWrapper = styled.div`
  background-color: ${(props) => lighten(0.02, props.theme.colors.primaryNeutral)};
  min-height: calc(100vh - ${({ theme }) => (theme.dimensions as any)?.headerHeight || '90px'}); // Added 'as any' for optional dimension
  padding-bottom: ${(props) => props.theme.spacing(16)};
  font-family: ${(props) => props.theme.typography.body.fontFamily};
`;

export const UserProfilePageContainer = styled.div`
    width: 100%;
    max-width: 1150px;
    margin: 0 auto; 
    padding: 0 ${(props) => props.theme.containerPadding};
`;

// --- Hero Section ---
export const ProfileHeroSection = styled.section`
  height: 60vh; 
  min-height: 450px;
  max-height: 650px; 
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${(props) => props.theme.colors.textLight};
  padding: ${(props) => props.theme.spacing(6)} ${(props) => props.theme.containerPadding};
  overflow: hidden;
  background-color: #1a2e30; // Example dark base

  &::before { // Aurora Layer
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image:
      radial-gradient(ellipse at 70% 75%, ${props => transparentize(0.5, props.theme.colors.accent2Vibrant || props.theme.colors.accent2)} 0%, transparent 40%),
      radial-gradient(ellipse at 30% 25%, ${props => transparentize(0.4, props.theme.colors.accent1Vibrant || props.theme.colors.accent1)} 0%, transparent 35%),
      radial-gradient(ellipse at 55% 45%, ${props => transparentize(0.65, lighten(0.1, props.theme.colors.primaryNeutral))} 0%, transparent 50%);
    background-size: 200% 200%, 250% 250%, 220% 220%;
    animation: ${auroraBorealis} 45s ease-in-out infinite alternate;
    mix-blend-mode: screen;
    filter: blur(15px) brightness(0.9);
    opacity: 0.6; 
  }

  &::after { // Particle Layer
    content: '';
    position: absolute;
    top: 100%; left: 0; width: 1px; height: 1px;
    z-index: 2;
    pointer-events: none;
    --particle-color: ${(props) => transparentize(0.3, props.theme.colors.textLight)};
    box-shadow: 
        10vw -20vh 0 0px var(--particle-color), 30vw -70vh 0 1px var(--particle-color),
        55vw -40vh 0 0px var(--particle-color), 75vw -85vh 0 1px var(--particle-color),
        90vw -50vh 0 0px var(--particle-color);
    animation: ${floatingParticles} 40s linear infinite;
    animation-delay: -5s;
    --particle-tx: ${() => Math.random() * 10 - 5};
    --particle-r: ${() => Math.random() * 90 - 45};
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  max-width: 800px; 
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    font-family: '${(props) => props.theme.typography.heading.fontFamily}', serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: ${(props) => props.theme.typography.heading.weights.extraBold};
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: ${(props) => props.theme.spacing(4)};
    color: ${(props) => props.theme.colors.textLight};
    text-shadow: 0 2px 10px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4);
    animation: ${subtleTextReveal} 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
    opacity: 0;
  }

  p.subtitle {
    font-family: '${(props) => props.theme.typography.body.fontFamily}', sans-serif;
    font-size: clamp(1rem, 2vw, 1.3rem);
    line-height: 1.7;
    color: ${(props) => transparentize(0.05, props.theme.colors.textLight)};
    margin-bottom: ${(props) => props.theme.spacing(6)};
    font-weight: ${(props) => props.theme.typography.body.weights.regular};
    animation: ${subtleTextReveal} 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s forwards;
    opacity: 0;
    max-width: 650px;
  }
`;

export const QuickActionIcons = styled.div`
  display: flex;
  gap: ${(props) => props.theme.spacing(5)};
  justify-content: center;
  position: relative;
  z-index: 3;

  button {
    background: ${(props) => transparentize(0.85, props.theme.colors.textLight)};
    backdrop-filter: blur(4px);
    border: 1px solid ${(props) => transparentize(0.75, props.theme.colors.textLight)};
    color: ${(props) => props.theme.colors.textLight};
    border-radius: ${({ theme }) => theme.borderRadius.large};
    width: 100px; 
    height: 100px;
    display: flex;
    flex-direction: column; 
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing(1)};
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
    font-weight: ${({ theme }) => theme.typography.body.weights.medium};
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    animation: ${fadeInGrow} 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards;
    opacity:0;
    box-shadow: 0 3px 12px ${rgba(0, 0, 0, 0.15)};
    padding: ${({ theme }) => theme.spacing(2)};

    svg {
      font-size: 1.8rem;
      margin-bottom: 0; 
    }

    &:hover {
      background: ${(props) => transparentize(0.75, props.theme.colors.textLight)};
      border-color: ${(props) => transparentize(0.5, props.theme.colors.textLight)};
      transform: translateY(-4px) scale(1.03); 
      box-shadow: 0 6px 18px ${rgba(0, 0, 0, 0.2)};
    }
    
    &:active {
      transform: translateY(-1px) scale(0.99);
    }
  }
`;

// --- Main Content Sections Styling (Below Hero) ---
export const ProfileContentWrapper = styled.div`
    padding: ${(props) => props.theme.spacing(8)} 0;
    display: grid;
    grid-template-columns: 1fr; 
    gap: ${(props) => props.theme.spacing(8)};
`;

export const ContentSection = styled.section<{ $animationDelay?: string }>` // Added $animationDelay prop
    background-color: ${(props) => props.theme.colors.backgroundLight};
    border-radius: ${({ theme }) => theme.borderRadius.xlarge};
    padding: ${(props) => props.theme.spacing(5)} ${(props) => props.theme.spacing(6)};
    box-shadow: ${({ theme }) => theme.shadows.lg}; 
    animation: ${fadeInGrow} 0.7s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    opacity: 0;
    /* Apply animation delay via style prop in TSX */
    animation-delay: ${(props) => props.$animationDelay || '0s'};
`;

// --- IMPROVED SectionTitle ---
export const SectionTitle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline; // Align baseline of title and button
    margin-bottom: ${(props) => props.theme.spacing(6)}; // More space below title
    padding-bottom: ${(props) => props.theme.spacing(2)};
    
    /* Elegant bottom border that doesn't span full width, creating focus */
    position: relative; // For the pseudo-element border
    &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100px; // Short, focused underline
        height: 2px;
        background: linear-gradient(to right, 
            ${(props) => props.theme.colors.accent1}, 
            ${(props) => transparentize(0.5, props.theme.colors.accent1)}
        );
        border-radius: 1px;
    }
    
    h2 {
        font-family: ${(props) => props.theme.typography.heading.fontFamily}; // Playfair
        font-size: clamp(1.8rem, 4vw, 2.4rem); // Prominent section titles
        font-weight: ${(props) => props.theme.typography.heading.weights.bold};
        color: ${(props) => props.theme.colors.textDark};
        margin: 0;
        display: flex;
        align-items: center;
        gap: ${(props) => props.theme.spacing(2.5)};

        svg {
            color: ${(props) => props.theme.colors.accent1};
            font-size: 1em; // Icon size matches heading text
            opacity: 0.9;
        }
    }

    button.section-action-btn {
        font-family: ${(props) => props.theme.typography.body.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.small};
        font-weight: ${(props) => props.theme.typography.body.weights.semiBold}; // Bolder button text
        color: ${(props) => props.theme.colors.accent1};
        background-color: transparent;
        border: none; // Text-like button with icon
        padding: ${(props) => props.theme.spacing(1)} 0; // Minimal padding
        border-radius: ${({ theme }) => theme.borderRadius.medium};
        cursor: pointer;
        transition: color 0.2s ease-out, opacity 0.2s ease-out;
        display: flex;
        align-items: center;
        gap: ${(props) => props.theme.spacing(1)};
        
        &:hover {
            color: ${(props) => darken(0.1, props.theme.colors.accent1)};
            opacity: 0.85;
        }
    }
`;

// --- IMPROVED InfoDisplayItem & its Container ---
export const SectionContentGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    /* Increased gap for better separation of info "cards" */
    gap: ${({ theme }) => theme.spacing(5)}; 
`;

export const InfoDisplayItem = styled.div`
    background-color: ${({ theme }) => theme.colors.backgroundLight}; /* Clean white background for the card */
    padding: ${({ theme }) => theme.spacing(4)}; 
    border-radius: ${({ theme }) => theme.borderRadius.large}; /* Softer, larger Élan radius */
    /* Subtle, refined border */
    border: 1px solid ${({ theme }) => transparentize(0.85, theme.colors.darkGray)}; 
    box-shadow: ${({ theme }) => theme.shadows.sm}; /* Soft shadow for depth */
    transition: box-shadow 0.3s ease-out, transform 0.3s ease-out;

    &:hover {
        transform: translateY(-4px); /* Gentle lift on hover */
        box-shadow: ${({ theme }) => theme.shadows.md}; /* Slightly more pronounced shadow */
    }

    /* Label Styling: Clear distinction */
    p.label { 
        margin: 0 0 ${({ theme }) => theme.spacing(1.5)} 0; /* Increased space between label and value */
        font-family: ${({ theme }) => theme.typography.body.fontFamily}; /* Inter for labels */
        font-size: ${({ theme }) => theme.typography.body.sizes.xsmall}; /* xsmall or small for labels */
        font-weight: ${({ theme }) => theme.typography.body.weights.semiBold}; /* SemiBold for clarity */
        color: ${({ theme }) => theme.colors.textMedium}; /* Softer color for labels (darkGray or textMedium) */
        text-transform: uppercase; 
        letter-spacing: 0.8px; /* Refined spacing */
        opacity: 0.9;
    }

    /* Value Styling: Make the actual information prominent */
    .value { /* Using a class for both span and div */
        display: block;
        font-family: ${({ theme }) => theme.typography.body.fontFamily}; /* Inter for values */
        font-size: ${({ theme }) => theme.typography.body.sizes.base_large || theme.typography.body.sizes.base}; /* Base or slightly larger for values */
        font-weight: ${({ theme }) => theme.typography.body.weights.regular};
        color: ${({ theme }) => theme.colors.textDark}; /* Stronger color for values */
        line-height: 1.65; 
        word-break: break-word;

        /* If value is a link (e.g., email) */
        a {
            color: ${({ theme }) => theme.colors.accent1};
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }
    }

    /* Specific styling for address blocks to handle multiple lines gracefully */
    div.address-value {
        span { 
            display: block;
            &:not(:last-child) {
                margin-bottom: ${({ theme }) => theme.spacing(0.75)};
            }
        }
    }
`;

// --- Application Hub Section ---

export const ApplicationHubSection = styled(ContentSection)`
    /* The hub section now inherits the new transparent ContentSection base,
       so its unique styling for background/border defines its card look */
    background-color: ${(props) => props.theme.colors.primaryNeutral};
    padding: ${(props) => props.theme.spacing(6)}; /* Re-apply padding if ContentSection's is removed */
    border-radius: ${({theme}) => theme.borderRadius.xlarge}; /* Re-apply radius */
    border: 1px dashed ${(props) => props.theme.colors.accent1}; /* Dashed accent border for distinction */
    text-align: center;
    box-shadow: ${({ theme }) => theme.shadows.md};

    /* SectionTitle inside Hub needs to be recentered if its default is space-between */
    ${SectionTitle} { /* Target SectionTitle specifically within Hub */
        justify-content: center;
        border-image-source: linear-gradient(to right, 
            ${(props) => transparentize(0.8, props.theme.colors.accent2)}, 
            ${(props) => props.theme.colors.accent2}, /* Different accent for Hub title line */
            ${(props) => transparentize(0.8, props.theme.colors.accent2)}
        );
        &::after { // Override the short line if using global ::after
          width: 150px; // Longer underline for centered title
          background: linear-gradient(to right, 
            ${(props) => props.theme.colors.accent2}, 
            ${(props) => transparentize(0.5, props.theme.colors.accent2)}
          );
          left: 50%;
          transform: translateX(-50%);
        }

        h2 { /* Keep Hub h2 centered */
            text-align: center; 
            svg { color: ${(props) => props.theme.colors.accent2}; }
        }
        /* Hide "Edit" button for hub title if it doesn't apply */
        button.section-action-btn {
            display: none; 
        }
    }

    p.hub-description {
        font-family: ${(props) => props.theme.typography.body.fontFamily};
        font-size: ${(props) => props.theme.typography.body.sizes.base};
        color: ${(props) => props.theme.colors.textMedium};
        margin-bottom: ${(props) => props.theme.spacing(5)};
        line-height: 1.75;
        max-width: 600px; 
        margin-left: auto;
        margin-right: auto;
    }
`;

export const ApplicationActions = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: ${(props) => props.theme.spacing(3)}; // Increased gap for larger buttons
    align-items: center; 
    justify-content: center;
`;

// --- Form Styles & Button (Assumed defined and consistent) ---
// Keep the existing comprehensive FrontendButton. The styles for Form/FormField/Label are placeholders
// and should ideally come from a common, themed form style system.
export const FrontendForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(4)};
`;

export const FrontendFormField = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(1)};
`;

export const FrontendFormLabel = styled.label`
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    font-size: ${(props) => props.theme.typography.body.sizes.small};
    font-weight: ${(props) => props.theme.typography.body.weights.medium}; // Medium for form labels
    color: ${(props) => props.theme.colors.textDark};
`;

export const FrontendFormInput = styled.input` // Example, includes textarea, select variants
    width: 100%;
    padding: ${(props) => props.theme.spacing(2)} ${(props) => props.theme.spacing(3)};
    border: 1px solid ${(props) => props.theme.colors.mediumGray}; // Use mediumGray for input border
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    font-family: ${(props) => props.theme.typography.body.fontFamily};
    font-size: ${(props) => props.theme.typography.body.sizes.base};
    color: ${(props) => props.theme.colors.textDark};
    background-color: ${(props) => props.theme.colors.backgroundLight}; // White background for inputs
    transition: all 0.2s ease-out;
    
    &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.accent1};
        box-shadow: 0 0 0 3px ${props => rgba(props.theme.colors.accent1, 0.2)}; // Refined focus
    }
    &::placeholder { color: ${props => props.theme.colors.textMuted}; opacity: 1; }
    &:disabled { background-color: ${props => lighten(0.03, props.theme.colors.primaryNeutral)}; cursor: not-allowed; opacity: 0.7; }
`;

// FrontendButton (keep your refined version from previous step - pasted here for completeness)
export const FrontendButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' | 'text'; $size?: 'small' | 'medium' | 'large'; $isOutline?: boolean; $fullWidth?: boolean; $iconOnly?: boolean; }>`
  padding: ${(props) => { /* ... existing padding logic ... */  if (props.$iconOnly) return props.theme.spacing(2); return `${props.$size === 'small' ? props.theme.spacing(1.5) : props.$size === 'large' ? props.theme.spacing(3) : props.theme.spacing(2.5)} ${props.$size === 'small' ? props.theme.spacing(3) : props.$size === 'large' ? props.theme.spacing(5) : props.theme.spacing(4)}`; }};
  border-radius: ${({ theme, $iconOnly }) => $iconOnly ? theme.borderRadius.circle : theme.borderRadius.medium};
  font-family: ${(props) => props.theme.typography.body.fontFamily};
  font-size: ${(props) => props.$size === 'small' ? props.theme.typography.body.sizes.xsmall : props.$size === 'large' ? props.theme.typography.body.sizes.base : props.theme.typography.body.sizes.small};
  font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
  cursor: pointer;
  transition: all 0.2s ease-out;
  border: 1.5px solid transparent;
  min-width: ${(props) => { if (props.$iconOnly) return 'auto'; return props.$size === 'small' ? '100px' : props.$size === 'large' ? '160px' : '130px'; }};
  width: ${({ $fullWidth }) => $fullWidth ? '100%' : 'auto'};
  text-align: center;
  line-height: 1.3; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  svg { margin-right: ${(props) => props.$iconOnly ? '0' : props.theme.spacing(1.5)}; font-size: ${({ $iconOnly }) => $iconOnly ? '1.2em' : '1em'}; }

  ${(props) => (props.$variant === 'primary' && !props.$isOutline) && css` /* ... primary styles ... */ background-color: ${props.theme.colors.accent1}; color: ${props.theme.colors.textLight}; border-color: ${props.theme.colors.accent1}; &:hover:not(:disabled) { background-color: ${darken(0.07, props.theme.colors.accent1)}; border-color: ${darken(0.07, props.theme.colors.accent1)}; transform: translateY(-1px); box-shadow: ${props.theme.shadows.sm}; } `}
  ${(props) => ((props.$variant === 'secondary' || !props.$variant) || props.$isOutline) && css` /* ... secondary/outline styles ... */ background-color: transparent; color: ${props.theme.colors.accent1}; border-color: ${props.theme.colors.accent1}; &:hover:not(:disabled) { background-color: ${transparentize(0.9, props.theme.colors.accent1)}; transform: translateY(-1px); } `}
  ${(props) => props.$variant === 'danger' && css` /* ... danger styles ... */ background-color: ${props.theme.colors.error || props.theme.colors.adminStatusError}; color: ${props.theme.colors.textLight}; border-color: ${props.theme.colors.error || props.theme.colors.adminStatusError}; &:hover:not(:disabled) { background-color: ${darken(0.07, props.theme.colors.error || props.theme.colors.adminStatusError)}; border-color: ${darken(0.07, props.theme.colors.error || props.theme.colors.adminStatusError)}; transform: translateY(-1px); } `}
  ${(props) => props.$variant === 'text' && css` /* ... text button styles ... */ background-color: transparent; color: ${props.theme.colors.accent1}; border-color: transparent; padding-left: ${props.theme.spacing(1)}; padding-right: ${props.theme.spacing(1)}; min-width: auto; text-transform: none; letter-spacing: normal; font-weight: ${props.theme.typography.body.weights.medium}; &:hover:not(:disabled) { color: ${darken(0.1, props.theme.colors.accent1)}; background-color: ${transparentize(0.95, props.theme.colors.accent1)}; } `}

  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
`;

export const ApplicationStatusList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(4)}; // Space between multiple application status cards
`;

export const ApplicationStatusCard = styled.div<{ $status?: string }>`
  background-color: ${({ theme }) => lighten(0.04, theme.colors.primaryNeutral)}; // Subtle background
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(5)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border-left: 5px solid ${({ theme, $status }) => { // Accent border based on status
    if ($status === 'approved') return theme.colors.adminStatusSuccess;
    if ($status === 'rejected' || $status === 'withdrawn') return theme.colors.adminStatusError;
    if ($status === 'pending' || $status === 'submitted' || $status === 'under_review') return theme.colors.adminStatusWarning;
    return theme.colors.mediumGray;
  }};
  box-shadow: ${({ theme }) => theme.shadows.xs}; // Very subtle shadow
  display: grid;
  grid-template-columns: 1fr auto; // Info on left, actions/status on right
  gap: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(5)};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    grid-template-columns: 1fr; // Stack on small mobile
    text-align: center; // Center content when stacked
    justify-items: center;
  }
`;

export const ApplicationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export const ApplicationType = styled.h4`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.large};
  font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;

export const ApplicationMeta = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
  line-height: 1.4;

  span { // For highlighting dates or IDs
    font-weight: ${({ theme }) => theme.typography.body.weights.medium};
    color: ${({ theme }) => theme.colors.textMedium};
  }
`;

export const ApplicationStatusAndActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; // Align status and button to the right
  gap: ${({ theme }) => theme.spacing(2.5)};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobileL}) {
    align-items: center; // Center when stacked
    width: 100%;
    margin-top: ${({ theme }) => theme.spacing(3)};
    ${ActionButton} { // Target ActionButton if used here
        width: 100%;
        max-width: 280px;
    }
  }
`;
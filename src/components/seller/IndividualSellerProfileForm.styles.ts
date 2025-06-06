// src/components/forms/IndividualSellerProfile/IndividualSellerProfileForm.styles.ts
import styled, { css, type DefaultTheme, keyframes } from 'styled-components';
import { rgba, lighten, darken, transparentize } from 'polished';

// --- Keyframes ---
const subtleFormEntrance = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

const introMessageFadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const introMessageFadeOut = keyframes`
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-10px) scale(0.95); }
`;

const infoBubbleAppear = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const progressBarFill = keyframes`
  from { width: 0%; }
  to { width: var(--progress-width, 0%); } /* Use CSS variable for dynamic width */
`;

// Keyframes from previous "beautiful" iteration (inputs, section titles)
const formElementFocusGlow = keyframes`
  0% { box-shadow: 0 0 0 0px ${({ theme }) => transparentize(0.7, theme.colors.accent1 || '#A46E4A')}; border-color: ${({ theme }) => theme.colors.accent1 || '#A46E4A'}; }
  100% { box-shadow: 0 0 0 4px ${({ theme }) => transparentize(0.85, theme.colors.accent1 || '#A46E4A')}; border-color: ${({ theme }) => darken(0.05, theme.colors.accent1 || '#A46E4A')}; }
`;
const sectionTitleUnderline = keyframes`
  from { width: 0%; }
  to { width: 50px; }
`;


// --- Two Column Page Layout ---
export const TwoColumnPageLayout = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => lighten(0.03, theme.colors.primaryNeutral || '#F8F5F2')}; /* Overall page backdrop, slightly lighter */
  animation: ${subtleFormEntrance} 0.5s ease-out;
`;

// --- Interactive Guide Panel (Left Column) ---
export const InteractiveGuidePanel = styled.aside<{ theme: DefaultTheme }>`
  width: 38%; /* Adjust as needed */
  min-height: 100vh;
  /* A softer, welcoming gradient. Could be themed with "Rose" - e.g. subtle floral hints or colors */
  background: linear-gradient(160deg, 
    ${({ theme }) => transparentize(0.3, theme.colors.accent2 || '#8DA382')}, 
    ${({ theme }) => transparentize(0.6, theme.colors.accent1 || '#A46E4A')} 30%,
    ${({ theme }) => transparentize(0.8, theme.colors.primaryNeutral || '#F8F5F2')} 85%
  ), ${({ theme }) => lighten(0.05, theme.colors.primaryNeutral || '#F8F5F2')};
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Align items to top to make space for progress bar from top */
  padding: ${({ theme }) => theme.spacing(10)} ${({ theme }) => theme.spacing(6)};
  color: ${({ theme }) => theme.colors.textDark};
  text-align: center;
  position: sticky; /* Make it sticky if FormPanel scrolls */
  top: 0;
  height: 100vh; /* Ensure it takes full viewport height */

  @media (max-width: ${({ theme }) => theme.breakpoints.laptop || '1024px'}) {
    width: 30%;
    padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(4)};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    display: none; /* Hide guide panel on tablets and mobile */
  }
`;

export const MascotContainer = styled.div<{ theme: DefaultTheme }>`
  width: 150px; /* Adjust based on your mascot's size */
  height: 150px; /* Adjust based on your mascot's size */
  margin-top: ${({ theme }) => theme.spacing(6)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  /* Placeholder for mascot - use an <img> or <svg> in TSX */
  img, svg { width: 100%; height: 100%; object-fit: contain; }
  /* Example: border: 2px dashed ${({ theme }) => theme.colors.accent2}; border-radius: 50%; */
`;

export const IntroMessage = styled.div<{ theme: DefaultTheme; isVisible: boolean }>`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
  color: ${({ theme }) => theme.colors.accent1};
  font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
  padding: ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => transparentize(0.1, theme.colors.adminSurface || '#fff')};
  border-radius: ${({ theme }) => theme.borderRadius?.large || '12px'};
  box-shadow: ${({ theme }) => theme.shadows?.medium || '0 4px 10px rgba(0,0,0,0.1)'};
  margin-bottom: ${({ theme }) => theme.spacing(5)};
  line-height: 1.4;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  animation: ${({ isVisible }) => (isVisible ? introMessageFadeIn : introMessageFadeOut)} 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  transform-origin: center center;

  strong { /* For "Rose" */
    color: ${({theme}) => darken(0.1, theme.colors.accent1Vibrant || theme.colors.accent1)};
  }
`;

export const InfoBubble = styled.div<{ theme: DefaultTheme; isVisible: boolean }>`
  padding: ${({ theme }) => theme.spacing(3.5)} ${({ theme }) => theme.spacing(4)};
  background-color: ${({ theme }) => theme.colors.adminSurface || '#fff'};
  border-radius: ${({ theme }) => theme.borderRadius?.large || '12px'};
  box-shadow: ${({ theme }) => theme.shadows?.subtle || '0 2px 4px rgba(0,0,0,0.05)'};
  border: 1px solid ${({theme}) => theme.colors.adminBorder || '#e0e0e0'};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textDark};
  line-height: 1.6;
  min-height: 80px; /* To prevent layout shifts */
  width: 100%;
  max-width: 320px;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.3s ease-out; /* For smoother transitions when text changes if isVisible is constant */
  animation: ${infoBubbleAppear} 0.4s ease-out forwards; /* For initial appearance */
  transform-origin: top center;

  strong { /* For field names or important bits */
    font-weight: ${({theme}) => theme.typography.body.weights.bold};
    color: ${({theme}) => theme.colors.accent1};
  }
`;

export const ProgressBarContainer = styled.div<{ theme: DefaultTheme }>`
  width: 100%;
  max-width: 300px; /* Or adjust based on panel width */
  margin-top: ${({ theme }) => theme.spacing(6)};
  padding: ${({ theme }) => theme.spacing(2)};
  /* background-color: ${props => transparentize(0.9, props.theme.colors.accent2)}; */
  /* border-radius: ${props => props.theme.borderRadius?.medium}; */
`;

export const ProgressStep = styled.div<{ theme: DefaultTheme; isActive?: boolean; isCompleted?: boolean }>`
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(2.5)};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '8px'};
  border: 1.5px solid ${({ theme, isActive }) => isActive ? theme.colors.accent1 : transparentize(0.7, theme.colors.accent2 || '#8DA382')};
  background-color: ${({ theme, isActive, isCompleted }) => 
    isActive ? transparentize(0.85, theme.colors.accent1 || '#A46E4A') : 
    isCompleted ? transparentize(0.9, theme.colors.accent2 || '#8DA382') : 
    theme.colors.adminSurface
  };
  color: ${({ theme, isActive, isCompleted }) => 
    isActive ? theme.colors.accent1 : 
    isCompleted ? darken(0.1, theme.colors.accent2 || '#8DA382') : 
    theme.colors.darkGray
  };
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  font-weight: ${({ theme, isActive }) => isActive ? theme.typography.body.weights.semiBold : theme.typography.body.weights.regular};
  text-align: left;
  cursor: default; /* Or pointer if clickable */
  transition: all 0.3s ease-out;
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({theme}) => theme.spacing(2)};

  svg { /* For step icon */
    font-size: 1.1em;
    opacity: ${({isActive, isCompleted}) => (isActive || isCompleted) ? 1 : 0.6};
  }

  ${({ isActive, theme }) => isActive && css`
    box-shadow: 0 0 10px ${transparentize(0.8, theme.colors.accent1 || '#A46E4A')};
    transform: scale(1.02);
  `}
  ${({ isCompleted, theme }) => isCompleted && css`
    /* Optional: line-through text or a checkmark icon */
  `}
`;

// --- Form Panel (Right Column) ---
export const FormPanel = styled.main<{ theme: DefaultTheme }>`
  width: 62%; /* Adjust based on InteractiveGuidePanel width */
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.adminSurface || '#ffffff'};
  padding: ${({ theme }) => theme.spacing(8)} ${({ theme }) => theme.spacing(10)};
  overflow-y: auto;
  border-left: 1px solid ${({theme}) => theme.colors.adminBorder || theme.colors.lightGray}; /* Subtle separation */


  @media (max-width: ${({ theme }) => theme.breakpoints.laptop || '1024px'}) {
    width: 70%;
    padding: ${({ theme }) => theme.spacing(7)} ${({ theme }) => theme.spacing(8)};
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet || '768px'}) {
    width: 100%;
    border-left: none;
    padding: ${({ theme }) => theme.spacing(6)};
  }
   @media (max-width: ${({ theme }) => theme.breakpoints.mobileL || '425px'}) {
    padding: ${({ theme }) => theme.spacing(5)} ${({ theme }) => theme.spacing(4)};
  }
`;

// --- FormWrapper, FormHeader, Sections, Fields, Buttons etc. ---
// These styles are largely the same as the refined version from the previous "beautiful form" iteration.
// Included here for completeness, with minor contextual adjustments if any.

export const FormWrapper = styled.form<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  color: ${({ theme }) => theme.colors.textDark};
  max-width: 750px;
  margin: 0 auto;
`;

export const FormHeader = styled.div<{ theme: DefaultTheme }>`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(8)};
  padding-bottom: ${({ theme }) => theme.spacing(5)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.adminBorder || theme.colors.lightGray};
  h2 {
    font-family: ${({ theme }) => theme.typography.heading.fontFamily};
    font-size: clamp(1.8rem, 4vw, 2.4rem);
    color: ${({ theme }) => theme.colors.accent1};
    font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
    margin: 0; line-height: 1.3;
  }
`;

export const FormSection = styled.section<{ theme: DefaultTheme }>`
  margin-bottom: ${({ theme }) => theme.spacing(8)};
  padding: ${({ theme }) => theme.spacing(2)} 0;
  &:last-of-type { margin-bottom: ${({ theme }) => theme.spacing(4)}; }
`;

export const FormSectionTitle = styled.h3<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily};
  font-size: clamp(1.35rem, 3.5vw, 1.8rem);
  color: ${({ theme }) => darken(0.1, theme.colors.textDark || '#302D2A')};
  font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
  margin-top: 0; margin-bottom: ${({ theme }) => theme.spacing(6)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  position: relative; display: flex; align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  svg {
    color: ${({ theme }) => theme.colors.accent1 || '#A46E4A'};
    font-size: 1.2em; opacity: 1; margin-bottom: -2px;
  }
  &::after {
    content: ''; position: absolute; bottom: 0; left: 0; height: 2.5px;
    background-color: ${({ theme }) => theme.colors.accent1 || '#A46E4A'};
    border-radius: 2px;
    animation: ${sectionTitleUnderline} 0.6s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  }
`;

export const FieldGroup = styled.div<{ theme: DefaultTheme; fullWidthMobile?: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing(6)};
  display: flex; flex-direction: column; flex: 1;
  gap: ${({ theme }) => theme.spacing(1.5)};
  &:last-child { margin-bottom: 0; }
  ${({ fullWidthMobile, theme }) => fullWidthMobile && css`
    @media (max-width: ${theme.breakpoints.tablet || '768px'}) {
      width: 100%; min-width: unset; margin-bottom: ${theme.spacing(6)};
      &:last-child { margin-bottom: 0;}
    }
  `}
`;

export const MultiFieldRow = styled.div<{ theme: DefaultTheme }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing(6)};
`;

export const FormLabel = styled.label<{ theme: DefaultTheme }>`
  display: block; font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  color: ${({ theme }) => darken(0.1, theme.colors.textDark || '#302D2A')};
  letter-spacing: 0.2px; margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

const inputBaseStyles = css<{ theme: DefaultTheme; hasError?: boolean }>`
  width: 100%; padding: ${({ theme }) => theme.spacing(3.5)} ${({ theme }) => theme.spacing(4)};
  border: 1.5px solid ${({ theme, hasError }) => hasError ? theme.colors.adminStatusError : (theme.colors.adminBorder || theme.colors.lightGray)};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '8px'};
  background-color: ${({ theme }) => theme.colors.adminSurface || '#ffffff'};
  color: ${({ theme }) => theme.colors.textDark};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, background-color 0.2s ease-in-out;
  line-height: 1.5; box-shadow: 0 1px 2px ${props => rgba(darken(0.1, props.theme.colors.primaryNeutral || '#000000'), 0.03)};
  &:focus, &:focus-within {
    outline: none; border-color: ${({ theme }) => theme.colors.accent1};
    background-color: ${({ theme }) => theme.colors.adminSurface};
    animation: ${formElementFocusGlow} 0.3s ease-out forwards;
  }
  &::placeholder { color: ${({ theme }) => theme.colors.mediumGray || theme.colors.darkGray}; opacity: 0.8; }
  &:disabled {
    background-color: ${({ theme }) => lighten(0.02, theme.colors.primaryNeutral || '#f8f5f2')};
    cursor: not-allowed; opacity: 0.7; border-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

export const StyledInput = styled.input<{ theme: DefaultTheme; hasError?: boolean }>` ${inputBaseStyles} `;
export const StyledSelect = styled.select<{ theme: DefaultTheme; hasError?: boolean }>`
  ${inputBaseStyles}
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23${({ theme }) => (theme.colors.accent1 || '#A46E4A').substring(1)}'%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right ${({ theme }) => theme.spacing(4)} center;
  background-size: 1em; padding-right: ${({ theme }) => theme.spacing(12)}; cursor: pointer;
  &:focus { /* Keep SVG color consistent on focus */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23${({ theme }) => (theme.colors.accent1 || '#A46E4A').substring(1)}'%3E%3Cpath d='M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z'/%3E%3C/svg%3E");
  }
`;
export const StyledTextArea = styled.textarea<{ theme: DefaultTheme; hasError?: boolean }>` ${inputBaseStyles} min-height: 140px; resize: vertical; `;

export const CheckboxWrapper = styled.div<{ theme: DefaultTheme }>`
  display: flex; align-items: flex-start; margin-bottom: ${({ theme }) => theme.spacing(4)};
  gap: ${({ theme }) => theme.spacing(2.5)};
`;
export const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })<{ theme: DefaultTheme }>`
  appearance: none; position: relative; height: 20px; width: 20px;
  background-color: ${({ theme }) => theme.colors.adminSurface || '#ffffff'};
  border: 1.5px solid ${({ theme }) => theme.colors.adminBorder || theme.colors.lightGray};
  border-radius: ${({theme}) => theme.borderRadius?.small || '4px'};
  cursor: pointer; vertical-align: middle; transition: all 0.2s ease-in-out; margin-top: 2px;
  &:checked {
    background-color: ${({ theme }) => theme.colors.accent1};
    border-color: ${({ theme }) => darken(0.1, theme.colors.accent1 || '#A46E4A')};
    &::after {
      content: ''; position: absolute; left: 6px; top: 3px; width: 5px; height: 10px;
      border: solid ${({ theme }) => theme.colors.textLight};
      border-width: 0 2.5px 2.5px 0; transform: rotate(45deg);
    }
  }
  &:focus-visible { outline: none; box-shadow: 0 0 0 3px ${({ theme }) => transparentize(0.7, theme.colors.accent1 || '#A46E4A')}; }
  &:hover:not(:checked) { border-color: ${({theme}) => darken(0.1,theme.colors.accent1 || '#A46E4A')}; }
`;
export const CheckboxLabel = styled.label<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base}; 
  color: ${({ theme }) => theme.colors.textDark}; cursor: pointer; user-select: none; line-height: 1.6;
  a {
    color: ${({ theme }) => theme.colors.accent1}; text-decoration: underline;
    text-decoration-thickness: 1.5px; text-underline-offset: 3px;
    font-weight: ${({theme}) => theme.typography.body.weights.medium};
    transition: color 0.2s ease-out, text-decoration-color 0.2s ease-out;
    &:hover {
      color: ${({ theme }) => darken(0.1, theme.colors.accent1 || '#A46E4A')};
      text-decoration-color: ${({ theme }) => darken(0.1, theme.colors.accent1 || '#A46E4A')};
    }
  }
`;

export const HelperText = styled.small<{ theme: DefaultTheme; error?: boolean }>`
  display: flex; align-items: center; gap: ${({ theme }) => theme.spacing(1.5)};
  margin-top: ${({ theme }) => theme.spacing(1.5)};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme, error }) => error ? theme.colors.adminStatusError : darken(0.05, theme.colors.darkGray || '#757575')};
  line-height: 1.45;
  svg { font-size: 1.1em; flex-shrink: 0; opacity: 1; margin-bottom: -1px; }
`;

export const FileInputWrapper = styled.div<{ theme: DefaultTheme }>`
  margin-bottom: ${({ theme }) => theme.spacing(1.5)}; // Consistent spacing
  position: relative; // For potential icon overlays or advanced styling

  .file-input-label {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2.5)};
    padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4.5)};
    background-color: ${({ theme }) => transparentize(0.95, theme.colors.accent2 || '#8DA382')}; // Subtle accent bg
    color: ${({ theme }) => darken(0.1, theme.colors.accent2Vibrant || theme.colors.accent2 || '#8DA382')}; // Vibrant or base accent color
    border: 1.5px dashed ${({ theme }) => transparentize(0.5, theme.colors.accent2 || '#8DA382')};
    border-radius: ${({theme}) => theme.borderRadius?.medium || '8px'};
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    font-size: ${({ theme }) => theme.typography.body.sizes.base};

    &:hover {
      background-color: ${({ theme }) => transparentize(0.88, theme.colors.accent2 || '#8DA382')};
      border-color: ${({ theme }) => theme.colors.accent2Vibrant || theme.colors.accent2};
      color: ${({ theme }) => theme.colors.accent2Vibrant || theme.colors.accent2};
      transform: translateY(-1px);
      box-shadow: 0 4px 10px ${props => rgba(props.theme.colors.accent2 || '#8DA382', 0.15)};
    }

    svg {
      font-size: 1.25em;
      transition: transform 0.25s ease;
    }

    &:hover svg {
        transform: scale(1.1);
    }
  }

  input[type="file"] { 
    opacity: 0;
    width: 0.1px;
    height: 0.1px;
    position: absolute;
    z-index: -1;
  }
`;
const subtleEntrance = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const FileInfoDisplay = styled.div<{ theme: DefaultTheme }>`
  margin-top: ${({ theme }) => theme.spacing(2.5)}; /* Space above this display block */
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(3.5)};
  background-color: ${({ theme }) => lighten(0.06, theme.colors.primaryNeutral || '#F8F5F2')}; /* Very light, warm off-white */
  border: 1px solid ${({ theme }) => theme.colors.lightGray || '#E9E9E9'};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '8px'}; /* Consistent medium radius */
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${subtleEntrance} 0.3s ease-out; /* Subtle animation on appearance */
  transition: box-shadow 0.2s ease-out, border-color 0.2s ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.mediumGray || '#b0aead'};
    box-shadow: ${({ theme }) => theme.shadows?.xs || '0 1px 3px rgba(0,0,0,0.04)'}; /* Very subtle hover shadow */
  }

  .file-info-text {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2)};
    overflow: hidden; /* Important for truncating long file names */
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.small};
    color: ${({ theme }) => theme.colors.textDark};

    /* Icon styling for FaFilePdf */
    svg:first-of-type { 
      font-size: 1.6em; /* Make PDF icon prominent */
      color: ${({ theme }) => theme.colors.accent1Vibrant || theme.colors.accent1 || '#A46E4A'}; /* Accent color for icon */
      flex-shrink: 0; /* Prevent icon from shrinking */
    }
  }

  .file-name {
    font-weight: ${({ theme }) => theme.typography.body.weights.medium};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px; /* Max width before truncating, adjust based on typical file name lengths */
    color: ${({ theme }) => theme.colors.textDark};
  }

  .file-size { /* Added class for file size styling (assumed in your TSX) */
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
    color: ${({ theme }) => theme.colors.textMedium}; /* Softer color for size */
    margin-left: ${({ theme }) => theme.spacing(1)};
    flex-shrink: 0;
  }

  .remove-file-btn {
    background: transparent;
    border: none;
    color: ${({ theme }) => theme.colors.adminStatusError || '#D32F2F'}; /* Use error color */
    cursor: pointer;
    font-size: 1.05rem; /* Slightly adjusted icon size */
    padding: ${({ theme }) => theme.spacing(1.25)}; /* Clickable area */
    line-height: 0; /* Ensure icon is centered */
    border-radius: 50%; // Circular button
    display: flex; // For centering icon
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
    flex-shrink: 0;

    &:hover {
      background-color: ${({ theme }) => transparentize(0.9, theme.colors.adminStatusError || '#D32F2F')};
      color: ${({ theme }) => darken(0.1, theme.colors.adminStatusError || '#D32F2F')};
      transform: scale(1.05);
    }
    
    &:focus-visible { // Accessibility focus
        outline: 2px solid ${({theme}) => theme.colors.adminStatusError || '#D32F2F'};
        outline-offset: 1px;
        background-color: ${({ theme }) => transparentize(0.92, theme.colors.adminStatusError || '#D32F2F')};
    }

    svg { // FaTrash icon
        display: block; // Helps with precise centering sometimes
    }
  }
`;
export const ButtonGroup = styled.div<{ theme: DefaultTheme }>` /* Same as previous */ `;


// Re-exporting AuthMessage from its original location
export { AuthMessage } from "@/pages/AuthPage/AuthPage.styles";



const BaseFormButton = styled.button<{ theme: DefaultTheme }>`
  padding: ${({ theme }) => theme.spacing(3.5)} ${({ theme }) => theme.spacing(6)};
  border: 1px solid transparent;
  border-radius: ${({theme}) => theme.borderRadius?.medium || '8px'};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  cursor: pointer; transition: all 0.2s ease-out;
  display: inline-flex; align-items: center; justify-content: center;
  gap: ${({ theme }) => theme.spacing(2.5)};
  min-width: 180px; 
  box-shadow: 0 3px 6px ${props => rgba(darken(0.1, props.theme.colors.primaryNeutral || '#000000'), 0.06)};
  line-height: 1.2;
  svg { font-size: 1.2em; margin-bottom: -1px; }
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px ${props => rgba(darken(0.1, props.theme.colors.primaryNeutral || '#000000'), 0.1)};
  }
  &:active:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px ${props => rgba(darken(0.1, props.theme.colors.primaryNeutral || '#000000'), 0.08)};
  }
  &:disabled {
    opacity: 0.6; cursor: not-allowed; box-shadow: none; transform: none;
    background-color: ${({ theme }) => theme.colors.lightGray};
    color: ${({ theme }) => theme.colors.darkGray};
    border-color: ${({theme}) => theme.colors.lightGray};
  }
  &:focus-visible {
    outline: none; box-shadow: 0 0 0 3px ${({theme}) => transparentize(0.7, theme.colors.accent1 || '#A46E4A')};
  }
`;

export const SubmitButton = styled(BaseFormButton)`
  background: linear-gradient(135deg, 
    ${({theme}) => theme.colors.accent1 || '#A46E4A'}, 
    ${({theme}) => lighten(0.05, theme.colors.accent1 || '#A46E4A')}
  );
  color: ${({ theme }) => theme.colors.textLight};
  border: none;
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, 
      ${({theme}) => darken(0.05, theme.colors.accent1 || '#A46E4A')}, 
      ${({theme}) => theme.colors.accent1 || '#A46E4A'}
    );
    box-shadow: 0 6px 15px ${props => rgba(props.theme.colors.accent1 || '#A46E4A', 0.25)};
  }
`;

export const CancelButton = styled(BaseFormButton)`
  background-color: ${({ theme }) => theme.colors.adminSurface || '#ffffff'};
  color: ${({ theme }) => theme.colors.darkGray};
  border: 1.5px solid ${({ theme }) => theme.colors.adminBorder || theme.colors.lightGray};
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => lighten(0.06, theme.colors.primaryNeutral || '#f8f5f2')};
    border-color: ${({ theme }) => theme.colors.darkGray};
    color: ${({ theme }) => theme.colors.textDark};
  }
`;
export const ReadOnlyFieldWrapper = styled(FieldGroup)`
  /* Inherits FieldGroup styling, can add overrides if needed */
  margin-bottom: ${({ theme }) => theme.spacing(3)}; // Slightly less margin for read-only groups
`;

export const ReadOnlyLabel = styled(FormLabel)`
  color: ${({ theme }) => theme.colors.darkGray}; // Softer color for read-only labels
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  text-transform: none; // Keep it natural
  margin-bottom: ${({ theme }) => theme.spacing(0.5)};
`;

export const ReadOnlyValue = styled.div<{ theme: DefaultTheme }>`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textDark};
  background-color: ${({ theme }) => transparentize(0.95, theme.colors.mediumGray || '#b0aead')}; // Very subtle background
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(3.5)};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '8px'};
  border: 1px solid ${({ theme }) => theme.colors.adminBorder || theme.colors.lightGray};
  line-height: 1.6;
  word-break: break-word;
  min-height: calc(${({ theme }) => theme.spacing(2.5)} * 2 + 1.6em); /* Align with input height */

  &.highlight {
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    color: ${({ theme }) => theme.colors.accent1};
  }
`;

// --- For displaying items in a grid (like Legal Info) ---
export const SectionContentGrid = styled.div<{ theme: DefaultTheme; columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns || 'auto-fit'}, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(5)};
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const InfoDisplayItem = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};

  p.label, span.label { /* Adapted from your original styles */
    margin: 0;
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall}; /* Slightly smaller for info items */
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    color: ${({ theme }) => theme.colors.darkGray};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: ${({theme}) => theme.spacing(1.5)};
    svg {
        opacity: 0.7;
    }
  }

  span.value, div.value { /* Adapted from your original styles */
    display: block;
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.base};
    color: ${({ theme }) => theme.colors.textDark};
    line-height: 1.5;
    word-break: break-word;

    &.boolean-true { /* From your original styles */
        color: ${({ theme }) => theme.colors.adminStatusSuccess || '#388E3C'};
        font-weight: ${({ theme }) => theme.typography.body.weights.medium};
    }
    &.boolean-false { /* From your original styles */
        color: ${({ theme }) => theme.colors.adminStatusError || '#D32F2F'};
        font-weight: ${({ theme }) => theme.typography.body.weights.medium};
    }
     a { /* For links within a value field */
      color: ${({ theme }) => theme.colors.accent1};
      text-decoration: none;
      font-weight: ${({theme}) => theme.typography.body.weights.medium};
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s ease-out, color 0.2s ease-out;
      &:hover {
        border-bottom-color: ${({ theme }) => theme.colors.accent1};
      }
      svg { margin-left: 4px; font-size: 0.85em; }
    }
  }
`;

export const ExistingFileInfo = styled.div<{ theme: DefaultTheme }>`
  padding: ${({ theme }) => theme.spacing(2)} 0;
  a {
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(2)};
    color: ${({ theme }) => theme.colors.accent1};
    text-decoration: none;
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-weight: ${({theme}) => theme.typography.body.weights.medium};
    padding: ${({theme}) => theme.spacing(1.5)} ${({theme}) => theme.spacing(2.5)};
    border-radius: ${({theme}) => theme.borderRadius.medium};
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({theme}) => transparentize(0.9, theme.colors.accent1)};
    }
    svg {
      color: ${({theme}) => theme.colors.accent1};
      font-size: 1.2em;
    }
    span { // For file name
        border-bottom: 1px dashed ${({theme}) => transparentize(0.5, theme.colors.accent1)};
    }
  }
`;
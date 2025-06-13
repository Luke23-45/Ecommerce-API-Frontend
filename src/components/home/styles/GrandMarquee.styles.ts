
import styled, { css, type DefaultTheme, keyframes } from 'styled-components';
import { rgba, lighten, darken, transparentize } from 'polished';
import { FaSpinner } from 'react-icons/fa';

const inputFocusInnerGlow = keyframes`
    from { box-shadow: inset 0 0 0 0 ${props => rgba(props.theme.colors.accent1, 0.0)}; }
    to { box-shadow: inset 0 0 0 2px ${props => rgba(props.theme.colors.accent1, 0.1)}; }
`;
const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// Add this styled component for the spinner icon
export const SpinnerIcon = styled(FaSpinner)`
  animation: ${spin} 1s linear infinite;
`;

const itemHoverGlow = keyframes`
    from { background-color: transparent; }
    to { background-color: ${props => rgba(props.theme.colors.accent1, 0.08)}; }
`;

export const StyledGrandMarquee = styled.nav`
    height: 65px;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.primaryNeutral};
    border-bottom: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.lightGray};
    display: flex;
    
    align-items: center;
    top: 0;
    z-index: 100;
        padding: 0 ${(props) => props.theme.containerPadding};
    box-shadow: 0 4px 20px ${rgba(0, 0, 0, 0.1)};
    transition: background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        height: 70px;
        box-shadow: 0 2px 10px ${rgba(0, 0, 0, 0.05)};
    }
`;

export const MarqueeContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

  max-width: ${(props) => props.theme.maxWidth};
    margin: 0 auto;

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        padding: 0 ${(props: { theme: DefaultTheme }) => props.theme.spacing(4)};
    }
`;

export const HeaderLeftSection = styled.div`
    display: flex;
    align-items: center;
`;

export const BrandLogoContainer = styled.a`
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
    margin-left:-30px ;
    img {
        height: auto;
        width: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        &:hover {
            transform: scale(1.05);
        }
    }
    h1 { display: none; }

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        img { height: 38px; }
        margin-left: -${(props: { theme: DefaultTheme }) => props.theme.spacing(1)};
    }
`;

export const HeaderCenterSearch = styled.div`
    flex-grow: 1;
  
    max-width: 800px;
    display: flex;
    position: relative;
    height: 48px;
    background-color: ${props => lighten(0.01, props.theme.colors.primaryNeutral)};
    border: 1px solid ${(props: { theme: DefaultTheme }) => props.theme.colors.adminBorder};
    border-radius: 28px;
    overflow: visible;
    transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
    
    &:focus-within {
        border-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1};
        box-shadow: 0 0 0 4px ${props => rgba(props.theme.colors.accent1, 0.15)};
    }

   
    margin: 0 ${(props: { theme: DefaultTheme }) => props.theme.spacing(5)}; 

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        flex-grow: 1;
        max-width: none;
        width: 100%;
        margin: 0;
        margin-top: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)};
        height: 48px;
        border-radius: 24px;
    }
`;


export const CustomSelectWrapper = styled.div`
    position: relative;
    flex-shrink: 0;
    height: 100%; 
    display: flex; 
    z-index: 20;
  
`;

export const CustomSelectTrigger = styled.div<{ $width: string }>` // $width prop from JS still exists
    display: flex;
    align-items: center;
    justify-content: space-between; 
    width: ${props => props.$width || '180px'}; /* INCREASED default/fallback for trigger if JS width fails */
    min-width: 150px; /* INCREASED */
    height: 100%;
    padding: 0 18px 0 20px; /* Hardcoded padding: 0 14px 0 16px if theme.spacing(3.5) & (4) */
    background-color: transparent;
    border-right: 1px solid ${({ theme }) => transparentize(0.6, theme.colors.mediumGray)}; /* More visible border */
    border-radius: 22px 0 0 22px; /* Matches parent 44px height => pill */
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: 15px; /* INCREASED: e.g., theme.typography.body.sizes.base */
    font-weight: 500; /* theme.typography.body.weights.medium */
    color: ${({ theme }) => theme.colors.textDark};
    cursor: pointer;
    transition: color 0.2s ease-out, background-color 0.2s ease-out;
    position: relative;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &::after { /* Arrow */
        content: ''; 
        border-left: 6px solid transparent; /* Slightly larger arrow */
        border-right: 6px solid transparent;
        border-top: 7px solid currentColor; 
        margin-left: 10px; /* theme.spacing(2.5) */
        transition: transform 0.25s ease-in-out;
        flex-shrink: 0;
    }

    &:hover {
        color: ${({ theme }) => theme.colors.accent1};
    }

    &.open {
        color: ${({ theme }) => theme.colors.accent1};
        &::after { transform: rotate(180deg); }
    }
`;


export const CustomDropdownList = styled.ul<{ $isOpen: boolean }>`
    position: absolute;
    top: calc(100% + 6px); /* INCREASED gap: approx theme.spacing(1.5) */
    left: 0;   
    
    /* --- HARDCODED LARGE SIZE --- */
    width: 500px;  /* FIXED LARGE WIDTH */
    /* min-width: 300px; // Can also use min-width if var(--dropdown-width) is sometimes okay */
    
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    border-radius: 10px; /* Softer, visible radius (theme.borderRadius.large perhaps) */
    
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12); /* More prominent shadow (theme.shadows.large or xl) */
    list-style: none;
    padding: 10px 0; /* HARDCODED: e.g., theme.spacing(2.5) vertical */
    margin: 0; 
    max-height: 400px; /* INCREASED max-height significantly */
    overflow-y: auto;
    z-index: ${({ theme }) => theme.zIndex.dropdown + 10 || 1010};

    opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transform: translateY(${(props) => (props.$isOpen ? '0' : '-15px')}) scaleY(${(props) => (props.$isOpen ? 1 : 0.92)}); /* More pronounced open animation */
    transform-origin: top center;
    transition: opacity 0.25s ease-out, 
                transform 0.25s cubic-bezier(0.25, 0.8, 0.25, 1), 
                visibility 0s linear ${({ $isOpen }) => ($isOpen ? "0s" : "0.25s")};
    pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};

    /* Custom Scrollbar (keep refined version) */
    &::-webkit-scrollbar { width: 7px; }
    &::-webkit-scrollbar-track { background: ${({ theme }) => transparentize(0.6, theme.colors.lightGray)}; border-radius: 4px; margin: 8px 4px; }
    &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.colors.mediumGray}; border-radius: 4px; }
    &::-webkit-scrollbar-thumb:hover { background: ${({ theme }) => darken(0.1,theme.colors.mediumGray)}; }
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.mediumGray} ${({ theme }) => transparentize(0.6, theme.colors.lightGray)};
`;

export const CustomDropdownItem = styled.li<{ $isSelected: boolean }>`
    /* --- INCREASED PADDING & FONT SIZE --- */
    padding: 14px 24px; /* HARDCODED: e.g., theme.spacing(3.5) theme.spacing(6) */
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: 18px; /* INCREASED: theme.typography.body.sizes.base or even slightly larger */
    color: ${({ theme }) => theme.colors.textDark};
    cursor: pointer;
    transition: background-color 0.15s ease-out, color 0.15s ease-out, padding-left 0.2s ease-out;
    text-align: left;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
        background-color: ${({ theme }) => transparentize(0.94, theme.colors.accent1)}; /* Very subtle Élan hover */
        color: ${({ theme }) => theme.colors.accent1};
    }

    ${props => props.$isSelected && css`
        background-color: ${transparentize(0.9, props.theme.colors.accent1)};
        color: ${props.theme.colors.accent1};
        font-weight: ${({ theme }) => theme.typography.body.weights.bold}; /* Bolder selected item */
        
        &::before { 
            content: '✓';
            position: absolute;
            left: 16px; /* HARDCODED: e.g., theme.spacing(4) */
            top: 50%;
            transform: translateY(-50%);
            color: ${props.theme.colors.accent1};
            font-size: 1.1em; /* Slightly larger checkmark */
            font-weight: bold;
        }
        padding-left: 48px; /* HARDCODED: Make space for larger checkmark (e.g. theme.spacing(12)) */
    `}
`;


export const SearchInputContainer = styled.div`
    flex-grow: 1;
    position: relative;
    display: flex;
    align-items: center;
    background-color: transparent;
    input {
        flex-grow: 1;
        width: 100%; 
        padding: ${(props: { theme: DefaultTheme }) => `${props.theme.spacing(2)} ${props.theme.spacing(4)}`};
        border: none;
        outline: none;
        background: transparent;
        font-family: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.fontFamily};
        font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.bodyBase};
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textDark};
        transition: all 0.2s ease-out;
        
        &::placeholder {
            color: ${(props: { theme: DefaultTheme }) => props.theme.colors.darkGray};
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s ease-out;
        }
        
        &:focus {
            animation: ${inputFocusInnerGlow} 0.5s forwards ease-out;
            &::placeholder {
                color: ${props => lighten(0.2, props.theme.colors.darkGray)};
            }
        }

        @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
            font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.small};
            padding: ${(props: { theme: DefaultTheme }) => `${props.theme.spacing(2)} ${props.theme.spacing(3)}`};
        }
    }
`;

export const HeaderRightUtility = styled.div`
    display: flex;
    align-items: center;
    position: relative;
    gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(5)};

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        gap: ${(props: { theme: DefaultTheme }) => props.theme.spacing(3)};
    }
`;

export const UtilityIconWrapper = styled.div`
    position: relative;
    cursor: pointer;
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textDark};
    font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.large};
    transition: all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
    &:hover {
        color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1};
        transform: translateY(-2px);
    }
`;

export const CartCountBadge = styled.span`
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: ${(props: { theme: DefaultTheme }) => props.theme.colors.accent1};
    color: ${(props: { theme: DefaultTheme }) => props.theme.colors.textLight};
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 10px;
    font-weight: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.weights.semiBold};
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    z-index: 1;
    pointer-events: none;
`;

export const SearchSectionIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 85px;
    height: 101%;
    background-color: #FF8C00;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    border-radius: 0 28px 28px 0;



    svg {
        flex-shrink: 0;
        color: white;
        font-size: 20px;
        font-weight: bolder;
        transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        margin-right: 9px;
    }

    &:hover {
        background-color: ${props => darken(0.1, '#FF8C00')};
        svg {
            transform: scale(1.1);
        }
    }

    @media (max-width: ${(props: { theme: DefaultTheme }) => props.theme.breakpoints.tablet}) {
        width: 60px;
        border-radius: 0 24px 24px 0;
        svg {
            font-size: ${(props: { theme: DefaultTheme }) => props.theme.typography.body.sizes.medium};
        }
    }
`;

const dropdownFadeInSlideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const dropdownFadeOutSlideUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
    visibility: hidden; /* Add visibility change at the end of animation */
  }
`;

// ... (StyledGrandMarquee, MarqueeContent, etc. ... )

// --- NEW: Account Dropdown Styles ---
export const AccountDropdownContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing(2.5)}); 
  right: 0; 
  min-width: 240px;
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing(2)} 0;
  z-index: ${({ theme }) => theme.zIndex.dropdown || 1000};
  transform-origin: top right;
  
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px) scale(0.98); // Matches 'from' state of fade-in and 'to' state of fade-out

  ${(props) => props.$isOpen
    ? css`
        visibility: visible; /* Make visible before animation starts */
        animation: ${dropdownFadeInSlideDown} 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
      `
    : css`
        /* If it was open and is now closing, play fade-out */
        /* This logic is tricky with pure CSS without an extra "isClosing" state.
           The 'forwards' on dropdownFadeInSlideDown will keep it in the 'to' state.
           When $isOpen becomes false, we want to trigger the fade-out.
           A common way is to have default styles be the "closed" state, and add
           animation for "open". Then reverse isn't strictly needed, or manage it via JS.
        */
        animation: ${dropdownFadeOutSlideUp} 0.2s ease-out forwards;
        /* Note: If the component is unmounted when $isOpen is false, this animation might not play.
           For robust out-animations, libraries like Framer Motion or React Transition Group are often used.
           However, with 'forwards', it will stick to the final state of the last played animation.
           So when isOpen goes to false, it will try to play dropdownFadeOutSlideUp.
        */
      `}
`;

export const AccountDropdownHeader = styled.div`
  padding: ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(4)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};

  img.user-avatar { /* Style for user avatar if provided */
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid ${({theme}) => theme.colors.mediumGray};
  }

  .user-info {
    text-align: left;
  }

  .user-name {
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.base};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    color: ${({ theme }) => theme.colors.textDark};
    margin: 0;
  }
  .user-role-or-email { /* For displaying "View Profile" or role under name */
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.xsmall};
    color: ${({ theme }) => theme.colors.textMedium};
    margin: 0;
  }
`;

export const AccountDropdownList = styled.ul`
  list-style: none;
  padding: ${({ theme }) => theme.spacing(1)} 0; /* Vertical padding for the list before first/after last item */
  margin: 0;
  max-height: calc(100vh - 200px); /* Generous max height, ensure it doesn't go off-screen */
  overflow-y: auto;

  /* Elegant Scrollbar for Élan */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent; /* Track blends with dropdown background */
    margin: ${({ theme }) => theme.spacing(1)} 0;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.mediumGray}; /* Subtle scrollbar thumb */
    border-radius: ${({ theme }) => theme.borderRadius.pill};
    border: 1px solid ${({ theme }) => theme.colors.backgroundLight}; /* Border around thumb for definition */
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.darkGray};
  }
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.mediumGray} transparent;
`;

// --- BEAUTIFUL & STUNNING Dropdown Item ---
export const AccountDropdownItem = styled.li<{ $isDestructive?: boolean }>`
  position: relative; // For the ::after pseudo-element border
  margin: 0 ${({ theme }) => theme.spacing(1.5)}; /* Horizontal margin to give items slight inset from container edge */
  
  // The clickable link or button within the list item
  & > a, 
  & > button {
    display: flex;
    align-items: center;
    width: 100%; // Full width of the li
    padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(3.5)}; // Balanced, generous padding
    
    font-family: ${({ theme }) => theme.typography.body.fontFamily};
    font-size: ${({ theme }) => theme.typography.body.sizes.base}; /* Base size for clarity & elegance */
    font-weight: ${({ theme }) => theme.typography.body.weights.medium};
    color: ${({ theme, $isDestructive }) => 
        $isDestructive ? (theme.colors.error || theme.colors.adminStatusError) : theme.colors.textDark};
    
    text-decoration: none;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: ${({ theme }) => theme.borderRadius.medium}; // Apply radius to the interactive element

    transition: background-color 0.2s ease-out, 
                color 0.2s ease-out, 
                transform 0.15s ease-out; // Added transform transition

    svg { /* Icon within the item */
      font-size: 1.05em; /* Slightly larger than text */
      color: ${({ theme, $isDestructive }) => 
        $isDestructive ? 'currentColor' : theme.colors.textMedium}; // Inherit or muted
      margin-right: ${({ theme }) => theme.spacing(2.5)}; // Space between icon and text
      transition: color 0.2s ease-out, transform 0.2s ease-out;
      flex-shrink: 0;
    }

    &:hover {
      background-color: ${({ theme }) => transparentize(0.94, theme.colors.accent1)}; /* Very subtle accent background */
      color: ${({ theme, $isDestructive }) => 
        $isDestructive ? darken(0.1, theme.colors.error || theme.colors.adminStatusError) : theme.colors.accent1};
      /* transform: translateX(3px); // Subtle horizontal shift */

      svg {
        color: ${({ theme, $isDestructive }) => 
          $isDestructive ? darken(0.1, theme.colors.error || theme.colors.adminStatusError) : theme.colors.accent1};
        /* transform: scale(1.05); // Subtle icon grow */
      }
    }

    &:focus-visible {
      outline: none;
      background-color: ${({theme}) => transparentize(0.9, theme.colors.accentFocus || theme.colors.accent1)};
      color: ${({theme}) => theme.colors.accentFocus || theme.colors.accent1};
      box-shadow: 0 0 0 2px ${({theme}) => theme.colors.backgroundLight}, 0 0 0 4px ${({theme}) => theme.colors.accentFocus || theme.colors.accent1}; /* Elegant focus ring */
      
      svg {
          color: ${({theme}) => theme.colors.accentFocus || theme.colors.accent1};
      }
    }
  }

  /* Subtle Bottom Border using ::after for better control and no impact on padding */
 &:not(:last-child):not(:nth-last-child(3))::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${({ theme }) => theme.spacing(4)};  /* Start border after icon space + padding */
    right: ${({ theme }) => theme.spacing(4)}; 
    height: 1px;
    background-color: ${({ theme }) => theme.colors.lightGray};
    opacity: 0.7; 
  }
  :nth-last-child(2)::after {
    border: none;
    content: "";
  }
  
`;

export const AccountDropdownSeparator = styled.li`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lightGray};
  margin: ${({ theme }) => theme.spacing(1.5)} ${({ theme }) => theme.spacing(4)}; // Horizontal margin to match item padding
  list-style: none; // Ensure it doesn't get list bullets
`;
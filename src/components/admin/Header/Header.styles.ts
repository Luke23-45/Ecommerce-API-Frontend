// src/components/Admin/Header/Header.styles.ts
import styled, { css,type DefaultTheme, keyframes } from 'styled-components';
import { rgba, darken } from 'polished';

// --- Keyframes for subtle animations ---
const iconHoverPop = keyframes`
    from { transform: translateY(0) scale(1); }
    to { transform: translateY(-3px) scale(1.1); }
`;

export const AdminHeaderContainer = styled.header`
    height: 68px; /* Slightly taller for more presence and spacing */
    background-color: ${(props) => rgba(props.theme.colors.adminSurface, 0.95)}; /* Semi-transparent white */
    backdrop-filter: blur(8px); /* Frosted glass effect for elegance */
    border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${(props) => props.theme.spacing(8)}; /* More generous side padding */
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05); /* Softer, deeper shadow */
    transition: background-color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease; /* Smooth transitions */

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        padding: 0 ${(props) => props.theme.spacing(4)};
        height: 60px; /* Adjust height for tablet */
        backdrop-filter: blur(5px); /* Less blur on smaller screens */
    }
`;

export const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(6)}; /* Increased gap for visual breathing room */

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        gap: ${(props) => props.theme.spacing(3)};
    }
`;

export const AdminLogo = styled.div`
    font-family: ${(props) => props.theme.typography.heading.fontFamily}; /* Élan's primary heading font */
    font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => props.theme.typography.heading.weights.bold};
    color: ${(props) => props.theme.colors.adminText};
    letter-spacing: -0.5px; /* Slight tightening for logo */
    white-space: nowrap; /* Prevent logo wrapping */

    a {
        text-decoration: none;
        color: inherit;
        transition: color 0.2s ease-out;
        &:hover {
            color: ${(props) => props.theme.colors.accent1}; /* Subtle brand color hint on hover */
        }
    }
    
    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
    }
`;

export const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(6)}; /* Generous gap for right-side elements */

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        gap: ${(props) => props.theme.spacing(3)};
    }
`;

// Elevated IconLink styling
export const IconLink = styled.a`
    color: ${(props) => props.theme.colors.adminTextSecondary};
    font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${(props) => props.theme.spacing(2)}; /* Larger clickable area, more balanced padding */
    border-radius: 50%; /* Circle shape for elegance */
    background-color: transparent;
    transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1); /* Smooth transitions */

    &:hover {
        color: ${(props) => props.theme.colors.accent1}; /* Brand accent on hover */
        background-color: ${(props) => rgba(props.theme.colors.accent1, 0.08)}; /* Lighter tint on hover */
        transform: translateY(-2px); /* Subtle lift */
    }
    
    svg {
        display: block;
        transition: transform 0.2s ease-out; /* Icon transform transition */
    }
    &:hover svg {
        animation: ${iconHoverPop} 0.4s ease-out; /* Gentle pop on icon */
    }

    /* Optional: Hide on mobile or combine into a single "More" menu for better mobile UX */
    @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
        /* Example: display: none; for some icons on very small screens */
    }
`;

export const UserProfile = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(3)}; /* Space between avatar and name */
    cursor: pointer;
    padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(3)}; /* Clickable area padding */
    border-radius: 50px; /* Pill shape for elegance */
    background-color: transparent;
    transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);

    &:hover {
        background-color: ${(props) => props.theme.colors.adminSecondaryBg};
        box-shadow: 0 2px 10px rgba(0,0,0,0.05); /* Subtle shadow on hover */
        transform: translateY(-2px); /* Lift effect */
    }

    img {
        width: 38px; /* Slightly larger avatar */
        height: 38px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid ${(props) => props.theme.colors.adminBorder}; /* Thicker border for avatar */
        transition: border-color 0.2s ease-out;
        &:hover & {
            border-color: ${(props) => props.theme.colors.accent1}; /* Accent border on hover */
        }
    }

    span {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.dataCell}; /* Clearer size for name */
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold}; /* Bolder for name */
        color: ${(props) => props.theme.colors.adminText};
        white-space: nowrap;
        @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
            display: none; /* Hide name on small screens */
        }
    }
`;

// Revamped Search Input Container for dynamism
export const SearchInputContainer = styled.div<{ $isExpanded: boolean }>`
    position: relative;
    width: ${(props) => props.$isExpanded ? '280px' : '40px'}; /* Expands to 280px, compacts to 40px (icon only) */
    transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); /* Smooth width transition */
    flex-shrink: 0; /* Prevents shrinking on smaller screens when expanded */

    input {
        width: 100%;
        padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(4)} ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(11)}; /* Adjusted padding for larger icon & text */
        border: 1px solid ${(props) => props.theme.colors.adminBorder};
        border-radius: 25px; /* Pill shape for input */
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.dataCell};
        background-color: ${props => props.$isExpanded ? props.theme.colors.adminSurface : 'transparent'}; /* Transparent when collapsed */
        color: ${props => props.theme.colors.adminText};
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        
        /* Visually hide placeholder/text when collapsed, without removing it from DOM */
        opacity: ${(props) => props.$isExpanded ? 1 : 0};
        visibility: ${(props) => props.$isExpanded ? 'visible' : 'hidden'};
        padding-left: ${(props) => props.$isExpanded ? props.theme.spacing(11) : props.theme.spacing(3)}; /* Adjust icon padding */
        
        @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
            font-size: ${(props) => props.theme.typography.admin.sizes.small};
        }
    }

    svg { /* Search icon */
        position: absolute;
        left: ${(props) => props.theme.spacing(4)}; /* Consistent left position for icon */
        top: 50%;
        transform: translateY(-50%);
        color: ${(props) => props.$isExpanded ? props.theme.colors.adminTextSecondary : props.theme.colors.adminText}; /* Color changes with state */
        font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        cursor: pointer;
    }

    /* Mobile specific behavior */
@media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
  width: ${(props) => (props.$isExpanded ? '240px' : '36px')}; /* Smaller sizes for tablet */
  
  input {
    padding-left: ${(props) =>
      props.$isExpanded ? props.theme.spacing(10) : props.theme.spacing(3)};
    font-size: ${(props) => props.theme.typography.admin.sizes.small};
  }

  svg {
    left: ${(props) => (props.$isExpanded ? props.theme.spacing(3) : '50%')};
    transform: ${(props) =>
      props.$isExpanded ? 'translateY(-50%)' : 'translate(-50%, -50%)'};
  }
}

`;
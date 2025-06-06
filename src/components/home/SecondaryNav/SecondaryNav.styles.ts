// src/components/home/SecondaryNav/SecondaryNav.styles.ts
import styled, { type DefaultTheme, css, keyframes } from 'styled-components';
import { rgba, lighten, darken, transparentize } from 'polished'; 


const megaMenuFadeInSlideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-15px); 
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const SecondaryNavWapper = styled.div `
  

        display: flex;
    justify-content: space-between;
    align-items: center;
          
    width: 100%;
  
    max-width: ${(props) => props.theme.maxWidth};
    margin: 0 auto;  
`

export const SecondaryNavContainer = styled.nav`
    background-color: ${({ theme }) => theme.colors.backgroundLight}; 
  height: 64px; 
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  display: flex;
    align-items: center;
    padding: 0 ${(props) => props.theme.containerPadding};
    box-shadow: ${({ theme }) => theme.shadows.sm}; 

    transition: box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out; 
  

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        height: 56px;
        padding: 0 ${(props) => props.theme.spacing(3)}; 
        top: 60px; 
        box-shadow: ${({ theme }) => theme.shadows.xs};
    }
`;

export const HamburgerWrapper = styled.button`
    background: none;
    display: block;
    border: none;
    padding: ${({ theme }) => theme.spacing(2)};
    margin-left: -${({ theme }) => theme.spacing(2)};
    cursor: pointer;
    color: ${(props) => props.theme.colors.textDark};
    font-size: 1.3rem;
    display: flex; 
    align-items: center;
    justify-content: center;
    border-radius: ${({ theme }) => theme.borderRadius.medium};
    transition: color 0.2s ease-out, background-color 0.2s ease-out;

    &:hover {
        color: ${(props) => props.theme.colors.accent1};
        background-color: ${(props) => transparentize(0.9, props.theme.colors.accent1)};
    }
    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.colors.accent1};
        outline-offset: 2px;
    }

    @media (min-width: calc(${(props) => props.theme.breakpoints.tablet} + 1px)) {
      /* Optionally hide hamburger on desktop if MainNavLinkList is shown */
      /* display: none; */
    }
`;

export const MainNavLinkList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: stretch;
    height: 100%; 
    gap: ${(props) => props.theme.spacing(6)}; 

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        display: none; 
    }
`;

export const MainNavLinkItem = styled.li`
    position: relative;
    display: flex;
    align-items: center; 
    height: 100%; 


  
    & > a {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 ${({ theme }) => theme.spacing(1)}; 
        position: relative;
        font-family: ${({ theme }) => theme.typography.body.fontFamily}; 
        font-size: ${({ theme }) => theme.typography.body.sizes.base};
        font-weight: ${({ theme }) => theme.typography.body.weights.medium}; 
        text-transform: uppercase;
        letter-spacing: 1px; 
        color: ${(props) => props.theme.colors.textMedium}; 
        text-decoration: none;
        transition: color 0.2s ease-in-out;
        
        &::after { 
            content: '';
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 2px;
            background-color: ${(props) => props.theme.colors.accent1};
            transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
        }
    }

    &:hover > a, &.active > a { 
        color: ${(props) => props.theme.colors.accent1};
        &::after {
        
            width: calc(100% - ${({ theme }) => theme.spacing(2)}); 
        }
    }
`;


export const MegaMenuContainer = styled.div<{ $isVisible: boolean }>`
    position: fixed; 
    top: calc(72px + 88px); 
    right: 0;
    width: 100%;
    min-height: 300px; /* Increased min-height */
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    box-shadow: ${({ theme }) => theme.shadows.lg}; /* Softer, larger shadow */
    border-top: 1px solid ${({ theme }) => theme.colors.lightGray}; /* Separator from nav */
    
    padding: ${(props) => props.theme.spacing(6)} ${(props) => props.theme.containerPadding}; /* Generous padding */
    
    opacity: ${(props) => (props.$isVisible ? 1 : 0)};
    visibility: ${(props) => (props.$isVisible ? 'visible' : 'hidden')};
    transform: translateY(${(props) => (props.$isVisible ? '0' : '-10px')});
    transition: opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
                transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
                visibility 0s linear ${(props) => (props.$isVisible ? '0s' : '0.3s')};
    z-index: ${({ theme }) => theme.zIndex.megaMenu || 900}; 


     ${(props) => props.$isVisible && css`animation: ${megaMenuFadeInSlideDown} 0.3s ease-out forwards;`} 
    
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); 
    gap: ${(props) => props.theme.spacing(5)};

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        display: none; 
    }
`;

export const MegaMenuColumn = styled.div`
    display: flex;
  
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(1.5)}; 
  
    h3 { 
        font-family: ${({ theme }) => theme.typography.heading.fontFamily}; 
        font-size: ${({ theme }) => theme.typography.body.sizes.medium}; 
        font-weight: ${({ theme }) => theme.typography.heading.weights.bold};
        color: ${({ theme }) => theme.colors.textDark};
        margin: 0 0 ${(props) => props.theme.spacing(1)} 0; 
        padding-bottom: ${({ theme }) => theme.spacing(1)};
        border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
        text-transform: uppercase;
        letter-spacing: 0.75px;
    }

    a { 
        font-family: ${({ theme }) => theme.typography.body.fontFamily}; // Inter
        font-size: ${({ theme }) => theme.typography.body.sizes.base};
        color: ${(props) => props.theme.colors.textMedium}; // Softer link color
        text-decoration: none;
        padding: ${({ theme }) => theme.spacing(1)} 0; // Vertical padding for better click area
        transition: color 0.2s ease-out, padding-left 0.2s ease-out;

        &:hover {
            color: ${(props) => props.theme.colors.accent1};
            padding-left: ${({ theme }) => theme.spacing(1)}; // Subtle indent on hover
        }
    }
`;

export const PromoBlock = styled.div`

    background-color: ${({ theme }) => theme.colors.primaryNeutral}; 
    border-radius: ${({ theme }) => theme.borderRadius.large}; // Softer rounding
    padding: ${(props) => props.theme.spacing(4)};
    text-align: left; // Align text left for better readability
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start; // Align items to start
    box-shadow: ${({ theme }) => theme.shadows.sm}; 

    img {
        width: 100%; 
        max-height: 150px; // Control max height
        object-fit: cover;
        border-radius: ${({ theme }) => theme.borderRadius.medium};
        margin-bottom: ${(props) => props.theme.spacing(2.5)};
    }

    h4 { // Promo title
        font-family: ${({ theme }) => theme.typography.heading.fontFamily}; // Playfair
        font-size: ${({ theme }) => theme.typography.body.sizes.large}; // Use body.large from theme
        font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
        color: ${({ theme }) => theme.colors.textDark};
        margin-bottom: ${(props) => props.theme.spacing(1.5)};
    }

    p { // Promo text
        font-family: ${({ theme }) => theme.typography.body.fontFamily};
        font-size: ${({ theme }) => theme.typography.body.sizes.small};
        color: ${(props) => props.theme.colors.textMedium};
        margin-bottom: ${(props) => props.theme.spacing(3)};
        line-height: 1.6;
    }

    // Promo Link/Button
    a.promo-link { // Use a class for specific styling if needed

        display: inline-block;
        background-color: transparent; // Outline button style for Élan
        color: ${(props) => props.theme.colors.accent1};
        border: 1.5px solid ${(props) => props.theme.colors.accent1};
        padding: ${(props) => props.theme.spacing(1.5)} ${(props) => props.theme.spacing(3)};
        border-radius: ${({ theme }) => theme.borderRadius.pill}; // Pill shape
        font-weight: ${(props) => props.theme.typography.body.weights.semiBold};
        text-transform: uppercase;
        letter-spacing: 0.75px;
        text-decoration: none;
        transition: all 0.2s ease-out;

        &:hover {
            background-color: ${(props) => props.theme.colors.accent1};
            color: ${(props) => props.theme.colors.textLight};
            transform: translateY(-1px);
            box-shadow: ${({ theme }) => theme.shadows.xs};
        }
    }


    
`;
import styled, { css, keyframes, type DefaultTheme } from "styled-components";
import { rgba, darken, lighten, transparentize } from "polished";

// --- Keyframes ---
const imageFadeIn = keyframes`
  from { opacity: 0.6; }
  to { opacity: 1; }
`;

const lightboxModalFadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const lightboxOverlayFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// --- Main Gallery Container ---
export const GalleryWrapper = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-direction: row; /* Thumbnails on left, main image on right */
  gap: ${(props) => props.theme.spacing?.(3) || "24px"};
  width: 100%;
  max-width: 900px; /* Constrain max width for aesthetics */
  margin: 0 auto; /* Center the gallery */
  position: relative;

  @media (max-width: ${(props) =>
      props.theme.breakpoints?.mobileL || "600px"}) {
    flex-direction: column; /* Stack main image then thumbnails on mobile */
    gap: ${(props) => props.theme.spacing?.(2) || "16px"};
  }
`;

// --- Thumbnails Navigation (Vertical on the Left) ---
export const ThumbnailList = styled.div<{ theme: DefaultTheme }>`
  display: flex;
  flex-direction: column; /* Stack thumbnails vertically */
  gap: ${(props) => props.theme.spacing?.(2) || "16px"};
  padding: ${(props) => props.theme.spacing?.(0.5) || "4px"};
  flex: 0 0 90px; /* Fixed width for thumbnail column */
  max-height: 500px; /* Max height for thumbnail list */
  overflow-y: auto; /* Enable vertical scroll */
  overflow-x: hidden;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${(props) =>
      transparentize(0.8, props.theme.colors?.primaryNeutral || "#f1f1f1")};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${(props) =>
      transparentize(0.5, props.theme.colors?.primaryNeutral || "#888")};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${(props) =>
      transparentize(0.3, props.theme.colors?.primaryNeutral || "#555")};
  }

  @media (max-width: ${(props) => props.theme.breakpoints?.tablet || "768px"}) {
    flex: 0 0 75px;
    gap: ${(props) => props.theme.spacing?.(1.5) || "12px"};
    max-height: 450px;
  }

  @media (max-width: ${(props) =>
      props.theme.breakpoints?.mobileL || "600px"}) {
    order: 2; /* Thumbnails below main image on mobile */
    flex-direction: row; /* Switch to horizontal */
    overflow-x: auto;
    overflow-y: hidden;
    padding: ${(props) => props.theme.spacing?.(1.5) || "12px"} 0;
    max-height: none;
    width: 100%;
    flex: 0 0 auto; /* Reset flex-basis for horizontal layout */
    gap: ${(props) => props.theme.spacing?.(1.5) || "12px"};
  }
`;

export const ThumbnailItem = styled.button<{
  theme: DefaultTheme;
  $isActive: boolean;
}>`
  width: 100%;
  aspect-ratio: 1/1;
  background-color: ${(props) => props.theme.colors?.background || "#fff"};
  border-radius: ${(props) => props.theme.borderRadius?.medium || "8px"};
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  padding: 0;
  transition:
    border-color 0.25s ease-out,
    opacity 0.25s ease-out,
    transform 0.2s ease-out,
    box-shadow 0.25s ease-out;
  opacity: ${(props) => (props.$isActive ? 1 : 0.65)};
  position: relative;
  box-shadow: ${(props) =>
    props.theme.shadows?.extraSubtle || "0 1px 3px rgba(0,0,0,0.05)"};

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-out;
  }

  ${(props) =>
    props.$isActive &&
    css`
      border-color: ${props.theme.colors?.accent1 || "#007bff"};
      box-shadow: ${(props) =>
        props.theme.shadows?.extraSubtle ?? "0 1px 3px rgba(0, 0, 0, 0.05)"};

      opacity: 1;
    `}

  &:hover:not(:disabled) {
    opacity: 1;
    transform: scale(1.03);
    border-color: ${(props) =>
      transparentize(
        0.5,
        props.theme.colors?.accentHover ||
          props.theme.colors?.accent1 ||
          "#0056b3"
      )};
    box-shadow: ${(props) => `
  0 0 0 2px ${transparentize(
    0.7,
    props.theme.colors?.accentHover || props.theme.colors?.accent1 || "#0056b3"
  )},
  ${props.theme.shadows?.medium || "0 4px 8px rgba(0,0,0,0.15)"}
`};
  }

  &:focus-visible {
    outline: none;
    border-color: ${(props) => props.theme.colors?.accent1 || "#007bff"};
    box-shadow: ${(props) => `
  0 0 0 2px ${props.theme.colors?.background || "#fff"},
  0 0 0 4px ${props.theme.colors?.accent1 || "#007bff"}
`};
  }

  @media (max-width: ${(props) =>
      props.theme.breakpoints?.mobileL || "600px"}) {
    width: 70px;
    height: 70px;
    flex-shrink: 0;
  }
`;

// --- Main Image Display ---
export const MainImageContainer = styled.div<{ theme: DefaultTheme }>`
  position: relative;
  flex: 1;
  max-height: 700px;
  width: 90%;
  aspect-ratio: 4/3;
  background-color: ${(props) =>
    lighten(0.03, props.theme.colors?.primaryNeutral || "#f0f0f0")};
  border-radius: ${(props) => props.theme.borderRadius?.large || "12px"};
  overflow: hidden;
  cursor: zoom-in;
  box-shadow: ${(props) =>
    props.theme.shadows?.subtle || "0 2px 5px rgba(0,0,0,0.1)"};
  transition: box-shadow 0.3s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    box-shadow: ${(props) =>
      props.theme.shadows?.medium || "0 4px 8px rgba(0,0,0,0.15)"};
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: ${imageFadeIn} 0.5s ease-out;
    border-radius: inherit;
  }

  @media (max-width: ${(props) =>
      props.theme.breakpoints?.mobileL || "600px"}) {
    order: 1;
    width: 100%;
    max-height: 350px;
    aspect-ratio: 1/1;
  }
`;

// --- Lightbox/Modal for Zoomed Image ---
export const LightboxOverlay = styled.div<{
  theme: DefaultTheme;
  $isOpen: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${(props) =>
    transparentize(
      0.05,
      darken(0.5, props.theme.colors?.background || "#000000")
    )};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${(props) =>
    props.theme.spacing?.(2) || "16px"}; /* Add some padding to overlay */
  box-sizing: border-box; /* Ensure padding doesn't make it overflow viewport */
  z-index: ${(props) => props.theme.zIndex?.modalOverlay || 1000};
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0s linear ${(props) => (props.$isOpen ? "0s" : "0.35s")};
  backdrop-filter: blur(10px);
  animation: ${(props) =>
    props.$isOpen
      ? css`
          ${lightboxOverlayFadeIn} 0.35s cubic-bezier(0.4, 0, 0.2, 1)
        `
      : "none"};
`;

export const LightboxContent = styled.div<{
  theme: DefaultTheme;
  $isOpen: boolean;
}>`
  position: relative;
  width: 100%; /* Occupy padded space from LightboxOverlay */
  height: 100%; /* Occupy padded space from LightboxOverlay */
  /* Max width/height are implicitly handled by parent's (LightboxOverlay) padding */
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  .lightbox-image-wrapper {
    position: relative;
    animation: ${(props) =>
      props.$isOpen
        ? css`
            ${lightboxModalFadeIn} 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s
          `
        : "none"};
    animation-fill-mode: backwards;
    transform-origin: center;
    display: flex; /* Helps center the image if it's smaller than the wrapper */
    align-items: center;
    justify-content: center;
    border-radius: ${(props) => props.theme.borderRadius?.medium || "8px"};
    overflow: hidden; /* Crucial to clip the image if it tries to overflow */
    box-shadow: 0 20px 50px
      ${(props) => transparentize(0.7, props.theme.colors?.textDark || "#000")};

    /* Ensure this wrapper itself doesn't exceed the bounds of LightboxContent */
    max-width: 100%;
    max-height: 100%;
    box-sizing: border-box;

    img {
      display: block;
      /* Image scales to fit wrapper, object-fit:contain handles aspect ratio */
      max-width: 100%;
      max-height: 100%;
      object-fit: contain; /* This is key */
      border-radius: inherit; /* If wrapper is rounded */
      transition: opacity 0.3s ease-in-out;
      opacity: 1;
    }
  }

  .lightbox-image-changing {
    opacity: 0.3;
  }
`;

export const LightboxCloseButton = styled.button<{ theme: DefaultTheme }>`
  position: absolute;
  /* Positioned relative to LightboxContent which is now padded */
  top: ${(props) =>
    props.theme.spacing?.(0.5) ||
    "4px"}; /* Adjust based on LightboxOverlay padding */
  right: ${(props) =>
    props.theme.spacing?.(0.5) ||
    "4px"}; /* Adjust based on LightboxOverlay padding */

  background: ${(props) =>
    transparentize(0.2, props.theme.colors?.background || "#fff")};
  border: none;
  color: ${(props) => props.theme.colors?.textDark || "#333"};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${(props) => props.theme.spacing?.(1.5) || "12px"};
  border-radius: 50%;
  line-height: 0;
  z-index: 1006; /* Higher than arrows and image wrapper */
  opacity: 0.8;
  transition: all 0.25s ease-out;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    opacity: 1;
    transform: scale(1.1) rotate(90deg);
    background: ${(props) => props.theme.colors?.accent1 || "#007bff"};
    color: ${(props) => props.theme.colors?.textLight || "#fff"};
  }

  svg {
    display: block;
  }

  /* Mobile adjustments for close button if needed, current might be fine with overlay padding */
  @media (max-width: ${(props) =>
      props.theme.breakpoints?.mobileL || "600px"}) {
    font-size: 1.3rem;
    padding: ${(props) => props.theme.spacing?.(1.2) || "10px"};
    top: ${(props) => props.theme.spacing?.(1) || "8px"};
    right: ${(props) => props.theme.spacing?.(1) || "8px"};
  }
`;

const arrowBaseStyles = css<{ theme: DefaultTheme }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1005; /* Below close button, above image wrapper */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${(props) =>
    transparentize(0.7, props.theme.colors?.textDark || "#333")};
  border: 1px solid
    ${(props) => transparentize(0.9, props.theme.colors?.textLight || "#fff")};
  color: ${(props) => props.theme.colors?.textLight || "#fff"};
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover:not(:disabled) {
    opacity: 1;
    background-color: ${(props) =>
      transparentize(0.5, props.theme.colors?.textDark || "#333")};
    transform: translateY(-50%) scale(1.08);
    box-shadow: 0 0 15px
      ${(props) =>
        transparentize(0.8, props.theme.colors?.accent1 || "#007bff")};
  }

  &:active:not(:disabled) {
    transform: translateY(-50%) scale(0.95);
    background-color: ${(props) =>
      transparentize(0.4, props.theme.colors?.textDark || "#333")};
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
    background-color: ${(props) =>
      transparentize(0.9, props.theme.colors?.textDark || "#333")};
    border-color: ${(props) =>
      transparentize(0.95, props.theme.colors?.textLight || "#fff")};
  }

  &:focus-visible {
    outline: 2px solid ${(props) => props.theme.colors?.accent1 || "#007bff"};
    outline-offset: 3px;
    opacity: 1;
  }

  svg {
    display: block;
    width: 24px;
    height: 24px;
  }

  @media (max-width: ${(props) =>
      props.theme.breakpoints?.mobileL || "600px"}) {
    width: 40px;
    height: 40px;
    font-size: 1.1rem;
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const LightboxNavArrow = styled.button<{
  theme: DefaultTheme;
  $direction: "left" | "right";
  $isHidden?: boolean;
}>`
  ${arrowBaseStyles}
  ${({ theme, $direction }) =>
    $direction === "left"
      ? `left: ${theme.spacing?.(2.5) || "20px"};` /* Adjusted to be within overlay padding */
      : `right: ${theme.spacing?.(2.5) || "20px"};`} /* Adjusted to be within overlay padding */

  visibility: ${(props) => (props.$isHidden ? "hidden" : "visible")};
  pointer-events: ${(props) => (props.$isHidden ? "none" : "auto")};

  @media (max-width: ${(props) => props.theme.breakpoints?.tablet || "768px"}) {
    ${({ theme, $direction }) =>
      $direction === "left"
        ? `left: ${theme.spacing?.(2) || "16px"};`
        : `right: ${theme.spacing?.(2) || "16px"};`}
  }

  @media (max-width: ${(props) =>
      props.theme.breakpoints?.mobileL || "600px"}) {
    ${({ theme, $direction }) =>
      $direction === "left"
        ? `left: ${theme.spacing?.(1) || "8px"};`
        : `right: ${theme.spacing?.(1) || "8px"};`}
  }
`;

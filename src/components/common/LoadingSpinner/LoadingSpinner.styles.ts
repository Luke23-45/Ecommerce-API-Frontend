import styled, { keyframes, type DefaultTheme } from 'styled-components';

// Helper to get theme, ensuring robust access to theme properties
const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const SpinnerContainer = styled.div<{
  $size?: string;
  $color?: string;
  $thickness?: string;
  $inline?: boolean; // New prop for inline display
}>`
  display: ${props => props.$inline ? 'inline-block' : 'block'}; /* Default to block, allow inline */
  width: ${props => props.$size || '28px'}; /* Default size */
  height: ${props => props.$size || '28px'};
  border-style: solid;
  border-width: ${props => props.$thickness || '3px'};
  border-color: ${props => getTheme(props).colors?.adminBorderLight || getTheme(props).colors?.lightGray || 'rgba(0, 0, 0, 0.1)'}; /* More robust fallback */
  border-top-color: ${props => props.$color || getTheme(props).colors?.accent1 || '#007bff'}; /* Spinner color */
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  box-sizing: border-box; /* Ensure border is within width/height */
`;

export const SpinnerWithMessageContainer = styled.div<{ $center?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: ${props => props.$center ? 'center' : 'flex-start'};
    justify-content: ${props => props.$center ? 'center' : 'flex-start'};
    gap: ${(props) => getTheme(props).spacing(2)};
    padding: ${(props) => getTheme(props).spacing(3)} 0; /* Default padding, can be overridden */
    color: ${(props) => getTheme(props).colors?.adminTextSecondary || '#6c757d'};
    font-family: ${(props) => getTheme(props).typography?.admin?.fontFamily || 'sans-serif'};
    text-align: ${props => props.$center ? 'center' : 'left'};
`;

export const SpinnerText = styled.span`
    font-size: ${(props) => getTheme(props).typography?.admin?.sizes?.small || '0.875rem'};
    line-height: 1.4;
`;
export const FullscreenSpinnerWrapper = styled.div`
  position: fixed; // Or 'absolute' if you want it to center within a relative parent
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7); // A semi-transparent white backdrop
  z-index: 9999; // Ensure it's on top of everything
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;
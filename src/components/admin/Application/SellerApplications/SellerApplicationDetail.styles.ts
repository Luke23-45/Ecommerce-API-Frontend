import styled, {css, type DefaultTheme, keyframes } from 'styled-components';
import { rgba } from 'polished';

// const getTheme = (props: { theme: DefaultTheme }) => props.theme; // Access props.theme directly

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(6)};
    opacity: 0;
    animation: ${fadeIn} 0.5s ease-out forwards;
`;

export const DetailHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start; // Align items to start for multiline title/actions
    gap: ${(props) => props.theme.spacing(4)};
    padding-bottom: ${(props) => props.theme.spacing(4)};
    border-bottom: 1px solid ${(props) => props.theme.colors.adminBorder};
    margin-bottom: ${(props) => props.theme.spacing(2)}; // Reduced margin to next element

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        flex-direction: column;
        align-items: stretch;
    }
`;

export const HeaderInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(1)};
    
    h2 {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.moduleTitle};
        font-weight: ${(props) => props.theme.typography.admin.weights.bold};
        color: ${(props) => props.theme.colors.adminText};
        margin: 0;
    }

    .applicant-id {
        font-size: ${(props) => props.theme.typography.admin.sizes.small};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        font-family: monospace;
    }
`;

export const HeaderActions = styled.div`
    display: flex;
    gap: ${(props) => props.theme.spacing(3)};
    flex-shrink: 0; // Prevent shrinking on smaller screens before wrapping

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
        width: 100%;
        justify-content: flex-start; // Align buttons to the start on mobile
    }
`;

export const DetailLayout = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr; /* Main content | Sidebar */
    gap: ${(props) => props.theme.spacing(6)};

    @media (max-width: ${(props) => props.theme.breakpoints.laptop}) {
        grid-template-columns: 1fr; /* Stack columns on smaller screens */
    }
`;

export const MainContentColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(5)};
`;

export const SidebarContentColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(5)};
`;

// Re-using InfoBox style structure (could be a shared component)
export const InfoBox = styled.div`
    background-color: ${(props) => props.theme.colors.adminSurface};
    border-radius: 12px;
    padding: ${(props) => props.theme.spacing(5)};
    box-shadow: 0 3px 10px rgba(0,0,0,0.04);
`;

export const InfoSectionTitle = styled.h3`
    font-family: ${(props) => props.theme.typography.admin.fontFamily};
    font-size: ${(props) => props.theme.typography.admin.sizes.sectionTitle};
    font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    color: ${(props) => props.theme.colors.adminText};
    margin-bottom: ${(props) => props.theme.spacing(4)};
    padding-bottom: ${(props) => props.theme.spacing(2)};
    border-bottom: 1px solid ${(props) => props.theme.colors.adminBorderLight || props.theme.colors.adminBorder}; /* Use a lighter border if available */
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(2)};
`;

export const InfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${(props) => props.theme.spacing(4)} ${(props) => props.theme.spacing(5)}; /* row gap, column gap */
`;

export const InfoItem = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(1)};

    label {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.label};
        font-weight: ${(props) => props.theme.typography.admin.weights.medium};
        color: ${(props) => props.theme.colors.adminTextSecondary};
        text-transform: uppercase;
        letter-spacing: 0.3px;
    }

    p, span {
        font-family: ${(props) => props.theme.typography.admin.fontFamily};
        font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
        color: ${(props) => props.theme.colors.adminText};
        word-break: break-word; /* Prevent long strings from breaking layout */
    }

    .boolean-true {
        color: ${(props) => props.theme.colors.adminStatusSuccess};
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    }
    .boolean-false {
        color: ${(props) => props.theme.colors.adminStatusError};
         font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    }
`;

export const DocumentLink = styled.a`
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.spacing(2)};
    color: ${(props) => props.theme.colors.accent1};
    text-decoration: none;
    font-weight: ${(props) => props.theme.typography.admin.weights.medium};
    
    &:hover {
        text-decoration: underline;
        color: ${(props) => darken(0.1, props.theme.colors.accent1)};
    }
`;

export const CurrentStatusDisplay = styled.div`
    margin-bottom: ${(props) => props.theme.spacing(4)};
    padding: ${(props) => props.theme.spacing(3)};
    background-color: ${(props) => rgba(props.theme.colors.adminSecondaryBg, 0.5)};
    border-radius: 8px;
    border: 1px solid ${(props) => props.theme.colors.adminBorder};
    
    strong {
        margin-right: ${(props) => props.theme.spacing(2)};
        font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
    }
`;

export const ActionPanel = styled.div`
    margin-top: ${(props) => props.theme.spacing(3)};
    display: flex;
    flex-direction: column;
    gap: ${(props) => props.theme.spacing(3)};

    select { // Style for AdminSelect if used directly for status change
        margin-bottom: ${(props) => props.theme.spacing(2)};
    }
`;


const commonInputStyles = css`
  width: 100%;

  padding: ${(props) => props.theme.spacing(2.5)} ${(props) => props.theme.spacing(4)};
  border: 1px solid ${(props) => props.theme.colors.adminBorder};
  border-radius: ${(props) => props.theme.borderRadius.medium};
  font-family: ${(props) => props.theme.typography.admin.fontFamily};
  font-size: ${(props) => props.theme.typography.admin.sizes.bodyBase};
  color: ${(props) => props.theme.colors.adminText};
  background-color: ${(props) => props.theme.colors.adminSurface};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  box-sizing: border-box;

  &::placeholder {
    color: ${(props) => props.theme.colors.adminTextSecondary};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.accent1};
    box-shadow: 0 0 0 3px ${(props) => rgba(props.theme.colors.accent1, 0.2)};
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.adminTextDisabled};
    color: ${(props) => props.theme.colors.adminTextDisabled};
    cursor: not-allowed;
  }

  // Example error state styling (using a transient prop like $error)
  ${(props: { $error?: boolean; theme: DefaultTheme }) => // Ensure theme is part of the prop type for $error
    props.$error &&
    css`
      border-color: ${props.theme.colors.adminStatusError};
      &:focus {
        box-shadow: 0 0 0 3px ${rgba(props.theme.colors.adminStatusError, 0.2)};
      }
    `}
`;

export const BasicInput = styled.input<{ $error?: boolean }>` // Propagate $error if needed
  ${commonInputStyles}
`;

export const BasicTextarea = styled.textarea<{ $error?: boolean }>` // Propagate $error if needed
  ${commonInputStyles}
  resize: vertical;
  min-height: 80px;
  line-height: 1.6;
`;

export const FormControlWrapper = styled.div`
  margin-bottom: ${(props) => props.theme.spacing(4)};
  width: 100%;
`;

export const FormLabel = styled.label`
  display: block;
  font-family: ${(props) => props.theme.typography.admin.fontFamily};
  font-size: ${(props) => props.theme.typography.admin.sizes.small};
  font-weight: ${(props) => props.theme.typography.admin.weights.semiBold};
  color: ${(props) => props.theme.colors.adminText};
  margin-bottom: ${(props) => props.theme.spacing(1.5)};
  cursor: default;
`;

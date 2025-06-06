import { darken, lighten, transparentize } from "polished";
import styled, { keyframes } from "styled-components";

const colors = {
  primaryBlue: "#007bff",
  primaryGreen: "#28a745",
  dangerRed: "#dc3545",
  white: "#ffffff",
  black: "#000000",
  grey: "#6c757d",
  lightGrey: "#f8f9fa",
  borderGrey: "#ccc",
  textDark: "#343a40",
};

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 400px;
  margin: 0 auto;
  padding: 30px;
  border: 1px solid ${colors.borderGrey};
  border-radius: 8px;
  background-color: ${colors.lightGrey};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 20px;
    color: ${colors.textDark};
  }
`;

export const FormField = styled.div`
  width: 100%;
`;

export const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: ${colors.textDark};
  font-size: 1em;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
  transition:
    border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;

  &:focus {
    border-color: ${colors.primaryBlue};
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: none;
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

export const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
  background-color: ${colors.white};
  cursor: pointer;

  &:focus {
    border-color: ${colors.primaryBlue};
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: none;
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;

export const ErrorMessage = styled.p`
  color: ${colors.dangerRed};
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 0.9em;
`;

export const SuccessMessage = styled.p`
  color: ${colors.primaryGreen};
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 0.9em;
`;

export const SubmitButton = styled.button`
  padding: 12px 20px;
  background-color: ${colors.primaryBlue};
  color: ${colors.white};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: bold;
  transition:
    background-color 0.2s ease-in-out,
    opacity 0.2s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: ${colors.grey};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const SecondaryButton = styled.button`
  background: none;
  border: none;
  color: ${colors.primaryBlue};
  cursor: pointer;
  font-size: 0.9em;
  text-decoration: underline;
  transition:
    color 0.2s ease-in-out,
    opacity 0.2s ease-in-out;

  &:hover:not(:disabled) {
    color: #0056b3;
  }

  &:disabled {
    color: ${colors.grey};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
`;
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`
export const SeparatorText = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted || theme.colors.grey}; // Use textMuted if available
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  margin: ${({ theme }) => theme.spacing(2)} 0 ${({ theme }) => theme.spacing(0)};

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray || theme.colors.borderGrey};
  }

  &:not(:empty)::before {
    margin-right: .75em;
  }

  &:not(:empty)::after {
    margin-left: .75em;
  }
`;

export const BecomePartnerSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing(8)};
  padding: ${({ theme }) => theme.spacing(6)};
  background-color: ${({ theme }) => lighten(0.03, theme.colors.primaryNeutral || '#FDFBF8')}; // A very light, warm background: ;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.lightGray}; // Subtle border
  animation: ${fadeInUp} 0.5s ease-out 0.3s backwards; // Assuming fadeInUp is defined
`;

export const BecomePartnerHeadline = styled.h3`
  font-family: ${({ theme }) => theme.typography.heading.fontFamily}; // Playfair Display
  font-size: ${({ theme }) => theme.typography.heading.sizes.h4}; // e.g., 1.5rem
  color: ${({ theme }) => theme.colors.textDark};
  font-weight: ${({ theme }) => theme.typography.heading.weights.semiBold};
  margin: 0 0 ${({ theme }) => theme.spacing(2)} 0;
`;

export const BecomePartnerText = styled.p`
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  color: ${({ theme }) => theme.colors.textMedium};
  line-height: 1.6;
  margin: 0 auto ${({ theme }) => theme.spacing(5)};
  max-width: 450px; // Constrain width for readability
`;

// You can reuse your existing AuthSubmitButton or FrontendButton style
// Or create a specific one if the style needs to differ
export const PartnerCtaButton = styled.button`
  /* Re-using styles similar to PrimaryCtaButton from BecomeAPartnerPage */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(5)};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  cursor: pointer;
  transition: all 0.25s ease-out;
  border: 1.5px solid;
  min-width: 200px; 
  text-decoration: none;

  background-color: ${({ theme }) => theme.colors.accent2 || '#8DA382'}; /* Using Élan's Sage Green */
  color: ${({ theme }) => theme.colors.textLight};
  border-color: ${({ theme }) => theme.colors.accent2 || '#8DA382'};
  box-shadow: ${({ theme }) => theme.shadows?.sm || '0 2px 4px rgba(0,0,0,0.05)'};

  svg {
    margin-right: ${({ theme }) => theme.spacing(2)};
    font-size: 1.1em;
  }

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => darken(0.07, theme.colors.accent2 || '#8DA382')};
    border-color: ${({ theme }) => darken(0.07, theme.colors.accent2 || '#8DA382')};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows?.md || '0 4px 10px rgba(0,0,0,0.1)'};
  }
   &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; box-shadow: none; }
`;


export const BecomeSellerPrompt = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(0)};
  padding-top: ${({ theme }) => theme.spacing(0)};
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  animation: ${fadeInUp} 0.6s ease-out 0.5s backwards; // Staggered entrance

  p {
    font-size: ${({ theme }) => theme.typography.body.sizes.base};
    color: ${({ theme }) => theme.colors.textMedium};
    margin: 0 0 ${({ theme }) => theme.spacing(2.5)} 0;
  }

  a { 
    display: inline-flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing(1.5)};
    font-size: ${({ theme }) => theme.typography.body.sizes.base};
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    color: ${({ theme }) => theme.colors.accent2}; /* Using Élan's Sage Green for this distinct CTA */
    text-decoration: none;
    padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(4)};
    border: 1.5px solid ${({ theme }) => theme.colors.accent2};
    border-radius: ${({ theme }) => theme.borderRadius.pill};
    transition: all 0.2s ease-out;

    &:hover {
      background-color: ${({ theme }) => transparentize(0.9, theme.colors.accent2)};
      color: ${({ theme }) => darken(0.05, theme.colors.accent2)};
      transform: translateY(-1px);
    }
  }
`;

export const SingleLinePartnerPrompt = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing(1)}; 
  padding-top: ${({ theme }) => theme.spacing(0)}; /* Optional: Add padding if there's a border-top */
  /* border-top: 1px solid ${({ theme }) => theme.colors.lightGray}; // Optional: subtle separator line */
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small}; /* Consistent small text size */
  color: ${({ theme }) => theme.colors.textMedium};

  a { 
    color: ${({ theme }) => theme.colors.accent1}; /* Élan accent color */
    font-weight: ${({ theme }) => theme.typography.body.weights.semiBold};
    text-decoration: none; // No underline by default
    margin-left: ${({ theme }) => theme.spacing(1)};
    transition: color 0.2s ease-out, text-decoration 0.2s ease-out;

    &:hover {
      color: ${({ theme }) => darken(0.1, theme.colors.accent1)};
      text-decoration: underline; // Underline on hover
    }
  }
`;


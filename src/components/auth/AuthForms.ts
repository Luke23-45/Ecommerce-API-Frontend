import styled from "styled-components";

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

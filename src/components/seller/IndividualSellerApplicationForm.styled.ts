
import styled from 'styled-components';
import {
    StyledForm,
    FormField,
    StyledLabel,
    StyledInput,
    SubmitButton,
    ErrorMessage,
    SuccessMessage,
    StyledSelect, 
} from '@/components/auth/AuthForms'; 


export {
    StyledForm,
    FormField,
    StyledLabel,
    StyledInput,
    SubmitButton,
    ErrorMessage,
    SuccessMessage,
    StyledSelect,
};



export const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 1em;
  min-height: 80px;
  resize: vertical;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: none;
  }

  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
    opacity: 0.8;
  }
`;


export const FormSectionTitle = styled.h3`
  margin-top: 25px;
  margin-bottom: 15px;
  color: #343a40;
  border-bottom: 1px solid #ddd;
  padding-bottom: 8px;
  font-size: 1.2em;
`;


export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  input[type="checkbox"] {
    margin-right: 10px;
    transform: scale(1.2);
  }

  label {
    font-size: 0.95em;
    color: #343a40;
  }
`;


export const FormRow = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;

  ${FormField} {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;
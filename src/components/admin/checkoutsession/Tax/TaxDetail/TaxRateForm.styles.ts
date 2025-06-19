// src/components/Admin/Settings/Taxes/TaxRateForm.styles.ts
import styled, { type DefaultTheme, css, keyframes } from "styled-components";
import { rgba, darken } from "polished";

const getTheme = (props: { theme: DefaultTheme }) => props.theme;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const TaxRateFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(props) => getTheme(props).spacing(5)};
  opacity: 0;
  animation: ${fadeIn} 0.5s ease-out forwards;
  animation-delay: 0.1s;
  padding-bottom: 130px; // Space for sticky action bar
`;

export const FormHeader = styled.div`
  background-color: ${(props) =>
    getTheme(props).colors.adminSurface || "#FFFFFF"};
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  padding: ${(props) => getTheme(props).spacing(4)}
    ${(props) => getTheme(props).spacing(6)};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${(props) => getTheme(props).spacing(3)};

  @media (max-width: ${(props) =>
      getTheme(props).breakpoints.tablet || "768px"}) {
    padding: ${(props) => getTheme(props).spacing(3)}
      ${(props) => getTheme(props).spacing(4)};
    border-radius: 0;
    box-shadow: none;
  }
`;

export const FormTitle = styled.h2`
  font-family: ${(props) =>
    getTheme(props).typography.admin?.fontFamily || "sans-serif"};
  font-size: ${(props) =>
    getTheme(props).typography.admin?.sizes?.sectionTitle || "1.75rem"};
  font-weight: ${(props) =>
    getTheme(props).typography.admin?.weights?.bold || 700};
  color: ${(props) => getTheme(props).colors.adminText || "#333333"};
  margin: 0;
`;

export const ActualForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${(props) => getTheme(props).spacing(6)};
`;

export {
  FormStickyActionBar,
  FormAlert,
  FieldHelperText,
} from "@/components/Categories/CategoryForm.styles";

export const ReactSelectStyles = (theme: DefaultTheme) => ({
  control: (provided: any, state: { isFocused: boolean }) => ({
    ...provided,
    minHeight: "42px", // Match your AdminInput height
    borderColor: state.isFocused
      ? theme.colors.accent1
      : theme.colors.adminBorder,
    boxShadow: state.isFocused ? `0 0 0 1px ${theme.colors.accent1}` : "none",
    borderRadius: "8px",
    backgroundColor: theme.colors.adminSecondaryBg,
    "&:hover": {
      borderColor: state.isFocused
        ? theme.colors.accent1
        : darken(0.1, theme.colors.adminBorder),
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "8px",
    backgroundColor: theme.colors.adminSurface,
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    zIndex: 10, // Ensure dropdown is above other elements
  }),
  option: (
    provided: any,
    state: { isSelected: boolean; isFocused: boolean }
  ) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? theme.colors.accent1
      : state.isFocused
      ? rgba(theme.colors.accent1, 0.1)
      : theme.colors.adminSurface,
    color: state.isSelected ? theme.colors.textLight : theme.colors.adminText,
    "&:active": {
      backgroundColor: darken(0.05, theme.colors.accent1),
    },
    cursor: "pointer",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: theme.colors.adminText,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: theme.colors.adminTextSecondary,
  }),
  input: (provided: any) => ({
    ...provided,
    color: theme.colors.adminText,
  }),
  multiValue: (provided: any) => ({
    ...provided,
    backgroundColor: rgba(theme.colors.accent1, 0.15),
    borderRadius: "4px",
  }),
  multiValueLabel: (provided: any) => ({
    ...provided,
    color: theme.colors.accent1,
    fontWeight: 500,
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    color: theme.colors.accent1,
    "&:hover": {
      backgroundColor: theme.colors.accent1,
      color: "white",
    },
  }),
});

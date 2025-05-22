import styled from "styled-components";
import { Link } from "react-router-dom";

const colors = {
  primaryBlue: "#007bff",
  textDark: "#333",
  textGrey: "#555",
  borderGreyLight: "#eee",
  backgroundWhite: "#fff",
};

export const AuthContainer = styled.div`
  padding: 30px;
  max-width: 500px;
  margin: 40px auto;
  border: 1px solid ${colors.borderGreyLight};
  border-radius: 8px;
  background-color: ${colors.backgroundWhite};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

export const AuthTitle = styled.h1`
  text-align: center;
  margin-top: 0;
  margin-bottom: 30px;
  color: ${colors.textDark};
  font-size: 2em;
`;

export const AuthNav = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  gap: 30px;
`;

export const AuthNavLink = styled(Link)<{ $isActive: boolean }>`
  text-decoration: none;
  font-size: 1.1em;

  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  color: ${(props) => (props.$isActive ? colors.primaryBlue : colors.textGrey)};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${colors.primaryBlue};
    text-decoration: underline;
  }
`;

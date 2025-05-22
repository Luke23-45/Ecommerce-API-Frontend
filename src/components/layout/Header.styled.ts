
import styled from 'styled-components';
import { Link } from 'react-router-dom'; 


const headerColors = {
  background: '#333', 
  text: '#fff', 
  linkHover: '#007bff', 
};




export const StyledHeader = styled.header`
  background-color: ${headerColors.background};
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${headerColors.text};
`;


export const SiteTitleLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;


export const SiteTitle = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  margin-right: 20px;
`;


export const Nav = styled.nav`
  display: flex;
  gap: 20px;
  align-items: center;
`;


export const NavLink = styled(Link)`
  text-decoration: none;
  color: ${headerColors.text};
  font-weight: normal;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${headerColors.linkHover};
    text-decoration: underline;
  }
`;
const colors = {
    grey: '#6c757d',
};

export const LogoutButton = styled.button`
  padding: 8px 12px;
  background-color: ${headerColors.linkHover};
  color: ${headerColors.text};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out;

   &:hover:not(:disabled) {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: ${colors.grey}; 
    cursor: not-allowed;
    opacity: 0.7;
  }
`;



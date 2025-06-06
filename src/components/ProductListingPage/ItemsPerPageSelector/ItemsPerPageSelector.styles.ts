
import styled from 'styled-components';

export const Wrapper = styled.div`
padding-right: 10px;
  position: relative;
  display: inline-block;
`;

export const Button = styled.button`
  background-color: transparent;
  border: none; 
  padding: ${({ theme }) => theme.spacing(1)} 0; 
  font-family: ${({ theme }) => theme.typography.fonts.body};
  font-size: 12px; 
  color: ${({ theme }) => theme.colors.textMedium};
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: bold;

  &:hover {
    color: ${({ theme }) => theme.colors.info}; 
  }

  svg {
    margin-left: ${({ theme }) => theme.spacing(1.5)}; 
    font-size: 0.8rem;
    transition: transform 0.2s ease-out;
    color: currentColor; 
  }

  &[aria-expanded="true"] svg {
    transform: rotate(180deg);
  }
`;

export const Dropdown = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  padding: ${({ theme }) => theme.spacing(1)} 0; 
  margin: 0;
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing(1)}); 
  right: 0; 
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.medium}; 
  box-shadow: ${({ theme }) => theme.shadows.md}; 
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  min-width: 120px; 

  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-8px)')};
  transition: opacity 0.2s ease, transform 0.2s ease, 
              visibility 0s linear ${({ isOpen }) => (isOpen ? '0s' : '0.2s')};
`;

export const Item = styled.li<{ isActive?: boolean }>`
  padding: ${({ theme }) => theme.spacing(2)} ${({ theme }) => theme.spacing(3)};
  font-size: ${({ theme }) => theme.typography.body.sizes.small};
  color: ${({ theme, isActive }) => isActive ? theme.colors.info : theme.colors.textDark};
  font-weight: ${({ theme, isActive }) => isActive ? theme.typography.body.weights.semiBold : theme.typography.body.weights.regular};
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryNeutral}; 
  }
`;

import styled from 'styled-components';

export const PageWrapper = styled.div`
margin-top: 20px;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.containerPadding} ${({ theme }) => theme.spacing(8)}; 
  font-family: ${({ theme }) => theme.typography.fonts.body};
  background-color: ${({ theme }) => theme.colors.backgroundLight}; 
`;


export const PageContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)}; 
`;


export const CategoryPageTitle = styled.h1`
  font-family: ${({ theme }) => theme.typography.fonts.body}; 
  font-size: 1.25rem; 
  font-weight: bold; 
  color: ${({ theme }) => theme.colors.textDark};
  margin: 0;
`;


export const MainContent = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(5)}; 

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing(4)};
  }
`;

export const ProductDisplayArea = styled.div`
  flex: 1;
  min-width: 0; 
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-left: 15px;
`;




export const FilterToggleButton = styled.button`
  display: none; 
  background: ${({ theme }) => theme.colors.backgroundLight}; 
  color: ${({ theme }) => theme.colors.textDark};
  border: 1px solid ${({ theme }) => theme.colors.mediumGray}; 
  padding: ${({ theme }) => theme.spacing(2.5)} ${({ theme }) => theme.spacing(4)};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: ${({ theme }) => theme.typography.body.sizes.base};
  font-weight: ${({ theme }) => theme.typography.body.weights.medium};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  align-items: center; 
  width: 100%;

  svg {
    margin-right: ${({ theme }) => theme.spacing(2)};
    font-size: 0.9rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex; 
    justify-content: center;
  }
`;

export const HeaderSortContainer = styled.div `
display: flex;
align-items: center;
justify-content: space-between;
padding: 2 50px;
border-radius: 10px;
border: 1px solid rgba(236, 236, 236, 0.2);
background-color:rgb(250, 253, 253);
margin-bottom: 15px;

`
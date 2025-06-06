// src/components/Common/Breadcrumbs/Breadcrumbs.styles.ts
import styled, { type DefaultTheme } from 'styled-components';
import { darken } from 'polished'; // If you use darken for hover

export const BreadcrumbNav = styled.nav<{ theme: DefaultTheme }>`
  padding: ${({ theme }) => theme.spacing(2.5)} 0; /* Adjusted padding slightly */
  /* Removed margin-bottom here; parent (<BreadcrumbsArea>) will control that */
  font-family: ${({ theme }) => theme.typography.body.fontFamily};
  font-size: ${({ theme }) => theme.typography.body.sizes.small}; /* Using themed small size */
  color: ${({ theme }) => theme.colors.darkGray};

  @media (max-width: ${(props) => props.theme.breakpoints.mobileL}) {
     padding: ${({ theme }) => theme.spacing(2)} 0;
     font-size: ${({ theme }) => theme.typography.body.sizes.xsmall}; /* Even smaller on mobile */
  }
`;

export const BreadcrumbList = styled.ol<{ theme: DefaultTheme }>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap; /* Allow breadcrumbs to wrap on small screens if many items */
  align-items: center;
`;

export const BreadcrumbItem = styled.li<{ theme: DefaultTheme }>`
  display: flex;
  align-items: center;

  /* Separator - using an SVG icon for more style control is also an option */
  &:not(:last-child)::after {
    content: '/'; 
    margin: 0 ${({ theme }) => theme.spacing(2)};
    color: ${({ theme }) => theme.colors.lightGray}; 
    font-size: 0.9em; /* Make separator slightly smaller than text */
    font-weight: 300; /* Lighter weight for separator */
  }

  a {
    color: ${({ theme }) => theme.colors.darkGray}; /* Consistent with nav text */
    text-decoration: none;
    transition: color 0.2s ease-out;
    padding: ${({theme}) => theme.spacing(0.5)} 0; /* Add slight vertical padding for click area */

    &:hover {
      color: ${({ theme }) => theme.colors.accent1};
      /* text-decoration: underline; // Optional: Add underline on hover */
    }
  }

  span { /* For the current, non-linkable page/item */
    color: ${({ theme }) => theme.colors.textDark}; /* Current page stands out slightly more */
    font-weight: ${({ theme }) => theme.typography.body.weights.medium}; /* Medium weight for current */
    padding: ${({theme}) => theme.spacing(0.5)} 0;
  }
`;
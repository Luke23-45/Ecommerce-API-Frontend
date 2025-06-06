// src/components/Common/Breadcrumbs.styles.ts
import styled from 'styled-components';

export const BreadcrumbWrapper = styled.nav`
  padding: ${({ theme }) => theme.spacing(3)} 0; // Vertical padding, horizontal padding comes from PageWrapper
  margin-bottom: ${({ theme }) => theme.spacing(2)}; // Space below breadcrumbs, before main page title
  font-family: ${({ theme }) => theme.typography.fonts.body};
`;

export const BreadcrumbList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap; // Allow wrapping on very small screens if necessary
  align-items: center;
`;

export const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.body.sizes.small}; // Small, readable text
  color: ${({ theme }) => theme.colors.textMedium}; // Default color for separators and current page

  &:not(:last-child)::after {
    content: '>';
    margin: 0 ${({ theme }) => theme.spacing(2)}; // Space around the ">" separator
    color: ${({ theme }) => theme.colors.textMuted}; // Separator color slightly more muted
  }
`;

export const BreadcrumbLink = styled.a` // Or use React Router's <Link> component
  color: ${({ theme }) => theme.colors.textMedium}; // Link color
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent1}; // Élan accent on hover
    text-decoration: underline;
  }
`;

export const CurrentPageText = styled.span`
  color: ${({ theme }) => theme.colors.textDark}; // Current page slightly darker or more prominent
  font-weight: ${({ theme }) => theme.typography.body.weights.medium}; // Medium weight for current page
`;
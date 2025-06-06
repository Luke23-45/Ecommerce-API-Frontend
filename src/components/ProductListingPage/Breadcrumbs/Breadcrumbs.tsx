// src/components/Common/Breadcrumbs.tsx
import React from 'react';
// If using React Router, import Link:
// import { Link as RouterLink } from 'react-router-dom';
import * as S from './Breadcrumbs.styles';

export interface Breadcrumb {
  label: string;
  href?: string; // Optional: last item might not have an href
  isCurrent?: boolean; // Explicitly mark the current page
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <S.BreadcrumbWrapper aria-label="Breadcrumb">
      <S.BreadcrumbList>
        {items.map((item, index) => (
          <S.BreadcrumbItem key={index}>
            {item.href && !item.isCurrent ? (
              // Replace S.BreadcrumbLink with RouterLink if using React Router
              // <RouterLink to={item.href} component={S.BreadcrumbLink}> 
              //   {item.label}
              // </RouterLink>
              <S.BreadcrumbLink href={item.href}>
                {item.label}
              </S.BreadcrumbLink>
            ) : (
              <S.CurrentPageText aria-current={item.isCurrent ? "page" : undefined}>
                {item.label}
              </S.CurrentPageText>
            )}
          </S.BreadcrumbItem>
        ))}
      </S.BreadcrumbList>
    </S.BreadcrumbWrapper>
  );
};

export default Breadcrumbs;
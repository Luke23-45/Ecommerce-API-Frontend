// src/components/ProductListing/Pagination.tsx
import React from 'react';
import * as S from './Pagination.styles';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'; // Standard prev/next icons

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /**
   * Number of page numbers to show around the current page.
   * For example, if pageNeighbours is 1, and current page is 5, it shows: ... 4 [5] 6 ...
   * If pageNeighbours is 2, and current page is 5, it shows: ... 3 4 [5] 6 7 ...
   */
  pageNeighbours?: number; 
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageNeighbours = 1, // Show 1 page number on each side of current page by default
}) => {
  if (totalPages < 1) {
    return null; // Don't render pagination if there's only one page or less
  }

  const getPageNumbers = () => {
    const totalNumbers = pageNeighbours * 2 + 3; // Current page + neighbours on each side + first & last page + 2 ellipses (worst case)
    const totalBlocks = totalNumbers + 2; // Add prev/next buttons to the count of blocks

    if (totalPages <= totalBlocks - 2) { // If total pages is small enough to show all numbers without ellipses (minus prev/next)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | 'ELLIPSIS')[] = [];

    const leftBound = Math.max(2, currentPage - pageNeighbours);
    const rightBound = Math.min(totalPages - 1, currentPage + pageNeighbours);

    // Always add the first page
    pages.push(1);

    // Add ellipsis if needed after first page
    if (leftBound > 2) {
      pages.push('ELLIPSIS');
    }

    // Add pages around the current page
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed before the last page
    if (rightBound < totalPages - 1) {
      pages.push('ELLIPSIS');
    }

    // Always add the last page (if it's not already included)
    if (totalPages > 1 && !pages.includes(totalPages)) {
        pages.push(totalPages);
    }
    
    // Filter out duplicates in case pageNeighbours logic overlaps with 1 or totalPages
    return [...new Set(pages)];
  };

  const pageNumbers = getPageNumbers();

  return (
    <S.PaginationWrapper aria-label="Page navigation">
      <S.PageList>
        <S.PageItem>
          <S.NavButton
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous Page"
          >
            <FaAngleLeft />
          </S.NavButton>
        </S.PageItem>

        {pageNumbers.map((page, index) => (
          <S.PageItem key={page === 'ELLIPSIS' ? `ellipsis-${index}` : page}>
            {page === 'ELLIPSIS' ? (
              <S.EllipsisItem aria-hidden="true">…</S.EllipsisItem>
            ) : (
              <S.PageButton
                isActive={currentPage === page}
                onClick={() => onPageChange(page as number)}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={currentPage === page ? `Current Page, Page ${page}` : `Go to Page ${page}`}
              >
                {page}
              </S.PageButton>
            )}
          </S.PageItem>
        ))}

        <S.PageItem>
          <S.NavButton
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next Page"
          >
            <FaAngleRight />
          </S.NavButton>
        </S.PageItem>
      </S.PageList>
    </S.PaginationWrapper>
  );
};

export default Pagination;
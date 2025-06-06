// src/components/ProductListing/ProductListHeader.tsx
import React, { useState, useRef, useEffect } from 'react';
import * as S from './ProductListHeader.styles';
import { FaAngleDown } from 'react-icons/fa';

interface ProductListHeaderProps {
  categoryTitle: string;
  itemsPerPageOptions: number[];
  currentItemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
}

const ProductListHeader: React.FC<ProductListHeaderProps> = ({
  categoryTitle,
  itemsPerPageOptions,
  currentItemsPerPage,
  onItemsPerPageChange,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleOptionClick = (count: number) => {
    onItemsPerPageChange(count);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <S.HeaderBarWrapper>
      <S.CategoryTitle>{categoryTitle}</S.CategoryTitle>
      <S.ViewOptionsWrapper ref={dropdownRef}>
        <S.ViewOptionsButton 
          onClick={toggleDropdown} 
          aria-expanded={isDropdownOpen} 
          aria-controls="items-per-page-dropdown" // Added aria-controls
        >
          {currentItemsPerPage}View by Hot
          <FaAngleDown />
        </S.ViewOptionsButton>
        <S.ViewOptionsDropdown 
          id="items-per-page-dropdown" // Added id for aria-controls
          isOpen={isDropdownOpen} 
          role="listbox"
        >
          {itemsPerPageOptions.map((option) => (
            <S.ViewOptionsItem
              key={option}
              isActive={option === currentItemsPerPage}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={option === currentItemsPerPage}
            >
              {option}View by Hot
            </S.ViewOptionsItem>
          ))}
        </S.ViewOptionsDropdown>
      </S.ViewOptionsWrapper>
    </S.HeaderBarWrapper>
  );
};

export default ProductListHeader;
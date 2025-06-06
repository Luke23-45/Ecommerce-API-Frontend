// src/components/ProductListing/ItemsPerPageSelector.tsx
import React, { useState, useRef, useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa';
import * as S from './ItemsPerPageSelector.styles';
import GrandMarquee from '@/components/home/GrandMarquee';

interface ItemsPerPageSelectorProps {
  itemsPerPageOptions: number[];
  currentItemsPerPage: number;
  onItemsPerPageChange: (count: number) => void;
}

const ItemsPerPageSelector: React.FC<ItemsPerPageSelectorProps> = ({
  itemsPerPageOptions,
  currentItemsPerPage,
  onItemsPerPageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (count: number) => {
    onItemsPerPageChange(count);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (

    <>

        <S.Wrapper ref={dropdownRef}>
      <S.Button onClick={toggleDropdown} aria-expanded={isOpen} aria-controls="items-per-page-dropdown">
        {currentItemsPerPage} &nbsp; View by Hot
        <FaAngleDown />
      </S.Button>
      <S.Dropdown id="items-per-page-dropdown" isOpen={isOpen} role="listbox">
        {itemsPerPageOptions.map((option) => (
          <S.Item
            key={option}
            isActive={option === currentItemsPerPage}
            onClick={() => handleOptionClick(option)}
            role="option"
            aria-selected={option === currentItemsPerPage}
          >
            {option} &nbsp; View by Hot
          </S.Item>
        ))}
      </S.Dropdown>
    </S.Wrapper>
    </>

  );
};

export default ItemsPerPageSelector;
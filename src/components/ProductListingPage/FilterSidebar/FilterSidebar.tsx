// src/components/ProductListing/FilterSidebar.tsx
import React from 'react'; // Removed useState as it wasn't directly used here
import type { FilterGroup, FilterOption } from '@/data/mockData';
import * as S from './FilterSidebar.styles';
import { FaCheck, FaChevronDown, FaChevronRight, FaTimes,FaRocket  } from 'react-icons/fa'; // Updated icons

interface FilterSidebarProps {
  filterGroups: FilterGroup[];
  onFilterChange: (groupTitle: string, optionValue: string, checked: boolean) => void;
  onToggleCollapse: (groupId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filterGroups, 
  onFilterChange, 
  onToggleCollapse,
  isOpen,
  onClose
}) => {
  
  const handleCategoryClick = (groupTitle: string, optionValue: string) => {
    onFilterChange(groupTitle, optionValue, true);
  };

  const handleCheckboxChange = (groupTitle: string, option: FilterOption) => {
    onFilterChange(groupTitle, option.value, !option.checked);
  };

  return (
    <>
      <S.MobileBackdrop isOpen={isOpen} onClick={onClose} />
      <S.SidebarWrapper isOpen={isOpen}>
        {onClose && (
          <S.MobileCloseButton onClick={onClose} aria-label="Close filters">
            <FaTimes />
          </S.MobileCloseButton>
        )}
        {filterGroups.map((group) => (
          <S.FilterGroupWrapper key={group.id}>
            <S.FilterGroupTitle 
              onClick={() => group.type !== 'category' && onToggleCollapse(group.id)} // Only make collapsible if not category type, or by explicit prop
              className={group.isCollapsed ? 'collapsed' : ''}
            >
                <span className="group-title-text">
                {group.id === 'rlux' && <FaRocket className="group-icon" />} 
                {group.title}
              </span>
              {group.type !== 'category' && ( // Example: Don't show chevron for "Category" main title
                group.isCollapsed ? <FaChevronRight /> : <FaChevronDown />
              )}
            </S.FilterGroupTitle>
            <S.FilterList isCollapsed={group.isCollapsed}>
              {group.options.map((option:any) => {
                // Determine depth for categories (simple example)
                let depth = 0;
                if (group.type === 'category') {
                  // This needs a better way to determine depth from your data structure.
                  // For example, if option.value is 'mtm_basic' under 'mtm_hoodie'
                  if (option.label.startsWith(" ") && !option.label.startsWith("  ")) depth = 1; // crude
                  if (option.label.startsWith("  ")) depth = 2; // crude
                  // Example from mockData structure for '맨투맨', '후드티' being children of '맨투맨/후드티'
                  if (['cat_mtm', 'cat_hoodie'].includes(option.id) && group.id === 'category') depth = 1;
                }

                if (group.type === 'category') {
                  return (
                    <S.CategoryFilterItem
                      key={option.id}
                      isActive={!!option.checked}
                      onClick={() => handleCategoryClick(group.title, option.value)}
                      depth={depth}
                    >
                      {option.label.trim()} {/* Trim potential leading spaces used for depth */}
                    </S.CategoryFilterItem>
                  );
                } else if (group.type === 'checkbox') {
                  return (
                    <S.CheckboxFilterItem key={option.id}>
                      <S.CustomCheckboxLabel>
                        <S.CustomCheckboxInput
                          checked={!!option.checked}
                          onChange={() => handleCheckboxChange(group.title, option)}
                          id={`filter-${group.id}-${option.id}`} // Unique ID for label 'htmlFor'
                        />
                        <S.CustomCheckboxVisual>
                          <FaCheck />
                        </S.CustomCheckboxVisual>
                        <S.CheckboxLabelText>{option.label}</S.CheckboxLabelText>
                      </S.CustomCheckboxLabel>
                      {option.count !== undefined && (
                        <S.FilterOptionCount>({option.count.toLocaleString()})</S.FilterOptionCount>
                      )}
                    </S.CheckboxFilterItem>
                  );
                }
                return null;
              })}
            </S.FilterList>
          </S.FilterGroupWrapper>
        ))}
      </S.SidebarWrapper>
    </>
  );
};

export default FilterSidebar;
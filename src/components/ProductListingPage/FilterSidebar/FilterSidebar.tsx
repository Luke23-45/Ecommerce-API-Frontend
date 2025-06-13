// src/components/ProductListingPage/FilterSidebar/FilterSidebar.tsx

import React from "react";
import type { FilterGroup, FilterOption } from "@/data/mockData";
import * as S from "./FilterSidebar.styles";
import {
  FaCheck,
  FaChevronDown,
  FaChevronRight,
  FaTimes,
  FaRocket,
} from "react-icons/fa";
import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";

interface FilterSidebarProps {
  filterGroups?: FilterGroup[];
  onFilterChange: (
    groupTitle: string,
    optionValue: string,
    checked: boolean
  ) => void;
  onToggleCollapse: (groupId: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isLoading?: boolean;
}

const RecursiveCategoryOption: React.FC<{
  option: FilterOption;
  onCategoryClick: (value: string) => void;
  depth: number;
}> = ({ option, onCategoryClick, depth }) => {
  return (
    <li> {/* Use a standard li */}
      <S.CategoryFilterItem
        onClick={() => onCategoryClick(option.value)}
        isActive={!!option.checked}
        depth={depth}

      >
        {option.label}
      </S.CategoryFilterItem>

      {option.children && option.children.length > 0 && (
        <S.NestedCategoryList>
          {option.children.map(childOption => (
            <RecursiveCategoryOption
              key={childOption.id}
              option={childOption}
              onCategoryClick={onCategoryClick}
              depth={depth + 1}
              
            />
          ))}
        </S.NestedCategoryList>
      )}
    </li>
  );
};

// --- ** THE MAIN SIDEBAR COMPONENT (Now Simplified) ** ---
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterGroups = [],
  onFilterChange,
  onToggleCollapse,
  isOpen,
  onClose,
  isLoading,
}) => {
  const handleCategoryClick = (groupTitle: string, optionValue: string) => {
    // For category hierarchies, clicking a category implies selecting it.
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

        {isLoading ? (
          <div style={{ padding: '2rem' }}>
            <LoadingSpinner message="Loading filters..." />
          </div>
        ) : filterGroups && filterGroups.length > 0 ? (
          filterGroups.map((group) => (
            <S.FilterGroupWrapper key={group.id}>
              <S.FilterGroupTitle
                onClick={() => onToggleCollapse(group.id)}
                className={group.isCollapsed ? "collapsed" : ""}
              >
                <span className="group-title-text">
                  {group.id === "rlux" && <FaRocket className="group-icon" />}
                  {group.name} {/* Use group.name from our new data structure */}
                </span>
                {group.isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
              </S.FilterGroupTitle>

              <S.FilterList isCollapsed={group.isCollapsed}>
                {/* --- Logic to choose the correct renderer --- */}
                
                {group.type === "hierarchy" ? ( // Our category group is of type 'hierarchy'
                  group.options.map((option) => (
                    <RecursiveCategoryOption
                      key={option.id}
                      option={option}
                      onCategoryClick={(value) => handleCategoryClick(group.name, value)}
                       depth={0}
                    />
                  ))
                ) : group.type === "checkbox" ? (
                  group.options.map((option) => (
                    <S.CheckboxFilterItem key={option.id}>
                      <S.CustomCheckboxLabel>
                        <S.CustomCheckboxInput
                          checked={!!option.checked}
                          onChange={() => handleCheckboxChange(group.name, option)}
                          id={`filter-${group.id}-${option.id}`}
                        />
                        <S.CustomCheckboxVisual><FaCheck /></S.CustomCheckboxVisual>
                        <S.CheckboxLabelText>{option.label}</S.CheckboxLabelText>
                      </S.CustomCheckboxLabel>
                      {option.count !== undefined && (
                        <S.FilterOptionCount>({option.count.toLocaleString()})</S.FilterOptionCount>
                      )}
                    </S.CheckboxFilterItem>
                  ))
                ) : null}
              </S.FilterList>
            </S.FilterGroupWrapper>
          ))
        ) : (
          <p style={{ padding: '0 1.5rem' }}>No filters available.</p>
        )}
      </S.SidebarWrapper>
    </>
  );
};

export default FilterSidebar;
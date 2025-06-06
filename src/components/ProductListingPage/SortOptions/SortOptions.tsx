// src/components/ProductListing/SortOptions.tsx
import React from 'react';
import * as S from './SortOptions.styles';
// FaCheck is now S.ActiveSortIcon
// FaInfoCircle is now S.InfoIcon

interface SortOptionItem {
  id: string;
  label: string;
  value: string;
  hasInfoIcon?: boolean; // For the (i) icon shown in image for "쿠팡 랭킹순"
}

interface SortOptionsProps {
  options: SortOptionItem[];
  activeSort: string;
  onSortChange: (value: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  options,
  activeSort,
  onSortChange,
}) => {
  return (
    <S.SortWrapper>
      <S.SortList aria-label="Sort products by">
        {options.map((option) => (
          <S.SortItem key={option.id}> {/* isActive prop removed from S.SortItem li */}
            <button 
              onClick={() => onSortChange(option.value)}
              aria-pressed={activeSort === option.value} // This drives the active styling
            >
              {activeSort === option.value && <S.ActiveSortIcon />}
              {option.label}
              {option.hasInfoIcon && <S.InfoIcon title="랭킹 정보" />} {/* title for tooltip */}
            </button>
          </S.SortItem>
        ))}
      </S.SortList>
    </S.SortWrapper>
  );
};

export default SortOptions;
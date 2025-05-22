// src/components/Admin/Common/AdminSelect/AdminSelect.tsx
import React from 'react';
import { StyledSelect } from './AdminSelect.styles';

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // Can add custom props if needed
  options: { value: string; label: string | React.ReactNode }[];
}

const AdminSelect: React.FC<AdminSelectProps> = ({ options, ...props }) => {
  return (
    <StyledSelect {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
};

export default AdminSelect;
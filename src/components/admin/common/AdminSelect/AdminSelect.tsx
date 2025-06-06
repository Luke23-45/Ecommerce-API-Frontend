// src/components/Admin/Common/AdminSelect/AdminSelect.tsx
// import React from 'react';
// import { StyledSelect } from './AdminSelect.styles';

// interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   // Can add custom props if needed
//   options: { value: string; label: string | React.ReactNode }[];
// }

// const AdminSelect: React.FC<AdminSelectProps> = ({ options, ...props }) => {
//   return (
//     <StyledSelect {...props}>
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </StyledSelect>
//   );
// };
// src/components/Admin/Common/AdminSelect/AdminSelect.tsx
import React from 'react';
import { StyledSelect } from './AdminSelect.styles';

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // Make options optional and provide a default empty array
  options?: { value: string; label: string | React.ReactNode }[]; // Make optional '?'
}

// Provide a default value for options to prevent .map() on undefined
const AdminSelect: React.FC<AdminSelectProps> = ({ options = [], ...props }) => { // FIX: Default options to empty array
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

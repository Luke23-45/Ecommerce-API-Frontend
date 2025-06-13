// src/components/common/AdminCheckbox/AdminCheckbox.tsx

import React from 'react';
import { FaCheck } from 'react-icons/fa';
import {
  CheckboxContainer,
  HiddenCheckbox,
  StyledCheckbox,
  CheckboxLabelText,
} from './AdminCheckbox.styles';

// --- Props Interface ---
// Extends standard input attributes for full compatibility.
interface AdminCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * A unique identifier for the checkbox, necessary for associating the label.
   */
  id: string;

  /**
   * The text or React node to display as the label for the checkbox.
   */
  label: React.ReactNode;

  /**
   * The current checked state of the checkbox.
   */
  checked: boolean;

  /**
   * A callback function that is invoked when the checkbox is clicked.
   */
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  /**
   * Optional className passed by styled-components or for custom styling.
   */
  className?: string;
}

const AdminCheckbox: React.FC<AdminCheckboxProps> = ({
  className,
  id,
  label,
  checked,
  disabled,
  ...props // Pass down any other standard input props like 'name'
}) => {
  return (
    <CheckboxContainer htmlFor={id} disabled={disabled} className={className}>
      <HiddenCheckbox
        id={id}
        checked={checked}
        disabled={disabled}
        {...props}
      />
      <StyledCheckbox checked={checked} disabled={disabled}>
        <FaCheck />
      </StyledCheckbox>
      <CheckboxLabelText>{label}</CheckboxLabelText>
    </CheckboxContainer>
  );
};

export default AdminCheckbox;

import React from 'react';
import { StyledTextArea } from './AdminTextArea.styles';

interface AdminTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  
}

const AdminTextArea: React.FC<AdminTextAreaProps> = (props) => {
  return <StyledTextArea {...props} />;
};

export default AdminTextArea;
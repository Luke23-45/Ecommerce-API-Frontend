// src/components/Admin/Common/FormSectionWrapper/FormSectionWrapper.tsx
import React, {type ReactNode } from 'react';
import {
    FormSectionContainer,
    SectionHeader,
    SectionTitle,
    SectionContent,
    FormLabel,
    FieldGroup,
    MultiFieldRow,
} from './FormSectionWrapper.styles';

interface FormSectionWrapperProps {
    title: string;
    children: ReactNode;
    actions?: ReactNode; // Optional actions for the header (e.g., a "Add Variant" button)
}

// These exports allow direct use of nested styled components by parent modules
export { FormLabel, FieldGroup, MultiFieldRow }; 

const FormSectionWrapper: React.FC<FormSectionWrapperProps> = ({ title, children, actions }) => {
    return (
        <FormSectionContainer>
            <SectionHeader>
                <SectionTitle>{title}</SectionTitle>
                {actions && <div>{actions}</div>}
            </SectionHeader>
            <SectionContent>
                {children}
            </SectionContent>
        </FormSectionContainer>
    );
};

export default FormSectionWrapper;
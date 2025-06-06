import React from 'react';
import { FaTag, FaPlus } from 'react-icons/fa';
import { AdminButton } from '../Dashboard/Common/Common.styles'; // Adjust path if necessary
import {
  OverviewContainer,
  OverviewHeader,
  HeaderTitle,
  ContentBox,
} from './AttributesOverview.styles';

// --- Define the new props it will receive from AdminPage ---
interface AttributesOverviewProps {
  onNavigateToAttributeList: () => void; // For "View All Attributes"
  onNavigateToNewAttributeForm: () => void; // For "Add New Attribute"
}

const AttributesOverview: React.FC<AttributesOverviewProps> = ({
  onNavigateToAttributeList,
  onNavigateToNewAttributeForm,
}) => {
  return (
    <OverviewContainer>
      <OverviewHeader>
        <HeaderTitle>Product Attributes</HeaderTitle>
        <AdminButton
          $variant="primary"
          onClick={onNavigateToNewAttributeForm} // <<< USE THE PROP HERE
        >
          <FaPlus /> Add New Attribute
        </AdminButton>
      </OverviewHeader>

      <ContentBox>
        <FaTag />
        <p>
          This section allows you to manage product attributes such as material types, patterns, specific features, and more.
          You can create new attributes and define their values to be used across your product catalog.
        </p>
        <AdminButton
          $variant="secondary"
          onClick={onNavigateToAttributeList} 
        >
          View All Attributes
        </AdminButton>
      </ContentBox>
    </OverviewContainer>
  );
};

export default AttributesOverview;
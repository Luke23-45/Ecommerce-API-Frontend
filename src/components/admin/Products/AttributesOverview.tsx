
import React from 'react';
import { FaTag, FaPlus } from 'react-icons/fa';
import { AdminButton } from '../Dashboard/Common/Common.styles';
import {
  OverviewContainer,
  OverviewHeader,
  HeaderTitle,
  ContentBox,
} from './AttributesOverview.styles';


interface AttributesOverviewProps {
}

const AttributesOverview: React.FC<AttributesOverviewProps> = () => {
  return (
    <OverviewContainer>
      <OverviewHeader>
        <HeaderTitle>Product Attributes</HeaderTitle>
        <AdminButton $variant="primary" onClick={() => console.log('Add New Attribute')}>
          <FaPlus /> Add New Attribute
        </AdminButton>
      </OverviewHeader>

      <ContentBox>
        <FaTag />
        <p>
          This section allows you to manage product attributes such as material types, patterns, specific features, and more. 
          You can create new attributes and define their values to be used across your product catalog.
        </p>
        <AdminButton $variant="secondary" onClick={() => console.log('View All Attributes')}>
          View All Attributes
        </AdminButton>
      </ContentBox>
    </OverviewContainer>
  );
};

export default AttributesOverview;
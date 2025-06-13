// src/components/Admin/Products/ProductForm/ProductFormHeader.tsx

import React from 'react';
import { useTheme } from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import {
  HeaderContainer,
  FormTitle,
  BackButtonWrapper,
} from './ProductFormHeader.styles';

import { AdminButton } from '@/components/admin/Dashboard/Common/Common.styles';
interface ProductFormHeaderProps {
  isEditMode: boolean;
  productName?: string;
  isSubmitting: boolean;
  onBack: () => void;
}

const ProductFormHeader: React.FC<ProductFormHeaderProps> = ({
  isEditMode,
  productName,
  isSubmitting,
  onBack,
}) => {
  const theme = useTheme();

  const titleText = isEditMode
    ? `Edit Product: ${productName || '...'}`
    : 'Create New Product';

  return (
    <HeaderContainer>
      <FormTitle title={titleText}>{titleText}</FormTitle>
      <BackButtonWrapper>
        <AdminButton
          type="button"
          $variant="secondaryOutline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <FaArrowLeft style={{ marginRight: theme.spacing(1.5) }} />
          Back to List
        </AdminButton>
      </BackButtonWrapper>
    </HeaderContainer>
  );
};

export default ProductFormHeader;
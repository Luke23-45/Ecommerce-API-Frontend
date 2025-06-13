// src/components/Admin/Products/ProductForm/ProductFormActions.tsx

import React from 'react';
import { useTheme } from 'styled-components';
import { FaBan, FaCheckCircle } from 'react-icons/fa';
import { StickyActionBarContainer } from './ProductFormActions.styles';
import LoadingSpinner from '@/components/common/LoadingSpinner/LoadingSpinner';
import { AdminButton } from '@/components/admin/Dashboard/Common/Common.styles';
interface ProductFormActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  isEditMode,
  isSubmitting,
  onCancel,
}) => {
  const theme = useTheme();

  const submitButtonText = isEditMode ? 'Save Changes' : 'Create Product';

  return (
    <StickyActionBarContainer>
      <AdminButton
        type="button"
        $variant="secondary"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        <FaBan style={{ marginRight: theme.spacing(1.5) }} />
        Cancel
      </AdminButton>

      <AdminButton
        type="submit"
        $variant="primary"
        disabled={isSubmitting}
        style={{ minWidth: '180px' }} // Give it a fixed min-width to avoid layout shifts
      >
        {isSubmitting ? (
          <LoadingSpinner
            size="1.2em"
            color="#FFF"
            thickness="2px"
            inline
            style={{ marginRight: theme.spacing(1.5) }}
          />
        ) : (
          <FaCheckCircle style={{ marginRight: theme.spacing(1.5) }} />
        )}
        {isSubmitting ? 'Saving...' : submitButtonText}
      </AdminButton>
    </StickyActionBarContainer>
  );
};

export default ProductFormActions;
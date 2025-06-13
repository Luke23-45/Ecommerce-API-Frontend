// src/components/Admin/Products/ProductForm/sections/ProductImages.tsx

import React from 'react';

// --- Common Components ---
import ImageUploader from '@/components/admin/common/ImageUploader/ImageUploader';
import { AdminInput } from '@/components/admin/Dashboard/Common/Common.styles';
import { FieldGroup, FormLabel } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';
import {type IProductFormState } from '@/types/product.types';
import { FieldHelperText } from './common.styles';

// --- Props Interface ---
interface ProductImagesProps {
  existingImageUrls: string[];
  newImageFiles: File[];
  mainProductImageIndex?: string;
  onFieldChange: (field: keyof IProductFormState, value: string) => void;
  onUpdate: (newFiles: File[], deletedPublicIds: string[]) => void;
  disabled: boolean;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  existingImageUrls,
  newImageFiles,
  mainProductImageIndex,
  onFieldChange,
  onUpdate,
  disabled,
}) => {
  const totalImages = (existingImageUrls?.length || 0) + (newImageFiles?.length || 0);
  const primaryIndexNum = parseInt(mainProductImageIndex || '0', 10);

  return (
    <>
      <ImageUploader
        instanceId="product_main_images"
        initialImageUrls={existingImageUrls}
        onImagesUpdate={onUpdate}
        maxFiles={12}
        label="Upload or drag-and-drop main product images"
        disabled={disabled}
        primaryImageIndex={primaryIndexNum}
      />
      
      {totalImages > 0 && (
        <FieldGroup style={{ marginTop: '1.5rem', maxWidth: '350px' }}>
          <FormLabel htmlFor="mainProductImageIndex">Primary Image</FormLabel>
          <AdminInput
            type="number"
            id="mainProductImageIndex"
            name="mainProductImageIndex"
            value={mainProductImageIndex || '0'}
            onChange={(e) => onFieldChange('mainProductImageIndex', e.target.value)}
            min="0"
            max={totalImages > 0 ? totalImages - 1 : 0}
            disabled={disabled}
          />
          <FieldHelperText>
            Enter the position (index) of the main "cover" image, starting from 0. The image marked "MAIN" above is the current primary.
          </FieldHelperText>
        </FieldGroup>
      )}
    </>
  );
};

export default ProductImages;
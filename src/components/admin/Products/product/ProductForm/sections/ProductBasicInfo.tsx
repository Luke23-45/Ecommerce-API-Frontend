// src/components/Admin/Products/ProductForm/sections/ProductBasicInfo.tsx

import React from 'react';


// import AdminSelect from '@/components/common/AdminSelect/AdminSelect';
import { AdminInput } from '@/components/admin/Dashboard/Common/Common.styles';
import AdminTextArea from '@/components/admin/common/AdminTextArea/AdminTextArea';
import AdminSelect from '@/components/admin/common/AdminSelect/AdminSelect';
// import {
//   FieldGroup,
//   FormLabel,
//   MultiFieldRow,
//   FieldHelperText,
//   FieldError,
// } from '@/components/common/FormSectionWrapper/FormSectionWrapper.styles';
import { FieldGroup,FormLabel,MultiFieldRow } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';
import { ErrorMessage as FieldError } from '@/components/admin/Application/SellerApplications/SellerApplicationList.styles';
import { FieldHelperText } from '../../ProductForm.styles';
// --- Types ---
import type{ IProductFormState } from '@/types/product.types';
import { FaTag } from 'react-icons/fa';
import { type SelectOption } from '@/types/common';
// --- Props Interface ---
interface ProductBasicInfoProps {
  formData: Pick<
    IProductFormState,
    'name' | 'description' | 'shortDescription' | 'categoryId' | 'brandId' | 'tags'
  >;
  onFieldChange: (field: keyof IProductFormState, value: string) => void;
  onTagsChange: (tags: string[]) => void;
  categoryOptions: SelectOption[];
  brandOptions: SelectOption[]; // Assuming it will be provided later
  errors: Record<string, string>;
  disabled: boolean;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  formData,
  onFieldChange,
  onTagsChange,
  categoryOptions,
  brandOptions,
  errors,
  disabled,
}) => {

  const handleTagsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Split by comma, trim whitespace from each tag, and filter out any empty strings
    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    onTagsChange(tagsArray);
  };
  
  return (
    // The parent FormSectionWrapper provides the title, icon, and overall container styling.
    // This component only needs to render the field groups.
    <>
      <FieldGroup>
        <FormLabel htmlFor="name">Product Name*</FormLabel>
        <AdminInput
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) => onFieldChange('name', e.target.value)}
          placeholder="e.g., Classic Leather Messenger Bag"
          required
          disabled={disabled}
          $hasError={!!errors.name}
        />
        {errors.name && <FieldError>{errors.name}</FieldError>}
      </FieldGroup>

      <FieldGroup $fullWidth>
        <FormLabel htmlFor="description">Full Description</FormLabel>
        <AdminTextArea
          id="description"
          name="description"
          value={formData.description || ''}
          onChange={(e) => onFieldChange('description', e.target.value)}
          rows={6}
          placeholder="Provide a detailed and engaging description for the product page..."
          disabled={disabled}
        />
        <FieldHelperText>
          Supports Markdown for rich text formatting. This is the main content for your product's detail page.
        </FieldHelperText>
      </FieldGroup>
      
      <FieldGroup $fullWidth>
        <FormLabel htmlFor="shortDescription">Short Summary</FormLabel>
        <AdminTextArea
          id="shortDescription"
          name="shortDescription"
          value={formData.shortDescription || ''}
          onChange={(e) => onFieldChange('shortDescription', e.target.value)}
          rows={3}
          placeholder="A brief summary for product cards, previews, and meta descriptions..."
          disabled={disabled}
        />
      </FieldGroup>

      <MultiFieldRow>
        <FieldGroup>
          <FormLabel htmlFor="categoryId">Category*</FormLabel>
          <AdminSelect
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={(e) => onFieldChange('categoryId', e.target.value)}
            options={categoryOptions}
            required
            disabled={disabled}
            $hasError={!!errors.categoryId}
          />
          {errors.categoryId && <FieldError>{errors.categoryId}</FieldError>}
        </FieldGroup>

        <FieldGroup>
          <FormLabel htmlFor="brandId">Brand</FormLabel>
          <AdminSelect
            id="brandId"
            name="brandId"
            value={formData.brandId || ''}
            onChange={(e) => onFieldChange('brandId', e.target.value)}
            options={[{ value: '', label: 'Select a Brand' }, ...brandOptions]}
            disabled={disabled}
            // You can add a loading state if brands are fetched separately
          />
          <FieldHelperText>
            Optional. You can manage brands in a separate admin section.
          </FieldHelperText>
        </FieldGroup>
      </MultiFieldRow>
      
      <FieldGroup>
        <FormLabel htmlFor="tags">
          Tags <FaTag style={{ marginLeft: '4px', opacity: 0.6 }} />
        </FormLabel>
        <AdminInput
          id="tags"
          name="tags"
          type="text"
          value={formData.tags.join(', ')} // Join the array into a comma-separated string for the input
          onChange={handleTagsInputChange}
          placeholder="e.g., modern, eco-friendly, handmade"
          disabled={disabled}
        />
        <FieldHelperText>
          Use commas to separate tags. These help with product discovery, filtering, and internal organization.
        </FieldHelperText>
      </FieldGroup>
    </>
  );
};

export default ProductBasicInfo;
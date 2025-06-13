// src/components/Admin/Products/ProductForm/sections/ProductSeo.tsx

import React from 'react';

// --- Common Components for Form Fields ---
// import { AdminInput, AdminTextArea } from '@/components/Dashboard/Common/Common.styles';
import { AdminInput } from '@/components/admin/Dashboard/Common/Common.styles';
import AdminTextArea from '@/components/admin/common/AdminTextArea/AdminTextArea';
// import {
//   FieldGroup,
//   FormLabel,
//   FieldHelperText,
//   FieldError,
// } from '@/components/common/FormSectionWrapper/FormSectionWrapper.styles';
import { FieldGroup } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';
import { FormLabel } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';
import { FieldHelperText } from './common.styles';
import { FieldError } from './common.styles';
// --- Types ---
import type { IProductFormState } from '@/types/product.types';

// --- Props Interface ---
interface ProductSeoProps {
  formData: Pick<IProductFormState, 'name' | 'metaTitle' | 'metaDescription' | 'metaKeywords'>;
  onFieldChange: (field: keyof IProductFormState, value: string) => void;
  onMetaKeywordsChange: (keywords: string[]) => void;
  errors: Record<string, string>;
  disabled: boolean;
}

const ProductSeo: React.FC<ProductSeoProps> = ({
  formData,
  onFieldChange,
  onMetaKeywordsChange,
  errors,
  disabled,
}) => {
  const handleKeywordsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Split by comma, trim whitespace, and filter out any empty strings
    const keywordsArray = e.target.value.split(',').map(kw => kw.trim()).filter(Boolean);
    onMetaKeywordsChange(keywordsArray);
  };
  
  // SEO best practice character limits
  const metaTitleLimit = 60;
  const metaDescriptionLimit = 160;

  return (
    <>
      <FieldHelperText style={{ marginBottom: '1.5rem', fontStyle: 'italic' }}>
        Optimize how your product appears in search engine results. If these fields are left blank, defaults will be generated from your product's name and description.
      </FieldHelperText>

      <FieldGroup $fullWidth>
        <FormLabel htmlFor="metaTitle">Meta Title</FormLabel>
        <AdminInput
          id="metaTitle"
          name="metaTitle"
          type="text"
          value={formData.metaTitle || ''}
          onChange={(e) => onFieldChange('metaTitle', e.target.value)}
          placeholder={formData.name || "Enter a concise, keyword-rich title"} // Use product name as a placeholder
          disabled={disabled}
          maxLength={metaTitleLimit + 10} // Allow a little overage
          $hasError={!!errors.metaTitle}
        />
        <FieldHelperText>
          Recommended: <strong>{metaTitleLimit}</strong> characters. | 
          Current: {formData.metaTitle?.length || 0}
        </FieldHelperText>
        {errors.metaTitle && <FieldError>{errors.metaTitle}</FieldError>}
      </FieldGroup>

      <FieldGroup $fullWidth>
        <FormLabel htmlFor="metaDescription">Meta Description</FormLabel>
        <AdminTextArea
          id="metaDescription"
          name="metaDescription"
          value={formData.metaDescription || ''}
          onChange={(e) => onFieldChange('metaDescription', e.target.value)}
          rows={4}
          placeholder="A compelling summary to encourage clicks in search results..."
          disabled={disabled}
          maxLength={metaDescriptionLimit + 20} // Allow a little overage
          $hasError={!!errors.metaDescription}
        />
        <FieldHelperText>
          Recommended: <strong>{metaDescriptionLimit}</strong> characters. |
          Current: {formData.metaDescription?.length || 0}
        </FieldHelperText>
        {errors.metaDescription && <FieldError>{errors.metaDescription}</FieldError>}
      </FieldGroup>
      
      <FieldGroup $fullWidth>
        <FormLabel htmlFor="metaKeywords">Meta Keywords</FormLabel>
        <AdminInput
          id="metaKeywords"
          name="metaKeywords"
          type="text"
          value={formData.metaKeywords.join(', ')} // Join array into a comma-separated string
          onChange={handleKeywordsInputChange}
          placeholder="e.g., keyword one, keyword two, another keyword"
          disabled={disabled}
        />
        <FieldHelperText>
          Comma-separated keywords. While less important for modern SEO, they can be useful for some internal systems.
        </FieldHelperText>
      </FieldGroup>
    </>
  );
};

export default ProductSeo;
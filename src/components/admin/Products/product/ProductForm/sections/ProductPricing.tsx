// src/components/Admin/Products/ProductForm/sections/ProductPricing.tsx

import React from 'react';
import { FaDollarSign, FaInfoCircle } from 'react-icons/fa';

// --- Common Components for Form Fields ---
// import { AdminInput, InputGroup, InputLeftAddon } from '@/components/Dashboard/Common/Common.styles';
// import AdminSelect from '@/components/common/AdminSelect/AdminSelect';

import { AdminInput } from '@/components/admin/Dashboard/Common/Common.styles';
// import {
//   FieldGroup,
//   FormLabel,
//   MultiFieldRow,
//   FieldHelperText,
//   FieldError,
// } from '@/components/common/FormSectionWrapper/FormSectionWrapper.styles';

// --- Types ---
import type{ IProductFormState } from '@/types/product.types';
import { FieldGroup,FormLabel,MultiFieldRow } from '@/components/seller/IndividualSellerProfileForm.styles';
import { FieldHelperText } from './common.styles';
import { FieldError } from './common.styles';
import { InputGroup } from './common.styles';
import { InputLeftAddon } from './common.styles';
import AdminSelect from '@/components/admin/common/AdminSelect/AdminSelect';
// --- Props Interface ---
interface ProductPricingProps {
  formData: Pick<IProductFormState, 'basePrice' | 'baseSalePrice' | 'currency'>;
  onFieldChange: (field: keyof IProductFormState, value: string) => void;
  errors: Record<string, string>;
  disabled: boolean;
}

const ProductPricing: React.FC<ProductPricingProps> = ({
  formData,
  onFieldChange,
  errors,
  disabled,
}) => {
  return (
    <>
      <MultiFieldRow>
        <FieldGroup>
          <FormLabel htmlFor="basePrice">Base Price</FormLabel>
          <InputGroup>
            <InputLeftAddon>
              <FaDollarSign />
            </InputLeftAddon>
            <AdminInput
              id="basePrice"
              name="basePrice"
              type="text" // Use text to allow for decimal entry
              inputMode="decimal" // Better mobile keyboard
              value={formData.basePrice || ''}
              onChange={(e) => onFieldChange('basePrice', e.target.value)}
              placeholder="0.00"
              disabled={disabled}
              $hasError={!!errors.basePrice}
            />
          </InputGroup>
          {errors.basePrice && <FieldError>{errors.basePrice}</FieldError>}
        </FieldGroup>

        <FieldGroup>
          <FormLabel htmlFor="baseSalePrice">Base Sale Price</FormLabel>
           <InputGroup>
            <InputLeftAddon>
              <FaDollarSign />
            </InputLeftAddon>
            <AdminInput
              id="baseSalePrice"
              name="baseSalePrice"
              type="text"
              inputMode="decimal"
              value={formData.baseSalePrice || ''}
              onChange={(e) => onFieldChange('baseSalePrice', e.target.value)}
              placeholder="0.00 (Optional)"
              disabled={disabled}
              $hasError={!!errors.baseSalePrice}
            />
          </InputGroup>
          {errors.baseSalePrice && <FieldError>{errors.baseSalePrice}</FieldError>}
        </FieldGroup>

        <FieldGroup>
          <FormLabel htmlFor="currency">Currency*</FormLabel>
          <AdminSelect
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={(e) => onFieldChange('currency', e.target.value)}
            options={[
              { value: 'USD', label: 'USD - US Dollar' },
              { value: 'EUR', label: 'EUR - Euro' },
              { value: 'GBP', label: 'GBP - Pound Sterling' },
              // Add other currencies as needed
            ]}
            required
            disabled={disabled}
            $hasError={!!errors.currency}
          />
          {errors.currency && <FieldError>{errors.currency}</FieldError>}
        </FieldGroup>
      </MultiFieldRow>
      
      <FieldHelperText style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FaInfoCircle />
        <span>
          This base price acts as a default or a "starting from" price. Each product variation can have its own specific price which will override this value.
        </span>
      </FieldHelperText>
    </>
  );
};

export default ProductPricing;
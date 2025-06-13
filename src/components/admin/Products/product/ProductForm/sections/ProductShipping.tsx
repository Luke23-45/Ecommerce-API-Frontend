// src/components/Admin/Products/ProductForm/sections/ProductShipping.tsx

import React from 'react';
import { useTheme } from 'styled-components';
import {
  FaBalanceScale,
  FaRulerCombined,
  FaExclamationTriangle,
  FaBan,
} from 'react-icons/fa';

// --- Common Components for Form Fields ---
// import { AdminInput, AdminCheckbox } from '@/components/Dashboard/Common/Common.styles';
// import AdminSelect from '@/components/common/AdminSelect/AdminSelect';

import { AdminInput } from '@/components/admin/Dashboard/Common/Common.styles';
import AdminCheckbox from '@/components/admin/common/AdminCheckbox/AdminCheckbox';

import { MultiFieldRow } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';

import { FieldGroup } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';
import { FormLabel } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';
import { FieldHelperText } from './common.styles';
import { FieldError } from './common.styles';
import AdminSelect from '@/components/admin/common/AdminSelect/AdminSelect';
// --- Types ---
import type { IProductFormState, DimensionUnit, WeightUnit } from '@/types/product.types';

// --- Props Interface ---
interface ProductShippingProps {
  formData: Pick<
    IProductFormState,
    'isShippingRequired' | 'defaultWeight' | 'defaultWeightUnit' | 'defaultDimensions' |
    'isHazardousMaterial' | 'isAgeRestricted' | 'ageRestrictionMinimum'
  >;
  onFieldChange: (field: keyof IProductFormState, value: any) => void;
  errors: Record<string, string>;
  disabled: boolean;
}

// Data for the select options
const weightUnitOptions: { value: WeightUnit; label: string }[] = [
  { value: 'kg', label: 'kg' },
  { value: 'g', label: 'g' },
  { value: 'lb', label: 'lb' },
  { value: 'oz', label: 'oz' },
];

const dimensionUnitOptions: { value: DimensionUnit; label: string }[] = [
  { value: 'cm', label: 'cm' },
  { value: 'in', label: 'in' },
  { value: 'mm', label: 'mm' },
  { value: 'm', label: 'm' },
];


const ProductShipping: React.FC<ProductShippingProps> = ({
  formData,
  onFieldChange,
  errors,
  disabled,
}) => {
  const theme = useTheme();

  // Handler for nested dimension object changes
  const handleDimensionChange = (
    field: 'length' | 'width' | 'height' | 'unit',
    value: string
  ) => {
    const newDimensions = { ...formData.defaultDimensions, [field]: value };
    onFieldChange('defaultDimensions', newDimensions);
  };
  
  return (
    <>
      <FieldGroup>
        <AdminCheckbox
          id="isShippingRequired"
          label="This product requires shipping (it is a physical item)"
          checked={formData.isShippingRequired}
          onChange={(e) => onFieldChange('isShippingRequired', e.target.checked)}
          disabled={disabled}
        />
      </FieldGroup>

      {/* Show physical properties only if shipping is required */}
      {formData.isShippingRequired && (
        <>
          <MultiFieldRow>
            <FieldGroup>
              <FormLabel htmlFor="defaultWeight">
                <FaBalanceScale /> Default Weight
              </FormLabel>
              <AdminInput
                id="defaultWeight"
                name="defaultWeight"
                type="text"
                inputMode="decimal"
                value={formData.defaultWeight || ''}
                onChange={(e) => onFieldChange('defaultWeight', e.target.value)}
                placeholder="e.g., 2.5"
                disabled={disabled}
                $hasError={!!errors.defaultWeight}
              />
              {errors.defaultWeight && <FieldError>{errors.defaultWeight}</FieldError>}
            </FieldGroup>
            <FieldGroup>
              <FormLabel htmlFor="defaultWeightUnit">Unit</FormLabel>
              <AdminSelect
                id="defaultWeightUnit"
                name="defaultWeightUnit"
                value={formData.defaultWeightUnit || 'kg'}
                onChange={(e) => onFieldChange('defaultWeightUnit', e.target.value)}
                options={weightUnitOptions}
                disabled={!formData.defaultWeight || disabled}
                style={{ minWidth: '100px' }}
              />
            </FieldGroup>
          </MultiFieldRow>

          <FieldGroup>
            <FormLabel htmlFor="dimensions">
              <FaRulerCombined /> Default Dimensions (L x W x H)
            </FormLabel>
            <MultiFieldRow>
              <AdminInput
                name="dimensions.length"
                type="text"
                inputMode="decimal"
                placeholder="Length"
                value={formData.defaultDimensions?.length || ''}
                onChange={(e) => handleDimensionChange('length', e.target.value)}
                disabled={disabled}
              />
              <AdminInput
                name="dimensions.width"
                type="text"
                inputMode="decimal"
                placeholder="Width"
                value={formData.defaultDimensions?.width || ''}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                disabled={disabled}
              />
              <AdminInput
                name="dimensions.height"
                type="text"
                inputMode="decimal"
                placeholder="Height"
                value={formData.defaultDimensions?.height || ''}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                disabled={disabled}
              />
              <AdminSelect
                name="dimensions.unit"
                value={formData.defaultDimensions?.unit || 'cm'}
                onChange={(e) => handleDimensionChange('unit', e.target.value)}
                options={dimensionUnitOptions}
                disabled={
                    (!formData.defaultDimensions?.length && !formData.defaultDimensions?.width && !formData.defaultDimensions?.height) ||
                    disabled
                }
                style={{ minWidth: '80px' }}
              />
            </MultiFieldRow>
            <FieldHelperText>
              Default values used for shipping calculations. Variations can have their own specific weights and dimensions.
            </FieldHelperText>
          </FieldGroup>
        </>
      )}

      {/* --- Compliance Section --- */}
      <hr style={{ border: 'none', borderTop: `1px solid ${theme.colors.adminBorderLight || '#eee'}`, margin: '2rem 0' }}/>
      
      <FormLabel style={{ marginBottom: theme.spacing(3), fontSize: '1.1em', fontWeight: 600 }}>Compliance</FormLabel>
      
      <MultiFieldRow>
        <FieldGroup>
          <AdminCheckbox
            id="isHazardousMaterial"
            checked={formData.isHazardousMaterial}
            onChange={(e) => onFieldChange('isHazardousMaterial', e.target.checked)}
            disabled={disabled}
            label={
                <span>
                    <FaExclamationTriangle style={{ color: theme.colors.adminStatusWarning, marginRight: '8px' }}/>
                    This is a hazardous material
                </span>
            }
          />
        </FieldGroup>
        
        <FieldGroup>
           <AdminCheckbox
            id="isAgeRestricted"
            checked={formData.isAgeRestricted}
            onChange={(e) => onFieldChange('isAgeRestricted', e.target.checked)}
            disabled={disabled}
            label={
                <span>
                    <FaBan style={{ color: theme.colors.adminStatusError, marginRight: '8px' }} />
                    This product is age-restricted
                </span>
            }
          />
        </FieldGroup>
      </MultiFieldRow>

      {/* Show minimum age input only if age-restricted is checked */}
      {formData.isAgeRestricted && (
        <FieldGroup style={{ paddingLeft: '28px', marginTop: '-8px' }}>
          <FormLabel htmlFor="ageRestrictionMinimum">Minimum Age Required*</FormLabel>
          <AdminInput
            id="ageRestrictionMinimum"
            name="ageRestrictionMinimum"
            type="text"
            inputMode="numeric"
            value={formData.ageRestrictionMinimum || ''}
            onChange={(e) => onFieldChange('ageRestrictionMinimum', e.target.value)}
            placeholder="e.g., 18"
            disabled={disabled}
            $hasError={!!errors.ageRestrictionMinimum}
            style={{ maxWidth: '120px' }}
          />
          {errors.ageRestrictionMinimum && <FieldError>{errors.ageRestrictionMinimum}</FieldError>}
        </FieldGroup>
      )}
    </>
  );
};

export default ProductShipping;
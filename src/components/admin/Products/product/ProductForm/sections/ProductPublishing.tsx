// src/components/Admin/Products/ProductForm/sections/ProductPublishing.tsx

import React from 'react';

// --- Common Components for Form Fields ---
import AdminSelect from '@/components/admin/common/AdminSelect/AdminSelect';
// import {
//   FieldGroup,
//   FormLabel,
//   MultiFieldRow,
//   FieldError,
//   FieldHelperText
// } from '@/components/common/FormSectionWrapper/FormSectionWrapper.styles';
import { FieldGroup,FormLabel } from '@/components/admin/common/FormSectionWrapper/FormSectionWrapper.styles';
import { MultiFieldRow } from '@/components/seller/IndividualSellerProfileForm.styles';
// --- Types ---
import type { IProductFormState, ProductStatus, ProductVisibility } from '@/types/product.types';
import type { SelectOption } from '@/types/common';
import { FaEye, FaTasks, FaUserTag } from 'react-icons/fa';
import { FieldHelperText } from './common.styles';
import { FieldError } from './common.styles';
// --- Props Interface ---
interface ProductPublishingProps {
  formData: Pick<IProductFormState, 'status' | 'visibility' | 'sellerType' | 'sellerId'>;
  onFieldChange: (field: keyof IProductFormState, value: string) => void;
  sellerOptions: SelectOption[]; // To be provided later, e.g., [{ value: 'sellerId123', label: 'Cool Gadgets Inc.' }]
  errors: Record<string, string>;
  disabled: boolean;
  // This prop will be used in a future step where an admin can create a product on behalf of a seller
  isAdminMode?: boolean; 
}

// Data for the select options to keep the component clean
const statusOptions: SelectOption<ProductStatus>[] = [
  { value: 'draft', label: 'Draft (Hidden, Work in Progress)' },
  { value: 'pending_review', label: 'Pending Review (Submitted for Approval)' },
  { value: 'active', label: 'Active (Live and Visible on Store)' },
  { value: 'archived', label: 'Archived (Not Sold Anymore, Hidden)' },
];

const visibilityOptions: SelectOption<ProductVisibility>[] = [
  { value: 'public', label: 'Public (Visible in Search & Categories)' },
  { value: 'hidden', label: 'Hidden (Not Listed, Accessible by Direct Link)' },
  { value: 'private', label: 'Private (Visible Only to Specific Users)' },
];

const sellerTypeOptions: SelectOption[] = [
    { value: 'vendor', label: 'Vendor / Store Account' },
    { value: 'individual_seller', label: 'Individual Seller Account' },
];

const ProductPublishing: React.FC<ProductPublishingProps> = ({
  formData,
  onFieldChange,
  sellerOptions,
  errors,
  disabled,
  isAdminMode = false,
}) => {
  return (
    <>
      <MultiFieldRow>
        <FieldGroup>
          <FormLabel htmlFor="status"><FaTasks /> Product Status*</FormLabel>
          <AdminSelect
            id="status"
            name="status"
            value={formData.status}
            onChange={(e) => onFieldChange('status', e.target.value)}
            options={statusOptions}
            required
            disabled={disabled}
            $hasError={!!errors.status}
          />
          {errors.status && <FieldError>{errors.status}</FieldError>}
        </FieldGroup>

        <FieldGroup>
          <FormLabel htmlFor="visibility"><FaEye /> Storefront Visibility*</FormLabel>
          <AdminSelect
            id="visibility"
            name="visibility"
            value={formData.visibility}
            onChange={(e) => onFieldChange('visibility', e.target.value)}
            options={visibilityOptions}
            required
            disabled={disabled}
            $hasError={!!errors.visibility}
          />
          {errors.visibility && <FieldError>{errors.visibility}</FieldError>}
        </FieldGroup>
      </MultiFieldRow>

      {/* 
        The seller selection fields are shown conditionally.
        If an admin is creating the product, they need to choose the seller.
        If a seller is creating their own product, these fields can be hidden
        as the backend will automatically assign them as the seller.
        We'll control this with the `isAdminMode` prop.
      */}
      {isAdminMode && (
        <>
            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '2rem 0' }}/>
            <MultiFieldRow>
                <FieldGroup>
                    <FormLabel htmlFor="sellerType"><FaUserTag /> Seller Type*</FormLabel>
                    <AdminSelect
                        id="sellerType"
                        name="sellerType"
                        value={formData.sellerType}
                        onChange={(e) => onFieldChange('sellerType', e.target.value)}
                        options={sellerTypeOptions}
                        required
                        disabled={disabled}
                    />
                </FieldGroup>
                <FieldGroup>
                    <FormLabel htmlFor="sellerId">Seller Account*</FormLabel>
                    <AdminSelect
                        id="sellerId"
                        name="sellerId"
                        value={formData.sellerId || ''}
                        onChange={(e) => onFieldChange('sellerId', e.target.value)}
                        options={[{ value: '', label: 'Select a Seller' }, ...sellerOptions]}
                        required
                        disabled={disabled}
                        // Add loading state when fetching sellers
                        $hasError={!!errors.sellerId}
                    />
                    {errors.sellerId && <FieldError>{errors.sellerId}</FieldError>}
                </FieldGroup>
            </MultiFieldRow>
            <FieldHelperText>As an administrator, you must specify which seller or vendor this product belongs to.</FieldHelperText>
        </>
      )}
    </>
  );
};

export default ProductPublishing;
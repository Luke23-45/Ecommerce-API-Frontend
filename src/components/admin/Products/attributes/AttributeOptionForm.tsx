
import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaBan, FaExclamationTriangle } from 'react-icons/fa';
import { useTheme } from 'styled-components';


import {
  OptionFormContainer,
  OptionFormHeader,
  OptionFormTitle,
  ParentAttributeContext,
  OptionActualForm,
} from './AttributeOptionForm.styles';
import { FormStickyActionBar } from './AttributeForm.styles';
import { FormAlert } from './AttributeForm.styles';
import { AdminInput,AdminButton } from '../../Dashboard/Common/Common.styles';

import FormSectionWrapper,{ FieldGroup, FormLabel } from '../../common/FormSectionWrapper/FormSectionWrapper';
import { LoadingOverlay as LoadingSpinner } from '../../Application/SellerApplications/SellerApplicationList.styles';
import ColorPickerInput from '../../common/ColorPickerInput/ColorPickerInput';


import {
  useGetAttributeById, 
  useGetAttributeOptionById,
  useCreateAttributeOption,
  useUpdateAttributeOption,
} from '@/hooks/admin/product/useAttribute'; 
import {
  type IAttributeOptionResponse,
  type IAttributeOptionCreatePayload,
  type IAttributeOptionUpdatePayload,
} from '@/types/attribute';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingOverlay } from '../../Application/SellerApplications/SellerApplicationList.styles';

const initialOptionState: Omit<IAttributeOptionCreatePayload, 'attributeId'> = {
  value: '',
  displayName: '',
  swatchValue: '',
};

const AttributeOptionForm: React.FC = ({attributeId,optionId}) => {

  console.log(attributeId,optionId,"000000000000")
  const navigate = useNavigate();
  // const { attributeId, optionId } = useParams<{ attributeId: string; optionId?: string }>();
  const isEditMode = !!optionId;
  const { showNotification } = useNotification();
  const theme = useTheme();
  const [optionData, setOptionData] = useState(initialOptionState);
  const [formError, setFormError] = useState<string | null>(null);

  
  const { data: parentAttribute, isLoading: isLoadingParent } = useGetAttributeById(
    attributeId,
    'name displayType',
    { enabled: !!attributeId }
  );

  
  const { data: existingOption, isLoading: isLoadingOption } = useGetAttributeOptionById(
    optionId,
    undefined,
    { enabled: isEditMode && !!optionId }
  );

  const createOptionMutation = useCreateAttributeOption({
    onSuccess: (response) => {
      showNotification(`Option "${response.data.value}" created successfully!`, 'success');
      if (attributeId) navigate(`/admin/attributes/${attributeId}/options`);
    },
    onError: (error: any) => {
      setFormError(error.message || 'Failed to create option.');
      showNotification(`Error: ${error.message || 'Unknown error'}`, 'error');
    },
  });

  const updateOptionMutation = useUpdateAttributeOption({
    onSuccess: (response) => {
      showNotification(`Option "${response.data.value}" updated successfully!`, 'success');
      if (attributeId) navigate(`/admin/attributes/${attributeId}/options`);
    },
    onError: (error: any) => {
      setFormError(error.message || 'Failed to update option.');
      showNotification(`Error: ${error.message || 'Unknown error'}`, 'error');
    },
  });

  useEffect(() => {
    if (isEditMode && existingOption) {
      setOptionData({
        value: existingOption.value,
        displayName: existingOption.displayName || '',
        swatchValue: existingOption.swatchValue || '',
      });
    } else if (!isEditMode) {
      setOptionData(initialOptionState);
    }
  }, [isEditMode, existingOption]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOptionData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setOptionData(prev => ({ ...prev, swatchValue: color }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!optionData.value.trim()) {
      setFormError('Option Value is required.');
      showNotification('Option Value is required.', 'warning');
      return;
    }
    if (!attributeId) {
      setFormError('Parent Attribute ID is missing. Cannot save option.');
      showNotification('Parent Attribute ID is missing.', 'error');
      return;
    }

    if (isEditMode && optionId) {
      const payload: IAttributeOptionUpdatePayload = { ...optionData };
      updateOptionMutation.mutate({ optionId, payload });
    } else {
      const payload: IAttributeOptionCreatePayload = {
        ...optionData,
        attributeId: attributeId,
      };
      createOptionMutation.mutate(payload);
    }
  };

  const handleCancel = () => {
    if (attributeId) navigate(`/admin/attributes/${attributeId}/options`);
    else navigate('/admin/attributes'); 
  };

  const isLoading = isLoadingParent || (isEditMode && isLoadingOption);

  if (isLoading) return <LoadingSpinner message="Loading option form..." />;
  if (!attributeId) return <p style={{color: 'red'}}>Error: Parent Attribute ID is missing in URL.</p>;
  if (!isLoadingParent && !parentAttribute) {
    return (
        <OptionFormContainer>
             <OptionFormHeader>
                <OptionFormTitle>Error</OptionFormTitle>
             </OptionFormHeader>
             <FormAlert $type="error">
                Parent attribute (ID: {attributeId}) not found. Cannot manage options.
             </FormAlert>
             <AdminButton $variant="secondary" onClick={() => navigate('/admin/attributes')}>
                <FaArrowLeft /> Back to Attributes
            </AdminButton>
        </OptionFormContainer>
    );
  }


  return (
    <OptionFormContainer>
      <OptionFormHeader>
        <OptionFormTitle>
          {isEditMode ? `Edit Option for ${parentAttribute?.name || 'Attribute'}` : `Add New Option to ${parentAttribute?.name || 'Attribute'}`}
        </OptionFormTitle>
        <AdminButton $variant="secondary" onClick={handleCancel}>
            <FaArrowLeft style={{ marginRight: '8px' }}/> Back to Options
        </AdminButton>
      </OptionFormHeader>
      {parentAttribute && (
        <ParentAttributeContext>
            Managing options for attribute: <strong>{parentAttribute.name}</strong> (Display Type: {parentAttribute.displayType})
        </ParentAttributeContext>
      )}


      {formError && <FormAlert $type="error"><FaExclamationTriangle style={{marginRight: '10px'}}/>{formError}</FormAlert>}

      <OptionActualForm onSubmit={handleSubmit}>
        <FormSectionWrapper title="Option Details">
          <FieldGroup>
            <FormLabel htmlFor="option-value">Value*</FormLabel>
            <AdminInput
              type="text"
              id="option-value"
              name="value"
              value={optionData.value}
              onChange={handleChange}
              placeholder="e.g., Red, Large, Cotton"
              required
              disabled={createOptionMutation.isPending || updateOptionMutation.isPending}
            />
          </FieldGroup>

          <FieldGroup>
            <FormLabel htmlFor="option-displayName">Display Name (Optional)</FormLabel>
            <AdminInput
              type="text"
              id="option-displayName"
              name="displayName"
              value={optionData.displayName || ''}
              onChange={handleChange}
              placeholder="e.g., Crimson Red (if different from value)"
              disabled={createOptionMutation.isPending || updateOptionMutation.isPending}
            />
          </FieldGroup>

          {parentAttribute?.displayType === 'swatch' && (
            <FieldGroup>
              <FormLabel htmlFor="option-swatchValue">
                Swatch Value (Color Hex or Image URL)
              </FormLabel>
              <ColorPickerInput
                id="option-swatchValue"
                initialColor={optionData.swatchValue || '#FFFFFF'}
                onChange={handleColorChange}
                disabled={createOptionMutation.isPending || updateOptionMutation.isPending}
              />
              <small style={{color: theme.colors.adminTextSecondary, fontSize: '0.8rem', marginTop: theme.spacing(1)}}>
                Enter a hex color (e.g., #FF0000) or an image URL for the swatch.
              </small>
            </FieldGroup>
          )}
          {/* Add other option-specific fields here if any in future */}
        </FormSectionWrapper>

        <FormStickyActionBar>
            <AdminButton
                type="button"
                $variant="secondary"
                onClick={handleCancel}
                disabled={createOptionMutation.isPending || updateOptionMutation.isPending}
            >
                <FaBan /> Cancel
            </AdminButton>
            <AdminButton
                type="submit"
                $variant="primary"
                disabled={createOptionMutation.isPending || updateOptionMutation.isPending}
            >
                {createOptionMutation.isPending || updateOptionMutation.isPending ? (
                    <LoadingSpinner size="1em" />
                ) : (
                    <FaCheckCircle />
                )}
                {isEditMode ? 'Save Changes' : 'Create Option'}
            </AdminButton>
        </FormStickyActionBar>
      </OptionActualForm>
    </OptionFormContainer>
  );
};

export default AttributeOptionForm;
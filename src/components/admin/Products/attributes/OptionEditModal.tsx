// src/components/Admin/Attributes/Options/OptionEditModal.tsx
import React, { useState, useEffect, type FormEvent } from 'react';
import { FaTimes, FaCheckCircle, FaBan } from 'react-icons/fa';

import {
  OptionModalOverlay,
  OptionModalContent,
  OptionModalHeader,
  OptionModalForm,
  OptionModalActions,
} from './OptionEditModal.styles';
// Assuming common form components are available
import { AdminInput, AdminButton } from '../../Dashboard/Common/Common.styles'; // Adjust path
import { FieldGroup, FormLabel } from '../../common/FormSectionWrapper/FormSectionWrapper.styles'; 


import { LoadingOverlay as LoadingSpinner } from '../../Application/SellerApplications/SellerApplicationList.styles';
import ColorPickerInput from '../../common/ColorPickerInput/ColorPickerInput';
import {
  useCreateAttributeOption,
  useUpdateAttributeOption,
} from '@/hooks/admin/product/useAttribute'; // Adjust path
import {
  type IAttributeOptionResponse,
  type IAttributeOptionCreatePayload,
  type IAttributeOptionUpdatePayload,
} from '@/types/attribute';
import { useNotification } from '@/contexts/NotificationContext';

interface OptionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void; // Callback after successful save
  parentAttributeId: string; // ID of the attribute this option belongs to
  editingOption?: IAttributeOptionResponse | null;
  parentAttributeDisplayType?: 'swatch' | 'dropdown' | 'radio' | 'text';
}

const initialOptionState: Omit<IAttributeOptionCreatePayload, 'attributeId'> = {
  value: '',
  displayName: '',
  swatchValue: '',
};


const OptionEditModal: React.FC<OptionEditModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  parentAttributeId,
  editingOption,
  parentAttributeDisplayType,
}) => {
  const { showNotification } = useNotification();
  const isEditMode = !!editingOption;

  const [optionData, setOptionData] = useState(initialOptionState);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingOption) {
      setOptionData({
        value: editingOption.value,
        displayName: editingOption.displayName || '',
        swatchValue: editingOption.swatchValue || '',
      });
    } else {
      setOptionData(initialOptionState); // Reset for new option
    }
  }, [editingOption, isOpen]); // Reset when modal opens or editingOption changes

  const createOptionMutation = useCreateAttributeOption({
    onSuccess: () => {
      onSaveSuccess(); // Parent will show notification and refetch
    },
    onError: (error: any) => {
      setFormError(error.message || 'Failed to create option.');
      showNotification(`Error creating option: ${error.message || 'Unknown error'}`, 'error');
    },
  });

  const updateOptionMutation = useUpdateAttributeOption({
    onSuccess: () => {
      onSaveSuccess();
    },
    onError: (error: any) => {
      setFormError(error.message || 'Failed to update option.');
      showNotification(`Error updating option: ${error.message || 'Unknown error'}`, 'error');
    },
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOptionData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => { // For ColorPickerInput
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
    // If swatch type and no swatchValue (for color), maybe make it required? Or default?
    if (parentAttributeDisplayType === 'swatch' && optionData.value.trim() && !optionData.swatchValue?.trim()) {
        // Could auto-generate a placeholder color or show warning
        // For now, let's assume it's optional or user explicitly sets it.
        // If swatchValue is meant to be an image URL, this check is different.
    }


    if (isEditMode && editingOption) {
      const payload: IAttributeOptionUpdatePayload = { ...optionData };
      updateOptionMutation.mutate({ optionId: editingOption.id, payload });
    } else {
      const payload: IAttributeOptionCreatePayload = {
        ...optionData,
        attributeId: parentAttributeId,
      };
      createOptionMutation.mutate(payload);
    }
  };

  if (!isOpen) return null;

  const isLoading = createOptionMutation.isPending || updateOptionMutation.isPending;

  return (
    <OptionModalOverlay onClick={onClose}>
      <OptionModalContent onClick={e => e.stopPropagation()}>
        <OptionModalHeader>
          <h4>{isEditMode ? `Edit Option: ${editingOption?.value}` : 'Add New Option'}</h4>
          <button type="button" onClick={onClose} aria-label="Close"><FaTimes /></button>
        </OptionModalHeader>

        {formError && <p style={{color: 'red', marginBottom: '10px'}}>{formError}</p>}

        <OptionModalForm onSubmit={handleSubmit}>
          <FieldGroup>
            <FormLabel htmlFor="option-value">Option Value*</FormLabel>
            <AdminInput
              type="text"
              id="option-value"
              name="value"
              value={optionData.value}
              onChange={handleChange}
              placeholder="e.g., Red, Large, Cotton"
              required
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </FieldGroup>

          {parentAttributeDisplayType === 'swatch' && (
            <FieldGroup>
              <FormLabel htmlFor="option-swatchValue">
                Swatch Value (Color Hex or Image URL)
              </FormLabel>
              {/* <AdminInput
                type="text"
                id="option-swatchValue"
                name="swatchValue"
                value={optionData.swatchValue || ''}
                onChange={handleChange}
                placeholder="e.g., #FF0000 or https://example.com/image.png"
                disabled={isLoading}
              /> */}
              <ColorPickerInput
                id="option-swatchValue"
                initialColor={optionData.swatchValue || '#FFFFFF'} // Default to white or empty
                onChange={handleColorChange}
                disabled={isLoading}
              />
              <small>Enter a hex color (e.g., #FF0000) or an image URL for the swatch.</small>
            </FieldGroup>
          )}
        </OptionModalForm>

        <OptionModalActions>
          <AdminButton $variant="secondary" onClick={onClose} type="button" disabled={isLoading}>
            <FaBan /> Cancel
          </AdminButton>
          <AdminButton $variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="1em"/> : <FaCheckCircle />}
            {isEditMode ? 'Save Changes' : 'Add Option'}
          </AdminButton>
        </OptionModalActions>
      </OptionModalContent>
    </OptionModalOverlay>
  );
};

export default OptionEditModal;
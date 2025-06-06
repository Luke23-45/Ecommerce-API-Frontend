// src/components/Admin/Attributes/Options/AttributeOptionManagerModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaPlus, FaEdit, FaTrashAlt, FaListUl, FaSearch } from 'react-icons/fa';
import { useTheme } from 'styled-components'; // Import useTheme

import {
  ModalOverlay,
  ManagerModalContent,
  ManagerModalHeader,
  OptionsListContainer,
  NoOptionsMessage,
  ManagerModalActions,
  OptionSearchInput,
  // SwatchPreview component (assuming it's correctly defined in styles)
} from './AttributeOptionManagerModal.styles';
import { SwatchPreview } from './AttributeOptionManagerModal.styles'; // Explicit import if needed or part of above

import { AdminTableWrapper, AdminTable, TableActionButton } from '../../Products/ProductList.styles';
import { AdminButton } from '../../Dashboard/Common/Common.styles';

import {
  useGetOptionsForAttribute,
  useDeleteAttributeOption,
} from '@/hooks/admin/product/useAttribute';
import { type IAttributeOptionResponse } from '@/types/attribute';
import { useNotification } from '@/contexts/NotificationContext';
import { LoadingOverlay as LoadingSpinner } from '../../Application/SellerApplications/SellerApplicationList.styles';

import ConfirmationModal from '../../common/ConfirmationModal/ConfirmationModal';
import OptionEditModal from './OptionEditModal';

interface AttributeOptionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  attributeId: string | null;
  attributeName: string | null;
  parentAttributeDisplayType?: 'swatch' | 'dropdown' | 'radio' | 'text';
}

const AttributeOptionManagerModal: React.FC<AttributeOptionManagerModalProps> = ({
  isOpen,
  onClose,
  attributeId,
  attributeName,
  parentAttributeDisplayType,
}) => {
  const { showNotification } = useNotification();
  const theme = useTheme(); // For accessing theme variables if needed in JSX

  const [isOptionEditModalOpen, setIsOptionEditModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<IAttributeOptionResponse | null>(null);
  const [optionSearchTerm, setOptionSearchTerm] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState<IAttributeOptionResponse | null>(null);

  const {
    data: optionsFromHook, // Renamed to avoid confusion, this is IAttributeOptionResponse[] due to 'select'
    isLoading: isLoadingOptions,
    isError: isOptionsError,
    error: optionsError,
    refetch: refetchOptions,
    isFetching: isFetchingOptions, // To show subtle loading on refetch
  } = useGetOptionsForAttribute(attributeId, undefined, {
    enabled: isOpen && !!attributeId,
    // keepPreviousData: true, // Consider adding for smoother UX on param changes if any
  });

  // CORRECTED: optionsFromHook is already the array IAttributeOptionResponse[]
  const options = optionsFromHook || [];

  const filteredOptions = useMemo(() => {
    if (!optionSearchTerm.trim()) return options;
    const term = optionSearchTerm.toLowerCase().trim();
    return options.filter(opt =>
      opt.value.toLowerCase().includes(term) ||
      (opt.displayName && opt.displayName.toLowerCase().includes(term)) ||
      opt.slug.toLowerCase().includes(term)
    );
  }, [options, optionSearchTerm]);

  const deleteOptionMutation = useDeleteAttributeOption({
    onSuccess: () => {
      showNotification(`Option "${optionToDelete?.value}" deleted successfully.`, 'success');
      // refetchOptions(); // Invalidation in hook should trigger this if queryKey is stable
      setIsDeleteConfirmOpen(false);
      setOptionToDelete(null);
    },
    onError: (error: any) => {
      showNotification(`Error deleting option: ${error.message || 'Unknown error'}`, 'error');
      setIsDeleteConfirmOpen(false);
      setOptionToDelete(null);
    }
  });

  // Effect to refetch when modal is opened for a specific attributeId
  useEffect(() => {
    if (isOpen && attributeId) {
      console.log(`AttributeOptionManagerModal: Modal opened for attributeId: ${attributeId}. Refetching options.`);
      refetchOptions();
      setOptionSearchTerm(''); // Reset search term when the attribute context changes
    }
  }, [isOpen, attributeId, refetchOptions]); // refetchOptions is stable from React Query

  const handleOpenAddOptionModal = () => {
    setEditingOption(null);
    setIsOptionEditModalOpen(true);
  };

  const handleOpenEditOptionModal = (option: IAttributeOptionResponse) => {
    setEditingOption(option);
    setIsOptionEditModalOpen(true);
  };

  const handleOptionSaveSuccess = () => {
    setIsOptionEditModalOpen(false);
    setEditingOption(null);
    // refetchOptions(); // Invalidation from create/update option hooks should handle this.
                      // Explicit refetch here is okay for certainty if needed.
    showNotification(editingOption ? 'Option updated successfully!' : 'Option added successfully!', 'success');
  };

  const handleDeleteOption = (option: IAttributeOptionResponse) => {
    setOptionToDelete(option);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (optionToDelete) {
      deleteOptionMutation.mutate(optionToDelete.id);
    }
  };

  // Early return if modal is not open or no attributeId
  if (!isOpen) return null;
  if (!attributeId) { // Should ideally not happen if isOpen is true, but good guard
    console.warn("AttributeOptionManagerModal rendered without a valid attributeId.");
    return (
      <ModalOverlay onClick={onClose}>
        <ManagerModalContent onClick={e => e.stopPropagation()}>
          <ManagerModalHeader>
            <h3>Error</h3>
            <button type="button" onClick={onClose} aria-label="Close"><FaTimes /></button>
          </ManagerModalHeader>
          <p style={{ textAlign: 'center', color: theme.colors.adminStatusError }}>
            No attribute selected to manage options.
          </p>
          <ManagerModalActions>
            <AdminButton $variant="secondary" onClick={onClose}>Close</AdminButton>
          </ManagerModalActions>
        </ManagerModalContent>
      </ModalOverlay>
    );
  }

  // --- Content to render when modal is open and attributeId is present ---
  let listContent;
  if (isLoadingOptions && options.length === 0) { // Initial full load
    listContent = (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <LoadingSpinner message="Loading options..." />
      </div>
    );
  } else if (isOptionsError) {
    listContent = (
      <NoOptionsMessage style={{ borderColor: theme.colors.adminStatusError, color: theme.colors.adminStatusError }}>
        <FaTimes />
        <p>Error: {(optionsError as any)?.message || 'Could not load options.'}</p>
        <AdminButton $variant="neutral" onClick={() => refetchOptions()}>Try Again</AdminButton>
      </NoOptionsMessage>
    );
  } else if (filteredOptions.length === 0) {
    listContent = (
      <NoOptionsMessage>
        <FaListUl />
        <p>{optionSearchTerm ? 'No options found matching your search.' : 'No options defined yet for this attribute. Add one!'}</p>
      </NoOptionsMessage>
    );
  } else {
    listContent = (
      <AdminTableWrapper>
        <AdminTable>
          <thead>
            <tr>
              <th>Value</th>
              <th>Display Name</th>
              <th>Slug</th>
              {parentAttributeDisplayType === 'swatch' && <th>Swatch</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOptions.map(option => (
              <tr key={option.id}>
                <td>{option.value}</td>
                <td>{option.displayName || '-'}</td>
                <td>{option.slug}</td>
                {parentAttributeDisplayType === 'swatch' && (
                  <td>
                    {option.swatchValue ? (
                      <SwatchPreview
                        $color={option.swatchValue.startsWith('#') ? option.swatchValue : undefined}
                        $imageUrl={!option.swatchValue.startsWith('#') ? option.swatchValue : undefined}
                        title={option.swatchValue}
                      />
                    ) : '-'}
                  </td>
                )}
                <td>
                  <TableActionButton onClick={() => handleOpenEditOptionModal(option)} title="Edit Option">
                    <FaEdit />
                  </TableActionButton>
                  <TableActionButton onClick={() => handleDeleteOption(option)} title="Delete Option">
                    <FaTrashAlt />
                  </TableActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </AdminTableWrapper>
    );
  }


  return (
    <ModalOverlay onClick={onClose}>
      <ManagerModalContent onClick={e => e.stopPropagation()}>
        <ManagerModalHeader>
          <h3>
            Manage Options for: <span>{attributeName || 'Attribute'}</span>
            {isFetchingOptions && <LoadingSpinner size="1em" thickness="2px" style={{ marginLeft: '10px' }} /> /* Subtle fetching indicator */}
          </h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </ManagerModalHeader>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: '16px' }}>
            <OptionSearchInput
                type="text"
                placeholder="Search options..."
                value={optionSearchTerm}
                onChange={(e) => setOptionSearchTerm(e.target.value)}
                disabled={isLoadingOptions && options.length === 0} // Disable search if initial load
            />
            <AdminButton $variant="primary" onClick={handleOpenAddOptionModal} style={{whiteSpace: 'nowrap'}} disabled={isLoadingOptions && options.length === 0}>
                <FaPlus /> Add Option
            </AdminButton>
        </div>

        <OptionsListContainer>
          {listContent}
        </OptionsListContainer>

        <ManagerModalActions>
          <AdminButton $variant="secondary" onClick={onClose} type="button">
            Done
          </AdminButton>
        </ManagerModalActions>

        {isOptionEditModalOpen && attributeId && (
          <OptionEditModal
            isOpen={isOptionEditModalOpen}
            onClose={() => setIsOptionEditModalOpen(false)}
            onSaveSuccess={handleOptionSaveSuccess}
            parentAttributeId={attributeId}
            editingOption={editingOption}
            parentAttributeDisplayType={parentAttributeDisplayType}
          />
        )}

        <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
            onConfirm={confirmDelete}
            title="Confirm Delete Option"
            message={`Are you sure you want to delete the option "${optionToDelete?.value || ''}"? This action cannot be undone.`}
            confirmButtonText="Delete"
            isLoading={deleteOptionMutation.isPending}
            isDanger={true}
        />
      </ManagerModalContent>
    </ModalOverlay>
  );
};

export default AttributeOptionManagerModal;
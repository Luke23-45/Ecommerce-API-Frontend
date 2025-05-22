// src/components/Admin/Common/ConfirmationModal/ConfirmationModal.tsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalActions,
} from './ConfirmationModal.styles';
import { AdminButton } from '../../Dashboard/Common/Common.styles';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmVariant?: 'primary' | 'danger'; // Primary for general, danger for delete
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel,
  confirmVariant = 'primary', // Default to primary for non-destructive confirms
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onCancel}> {/* Click overlay to cancel */}
      <ModalContent onClick={e => e.stopPropagation()}> {/* Prevent clicks on modal from closing overlay */}
        <ModalHeader>
          <h2>{title}</h2>
          <button type="button" onClick={onCancel} aria-label="Close modal">
            <FaTimes />
          </button>
        </ModalHeader>
        <ModalBody>
          {message}
        </ModalBody>
        <ModalActions>
          <AdminButton $variant="secondary" onClick={onCancel} type="button">
            {cancelButtonText}
          </AdminButton>
          <AdminButton $variant={confirmVariant} onClick={onConfirm} type="button">
            {confirmButtonText}
          </AdminButton>
        </ModalActions>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmationModal;
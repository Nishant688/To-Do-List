import React, { useState } from 'react';
import { ConfirmModal } from '../common/ConfirmModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const DeleteAccountModal = ({ isOpen, onClose }) => {
  const { deleteAccount } = useAuth();
  const { showError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await deleteAccount();
      onClose();
    } catch (err) {
      showError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirmDelete}
      title="Delete Account"
      message="Are you sure you want to permanently delete your account? All your tasks and settings will be erased forever with no undo."
      confirmText="Yes, Delete My Account"
      confirmVariant="danger"
      loading={loading}
    />
  );
};

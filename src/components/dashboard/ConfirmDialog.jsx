'use client';

import { Modal, ModalBackdrop, ModalContainer, ModalDialog, ModalHeader, ModalHeading, ModalBody, ModalFooter, Button } from '@heroui/react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  confirmColor = 'danger',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModalBackdrop />
      <ModalContainer>
        <ModalDialog>
          <ModalHeader>
            <ModalHeading>{title}</ModalHeading>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onPress={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              className={confirmColor === 'danger' ? 'bg-red-600 text-white' : 'bg-[#5e17eb] text-white'}
              onPress={onConfirm}
              isLoading={isLoading}
            >
              {confirmLabel}
            </Button>
          </ModalFooter>
        </ModalDialog>
      </ModalContainer>
    </Modal>
  );
}

import React from "react";
import { Modal as BSModal, ModalProps as BSModalProps } from "react-bootstrap";
import { Button } from "./Button";

interface ModalProps extends BSModalProps {
  title?: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: string;
  loading?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  loading = false,
  ...props
}) => {
  return (
    <BSModal {...props} onHide={onCancel}>
      {title && (
        <BSModal.Header closeButton>
          <BSModal.Title>{title}</BSModal.Title>
        </BSModal.Header>
      )}
      <BSModal.Body>{children}</BSModal.Body>
      {(onConfirm || onCancel) && (
        <BSModal.Footer>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel} disabled={loading}>
              {cancelText}
            </Button>
          )}
          {onConfirm && (
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              loading={loading}
            >
              {confirmText}
            </Button>
          )}
        </BSModal.Footer>
      )}
    </BSModal>
  );
};

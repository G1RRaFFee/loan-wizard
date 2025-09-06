import type { JSX, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal = ({
  open,
  onClose,
  children,
  title,
}: ModalProps): JSX.Element | null => {
  if (!open) return null;
  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      role="dialog"
      style={{ background: "rgba(0,0,0,.5)" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Ок
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

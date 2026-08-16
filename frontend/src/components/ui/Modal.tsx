import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  closeOnBackdrop?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = '480px',
  closeOnBackdrop = true,
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fs-modal-backdrop"
      onClick={closeOnBackdrop ? onClose : undefined}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        className={['fs-modal', className].filter(Boolean).join(' ')}
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || subtitle) && (
          <div className="fs-modal__header">
            <div className="fs-modal__header-text">
              {title && <h2 className="fs-modal__title">{title}</h2>}
              {subtitle && <p className="fs-modal__subtitle">{subtitle}</p>}
            </div>
            <button className="fs-modal__close" onClick={onClose} aria-label="Close">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        <div className="fs-modal__body">{children}</div>
        {footer && <div className="fs-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
};

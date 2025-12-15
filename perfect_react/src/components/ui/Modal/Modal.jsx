import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/helpers';
import styles from './Modal.module.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closable = true,
  maskClosable = true,
  className = '',
  ...props
}) => {
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closable, onClose]);

  if (!isOpen) return null;

  const handleMaskClick = (e) => {
    if (e.target === e.currentTarget && maskClosable && closable) {
      onClose();
    }
  };

  const modalClasses = cn(
    styles.modal,
    styles[size],
    className
  );

  return createPortal(
    <div className={styles.overlay} onClick={handleMaskClick}>
      <div className={modalClasses} {...props}>
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {closable && (
              <button
                className={styles.closeButton}
                onClick={onClose}
                aria-label="Close modal"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

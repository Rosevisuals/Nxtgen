import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import Button from './Button';

/**
 * Modal Component
 * 
 * A reusable modal component for dialogs.
 * 
 * @param {boolean} isOpen - Whether the modal is open
 * @param {function} onClose - Function to call when the modal is closed
 * @param {string} title - The modal title
 * @param {node} children - The modal content
 * @param {string} size - The modal size (sm, md, lg, xl)
 * @param {boolean} closeOnOverlayClick - Whether to close the modal when the overlay is clicked
 * @param {boolean} showCloseButton - Whether to show the close button in the header
 * @param {node} footer - Custom footer content
 * @param {string} className - Additional CSS classes
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  footer,
  className = '',
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Handle ESC key press to close the modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (isOpen && event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  // Don't render anything if the modal is not open
  if (!isOpen) return null;
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };
  
  // Base modal class
  let modalClass = 'modal-content';
  
  // Add size class
  switch (size) {
    case 'sm':
      modalClass += ' modal-sm';
      break;
    case 'lg':
      modalClass += ' modal-lg';
      break;
    case 'xl':
      modalClass += ' modal-xl';
      break;
    default:
      // Medium is the default, no additional class needed
      break;
  }
  
  // Add any additional classes
  if (className) {
    modalClass += ` ${className}`;
  }
  
  // Create the modal content
  const modalContent = (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={modalClass}>
        <div className="modal-header">
          {title && <h3 className="modal-title">{title}</h3>}
          {showCloseButton && (
            <button className="modal-close" onClick={onClose}>
              &times;
            </button>
          )}
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
  
  // Use a portal to render the modal at the end of the document body
  return createPortal(modalContent, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  closeOnOverlayClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  footer: PropTypes.node,
  className: PropTypes.string,
};

/**
 * Modal.Footer Component
 * 
 * A helper component for creating modal footers with common actions.
 */
Modal.Footer = ({ onCancel, onConfirm, cancelText = 'Cancel', confirmText = 'Confirm', children }) => {
  if (children) {
    return <div className="modal-footer">{children}</div>;
  }
  
  return (
    <div className="modal-footer">
      {onCancel && (
        <Button variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
      )}
      {onConfirm && (
        <Button variant="primary" onClick={onConfirm}>
          {confirmText}
        </Button>
      )}
    </div>
  );
};

Modal.Footer.propTypes = {
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  children: PropTypes.node,
};

export default Modal;
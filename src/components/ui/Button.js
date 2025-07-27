import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button Component
 * 
 * A reusable button component with different variants and sizes.
 * 
 * @param {string} variant - The button variant (primary, secondary, outline, text)
 * @param {string} size - The button size (sm, md, lg)
 * @param {boolean} fullWidth - Whether the button should take full width
 * @param {function} onClick - The click handler function
 * @param {boolean} disabled - Whether the button is disabled
 * @param {node} children - The button content
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onClick,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  // Base button class
  let buttonClass = 'btn';
  
  // Add variant class
  switch (variant) {
    case 'primary':
      buttonClass += ' btn-primary';
      break;
    case 'secondary':
      buttonClass += ' btn-secondary';
      break;
    case 'outline':
      buttonClass += ' btn-outline-primary';
      break;
    case 'text':
      buttonClass += ' btn-text';
      break;
    default:
      buttonClass += ' btn-primary';
  }
  
  // Add size class
  switch (size) {
    case 'sm':
      buttonClass += ' btn-sm';
      break;
    case 'lg':
      buttonClass += ' btn-lg';
      break;
    default:
      // Medium is the default, no additional class needed
      break;
  }
  
  // Add full width class if needed
  if (fullWidth) {
    buttonClass += ' btn-block';
  }
  
  // Add disabled class if needed
  if (disabled) {
    buttonClass += ' btn-disabled';
  }
  
  // Add any additional classes
  if (className) {
    buttonClass += ` ${className}`;
  }
  
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Button;
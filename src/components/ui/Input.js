import React from 'react';
import PropTypes from 'prop-types';

/**
 * Input Component
 * 
 * A reusable input component for forms.
 * 
 * @param {string} type - The input type (text, email, password, etc.)
 * @param {string} id - The input id
 * @param {string} name - The input name
 * @param {string} label - The input label
 * @param {string} value - The input value
 * @param {function} onChange - The change handler function
 * @param {string} placeholder - The input placeholder
 * @param {boolean} required - Whether the input is required
 * @param {boolean} disabled - Whether the input is disabled
 * @param {string} error - Error message to display
 * @param {string} helperText - Helper text to display
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props
 */
const Input = ({
  type = 'text',
  id,
  name,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  className = '',
  ...props
}) => {
  // Generate a unique ID if not provided
  const inputId = id || `input-${name}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Base input class
  let inputClass = 'form-input';
  
  // Add error class if needed
  if (error) {
    inputClass += ' form-input-error';
  }
  
  // Add disabled class if needed
  if (disabled) {
    inputClass += ' form-input-disabled';
  }
  
  // Add any additional classes
  if (className) {
    inputClass += ` ${className}`;
  }
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClass}
        {...props}
      />
      
      {error && <div className="form-error">{error}</div>}
      {helperText && !error && <div className="form-helper-text">{helperText}</div>}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
};

export default Input;
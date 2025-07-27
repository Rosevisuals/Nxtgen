import React from 'react';
import PropTypes from 'prop-types';

/**
 * Select Component
 * 
 * A reusable select component for dropdowns.
 * 
 * @param {string} id - The select id
 * @param {string} name - The select name
 * @param {string} label - The select label
 * @param {array} options - Array of options
 * @param {string|number} value - The selected value
 * @param {function} onChange - The change handler function
 * @param {string} placeholder - The select placeholder
 * @param {boolean} required - Whether the select is required
 * @param {boolean} disabled - Whether the select is disabled
 * @param {string} error - Error message to display
 * @param {string} helperText - Helper text to display
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props
 */
const Select = ({
  id,
  name,
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  className = '',
  ...props
}) => {
  // Generate a unique ID if not provided
  const selectId = id || `select-${name}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Base select class
  let selectClass = 'form-select';
  
  // Add error class if needed
  if (error) {
    selectClass += ' form-select-error';
  }
  
  // Add disabled class if needed
  if (disabled) {
    selectClass += ' form-select-disabled';
  }
  
  // Add any additional classes
  if (className) {
    selectClass += ` ${className}`;
  }
  
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={selectClass}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <div className="form-error">{error}</div>}
      {helperText && !error && <div className="form-helper-text">{helperText}</div>}
    </div>
  );
};

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  className: PropTypes.string,
};

export default Select;
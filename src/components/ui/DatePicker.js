import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

/**
 * DatePicker Component
 * 
 * A reusable date picker component.
 * 
 * @param {string} id - The input id
 * @param {string} name - The input name
 * @param {string} label - The input label
 * @param {Date} value - The selected date
 * @param {function} onChange - The change handler function
 * @param {string} placeholder - The input placeholder
 * @param {boolean} required - Whether the input is required
 * @param {boolean} disabled - Whether the input is disabled
 * @param {string} error - Error message to display
 * @param {string} helperText - Helper text to display
 * @param {Date} minDate - The minimum selectable date
 * @param {Date} maxDate - The maximum selectable date
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props
 */
const DatePicker = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = 'Select a date',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  minDate,
  maxDate,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Generate a unique ID if not provided
  const inputId = id || `datepicker-${name}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Base input class
  let inputClass = 'form-input datepicker-input';
  
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
  
  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString();
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    onChange(date);
    setIsOpen(false);
  };
  
  // Toggle calendar
  const toggleCalendar = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div className="form-group datepicker-container">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}
      
      <div className="datepicker-wrapper">
        <input
          type="text"
          id={inputId}
          name={name}
          value={formatDate(value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={inputClass}
          onClick={toggleCalendar}
          readOnly
          {...props}
        />
        
        <button
          type="button"
          className="datepicker-toggle"
          onClick={toggleCalendar}
          disabled={disabled}
        >
          <i className="fas fa-calendar-alt"></i>
        </button>
        
        {isOpen && (
          <div className="datepicker-calendar">
            <Calendar
              onChange={handleDateChange}
              value={value}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        )}
      </div>
      
      {error && <div className="form-error">{error}</div>}
      {helperText && !error && <div className="form-helper-text">{helperText}</div>}
    </div>
  );
};

DatePicker.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  className: PropTypes.string,
};

export default DatePicker;
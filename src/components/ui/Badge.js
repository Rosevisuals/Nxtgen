import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge Component
 * 
 * A reusable badge component for status indicators.
 * 
 * @param {string} variant - The badge variant (primary, secondary, success, warning, danger, info)
 * @param {node} children - The badge content
 * @param {boolean} pill - Whether the badge should have pill shape
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props
 */
const Badge = ({
  variant = 'primary',
  children,
  pill = false,
  className = '',
  ...props
}) => {
  // Base badge class
  let badgeClass = 'badge';
  
  // Add variant class
  switch (variant) {
    case 'primary':
      badgeClass += ' badge-primary';
      break;
    case 'secondary':
      badgeClass += ' badge-secondary';
      break;
    case 'success':
      badgeClass += ' badge-success';
      break;
    case 'warning':
      badgeClass += ' badge-warning';
      break;
    case 'danger':
      badgeClass += ' badge-danger';
      break;
    case 'info':
      badgeClass += ' badge-info';
      break;
    default:
      badgeClass += ' badge-primary';
  }
  
  // Add pill class if needed
  if (pill) {
    badgeClass += ' badge-pill';
  }
  
  // Add any additional classes
  if (className) {
    badgeClass += ` ${className}`;
  }
  
  return (
    <span className={badgeClass} {...props}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info']),
  children: PropTypes.node.isRequired,
  pill: PropTypes.bool,
  className: PropTypes.string,
};

export default Badge;
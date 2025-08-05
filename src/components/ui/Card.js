import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card Component
 * 
 * A reusable card component for displaying content.
 * 
 * @param {node} children - The card content
 * @param {string} title - The card title
 * @param {node} icon - The card icon
 * @param {string} variant - The card variant (default, primary, secondary)
 * @param {boolean} hoverable - Whether the card should have hover effects
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props
 */
const Card = ({
  children,
  title,
  icon,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  // Base card class
  let cardClass = 'card';
  
  // Add variant class
  switch (variant) {
    case 'primary':
      cardClass += ' card-primary';
      break;
    case 'secondary':
      cardClass += ' card-secondary';
      break;
    default:
      // Default variant, no additional class needed
      break;
  }
  
  // Add hoverable class if needed
  if (hoverable) {
    cardClass += ' card-hoverable';
  }
  
  // Add any additional classes
  if (className) {
    cardClass += ` ${className}`;
  }
  
  return (
    <div className={cardClass} {...props}>
      {(title || icon) && (
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary']),
  hoverable: PropTypes.bool,
  className: PropTypes.string,
};

export default Card;
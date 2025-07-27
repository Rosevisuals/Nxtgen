import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

/**
 * Sidebar Component
 * 
 * A reusable sidebar component for navigation.
 * 
 * @param {array} items - Array of navigation items
 * @param {string} title - The sidebar title
 * @param {node} logo - The sidebar logo
 * @param {boolean} collapsed - Whether the sidebar is collapsed
 * @param {function} onToggleCollapse - Function to toggle sidebar collapse
 * @param {string} className - Additional CSS classes
 */
const Sidebar = ({
  items = [],
  title,
  logo,
  collapsed = false,
  onToggleCollapse,
  className = '',
}) => {
  const location = useLocation();
  
  // Base sidebar class
  let sidebarClass = 'sidebar';
  
  // Add collapsed class if needed
  if (collapsed) {
    sidebarClass += ' sidebar-collapsed';
  }
  
  // Add any additional classes
  if (className) {
    sidebarClass += ` ${className}`;
  }
  
  return (
    <div className={sidebarClass}>
      <div className="sidebar-header">
        {logo && <div className="sidebar-logo">{logo}</div>}
        {title && <h2 className="sidebar-title">{title}</h2>}
        
        {onToggleCollapse && (
          <button 
            className="sidebar-toggle" 
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {items.map((item, index) => {
            // Check if the current path matches this item's path
            const isActive = location.pathname === item.path;
            
            // Item class
            let itemClass = 'sidebar-menu-item';
            if (isActive) {
              itemClass += ' active';
            }
            
            return (
              <li key={index} className={itemClass}>
                <Link to={item.path} className="sidebar-menu-link">
                  {item.icon && <span className="sidebar-menu-icon">{item.icon}</span>}
                  {!collapsed && <span className="sidebar-menu-text">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  title: PropTypes.string,
  logo: PropTypes.node,
  collapsed: PropTypes.bool,
  onToggleCollapse: PropTypes.func,
  className: PropTypes.string,
};

export default Sidebar;
import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar2.css';

/**
 * Sidebar Component
 * 
 * A reusable sidebar component for navigation.
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
  
  let sidebarClass = 'sidebar';
  if (collapsed) {
    sidebarClass += ' sidebar-collapsed';
  }
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
            const isActive = location.pathname === item.path;
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
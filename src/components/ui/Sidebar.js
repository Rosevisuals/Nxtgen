import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import '../unified-sidebar.css';

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
  
  // Add mobile menu toggle functionality
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <>
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={onToggleCollapse}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      )}
      <div className={sidebarClass}>
        <div className="sidebar-header">
          {logo ? (
            <div className="sidebar-logo">{logo}</div>
          ) : (
            <div className="sidebar-logo">NH</div>
          )}
          {title && !collapsed && <h2 className="sidebar-title">{title}</h2>}
          {onToggleCollapse && !isMobile && (
            <button 
              className="sidebar-toggle" 
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <i className={`fas fa-${collapsed ? 'chevron-right' : 'chevron-left'}`}></i>
            </button>
          )}
        </div>
        <input 
          type="text" 
          className="sidebar-search" 
          placeholder="Search menu..."
          style={{ display: collapsed ? 'none' : 'block' }}
        />
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
            <li className="sidebar-menu-item">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  localStorage.removeItem('token');
                  localStorage.removeItem('user_id');
                  localStorage.removeItem('user_email');
                  localStorage.removeItem('user_name');
                  localStorage.removeItem('user_role');
                  window.location.href = '/login';
                }}
                className="sidebar-menu-link"
                aria-label="Logout"
              >
                <span className="sidebar-menu-icon"><i className="fas fa-sign-out-alt"></i></span>
                {!collapsed && <span className="sidebar-menu-text">Logout</span>}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
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
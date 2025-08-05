import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from './Button';
import './navbar.css';

/**
 * Navbar Component
 * 
 * A reusable navbar component for the application header.
 */
const Navbar = ({
  title,
  logo,
  links = [],
  rightContent,
  transparent = false,
  fixed = true,
  className = '',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  let navbarClass = 'navbar';
  if (transparent) navbarClass += ' navbar-transparent';
  if (fixed) navbarClass += ' navbar-fixed';
  if (className) navbarClass += ` ${className}`;
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <header className={navbarClass}>
      <div className="navbar-container">
        <div className="navbar-brand">
          {logo && <div className="navbar-logo">{logo}</div>}
          {title && <h1 className="navbar-title">{title}</h1>}
        </div>
        
        <button 
          className="navbar-toggle" 
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
        </button>
        
        <nav className={`navbar-menu ${isMenuOpen ? 'is-open' : ''}`}>
          <ul className="navbar-links">
            {links.map((link, index) => (
              <li key={index} className="navbar-item">
                <Link 
                  to={link.path} 
                  className="navbar-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {rightContent && (
          <div className="navbar-right">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  );
};

Navbar.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.node,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  rightContent: PropTypes.node,
  transparent: PropTypes.bool,
  fixed: PropTypes.bool,
  className: PropTypes.string,
};

/**
 * NavbarUser Component
 *
 * A component for displaying user information in the navbar.
 */
const NavbarUser = ({ user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };
  
  return (
    <div className="navbar-user">
      <button 
        className="navbar-user-toggle" 
        onClick={toggleDropdown}
        aria-label="User menu"
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="navbar-user-avatar" 
          />
        ) : (
          <div className="navbar-user-initials">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="navbar-user-name">{user.name}</span>
        <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
      </button>
      
      {isDropdownOpen && (
        <>
          <div className="navbar-dropdown-overlay" onClick={closeDropdown}></div>
          <div className="navbar-user-dropdown">
            <div className="navbar-user-header">
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </div>
            
            <ul className="navbar-user-menu">
              <li className="navbar-user-divider"></li>
              <li>
                <button onClick={onLogout} className="navbar-user-logout">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

NavbarUser.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string,
    avatar: PropTypes.string,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

Navbar.User = NavbarUser;

export default Navbar;
export { NavbarUser };
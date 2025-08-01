import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './receptionist-navbar.css';

const ReceptionistNavbar = ({ isMenuOpen, toggleMenu, handleLogout }) => {
  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <nav className="receptionist-navbar">
      <div className="navbar-brand">
        <NavLink to="/ReceptionistDashboard" aria-label="Receptionist Dashboard">
          Receptionist Portal
        </NavLink>
      </div>
      <button
        className="navbar-toggle"
        onClick={toggleMenu}
        onKeyDown={(e) => handleKeyDown(e, toggleMenu)}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
      >
        <FaUserCircle />
      </button>
      <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <NavLink
              to="/receptionist/profile"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-label="Profile"
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/receptionist/settings"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-label="Settings"
            >
              Settings
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              onKeyDown={(e) => handleKeyDown(e, handleLogout)}
              className="logout-button"
              aria-label="Logout"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default ReceptionistNavbar;
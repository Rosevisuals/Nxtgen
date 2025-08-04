import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './doctor-navbar.css';

const Navbar = ({ isMenuOpen, toggleMenu, handleLogout }) => {
  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <nav className="doctor-navbar">
      <div className="navbar-brand">
        <NavLink to="/DoctorsDashboard" aria-label="Doctor Dashboard">
          Doctor Portal
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
      </div>
    </nav>
  );
};

export default Navbar;
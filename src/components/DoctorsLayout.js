import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DoctorSidebar from './DoctorsSidebar';
import Navbar from './DoctorsNavbar';
import { FaBars } from 'react-icons/fa';
import './DoctorsLayout.css';
import './doctor';

const DoctorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSidebarOpen) setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic (e.g., clear auth token)
    navigate('/login');
  };

  return (
    <div className="doctor-layout">
      <DoctorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Navbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} handleLogout={handleLogout} />
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <FaBars />
        </button>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
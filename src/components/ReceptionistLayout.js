import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import ReceptionistSidebar from './ReceptionistSidebar';
import ReceptionistNavbar from './ReceptionistNavbar';
import { FaBars } from 'react-icons/fa';
import './receptionist-layout.css';
import './receptionist-responsive.css';

const ReceptionistLayout = () => {
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
    navigate('/login');
  };

  return (
    <div className="receptionist-layout">
      <ReceptionistSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <ReceptionistNavbar isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} handleLogout={handleLogout} />
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <FaBars />
        </button>
        <main className="main-content container-fluid">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ReceptionistLayout;
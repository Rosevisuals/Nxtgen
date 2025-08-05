import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import DoctorSidebar from './DoctorsSidebar';
import { FaBars } from 'react-icons/fa';
import './DoctorsLayout.css';
import './doctor';

const DoctorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="doctor-layout">
      <DoctorSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
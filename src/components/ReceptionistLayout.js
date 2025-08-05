import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ReceptionistSidebar from './ReceptionistSidebar';
import './receptionist-layout.css';
import './centered-layout.css';

const ReceptionistLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="receptionist-layout">
      <ReceptionistSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ReceptionistLayout;
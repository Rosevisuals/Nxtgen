import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaHistory, FaUserMd, FaFileMedical } from 'react-icons/fa';
import Sidebar from './ui/Sidebar';
import Navbar from './ui/Navbar';
import { useNavigate } from 'react-router-dom';
import './patient-layout.css';

/**
 * PatientLayout Component
 * 
 * Main layout for the patient dashboard.
 */
const PatientLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Mock user data (replace with actual user data from authentication)
  const user = {
    name: 'John Doe',
    role: 'Patient',
    avatar: '/images/images.jpg',
  };
  
  // Sidebar navigation items
  const sidebarItems = [
    { path: '/PatientDashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/PatientAppointments', label: 'My Appointments', icon: <FaCalendarAlt /> },
    { path: '/PatientPrescriptions', label: 'Prescriptions', icon: <FaFileMedical /> },
    { path: '/PatientSettings', label: 'Settings', icon: <FaUserMd /> },
    { path: '/PatientHelp', label: 'Help', icon: <FaHistory /> },
  ];

  // Navbar links
  const navbarLinks = [
    
  ]
  
  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Handle logout
  const handleLogout = () => {
    // TODO: Call logout function from auth service
    // authService.logout();
    navigate('/login');
  };
  
  return (
    <div className="patient-layout">
      <Sidebar
        items={sidebarItems}
        title="Patient Portal"
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      <div className={`patient-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Navbar
          title="NxtGen Hospital"
          links={navbarLinks}
          rightContent={
            <Navbar.User
              user={user}
              onLogout={handleLogout}
            />
          }
        />
        <main className="patient-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
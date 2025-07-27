import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaCalendarAlt, FaSearch, FaUserInjured, FaNotesMedical, FaPrescriptionBottleAlt, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../../components/ui/Sidebar';
import Navbar from '../../components/ui/Navbar';
import { useNavigate } from 'react-router-dom';

/**
 * DoctorLayout Component
 * 
 * Main layout for the doctor dashboard.
 */
const DoctorLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Mock user data (replace with actual user data from authentication)
  const user = {
    name: 'Dr. John Smith',
    role: 'Cardiologist',
    avatar: '/images/images.jpg',
  };
  
  // Sidebar navigation items
  const sidebarItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: <FaCalendarAlt /> },
    { path: '/doctor/patients', label: 'Patient Lookup', icon: <FaSearch /> },
    { path: '/doctor/consultations', label: 'Consultations', icon: <FaNotesMedical /> },
    { path: '/doctor/prescriptions', label: 'Prescriptions', icon: <FaPrescriptionBottleAlt /> },
  ];
  
  // Navbar navigation links
  const navbarLinks = [
    { path: '/doctor/dashboard', label: 'Dashboard' },
    { path: '/doctor/settings', label: 'Settings' },
    { path: '/doctor/help', label: 'Help' },
  ];
  
  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // Handle logout
  const handleLogout = () => {
    // Call logout function from auth service
    // authService.logout();
    
    // Redirect to login page
    navigate('/login');
  };
  
  return (
    <div className="doctor-layout">
      <Sidebar
        items={sidebarItems}
        title="Doctor Dashboard"
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      
      <div className="doctor-content">
        <Navbar
          title="NxtGen Hospital ERP"
          links={navbarLinks}
          rightContent={
            <Navbar.User
              user={user}
              onLogout={handleLogout}
            />
          }
        />
        
        <main className="doctor-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout;
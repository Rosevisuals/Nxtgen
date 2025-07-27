import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaCalendarAlt, FaUserPlus, FaSearch, FaFileInvoiceDollar, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../../components/ui/Sidebar';
import Navbar from '../../components/ui/Navbar';
import { useNavigate } from 'react-router-dom';

/**
 * ReceptionistLayout Component
 * 
 * Main layout for the receptionist dashboard.
 */
const ReceptionistLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Mock user data (replace with actual user data from authentication)
  const user = {
    name: 'Sarah Wilson',
    role: 'Receptionist',
    avatar: '/images/images.jpg',
  };
  
  // Sidebar navigation items
  const sidebarItems = [
    { path: '/receptionist/dashboard', label: 'Dashboard', icon: <FaCalendarAlt /> },
    { path: '/receptionist/patients/register', label: 'Patient Registration', icon: <FaUserPlus /> },
    { path: '/receptionist/patients', label: 'Patient Search', icon: <FaSearch /> },
    { path: '/receptionist/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/receptionist/billing', label: 'Billing', icon: <FaFileInvoiceDollar /> },
  ];
  
  // Navbar navigation links
  const navbarLinks = [
    { path: '/receptionist/dashboard', label: 'Dashboard' },
    { path: '/receptionist/settings', label: 'Settings' },
    { path: '/receptionist/help', label: 'Help' },
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
    <div className="receptionist-layout">
      <Sidebar
        items={sidebarItems}
        title="Receptionist Dashboard"
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      
      <div className="receptionist-content">
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
        
        <main className="receptionist-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ReceptionistLayout;
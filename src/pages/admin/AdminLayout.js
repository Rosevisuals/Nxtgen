import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FaUsers, FaUserTag, FaBuilding, FaUserMd, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from '../../components/ui/Sidebar';
import Navbar from '../../components/ui/Navbar';
import { useNavigate } from 'react-router-dom';

/**
 * AdminLayout Component
 * 
 * Main layout for the admin dashboard.
 */
const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Mock user data (replace with actual user data from authentication)
  const user = {
    name: 'Admin User',
    role: 'Administrator',
    avatar: '/images/images.jpg',
  };
  
  // Sidebar navigation items
  const sidebarItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { path: '/admin/users', label: 'User Management', icon: <FaUsers /> },
    { path: '/admin/roles', label: 'Role Management', icon: <FaUserTag /> },
    { path: '/admin/departments', label: 'Departments', icon: <FaBuilding /> },
    { path: '/admin/staff', label: 'Staff Management', icon: <FaUserMd /> },
  ];
  
  // Navbar navigation links
  const navbarLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/settings', label: 'Settings' },
    { path: '/admin/help', label: 'Help' },
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
    <div className="admin-layout">
      <Sidebar
        items={sidebarItems}
        title="NxtGen Admin"
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />
      
      <div className="admin-content">
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
        
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
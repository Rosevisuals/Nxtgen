import React, { useState } from 'react';
import './Admin.css';
import Dashboard from './Dashboard';
// Import other components for different sections here
// e.g., import Staff from './Staff';

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    { name: 'Dashboard', icon: 'fa-tachometer-alt' },
    { name: 'Staff', icon: 'fa-users' },
    { name: 'Patients', icon: 'fa-user-injured' },
    { name: 'Appointments', icon: 'fa-calendar-check' },
    { name: 'Departments', icon: 'fa-building' },
    { name: 'Wards', icon: 'fa-procedures' },
    { name: 'Reviews', icon: 'fa-star' },
    { name: 'Prescriptions', icon: 'fa-file-prescription' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>NxtGen Admin</h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`sidebar-menu-item ${activeItem === item.name ? 'active' : ''}`}
            onClick={() => setActiveItem(item.name)}
          >
            <i className={`fas ${item.icon} icon`}></i>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const AdminLayout = () => {
  const [activeItem, setActiveItem] = useState('Dashboard');

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <Dashboard />;
      // Add cases for other components here
      // case 'Staff':
      //   return <Staff />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <main className="admin-main-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminLayout;
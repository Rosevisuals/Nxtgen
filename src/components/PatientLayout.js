import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaHistory, FaUserMd, FaFileMedical } from 'react-icons/fa';
import Sidebar from './ui/Sidebar';
import { useNavigate } from 'react-router-dom';
import { getPatientByUserId } from '../services/patientService';
import './patient-layout.css';

/**
 * PatientLayout Component
 * 
 * Main layout for the patient dashboard.
 */
const PatientLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState({
    name: 'Loading...',
    role: 'Patient',
    avatar: '/images/images.jpg',
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          const patientData = await getPatientByUserId(userId);
          if (patientData) {
            setUser({
              name: patientData.full_Name || 'Patient',
              role: 'Patient',
              avatar: '/images/images.jpg',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };
    
    fetchPatientData();
  }, []);
  
  // Sidebar navigation items
  const sidebarItems = [
    { path: '/PatientDashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/PatientAppointments', label: 'My Appointments', icon: <FaCalendarAlt /> },
    { path: '/PatientPrescriptions', label: 'Prescriptions', icon: <FaFileMedical /> },
    { path: '/PatientSettings', label: 'Settings', icon: <FaUserMd /> },
    { path: '/PatientHelp', label: 'Help', icon: <FaHistory /> },
  ];


  
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
        <main className="patient-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
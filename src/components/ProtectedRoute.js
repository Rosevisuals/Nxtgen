import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role') || 'patient';
  
  // Check if user is authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole.toLowerCase())) {
    // Redirect to appropriate dashboard based on user role
    switch (userRole.toLowerCase()) {
      case 'doctor':
        return <Navigate to="/DoctorsDashboard" replace />;
      case 'receptionist':
        return <Navigate to="/ReceptionistDashboard" replace />;
      case 'admin':
        return <Navigate to="/AdminDashboard" replace />;
      default:
        return <Navigate to="/PatientDashboard" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;
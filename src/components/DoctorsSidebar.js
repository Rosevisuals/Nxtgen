import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaChevronDown, FaChevronUp, FaClipboardList, FaSignOutAlt, FaFilePrescription, FaSearch, FaFlask } from 'react-icons/fa';
import './unified-sidebar.css';

const DoctorSidebar = ({ isOpen, toggleSidebar }) => {
  const [isPatientsOpen, setIsPatientsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const togglePatientsDropdown = () => {
    setIsPatientsOpen(!isPatientsOpen);
  };

  const handleKeyDown = (e, callback) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  const menuItems = [
    { path: '/DoctorsDashboard', label: 'Dashboard', icon: <FaUserMd />, end: true },
    { path: '/AppointmentScheduling', label: 'Appointments', icon: <FaCalendarAlt /> },
    { path: '/PatientLookup', label: 'Patient Lookup', icon: <FaSearch />, parent: 'Patients' },
    { path: '/PrescriptionForm', label: 'Prescriptions', icon: <FaFilePrescription /> },
    { path: '/ConsultationForm', label: 'Consultations', icon: <FaUserMd /> },
    { path: '/LabRequestsDashboard', label: 'Lab Requests', icon: <FaFlask /> },
    { path: '/logout', label: 'Logout', icon: <FaSignOutAlt /> }
  ];
  
  const filteredItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      {isMobile && (
        <button 
          className="mobile-menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars"></i>
        </button>
      )}
      <div className={`doctor-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">NH</div>
          <h2>NxtGen Hospital</h2>
        </div>
        <input 
          type="text" 
          className="sidebar-search" 
          placeholder="Search menu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="sidebar-menu">
          <li>
            <NavLink
              to="/DoctorsDashboard"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-label="Doctor Dashboard"
              end
            >
              <FaUserMd /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/AppointmentScheduling"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-label="Appointments"
            >
              <FaCalendarAlt /> Appointments
            </NavLink>
          </li>
          <li>
            <div
              onClick={togglePatientsDropdown}
              onKeyDown={(e) => handleKeyDown(e, togglePatientsDropdown)}
              className="dropdown-toggle"
              aria-expanded={isPatientsOpen}
              role="button"
              tabIndex={0}
            >
              <span><FaClipboardList /> Patients</span>
              {isPatientsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isPatientsOpen && (
              <ul className="dropdown">
                <li>
                  <NavLink
                    to="/PatientLookup"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                    aria-label="Patient Lookup"
                  >
                    <FaSearch /> Patient Lookup
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li>
            <NavLink
              to="/PrescriptionForm"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-label="Prescriptions"
            >
              <FaFilePrescription /> Prescriptions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/ConsultationForm"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-label="Consultations"
            >
              <FaUserMd /> Consultations
            </NavLink>
          </li>
          <li style={{backgroundColor: '#ff0000', color: 'white'}}>
            <NavLink
              to="/LabRequestsDashboard"
              className={({ isActive }) => (isActive ? 'active' : '')}
              aria-label="Lab Requests"
              style={{color: 'white', fontWeight: 'bold'}}
            >
              <FaFlask /> 🧪 LAB REQUESTS (NEW!)
            </NavLink>
          </li>
          <li>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_role');
                window.location.href = '/login';
              }}
              className="sidebar-menu-link"
              aria-label="Logout"
            >
              <FaSignOutAlt /> Logout
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default DoctorSidebar;
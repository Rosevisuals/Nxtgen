import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserPlus, FaCalendarAlt, FaSearch, FaChevronUp, FaChevronDown, FaSignOutAlt, FaClipboardList, FaFileInvoiceDollar } from 'react-icons/fa';
import './unified-sidebar.css';

const ReceptionistSidebar = ({ isOpen, toggleSidebar }) => {
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
      <div className={`receptionist-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">RD</div>
          <h2>Receptionist</h2>
          {!isMobile && (
            <button
              className="toggle-button"
              onClick={toggleSidebar}
              onKeyDown={(e) => handleKeyDown(e, toggleSidebar)}
              aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          )}
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
            to="/ReceptionistDashboard"
            className={({ isActive }) => (isActive ? 'active' : '')}
            aria-label="Receptionist Dashboard"
            end
          >
            <FaClipboardList /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/NewAppointment"
            className={({ isActive }) => (isActive ? 'active' : '')}
            aria-label="New Appointment"
          >
            <FaCalendarAlt /> New Appointment
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
            <span><FaUserPlus /> Patients</span>
            {isPatientsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
          {isPatientsOpen && (
            <ul className="dropdown">
              <li>
                <NavLink
                  to="/PatientRegister"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  aria-label="Register Patient"
                >
                  <FaUserPlus /> Register Patient
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/PatientSearch"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  aria-label="Find Patient"
                >
                  <FaSearch /> Find Patient
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        <li>
          <NavLink
            to="/Billing"
            className={({ isActive }) => (isActive ? 'active' : '')}
            aria-label="Billing"
          >
            <FaFileInvoiceDollar /> Billing
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

export default ReceptionistSidebar;
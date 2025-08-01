import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserPlus, FaCalendarAlt, FaSearch, FaChevronUp, FaChevronDown, FaSignOutAlt, FaClipboardList, FaFileInvoiceDollar } from 'react-icons/fa';
import './receptionist-sidebar.css';

const ReceptionistSidebar = ({ isOpen, toggleSidebar }) => {
  const [isPatientsOpen, setIsPatientsOpen] = useState(false);

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
    <div className={`receptionist-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>Receptionist Dashboard</h2>
        <button
          className="toggle-button"
          onClick={toggleSidebar}
          onKeyDown={(e) => handleKeyDown(e, toggleSidebar)}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
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
                  to="/FindPatient"
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
          <NavLink
            to="/logout"
            className={({ isActive }) => (isActive ? 'active' : '')}
            aria-label="Logout"
          >
            <FaSignOutAlt /> Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default ReceptionistSidebar;
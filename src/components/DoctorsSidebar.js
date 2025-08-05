import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaChevronDown, FaChevronUp, FaClipboardList, FaSignOutAlt, FaFilePrescription, FaSearch } from 'react-icons/fa';
import './DoctorsSidebar.css';

const DoctorSidebar = ({ isOpen, toggleSidebar }) => {
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
    <div className={`doctor-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>NxtGen Hospital</h2>
      </div>
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
              <li>
                <NavLink
                  to="/PatientDetail"
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  aria-label="Patient Detail"
                >
                  <FaClipboardList /> Patient Detail
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

export default DoctorSidebar;
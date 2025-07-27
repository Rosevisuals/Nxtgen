import React from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';
import { FaUserMd, FaCalendarAlt, FaClipboardList, FaSignOutAlt, FaFilePrescription } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Doctor's Dashboard</h2>
            </div>
            <ul className="sidebar-menu">
                <li>
                    <Link to="/dashboard">
                        <FaUserMd /> Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/appointments">
                        <FaCalendarAlt /> Appointments
                    </Link>
                </li>
                <li>
                    <Link to="/patients">
                        <FaClipboardList /> Patients
                    </Link>
                </li>
                <li>
                    <Link to="/prescriptions">
                        <FaFilePrescription /> Prescriptions
                    </Link>
                </li>
                <li>
                    <Link to="/logout">
                        <FaSignOutAlt /> Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
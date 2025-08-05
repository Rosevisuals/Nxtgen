// Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaUserInjured, FaUserMd, FaCalendarAlt, FaBuilding,
  FaFileInvoiceDollar, FaPrescriptionBottleAlt, FaBed, FaCog, FaChartBar,
  FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { useState } from 'react';
import './Sidebar.css'

const menuItems = [
  {
    label: 'Dashboard',
    icon: <FaTachometerAlt />,
    submenu: [
      { label: 'Admin Dashboard', to: '/dashboard/admin' },
    ],
  },
  {
    label: 'Patients',
    icon: <FaUserInjured />,
    submenu: [
      { label: 'All Patients', to: '/patients' },
      
    ],
  },
  {
    label: 'Doctors',
    icon: <FaUserMd />,
    submenu: [
      { label: 'All Doctors', to: '/doctors' },
      { label: 'Add Doctor', to: '/doctors/add' },
      
    ],
  },
  {
    label: 'Appointments',
    icon: <FaCalendarAlt />,
    submenu: [
      { label: 'All Appointments', to: '/appointments' },
    ],
  },
  {
    label: 'Departments',
    icon: <FaBuilding />,
    submenu: [
      { label: 'All Departments', to: '/departments' },
      { label: 'Add Department', to: '/departments/add' },
    ],
  },
  {
    label: 'Billings',
    icon: <FaFileInvoiceDollar />,
    submenu: [
      { label: 'Billing Records', to: '/billings' },
      { label: 'Payment History', to: '/billings/payments' },
    ],
  },
  {
    label: 'Prescriptions',
    icon: <FaPrescriptionBottleAlt />,
    submenu: [
      { label: 'All Prescriptions', to: '/prescriptions' },
    ],
  },
  {
    label: 'Staff',
    icon: <FaUserMd />,
    submenu: [
      { label: 'All Staff', to: '/staff' },
      { label: 'Add Staff', to: '/staff/add' },
      { label: 'Staff Roles', to: '/staff/roles' },
    ],
  },
  {
    label: 'Wards',
    icon: <FaBed />,
    submenu: [
      { label: 'All Ward', to: '/wards' },
      { label: 'Add Ward', to: '/wards/add' },
      { label: 'Ward Allotment', to: '/wards/allocation' },
      { label: 'Ward History', to: '/wards/history' },
    ],
  },
  {
    label: 'Settings',
    icon: <FaCog />,
    submenu: [
      { label: 'Settings', to: '/settings' },
      { label: 'User Management', to: '/settings/users' },
    ],
  },
  {
    label: 'Reports',
    icon: <FaChartBar />,
    submenu: [
      { label: 'Daily Reports', to: '/reports/daily' },
      { label: 'Monthly Reports', to: '/reports/monthly' },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="aside">
      <nav>
        <ul className="aside-menu">
          {menuItems.map(item => (
            <li key={item.label}>
              {item.submenu ? (
                <>
                  <div
                    onClick={() => toggleMenu(item.label)}
                    className={`menu-item ${openMenus[item.label] ? 'active' : ''}`}
                  >
                    <span className="menu-icon-label">
                      <span className="menu-icon">{item.icon}</span>
                      {item.label}
                    </span>
                    {openMenus[item.label] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  <ul className={`submenu ${openMenus[item.label] ? 'open' : ''}`}>
                    {item.submenu.map(sub => (
                      <li key={sub.to}>
                        <Link
                          to={sub.to}
                          className={`submenu-item ${location.pathname === sub.to ? 'active' : ''}`}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  to={item.to}
                  className={`menu-item ${location.pathname === item.to ? 'active' : ''}`}
                >
                  <span className="menu-icon">{item.icon}</span>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
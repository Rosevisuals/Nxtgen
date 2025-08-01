import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from './ui/Card';
import { FaUserInjured, FaCalendarCheck, FaUserMd, FaDollarSign } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Admin Dashboard Component
 * 
 * Displays overview and analytics for the admin dashboard.
 */
const Dashboard = () => {
  // Summary data for stats cards
  const summaryData = [
    { 
      title: 'Total Patients', 
      value: '3,542', 
      change: '+5.2%', 
      icon: <FaUserInjured size={24} />, 
      color: 'var(--primary-main)' 
    },
    { 
      title: 'Appointments', 
      value: '1,250', 
      change: '+10.3%', 
      icon: <FaCalendarCheck size={24} />, 
      color: 'var(--secondary-main)' 
    },
    { 
      title: 'Staff Members', 
      value: '158', 
      change: '+2.5%', 
      icon: <FaUserMd size={24} />, 
      color: 'var(--accent-main)' 
    },
    { 
      title: 'Revenue', 
      value: '$254,325', 
      change: '+8.1%', 
      icon: <FaDollarSign size={24} />, 
      color: 'var(--status-success)' 
    },
  ];

  // Patient visits data for bar chart
  const patientVisitsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Patient Visits',
        data: [450, 420, 510, 480, 520, 550, 590, 620, 580, 610, 640, 680],
        backgroundColor: 'rgba(25, 118, 210, 0.6)',
        borderColor: 'rgba(25, 118, 210, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Department distribution data for pie chart
  const departmentData = {
    labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Other'],
    datasets: [
      {
        label: 'Patients by Department',
        data: [25, 20, 18, 15, 12, 10],
        backgroundColor: [
          'rgba(25, 118, 210, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(246, 173, 85, 0.7)',
          'rgba(245, 101, 101, 0.7)',
          'rgba(128, 90, 213, 0.7)',
          'rgba(111, 66, 193, 0.7)',
        ],
        borderColor: [
          'rgba(25, 118, 210, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(246, 173, 85, 1)',
          'rgba(245, 101, 101, 1)',
          'rgba(128, 90, 213, 1)',
          'rgba(111, 66, 193, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Revenue trend data for line chart
  const revenueTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Revenue',
        data: [18500, 19200, 21000, 20500, 22800, 24100, 25300, 26500, 25800, 27200, 28500, 30000],
        fill: false,
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderColor: 'rgba(76, 175, 80, 1)',
        tension: 0.4,
      },
    ],
  };

  // Recent activities data
  const recentActivities = [
    { action: 'New patient registered', user: 'Dr. Smith', time: '10 minutes ago' },
    { action: 'Appointment scheduled', user: 'Receptionist Jane', time: '25 minutes ago' },
    { action: 'Prescription created', user: 'Dr. Johnson', time: '1 hour ago' },
    { action: 'Patient discharged', user: 'Nurse Williams', time: '2 hours ago' },
    { action: 'New staff member added', user: 'Admin User', time: '3 hours ago' },
  ];

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="dashboard-summary">
        {summaryData.map((item, index) => (
          <Card key={index} className="summary-card">
            <div className="summary-icon" style={{ backgroundColor: item.color }}>
              {item.icon}
            </div>
            <div className="summary-content">
              <h3>{item.value}</h3>
              <p>{item.title}</p>
              <span className={`summary-change ${item.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {item.change}
              </span>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="dashboard-charts">
        <div className="chart-row">
          <Card title="Patient Visits (2025)" className="chart-card">
            <Bar 
              data={patientVisitsData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
              }} 
            />
          </Card>
          
          <Card title="Department Distribution" className="chart-card">
            <Pie 
              data={departmentData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
              }} 
            />
          </Card>
        </div>
        
        <Card title="Revenue Trend (2025)" className="chart-card">
          <Line 
            data={revenueTrendData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    callback: (value) => `$${value.toLocaleString()}`,
                  },
                },
              },
            }} 
          />
        </Card>
      </div>
      
      {/* Recent Activities */}
      <Card title="Recent Activities" className="activities-card">
        <ul className="activities-list">
          {recentActivities.map((activity, index) => (
            <li key={index} className="activity-item">
              <div className="activity-content">
                <p className="activity-action">{activity.action}</p>
                <p className="activity-user">{activity.user}</p>
              </div>
              <span className="activity-time">{activity.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Dashboard;
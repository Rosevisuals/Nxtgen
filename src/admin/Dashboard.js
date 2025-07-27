import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SummaryCard = ({ title, value, percentage, icon, color }) => (
  <div className="summary-card">
    <div className={`icon`} style={{ backgroundColor: color }}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="card-info">
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
    <div className={`percentage ${percentage.includes('+') ? 'positive' : 'negative'}`}>
      {percentage}
    </div>
  </div>
);

const RecentAppointments = () => {
  const appointments = [
    { name: 'John Doe', time: '10:00 AM', status: 'Confirmed', img: '/images/images.jpg' },
    { name: 'Jane Smith', time: '11:30 AM', status: 'In Progress', img: '/images/images.jpg' },
    { name: 'Sam Wilson', time: '1:00 PM', status: 'Confirmed', img: '/images/images.jpg' },
  ];

  return (
    <div className="recent-appointments-section">
      <h3 className="section-header">Recent Appointments</h3>
      <div className="recent-appointments-list">
        <ul>
          {appointments.map((appt, index) => (
            <li key={index}>
              <div className="appointment-details">
                <img src={appt.img} alt={appt.name} />
                <div className="appointment-info">
                  <p className="patient-name">{appt.name}</p>
                  <p className="appointment-time">{appt.time}</p>
                </div>
              </div>
              <div className={`appointment-status ${appt.status === 'Confirmed' ? 'status-confirmed' : 'status-in-progress'}`}>
                {appt.status}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};


const OverviewChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Patient Visits',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Patient Visits',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

const Dashboard = () => {
  const summaryData = [
    { title: 'Total Revenue', value: '$54,234', percentage: '+2.5%', icon: 'fa-dollar-sign', color: '#48bb78' },
    { title: 'Appointments', value: '1,250', percentage: '+5.0%', icon: 'fa-calendar-check', color: '#4299e1' },
    { title: 'Patients', value: '3,500', percentage: '-1.2%', icon: 'fa-user-injured', color: '#f56565' },
    { title: 'Staff', value: '150', percentage: '+0.8%', icon: 'fa-users', color: '#ecc94b' },
  ];

  return (
    <div className="dashboard">
      <div className="summary-cards">
        {summaryData.map((data, index) => (
          <SummaryCard key={index} {...data} />
        ))}
      </div>
      <div className="overview-section">
        <h3 className="section-header">Overview</h3>
        <OverviewChart />
      </div>
      <RecentAppointments />
    </div>
  );
};

export default Dashboard;
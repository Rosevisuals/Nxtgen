import React from 'react';

export default function AdminDashboard({
  stats = { patients: 0, doctors: 0, appointmentsToday: 0, revenue: 0 },
  activities = [],
  upcomingAppointments = []
}) {
  const { patients, doctors, appointmentsToday, revenue } = stats;

  // Styles
  const containerStyle = {
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  };

  const dateStyle = {
    color: '#64748b',
    fontSize: '14px'
  };

  const kpiGridStyle = {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
  };

  const kpiCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
  };

  const kpiLabelStyle = {
    color: '#64748b',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const kpiValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    margin: '8px 0 4px'
  };

  const kpiTrendStyle = (positive) => ({
    fontSize: '12px',
    color: positive ? '#10b981' : '#ef4444',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  });

  const sectionStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    padding: '24px',
    overflowX: 'auto'
  };

  const sectionHeaderStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    color: '#0f172a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const viewAllStyle = {
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer'
  };

  const tableStyle = {
    width: '100%',
    fontSize: '14px',
    borderCollapse: 'separate',
    borderSpacing: '0 8px'
  };

  const thStyle = {
    textAlign: 'left',
    color: '#64748b',
    padding: '12px 16px',
    fontWeight: '500',
    backgroundColor: '#f8fafc',
    position: 'sticky',
    top: 0
  };

  const tdStyle = {
    padding: '16px',
    borderBottom: '1px solid #f1f5f9',
    verticalAlign: 'middle'
  };

  const statusBadgeStyle = (status) => {
    const colors = {
      completed: '#10b981',
      pending: '#f59e0b',
      cancelled: '#ef4444',
      confirmed: '#3b82f6'
    };
    return {
      backgroundColor: colors[status] || '#e2e8f0',
      color: 'white',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      display: 'inline-block'
    };
  };

  const emptyStateStyle = {
    padding: '40px 16px',
    textAlign: 'center',
    color: '#94a3b8'
  };

  return (
    <section style={containerStyle}>
      {/* Header with date */}
      <header style={headerStyle}>
        <h1 style={titleStyle}>Admin Dashboard</h1>
        <div style={dateStyle}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
      </header>

      {/* KPI Cards */}
      <ul style={kpiGridStyle}>
        <li style={kpiCardStyle}>
          <span style={kpiLabelStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Total Patients
          </span>
          <strong style={{ ...kpiValueStyle, color: '#0d9488' }}>{patients}</strong>
          <span style={kpiTrendStyle(true)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            12% increase
          </span>
        </li>
        <li style={kpiCardStyle}>
          <span style={kpiLabelStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Total Doctors
          </span>
          <strong style={{ ...kpiValueStyle, color: '#4f46e5' }}>{doctors}</strong>
          <span style={kpiTrendStyle(true)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            5% increase
          </span>
        </li>
        <li style={kpiCardStyle}>
          <span style={kpiLabelStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Appointments Today
          </span>
          <strong style={{ ...kpiValueStyle, color: '#e11d48' }}>{appointmentsToday}</strong>
          <span style={kpiTrendStyle(false)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
              <polyline points="17 18 23 18 23 12"></polyline>
            </svg>
            3% decrease
          </span>
        </li>
        <li style={kpiCardStyle}>
          <span style={kpiLabelStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            Monthly Revenue
          </span>
          <strong style={{ ...kpiValueStyle, color: '#14b8a6' }}>${revenue.toLocaleString()}</strong>
          <span style={kpiTrendStyle(true)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
              <polyline points="17 6 23 6 23 12"></polyline>
            </svg>
            8% increase
          </span>
        </li>
      </ul>

      {/* Two-column layout for tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Activities */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h3>Recent Activities</h3>
            <a style={viewAllStyle}>View All</a>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Action</th>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Time</th>
              </tr>
            </thead>
            <tbody>
              {activities.length === 0 ? (
                <tr>
                  <td colSpan="3" style={emptyStateStyle}>
                    No recent activities
                  </td>
                </tr>
              ) : (
                activities.map(({ id, action, user, time }) => (
                  <tr key={id}>
                    <td style={tdStyle}>{action}</td>
                    <td style={tdStyle}>{user}</td>
                    <td style={{ ...tdStyle, color: '#64748b' }}>{time}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Upcoming Appointments */}
        <div style={sectionStyle}>
          <div style={sectionHeaderStyle}>
            <h3>Upcoming Appointments</h3>
            <a style={viewAllStyle}>View All</a>
          </div>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Patient</th>
                <th style={thStyle}>Doctor</th>
                <th style={thStyle}>Time</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.length === 0 ? (
                <tr>
                  <td colSpan="4" style={emptyStateStyle}>
                    No upcoming appointments
                  </td>
                </tr>
              ) : (
                upcomingAppointments.map(({ id, patient, doctor, time, status }) => (
                  <tr key={id}>
                    <td style={tdStyle}>{patient}</td>
                    <td style={tdStyle}>{doctor}</td>
                    <td style={{ ...tdStyle, color: '#64748b' }}>{time}</td>
                    <td style={tdStyle}>
                      <span style={statusBadgeStyle(status.toLowerCase())}>
                        {status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
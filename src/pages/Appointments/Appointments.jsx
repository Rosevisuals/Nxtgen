import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaFilter, FaCalendarAlt, FaUser, FaUserMd,
  FaClock, FaCheck, FaTimes, FaExclamation
} from 'react-icons/fa';

const demoAppointments = [
  { id: 1, patient: 'John Doe', patientId: 'P1001', doctor: 'Dr. Smith', department: 'Cardiology', date: '2024-07-26', time: '10:00 AM', status: 'Approved' },
  { id: 2, patient: 'Jane Smith', patientId: 'P1002', doctor: 'Dr. Adams', department: 'Pediatrics', date: '2024-07-26', time: '11:30 AM', status: 'Pending' },
  { id: 3, patient: 'Mike Brown', patientId: 'P1003', doctor: 'Dr. Lee', department: 'Orthopedics', date: '2024-07-27', time: '09:00 AM', status: 'Declined' },
  { id: 4, patient: 'Sarah Johnson', patientId: 'P1004', doctor: 'Dr. Wilson', department: 'Neurology', date: '2024-07-27', time: '02:15 PM', status: 'Approved' },
  { id: 5, patient: 'David Wilson', patientId: 'P1005', doctor: 'Dr. Chen', department: 'Dermatology', date: '2024-07-28', time: '03:45 PM', status: 'Pending' },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setAppointments(demoAppointments);
      setLoading(false);
    }, 800);
  }, []); // No warning now

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true : appointment.status === filterStatus;
    const matchesDate = filterDate === '' ? true : appointment.date === filterDate;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return { bg: '#dcfce7', text: '#166534', icon: <FaCheck style={{ marginRight: '6px' }} /> };
      case 'Pending': return { bg: '#fef9c3', text: '#854d0e', icon: <FaClock style={{ marginRight: '6px' }} /> };
      case 'Declined': return { bg: '#fee2e2', text: '#991b1b', icon: <FaTimes style={{ marginRight: '6px' }} /> };
      case 'No-Show': return { bg: '#e5e7eb', text: '#4b5563', icon: <FaExclamation style={{ marginRight: '6px' }} /> };
      default: return { bg: '#e5e7eb', text: '#4b5563', icon: null };
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', margin: 0 }}>Appointments</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}></div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px 10px 36px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '250px',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaFilter style={{ color: '#6b7280' }} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaCalendarAlt style={{ color: '#6b7280' }} />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Appointments Table */}
      {loading ? (
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          height: '200px', color: '#7f8c8d'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(0,0,0,0.1)',
              borderLeftColor: '#3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Loading appointments...</span>
          </div>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#7f8c8d'
        }}>
          No appointments found matching your criteria.
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflowX: 'auto'
        }}>
          <table style={{ minWidth: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              textTransform: 'uppercase',
              fontSize: '12px'
            }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Patient</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Doctor</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Date & Time</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Department</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => {
                const statusColor = getStatusColor(appointment.status);
                return (
                  <tr key={appointment.id} style={{
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                        <FaUser style={{ marginRight: '8px', color: '#4f46e5' }} />
                        {appointment.patient}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {appointment.patientId}</div>
                    </td>
                    <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
                      <FaUserMd style={{ marginRight: '8px', color: '#10b981' }} />
                      {appointment.doctor}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div>{appointment.date}</div>
                      <div style={{ fontWeight: '500' }}>{appointment.time}</div>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: '#e0f2fe',
                        color: '#0369a1',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {appointment.department}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        padding: '6px 10px',
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {statusColor.icon}
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

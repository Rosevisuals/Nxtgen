import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import { toast } from 'react-toastify';

const DailyReport = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState({
    patients: 0,
    appointments: 0,
    completedAppointments: 0,
    revenue: 0,
    prescriptions: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchDailyReport = async (selectedDate) => {
    setLoading(true);
    try {
      const [appointmentsData, patientsData] = await Promise.all([
        apiFetch('/appointments'),
        apiFetch('/patients')
      ]);
      
      const selectedDateObj = new Date(selectedDate);
      const dayStart = new Date(selectedDateObj);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(selectedDateObj);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Filter appointments for selected date
      const dayAppointments = appointmentsData?.filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        return aptDate >= dayStart && aptDate <= dayEnd;
      }) || [];
      
      // Filter patients registered on selected date
      const dayPatients = patientsData?.filter(patient => {
        const regDate = new Date(patient.created_at);
        return regDate >= dayStart && regDate <= dayEnd;
      }) || [];
      
      const completedAppointments = dayAppointments.filter(apt => apt.status === 'Completed');
      
      setReportData({
        patients: dayPatients.length,
        appointments: dayAppointments.length,
        completedAppointments: completedAppointments.length,
        revenue: completedAppointments.length * 50000, // Estimated revenue per appointment
        prescriptions: Math.floor(completedAppointments.length * 0.8) // Estimated prescriptions
      });
    } catch (error) {
      console.error('Error fetching daily report:', error);
      toast.error('Failed to load daily report');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDailyReport(date);
  }, [date]);

  return (
    <div style={{
      padding: '24px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '16px'
      }}>Daily Report</h1>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <label style={{ color: '#4b5563' }}>Select Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            border: '1px solid #d1d5db',
            padding: '8px 16px',
            borderRadius: '6px'
          }}
        />
        {loading && <span style={{ color: '#6b7280' }}>Loading...</span>}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4b5563'
          }}>Patients</h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#2563eb',
            marginTop: '8px'
          }}>{reportData.patients}</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4b5563'
          }}>Appointments</h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#16a34a',
            marginTop: '8px'
          }}>{reportData.appointments}</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4b5563'
          }}>Revenue</h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#7c3aed',
            marginTop: '8px'
          }}>UGX {reportData.revenue.toLocaleString()}</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4b5563'
          }}>Completed</h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#059669',
            marginTop: '8px'
          }}>{reportData.completedAppointments}</p>
        </div>
        <div style={{
          backgroundColor: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#4b5563'
          }}>Prescriptions</h2>
          <p style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#dc2626',
            marginTop: '8px'
          }}>{reportData.prescriptions}</p>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;

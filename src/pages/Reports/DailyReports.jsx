import React, { useState } from 'react';

const DailyReport = () => {
  const [date, setDate] = useState('');

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
          }}>23</p>
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
          }}>15</p>
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
          }}>UGX 1,500,000</p>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;

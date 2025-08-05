import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const AllPrescriptions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const prescriptions = [
    {
      id: 1,
      patient: 'Jane Doe',
      patientId: 'P1001',
      doctor: 'Dr. Smith',
      date: '2025-07-29',
      medications: [
        { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours', duration: '5 days' },
        { name: 'Ibuprofen', dosage: '200mg', frequency: 'Every 8 hours', duration: '3 days' }
      ]
    },
    {
      id: 2,
      patient: 'John Mike',
      patientId: 'P1002',
      doctor: 'Dr. Olivia',
      date: '2025-07-28',
      medications: [
        { name: 'Amoxicillin', dosage: '250mg', frequency: 'Three times daily', duration: '7 days' }
      ]
    },
    {
      id: 3,
      patient: 'Sarah Johnson',
      patientId: 'P1003',
      doctor: 'Dr. Wilson',
      date: '2025-07-30',
      medications: [
        { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', duration: '30 days' },
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' }
      ]
    }
  ];

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const searchLower = searchTerm.toLowerCase();
    return (
      prescription.patient.toLowerCase().includes(searchLower) ||
      prescription.doctor.toLowerCase().includes(searchLower) ||
      prescription.patientId.toLowerCase().includes(searchLower) ||
      prescription.medications.some(med => med.name.toLowerCase().includes(searchLower))
    );
  });

  const formatMedications = (meds) => {
    return meds.map(med => `${med.name} (${med.dosage})`).join(', ');
  };

  return (
    <div style={{
      padding: '24px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Header Section */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>All Prescriptions</h1>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }} />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 16px 10px 36px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  minWidth: '250px'
                }}
              />
            </div>

          </div>
        </div>

        {/* Prescriptions Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflowX: 'auto'
        }}>
          <table style={{
            minWidth: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0
          }}>
            <thead style={{
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              textTransform: 'uppercase',
              fontSize: '12px'
            }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Patient</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Doctor</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Medications</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.map(prescription => (
                <tr key={prescription.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: '500' }}>{prescription.patient}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {prescription.patientId}</div>
                  </td>
                  <td style={{ padding: '16px 24px' }}>{prescription.doctor}</td>
                  <td style={{ padding: '16px 24px' }}>{prescription.date}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <div>{formatMedications(prescription.medications)}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {prescription.medications.length} medication{prescription.medications.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPrescriptions.length === 0 && (
                <tr>
                  <td colSpan="4" style={{
                    textAlign: 'center',
                    padding: '24px',
                    color: '#6b7280'
                  }}>
                    {searchTerm ? 'No prescriptions match your search.' : 'No prescriptions found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllPrescriptions;

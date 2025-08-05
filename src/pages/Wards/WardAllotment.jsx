import React, { useState } from 'react';

const demoWards = [
  { id: 1, roomNumber: '101', type: 'Single', status: 'Available' },
  { id: 2, roomNumber: '102', type: 'Double', status: 'Occupied' },
  { id: 3, roomNumber: '103', type: 'ICU', status: 'Available' },
];

export default function WardAllotment() {
  const [wards] = useState(demoWards);
  const [selectedWard, setSelectedWard] = useState('');
  const [patient, setPatient] = useState('');
  const [allotted, setAllotted] = useState(false);

  const handleAllot = (e) => {
    e.preventDefault();
    setAllotted(true);
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '420px',
        margin: '40px auto',
        padding: '24px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#1e293b' }}>
        Ward Allotment
      </h2>

      <form onSubmit={handleAllot}>
        {/* Patient Name Field */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}
          >
            Patient Name:
          </label>
          <input
            type="text"
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        {/* Room Select */}
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}
          >
            Ward:
          </label>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              outline: 'none',
            }}
          >
            <option value="">Select</option>
            {wards
              .filter((ward) => ward.status === 'Available')
              .map((ward) => (
                <option key={ward.id} value={ward.wardNumber}>
                  {ward.wardNumber} - {ward.type}
                </option>
              ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#1565c0',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Allot Ward
        </button>
      </form>

      {/* Success Message */}
      {allotted && (
        <div
          style={{
            marginTop: '16px',
            color: 'green',
            fontWeight: '500',
            fontSize: '14px',
          }}
        >
          Ward {selectedWard} allotted to {patient}!
        </div>
      )}
    </div>
  );
}

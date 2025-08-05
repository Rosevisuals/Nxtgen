import React, { useState } from 'react';

export default function AddDepartment() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const departmentData = { name, description };
    console.log(departmentData);
    // Submit to backend or API here
  };

  return (
    <div style={{
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      maxWidth: '768px',
      margin: '24px auto 0'
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '24px'
      }}>
        Department <span style={{ color: '#9ca3af', fontSize: '16px' }}>Add Department</span>
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Department Name */}
        <div>
          <label style={{
            display: 'block',
            color: '#374151',
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            Name <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Department Name"
            required
            style={{
              width: '100%',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Description */}
        <div>
          <label style={{
            display: 'block',
            color: '#374151',
            fontWeight: '500',
            marginBottom: '4px'
          }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Department Description"
            style={{
              width: '100%',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              outline: 'none',
              resize: 'none',
              minHeight: '96px',
              boxSizing: 'border-box'
            }}
            rows={4}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={() => {
              setName('');
              setDescription('');
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d1d5db',
              color: '#1f2937',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>

          <span style={{ color: '#6b7280' }}>or</span>

          <button
            type="submit"
            style={{
              padding: '8px 24px',
              backgroundColor: '#16a34a',
              color: 'white',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState } from 'react';

export default function AddWard() {
  const [form, setForm] = useState({
    wardNumber: '',
    type: 'General', // Default value
    capacity: '',
    status: 'Available', // Default value
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const wardTypes = ['General', 'ICU', 'Maternity', 'Private', 'Semi-Private'];
  const statusOptions = ['Available', 'Occupied', 'Maintenance', 'Reserved'];

  const validateForm = () => {
    const newErrors = {};
    if (!form.wardNumber.trim()) newErrors.wardNumber = 'Ward number is required';
    if (!form.type) newErrors.type = 'Ward type is required';
    if (!form.capacity || form.capacity < 1) newErrors.capacity = 'Capacity must be at least 1';
    if (!form.status) newErrors.status = 'Status is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      // Here you would send form data to the backend
      console.log('Form submitted:', form);
      // Reset form after submission
      setTimeout(() => {
        setForm({
          wardNumber: '',
          type: 'General',
          capacity: '',
          status: 'Available'
        });
        setSubmitted(false);
      }, 3000);
    }
  };

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      maxWidth: '500px',
      margin: '20px auto',
      padding: '24px',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{
        fontSize: '24px',
        color: '#2c3e50',
        marginBottom: '24px',
        paddingBottom: '8px',
        borderBottom: '1px solid #eee'
      }}>Add New Room</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Room Number */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ 
            marginBottom: '6px', 
            fontWeight: '500',
            color: '#34495e'
          }}>Room Number *</label>
          <input
            type="text"
            name="wardNumber"
            value={form.wardNumber}
            onChange={handleChange}
            required
            style={{ 
              padding: '10px 12px',
              border: `1px solid ${errors.wardNumber ? '#e74c3c' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              ':focus': {
                outline: 'none',
                borderColor: '#3498db',
                boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
              }
            }}
          />
          {errors.wardNumber && (
            <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '4px' }}>
              {errors.wardNumber}
            </span>
          )}
        </div>

        {/* Ward Type */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ 
            marginBottom: '6px', 
            fontWeight: '500',
            color: '#34495e'
          }}>Room Type *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            style={{ 
              padding: '10px 12px',
              border: `1px solid ${errors.type ? '#e74c3c' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              appearance: 'none',
              background: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 10px center/15px 15px`,
              ':focus': {
                outline: 'none',
                borderColor: '#3498db',
                boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
              }
            }}
          >
            {wardTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {errors.type && (
            <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '4px' }}>
              {errors.type}
            </span>
          )}
        </div>

        {/* Capacity */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ 
            marginBottom: '6px', 
            fontWeight: '500',
            color: '#34495e'
          }}>Capacity *</label>
          <input
            type="number"
            name="capacity"
            min="1"
            value={form.capacity}
            onChange={handleChange}
            required
            style={{ 
              padding: '10px 12px',
              border: `1px solid ${errors.capacity ? '#e74c3c' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              ':focus': {
                outline: 'none',
                borderColor: '#3498db',
                boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
              }
            }}
          />
          {errors.capacity && (
            <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '4px' }}>
              {errors.capacity}
            </span>
          )}
        </div>

        {/* Status */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ 
            marginBottom: '6px', 
            fontWeight: '500',
            color: '#34495e'
          }}>Status *</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            style={{ 
              padding: '10px 12px',
              border: `1px solid ${errors.status ? '#e74c3c' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              appearance: 'none',
              background: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e") no-repeat right 10px center/15px 15px`,
              ':focus': {
                outline: 'none',
                borderColor: '#3498db',
                boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
              }
            }}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {errors.status && (
            <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '4px' }}>
              {errors.status}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          style={{ 
            padding: '12px 16px',
            background: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '8px',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: '#2980b9'
            }
          }}
        >
          Add Ward
        </button>
      </form>

      {/* Success Message */}
      {submitted && (
        <div style={{ 
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          border: '1px solid #c3e6cb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ marginRight: '8px' }}>✓</span>
          Ward added successfully!
        </div>
      )}
    </div>
  );
}
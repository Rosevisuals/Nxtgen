import React, { useState } from 'react';

export default function AddStaff() {
  const [form, setForm] = useState({
    name: '',
    role: 'Doctor', // Default role
    email: '',
    phone: '',
    department: 'General'
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = ['Doctor', 'Nurse', 'Administrator', 'Technician', 'Support Staff'];
  const departments = ['General', 'Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics', 'Emergency'];

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.role) newErrors.role = 'Role is required';
    if (!emailRegex.test(form.email)) newErrors.email = 'Valid email is required';
    if (!phoneRegex.test(form.phone)) newErrors.phone = 'Valid phone number (10-15 digits) is required';
    
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
      console.log('Form submitted:', form);
      // Reset form after 3 seconds
      setTimeout(() => {
        setForm({
          name: '',
          role: 'Doctor',
          email: '',
          phone: '',
          department: 'General'
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
      }}>Add New Staff Member</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Name */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ 
            marginBottom: '6px', 
            fontWeight: '500',
            color: '#34495e'
          }}>Full Name *</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ 
              padding: '10px 12px',
              border: `1px solid ${errors.name ? '#e74c3c' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              ':focus': {
                outline: 'none',
                borderColor: '#3498db',
                boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
              }
            }}
          />
          {errors.name && (
            <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '4px' }}>
              {errors.name}
            </span>
          )}
        </div>

        {/* Role */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ 
            marginBottom: '6px', 
            fontWeight: '500',
            color: '#34495e'
          }}>Role *</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            style={{ 
              padding: '10px 12px',
              border: `1px solid ${errors.role ? '#e74c3c' : '#ddd'}`,
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
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          {errors.role && (
            <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '4px' }}>
              {errors.role}
            </span>
          )}
        </div>

        {/* Department */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ 
            marginBottom: '6px', 
            fontWeight: '500',
            color: '#34495e'
          }}>Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            style={{ 
              padding: '10px 12px',
              border: '1px solid #ddd',
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
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ 
            marginBottom: '6px', 
            fontWeight: '500',
            color: '#34495e'
          }}>Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={{ 
              padding: '10px 12px',
              border: `1px solid ${errors.email ? '#e74c3c' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              ':focus': {
                outline: 'none',
                borderColor: '#3498db',
                boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
              }
            }}
          />
          {errors.email && (
            <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '4px' }}>
              {errors.email}
            </span>
          )}
        </div>

        {/* Phone */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ 
            marginBottom: '6px', 
            fontWeight: '500',
            color: '#34495e'
          }}>Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            style={{ 
              padding: '10px 12px',
              border: `1px solid ${errors.phone ? '#e74c3c' : '#ddd'}`,
              borderRadius: '4px',
              fontSize: '16px',
              ':focus': {
                outline: 'none',
                borderColor: '#3498db',
                boxShadow: '0 0 0 2px rgba(52,152,219,0.2)'
              }
            }}
          />
          {errors.phone && (
            <span style={{ color: '#e74c3c', fontSize: '14px', marginTop: '4px' }}>
              {errors.phone}
            </span>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          style={{ 
            padding: '12px 16px',
            background: '#27ae60',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '8px',
            transition: 'background-color 0.2s',
            ':hover': {
              backgroundColor: '#219653'
            }
          }}
        >
          Add Staff Member
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
          Staff member added successfully!
        </div>
      )}
    </div>
  );
}
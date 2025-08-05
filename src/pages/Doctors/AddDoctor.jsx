import React, { useState } from 'react';

export default function AddDoctor() {
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      setForm({ name: '', specialty: '', email: '', phone: '' });
    }, 1500);
  };

  // Styles
  const containerStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '500px',
    margin: '0 auto',
    padding: '32px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
  };

  const headerStyle = {
    color: '#2c3e50',
    fontSize: '28px',
    fontWeight: '600',
    marginBottom: '24px',
    textAlign: 'center'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#333',
    fontSize: '14px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '15px',
    transition: 'border-color 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#3f51b5',
      boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)'
    }
  };

  const buttonStyle = {
    width: '100%',
    padding: '14px',
    backgroundColor: '#3f51b5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#303f9f'
    },
    ':disabled': {
      backgroundColor: '#b0bec5',
      cursor: 'not-allowed'
    }
  };

  const successMessageStyle = {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '15px'
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>Add New Doctor</h2>
      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Dr. John Smith"
          />
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle}>Specialty</label>
          <input
            type="text"
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="Cardiology, Neurology, etc."
          />
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="doctor@example.com"
          />
        </div>
        
        <div style={formGroupStyle}>
          <label style={labelStyle}>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            style={inputStyle}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <button 
          type="submit" 
          style={buttonStyle}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding Doctor...' : 'Add Doctor'}
        </button>
      </form>
      
      {submitted && (
        <div style={successMessageStyle}>
          ✓ Doctor added successfully! They will now appear in the system.
        </div>
      )}
    </div>
  );
}
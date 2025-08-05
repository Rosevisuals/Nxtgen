import React from 'react';

const Settings = () => {
  const containerStyle = {
    padding: '24px',
  };

  const headingStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#1f2937', // text-gray-800
  };

  const sectionStyle = {
    marginBottom: '40px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  };

  const sectionTitleStyle = {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#374151', // text-gray-700
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4b5563', // text-gray-600
    marginBottom: '6px',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    fontSize: '14px',
  };

  const inputGroupStyle = {
    marginBottom: '16px',
    width: '100%',
  };

  const formGridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const halfWidthStyle = {
    flex: '1 1 48%',
  };

  const buttonStyle = (bgColor = '#2563eb', hoverColor = '#1e40af') => ({
    marginTop: '24px',
    padding: '10px 24px',
    backgroundColor: bgColor,
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  });

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Settings</h1>

      {/* General Settings */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>General Settings</h2>
        <form style={formGridStyle}>
          <div style={{ ...inputGroupStyle, ...halfWidthStyle }}>
            <label style={labelStyle}>Hospital Name</label>
            <input type="text" placeholder="e.g., NxtGen Hospital" style={inputStyle} />
          </div>
          <div style={{ ...inputGroupStyle, ...halfWidthStyle }}>
            <label style={labelStyle}>Contact Email</label>
            <input type="email" placeholder="e.g., contact@nxtgen.com" style={inputStyle} />
          </div>
          <div style={{ ...inputGroupStyle, ...halfWidthStyle }}>
            <label style={labelStyle}>Time Zone</label>
            <select style={inputStyle}>
              <option>GMT+3 (EAT)</option>
              <option>GMT+0 (UTC)</option>
              <option>GMT-5 (EST)</option>
              <option>GMT+1 (CET)</option>
            </select>
          </div>
        </form>
        <button style={buttonStyle('#2563eb')}>Save Changes</button>
      </div>

      {/* Account Settings */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>Account Settings</h2>
        <form style={formGridStyle}>
          <div style={{ ...inputGroupStyle, ...halfWidthStyle }}>
            <label style={labelStyle}>Username</label>
            <input type="text" placeholder="e.g., admin" style={inputStyle} />
          </div>
          <div style={{ ...inputGroupStyle, ...halfWidthStyle }}>
            <label style={labelStyle}>Email</label>
            <input type="email" placeholder="e.g., admin@nxtgen.com" style={inputStyle} />
          </div>
          <div style={{ ...inputGroupStyle, ...halfWidthStyle }}>
            <label style={labelStyle}>New Password</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>
          <div style={{ ...inputGroupStyle, ...halfWidthStyle }}>
            <label style={labelStyle}>Confirm Password</label>
            <input type="password" placeholder="••••••••" style={inputStyle} />
          </div>
        </form>
        <button style={buttonStyle('#16a34a')}>Update Account</button>
      </div>
    </div>
  );
};

export default Settings;

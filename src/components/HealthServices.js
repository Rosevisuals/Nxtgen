import React from 'react';

function HealthServices() {
  const sectionStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'black', // changed from 'white' to 'black'
  };

  const servicesStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '50px',
    flexWrap: 'wrap',
    marginTop: '30px',
  };

  const serviceBox = {
    maxWidth: '250px',
  };

  const iconStyle = {
    width: '80px',
    height: '80px',
    marginBottom: '15px',
  };

  return (
  <section style={sectionStyle}>
      <h2>Health service for you</h2>
      <div style={servicesStyle}>
        <div style={serviceBox}>
          <img src="/images/download (2).png" alt="Calendar icon" style={iconStyle} />
          <p>Easily book, reschedule and manage patient appointments with real time access across all departments</p>
        </div>
        <div style={serviceBox}>
          <img src="/images/healthcare (1).png" alt="Video call icon" style={iconStyle} />
          <p>Connecting patients with doctors through appointments, secure video calls ensuring remote care is always within reach</p>
        </div>
        <div style={serviceBox}>
          <img src="/images/medicine.png" alt="Pharmacy icon" style={iconStyle} />
          <p>Allow patients to pick up their medicine prescribed and get notified for pickup</p>
        </div>
      </div>
    </section>
  );
}

export default HealthServices;

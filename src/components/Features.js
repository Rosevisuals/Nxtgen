import React from 'react';

function Features() {
  const containerStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'black',
    
  };

  const listContainer = {
    display: 'flex',
    justifyContent: 'center',
    gap: '100px',
    marginTop: '20px',
    flexWrap: 'wrap',
  };

  return (
    <section style={containerStyle}>
      <h2>Features</h2>
      <div style={listContainer}>
        <ul style={{ listStyle: 'none' }}>
          <li>. Patient record management</li>
          <li>. Appointment scheduling</li>
          <li>. Billing & payments</li>
        </ul>
        <ul style={{ listStyle: 'none' }}>
          <li>. Reports & analytics</li>
          <li>. Inventory & Pharmacy</li>
          <li>. Multi-user access i.e Admin, doctor</li>
        </ul>
      </div>
    </section>
  );
}

export default Features;

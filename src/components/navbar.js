import React from 'react';
function Navbar() {
    const navStyle = {
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 20px',
      fontFamily: 'Arial, sans-serif',
    };

  const linkContainerStyle = {
    display: 'flex',
    gap: '15px',
  };

  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '6px 10px',
    borderRadius: '5px',
  };

  const buttonStyle = {
  backgroundColor: '#4CAF50',
  color: 'white',
  padding: '10px 20px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold',
};



     return (
 <div>
      <nav style={navStyle}>
        <h1 style={{ margin: 0 }}>Nxtgen</h1>
        <div style={linkContainerStyle}>
          <a href="/navbar" style={linkStyle}>Home</a>
          <a href="/navbar" style={linkStyle}>About</a>
          <a href="/navbar" style={linkStyle}>Contact</a>
          <a href="/navbar" style={linkStyle}>Services</a>
          <a href="/navbar" style={buttonStyle}>Login</a>

        </div>
      </nav>
    </div>
);
}
export default Navbar;
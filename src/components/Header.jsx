import React, { useState } from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';

export default function Header({ title = 'Dashboard' }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 24px',
      height: '72px',
      backgroundColor: 'rgb(65, 105, 225)',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Page Title */}
      <h1 style={{
        fontSize: '22px',
        fontWeight: '600',
        color: '#ffffff',
        margin: 0,
        letterSpacing: '0.5px'
      }}>{title}</h1>

      {/* Right Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Notification */}
        <button style={{
          position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s ease',
          ':hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)'
          }
        }}>
          <Bell style={{
            width: '20px',
            height: '20px',
            color: '#ffffff'
          }} />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ff6b6b',
            borderRadius: '50%',
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
          }} />
          <span style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ff6b6b',
            borderRadius: '50%'
          }} />
        </button>

        {/* User Dropdown */}
        <div style={{
          position: 'relative'
        }}>
          <button 
            onClick={toggleDropdown}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: isDropdownOpen ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px 6px 6px',
              borderRadius: '24px',
              transition: 'background-color 0.2s ease',
              ':hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User style={{
                width: '18px',
                height: '18px',
                color: '#ffffff'
              }} />
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#ffffff'
            }}>Admin</span>
            <ChevronDown style={{
              width: '18px',
              height: '18px',
              color: 'rgba(255, 255, 255, 0.7)',
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} />
          </button>

          {isDropdownOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              padding: '8px 0',
              minWidth: '200px',
              zIndex: 1000
            }}>
              <a href="/profile" style={{
                padding: '10px 16px',
                fontSize: '14px',
                color: '#334155',
                textDecoration: 'none',
                display: 'block',
                transition: 'background-color 0.2s ease',
                ':hover': {
                  backgroundColor: 'rgba(65, 105, 225, 0.1)'
                }
              }}>My Profile</a>
              <a href="/settings" style={{
                padding: '10px 16px',
                fontSize: '14px',
                color: '#334155',
                textDecoration: 'none',
                display: 'block',
                transition: 'background-color 0.2s ease',
                ':hover': {
                  backgroundColor: 'rgba(65, 105, 225, 0.1)'
                }
              }}>Settings</a>
              <a href="/logout" style={{
                padding: '10px 16px',
                fontSize: '14px',
                color: '#ef4444',
                textDecoration: 'none',
                display: 'block',
                borderTop: '1px solid #e2e8f0',
                marginTop: '4px',
                paddingTop: '12px',
                transition: 'background-color 0.2s ease',
                ':hover': {
                  backgroundColor: 'rgba(239, 68, 68, 0.1)'
                }
              }}>Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
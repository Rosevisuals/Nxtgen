import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaSearch } from 'react-icons/fa';
import './MobileNav.css';

const MobileNav = ({ 
  isOpen, 
  onToggle, 
  title = "NxtGen Hospital",
  searchPlaceholder = "Search...",
  onSearch,
  showSearch = true,
  children 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Handle body scroll lock when mobile menu is open
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  if (!isMobile) {
    return null; // Don't render on desktop
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-nav-header">
        <button
          className="mobile-menu-toggle"
          onClick={onToggle}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <div className="mobile-nav-title">
          <h1>{title}</h1>
        </div>

        {showSearch && (
          <div className="mobile-search-toggle">
            <button
              className="search-toggle-btn"
              onClick={() => document.querySelector('.mobile-search-bar')?.focus()}
              aria-label="Focus search"
            >
              <FaSearch />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="mobile-search-container">
          <form onSubmit={handleSearchSubmit} className="mobile-search-form">
            <div className="mobile-search-wrapper">
              <FaSearch className="mobile-search-icon" />
              <input
                type="text"
                className="mobile-search-bar"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="mobile-search-clear"
                  onClick={() => {
                    setSearchTerm('');
                    if (onSearch) onSearch('');
                  }}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div 
          className="mobile-nav-overlay"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Content */}
      <div className={`mobile-nav-menu ${isOpen ? 'open' : ''}`}>
        <div className="mobile-nav-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default MobileNav;
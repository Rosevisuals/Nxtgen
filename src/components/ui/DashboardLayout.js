import React, { useState, useEffect } from 'react';
import MobileNav from './MobileNav';
import './DashboardLayout.css';

const DashboardLayout = ({ 
  sidebar: SidebarComponent, 
  children, 
  title = "NxtGen Hospital",
  searchPlaceholder = "Search...",
  onSearch,
  showSearch = true 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      
      // Auto-close sidebar on mobile when resizing to desktop
      if (!mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar */}
      {SidebarComponent && (
        <SidebarComponent 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar}
        />
      )}

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        title={title}
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
        showSearch={showSearch}
      >
        {SidebarComponent && (
          <SidebarComponent 
            isOpen={isSidebarOpen} 
            toggleSidebar={toggleSidebar}
          />
        )}
      </MobileNav>

      {/* Main Content */}
      <main className={`dashboard-main ${isMobile ? 'mobile' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
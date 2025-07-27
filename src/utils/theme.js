/**
 * ERP System Theme Configuration
 * This file contains the color palette and design variables for the entire application.
 */

const theme = {
  // Primary Colors
  colors: {
    primary: {
      main: '#1976d2',      // Main primary color (buttons, links, active items)
      light: '#4299e1',     // Lighter shade of primary
      dark: '#155db0',      // Darker shade of primary
      contrast: '#ffffff',  // Text color on primary background
    },
    secondary: {
      main: '#4CAF50',      // Secondary color (success actions, confirmations)
      light: '#81c784',     // Lighter shade of secondary
      dark: '#388e3c',      // Darker shade of secondary
      contrast: '#ffffff',  // Text color on secondary background
    },
    accent: {
      main: '#f6ad55',      // Accent color for highlights and attention
      light: '#fbd38d',     // Lighter shade of accent
      dark: '#dd6b20',      // Darker shade of accent
      contrast: '#000000',  // Text color on accent background
    },
    
    // UI Colors
    ui: {
      background: '#f4f7fc',        // Main background color
      card: '#ffffff',              // Card background
      sidebar: '#1a202c',           // Sidebar background
      sidebarText: '#a0aec0',       // Sidebar text color
      sidebarActive: '#4299e1',     // Sidebar active item indicator
      border: '#e2e8f0',            // Border color
      hover: '#edf2f7',             // Hover state background
    },
    
    // Text Colors
    text: {
      primary: '#2d3748',           // Primary text color
      secondary: '#718096',         // Secondary text color
      disabled: '#a0aec0',          // Disabled text color
      hint: '#a0aec0',              // Hint text color
    },
    
    // Status Colors
    status: {
      success: '#48bb78',           // Success status
      warning: '#f6ad55',           // Warning status
      error: '#f56565',             // Error status
      info: '#4299e1',              // Info status
      pending: '#faf089',           // Pending status
      confirmed: '#c6f6d5',         // Confirmed status
      cancelled: '#fed7d7',         // Cancelled status
    },
    
    // Chart Colors (for consistency in data visualization)
    chart: [
      '#1976d2', '#4CAF50', '#f6ad55', '#f56565', '#805ad5',
      '#6f42c1', '#e83e8c', '#20c997', '#17a2b8', '#6610f2'
    ],
  },
  
  // Typography
  typography: {
    fontFamily: "'Segoe UI', 'Roboto', 'Arial', sans-serif",
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      md: '1rem',       // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px
  },
  
  // Borders
  border: {
    radius: {
      sm: '0.125rem',   // 2px
      md: '0.25rem',    // 4px
      lg: '0.5rem',     // 8px
      xl: '0.75rem',    // 12px
      '2xl': '1rem',    // 16px
      full: '9999px',   // Fully rounded (circles)
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Transitions
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  
  // Z-index
  zIndex: {
    navbar: 1000,
    sidebar: 900,
    modal: 1100,
    tooltip: 1200,
    dropdown: 1050,
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    xs: '0px',
    sm: '600px',
    md: '960px',
    lg: '1280px',
    xl: '1920px',
  },
};

export default theme;
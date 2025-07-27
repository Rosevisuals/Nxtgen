import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tabs Component
 * 
 * A reusable tabs component for navigation between different content sections.
 * 
 * @param {string} activeTab - The ID of the currently active tab
 * @param {function} onChange - Function to call when a tab is clicked
 * @param {array} tabs - Array of tab objects with id and label properties
 * @param {string} className - Additional CSS classes
 */
const Tabs = ({
  activeTab,
  onChange,
  tabs = [],
  className = '',
}) => {
  // Base tabs class
  let tabsClass = 'tabs';
  
  // Add any additional classes
  if (className) {
    tabsClass += ` ${className}`;
  }
  
  return (
    <div className={tabsClass}>
      <div className="tabs-list">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  className: PropTypes.string,
};

export default Tabs;
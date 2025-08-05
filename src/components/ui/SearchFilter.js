import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaFilter, FaTimes, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import './SearchFilter.css';

const SearchFilter = ({
  data = [],
  onFilteredData,
  searchFields = [],
  filterOptions = [],
  sortOptions = [],
  placeholder = "Search...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (debouncedSearchTerm && searchFields.length > 0) {
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = getNestedValue(item, field);
          return value && value.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
        })
      );
    }

    // Apply category filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        filtered = filtered.filter(item => {
          const itemValue = getNestedValue(item, key);
          return itemValue === value;
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = getNestedValue(a, sortBy);
        const bValue = getNestedValue(b, sortBy);
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        
        return sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [data, debouncedSearchTerm, searchFields, activeFilters, sortBy, sortOrder]);

  // Helper function to get nested object values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Update parent component with filtered data
  useEffect(() => {
    if (onFilteredData) {
      onFilteredData(filteredAndSortedData);
    }
  }, [filteredAndSortedData, onFilteredData]);

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
    setSortBy('');
    setSortOrder('asc');
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <FaSort />;
    return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v && v !== 'all').length;

  return (
    <div className={`search-filter-container ${className}`}>
      {/* Main Search Bar */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <button
          className={`filter-toggle ${showAdvanced ? 'active' : ''}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-label="Toggle advanced filters"
        >
          <FaFilter />
          {activeFilterCount > 0 && (
            <span className="filter-count">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          <div className="filter-row">
            {/* Category Filters */}
            {filterOptions.map((filter) => (
              <div key={filter.key} className="filter-group">
                <label className="filter-label">{filter.label}</label>
                <select
                  className="filter-select"
                  value={activeFilters[filter.key] || 'all'}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                >
                  <option value="all">All {filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Sort Options */}
            {sortOptions.length > 0 && (
              <div className="filter-group">
                <label className="filter-label">Sort By</label>
                <div className="sort-buttons">
                  {sortOptions.map((option) => (
                    <button
                      key={option.key}
                      className={`sort-btn ${sortBy === option.key ? 'active' : ''}`}
                      onClick={() => handleSortChange(option.key)}
                    >
                      {option.label}
                      {getSortIcon(option.key)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Filter Actions */}
          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearAllFilters}>
              <FaTimes /> Clear All
            </button>
            <span className="results-count">
              {filteredAndSortedData.length} result{filteredAndSortedData.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Quick Filter Tags */}
      {activeFilterCount > 0 && (
        <div className="active-filters">
          {Object.entries(activeFilters).map(([key, value]) => {
            if (!value || value === 'all') return null;
            const filter = filterOptions.find(f => f.key === key);
            const option = filter?.options.find(o => o.value === value);
            return (
              <span key={key} className="filter-tag">
                {filter?.label}: {option?.label || value}
                <button
                  onClick={() => handleFilterChange(key, 'all')}
                  aria-label={`Remove ${filter?.label} filter`}
                >
                  <FaTimes />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
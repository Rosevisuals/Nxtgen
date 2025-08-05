import React from 'react';
import PropTypes from 'prop-types';

/**
 * Table Component
 * 
 * A reusable table component for displaying data.
 * 
 * @param {array} columns - Array of column definitions
 * @param {array} data - Array of data objects
 * @param {boolean} striped - Whether the table should have striped rows
 * @param {boolean} hoverable - Whether the table rows should have hover effects
 * @param {boolean} bordered - Whether the table should have borders
 * @param {boolean} responsive - Whether the table should be responsive
 * @param {function} onRowClick - Function to call when a row is clicked
 * @param {string} className - Additional CSS classes
 * @param {object} props - Additional props
 */
const Table = ({
  columns,
  data,
  striped = true,
  hoverable = true,
  bordered = false,
  responsive = true,
  onRowClick,
  className = '',
  ...props
}) => {
  // Base table class
  let tableClass = 'table';
  
  // Add variant classes
  if (striped) {
    tableClass += ' table-striped';
  }
  
  if (hoverable) {
    tableClass += ' table-hover';
  }
  
  if (bordered) {
    tableClass += ' table-bordered';
  }
  
  // Add any additional classes
  if (className) {
    tableClass += ` ${className}`;
  }
  
  const tableContent = (
    <table className={tableClass} {...props}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className={column.className || ''}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr 
            key={rowIndex} 
            onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
            className={onRowClick ? 'cursor-pointer' : ''}
          >
            {columns.map((column, colIndex) => (
              <td key={colIndex} className={column.className || ''}>
                {column.cell ? column.cell(row, rowIndex) : row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  
  // Wrap in responsive div if needed
  if (responsive) {
    return <div className="table-responsive">{tableContent}</div>;
  }
  
  return tableContent;
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.node.isRequired,
      accessor: PropTypes.string,
      cell: PropTypes.func,
      className: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  striped: PropTypes.bool,
  hoverable: PropTypes.bool,
  bordered: PropTypes.bool,
  responsive: PropTypes.bool,
  onRowClick: PropTypes.func,
  className: PropTypes.string,
};

export default Table;
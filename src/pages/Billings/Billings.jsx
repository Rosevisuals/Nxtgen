import React, { useState, useMemo } from 'react';

// Dummy initial invoice data
const initialInvoices = [
  {
    id: 1,
    patient: 'John Doe',
    service: 'MRI Scan',
    amount: 1200,
    status: 'Paid',
    date: '2025-07-15'
  },
  {
    id: 2,
    patient: 'Jane Smith',
    service: 'Blood Test',
    amount: 200,
    status: 'Unpaid',
    date: '2025-07-18'
  },
  {
    id: 3,
    patient: 'Michael Brown',
    service: 'X-Ray',
    amount: 350,
    status: 'Partial',
    date: '2025-07-20'
  }
];

export default function Billings() {
  const invoices = useMemo(() => initialInvoices, []);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Derived totals for summary cards
  const summary = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const outstanding = invoices
      .filter(inv => inv.status !== 'Paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    return {
      total,
      outstanding,
      count: invoices.length
    };
  }, [invoices]);

  // Apply search & filter
  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = `${inv.patient} ${inv.service}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' ? true : inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, statusFilter]);

  return (
    <div style={{
      padding: '24px',
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        <SummaryCard title="Total Revenue" value={`$${summary.total.toLocaleString()}`} />
        <SummaryCard title="Outstanding" value={`$${summary.outstanding.toLocaleString()}`} />
        <SummaryCard title="Invoices" value={summary.count} />
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="Search..."
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            padding: '8px 12px',
            width: '192px'
          }}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            padding: '8px 12px'
          }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Paid">Paid</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partial">Partial</option>
        </select>
      </div>

      {/* Invoice Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          minWidth: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={thStyle}>Patient</th>
              <th style={thStyle}>Service</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Amount ($)</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(inv => (
              <tr key={inv.id} style={{ backgroundColor: 'white' }}>
                <td style={tdStyle}>{inv.patient}</td>
                <td style={tdStyle}>{inv.service}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{inv.amount.toFixed(2)}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '9999px',
                      backgroundColor: inv.status === 'Paid' ? '#dcfce7' : inv.status === 'Unpaid' ? '#fee2e2' : '#fef9c3',
                      color: inv.status === 'Paid' ? '#166534' : inv.status === 'Unpaid' ? '#991b1b' : '#854d0e'
                    }}
                  >
                    {inv.status}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{inv.date}</td>
              </tr>
            ))}
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="5" style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  color: '#6b7280'
                }}>
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ title, value }) {
  return (
    <div style={{
      backgroundColor: 'white',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      padding: '16px'
    }}>
      <div style={{ fontSize: '14px', color: '#6b7280' }}>{title}</div>
      <div style={{ marginTop: '8px', fontSize: '24px', fontWeight: '600' }}>{value}</div>
    </div>
  );
}

const thStyle = {
  padding: '8px 16px',
  textAlign: 'left',
  fontSize: '12px',
  fontWeight: '500',
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
};

const tdStyle = {
  padding: '8px 16px',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid #e5e7eb'
};

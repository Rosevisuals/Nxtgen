import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaFileExport, FaMoneyBillWave, FaCreditCard, FaHandHoldingUsd, FaUserShield } from 'react-icons/fa';

const demoPayments = [
  { id: 1, patient: 'John Doe', patientId: 'P1001', amount: 500, date: '2024-07-20', method: 'Credit Card' },
  { id: 2, patient: 'Jane Smith', patientId: 'P1002', amount: 300, date: '2024-07-18', method: 'Cash' },
  { id: 3, patient: 'Mike Brown', patientId: 'P1003', amount: 700, date: '2024-07-15', method: 'Insurance' },
  { id: 4, patient: 'Sarah Johnson', patientId: 'P1004', amount: 450, date: '2024-07-10', method: 'Bank Transfer' },
  { id: 5, patient: 'David Wilson', patientId: 'P1005', amount: 600, date: '2024-07-05', method: 'Credit Card' },
];

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');

  useEffect(() => {
    setTimeout(() => {
      setPayments(demoPayments);
      setLoading(false);
    }, 800);
  }, []); // No warning now

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = filterMethod === 'All' ? true : payment.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Credit Card': return <FaCreditCard style={{ marginRight: '6px' }} />;
      case 'Cash': return <FaHandHoldingUsd style={{ marginRight: '6px' }} />;
      case 'Insurance': return <FaUserShield style={{ marginRight: '6px' }} />;
      case 'Bank Transfer': return <FaMoneyBillWave style={{ marginRight: '6px' }} />;
      default: return <FaMoneyBillWave style={{ marginRight: '6px' }} />;
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#2c3e50', margin: 0 }}>Payment History</h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            backgroundColor: '#e0f2fe',
            padding: '8px 12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaMoneyBillWave />
            <span style={{ fontWeight: '500' }}>Total Revenue: ${totalRevenue.toLocaleString()}</span>
          </div>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: '#e0f2fe',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}>
            <FaFileExport /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative' }}>
          <FaSearch style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 16px 10px 36px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              minWidth: '250px'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaFilter style={{ color: '#6b7280' }} />
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            style={{
              padding: '10px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="All">All Methods</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Insurance">Insurance</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>

      {/* Payment Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', color: '#7f8c8d' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="spinner" style={{
              width: '40px',
              height: '40px',
              border: '4px solid rgba(0,0,0,0.1)',
              borderLeftColor: '#3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span>Loading payment history...</span>
          </div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          color: '#7f8c8d'
        }}>
          No payments found matching your criteria.
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          overflowX: 'auto'
        }}>
          <table style={{ minWidth: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              textTransform: 'uppercase',
              fontSize: '12px'
            }}>
              <tr>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Patient</th>
                <th style={{ padding: '16px 24px', textAlign: 'right' }}>Amount</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '16px 24px', textAlign: 'left' }}>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <div style={{ fontWeight: '500' }}>{payment.patient}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>ID: {payment.patientId}</div>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '500' }}>
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: '16px 24px' }}>{payment.date}</td>
                  <td style={{ padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
                    {getMethodIcon(payment.method)}
                    {payment.method}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

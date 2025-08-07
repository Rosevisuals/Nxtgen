import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaSearch, FaPlus, FaTrash, FaPrint, FaEnvelope, FaCheck } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from './ui/Input';
import Select from './ui/Select';
import Modal from './ui/Modal';
import { apiFetch } from '../utils/api';
import './centered-layout.css';

/**
 * Billing Component
 * 
 * Page for managing patient bills, aligned with the hospital database.
 */
const Billing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteBillModalOpen, setIsDeleteBillModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [patients, setPatients] = useState([]);

  // Payment form state
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method_of_payment: 'Cash',
    notes: '',
    date_issued: new Date().toISOString().split('T')[0],
  });



  // Payment method options
  const paymentMethodOptions = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Debit Card', label: 'Debit Card' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Mobile Payment', label: 'Mobile Payment' },
    { value: 'Check', label: 'Check' },
  ];



  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [billsData, patientsData] = await Promise.all([
          apiFetch('/billing'),
          apiFetch('/patients')
        ]);

        // Handle auth bypass response for billing
        const bills = billsData?.success ? [] : (Array.isArray(billsData) ? billsData : []);
        setBills(bills);
        setPatients(Array.isArray(patientsData) ? patientsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load billing data');
        setBills([]);
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter bills based on search query
  useEffect(() => {
    if (!Array.isArray(bills) || bills.length === 0) {
      setFilteredBills([]);
      return;
    }
    const filtered = bills.filter(bill => {
      const query = searchQuery.toLowerCase();
      return query === '' ||
        (bill.patient_name && bill.patient_name.toLowerCase().includes(query)) ||
        bill.bill_id.toString().includes(query) ||
        (bill.service_name && bill.service_name.toLowerCase().includes(query)) ||
        (bill.method_of_payment && bill.method_of_payment.toLowerCase().includes(query)) ||
        (bill.status && bill.status.toLowerCase().includes(query));
    });
    setFilteredBills(filtered);
  }, [bills, searchQuery]);

  // Table columns for bills
  const billColumns = [
    { header: 'Bill ID', accessor: 'bill_id' },
    {
      header: 'Patient',
      accessor: 'patient_name',
      cell: (row) => (
        <div className="patient-info">
          <span className="patient-name">{row.patient_name}</span>
          <span className="patient-id">ID: {row.patient_id}</span>
        </div>
      ),
    },
    {
      header: 'Service',
      accessor: 'service_name',
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (row) => (
        <span className="bill-amount">{row.amount.toLocaleString()} UGX</span>
      ),
    },
    {
      header: 'Date Issued',
      accessor: 'date_issued',
      cell: (row) => (
        <div>
          <div>{new Date(row.date_issued).toLocaleDateString()}</div>
          <div style={{fontSize: '0.8em', color: '#64748b'}}>
            {new Date(row.date_issued).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ),
    },
    {
      header: 'Payment Method',
      accessor: 'method_of_payment',
      cell: (row) => (
        <span className="payment-method">{row.method_of_payment || 'Not Specified'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => {
        let variant = 'primary';
        switch (row.status) {
          case 'Paid': variant = 'success'; break;
          case 'Partially Paid': variant = 'warning'; break;
          case 'Pending': variant = 'primary'; break;
          case 'Overdue': variant = 'danger'; break;
          default: variant = 'primary';
        }
        return <span className={`badge badge-${variant === 'success' ? 'success' : variant === 'warning' ? 'warning' : variant === 'danger' ? 'danger' : 'primary'}`}>{row.status}</span>;
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          {row.status !== 'Paid' && (
            <>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handlePayment(row)}
                aria-label={`Record payment for bill ${row.bill_id}`}
                style={{marginRight: '0.5rem'}}
              >
                <FaCheck /> Pay
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleDeleteBill(row)}
                aria-label={`Delete bill ${row.bill_id}`}
                style={{marginRight: '0.5rem'}}
              >
                <FaTrash />
              </button>
            </>
          )}
          <button
            className="btn btn-outline btn-sm"
            onClick={() => handlePrintBill(row)}
            aria-label={`Print bill ${row.bill_id}`}
            style={{marginRight: '0.5rem'}}
          >
            <FaPrint />
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => handleEmailBill(row)}
            aria-label={`Email bill ${row.bill_id}`}
          >
            <FaEnvelope />
          </button>
        </div>
      ),
    },
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Calculate summary statistics
  const totalTransactions = filteredBills.length;
  const totalAmount = filteredBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
  const paidTransactions = filteredBills.filter(bill => bill.status === 'Paid').length;
  const pendingTransactions = filteredBills.filter(bill => bill.status === 'Pending').length;

  // Handle payment button click
  const handlePayment = (bill) => {
    setCurrentBill(bill);
    setPaymentData({
      amount: bill.amount,
      method_of_payment: 'Cash',
      notes: '',
      date_issued: new Date().toISOString().split('T')[0],
    });
    setIsPaymentModalOpen(true);
  };

  // Handle delete bill button click
  const handleDeleteBill = (bill) => {
    setCurrentBill(bill);
    setIsDeleteBillModalOpen(true);
  };

  // Handle print bill button click
  const handlePrintBill = (bill) => {
    try {
      const printWindow = window.open('', '_blank');
      const printContent = `
        <html>
          <head>
            <title>Bill ${bill.bill_id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .bill-details { margin: 20px 0; }
              .total { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Hospital Bill</h1>
              <h2>Bill ID: ${bill.bill_id}</h2>
            </div>
            <div class="bill-details">
              <p><strong>Patient:</strong> ${bill.patient_name}</p>
              <p><strong>Patient ID:</strong> ${bill.patient_id}</p>
              <p><strong>Service:</strong> ${bill.service_name}</p>
              <p><strong>Date Issued:</strong> ${new Date(bill.date_issued).toLocaleDateString()}</p>
              <p><strong>Payment Method:</strong> ${bill.method_of_payment || 'Not Specified'}</p>
              <p><strong>Status:</strong> ${bill.status}</p>
              <p class="total"><strong>Amount:</strong> ${bill.amount.toLocaleString()} UGX</p>
            </div>
          </body>
        </html>
      `;
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      toast.success(`Bill ${bill.bill_id} sent to printer`);
    } catch (error) {
      console.error('Error printing bill:', error);
      toast.error('Failed to print bill');
    }
  };

  // Handle email bill button click
  const handleEmailBill = (bill) => {
    try {
      const subject = `Hospital Bill ${bill.bill_id}`;
      const body = `Dear ${bill.patient_name},\n\nPlease find your hospital bill details below:\n\nBill ID: ${bill.bill_id}\nService: ${bill.service_name}\nAmount: ${bill.amount.toLocaleString()} UGX\nDate: ${new Date(bill.date_issued).toLocaleDateString()}\nStatus: ${bill.status}\n\nThank you for choosing our services.\n\nBest regards,\nHospital Administration`;
      const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoLink);
      toast.success(`Email template opened for bill ${bill.bill_id}`);
    } catch (error) {
      console.error('Error emailing bill:', error);
      toast.error('Failed to open email template');
    }
  };

  // Handle payment form input change
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  // Handle payment form submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentData.amount || !paymentData.method_of_payment) {
      toast.error('Please fill in all required payment fields.');
      return;
    }

    // TODO: Replace with actual API call
    /*
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
    const API_KEY = process.env.REACT_APP_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY || localStorage.getItem('authToken')}`,
    };

    fetch(`${API_BASE_URL}/bills/${currentBill.bill_id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        amount: parseFloat(currentBill.amount) - parseFloat(paymentData.amount),
        method_of_payment: paymentData.method_of_payment,
        status: parseFloat(paymentData.amount) >= currentBill.amount ? 'Paid' : 'Partially Paid',
        notes: currentBill.notes + (currentBill.notes ? '\n' : '') + paymentData.notes,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to record payment.');
        return res.json();
      })
      .then(data => {
        setBills(prev => prev.map(bill => 
          bill.bill_id === currentBill.bill_id ? data : bill
        ));
        setIsPaymentModalOpen(false);
        toast.success('Payment recorded successfully!');
      })
      .catch(err => toast.error(err.message));
    */

    try {
      await apiFetch(`/billing/${currentBill.bill_id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          amount: currentBill.amount - parseFloat(paymentData.amount),
          method_of_payment: paymentData.method_of_payment,
          status: parseFloat(paymentData.amount) >= currentBill.amount ? 'Paid' : 'Partially Paid',
          notes: currentBill.notes + (currentBill.notes ? '\n' : '') + paymentData.notes,
        })
      });
      
      const updatedBills = bills.map(bill => {
        if (bill.bill_id === currentBill.bill_id) {
          const newStatus = parseFloat(paymentData.amount) >= bill.amount ? 'Paid' : 'Partially Paid';
          return {
            ...bill,
            amount: bill.amount - parseFloat(paymentData.amount),
            method_of_payment: paymentData.method_of_payment,
            status: newStatus,
            notes: bill.notes + (bill.notes ? '\n' : '') + paymentData.notes,
          };
        }
        return bill;
      });
      setBills(updatedBills);
      setIsPaymentModalOpen(false);
      toast.success('Payment recorded successfully!');
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    }
  };

  // Handle delete bill confirmation
  const handleDeleteBillConfirm = async () => {
    // TODO: Replace with actual API call
    /*
    fetch(`${API_BASE_URL}/bills/${currentBill.bill_id}`, {
      method: 'DELETE',
      headers,
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete bill.');
        setBills(prev => prev.filter(bill => bill.bill_id !== currentBill.bill_id));
        setIsDeleteBillModalOpen(false);
        toast.success('Bill deleted successfully!');
      })
      .catch(err => toast.error(err.message));
    */

    try {
      await apiFetch(`/billing/${currentBill.bill_id}`, {
        method: 'DELETE'
      });
      setBills(prev => prev.filter(bill => bill.bill_id !== currentBill.bill_id));
      setIsDeleteBillModalOpen(false);
      toast.success('Bill deleted successfully!');
    } catch (error) {
      console.error('Error deleting bill:', error);
      toast.error('Failed to delete bill');
    }
  };



  if (isLoading) {
    return (
      <div className="billing loading">
        <p>Loading bills...</p>
      </div>
    );
  }

  return (
    <div className="centered-container">
      <div className="centered-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="page-header">
          <h1 className="page-title">
            <FaFileInvoiceDollar /> Billing Management
          </h1>
          <p className="page-subtitle">Manage patient bills and payments</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Transaction Summary</h2>
          </div>
          <div className="card-body">
            <div className="row" style={{marginBottom: '1rem'}}>
              <div className="col-3">
                <div className="stat-card">
                  <div className="stat-value">{totalTransactions}</div>
                  <div className="stat-label">Total Transactions</div>
                </div>
              </div>
              <div className="col-3">
                <div className="stat-card">
                  <div className="stat-value">{totalAmount.toLocaleString()} UGX</div>
                  <div className="stat-label">Total Amount</div>
                </div>
              </div>
              <div className="col-3">
                <div className="stat-card">
                  <div className="stat-value">{paidTransactions}</div>
                  <div className="stat-label">Paid</div>
                </div>
              </div>
              <div className="col-3">
                <div className="stat-card">
                  <div className="stat-value">{pendingTransactions}</div>
                  <div className="stat-label">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Search & Actions</h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-8">
                <div className="form-group">
                  <label className="form-label" htmlFor="searchQuery">
                    <FaSearch style={{marginRight: '0.5rem'}} /> Search Transactions
                  </label>
                  <input
                    type="text"
                    id="searchQuery"
                    className="form-input"
                    placeholder="Search by patient, transaction ID, service, or status..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
              </div>
              <div className="col-4">
                <div className="form-group">
                  <label className="form-label" style={{visibility: 'hidden'}}>Actions</label>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/billing/new')}
                    aria-label="Create new transaction"
                  >
                    <FaPlus /> New Transaction
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Transaction History ({filteredBills.length} transactions)</h2>
          </div>
          <div className="card-body">
            {filteredBills.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      {billColumns.map((col, index) => (
                        <th key={index}>{col.header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map((row, index) => (
                      <tr key={index}>
                        {billColumns.map((col, colIndex) => (
                          <td key={colIndex}>
                            {col.cell ? col.cell(row) : row[col.accessor]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center" style={{padding: '2rem', color: '#64748b'}}>
                <p>No transactions found.</p>
              </div>
            )}
          </div>
        </div>

      {/* Delete Bill Modal */}
      <Modal
        isOpen={isDeleteBillModalOpen}
        onClose={() => setIsDeleteBillModalOpen(false)}
        title="Delete Bill"
        size="sm"
      >
        <p>Are you sure you want to delete bill {currentBill?.bill_id} for {currentBill?.patient_name}?</p>
        <p>This action cannot be undone.</p>
        <Modal.Footer
          onCancel={() => setIsDeleteBillModalOpen(false)}
          onConfirm={handleDeleteBillConfirm}
          confirmText="Delete"
        />
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Record Payment"
        size="md"
      >
        <form onSubmit={handlePaymentSubmit}>
          <div className="form-row">
            <Input
              label="Amount (UGX)"
              name="amount"
              type="number"
              value={paymentData.amount}
              onChange={handlePaymentInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-row">
            <Select
              label="Payment Method"
              name="method_of_payment"
              value={paymentData.method_of_payment}
              onChange={handlePaymentInputChange}
              options={paymentMethodOptions}
              required
            />
          </div>
          <div className="form-row">
            <Input
              label="Notes"
              name="notes"
              value={paymentData.notes}
              onChange={handlePaymentInputChange}
              placeholder="Additional notes about the payment"
              multiline
              rows={2}
            />
          </div>
          <Modal.Footer
            onCancel={() => setIsPaymentModalOpen(false)}
            onConfirm={handlePaymentSubmit}
            confirmText="Record Payment"
          />
        </form>
      </Modal>
      </div>
    </div>
  );
};

export default Billing;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaSearch, FaPlus, FaTrash, FaPrint, FaEnvelope, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import Table from './ui/Table';
import Badge from './ui/Badge';
import Modal from './ui/Modal';
import './billing.css';

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

  // Mock data based on database schema
  const mockPatients = [
    { patient_id: 1, full_Name: 'Mark Leewe' },
    { patient_id: 2, full_Name: 'Tom Cruse' },
  ];

  const mockBills = [
    {
      bill_id: 1,
      patient_id: 1,
      patient_name: 'Mark Leewe',
      service_name: 'Consultation',
      amount: 150000,
      date_issued: '2025-07-20',
      method_of_payment: 'Credit Card',
      status: 'Paid',
      notes: '',
    },
    {
      bill_id: 2,
      patient_id: 2,
      patient_name: 'Tom Cruse',
      service_name: 'Blood Test',
      amount: 200000,
      date_issued: '2025-07-22',
      method_of_payment: null,
      status: 'Pending',
      notes: '',
    },
    {
      bill_id: 3,
      patient_id: 1,
      patient_name: 'Mark Leewe',
      service_name: 'Follow-up Consultation',
      amount: 100000,
      date_issued: '2025-07-15',
      method_of_payment: 'Cash',
      status: 'Partially Paid',
      notes: 'Patient paid 50000 UGX, remaining 50000 UGX due.',
    },
    {
      bill_id: 4,
      patient_id: 2,
      patient_name: 'Tom Cruse',
      service_name: 'X-Ray',
      amount: 250000,
      date_issued: '2025-07-18',
      method_of_payment: null,
      status: 'Overdue',
      notes: '',
    },
  ];

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

  // Patient options for select
  const patientOptions = patients.map(patient => ({
    value: patient.patient_id,
    label: `${patient.full_Name} (ID: ${patient.patient_id})`,
  }));

  // Fetch bills and patients (mock for now, API-ready)
  useEffect(() => {
    setIsLoading(true);

    // TODO: Uncomment and configure for API integration
    /*
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
    const API_KEY = process.env.REACT_APP_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY || localStorage.getItem('authToken')}`,
    };

    const fetchData = async () => {
      try {
        const [billsResponse, patientsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/bills`, { headers }),
          fetch(`${API_BASE_URL}/patients`, { headers }),
        ]);
        if (!billsResponse.ok) throw new Error('Failed to fetch bills.');
        if (!patientsResponse.ok) throw new Error('Failed to fetch patients.');
        const [billsData, patientsData] = await Promise.all([
          billsResponse.json(),
          patientsResponse.json(),
        ]);
        setBills(billsData);
        setPatients(patientsData);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    */

    // Mock data loading
    setTimeout(() => {
      setBills(mockBills);
      setPatients(mockPatients);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter bills based on search query
  useEffect(() => {
    if (bills.length === 0) return;
    const filtered = bills.filter(bill => {
      const query = searchQuery.toLowerCase();
      return query === '' ||
        bill.patient_name.toLowerCase().includes(query) ||
        bill.bill_id.toString().includes(query) ||
        bill.status.toLowerCase().includes(query);
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
        <span>{new Date(row.date_issued).toLocaleDateString()}</span>
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
        return <Badge variant={variant} pill>{row.status}</Badge>;
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          {row.status !== 'Paid' && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handlePayment(row)}
                aria-label={`Record payment for bill ${row.bill_id}`}
              >
                <FaCheck /> Pay
              </Button>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => handleDeleteBill(row)}
                aria-label={`Delete bill ${row.bill_id}`}
              >
                <FaTrash />
              </Button>
            </>
          )}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handlePrintBill(row)}
            aria-label={`Print bill ${row.bill_id}`}
          >
            <FaPrint />
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleEmailBill(row)}
            aria-label={`Email bill ${row.bill_id}`}
          >
            <FaEnvelope />
          </Button>
        </div>
      ),
    },
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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
    // TODO: Implement print functionality
    toast.info(`Printing bill ${bill.bill_id} for ${bill.patient_name}`);
  };

  // Handle email bill button click
  const handleEmailBill = (bill) => {
    // TODO: Implement email functionality
    toast.info(`Emailing bill ${bill.bill_id} to ${bill.patient_name}`);
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
  const handlePaymentSubmit = (e) => {
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

    // Mock submission
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
  };

  // Handle delete bill confirmation
  const handleDeleteBillConfirm = () => {
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

    // Mock deletion
    setBills(prev => prev.filter(bill => bill.bill_id !== currentBill.bill_id));
    setIsDeleteBillModalOpen(false);
    toast.success('Bill deleted successfully!');
  };

  // Handle back navigation
  const handleBack = () => navigate(-1);

  // Handle new bill navigation
  const handleNewBill = () => navigate('/NewBill');

  // Handle keyboard navigation
  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
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
    <div className="billing">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="billing-header">
        <Button
          variant="outline-secondary"
          onClick={handleBack}
          onKeyDown={(e) => handleKeyDown(e, handleBack)}
          aria-label="Go back"
          className="back-button"
        >
          <FaArrowLeft className="mr-1" /> Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaFileInvoiceDollar className="mr-2" /> Billing
        </h1>
      </div>

      <div className="billing-controls">
        <Card className="search-card">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <Input
              type="text"
              placeholder="Search bills by patient, bill ID, or status..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </Card>
        <Card className="actions-card">
          <Button
            variant="primary"
            onClick={handleNewBill}
            aria-label="Create new bill"
          >
            <FaPlus /> New Bill
          </Button>
        </Card>
      </div>

      <Card title="Bills" className="bills-card">
        {filteredBills.length > 0 ? (
          <Table
            columns={billColumns}
            data={filteredBills}
            striped
            hoverable
          />
        ) : (
          <div className="no-bills">
            <p>No bills found.</p>
          </div>
        )}
      </Card>

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
  );
};

export default Billing;
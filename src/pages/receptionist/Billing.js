import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaSearch, FaPlus, FaEdit, FaTrash, FaPrint, FaEnvelope, FaCheck } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import DatePicker from '../../components/ui/DatePicker';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';

/**
 * Billing Component
 * 
 * Page for creating and managing patient bills.
 */
const Billing = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [isEditBillModalOpen, setIsEditBillModalOpen] = useState(false);
  const [isDeleteBillModalOpen, setIsDeleteBillModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    billDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ],
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0,
    notes: '',
  });
  
  // Payment form state
  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: 'Cash',
    reference: '',
    date: new Date(),
    notes: '',
  });
  
  // Mock bills data (in a real app, this would come from an API)
  const mockBills = [
    {
      id: 'B-10001',
      patientId: 'P-10025',
      patientName: 'John Doe',
      billDate: new Date('2025-07-20'),
      dueDate: new Date('2025-08-19'),
      items: [
        {
          description: 'Consultation Fee',
          quantity: 1,
          unitPrice: 150,
          amount: 150,
        },
        {
          description: 'Blood Test',
          quantity: 1,
          unitPrice: 75,
          amount: 75,
        },
        {
          description: 'Medication',
          quantity: 2,
          unitPrice: 25,
          amount: 50,
        },
      ],
      subtotal: 275,
      tax: 27.5,
      discount: 0,
      total: 302.5,
      status: 'Paid',
      paymentDate: new Date('2025-07-20'),
      paymentMethod: 'Credit Card',
      notes: '',
    },
    {
      id: 'B-10002',
      patientId: 'P-10032',
      patientName: 'Jane Smith',
      billDate: new Date('2025-07-22'),
      dueDate: new Date('2025-08-21'),
      items: [
        {
          description: 'Consultation Fee',
          quantity: 1,
          unitPrice: 150,
          amount: 150,
        },
        {
          description: 'ECG',
          quantity: 1,
          unitPrice: 200,
          amount: 200,
        },
      ],
      subtotal: 350,
      tax: 35,
      discount: 0,
      total: 385,
      status: 'Pending',
      paymentDate: null,
      paymentMethod: null,
      notes: '',
    },
    {
      id: 'B-10003',
      patientId: 'P-10018',
      patientName: 'Robert Johnson',
      billDate: new Date('2025-07-15'),
      dueDate: new Date('2025-08-14'),
      items: [
        {
          description: 'Follow-up Consultation',
          quantity: 1,
          unitPrice: 100,
          amount: 100,
        },
        {
          description: 'Medication',
          quantity: 3,
          unitPrice: 30,
          amount: 90,
        },
      ],
      subtotal: 190,
      tax: 19,
      discount: 19,
      total: 190,
      status: 'Partially Paid',
      paymentDate: new Date('2025-07-15'),
      paymentMethod: 'Cash',
      notes: 'Patient paid $100, remaining $90 due by due date.',
    },
    {
      id: 'B-10004',
      patientId: 'P-10045',
      patientName: 'Emily Davis',
      billDate: new Date('2025-07-18'),
      dueDate: new Date('2025-08-17'),
      items: [
        {
          description: 'Consultation Fee',
          quantity: 1,
          unitPrice: 150,
          amount: 150,
        },
        {
          description: 'X-Ray',
          quantity: 1,
          unitPrice: 250,
          amount: 250,
        },
      ],
      subtotal: 400,
      tax: 40,
      discount: 0,
      total: 440,
      status: 'Overdue',
      paymentDate: null,
      paymentMethod: null,
      notes: '',
    },
  ];
  
  // Mock patients data (in a real app, this would come from an API)
  const mockPatients = [
    { id: 'P-10025', name: 'John Doe' },
    { id: 'P-10032', name: 'Jane Smith' },
    { id: 'P-10018', name: 'Robert Johnson' },
    { id: 'P-10045', name: 'Emily Davis' },
    { id: 'P-10050', name: 'Michael Brown' },
    { id: 'P-10060', name: 'Sarah Wilson' },
    { id: 'P-10075', name: 'David Miller' },
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
  const patientOptions = mockPatients.map(patient => ({
    value: patient.id,
    label: `${patient.name} (${patient.id})`,
  }));
  
  // Fetch bills data
  useEffect(() => {
    // Simulate API call with setTimeout
    setIsLoading(true);
    setTimeout(() => {
      setBills(mockBills);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Filter bills based on search query
  useEffect(() => {
    if (bills.length === 0) return;
    
    const filtered = bills.filter(bill => {
      const query = searchQuery.toLowerCase();
      return query === '' || 
        bill.patientName.toLowerCase().includes(query) ||
        bill.id.toLowerCase().includes(query) ||
        bill.status.toLowerCase().includes(query);
    });
    
    setFilteredBills(filtered);
  }, [bills, searchQuery]);
  
  // Table columns for bills
  const billColumns = [
    { header: 'Bill #', accessor: 'id' },
    { 
      header: 'Patient', 
      accessor: 'patientName',
      cell: (row) => (
        <div className="patient-info">
          <span className="patient-name">{row.patientName}</span>
          <span className="patient-id">{row.patientId}</span>
        </div>
      ),
    },
    { 
      header: 'Date', 
      accessor: 'billDate',
      cell: (row) => (
        <span>{new Date(row.billDate).toLocaleDateString()}</span>
      ),
    },
    { 
      header: 'Due Date', 
      accessor: 'dueDate',
      cell: (row) => (
        <span>{new Date(row.dueDate).toLocaleDateString()}</span>
      ),
    },
    { 
      header: 'Amount', 
      accessor: 'total',
      cell: (row) => (
        <span className="bill-amount">${row.total.toFixed(2)}</span>
      ),
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => {
        let variant = 'primary';
        
        switch (row.status) {
          case 'Paid':
            variant = 'success';
            break;
          case 'Partially Paid':
            variant = 'warning';
            break;
          case 'Pending':
            variant = 'primary';
            break;
          case 'Overdue':
            variant = 'danger';
            break;
          default:
            variant = 'primary';
        }
        
        return (
          <Badge 
            variant={variant}
            pill
          >
            {row.status}
          </Badge>
        );
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
                aria-label="Record payment"
              >
                <FaCheck /> Pay
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleEditBill(row)}
                aria-label="Edit bill"
              >
                <FaEdit />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDeleteBill(row)}
                aria-label="Delete bill"
              >
                <FaTrash />
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handlePrintBill(row)}
            aria-label="Print bill"
          >
            <FaPrint />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEmailBill(row)}
            aria-label="Email bill"
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
  
  // Handle new bill button click
  const handleNewBill = () => {
    setFormData({
      patientId: '',
      patientName: '',
      billDate: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      items: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          amount: 0,
        },
      ],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      notes: '',
    });
    setIsNewBillModalOpen(true);
  };
  
  // Handle edit bill button click
  const handleEditBill = (bill) => {
    setCurrentBill(bill);
    setIsEditBillModalOpen(true);
  };
  
  // Handle delete bill button click
  const handleDeleteBill = (bill) => {
    setCurrentBill(bill);
    setIsDeleteBillModalOpen(true);
  };
  
  // Handle payment button click
  const handlePayment = (bill) => {
    setCurrentBill(bill);
    setPaymentData({
      amount: bill.total,
      method: 'Cash',
      reference: '',
      date: new Date(),
      notes: '',
    });
    setIsPaymentModalOpen(true);
  };
  
  // Handle print bill button click
  const handlePrintBill = (bill) => {
    // In a real app, this would open a print dialog or generate a PDF
    alert(`Printing bill ${bill.id} for ${bill.patientName}`);
  };
  
  // Handle email bill button click
  const handleEmailBill = (bill) => {
    // In a real app, this would send an email to the patient
    alert(`Emailing bill ${bill.id} to ${bill.patientName}`);
  };
  
  // Handle payment form input change
  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };
  
  // Handle delete bill confirmation
  const handleDeleteBillConfirm = () => {
    // In a real app, this would send the data to an API
    const updatedBills = bills.filter(bill => bill.id !== currentBill.id);
    
    setBills(updatedBills);
    setIsDeleteBillModalOpen(false);
    
    // Show success message
    alert('Bill deleted successfully!');
  };
  
  // Handle payment form submission
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    const updatedBills = bills.map(bill => {
      if (bill.id === currentBill.id) {
        // Determine the new status based on the payment amount
        let newStatus = 'Paid';
        if (parseFloat(paymentData.amount) < bill.total) {
          newStatus = 'Partially Paid';
        }
        
        return {
          ...bill,
          status: newStatus,
          paymentDate: paymentData.date,
          paymentMethod: paymentData.method,
          notes: bill.notes + (bill.notes ? '\n' : '') + paymentData.notes,
        };
      }
      return bill;
    });
    
    setBills(updatedBills);
    setIsPaymentModalOpen(false);
    
    // Show success message
    alert('Payment recorded successfully!');
  };
  
  // Handle new bill form submission
  const handleNewBillSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    const newBill = {
      id: `B-${10000 + bills.length + 1}`,
      patientId: formData.patientId,
      patientName: formData.patientName,
      billDate: formData.billDate,
      dueDate: formData.dueDate,
      items: formData.items,
      subtotal: formData.subtotal,
      tax: formData.tax,
      discount: formData.discount,
      total: formData.total,
      status: 'Pending',
      paymentDate: null,
      paymentMethod: null,
      notes: formData.notes,
    };
    
    setBills([...bills, newBill]);
    setIsNewBillModalOpen(false);
    
    // Show success message
    alert('Bill created successfully!');
  };
  
  return (
    <div className="billing">
      <h1>
        <FaFileInvoiceDollar className="page-icon" />
        Billing
      </h1>
      
      <div className="billing-controls">
        <Card className="search-card">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search bills..."
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
          >
            <FaPlus /> New Bill
          </Button>
        </Card>
      </div>
      
      <Card title="Bills" className="bills-card">
        {isLoading ? (
          <div className="loading">Loading bills...</div>
        ) : filteredBills.length > 0 ? (
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
      
      {/* New Bill Modal */}
      <Modal
        isOpen={isNewBillModalOpen}
        onClose={() => setIsNewBillModalOpen(false)}
        title="Create New Bill"
      >
        <form onSubmit={handleNewBillSubmit}>
          <div className="form-row">
            <Select
              label="Patient"
              name="patientId"
              value={formData.patientId}
              onChange={(e) => {
                const patientId = e.target.value;
                const patient = mockPatients.find(p => p.id === patientId);
                setFormData({
                  ...formData,
                  patientId,
                  patientName: patient ? patient.name : '',
                });
              }}
              options={patientOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <DatePicker
              label="Bill Date"
              name="billDate"
              value={formData.billDate}
              onChange={(date) => setFormData({ ...formData, billDate: date })}
              required
            />
            
            <DatePicker
              label="Due Date"
              name="dueDate"
              value={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
              minDate={new Date()}
              required
            />
          </div>
          
          <p>Add items, set quantities, and prices to generate a bill.</p>
          
          <Modal.Footer
            onCancel={() => setIsNewBillModalOpen(false)}
            onConfirm={handleNewBillSubmit}
            confirmText="Create Bill"
          />
        </form>
      </Modal>
      
      {/* Delete Bill Modal */}
      <Modal
        isOpen={isDeleteBillModalOpen}
        onClose={() => setIsDeleteBillModalOpen(false)}
        title="Delete Bill"
        size="sm"
      >
        <p>Are you sure you want to delete bill {currentBill?.id} for {currentBill?.patientName}?</p>
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
      >
        <form onSubmit={handlePaymentSubmit}>
          <div className="form-row">
            <Input
              label="Amount ($)"
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
              name="method"
              value={paymentData.method}
              onChange={handlePaymentInputChange}
              options={paymentMethodOptions}
              required
            />
          </div>
          
          <div className="form-row">
            <Input
              label="Reference Number"
              name="reference"
              value={paymentData.reference}
              onChange={handlePaymentInputChange}
              placeholder="Credit card/check/transaction number"
            />
          </div>
          
          <div className="form-row">
            <DatePicker
              label="Payment Date"
              name="date"
              value={paymentData.date}
              onChange={(date) => setPaymentData({ ...paymentData, date })}
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
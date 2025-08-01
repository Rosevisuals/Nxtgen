import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFileInvoiceDollar, FaArrowLeft } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { jsPDF } from 'jspdf';
import './new-bill.css';

const NewBill = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patient_id: '',
    patient_name: '',
    service_name: '',
    amount: '',
    date_issued: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [patients, setPatients] = useState([]);
  const [errors, setErrors] = useState({});

  // Mock patients data
  const mockPatients = [
    { patient_id: 1, full_Name: 'Mark Leewe' },
    { patient_id: 2, full_Name: 'Tom Cruse' },
  ];

  // Patient options for select
  const patientOptions = patients.map(patient => ({
    value: patient.patient_id,
    label: `${patient.full_Name} (ID: ${patient.patient_id})`,
  }));

  // Fetch patients (mock for now, API-ready)
  useEffect(() => {
    // TODO: Uncomment and configure for API integration
    /*
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
    const API_KEY = process.env.REACT_APP_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY || localStorage.getItem('authToken')}`,
    };

    const fetchPatients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/patients`, { headers });
        if (!response.ok) throw new Error('Failed to fetch patients.');
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchPatients();
    */

    // Mock data loading
    setTimeout(() => {
      setPatients(mockPatients);
    }, 500);
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'patient_id') {
      const patient = patients.find(p => p.patient_id.toString() === value);
      setFormData({
        ...formData,
        patient_id: value,
        patient_name: patient ? patient.full_Name : '',
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.patient_id) newErrors.patient_id = 'Patient is required';
    if (!formData.service_name) newErrors.service_name = 'Service name is required';
    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number';
    }
    if (!formData.date_issued) newErrors.date_issued = 'Date is required';
    return newErrors;
  };

  // Generate PDF
  const generatePDF = (billData) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Hospital Bill', 20, 20);
    doc.setFontSize(12);
    doc.text(`Bill ID: B-${billData.bill_id}`, 20, 40);
    doc.text(`Patient: ${billData.patient_name} (ID: ${billData.patient_id})`, 20, 50);
    doc.text(`Service: ${billData.service_name}`, 20, 60);
    doc.text(`Amount: ${parseFloat(billData.amount).toLocaleString()} UGX`, 20, 70);
    doc.text(`Date Issued: ${new Date(billData.date_issued).toLocaleDateString()}`, 20, 80);
    if (billData.notes) {
      doc.text('Notes:', 20, 90);
      doc.text(billData.notes, 20, 100, { maxWidth: 170 });
    }
    doc.save(`bill_B-${billData.bill_id}.pdf`);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const billData = {
      bill_id: Math.floor(Math.random() * 10000) + 1, // Temporary ID for mock
      patient_id: formData.patient_id,
      patient_name: formData.patient_name,
      service_name: formData.service_name,
      amount: parseFloat(formData.amount),
      date_issued: formData.date_issued,
      method_of_payment: null,
      status: 'Pending',
      notes: formData.notes,
    };

    // TODO: Replace with actual API call
    /*
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';
    const API_KEY = process.env.REACT_APP_API_KEY;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY || localStorage.getItem('authToken')}`,
    };

    fetch(`${API_BASE_URL}/bills`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        patient_id: billData.patient_id,
        patient_name: billData.patient_name,
        service_name: billData.service_name,
        amount: billData.amount,
        date_issued: billData.date_issued,
        status: billData.status,
        notes: billData.notes,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create bill.');
        return res.json();
      })
      .then(data => {
        generatePDF(data);
        toast.success('Bill created successfully!');
        navigate('/Billing');
      })
      .catch(err => toast.error(err.message));
    */

    // Mock submission
    generatePDF(billData);
    toast.success('Bill created successfully!');
    navigate('/Billing');
  };

  // Handle back navigation
  const handleBack = () => navigate('/Billing');

  // Handle keyboard navigation
  const handleKeyDown = (e, handler) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };

  return (
    <div className="new-bill">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="new-bill-header">
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
          <FaFileInvoiceDollar className="mr-2" /> Create New Bill
        </h1>
      </div>
      <Card className="bill-card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <Select
              label="Patient"
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              options={patientOptions}
              required
            />
            {errors.patient_id && <span className="error-text">{errors.patient_id}</span>}
          </div>
          <div className="form-row">
            <Input
              label="Service Name"
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              placeholder="e.g., Consultation, Blood Test"
              required
            />
            {errors.service_name && <span className="error-text">{errors.service_name}</span>}
          </div>
          <div className="form-row">
            <Input
              label="Amount (UGX)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
            {errors.amount && <span className="error-text">{errors.amount}</span>}
          </div>
          <div className="form-row">
            <Input
              label="Date Issued"
              name="date_issued"
              type="date"
              value={formData.date_issued}
              onChange={handleChange}
              required
            />
            {errors.date_issued && <span className="error-text">{errors.date_issued}</span>}
          </div>
          <div className="form-row">
            <Input
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes about the bill"
              multiline
              rows={3}
            />
          </div>
          <div className="form-actions">
            <Button type="submit" variant="primary" aria-label="Create bill">
              Create & Generate PDF
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleBack}
              aria-label="Cancel billing"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewBill;
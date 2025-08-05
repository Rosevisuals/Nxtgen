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
import { apiFetch } from '../utils/api';
import './centered-layout.css';

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



  // Patient options for select
  const patientOptions = patients.map(patient => ({
    value: patient.patient_id,
    label: `${patient.full_Name} (ID: ${patient.patient_id})`,
  }));

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await apiFetch('/patients');
        setPatients(data || []);
      } catch (error) {
        console.error('Error fetching patients:', error);
        toast.error('Failed to load patients');
      }
    };
    fetchPatients();
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const billData = {
      patient_id: formData.patient_id,
      patient_name: formData.patient_name,
      service_name: formData.service_name,
      amount: parseFloat(formData.amount),
      date_issued: formData.date_issued,
      status: 'Pending',
      notes: formData.notes,
    };

    try {
      const createdBill = await apiFetch('/billing', {
        method: 'POST',
        body: JSON.stringify(billData)
      });
      
      generatePDF({ ...billData, bill_id: createdBill.bill_id });
      toast.success('Bill created successfully!');
      setTimeout(() => {
        navigate('/Billing');
      }, 1500);
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error('Failed to create bill');
    }
  };

  const handleCancel = () => {
    toast.info('Bill creation cancelled');
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
    <div className="centered-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="centered-content">
        <div className="page-header">
          <div className="header-actions">
            <button
              onClick={handleBack}
              onKeyDown={(e) => handleKeyDown(e, handleBack)}
              aria-label="Go back"
              className="btn-outline"
            >
              <FaArrowLeft className="mr-1" /> Back
            </button>
          </div>
          <h1 className="page-title">
            <FaFileInvoiceDollar className="mr-2" /> Create New Bill
          </h1>
        </div>
        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group">
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
            <div className="form-group full-width">
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
            <div className="form-actions full-width">
              <button type="submit" className="btn-success" aria-label="Create bill">
                Create & Generate PDF
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="btn-outline"
                aria-label="Cancel billing"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewBill;
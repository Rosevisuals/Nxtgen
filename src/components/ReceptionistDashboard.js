import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaUserPlus, FaSearch, FaClock, FaUserCheck, FaClipboardList, FaFileInvoiceDollar, FaMoneyBillWave, FaExclamationTriangle, FaPrint, FaEnvelope } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useNavigate } from 'react-router-dom';
import { getTodayAppointments, updateAppointmentStatus } from '../services/receptionistService';
import { apiFetch } from '../utils/api';
import './centered-layout.css';
import './receptionist-dashboard.css';
import './premium-billing.css';
import './premium-billing.css';
import './premium-billing.css';

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [date] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [recentBills, setRecentBills] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const receptionistName = localStorage.getItem('user_name') || 'Receptionist';

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch appointments
        const appointmentsData = await getTodayAppointments();
        setAppointments(appointmentsData || []);
        
        // Fetch billing data with error handling
        try {
          console.log('Fetching billing data from:', 'http://localhost:5000/api/billing');
          const billsData = await apiFetch('/billing');
          console.log('Raw billing data received:', billsData);
          
          // Handle different response formats
          let bills = [];
          if (Array.isArray(billsData)) {
            bills = billsData;
          } else if (billsData && Array.isArray(billsData.data)) {
            bills = billsData.data;
          } else if (billsData && billsData.success === false) {
            console.log('Billing API returned success=false, using empty array');
            bills = [];
          }
          
          console.log('Processed bills array:', bills);
          console.log('Sample bill structure:', bills[0]);
          
          // Filter pending bills (status = 'unpaid')
          const pending = bills.filter(bill => {
            const isPending = bill.status === 'unpaid' || bill.status === 'Pending';
            if (isPending) {
              console.log('Found pending bill:', bill.bill_id, bill.status, bill.amount);
            }
            return isPending;
          });
          
          // Filter paid bills
          const paid = bills.filter(bill => bill.status === 'paid' || bill.status === 'Paid');
          
          // Filter recent bills (last 7 days)
          const recent = bills.filter(bill => {
            const billDate = new Date(bill.date_issued);
            const today = new Date();
            const diffTime = Math.abs(today - billDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          }).sort((a, b) => new Date(b.date_issued) - new Date(a.date_issued));
          
          setPendingBills(pending);
          setRecentBills(recent.slice(0, 10));
          
          console.log('=== BILLING SUMMARY ===');
          console.log('Total bills:', bills.length);
          console.log('Pending bills:', pending.length);
          console.log('Paid bills:', paid.length);
          console.log('Recent bills (7 days):', recent.length);
          console.log('Pending bill IDs:', pending.map(b => b.bill_id));
          console.log('Paid bill IDs:', paid.map(b => b.bill_id));
        } catch (billingError) {
          console.error('Error fetching billing data:', billingError);
          console.error('Error details:', billingError.message);
          setPendingBills([]);
          setRecentBills([]);
          // Don't show error toast for billing - it's not critical for appointments
        }
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load appointments data');
        setAppointments([]);
        setPendingBills([]);
        setRecentBills([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, [navigate]);

  // Filter appointments for today and next 3 hours
  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.appointment_date);
    return appointmentDate.toDateString() === date.toDateString();
  });

  const upcomingAppointments = todayAppointments.filter(appointment => {
    const appointmentTime = new Date(appointment.appointment_date);
    const currentTime = new Date();
    const threeHoursLater = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
    return appointmentTime >= currentTime && 
           appointmentTime <= threeHoursLater && 
           appointment.status !== 'Rejected' && appointment.status !== 'Cancelled';
  });

  const checkedInPatients = todayAppointments.filter(appointment => 
    appointment.status === 'Checked In'
  );

  const appointmentColumns = [
    { 
      header: 'Time', 
      accessor: 'appointment_date',
      cell: (row) => (
        <div className="appointment-time">
          <FaClock className="time-icon" />
          <span>{new Date(row.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      ),
    },
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
      header: 'Doctor', 
      accessor: 'doctor_name',
      cell: (row) => {
        const doctorName = row.doctor_name || row.staff_name;
        return doctorName ? `Dr. ${doctorName}` : 'Unassigned';
      }
    },
    { header: 'Department', accessor: 'department_name' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => {
        let variant = 'primary';
        switch (row.status) {
          case 'Pending': variant = 'warning'; break;
          case 'Approved': 
          case 'Scheduled': variant = 'success'; break;
          case 'Checked In': variant = 'info'; break;
          case 'Completed': variant = 'primary'; break;
          case 'Rejected':
          case 'Cancelled': variant = 'danger'; break;
          default: variant = 'secondary';
        }
        return <span className={`badge badge-${variant === 'warning' ? 'warning' : variant === 'success' ? 'success' : variant === 'info' ? 'primary' : variant === 'danger' ? 'danger' : 'primary'}`}>{row.status}</span>;
      },
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          {(row.status === 'Approved' || row.status === 'Scheduled') && (
            <button 
              className="btn btn-success btn-sm"
              onClick={() => handleCheckIn(row)}
              aria-label={`Check in ${row.patient_name}`}
            >
              <FaUserCheck /> Check In
            </button>
          )}
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => handleViewPatient(row)}
            aria-label={`View patient ${row.patient_name}`}
          >
            View
          </button>
        </div>
      ),
    },
  ];

  const handleCheckIn = async (appointment) => {
    try {
      await updateAppointmentStatus(appointment.appointment_id, 'Checked In');
      setAppointments(prev => prev.map(appt => 
        appt.appointment_id === appointment.appointment_id ? { ...appt, status: 'Checked In' } : appt
      ));
      toast.success(`Checked in ${appointment.patient_name}`);
    } catch (error) {
      console.error('Error checking in patient:', error);
      toast.error('Failed to check in patient');
    }
  };

  const handleViewPatient = (appointment) => {
    if (!appointment.patient_id) {
      toast.error('Invalid patient information');
      return;
    }
    // For now, show patient details in a modal or navigate to patient search
    toast.info(`Viewing details for ${appointment.patient_name}`);
    navigate(`/PatientSearch?patientId=${appointment.patient_id}`);
  };

  const handleNewPatient = () => {
    navigate('/PatientRegister');
  };

  const handleNewAppointment = () => {
    navigate('/NewAppointment');
  };

  const handlePatientSearch = () => {
    navigate('/PatientSearch');
  };

  const handleQuickSearch = (searchTerm) => {
    if (searchTerm.trim()) {
      navigate(`/PatientSearch?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/PatientSearch');
    }
  };

  const handlePrintBill = (bill) => {
    const printContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 700px; margin: 0 auto; padding: 30px; border: 1px solid #ddd; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px solid #007bff; padding-bottom: 20px;">
          <img src="https://via.placeholder.com/150" alt="Hospital Logo" style="width: 100px; margin-bottom: 10px;" />
          <h1 style="color: #007bff; margin: 0;">Premium Hospital</h1>
          <h2 style="color: #555; margin: 10px 0;">Bill #${bill.bill_id}</h2>
        </div>
        <div style="margin: 30px 0; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <p style="margin: 5px 0;"><strong>Patient:</strong> ${bill.patient_name}</p>
          <p style="margin: 5px 0;"><strong>Patient ID:</strong> ${bill.patient_id}</p>
          <p style="margin: 5px 0;"><strong>Service:</strong> ${bill.service_name}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date(bill.date_issued).toLocaleDateString()}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> ${bill.status.toUpperCase()}</p>
        </div>
        <div style="text-align: center; margin: 40px 0; padding: 20px; background: #e9ecef; border-radius: 8px;">
          <h2 style="color: #333; margin: 0;">Amount Due</h2>
          <h1 style="color: #dc3545; margin: 10px 0; font-size: 2.5em;">${bill.amount?.toLocaleString()} UGX</h1>
        </div>
        <div style="text-align: center; margin-top: 50px; font-size: 12px; color: #777;">
          <p>Thank you for choosing our services</p>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Bill ${bill.bill_id}</title></head><body>${printContent}</body></html>`);
    printWindow.document.close();
    printWindow.print();
    toast.success(`Bill ${bill.bill_id} sent to printer`);
  };

  const handleEmailBill = (bill) => {
    const subject = `Hospital Bill #${bill.bill_id} - ${bill.patient_name}`;
    const body = `Dear ${bill.patient_name},\n\nYour hospital bill is ready:\n\n📋 Bill ID: ${bill.bill_id}\n🏥 Service: ${bill.service_name}\n💰 Amount: ${bill.amount?.toLocaleString()} UGX\n📅 Date: ${new Date(bill.date_issued).toLocaleDateString()}\n📊 Status: ${bill.status.toUpperCase()}\n\nPlease visit reception to complete payment.\n\nThank you,\nHospital Administration`;
    const mailtoLink = `mailto:${bill.patient_email || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink);
    toast.success(`Email template opened for ${bill.patient_name}`);
  };

  const handleViewBilling = () => {
    navigate('/billing');
  };

  const handleProcessPayment = (bill) => {
    // Navigate to billing page with specific bill
    navigate(`/billing?billId=${bill.bill_id}`);
  };

  const refreshDashboardData = async () => {
    try {
      const billsData = await apiFetch('/billing');
      
      // Handle different response formats
      let bills = [];
      if (Array.isArray(billsData)) {
        bills = billsData;
      } else if (billsData && Array.isArray(billsData.data)) {
        bills = billsData.data;
      }
      
      const pending = bills.filter(bill => bill.status === 'unpaid' || bill.status === 'Pending');
      const recent = bills.filter(bill => {
        const billDate = new Date(bill.date_issued);
        const today = new Date();
        const diffTime = Math.abs(today - billDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      }).sort((a, b) => new Date(b.date_issued) - new Date(a.date_issued));
      
      setPendingBills(pending);
      setRecentBills(recent.slice(0, 10));
      
      console.log('Refreshed - Pending:', pending.length, 'Recent:', recent.length);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Calculate billing statistics with debugging
  const totalPendingAmount = pendingBills.reduce((sum, bill) => {
    const amount = parseFloat(bill.amount) || 0;
    console.log(`Adding pending bill ${bill.bill_id}: ${amount}`);
    return sum + amount;
  }, 0);
  
  const paidBills = recentBills.filter(bill => bill.status === 'paid' || bill.status === 'Paid');
  const totalPaidAmount = paidBills.reduce((sum, bill) => sum + (parseFloat(bill.amount) || 0), 0);
  
  const todaysBills = recentBills.filter(bill => {
    const billDate = new Date(bill.date_issued);
    return billDate.toDateString() === date.toDateString();
  });
  
  console.log('=== DASHBOARD STATS ===');
  console.log('Pending bills count:', pendingBills.length);
  console.log('Total pending amount:', totalPendingAmount);
  console.log('Paid bills count:', paidBills.length);
  console.log('Total paid amount:', totalPaidAmount);



  if (isLoading) {
    return (
      <div className="receptionist-dashboard loading">
        <p>Loading dashboard...</p>
      </div>
    );
  }



  return (
    <div className="centered-container">
      <div className="centered-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="page-header">
          <h1 className="page-title">
            <FaClipboardList /> Receptionist Dashboard
          </h1>
          <p className="page-subtitle">Welcome Back, {receptionistName}</p>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <FaCalendarAlt /> {date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-4">
                <button className="btn btn-primary" onClick={handleNewPatient}>
                  <FaUserPlus /> Register Patient
                </button>
              </div>
              <div className="col-4">
                <button className="btn btn-primary" onClick={handleNewAppointment}>
                  <FaCalendarAlt /> New Appointment
                </button>
              </div>
              <div className="col-4">
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <input 
                    type="text" 
                    placeholder="Search patient..." 
                    className="form-input" 
                    style={{flex: 1}}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleQuickSearch(e.target.value);
                      }
                    }}
                  />
                  <button className="btn btn-primary" onClick={handlePatientSearch}>
                    <FaSearch />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-3">
            <div className="card">
              <div className="card-body text-center">
                <FaCalendarAlt style={{fontSize: '2rem', color: '#2563eb', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{todayAppointments.length}</h3>
                <p style={{color: '#64748b', margin: 0}}>Today's Appointments</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card">
              <div className="card-body text-center">
                <FaUserCheck style={{fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{checkedInPatients.length}</h3>
                <p style={{color: '#64748b', margin: 0}}>Checked In</p>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card">
              <div className="card-body text-center">
                <FaFileInvoiceDollar style={{fontSize: '2rem', color: '#dc2626', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{pendingBills.length}</h3>
                <p style={{color: '#64748b', margin: 0}}>Pending Bills</p>
                <small style={{color: '#94a3b8', fontSize: '0.75rem'}}>Status: unpaid</small>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className="card">
              <div className="card-body text-center">
                <FaMoneyBillWave style={{fontSize: '2rem', color: '#059669', marginBottom: '0.5rem'}} />
                <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0'}}>{totalPendingAmount.toLocaleString()}</h3>
                <p style={{color: '#64748b', margin: 0}}>Pending Amount (UGX)</p>
                <small style={{color: '#94a3b8', fontSize: '0.75rem'}}>Paid: {paidBills.length} bills</small>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📅 Today's Appointments</h2>
            {upcomingAppointments.length > 0 && (
              <span className="badge badge-warning" style={{marginLeft: '1rem'}}>
                {upcomingAppointments.length} upcoming in next 3 hours
              </span>
            )}
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    {appointmentColumns.map((col, index) => (
                      <th key={index}>{col.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.map((row, index) => (
                    <tr key={index} className={upcomingAppointments.includes(row) ? 'table-row-highlight' : ''}>
                      {appointmentColumns.map((col, colIndex) => (
                        <td key={colIndex}>
                          {col.cell ? col.cell(row) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {(pendingBills.length > 0 || recentBills.length > 0) && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <FaFileInvoiceDollar style={{color: '#2563eb', marginRight: '0.5rem'}} />
                Recent Bills
              </h2>
              <button 
                className="btn btn-primary btn-sm"
                onClick={handleViewBilling}
                style={{marginLeft: 'auto'}}
              >
                View All Bills
              </button>
            </div>
            <div className="card-body">
              <div className="row">
                {recentBills.slice(0, 3).map((bill, index) => (
                  <div key={index} className="col-4">
                    <div className="premium-bill-card">
                    <div className="bill-header">
                    <div className="bill-id">#{bill.bill_id}</div>
                    <div className={`bill-status-premium status-${bill.status}`}>
                    {bill.status === 'unpaid' ? 'Unpaid' : 'Paid'}
                    </div>
                    </div>
                    <div className="bill-patient-info">
                    <div className="patient-name-premium">{bill.patient_name}</div>
                    </div>
                    <div className="bill-amount-premium">
                    {bill.amount?.toLocaleString()} UGX
                    </div>
                    <div className="bill-actions-premium">
                    <button 
                    className="btn-premium btn-view-premium"
                    onClick={() => handleViewBilling(bill)}
                    >
                    View Details
                    </button>
                    </div>
                    </div>
                  </div>
                ))}
              </div>
              {recentBills.length > 3 && (
                <div className="text-center" style={{marginTop: '1rem'}}>
                  <p style={{color: '#64748b'}}>Showing 3 of {recentBills.length} recent bills</p>
                  <button className="btn btn-outline" onClick={handleViewBilling}>
                    View All Bills
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {todaysBills.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                <FaFileInvoiceDollar style={{color: '#059669', marginRight: '0.5rem'}} />
                Today's Bills Generated
              </h2>
            </div>
            <div className="card-body">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Bill ID</th>
                      <th>Patient</th>
                      <th>Service</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysBills.slice(0, 5).map((bill, index) => (
                      <tr key={index}>
                        <td>{bill.bill_id}</td>
                        <td>
                          <div className="patient-info">
                            <span className="patient-name">{bill.patient_name}</span>
                            <span className="patient-id">ID: {bill.patient_id}</span>
                          </div>
                        </td>
                        <td>{bill.service_name}</td>
                        <td>{bill.amount?.toLocaleString()} UGX</td>
                        <td>
                          <span className={`badge badge-${bill.status === 'paid' ? 'success' : bill.status === 'partial' ? 'warning' : 'danger'}`}>
                            {bill.status === 'unpaid' ? 'Unpaid' : bill.status === 'paid' ? 'Paid' : 'Partial'}
                          </span>
                        </td>
                        <td>{new Date(bill.date_issued).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
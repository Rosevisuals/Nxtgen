import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaPlus, FaEye, FaTimes, FaFileMedical } from 'react-icons/fa';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';

/**
 * Appointments Component
 * 
 * Displays a list of the patient's appointments.
 */
const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Mock appointments data (in a real app, this would come from an API)
const mockAppointments = [
  // Upcoming appointments
  {
    id: 1,
    date: new Date('2025-07-30'),
    time: '10:00 AM',
    doctor: 'Dr. John Smith',
    department: 'Cardiology',
    type: 'Check-up',
    status: 'Scheduled',
    reason: 'Regular check-up for hypertension',
    notes: '',
  },
  {
    id: 2,
    date: new Date('2025-08-15'),
    time: '02:30 PM',
    doctor: 'Dr. Emily Johnson',
    department: 'Neurology',
    type: 'Consultation',
    status: 'Scheduled',
    reason: 'Recurring headaches',
    notes: '',
  },
  {
    id: 3,
    date: new Date('2025-09-05'),
    time: '11:30 AM',
    doctor: 'Dr. John Smith',
    department: 'Cardiology',
    type: 'Follow-up',
    status: 'Pending Confirmation',
    reason: 'Follow-up on medication adjustment',
    notes: 'Waiting for doctor confirmation',
  },
  
  // Past appointments
  {
    id: 4,
    date: new Date('2025-07-20'),
    time: '09:00 AM',
    doctor: 'Dr. John Smith',
    department: 'Cardiology',
    type: 'Check-up',
    status: 'Completed',
    reason: 'Regular check-up for hypertension',
    notes: 'Blood pressure remains elevated. Adjusting medication dosage.',
    diagnosis: 'Hypertension',
    prescription: 'Lisinopril 20mg, once daily',
    followUp: 'Schedule follow-up in 1 month',
  },
  {
    id: 5,
    date: new Date('2025-06-15'),
    time: '11:30 AM',
    doctor: 'Dr. John Smith',
    department: 'Cardiology',
    type: 'Follow-up',
    status: 'Completed',
    reason: 'Follow-up on diabetes management',
    notes: 'Blood sugar levels improved. Continue with current medication.',
    diagnosis: 'Type 2 Diabetes',
    prescription: 'Metformin 500mg, twice daily',
    followUp: 'Schedule follow-up in 3 months',
  },
  {
    id: 6,
    date: new Date('2025-05-10'),
    time: '03:00 PM',
    doctor: 'Dr. Emily Johnson',
    department: 'Neurology',
    type: 'Consultation',
    status: 'Completed',
    reason: 'Recurring headaches',
    notes: 'Recommended lifestyle changes and stress management techniques.',
    diagnosis: 'Tension headaches',
    prescription: 'Ibuprofen 400mg as needed for pain',
    followUp: 'Return if symptoms persist or worsen',
  },
  {
    id: 7,
    date: new Date('2025-04-22'),
    time: '01:30 PM',
    doctor: 'Dr. Sarah Wilson',
    department: 'Orthopedics',
    type: 'Consultation',
    status: 'Cancelled',
    reason: 'Knee pain',
    notes: 'Patient cancelled due to scheduling conflict',
  },
];

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 500);
  }, []); // no dependencies needed

  // ... rest of your code
};
  
  // Fetch appointments data
  useEffect(() => {
    // Simulate API call with setTimeout
    setIsLoading(true);
    setTimeout(() => {
      setAppointments(mockAppointments);
      setIsLoading(false);
    }, 500);
  }, [mockAppointments]); // mockAppointments is a constant and does not need to be included in the dependency array
  
  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDate = new Date(appointment.date);
    appointmentDate.setHours(0, 0, 0, 0);
    
    if (activeTab === 'upcoming') {
      return appointmentDate >= today && 
             (appointment.status === 'Scheduled' || appointment.status === 'Pending Confirmation');
    } else if (activeTab === 'past') {
      return appointmentDate < today || 
             appointment.status === 'Completed' || 
             appointment.status === 'Cancelled';
    }
    
    return true;
  });
  
  // Sort appointments by date
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (activeTab === 'upcoming') {
      return new Date(a.date) - new Date(b.date);
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  });
  
  // Table columns for appointments
  const appointmentColumns = [
    { 
      header: 'Date & Time', 
      accessor: 'date',
      cell: (row) => (
        <div className="appointment-datetime">
          <div className="appointment-date">
            {new Date(row.date).toLocaleDateString()}
          </div>
          <div className="appointment-time">
            {row.time}
          </div>
        </div>
      ),
    },
    { header: 'Doctor', accessor: 'doctor' },
    { header: 'Department', accessor: 'department' },
    { header: 'Type', accessor: 'type' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => {
        let variant = 'primary';
        
        switch (row.status) {
          case 'Scheduled':
            variant = 'primary';
            break;
          case 'Pending Confirmation':
            variant = 'warning';
            break;
          case 'Completed':
            variant = 'success';
            break;
          case 'Cancelled':
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewDetails(row)}
            aria-label="View appointment details"
          >
            <FaEye />
          </Button>
          
          {(row.status === 'Scheduled' || row.status === 'Pending Confirmation') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleCancelAppointment(row)}
              aria-label="Cancel appointment"
            >
              <FaTimes />
            </Button>
          )}
        </div>
      ),
    },
  ];
  
  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Handle request appointment button click
  const handleRequestAppointment = () => {
    navigate('/patient/appointments/request');
  };
  
  // Handle view appointment details
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };
  
  // Handle cancel appointment
  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelModalOpen(true);
  };
  
  // Handle cancel appointment confirmation
  const handleCancelConfirm = () => {
    // In a real app, this would send the data to an API
    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === selectedAppointment.id) {
        return {
          ...appointment,
          status: 'Cancelled',
          notes: appointment.notes + (appointment.notes ? '\n' : '') + 'Cancelled by patient.',
        };
      }
      return appointment;
    });
    
    setAppointments(updatedAppointments);
    setIsCancelModalOpen(false);
    
    // Show success message
    alert('Appointment cancelled successfully!');
  };
  
  // If loading, show loading message
  if (isLoading) {
    return (
      <div className="appointments loading">
        <p>Loading appointments...</p>
      </div>
    );
  }
  
  return (
    <div className="appointments">
      <div className="page-header">
        <h1>
          <FaCalendarAlt className="page-icon" />
          My Appointments
        </h1>
        
        <Button 
          variant="primary" 
          onClick={handleRequestAppointment}
        >
          <FaPlus /> Request Appointment
        </Button>
      </div>
      
      <Card className="appointments-card">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleTabChange('upcoming')}
          >
            Upcoming Appointments
          </button>
          <button 
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => handleTabChange('past')}
          >
            Past Appointments
          </button>
        </div>
        
        {sortedAppointments.length > 0 ? (
          <Table
            columns={appointmentColumns}
            data={sortedAppointments}
            striped
            hoverable
          />
        ) : (
          <div className="no-appointments">
            <p>No {activeTab} appointments found.</p>
            {activeTab === 'upcoming' && (
              <Button 
                variant="primary" 
                onClick={handleRequestAppointment}
              >
                <FaPlus /> Request Appointment
              </Button>
            )}
          </div>
        )}
      </Card>
      
      {/* Cancel Appointment Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Appointment"
        size="sm"
      >
        <p>Are you sure you want to cancel your appointment with {selectedAppointment?.doctor}?</p>
        <p>
          <strong>Date:</strong> {selectedAppointment?.date.toLocaleDateString()}<br />
          <strong>Time:</strong> {selectedAppointment?.time}<br />
          <strong>Department:</strong> {selectedAppointment?.department}
        </p>
        
        <Modal.Footer
          onCancel={() => setIsCancelModalOpen(false)}
          onConfirm={handleCancelConfirm}
          confirmText="Cancel Appointment"
        />
      </Modal>
      
      {/* Appointment Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="appointment-details">
            <div className="details-section">
              <h3>General Information</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{selectedAppointment.date.toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{selectedAppointment.time}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Doctor:</span>
                  <span className="detail-value">{selectedAppointment.doctor}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Department:</span>
                  <span className="detail-value">{selectedAppointment.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{selectedAppointment.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status:</span>
                  <span className="detail-value">
                    <Badge 
                      variant={
                        selectedAppointment.status === 'Scheduled' ? 'primary' :
                        selectedAppointment.status === 'Pending Confirmation' ? 'warning' :
                        selectedAppointment.status === 'Completed' ? 'success' :
                        'danger'
                      }
                      pill
                    >
                      {selectedAppointment.status}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="details-section">
              <h3>Reason for Visit</h3>
              <p>{selectedAppointment.reason || 'No reason provided.'}</p>
            </div>
            
            {selectedAppointment.status === 'Completed' && (
              <>
                <div className="details-section">
                  <h3>Diagnosis</h3>
                  <p>{selectedAppointment.diagnosis || 'No diagnosis provided.'}</p>
                </div>
                
                <div className="details-section">
                  <h3>Doctor's Notes</h3>
                  <p>{selectedAppointment.notes || 'No notes provided.'}</p>
                </div>
                
                <div className="details-section">
                  <h3>Prescription</h3>
                  <div className="prescription-item">
                    <FaFileMedical className="prescription-icon" />
                    <span>{selectedAppointment.prescription || 'No prescription provided.'}</span>
                  </div>
                </div>
                
                <div className="details-section">
                  <h3>Follow-up Instructions</h3>
                  <p>{selectedAppointment.followUp || 'No follow-up instructions provided.'}</p>
                </div>
              </>
            )}
            
            {(selectedAppointment.status === 'Scheduled' || selectedAppointment.status === 'Pending Confirmation') && (
              <div className="modal-actions">
                <Button 
                  variant="danger" 
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    handleCancelAppointment(selectedAppointment);
                  }}
                >
                  <FaTimes /> Cancel Appointment
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Appointments;
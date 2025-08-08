import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Spinner } from 'react-bootstrap';
import { 
  FaFlask, 
  FaSearch, 
  FaEdit, 
  FaEye, 
  FaFileAlt,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaUser,
  FaCalendarAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { apiFetch } from '../utils/api';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './lab-technician-dashboard.css';

const LabTechnicianDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [labRequests, setLabRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal states
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  
  // Form state for updating results
  const [updateData, setUpdateData] = useState({
    results: '',
    status: '',
    notes: ''
  });

  // Mock data - replace with API calls
  const mockLabRequests = [
    {
      labrequest_id: 1,
      patient_name: 'John Doe',
      patient_id: 101,
      doctor_name: 'Dr. Smith',
      technician_name: 'Tech Johnson',
      technician_id: 301,
      Name_of_test: 'Blood Test',
      test_id: 1,
      date_conducted: '2025-08-07',
      notes: 'Routine checkup',
      results: '',
      status: 'Assigned',
      priority: 'Normal',
      created_at: '2025-08-06'
    },
    {
      labrequest_id: 2,
      patient_name: 'Jane Smith',
      patient_id: 102,
      doctor_name: 'Dr. Wilson',
      technician_name: 'Tech Johnson',
      technician_id: 301,
      Name_of_test: 'Urine Test',
      test_id: 2,
      date_conducted: '2025-08-07',
      notes: 'Follow-up test',
      results: 'Normal levels',
      status: 'Completed',
      priority: 'High',
      created_at: '2025-08-05'
    },
    {
      labrequest_id: 3,
      patient_name: 'Robert Johnson',
      patient_id: 103,
      doctor_name: 'Dr. Brown',
      technician_name: 'Tech Johnson',
      technician_id: 301,
      Name_of_test: 'X-Ray',
      test_id: 3,
      date_conducted: '2025-08-08',
      notes: 'Chest X-ray',
      results: 'Preliminary: Clear lungs',
      status: 'In Progress',
      priority: 'Normal',
      created_at: '2025-08-06'
    }
  ];

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log('Loading lab requests for technician from backend...');
        
        // Fetch all lab requests from backend
        const labRequestsResponse = await apiFetch('/lab-requests');
        let labRequestsData = [];
        
        if (Array.isArray(labRequestsResponse)) {
          labRequestsData = labRequestsResponse;
        } else if (labRequestsResponse && Array.isArray(labRequestsResponse.data)) {
          labRequestsData = labRequestsResponse.data;
        }
        
        // Get current technician staff_id from localStorage
        const userId = localStorage.getItem('user_id');
        
        // Filter requests assigned to current technician
        const techRequests = labRequestsData.filter(request => {
          // Match by technician_id or if technician_name matches current user
          return request.technician_id && (
            request.technician_id === parseInt(userId) ||
            request.technician_name?.toLowerCase().includes('lab tech')
          );
        });
        
        console.log('Filtered lab requests for technician:', techRequests);
        setLabRequests(techRequests);
        
        if (techRequests.length > 0) {
          toast.success(`Loaded ${techRequests.length} assigned lab requests`);
        } else {
          toast.info('No lab requests currently assigned to you');
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data from backend:', error);
        toast.error('Failed to load data from backend. Using fallback data.');
        
        // Use mock data as fallback
        const techRequests = mockLabRequests;
        setLabRequests(techRequests);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter lab requests based on search query and status
  useEffect(() => {
    if (labRequests.length === 0) return;
    
    const filtered = labRequests.filter(request => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = query === '' || 
        request.patient_name?.toLowerCase().includes(query) ||
        request.doctor_name?.toLowerCase().includes(query) ||
        request.Name_of_test?.toLowerCase().includes(query);
      
      const matchesStatus = statusFilter === 'All' || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
    
    setFilteredRequests(filtered);
  }, [labRequests, searchQuery, statusFilter]);

  // Handle view request
  const handleViewRequest = (request) => {
    setCurrentRequest(request);
    setShowViewModal(true);
  };

  // Handle update request
  const handleUpdateRequest = (request) => {
    setCurrentRequest(request);
    setUpdateData({
      results: request.results || '',
      status: request.status,
      notes: request.notes || ''
    });
    setShowUpdateModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle update submission
  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      if (!currentRequest) return;
      
      // API call to update lab request
      const result = await apiFetch(`/lab-requests/${currentRequest.labrequest_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          results: updateData.results,
          notes: updateData.notes,
          technician_id: currentRequest.technician_id
        })
      });
      
      console.log('Lab request update result:', result);
      
      // If test is completed, create follow-up appointment
      if (updateData.status === 'Completed' && updateData.results) {
        try {
          // Create follow-up appointment for doctor to review results and prescribe
          const appointmentData = {
            patient_id: currentRequest.patient_id,
            appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            status: 'Approved',
            notes: `Follow-up for lab test results review and prescription (${currentRequest.Name_of_test})`,
            department_id: 1,
            staff_id: currentRequest.doctor_id
          };
          
          await apiFetch('/appointments', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(appointmentData)
          });
          
          toast.success('Lab test completed! Follow-up appointment created for doctor to review results and prescribe medication.');
        } catch (appointmentError) {
          console.error('Error creating follow-up appointment:', appointmentError);
          toast.success('Lab test completed! Please inform the doctor to schedule a follow-up appointment.');
        }
      } else {
        toast.success('Lab request updated successfully!');
      }
      
      setShowUpdateModal(false);
      
      // Reload data
      window.location.reload();
    } catch (error) {
      console.error('Error updating lab request:', error);
      toast.error(`Failed to update lab request: ${error.message || 'Unknown error'}`);
    }
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge bg="success"><FaCheckCircle /> Completed</Badge>;
      case 'assigned':
        return <Badge bg="warning"><FaHourglassHalf /> Assigned</Badge>;
      case 'in progress':
        return <Badge bg="info"><FaHourglassHalf /> In Progress</Badge>;
      case 'cancelled':
        return <Badge bg="danger"><FaTimesCircle /> Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return <Badge bg="danger">{priority}</Badge>;
      case 'urgent':
        return <Badge bg="danger">URGENT</Badge>;
      case 'normal':
        return <Badge bg="primary">{priority}</Badge>;
      case 'low':
        return <Badge bg="secondary">{priority}</Badge>;
      default:
        return <Badge bg="primary">{priority}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="lab-technician-dashboard">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">
                <FaFlask className="me-2" />
                Lab Technician Dashboard
              </h1>
              <p className="text-muted">Manage your assigned laboratory tests and update results</p>
            </div>
            <Button 
              variant="outline-danger" 
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Search lab requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Row>
            <Col sm={6}>
              <Card className="stat-card text-center">
                <Card.Body>
                  <h4>{labRequests.length}</h4>
                  <small>Total Assigned</small>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="stat-card text-center">
                <Card.Body>
                  <h4>{labRequests.filter(r => r.status === 'Assigned').length}</h4>
                  <small>Pending</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Lab Requests Table */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5>Assigned Lab Requests ({filteredRequests.length})</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Patient</th>
                    <th>Test Type</th>
                    <th>Doctor</th>
                    <th>Priority</th>
                    <th>Test Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.labrequest_id}>
                      <td>#{request.labrequest_id}</td>
                      <td>
                        <div>
                          <strong>{request.patient_name}</strong>
                          <br />
                          <small className="text-muted">ID: {request.patient_id}</small>
                        </div>
                      </td>
                      <td>
                        <span className="fw-bold">{request.Name_of_test}</span>
                      </td>
                      <td>{request.doctor_name}</td>
                      <td>{getPriorityBadge(request.priority)}</td>
                      <td>{new Date(request.date_conducted).toLocaleDateString()}</td>
                      <td>{getStatusBadge(request.status)}</td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleViewRequest(request)}
                            title="View Details"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => handleUpdateRequest(request)}
                            title="Update Results"
                          >
                            <FaEdit />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {filteredRequests.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">No lab requests found matching your criteria.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* View Request Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lab Request Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentRequest && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Patient Information</h6>
                  <p><strong>Name:</strong> {currentRequest.patient_name}</p>
                  <p><strong>ID:</strong> {currentRequest.patient_id}</p>
                </Col>
                <Col md={6}>
                  <h6>Test Information</h6>
                  <p><strong>Test Type:</strong> {currentRequest.Name_of_test}</p>
                  <p><strong>Priority:</strong> {getPriorityBadge(currentRequest.priority)}</p>
                  <p><strong>Status:</strong> {getStatusBadge(currentRequest.status)}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h6>Medical Staff</h6>
                  <p><strong>Requesting Doctor:</strong> {currentRequest.doctor_name}</p>
                  <p><strong>Assigned Technician:</strong> {currentRequest.technician_name}</p>
                </Col>
                <Col md={6}>
                  <h6>Timeline</h6>
                  <p><strong>Requested:</strong> {new Date(currentRequest.created_at).toLocaleDateString()}</p>
                  <p><strong>Test Date:</strong> {new Date(currentRequest.date_conducted).toLocaleDateString()}</p>
                </Col>
              </Row>
              {currentRequest.notes && (
                <Row>
                  <Col>
                    <h6>Notes from Doctor</h6>
                    <p>{currentRequest.notes}</p>
                  </Col>
                </Row>
              )}
              {currentRequest.results && (
                <Row>
                  <Col>
                    <h6>Test Results</h6>
                    <p>{currentRequest.results}</p>
                  </Col>
                </Row>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Request Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
            Update Lab Request
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitUpdate}>
          <Modal.Body>
            {currentRequest && (
              <div>
                <div className="mb-3">
                  <strong>Patient:</strong> {currentRequest.patient_name} <br />
                  <strong>Test:</strong> {currentRequest.Name_of_test}
                </div>
                
                <Form.Group className="mb-3">
                  <Form.Label>Status *</Form.Label>
                  <Form.Select
                    name="status"
                    value={updateData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Test Results</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="results"
                    value={updateData.results}
                    onChange={handleInputChange}
                    placeholder="Enter test results..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Technician Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={updateData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes or observations..."
                  />
                </Form.Group>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <FaCheckCircle className="me-2" />
              Update Request
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default LabTechnicianDashboard;

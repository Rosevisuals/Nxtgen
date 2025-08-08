import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFlask, 
  FaSearch, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaFileAlt,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle
} from 'react-icons/fa';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { apiFetch } from '../utils/api';
import './lab-requests-dashboard.css';

const LabRequestsDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [labRequests, setLabRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [testTypes, setTestTypes] = useState([]);
  const [patients, setPatients] = useState([]);
  const [staff, setStaff] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    test_id: '',
    technician_id: '',
    date_conducted: new Date().toISOString().split('T')[0],
    notes: '',
    results: ''
  });

  // Mock data as fallback
  const mockLabRequests = [
    {
      labrequest_id: 1,
      patient_name: 'John Doe',
      patient_id: 101,
      doctor_name: 'Dr. Smith',
      doctor_id: 201,
      technician_name: 'Tech Johnson',
      technician_id: 301,
      Name_of_test: 'Blood Test',
      test_id: 1,
      date_conducted: '2025-07-30',
      notes: 'Routine checkup',
      results: 'Normal',
      status: 'Completed'
    },
    {
      labrequest_id: 2,
      patient_name: 'Jane Smith',
      patient_id: 102,
      doctor_name: 'Dr. Wilson',
      doctor_id: 202,
      technician_name: null,
      technician_id: null,
      Name_of_test: 'Urine Test',
      test_id: 2,
      date_conducted: '2025-07-31',
      notes: 'Follow-up test',
      results: '',
      status: 'Pending'
    },
    {
      labrequest_id: 3,
      patient_name: 'Robert Johnson',
      patient_id: 103,
      doctor_name: 'Dr. Brown',
      doctor_id: 203,
      technician_name: 'Tech Wilson',
      technician_id: 302,
      Name_of_test: 'X-Ray',
      test_id: 3,
      date_conducted: '2025-08-01',
      notes: 'Chest X-ray',
      results: 'Pending analysis',
      status: 'In Progress'
    }
  ];

  const mockTestTypes = [
    { test_id: 1, Name_of_test: 'Blood Test', description: 'Complete blood count', price: 25000 },
    { test_id: 2, Name_of_test: 'Urine Test', description: 'Urine analysis', price: 15000 },
    { test_id: 3, Name_of_test: 'X-Ray', description: 'Chest X-ray', price: 75000 },
    { test_id: 4, Name_of_test: 'ECG', description: 'Electrocardiogram', price: 50000 },
    { test_id: 5, Name_of_test: 'Ultrasound', description: 'Abdominal ultrasound', price: 100000 }
  ];

  const mockPatients = [
    { patient_id: 101, full_Name: 'John Doe', email: 'john@example.com' },
    { patient_id: 102, full_Name: 'Jane Smith', email: 'jane@example.com' },
    { patient_id: 103, full_Name: 'Robert Johnson', email: 'robert@example.com' }
  ];

  const mockStaff = [
    { staff_id: 201, full_Name: 'Dr. Smith', specialization: 'Doctor' },
    { staff_id: 202, full_Name: 'Dr. Wilson', specialization: 'Doctor' },
    { staff_id: 203, full_Name: 'Dr. Brown', specialization: 'Doctor' },
    { staff_id: 301, full_Name: 'Tech Johnson', specialization: 'Lab Technician' },
    { staff_id: 302, full_Name: 'Tech Wilson', specialization: 'Lab Technician' }
  ];

  // Standardized API response handler (same as DoctorsDashboard)
  const handleApiResponse = (data, fallback = []) => {
    if (!data) return fallback;
    if (data.success === false) return fallback;
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    return fallback;
  };

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log('Loading lab requests dashboard data from backend...');

        // Fetch lab requests from backend
        const labRequestsResponse = await apiFetch('/lab-requests');
        const labRequestsData = handleApiResponse(labRequestsResponse, mockLabRequests);
        console.log('Fetched lab requests:', labRequestsData);
        setLabRequests(labRequestsData);

        // Fetch test types from backend
        const testTypesResponse = await apiFetch('/test-types');
        const testTypesData = handleApiResponse(testTypesResponse, mockTestTypes);
        console.log('Fetched test types:', testTypesData);
        setTestTypes(testTypesData);

        // Fetch patients from backend
        const patientsResponse = await apiFetch('/patients');
        const patientsData = handleApiResponse(patientsResponse, mockPatients);
        console.log('Fetched patients:', patientsData);
        setPatients(patientsData);

        // Fetch staff from backend
        const staffResponse = await apiFetch('/staff');
        const staffData = handleApiResponse(staffResponse, mockStaff);
        console.log('Fetched staff:', staffData);
        setStaff(staffData);

        toast.success(`Successfully loaded ${labRequestsData.length} lab requests from backend`);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data from backend:', error);
        toast.error('Failed to load data from backend. Using fallback data.');
        // Use mock data as fallback
        setLabRequests(mockLabRequests);
        setTestTypes(mockTestTypes);
        setPatients(mockPatients);
        setStaff(mockStaff);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter lab requests based on search query
  useEffect(() => {
    if (labRequests.length === 0) return;
    
    const filtered = labRequests.filter(request => {
      const query = searchQuery.toLowerCase();
      return query === '' || 
        request.patient_name?.toLowerCase().includes(query) ||
        request.doctor_name?.toLowerCase().includes(query) ||
        request.Name_of_test?.toLowerCase().includes(query) ||
        request.status?.toLowerCase().includes(query);
    });
    
    setFilteredRequests(filtered);
  }, [labRequests, searchQuery]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle new lab request submission
  const handleSubmitNewRequest = async (e) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.patient_id || !formData.doctor_id || !formData.test_id) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Use apiFetch for consistency with other components
      const result = await apiFetch('/lab-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Lab request creation result:', result);
      toast.success('Lab request created and billed successfully!');
      setShowNewRequestModal(false);
      
      // Reset form
      setFormData({
        patient_id: '',
        doctor_id: '',
        test_id: '',
        technician_id: '',
        date_conducted: new Date().toISOString().split('T')[0],
        notes: '',
        results: ''
      });
      
      // Reload lab requests
      const labRequestsResponse = await apiFetch('/lab-requests');
      const labRequestsData = handleApiResponse(labRequestsResponse, mockLabRequests);
      setLabRequests(labRequestsData);
      
    } catch (error) {
      console.error('Error creating lab request:', error);
      toast.error(`Error creating lab request: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle edit request submission
  const handleSubmitEditRequest = async (e) => {
    e.preventDefault();
    try {
      if (!currentRequest) return;

      const result = await apiFetch(`/lab-requests/${currentRequest.labrequest_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('Lab request update result:', result);
      toast.success('Lab request updated successfully!');
      setShowEditModal(false);
      
      // Reload lab requests
      const labRequestsResponse = await apiFetch('/lab-requests');
      const labRequestsData = handleApiResponse(labRequestsResponse, mockLabRequests);
      setLabRequests(labRequestsData);
      
    } catch (error) {
      console.error('Error updating lab request:', error);
      toast.error(`Error updating lab request: ${error.message || 'Unknown error'}`);
    }
  };

  // Handle view request
  const handleViewRequest = (request) => {
    setCurrentRequest(request);
    setShowViewModal(true);
  };

  // Handle edit request
  const handleEditRequest = (request) => {
    setCurrentRequest(request);
    setFormData({
      patient_id: request.patient_id,
      doctor_id: request.doctor_id,
      test_id: request.test_id,
      technician_id: request.technician_id || '',
      date_conducted: request.date_conducted,
      notes: request.notes || '',
      results: request.results || ''
    });
    setShowEditModal(true);
  };

  // Handle delete request
  const handleDeleteRequest = (request) => {
    setCurrentRequest(request);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      if (!currentRequest) return;

      await apiFetch(`/lab-requests/${currentRequest.labrequest_id}`, {
        method: 'DELETE'
      });

      toast.success('Lab request deleted successfully');
      setShowDeleteModal(false);
      setCurrentRequest(null);
      
      // Reload lab requests
      const labRequestsResponse = await apiFetch('/lab-requests');
      const labRequestsData = handleApiResponse(labRequestsResponse, mockLabRequests);
      setLabRequests(labRequestsData);
      
    } catch (error) {
      console.error('Error deleting lab request:', error);
      toast.error(`Failed to delete lab request: ${error.message || 'Unknown error'}`);
    }
  };

  // Get status badge variant
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <Badge bg="success"><FaCheckCircle /> Completed</Badge>;
      case 'pending':
        return <Badge bg="warning"><FaHourglassHalf /> Pending</Badge>;
      case 'in progress':
        return <Badge bg="info"><FaHourglassHalf /> In Progress</Badge>;
      case 'cancelled':
        return <Badge bg="danger"><FaTimesCircle /> Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Get test price
  const getTestPrice = (testId) => {
    const test = testTypes.find(t => t.test_id === testId);
    return test ? `${test.price.toLocaleString()} UGX` : 'N/A';
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
    <Container fluid className="lab-requests-dashboard">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="page-title">
                <FaFlask className="me-2" />
                Lab Requests Dashboard
              </h1>
              <p className="text-muted">Manage laboratory test requests and automatic billing (Connected to Backend)</p>
            </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setShowNewRequestModal(true)}
            >
              <FaPlus className="me-2" />
              New Lab Request
            </Button>
          </div>
        </Col>
      </Row>

      {/* Search and Stats */}
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
        <Col md={6}>
          <Row>
            <Col sm={4}>
              <Card className="stat-card text-center">
                <Card.Body>
                  <h3>{labRequests.length}</h3>
                  <small>Total Requests</small>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="stat-card text-center">
                <Card.Body>
                  <h3>{labRequests.filter(r => r.status === 'Pending').length}</h3>
                  <small>Pending</small>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={4}>
              <Card className="stat-card text-center">
                <Card.Body>
                  <h3>{labRequests.filter(r => r.status === 'Completed').length}</h3>
                  <small>Completed</small>
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
              <h5>Lab Requests ({filteredRequests.length})</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Patient</th>
                    <th>Test Type</th>
                    <th>Doctor</th>
                    <th>Technician</th>
                    <th>Date</th>
                    <th>Price</th>
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
                      <td>{request.technician_name || 'Not assigned'}</td>
                      <td>{new Date(request.date_conducted).toLocaleDateString()}</td>
                      <td>{getTestPrice(request.test_id)}</td>
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
                            onClick={() => handleEditRequest(request)}
                            title="Edit Request"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteRequest(request)}
                            title="Delete Request"
                          >
                            <FaTrash />
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

      {/* New Lab Request Modal */}
      <Modal show={showNewRequestModal} onHide={() => setShowNewRequestModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaFlask className="me-2" />
            Create New Lab Request
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitNewRequest}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient *</Form.Label>
                  <Form.Select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.patient_id} value={patient.patient_id}>
                        {patient.full_Name} (ID: {patient.patient_id})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Requesting Doctor *</Form.Label>
                  <Form.Select
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {staff.filter(s => s.specialization === 'Doctor').map(doctor => (
                      <option key={doctor.staff_id} value={doctor.staff_id}>
                        {doctor.full_Name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Test Type *</Form.Label>
                  <Form.Select
                    name="test_id"
                    value={formData.test_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Test</option>
                    {testTypes.map(test => (
                      <option key={test.test_id} value={test.test_id}>
                        {test.Name_of_test} - {test.price.toLocaleString()} UGX
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lab Technician</Form.Label>
                  <Form.Select
                    name="technician_id"
                    value={formData.technician_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Not assigned yet</option>
                    {staff.filter(s => s.specialization === 'Lab Technician').map(tech => (
                      <option key={tech.staff_id} value={tech.staff_id}>
                        {tech.full_Name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Test Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_conducted"
                    value={formData.date_conducted}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes or instructions..."
              />
            </Form.Group>
            <div className="alert alert-info">
              <FaFileAlt className="me-2" />
              <strong>Automatic Billing:</strong> A bill will be automatically created for this lab test when you submit the request.
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNewRequestModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <FaPlus className="me-2" />
              Create Request & Bill
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Lab Request Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEdit className="me-2" />
            Edit Lab Request
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitEditRequest}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Patient *</Form.Label>
                  <Form.Select
                    name="patient_id"
                    value={formData.patient_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.patient_id} value={patient.patient_id}>
                        {patient.full_Name} (ID: {patient.patient_id})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Requesting Doctor *</Form.Label>
                  <Form.Select
                    name="doctor_id"
                    value={formData.doctor_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Doctor</option>
                    {staff.filter(s => s.specialization === 'Doctor').map(doctor => (
                      <option key={doctor.staff_id} value={doctor.staff_id}>
                        {doctor.full_Name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Test Type *</Form.Label>
                  <Form.Select
                    name="test_id"
                    value={formData.test_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Test</option>
                    {testTypes.map(test => (
                      <option key={test.test_id} value={test.test_id}>
                        {test.Name_of_test} - {test.price.toLocaleString()} UGX
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lab Technician</Form.Label>
                  <Form.Select
                    name="technician_id"
                    value={formData.technician_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Not assigned yet</option>
                    {staff.filter(s => s.specialization === 'Lab Technician').map(tech => (
                      <option key={tech.staff_id} value={tech.staff_id}>
                        {tech.full_Name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Test Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date_conducted"
                    value={formData.date_conducted}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes or instructions..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Results</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="results"
                value={formData.results}
                onChange={handleInputChange}
                placeholder="Test results..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              <FaEdit className="me-2" />
              Update Request
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

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
                  <p><strong>Price:</strong> {getTestPrice(currentRequest.test_id)}</p>
                  <p><strong>Status:</strong> {getStatusBadge(currentRequest.status)}</p>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <h6>Medical Staff</h6>
                  <p><strong>Requesting Doctor:</strong> {currentRequest.doctor_name}</p>
                  <p><strong>Technician:</strong> {currentRequest.technician_name || 'Not assigned'}</p>
                </Col>
                <Col md={6}>
                  <h6>Timeline</h6>
                  <p><strong>Test Date:</strong> {new Date(currentRequest.date_conducted).toLocaleDateString()}</p>
                </Col>
              </Row>
              {currentRequest.notes && (
                <Row>
                  <Col>
                    <h6>Notes</h6>
                    <p>{currentRequest.notes}</p>
                  </Col>
                </Row>
              )}
              {currentRequest.results && (
                <Row>
                  <Col>
                    <h6>Results</h6>
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this lab request? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LabRequestsDashboard;
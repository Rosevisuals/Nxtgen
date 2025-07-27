import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserMd } from 'react-icons/fa';

/**
 * DepartmentManagement Component
 * 
 * Admin page for managing departments.
 */
const DepartmentManagement = () => {
  // State for departments data
  const [departments, setDepartments] = useState([
    { 
      id: 1, 
      name: 'Cardiology', 
      head: 'Dr. John Smith', 
      staffCount: 12, 
      location: 'Building A, Floor 2',
      status: 'Active' 
    },
    { 
      id: 2, 
      name: 'Neurology', 
      head: 'Dr. Emily Johnson', 
      staffCount: 8, 
      location: 'Building B, Floor 1',
      status: 'Active' 
    },
    { 
      id: 3, 
      name: 'Pediatrics', 
      head: 'Dr. Michael Davis', 
      staffCount: 15, 
      location: 'Building A, Floor 3',
      status: 'Active' 
    },
    { 
      id: 4, 
      name: 'Orthopedics', 
      head: 'Dr. Sarah Wilson', 
      staffCount: 10, 
      location: 'Building C, Floor 1',
      status: 'Active' 
    },
    { 
      id: 5, 
      name: 'Dermatology', 
      head: 'Dr. Robert Brown', 
      staffCount: 6, 
      location: 'Building B, Floor 2',
      status: 'Inactive' 
    },
  ]);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentDepartment, setCurrentDepartment] = useState(null);
  
  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    location: '',
    description: '',
    status: 'Active',
  });
  
  // Status options
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];
  
  // Mock department heads (in a real app, this would come from an API)
  const departmentHeads = [
    { value: 'Dr. John Smith', label: 'Dr. John Smith' },
    { value: 'Dr. Emily Johnson', label: 'Dr. Emily Johnson' },
    { value: 'Dr. Michael Davis', label: 'Dr. Michael Davis' },
    { value: 'Dr. Sarah Wilson', label: 'Dr. Sarah Wilson' },
    { value: 'Dr. Robert Brown', label: 'Dr. Robert Brown' },
    { value: 'Dr. Jennifer Lee', label: 'Dr. Jennifer Lee' },
    { value: 'Dr. William Taylor', label: 'Dr. William Taylor' },
  ];
  
  // Table columns
  const columns = [
    { header: 'Department Name', accessor: 'name' },
    { 
      header: 'Department Head', 
      accessor: 'head',
      cell: (row) => (
        <div className="department-head">
          <FaUserMd className="head-icon" />
          <span>{row.head}</span>
        </div>
      ),
    },
    { header: 'Staff Count', accessor: 'staffCount' },
    { header: 'Location', accessor: 'location' },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => (
        <Badge 
          variant={row.status === 'Active' ? 'success' : 'danger'}
          pill
        >
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="table-actions">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleEdit(row)}
            aria-label="Edit department"
          >
            <FaEdit />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteClick(row)}
            aria-label="Delete department"
          >
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];
  
  // Filtered departments based on search query
  const filteredDepartments = departments.filter(department => {
    const query = searchQuery.toLowerCase();
    return (
      department.name.toLowerCase().includes(query) ||
      department.head.toLowerCase().includes(query) ||
      department.location.toLowerCase().includes(query)
    );
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle add department button click
  const handleAddClick = () => {
    setModalMode('add');
    setFormData({
      name: '',
      head: '',
      location: '',
      description: '',
      status: 'Active',
    });
    setIsModalOpen(true);
  };
  
  // Handle edit department button click
  const handleEdit = (department) => {
    setModalMode('edit');
    setCurrentDepartment(department);
    setFormData({
      name: department.name,
      head: department.head,
      location: department.location,
      description: '',  // Assuming description is not displayed in the table
      status: department.status,
    });
    setIsModalOpen(true);
  };
  
  // Handle delete department button click
  const handleDeleteClick = (department) => {
    setDepartmentToDelete(department);
    setIsDeleteModalOpen(true);
  };
  
  // Handle delete department confirmation
  const handleDeleteConfirm = () => {
    setDepartments(departments.filter(dept => dept.id !== departmentToDelete.id));
    setIsDeleteModalOpen(false);
    setDepartmentToDelete(null);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      // Add new department
      const newDepartment = {
        id: departments.length + 1,
        name: formData.name,
        head: formData.head,
        staffCount: 0,  // New departments start with 0 staff
        location: formData.location,
        status: formData.status,
      };
      
      setDepartments([...departments, newDepartment]);
    } else {
      // Update existing department
      setDepartments(departments.map(dept => {
        if (dept.id === currentDepartment.id) {
          return {
            ...dept,
            name: formData.name,
            head: formData.head,
            location: formData.location,
            status: formData.status,
          };
        }
        return dept;
      }));
    }
    
    setIsModalOpen(false);
  };
  
  return (
    <div className="department-management">
      <div className="page-header">
        <h1>Department Management</h1>
        <Button 
          variant="primary" 
          onClick={handleAddClick}
        >
          <FaPlus /> Add Department
        </Button>
      </div>
      
      <Card className="department-management-card">
        <div className="table-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredDepartments}
          striped
          hoverable
        />
      </Card>
      
      {/* Add/Edit Department Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add New Department' : 'Edit Department'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          
          <Select
            label="Department Head"
            name="head"
            value={formData.head}
            onChange={handleInputChange}
            options={departmentHeads}
            required
          />
          
          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Building and Floor"
            required
          />
          
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Department description"
          />
          
          <Select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={statusOptions}
            required
          />
          
          <Modal.Footer
            onCancel={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
            confirmText={modalMode === 'add' ? 'Add Department' : 'Update Department'}
          />
        </form>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        size="sm"
      >
        <p>Are you sure you want to delete the department "{departmentToDelete?.name}"?</p>
        <p>This action cannot be undone and may affect staff assigned to this department.</p>
        
        <Modal.Footer
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          confirmText="Delete"
        />
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
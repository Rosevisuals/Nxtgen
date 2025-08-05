import React, { useState } from 'react';
import Table from '../../components/ui/Table';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

/**
 * UserManagement Component
 * 
 * Admin page for managing users.
 */
const UserManagement = () => {
  // State for users data
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Doctor', department: 'Cardiology', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Nurse', department: 'Pediatrics', status: 'Active' },
    { id: 3, name: 'Robert Johnson', email: 'robert.johnson@example.com', role: 'Receptionist', department: 'Front Desk', status: 'Active' },
    { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Admin', department: 'Administration', status: 'Active' },
    { id: 5, name: 'Michael Wilson', email: 'michael.wilson@example.com', role: 'Doctor', department: 'Neurology', status: 'Inactive' },
  ]);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  
  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    password: '',
    confirmPassword: '',
    status: 'Active',
  });
  
  // Role options
  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Doctor', label: 'Doctor' },
    { value: 'Nurse', label: 'Nurse' },
    { value: 'Receptionist', label: 'Receptionist' },
    { value: 'Pharmacist', label: 'Pharmacist' },
  ];
  
  // Department options
  const departmentOptions = [
    { value: 'Administration', label: 'Administration' },
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Front Desk', label: 'Front Desk' },
    { value: 'Pharmacy', label: 'Pharmacy' },
  ];
  
  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ];
  
  // Table columns
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Department', accessor: 'department' },
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
            aria-label="Edit user"
          >
            <FaEdit />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteClick(row)}
            aria-label="Delete user"
          >
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];
  
  // Filtered users based on search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query)
    );
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle add user button click
  const handleAddClick = () => {
    setModalMode('add');
    setFormData({
      name: '',
      email: '',
      role: '',
      department: '',
      password: '',
      confirmPassword: '',
      status: 'active',
    });
    setIsModalOpen(true);
  };
  
  // Handle edit user button click
  const handleEdit = (user) => {
    setModalMode('edit');
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      password: '',
      confirmPassword: '',
      status: user.status,
    });
    setIsModalOpen(true);
  };
  
  // Handle delete user button click
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  // Handle delete user confirmation
  const handleDeleteConfirm = () => {
    setUsers(users.filter(user => user.id !== userToDelete.id));
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
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
      // Add new user
      const newUser = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        department: formData.department,
        status: formData.status,
      };
      
      setUsers([...users, newUser]);
    } else {
      // Update existing user
      setUsers(users.map(user => {
        if (user.id === currentUser.id) {
          return {
            ...user,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            department: formData.department,
            status: formData.status,
          };
        }
        return user;
      }));
    }
    
    setIsModalOpen(false);
  };
  
  return (
    <div className="user-management">
      <div className="page-header">
        <h1>User Management</h1>
        <Button 
          variant="primary" 
          onClick={handleAddClick}
        >
          <FaPlus /> Add User
        </Button>
      </div>
      
      <Card className="user-management-card">
        <div className="table-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredUsers}
          striped
          hoverable
        />
      </Card>
      
      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add New User' : 'Edit User'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          
          <Select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            options={roleOptions}
            required
          />
          
          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            options={departmentOptions}
            required
          />
          
          {modalMode === 'add' && (
            <>
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </>
          )}
          
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
            confirmText={modalMode === 'add' ? 'Add User' : 'Update User'}
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
        <p>Are you sure you want to delete the user "{userToDelete?.name}"?</p>
        <p>This action cannot be undone.</p>
        
        <Modal.Footer
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          confirmText="Delete"
        />
      </Modal>
    </div>
  );
};

export default UserManagement;
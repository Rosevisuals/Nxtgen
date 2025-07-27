import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

/**
 * RoleManagement Component
 * 
 * Admin page for managing roles.
 */
const RoleManagement = () => {
  // State for roles data
  const [roles, setRoles] = useState([
    { 
      id: 1, 
      name: 'Admin', 
      description: 'Full system access with all privileges', 
      permissions: [
        'User Management', 'Role Management', 'Department Management', 
        'Staff Management', 'Patient Management', 'Appointment Management',
        'Billing Management', 'Report Generation'
      ] 
    },
    { 
      id: 2, 
      name: 'Doctor', 
      description: 'Access to patient records, appointments, and prescriptions', 
      permissions: [
        'Patient Management', 'Appointment Management', 
        'Prescription Management', 'Consultation Management'
      ] 
    },
    { 
      id: 3, 
      name: 'Nurse', 
      description: 'Access to patient records and basic care functions', 
      permissions: [
        'Patient Management', 'Vital Signs Recording', 
        'Medication Administration'
      ] 
    },
    { 
      id: 4, 
      name: 'Receptionist', 
      description: 'Front desk operations including appointments and registrations', 
      permissions: [
        'Patient Registration', 'Appointment Scheduling', 
        'Billing Management'
      ] 
    },
    { 
      id: 5, 
      name: 'Pharmacist', 
      description: 'Medication management and dispensing', 
      permissions: [
        'Medication Management', 'Prescription Verification', 
        'Inventory Management'
      ] 
    },
  ]);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentRole, setCurrentRole] = useState(null);
  
  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [],
  });
  
  // Available permissions
  const availablePermissions = [
    'User Management',
    'Role Management',
    'Department Management',
    'Staff Management',
    'Patient Management',
    'Appointment Management',
    'Billing Management',
    'Report Generation',
    'Prescription Management',
    'Consultation Management',
    'Vital Signs Recording',
    'Medication Administration',
    'Patient Registration',
    'Appointment Scheduling',
    'Medication Management',
    'Prescription Verification',
    'Inventory Management',
  ];
  
  // Table columns
  const columns = [
    { header: 'Role Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Permissions', 
      accessor: 'permissions',
      cell: (row) => (
        <div className="permissions-list">
          {row.permissions.slice(0, 3).join(', ')}
          {row.permissions.length > 3 && (
            <span className="more-permissions">
              +{row.permissions.length - 3} more
            </span>
          )}
        </div>
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
            aria-label="Edit role"
          >
            <FaEdit />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteClick(row)}
            aria-label="Delete role"
            disabled={row.name === 'Admin'} // Prevent deleting Admin role
          >
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];
  
  // Filtered roles based on search query
  const filteredRoles = roles.filter(role => {
    const query = searchQuery.toLowerCase();
    return (
      role.name.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query) ||
      role.permissions.some(permission => permission.toLowerCase().includes(query))
    );
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle add role button click
  const handleAddClick = () => {
    setModalMode('add');
    setFormData({
      name: '',
      description: '',
      permissions: [],
    });
    setIsModalOpen(true);
  };
  
  // Handle edit role button click
  const handleEdit = (role) => {
    setModalMode('edit');
    setCurrentRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
    });
    setIsModalOpen(true);
  };
  
  // Handle delete role button click
  const handleDeleteClick = (role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };
  
  // Handle delete role confirmation
  const handleDeleteConfirm = () => {
    setRoles(roles.filter(role => role.id !== roleToDelete.id));
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle permission checkbox change
  const handlePermissionChange = (permission) => {
    if (formData.permissions.includes(permission)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permission),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission],
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      // Add new role
      const newRole = {
        id: roles.length + 1,
        name: formData.name,
        description: formData.description,
        permissions: formData.permissions,
      };
      
      setRoles([...roles, newRole]);
    } else {
      // Update existing role
      setRoles(roles.map(role => {
        if (role.id === currentRole.id) {
          return {
            ...role,
            name: formData.name,
            description: formData.description,
            permissions: formData.permissions,
          };
        }
        return role;
      }));
    }
    
    setIsModalOpen(false);
  };
  
  return (
    <div className="role-management">
      <div className="page-header">
        <h1>Role Management</h1>
        <Button 
          variant="primary" 
          onClick={handleAddClick}
        >
          <FaPlus /> Add Role
        </Button>
      </div>
      
      <Card className="role-management-card">
        <div className="table-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredRoles}
          striped
          hoverable
        />
      </Card>
      
      {/* Add/Edit Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add New Role' : 'Edit Role'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Role Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={modalMode === 'edit' && currentRole?.name === 'Admin'}
          />
          
          <Input
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
          
          <div className="form-group">
            <label className="form-label">Permissions</label>
            <div className="permissions-checkboxes">
              {availablePermissions.map((permission, index) => (
                <div key={index} className="permission-checkbox">
                  <input
                    type="checkbox"
                    id={`permission-${index}`}
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                    disabled={modalMode === 'edit' && currentRole?.name === 'Admin'}
                  />
                  <label htmlFor={`permission-${index}`}>{permission}</label>
                </div>
              ))}
            </div>
          </div>
          
          <Modal.Footer
            onCancel={() => setIsModalOpen(false)}
            onConfirm={handleSubmit}
            confirmText={modalMode === 'add' ? 'Add Role' : 'Update Role'}
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
        <p>Are you sure you want to delete the role "{roleToDelete?.name}"?</p>
        <p>This action cannot be undone and may affect users assigned to this role.</p>
        
        <Modal.Footer
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          confirmText="Delete"
        />
      </Modal>
    </div>
  );
};

export default RoleManagement;
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Badge from '../../components/ui/Badge';
import DatePicker from '../../components/ui/DatePicker';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserMd, FaUserNurse, FaUser } from 'react-icons/fa';

/**
 * StaffManagement Component
 * 
 * Admin page for managing staff members.
 */
const StaffManagement = () => {
  // State for staff data
  const [staff, setStaff] = useState([
    { 
      id: 1, 
      name: 'Dr. John Smith', 
      role: 'Doctor',
      specialty: 'Cardiology',
      department: 'Cardiology',
      email: 'john.smith@hospital.com',
      phone: '(123) 456-7890',
      joinDate: new Date('2020-03-15'),
      status: 'Active' 
    },
    { 
      id: 2, 
      name: 'Dr. Emily Johnson', 
      role: 'Doctor',
      specialty: 'Neurology',
      department: 'Neurology',
      email: 'emily.johnson@hospital.com',
      phone: '(123) 456-7891',
      joinDate: new Date('2019-06-10'),
      status: 'Active' 
    },
    { 
      id: 3, 
      name: 'Nurse Sarah Wilson', 
      role: 'Nurse',
      specialty: 'Pediatric Nursing',
      department: 'Pediatrics',
      email: 'sarah.wilson@hospital.com',
      phone: '(123) 456-7892',
      joinDate: new Date('2021-01-05'),
      status: 'Active' 
    },
    { 
      id: 4, 
      name: 'Robert Davis', 
      role: 'Receptionist',
      specialty: 'Front Desk',
      department: 'Administration',
      email: 'robert.davis@hospital.com',
      phone: '(123) 456-7893',
      joinDate: new Date('2022-02-20'),
      status: 'Active' 
    },
    { 
      id: 5, 
      name: 'Dr. Michael Brown', 
      role: 'Doctor',
      specialty: 'Orthopedics',
      department: 'Orthopedics',
      email: 'michael.brown@hospital.com',
      phone: '(123) 456-7894',
      joinDate: new Date('2018-11-12'),
      status: 'On Leave' 
    },
  ]);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentStaff, setCurrentStaff] = useState(null);
  
  // State for delete confirmation
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    specialty: '',
    department: '',
    email: '',
    phone: '',
    joinDate: new Date(),
    status: 'Active',
  });
  
  // Role options
  const roleOptions = [
    { value: 'Doctor', label: 'Doctor' },
    { value: 'Nurse', label: 'Nurse' },
    { value: 'Receptionist', label: 'Receptionist' },
    { value: 'Pharmacist', label: 'Pharmacist' },
    { value: 'Lab Technician', label: 'Lab Technician' },
    { value: 'Administrator', label: 'Administrator' },
  ];
  
  // Department options
  const departmentOptions = [
    { value: 'Cardiology', label: 'Cardiology' },
    { value: 'Neurology', label: 'Neurology' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Orthopedics', label: 'Orthopedics' },
    { value: 'Dermatology', label: 'Dermatology' },
    { value: 'Administration', label: 'Administration' },
    { value: 'Pharmacy', label: 'Pharmacy' },
    { value: 'Laboratory', label: 'Laboratory' },
  ];
  
  // Status options
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'On Leave', label: 'On Leave' },
    { value: 'Inactive', label: 'Inactive' },
  ];
  
  // Table columns
  const columns = [
    { 
      header: 'Name', 
      accessor: 'name',
      cell: (row) => (
        <div className="staff-name">
          {row.role === 'Doctor' && <FaUserMd className="staff-icon doctor-icon" />}
          {row.role === 'Nurse' && <FaUserNurse className="staff-icon nurse-icon" />}
          {(row.role !== 'Doctor' && row.role !== 'Nurse') && <FaUser className="staff-icon" />}
          <span>{row.name}</span>
        </div>
      ),
    },
    { header: 'Role', accessor: 'role' },
    { header: 'Department', accessor: 'department' },
    { header: 'Specialty', accessor: 'specialty' },
    { header: 'Email', accessor: 'email' },
    { 
      header: 'Join Date', 
      accessor: 'joinDate',
      cell: (row) => (
        <span>{row.joinDate.toLocaleDateString()}</span>
      ),
    },
    { 
      header: 'Status', 
      accessor: 'status',
      cell: (row) => {
        let variant = 'primary';
        
        switch (row.status) {
          case 'Active':
            variant = 'success';
            break;
          case 'On Leave':
            variant = 'warning';
            break;
          case 'Inactive':
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
            onClick={() => handleEdit(row)}
            aria-label="Edit staff"
          >
            <FaEdit />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleDeleteClick(row)}
            aria-label="Delete staff"
          >
            <FaTrash />
          </Button>
        </div>
      ),
    },
  ];
  
  // Filtered staff based on search query
  const filteredStaff = staff.filter(member => {
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.department.toLowerCase().includes(query) ||
      member.specialty.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle add staff button click
  const handleAddClick = () => {
    setModalMode('add');
    setFormData({
      name: '',
      role: '',
      specialty: '',
      department: '',
      email: '',
      phone: '',
      joinDate: new Date(),
      status: 'Active',
    });
    setIsModalOpen(true);
  };
  
  // Handle edit staff button click
  const handleEdit = (staffMember) => {
    setModalMode('edit');
    setCurrentStaff(staffMember);
    setFormData({
      name: staffMember.name,
      role: staffMember.role,
      specialty: staffMember.specialty,
      department: staffMember.department,
      email: staffMember.email,
      phone: staffMember.phone,
      joinDate: staffMember.joinDate,
      status: staffMember.status,
    });
    setIsModalOpen(true);
  };
  
  // Handle delete staff button click
  const handleDeleteClick = (staffMember) => {
    setStaffToDelete(staffMember);
    setIsDeleteModalOpen(true);
  };
  
  // Handle delete staff confirmation
  const handleDeleteConfirm = () => {
    setStaff(staff.filter(member => member.id !== staffToDelete.id));
    setIsDeleteModalOpen(false);
    setStaffToDelete(null);
  };
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      joinDate: date,
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      // Add new staff member
      const newStaff = {
        id: staff.length + 1,
        name: formData.name,
        role: formData.role,
        specialty: formData.specialty,
        department: formData.department,
        email: formData.email,
        phone: formData.phone,
        joinDate: formData.joinDate,
        status: formData.status,
      };
      
      setStaff([...staff, newStaff]);
    } else {
      // Update existing staff member
      setStaff(staff.map(member => {
        if (member.id === currentStaff.id) {
          return {
            ...member,
            name: formData.name,
            role: formData.role,
            specialty: formData.specialty,
            department: formData.department,
            email: formData.email,
            phone: formData.phone,
            joinDate: formData.joinDate,
            status: formData.status,
          };
        }
        return member;
      }));
    }
    
    setIsModalOpen(false);
  };
  
  return (
    <div className="staff-management">
      <div className="page-header">
        <h1>Staff Management</h1>
        <Button 
          variant="primary" 
          onClick={handleAddClick}
        >
          <FaPlus /> Add Staff
        </Button>
      </div>
      
      <Card className="staff-management-card">
        <div className="table-toolbar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredStaff}
          striped
          hoverable
        />
      </Card>
      
      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add New Staff Member' : 'Edit Staff Member'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
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
          
          <Input
            label="Specialty"
            name="specialty"
            value={formData.specialty}
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
          
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          
          <DatePicker
            label="Join Date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleDateChange}
            required
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
            confirmText={modalMode === 'add' ? 'Add Staff' : 'Update Staff'}
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
        <p>Are you sure you want to delete the staff member "{staffToDelete?.name}"?</p>
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

export default StaffManagement;
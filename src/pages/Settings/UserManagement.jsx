import React, { useState, useEffect } from 'react';

const initialUsers = [
  { id: 1, name: 'Admin User', role: 'Admin', email: 'admin@hospital.com' },
  { id: 2, name: 'Dr. Smith', role: 'Doctor', email: 'dr.smith@hospital.com' },
  { id: 3, name: 'Jane Doe', role: 'Receptionist', email: 'jane.doe@hospital.com' },
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', role: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setTimeout(() => setUsers(initialUsers), 500);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (editingId) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingId ? { ...user, ...formData } : user
        )
      );
      setEditingId(null);
    } else {
      const newUser = {
        id: Date.now(),
        ...formData
      };
      setUsers([...users, newUser]);
    }

    setFormData({ name: '', role: '', email: '' });
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, role: user.role, email: user.email });
    setEditingId(user.id);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '24px' }}>
      <h2 style={headingStyle}>User Management</h2>

      <div style={cardStyle}>
        {/* Add/Edit Form */}
        <form onSubmit={handleAddUser} style={formStyle}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="text"
            name="role"
            placeholder="Role"
            value={formData.role}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle('#2563eb')}>
            {editingId ? 'Update User' : 'Add User'}
          </button>
        </form>

        {/* User Table */}
        {users.length === 0 ? (
          <div style={{ color: '#64748b' }}>Loading users...</div>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '24px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', textAlign: 'left' }}>
                  <th style={tableHeaderStyle}>Name</th>
                  <th style={tableHeaderStyle}>Role</th>
                  <th style={tableHeaderStyle}>Email</th>
                  <th style={tableHeaderStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={tableCellStyle}>{user.name}</td>
                    <td style={tableCellStyle}>{user.role}</td>
                    <td style={tableCellStyle}>{user.email}</td>
                    <td style={tableCellStyle}>
                      <button
                        onClick={() => handleEdit(user)}
                        style={smallButtonStyle('#0284c7')}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={smallButtonStyle('#dc2626')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: 16, color: 'green', fontSize: '14px' }}>
              {users.length} user{users.length > 1 ? 's' : ''} found.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Reusable Styles
const headingStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1e293b',
  marginBottom: '16px'
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
};

const formStyle = {
  display: 'flex',
  gap: '10px',
  flexWrap: 'wrap',
  marginBottom: '16px'
};

const inputStyle = {
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid #d1d5db',
  fontSize: '14px',
  flex: '1 1 30%'
};

const buttonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '4px',
  fontSize: '14px',
  cursor: 'pointer'
});

const smallButtonStyle = (bgColor) => ({
  ...buttonStyle(bgColor),
  marginRight: '6px',
  padding: '6px 12px'
});

const tableHeaderStyle = {
  padding: '12px',
  fontSize: '14px',
  fontWeight: '600',
  color: '#334155',
  borderBottom: '2px solid #e2e8f0'
};

const tableCellStyle = {
  padding: '12px',
  fontSize: '14px',
  color: '#1e293b'
};

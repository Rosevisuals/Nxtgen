// Doctor.js
import React from 'react';
import Sidebar from './DoctorsSidebar';
import Doctors from './DoctorsDashboard'; // ✅ no apostrophe, no backslash

const Doctor = () => {
  return (
    <div>
      <Sidebar />
      <Doctors /> {/* ✅ valid JSX tag */}
    </div>
  );
};

export default Doctor;

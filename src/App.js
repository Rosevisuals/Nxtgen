import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './contexts/UserContext';

import Landing from './components/landing';
import Login from './components/login';
import Doctor from './components/doctor';
import DoctorsLayout from './components/DoctorsLayout'; // Import Doctors Layout component
import DoctorsDashboard from './components/DoctorsDashboard'; // Import Doctors component
import AppointmentScheduling from './components/AppointmentScheduling';
import PrescriptionForm from './components/PrescriptionForm';
import PatientLookup from './components/PatientLookup'; // Import PatientLookup component
import ConsultationForm from './components/ConsultationForm'; // Import ConsultationForm component
import PatientDashboard from './components/PatientDashboard'; // Import PatientDashboard component
import ReceptionistDashboard from './components/ReceptionistDashboard'; // Import ReceptionistDashboard component
import PatientAppointments from './components/PatientAppointments';
import PatientPrescriptions from './components/PatientPrescriptions';
import PatientSettings from './components/PatientSettings';
import PatientHelp from './components/PatientHelp';
import AppointmentRequest from './components/AppointmentRequest'; // Import AppointmentRequest component
import PatientLayout from './components/PatientLayout'; // Import PatientLayout component
import ReceptionistLayout from './components/ReceptionistLayout';
import PatientRegister from './components/PatientRegister';
import NewAppointment from './components/NewAppointment';
import PatientSearch from './components/PatientSearch';
import NewBill from './components/NewBill';
import Billing from './components/Billing';
import SetupPassword from './components/SetupPassword';
import AdminDashboardLayout from './components/AdminDashboardLayout';

// Dashboards
import AdminDashboard from './pages/Dashboard/AdminDashboard';

// Patients
import Patients from './pages/Patients/Patients';

// Doctors
import Doctors from './pages/Doctors/AllDoctors';
import AddDoctor from './pages/Doctors/AddDoctor';

// Appointments
import Appointments from './pages/Appointments/Appointments';
// Departments
import Departments from './pages/Departments/Departments';
import AddDepartment from './pages/Departments/AddDepartment';

// Billings
import Billings from './pages/Billings/Billings';
import PaymentHistory from './pages/Billings/PaymentHistory';

// Prescriptions
import Prescriptions from './pages/Prescriptions/AllPrescriptions';

// wards
import Wards from './pages/Wards/Wards';
import AddWard from './pages/Wards/AddWard';
import WardAllotment from './pages/Wards/WardAllotment';
import WardHistory from './pages/Wards/WardHistory';

// Settings
import Settings from './pages/Settings/Settings';
import UserManagement from './pages/Settings/UserManagement';

// Reports
import DailyReports from './pages/Reports/DailyReports';
import MonthlyReports from './pages/Reports/MonthlyReports';

// Staff
import Staff from './pages/Staff/Staff';
import AddStaff from './pages/Staff/AddStaff';
import StaffRoles from './pages/Staff/StaffRoles';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
        <Route path="/" element={<ProtectedRoute><Landing /></ProtectedRoute>} />        {/* Only Landing */}
        <Route path="/login" element={<Login />} />     {/* Only Login */}
        <Route path="/setup-password" element={<SetupPassword />} /> {/* Password Setup */}

        <Route element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardLayout /></ProtectedRoute>} >
          {/* Dashboards */}
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />

          {/* Patients */}
          <Route path="/patients" element={<Patients />} />
        
          {/* Doctors */}
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/add" element={<AddDoctor />} />
          

          {/* Appointments */}
          <Route path="/appointments" element={<Appointments />} />
         
          {/* Departments */}
          <Route path="/departments" element={<Departments />} />
          <Route path="/departments/add" element={<AddDepartment />} />

          {/* Billings */}
          <Route path="/billings" element={<Billings />} />
          <Route path="/billings/payments" element={<PaymentHistory />} />

          {/* Prescriptions */}
          <Route path="/prescriptions" element={<Prescriptions />} />

          {/* Staff */}
          <Route path="/staff" element={<Staff />} />
          <Route path="/staff/add" element={<AddStaff />} />
          <Route path="/staff/roles" element={<StaffRoles />} />

          {/* Rooms */}
          <Route path="/wards" element={<Wards />} />
          <Route path="/wards/add" element={<AddWard />} />
          <Route path="/wards/allocation" element={<WardAllotment />} />
          <Route path="/wards/history" element={<WardHistory />} />

          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/users" element={<UserManagement />} />

          {/* Reports */}
          <Route path="/reports/daily" element={<DailyReports />} />
          <Route path="/reports/monthly" element={<MonthlyReports />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout /></ProtectedRoute>} >
          <Route path="/PatientDashboard" element={<PatientDashboard />} /> {/* Only Patient Dashboard */}
          <Route path="/PatientAppointments" element={<PatientAppointments />} />
          <Route path="/AppointmentRequest" element={<AppointmentRequest />} />
          <Route path="/PatientPrescriptions" element={<PatientPrescriptions />} />
          <Route path="/PatientSettings" element={<PatientSettings />} />
          <Route path="/PatientHelp" element={<PatientHelp />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['doctor']}><DoctorsLayout /></ProtectedRoute>} >
          <Route path="/doctor" element={<Doctor />} />
          <Route path="/DoctorsDashboard" element={<DoctorsDashboard />} />   {/* Only Dashboard */}
          <Route path="/PatientLookup" element={<PatientLookup />} /> {/* Only Patient Lookup */}
          <Route path="/AppointmentScheduling" element={<AppointmentScheduling />} /> {/* Only Appointment Scheduling */}
          <Route path="/PatientLayout" element={<PatientLayout />} /> {/* Only Patient Layout */}
          <Route path="/PrescriptionForm" element={<PrescriptionForm />} /> {/* Only Prescription Form */}
          <Route path="/ConsultationForm" element={<ConsultationForm />} /> {/* Only Consultation Form */}
        </Route>{/* Only Doctors Layout */}

        <Route element={<ProtectedRoute allowedRoles={['receptionist']}><ReceptionistLayout /></ProtectedRoute>} > {/* Only Receptionist Layout */}
          <Route path="/ReceptionistDashboard" element={<ReceptionistDashboard />} /> {/* Only Receptionist Dashboard */}
          <Route path="/PatientRegister" element={<PatientRegister />} />
          <Route path="/NewAppointment" element={<NewAppointment />} />
          <Route path="/PatientSearch" element={<PatientSearch />} />
          <Route path="/NewBill" element={<NewBill />} />
          <Route path="/Billing" element={<Billing />} />
          <Route path="/receptionist/patients/:id" element={<PatientSearch />} />
        </Route>

        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

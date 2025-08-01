import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Landing from './components/landing';  
import Login from './components/login';
import Doctor from './components/doctor';
import DoctorsLayout from './components/DoctorsLayout'; // Import Doctors Layout component
import DoctorsDashboard from './components/DoctorsDashboard'; // Import Doctors component
import AppointmentScheduling from './components/AppointmentScheduling'; 
import PrescriptionForm from './components/PrescriptionForm';
import PatientDetail from './components/PatientDetail'; // Import PatientDetail component
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />        {/* Only Landing */}
        <Route path="/login" element={<Login />} />     {/* Only Login */}
        <Route path="/setup-password" element={<SetupPassword />} /> {/* Password Setup */}
        
        <Route element={<PatientLayout />} >
          <Route path="/PatientDashboard" element={<PatientDashboard />} /> {/* Only Patient Dashboard */}
          <Route path="/PatientAppointments" element={<PatientAppointments />} />
          <Route path="/AppointmentRequest" element={<AppointmentRequest />} />          
          <Route path="/PatientPrescriptions" element={<PatientPrescriptions />} />         
          <Route path="/PatientSettings" element={<PatientSettings />} />
          <Route path="/PatientHelp" element={<PatientHelp />} />
        </Route>
        
        <Route  element={<DoctorsLayout />} > 
           <Route path="/doctor" element={<Doctor />} /> 
           <Route path="/DoctorsDashboard" element={<DoctorsDashboard />} />   {/* Only Dashboard */}
           <Route path="/PatientDetail" element={<PatientDetail />} /> {/* Only Patient Detail */}
           <Route path="/PatientLookup" element={<PatientLookup />} /> {/* Only Patient Lookup */}
           <Route path="/AppointmentScheduling" element={<AppointmentScheduling />} /> {/* Only Appointment Scheduling */}
           <Route path="/PatientLayout" element={<PatientLayout />} /> {/* Only Patient Layout */}
           <Route path="/PrescriptionForm" element={<PrescriptionForm />} /> {/* Only Prescription Form */}
           <Route path="/ConsultationForm" element={<ConsultationForm />} /> {/* Only Consultation Form */}
        </Route>{/* Only Doctors Layout */}

        <Route element={<ReceptionistLayout />} > {/* Only Receptionist Layout */}
            <Route  path="/ReceptionistDashboard" element={<ReceptionistDashboard />} /> {/* Only Receptionist Dashboard */}
            <Route path="/PatientRegister" element={<PatientRegister />} />
            <Route path="/NewAppointment" element={<NewAppointment />} />
            <Route path="/PatientSearch" element={<PatientSearch />} />
            <Route path="/NewBill" element={<NewBill />} /> 
            <Route path="/Billing" element={<Billing />} />
        </Route> 
        
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
// filepath: c:\Users\user\OneDrive\Desktop\erp\erp\src\index.js (or App.js)

// Import your components
import Navbar from './components/navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HealthServices from './components/HealthServices';
import Login from './components/login';
import AdminLayout from './admin/AdminLayout';
import Sidebar from './components/sidebar';
import Doctor from './components/doctor\'s';
import Appointment from './components/appointment';
// ...existing code...

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar />
              
              <Login />
              <Sidebar/>
              <Appointment />
              <Doctor />
              <Hero />
              <Features />
              
              <HealthServices />
            </>
          } />
          <Route path="/admin" element={<AdminLayout />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

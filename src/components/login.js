import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUser, FaLock } from 'react-icons/fa';
import { login } from '../services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './centered-layout.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Add delay to prevent rapid requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            const response = await login(email, password);
            
            // Store user data in localStorage (token is already stored by authService)
            localStorage.setItem('user_id', response.user.user_id);
            localStorage.setItem('user_email', response.user.email);
            localStorage.setItem('user_name', response.user.full_Name);
            
            // Ensure token is stored
            if (response.token) {
                localStorage.setItem('token', response.token);
            }
            
            // Navigate based on user role or default to patient dashboard
            if (response.user.role) {
                // Handle different roles
                switch (response.user.role.toLowerCase()) {
                    case 'doctor':
                        navigate('/DoctorsDashboard');
                        break;
                    case 'receptionist':
                        navigate('/ReceptionistDashboard');
                        break;
                    case 'admin':
                        navigate('/AdminDashboard');
                        break;
                    default:
                        navigate('/PatientDashboard');
                }
            } else {
                // Default to patient dashboard
                navigate('/PatientDashboard');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="centered-container">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="centered-content" style={{maxWidth: '400px'}}>
                <div className="page-header">
                    <h1 className="page-title">
                        <FaSignInAlt /> Welcome Back
                    </h1>
                    <p className="page-subtitle">Sign in to continue to NxtGen Hospital</p>
                </div>
                
                <div className="card">
                    <div className="card-body">
                        <div className="text-center mb-4">
                            <img 
                                src="/images/young-handsome-physician-medical-robe-with-stethoscope.jpg" 
                                alt="Doctor" 
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '4px solid #2563eb',
                                    marginBottom: '1rem'
                                }}
                            />
                        </div>
                        <form onSubmit={handleSubmit}>


                            <div className="form-group">
                                <label className="form-label" htmlFor="email">
                                    <FaUser style={{marginRight: '0.5rem'}} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="password">
                                    <FaLock style={{marginRight: '0.5rem'}} /> Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={isLoading}
                                style={{width: '100%'}}
                            >
                                <FaSignInAlt style={{marginRight: '0.5rem'}} />
                                {isLoading ? 'Please wait...' : 'Login'}
                            </button>

                            <div className="text-center mt-3">
                                <p style={{ fontSize: '0.9rem', color: '#64748b', margin: '1rem 0' }}>
                                    Forgot your password? <a href="/reset" style={{ color: '#2563eb', textDecoration: 'none' }}>Reset</a>
                                </p>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                    Quick access: <Link to="/ReceptionistDashboard" style={{ color: '#2563eb', textDecoration: 'none' }}>Staff Dashboard</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

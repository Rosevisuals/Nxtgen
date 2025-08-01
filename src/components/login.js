import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await login(email, password);
            
            // Store user data in localStorage
            localStorage.setItem('user_id', response.user.user_id);
            localStorage.setItem('user_email', response.user.email);
            localStorage.setItem('user_name', response.user.full_Name);
            
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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            fontFamily: 'Segoe UI, sans-serif',
        }}>
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div style={{
                flex: 1,
                position: 'relative',
                background: 'url("/images/young-handsome-physician-medical-robe-with-stethoscope.jpg") no-repeat center center/cover',
            }}>
                <div style={{
                    
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(to right, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0))',
                }}></div>
            </div>

            {/* Right Section with Login Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #e3f0ff, #d0e6ff, #c9f3fc)',
            }}>
                
                <form
                    onSubmit={handleSubmit}
                    style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        padding: '2.5rem',
                        borderRadius: '1rem',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                        width: '100%',
                        maxWidth: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.2rem',
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src="/images/healthcare (1).png"
                            alt="Logo"
                            style={{ height: '60px', marginBottom: '0.5rem' }}
                        />
                        <h2 style={{
                            color: '#1976d2',
                            fontWeight: '600',
                            margin: '0',
                            fontSize: '1.6rem'
                        }}>
                            Welcome Back
                        </h2>
                        <p style={{ fontSize: '0.9rem', color: '#555' }}>
                            Sign in to continue
                        </p>
                    </div>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{
                            padding: '0.85rem',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#1976d2'}
                        onBlur={e => e.target.style.borderColor = '#ccc'}
                    />

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{
                            padding: '0.85rem',
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'border-color 0.3s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#1976d2'}
                        onBlur={e => e.target.style.borderColor = '#ccc'}
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            background: isLoading ? '#ccc' : '#1976d2',
                            color: '#fff',
                            padding: '0.9rem',
                            border: 'none',
                            borderRadius: '8px', 
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.3s ease',
                        }}
                        onMouseOver={e => !isLoading && (e.target.style.background = '#155db0')}
                        onMouseOut={e => !isLoading && (e.target.style.background = '#1976d2')}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#666' }}>
                        Forgot your password? <a href="/reset" style={{ color: '#1976d2', textDecoration: 'none' }}>Reset</a>
                         <Link to="/DoctorsDashboard">Doctor's dashboard</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;

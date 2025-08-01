import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Card from './ui/Card';
import Button from './ui/Button';
import { apiFetch } from '../utils/api';

const SetupPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing token');
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await apiFetch('/auth/setup-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      
      toast.success('Password set successfully! You can now login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to set password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ToastContainer />
      <Card style={{ maxWidth: '400px', width: '100%' }}>
        <h2>Set Up Your Password</h2>
        <p>Please create a password for your account.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
          </div>
          
          <Button type="submit" disabled={isLoading} style={{ width: '100%' }}>
            {isLoading ? 'Setting Password...' : 'Set Password'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SetupPassword;
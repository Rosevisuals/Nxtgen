// src/services/authService.js
import { apiFetch } from '../utils/api';

export const login = async (email, password) => {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  // Store the token
  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

export const register = async (userData) => {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const logout = () => {
  localStorage.removeItem('token');
};
// src/utils/api.js

const BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend runs elsewhere

// Function to get the JWT from localStorage
const getToken = () => localStorage.getItem('token');

// Main function to handle API requests
export const apiFetch = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle HTTP errors
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};
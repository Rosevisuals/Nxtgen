// src/utils/api.js

const BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend runs elsewhere

// Function to get the JWT from localStorage
const getToken = () => localStorage.getItem('token');

// Main function to handle API requests with retry for rate limiting
export const apiFetch = async (path, options = {}, retryCount = 0) => {
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
    // Handle rate limiting with retry
    if (response.status === 429 && retryCount < 3) {
      const delay = Math.pow(2, retryCount + 1) * 1000; // Exponential backoff: 2s, 4s, 8s
      console.log(`Rate limited. Retrying in ${delay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return apiFetch(path, options, retryCount + 1);
    }
    
    // Handle HTTP errors
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    if (response.status === 429) {
      errorMessage = 'Too many requests. Please wait a moment and try again.';
    } else if (response.status === 500) {
      errorMessage = 'Server error. Please check if the backend is running.';
    } else if (response.status === 404) {
      errorMessage = 'API endpoint not found. Please check the backend configuration.';
    }
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Use the default error message if JSON parsing fails
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};
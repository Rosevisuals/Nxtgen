// src/utils/api.js

const BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend runs elsewhere



// Simple request cache to prevent duplicate requests
const requestCache = new Map();
const CACHE_DURATION = 5000; // 5 seconds

// Request queue to prevent too many simultaneous requests
let requestQueue = [];
let isProcessingQueue = false;

const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  while (requestQueue.length > 0) {
    const { resolve, reject, fn } = requestQueue.shift();
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    }
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  isProcessingQueue = false;
};

// Main function to handle API requests with retry for rate limiting
export const apiFetch = async (path, options = {}, retryCount = 0) => {
  // Create cache key
  const cacheKey = `${path}-${JSON.stringify(options)}`;
  
  // Check cache for GET requests
  if (!options.method || options.method === 'GET') {
    const cached = requestCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }
  
  // Queue the request to prevent too many simultaneous calls
  return new Promise((resolve, reject) => {
    const executeRequest = async () => {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

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

      const data = await response.json();
      
      // Cache GET requests
      if (!options.method || options.method === 'GET') {
        requestCache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }
      
      return data;
    };
    
    requestQueue.push({ resolve, reject, fn: executeRequest });
    processQueue();
  });
};
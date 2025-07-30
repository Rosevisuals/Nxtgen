// middleware/authMiddleware.js - Authentication and Authorization Middleware
// This file contains functions that check if users are logged in and have permission to access certain features
// Think of this as the "security guard" that checks IDs and permissions

// Import the JWT package to work with JSON Web Tokens
const jwt = require('jsonwebtoken');

// ===== AUTHENTICATE TOKEN FUNCTION =====
// This function checks if a user has a valid login token (JWT)
// It runs before protected routes to ensure only logged-in users can access them
const authenticateToken = (req, res, next) => {
  // Get the authorization header from the request
  // This is where the frontend sends the JWT token (like "Bearer abc123...")
  const authHeader = req.headers['authorization'];

  // If no authorization header is provided, the user isn't logged in
  if (!authHeader) return res.status(401).json({ message: 'Access token required' });

  // Split the header into parts: "Bearer" and the actual token
  // Example: "Bearer abc123" becomes ["Bearer", "abc123"]
  const parts = authHeader.split(' ');

  // Check if the format is correct (should be exactly 2 parts, first part should be "Bearer")
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  // Extract the actual token (the second part)
  const token = parts[1];

  // If no token is provided, return an error
  if (!token) return res.status(401).json({ message: 'Access token required' });

  try {
    // Verify the token using our secret key
    // This checks if the token is valid and hasn't been tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If the token is valid, attach the decoded user information to the request
    // This makes the user info available to the route handler
    req.user = decoded;

    // Move to the next function (the actual route handler)
    next();
  } catch (err) {
    // If the token is invalid (expired, wrong signature, etc.), return an error
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// ===== AUTHORIZE ROLES FUNCTION =====
// This function checks if a user has the right role/permission to access a specific feature
// For example, only doctors can access patient medical records, only admins can delete users, etc.
// Only staff users have a 'role' property in the JWT
const authorizeRoles = (roles) => {
  // This returns a middleware function that can be used in routes
  return (req, res, next) => {
    // First, check if the user is authenticated (has a valid token)
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Only staff users have a role in the JWT
    if (!req.user.role) {
      return res.status(403).json({ message: 'Insufficient permissions (not staff)' });
    }

    // Check if the user's role is in the list of allowed roles
    // Example: if roles = ['doctor', 'admin'] and user.role = 'nurse', access is denied
    if (!roles.map(role => role.toLowerCase()).includes(req.user.role.toLowerCase())) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // If the user has the right role, allow them to proceed
    next();
  };
};

// Export both functions so they can be used in route files
module.exports = { authenticateToken, authorizeRoles };

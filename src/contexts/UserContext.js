import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user from localStorage
    const initializeUser = () => {
      try {
        const userName = localStorage.getItem('user_name');
        const userEmail = localStorage.getItem('user_email');
        const userRole = localStorage.getItem('user_role');
        
        if (userName && userEmail) {
          setUser({
            name: userName,
            email: userEmail,
            role: userRole || 'user'
          });
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user_name', userData.name);
    localStorage.setItem('user_email', userData.email);
    localStorage.setItem('user_role', userData.role || 'user');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
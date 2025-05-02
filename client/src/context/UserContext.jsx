import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// ดึง URL จาก environment variables
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const loginUser = (userData) => {
    setCurrentUser(userData);
  };

  const logoutUser = async () => {

     setCurrentUser(null);
     localStorage.removeItem('token');
     console.log("User logged out, token removed.");
  };

  
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          setLoading(false);
          setCurrentUser(null);
          return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/me`);
        if (response.data && response.data.user) {
          setCurrentUser(response.data.user);
        } else {
          setCurrentUser(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.log("Auth check failed:", error.response?.data?.error || error.message);
        setCurrentUser(null);
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, loginUser, logoutUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

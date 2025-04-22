import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

 // เก็บข้อมูล user ที่ login เข้ามา
  const loginUser = (userData) => {
    setCurrentUser(userData);
  };

  const logoutUser = async () => {
     try {
        await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
        setCurrentUser(null);
     } catch (error) {
        console.error("Error logging out:", error);
        setCurrentUser(null);
     }
  };

    // ตรวจสอบว่า user login เข้ามาหรือยัง
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true, // ตรวจสอบว่ามี option นี้แล้ว
        });
        if (response.data && response.data.user) {
          setCurrentUser(response.data.user);
        }
      } catch (error) {
        console.log("User not authenticated:", error.response?.data?.error || error.message);
        setCurrentUser(null);
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

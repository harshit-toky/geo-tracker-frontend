import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const checkSession = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/user', { 
        withCredentials: true 
      });
      setUser(data.user);
      localStorage.setItem('geo-username', data.user.username);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('geo-username');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
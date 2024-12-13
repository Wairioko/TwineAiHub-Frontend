import { createContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const navigate = useNavigate();

  // Check the user's authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_AWS_URL}/auth/status`, // Example endpoint
        { withCredentials: true }
      );
      
      const { authToken, idToken } = response.data;

      if (authToken && idToken) {
        setIsAuthenticated(true);
        setAuthToken(authToken);
        setIdToken(idToken);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setIsAuthenticated(false);
    }
  };

  // Log out the user and clear auth state
  const logout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_AWS_URL}/auth/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      setAuthToken(null);
      setIdToken(null);
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Run on component mount to verify authentication
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authToken,
        idToken,
        checkAuthStatus,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;

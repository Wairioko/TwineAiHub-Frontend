import { createContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const checkAuthStatus = useCallback(async () => {
        try {
            
            const response = await axios.get('https://2tzlahwab9.execute-api.us-east-1.amazonaws.com/dev/auth/status', {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                }
            });

            const data = await response.json();
     
            if (response.ok && data.isAuthenticated || data.isSubscribed) {
                setIsSubscribed(true)
                setIsAuthenticated(true);
                setUser(data.user);
                setLoading(false);
                
                // Check if we're on the callback route
                if (window.location.pathname === '/google/auth/callback') {
                    navigate('/');
                }
            } else {
                setIsAuthenticated(false);
                setIsSubscribed(false)
                setUser(null);
                setLoading(false);
                
               
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsAuthenticated(false);
            setIsSubscribed(false);
            setUser(null);
            setLoading(false);
            
            // Only redirect to login if not already there and not on callback route
            if (window.location.pathname !== '/' && 
                window.location.pathname !== '/') {
                navigate('/');
            }
        }
    }, [navigate]);

    // Separate function to handle initial auth check
    const initialAuthCheck = useCallback(async () => {
        await checkAuthStatus();
    }, [checkAuthStatus]);

    useEffect(() => {
        initialAuthCheck();
    }, [initialAuthCheck]);

    const handleLogout = useCallback(async () => {
        try {
            await axios.get(' https://2tzlahwab9.execute-api.us-east-1.amazonaws.com/dev/auth/logout', {
                withCredentials: true,
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            setIsSubscribed(false);
            navigate('/');
        }
    }, [navigate]);

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            handleLogout,
            checkAuthStatus
        }}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthProvider;


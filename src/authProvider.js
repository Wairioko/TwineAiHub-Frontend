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

    const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_AWS_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
    });

    // Add request interceptor for debugging
    axiosInstance.interceptors.request.use(
    config => {
        console.log('Request config:', config);
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
    );

    // Add response interceptor for debugging
    axiosInstance.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Response error:', error);
        if (error.response) {
        console.error('Error response:', error.response);
        }
        return Promise.reject(error);
    }
    );


    const checkAuthStatus = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_AWS_URL}/auth/status`, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
    
            const data = response.data;

         
            // Update auth status based on response data
            if (data.isAuthenticated || data.isSubscribed) {
                setIsSubscribed(data.isSubscribed);
                setIsAuthenticated(true);
                setUser(data.user);
            } else {
                setIsAuthenticated(false);
                setIsSubscribed(false);
                setUser(null);
            }
    
            setLoading(false);
    
            
            navigate('/');
            
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsAuthenticated(false);
            setIsSubscribed(false);
            setUser(null);
            setLoading(false);

        }
    }, []);
    

    // Separate function to handle initial auth check
    const initialAuthCheck = useCallback(async () => {
        await checkAuthStatus();
    }, [checkAuthStatus]);

    useEffect(() => {
        initialAuthCheck();
    }, [initialAuthCheck]);

    const handleLogout = useCallback(async () => {
        try {
            await axios.post(`${process.env.REACT_APP_AWS_URL}/auth/logout`, {}, {
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


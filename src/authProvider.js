import { createContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const checkAuthStatus = useCallback(async () => {
        try {
            console.log('Checking auth status...'); // Debugging log
            const response = await fetch('http://localhost:4000/auth/status', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });

            const data = await response.json();
            console.log('Auth status response:', data); // Debugging log

            if (response.ok && data.isAuthenticated) {
                setIsAuthenticated(true);
                setUser(data.user);
                setLoading(false);
                
                // Check if we're on the callback route
                if (window.location.pathname === '/google/auth/callback') {
                    navigate('/');
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                
                // Only redirect to login if not already there and not on callback route
                if (window.location.pathname !== '/login' && 
                    window.location.pathname !== '/google/auth/callback') {
                    navigate('/login');
                }
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);
            
            // Only redirect to login if not already there and not on callback route
            if (window.location.pathname !== '/login' && 
                window.location.pathname !== '/google/auth/callback') {
                navigate('/login');
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
            await fetch('http://localhost:4000/auth/logout', {
                method: 'GET',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsAuthenticated(false);
            setUser(null);
            navigate('/login');
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


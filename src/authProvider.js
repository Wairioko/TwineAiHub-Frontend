import React, { createContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('persist:root');
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000;
                    if (decodedToken.exp < currentTime) {
                        handleLogout();
                    } else {
                        setIsAuthenticated(true);
                    }
                } catch (error) {
                    console.error('Invalid token:', error);
                    handleLogout();
                }
            } else {
                setIsAuthenticated(false);
            }
        };

        checkToken();

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const timeUntilExpiry = (decodedToken.exp * 1000) - Date.now();
                const timeoutId = setTimeout(checkToken, timeUntilExpiry);

                return () => clearTimeout(timeoutId);
            } catch (error) {
                console.error('Token decode error:', error);
            }
        }
    }, [handleLogout]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

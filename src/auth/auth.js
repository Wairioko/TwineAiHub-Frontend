import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../src/authProvider';

import Cookies from 'js-cookie';

const GoogleCallback = () => {
    const { checkAuthStatus } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if the authentication cookies are set
        const authToken = Cookies.get('authToken');
        const refreshToken = Cookies.get('refreshToken');

        if (authToken && refreshToken) {
            // Tokens are set, check the authentication status
            checkAuthStatus()
                .then(() => {
                    navigate('/');
                })
                .catch((error) => {
                    console.error('Authentication check failed:', error);
                    navigate('/login');
                });
        } else {
            // Tokens not found, redirect to login
            navigate('/login');
        }
    }, [checkAuthStatus, navigate]);

    return <div>Completing authentication...</div>;
};

export default GoogleCallback;

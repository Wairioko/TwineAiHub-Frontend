import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../src/authProvider';
import { useAuth } from 'react-oidc-context'


const GoogleCallback = () => {
    const { checkAuthStatus } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(location.search);
            const status = params.get('status');

            if (status === 'success') {
                try {
                    await checkAuthStatus();
                    navigate('/');
                } catch (error) {
                    console.error('Callback error:', error);
                    navigate('/login');
                }
            } else {
                navigate('/login');
            }
        };

        handleCallback();
    }, [checkAuthStatus, navigate, location]);

    return <div>Completing authentication...</div>;
};

export default GoogleCallback;




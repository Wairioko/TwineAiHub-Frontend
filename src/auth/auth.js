import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../src/authProvider';

const GoogleCallback = () => {
    const { checkAuthStatus } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

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




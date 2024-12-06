import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../src/authProvider';
import Cookies from 'js-cookie';


const GoogleCallback = () => {
    const { checkAuthStatus } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const handleCallback = async () => {
        const params = new URLSearchParams(location.search);
        const authCode = params.get('code');  // Extract the 'code' from the URL
  
        if (authCode) {
          try {
            // Send the authorization code to your backend to exchange for tokens
            const response = await axios.post(
              `${process.env.REACT_APP_AWS_URL}/auth/google/callback`, 
              { code: authCode },
              { 
                withCredentials: true, // Important for handling cookies from the server
                headers: {
                  'Content-Type': 'application/json',
                }
              }
            );
            
          // Check the response status and data
          if (response.data.status === 'success') {
            // Tokens are set by the server, attempt to check authentication status
            try {
              await checkAuthStatus();
              navigate('/');
            } catch (error) {
              console.error('Authentication check failed:', error);
              navigate('/login');
            }
          } else {
            // Response indicates authentication failure
            console.error('Authentication failed:', response.data.message);
            navigate('/login');
          }
          } catch (error) {
            console.error('Error during token exchange:', error);
            navigate('/login');
          }
        }
      };
  
      handleCallback();
    }, [location.search, navigate, checkAuthStatus]);
  
    return <div>Completing authentication...</div>;
  };
  
  export default GoogleCallback;
import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../src/authProvider';
import axios from 'axios';

const GoogleCallback = () => {
  const [componentState, setComponentState] = useState({
    isLoading: true,
    authCode: null,
    error: null,
    backendUrl: process.env.REACT_APP_AWS_URL
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthStatus } = useContext(AuthContext);

  useEffect(() => {
    // Debugging: Log entire location object
    console.group('GoogleCallback Debug Information');
    console.log('Full Location Object:', location);
    console.log('Backend URL:', process.env.REACT_APP_AWS_URL);

    // Extract authorization code
    const params = new URLSearchParams(location.search);
    const authCode = params.get('code');

    console.log('Extracted Authorization Code:', authCode);
    console.log('Location Search String:', location.search);

    // Update component state with authorization code
    setComponentState(prev => ({
      ...prev,
      authCode,
      isLoading: !!authCode
    }));

    // Perform authentication if code exists
    const performAuthentication = async () => {
      if (!authCode) {
        console.error('No authorization code found');
        setComponentState(prev => ({
          ...prev,
          isLoading: false,
          error: 'No authorization code found'
        }));
        navigate('/login');
        return;
      }

      try {
        console.log('Attempting to send POST request to:', 
          `${process.env.REACT_APP_AWS_URL}/auth/google/callback`
        );

        // Configure axios for detailed logging
        axios.interceptors.request.use(request => {
          console.log('Starting Request:', {
            url: request.url,
            method: request.method,
            data: request.data
          });
          return request;
        });

        const response = await axios.post(
          `${process.env.REACT_APP_AWS_URL}/auth/google/callback`, 
          { code: authCode },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 10000  // 10 seconds timeout
          }
        );

        console.log('Full Server Response:', response);
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);

        if (response.data.status === 'success') {
          try {
            await checkAuthStatus();
            navigate('/');
          } catch (authError) {
            console.error('Authentication check failed:', authError);
            setComponentState(prev => ({
              ...prev,
              isLoading: false,
              error: 'Authentication check failed'
            }));
            navigate('/login');
          }
        } else {
          console.error('Authentication failed:', response.data.message);
          setComponentState(prev => ({
            ...prev,
            isLoading: false,
            error: response.data.message || 'Authentication failed'
          }));
          navigate('/login');
        }
      } catch (error) {
        console.group('Detailed Error Information');
        console.error('Error during token exchange:', error);
        
        // Axios error details
        if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Server Response Error:', {
            data: error.response.data,
            status: error.response.status,
            headers: error.response.headers
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No Response Received:', error.request);
        } else {
          // Something happened in setting up the request
          console.error('Request Setup Error:', error.message);
        }
        console.groupEnd();

        setComponentState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Error during authentication'
        }));
        navigate('/login');
      }
    };

    performAuthentication();
    console.groupEnd();
  }, [location.search, navigate, checkAuthStatus]);

  // Render loading state
  if (componentState.isLoading) {
    return (
      <div className="callback-container">
        <div className="loading-spinner"></div>
        <p>Authenticating... Please wait</p>
        {componentState.authCode && (
          <small>Authorization code: {componentState.authCode.slice(0, 10)}...</small>
        )}
      </div>
    );
  }

  // Render error state
  if (componentState.error) {
    return (
      <div className="callback-container error">
        <h2>Authentication Error</h2>
        <p>{componentState.error}</p>
        <button onClick={() => navigate('/login')}>Return to Login</button>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
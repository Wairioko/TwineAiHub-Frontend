import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../src/authProvider';
import axios from 'axios';

const GoogleCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { checkAuthStatus } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const authCode = params.get('code');

        if (authCode) {
          try {
            const response = await axios.post(
              `${process.env.REACT_APP_AWS_URL}/auth/google/callback`,
              { code: authCode },
              {
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/json',
                }
              }
            );

            if (response.data.status === 'success') {
              await checkAuthStatus();
              navigate('/');
            } else {
              setError('Authentication failed');
              navigate('/login');
            }
          } catch (serverError) {
            setError('Server error during authentication');
            console.error('Server request error:', serverError);
            navigate('/login');
          }
        } else {
          setError('No authorization code found');
          navigate('/login');
        }
      } catch (error) {
        setError('Unexpected error in callback');
        console.error('Unexpected error:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [location.search, navigate, checkAuthStatus]);

  if (isLoading) {
    return (
      <div className="callback-container">
        <div className="loading-spinner"></div>
        <p>Completing authentication...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="callback-container error">
        <p>{error}</p>
      </div>
    );
  }

  return null;
};

export default GoogleCallback;
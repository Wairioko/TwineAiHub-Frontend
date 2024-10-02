import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';


const GoogleCallbackHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    try{
      if(token){
          // Store the token in local storage
        localStorage.setItem('token', token);
        // Redirect to the home page
        navigate('/');

      }
      
    }catch(err){
      // Handle error if token is not found
      console.error('Authentication failed', err);
      navigate('/login');
    };

  }, [navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallbackHandler;


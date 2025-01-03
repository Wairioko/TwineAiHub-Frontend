import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
import { AuthContext } from "../../authProvider";
import { useContext } from "react";


export const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { checkAuthStatus } = useContext(AuthContext);


  const handleGoogleLogin = () => {
    // Initialize Google Sign-In
    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Your Google Client ID
      callback: handleCredentialResponse
    });

    // Prompt the Google Sign-In dialog
    window.google.accounts.id.prompt();
  };

  const handleCredentialResponse = async (response) => {
    try {
      // Send the ID token to your backend
      const serverResponse = await axios.post(
        `${process.env.REACT_APP_AWS_URL}/auth/google`, 
        { 
          tokenId: response.credential 
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true 
        }
      );

      
      if(serverResponse.status === 200) {
        await checkAuthStatus() 
         //navigate to a dashboard or home page
        navigate('/');

      }

          
    
     
    } catch (error) {
      // Handle login error
      console.error('Google Sign-In Error:', error.response ? error.response.data : error);
      
      // Optionally show an error message to the user
      alert('Failed to sign in. Please try again.');
    }
  };

  // Add Google Sign-In script on component mount
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Configure Google Sign-In
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
      });

      // Optional: Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { theme: 'outline', size: 'large' }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <button 
      id="googleSignInButton" 
      className="form-group-btn-google" 
      onClick={handleGoogleLogin}
    >
      <span className="social-logo-wrapper">
        <img className="social-logo" src="/src/google-logo.png" alt="Google logo" />
      </span>
      <span className="social-text">Continue with Google</span>
    </button>
  );
};


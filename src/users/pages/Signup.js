import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from "../service/userServices"
import { useAuth } from 'react-oidc-context';
import axios from 'axios';



const GoogleLoginButton = () => {
  const handleGoogleLogin = async () => {
    try {
      // Open Google's OAuth screen in a popup or redirect the user
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();

      // Extract the ID token
      const idToken = googleUser.getAuthResponse().id_token;

      // Send the ID token to your backend
      const response = await axios.post(
        `${process.env.REACT_APP_AWS_URL}/auth/google`,
        { idToken },
        { withCredentials: true } // Ensures cookies from the backend are stored in the browser
      );

      // Handle response
      if (response.status === 200) {
        console.log('Login successful:', response.data);
        // Navigate to a protected page or update the app state
        window.location.href = '/dashboard';
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        console.error('Google login failed:', error.response.data.message);
      } else {
        console.error('Google login error:', error.message);
      }
    }
  };

  return (
    <button className="signup-btn" onClick={handleGoogleLogin}>
      <span className="social-logo-wrapper">
        <img className="social-logo" src="/src/google-logo.svg" alt="Google logo" />
      </span>
      <span className="social-text">Continue with Google</span>
    </button>
  );
};


const SignupPage = () => {
  const navigate = useNavigate();

  const redirectToEmailSignup = () => {
    navigate('/signup-email');
  };

  return (
    <div className="signup-options-container">
      <div className="signup-card">
        <h2>Sign Up</h2>
        <div className="signup-options">
          <button className="signup-btn" onClick={redirectToEmailSignup}>
            Register with Email
          </button>
          
          <div className="separator">OR</div>

          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};


export default SignupPage;


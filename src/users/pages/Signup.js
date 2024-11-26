import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from "../service/userServices"
import axios from 'axios';


export const GoogleLoginButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      // Making the GET request to your Lambda function
      const response = await axios.get(`${process.env.REACT_APP_AWS_URL}/auth/google`, {
        withCredentials: true, // Include cookies in the request
      });
  
      // If the response is successful, perform the redirection
      if (response.status === 200) {
    
        window.location.href = "/"
      } else {
        console.error('Failed to redirect to Google login.');
      }
    } catch (error) {
      console.error('Error initiating Google login:', error);
    }
  };
  
  

  return (
    <button className="signup-btn" onClick={handleGoogleSignIn}>
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


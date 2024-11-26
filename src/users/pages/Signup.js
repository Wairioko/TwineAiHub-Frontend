import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useGoogleLogin } from "../service/userServices"

export const GoogleLoginButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_AWS_URL}/auth/google`, {
        method: 'GET',
        credentials: 'include', // Include cookies in the request
      });
      if (response.ok) {
        const redirectURL = await response.text();
        window.location.href = redirectURL;
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


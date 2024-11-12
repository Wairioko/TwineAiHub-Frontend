import React from 'react';
import { useNavigate } from 'react-router-dom';

export const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'https://2tzlahwab9.execute-api.us-east-1.amazonaws.com/dev/auth/google';
  };

  return (
    <button className="signup-btn" onClick={handleGoogleLogin}>
      <span className="social-logo-wrapper">
        <img className="social-logo" src="/assets/google-logo-NePEveMl.svg" alt="Google logo" />
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


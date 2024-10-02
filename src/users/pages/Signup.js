import React from 'react';
import {useNavigate} from 'react-router-dom'


export const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    
    window.location.href = 'http://localhost:4000/auth/google';   
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



// AppleLoginButton remains the same; implement your own logic here
export const AppleLoginButton = () => {
  const handleAppleLogin = () => {
    // Add Apple login logic here
    console.log('Apple login clicked');
  };

  return (
    <button className="signup-btn" onClick={handleAppleLogin}>
      <span className="social-logo-wrapper">
        <img className="social-logo" src="/public/apple-logo-tAoxPOUx.png" alt="Apple logo" />
      </span>
      <span className="social-text">Continue with Apple</span>
    </button>
  );
};

const SignupPage = () => {
  const navigate = useNavigate();

  const redirectToEmailSignup = () => {
    navigate('/signup-email'); // Redirect to email signup form
  };

  return (
    <div className="signup-options-container">
      <h2>Sign Up</h2>

      <div className="signup-options">
        <button className="signup-btn" onClick={redirectToEmailSignup}>
          Register with Email
        </button>

        {/* Use GoogleLoginButton as a component */}
        <GoogleLoginButton />

        {/* Use AppleLoginButton as a component */}
        <AppleLoginButton />
      </div>
    </div>
  );
};

export default SignupPage;

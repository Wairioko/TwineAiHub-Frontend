import React from "react";
import { UseLogin } from "../hooks/useLogin";
import { useState } from "react";

export const GoogleLoginButton = () => {
    const handleGoogleSignIn = () => {
        // Redirect to Google OAuth URL
        window.location.href = "http://localhost:4000/auth/google";
    };
    
    return (
      <button className="signup-btn" onClick={handleGoogleSignIn}>
        <span className="social-logo-wrapper">
          <img className="social-logo" src="/assets/google-logo.svg" alt="Google logo" />
        </span>
        <span className="social-text">Sign in with Google</span>
      </button>
    );
};

  


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
        <span className="social-text">Login with Apple</span>
      </button>
    );
  };
  





export const LoginPage = () => {
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        isLoading,
        handleSubmit,
    } = UseLogin();

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="login-container">
            <div className="login">
                <h1 className="header">Login</h1>

                {error && <div className="error">{error}</div>}  {/* Display error */}
                {isLoading && <div className="loading">Loading...</div>}  {/* Loading state */}

                <form onSubmit={handleSubmit} className="login-form">
                    <div>
                        <label className="email-label">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="email-input"
                            required
                        />
                    </div>
                    <div className="password-field">
                        <label className="password-label">Password:</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="password-input"
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="submit-btn"
                        >
                            Login
                        </button>
                    </div>
                    
                </form>
                <div className="signup-options">
       
                    {/* Use GoogleLoginButton as a component */}
                    <GoogleLoginButton />

                    {/* Use AppleLoginButton as a component */}
                    <AppleLoginButton />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

import React from "react";
import { UseLogin } from "../hooks/useLogin";
import { useState } from "react";
import axios from "axios";


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
        <span className="social-text">Sign in with Google</span>
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

                {error && <div className="error">{error}</div>}  
                {isLoading && <div className="loading">Loading...</div>}  

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
                <span className="login-span">Or Continue With</span>
                    {/* Use GoogleLoginButton as a component */}
                    <GoogleLoginButton />

                   
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

